import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth/signup" && request.method === "POST") {
      return this.handleSignup(request);
    }
    if (url.pathname === "/api/auth/signin" && request.method === "POST") {
      return this.handleSignin(request);
    }
    if (url.pathname === "/api/leaderboard" && request.method === "GET") {
      return this.handleLeaderboardGet(request);
    }
    if (url.pathname === "/api/leaderboard" && request.method === "POST") {
      return this.handleLeaderboardPost(request);
    }
    if (url.pathname === "/api/progress" && request.method === "GET") {
      return this.handleProgressGet(request);
    }
    if (url.pathname === "/api/progress" && request.method === "POST") {
      return this.handleProgressPost(request);
    }
    if (url.pathname === "/api/stats" && request.method === "GET") {
      return this.handleStatsGet(request);
    }
    if (url.pathname === "/api/feedback" && request.method === "POST") {
      return this.handleFeedbackPost(request);
    }
    if (url.pathname === "/api/define" && request.method === "GET") {
      return this.handleDefine(request);
    }
    if (url.pathname === "/api/report-word" && request.method === "POST") {
      return this.handleReportWord(request);
    }
    if (url.pathname === "/api/submit-word" && request.method === "POST") {
      return this.handleSubmitWord(request);
    }

    const assetResponse = await this.env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      return new HTMLRewriter()
        .on("head", {
          element(element) {
            element.append(AUTH_CSS, { html: true });
          },
        })
        .on(".header-actions", {
          element(element) {
            element.append(AUTH_ICON_HTML, { html: true });
          },
        })
        .on("body", {
          element(element) {
            element.append(AUTH_MODAL_HTML, { html: true });
          },
        })
        .transform(assetResponse);
    }

    return assetResponse;
  }

  async ensureLeaderboardTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS leaderboard_scores (
          player_id TEXT NOT NULL,
          name TEXT NOT NULL,
          date TEXT NOT NULL,
          score INTEGER NOT NULL DEFAULT 0,
          words INTEGER NOT NULL DEFAULT 0,
          pangrams INTEGER NOT NULL DEFAULT 0,
          max_score INTEGER NOT NULL DEFAULT 0,
          updated_at TEXT DEFAULT (datetime('now')),
          PRIMARY KEY (player_id, date)
        )`
      )
      .run();
  }

  async handleLeaderboardGet(request) {
    try {
      await this.ensureLeaderboardTable();
      const url = new URL(request.url);
      const date = url.searchParams.get("date");
      if (!date) {
        return json({ error: "date query param required" }, 400);
      }

      const today = await this.env.GAME_HISTORY
        .prepare(
          `SELECT player_id AS playerId, name, score, words, pangrams
           FROM leaderboard_scores
           WHERE date = ?
           ORDER BY score DESC
           LIMIT 100`
        )
        .bind(date)
        .all();

      const allTime = await this.env.GAME_HISTORY
        .prepare(
          `SELECT
             l1.player_id AS playerId,
             (SELECT name FROM leaderboard_scores l2
                WHERE l2.player_id = l1.player_id
                ORDER BY date DESC LIMIT 1) AS name,
             SUM(l1.score) AS score,
             COUNT(DISTINCT l1.date) AS days
           FROM leaderboard_scores l1
           GROUP BY l1.player_id
           ORDER BY score DESC
           LIMIT 100`
        )
        .all();

      return json({
        today: today.results || [],
        allTime: allTime.results || [],
      }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }

  async handleLeaderboardPost(request) {
    try {
      await this.ensureLeaderboardTable();
      const { playerId, name, date, score, words, pangrams, maxScore } =
        await request.json();

      if (!playerId || !name || !date) {
        return json({ error: "playerId, name, and date required" }, 400);
      }

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO leaderboard_scores
             (player_id, name, date, score, words, pangrams, max_score)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(player_id, date) DO UPDATE SET
             name = excluded.name,
             score = excluded.score,
             words = excluded.words,
             pangrams = excluded.pangrams,
             max_score = excluded.max_score,
             updated_at = datetime('now')`
        )
        .bind(
          playerId,
          name,
          date,
          score || 0,
          words || 0,
          pangrams || 0,
          maxScore || 0
        )
        .run();

      const today = await this.env.GAME_HISTORY
        .prepare(
          `SELECT player_id AS playerId, name, score, words, pangrams
           FROM leaderboard_scores
           WHERE date = ?
           ORDER BY score DESC
           LIMIT 100`
        )
        .bind(date)
        .all();

      const allTime = await this.env.GAME_HISTORY
        .prepare(
          `SELECT
             l1.player_id AS playerId,
             (SELECT name FROM leaderboard_scores l2
                WHERE l2.player_id = l1.player_id
                ORDER BY date DESC LIMIT 1) AS name,
             SUM(l1.score) AS score,
             COUNT(DISTINCT l1.date) AS days
           FROM leaderboard_scores l1
           GROUP BY l1.player_id
           ORDER BY score DESC
           LIMIT 100`
        )
        .all();

      /*
        Stats and badges only apply to signed-in accounts
        (playerId prefixed "acct:") — same rule as progress
        sync, since they need a stable identity across
        devices. Anonymous device play is unaffected.
      */
      let statsResult = null;

      if (playerId.startsWith("acct:")) {
        statsResult = await this.recomputeStatsAndBadges(playerId, date);
      }

      return json({
        today: today.results || [],
        allTime: allTime.results || [],
        stats: statsResult ? statsResult.stats : null,
        newBadges: statsResult ? statsResult.newBadges : [],
      }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }

  async ensureProgressTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS game_progress (
          player_id TEXT NOT NULL,
          date TEXT NOT NULL,
          found_words TEXT NOT NULL DEFAULT '[]',
          updated_at TEXT DEFAULT (datetime('now')),
          PRIMARY KEY (player_id, date)
        )`
      )
      .run();
  }

  /*
    Cross-device word progress is only stored for signed-in
    accounts (playerId prefixed "acct:"). Anonymous device
    play keeps working exactly as before, via localStorage
    only — there is nothing meaningful to key a server row
    on for an anonymous device id, so those requests are
    accepted but treated as a no-op.
  */
  async handleProgressGet(request) {
    try {
      await this.ensureProgressTable();
      const url = new URL(request.url);
      const playerId = url.searchParams.get("playerId");
      const date = url.searchParams.get("date");

      if (!playerId || !date) {
        return json({ error: "playerId and date query params required" }, 400);
      }
      if (!playerId.startsWith("acct:")) {
        return json({ found: [] }, 200);
      }

      const row = await this.env.GAME_HISTORY
        .prepare(
          `SELECT found_words FROM game_progress
           WHERE player_id = ? AND date = ?`
        )
        .bind(playerId, date)
        .first();

      let found = [];
      if (row && row.found_words) {
        try {
          const parsed = JSON.parse(row.found_words);
          if (Array.isArray(parsed)) found = parsed;
        } catch {
          found = [];
        }
      }

      return json({ found }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureProgressTable();
        return this.handleProgressGet(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async handleProgressPost(request) {
    try {
      await this.ensureProgressTable();
      const { playerId, date, found } = await request.json();

      if (!playerId || !date || !Array.isArray(found)) {
        return json({ error: "playerId, date, and found[] required" }, 400);
      }
      if (!playerId.startsWith("acct:")) {
        return json({ ok: true, skipped: true }, 200);
      }

      const cleaned = found
        .filter((word) => typeof word === "string")
        .slice(0, 500)
        .map((word) => word.slice(0, 40));

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO game_progress (player_id, date, found_words)
           VALUES (?, ?, ?)
           ON CONFLICT(player_id, date) DO UPDATE SET
             found_words = excluded.found_words,
             updated_at = datetime('now')`
        )
        .bind(playerId, date, JSON.stringify(cleaned))
        .run();

      return json({ ok: true }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureProgressTable();
        return this.handleProgressPost(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  /* ---------------------------------------------------------
     STATS & BADGES

     player_stats is fully recomputed (never incrementally
     added to) from leaderboard_scores on every sync, so it
     can't drift out of sync with the source of truth — no
     matter how many times a day gets re-synced.

     badge_definitions is data, not code: new tiers or badge
     categories can be added later with a plain D1 INSERT,
     no deploy required. player_badges is append-only — once
     a badge is earned it is never removed, even if a later
     row raises that badge's threshold.

     Only signed-in accounts (playerId prefixed "acct:") get
     stats/badges, matching progress sync, since both need a
     stable identity across devices.
  --------------------------------------------------------- */

  /*
    Mirrors the RANKS array in the game's own HTML (Section
    3, "RANKS"). Only used here to work out the best daily
    rank a player has ever reached, for rank-based badges.
    If the game's RANKS thresholds/names ever change, update
    this copy to match — there is no shared module between
    the worker and the client HTML to keep them in sync
    automatically.
  */
  rankThresholds() {
    return [
      { name: "Prinsipiante", threshold: 0 },
      { name: "Bon Kuminsá", threshold: 0.05 },
      { name: "Bon", threshold: 0.10 },
      { name: "Bon Bon", threshold: 0.20 },
      { name: "Bunita", threshold: 0.30 },
      { name: "Grandi", threshold: 0.40 },
      { name: "Eksèlente", threshold: 0.55 },
      { name: "Formidabel", threshold: 0.70 },
      { name: "Konosedó", threshold: 1 },
    ];
  }

  rankIndexForRatio(ratio) {
    const ranks = this.rankThresholds();
    let index = 0;
    for (let i = 0; i < ranks.length; i++) {
      if (ratio >= ranks[i].threshold) index = i;
    }
    return index;
  }

  previousDateStr(dateStr) {
    const d = new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  async ensureStatsTables() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS player_stats (
          player_id TEXT PRIMARY KEY,
          total_score INTEGER NOT NULL DEFAULT 0,
          total_words INTEGER NOT NULL DEFAULT 0,
          total_pangrams INTEGER NOT NULL DEFAULT 0,
          days_played INTEGER NOT NULL DEFAULT 0,
          perfect_days INTEGER NOT NULL DEFAULT 0,
          current_streak INTEGER NOT NULL DEFAULT 0,
          longest_streak INTEGER NOT NULL DEFAULT 0,
          best_rank_index INTEGER NOT NULL DEFAULT 0,
          best_rank_name TEXT NOT NULL DEFAULT 'Prinsipiante',
          updated_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();

    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS badge_definitions (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          threshold_type TEXT NOT NULL,
          threshold_value INTEGER NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0
        )`
      )
      .run();

    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS player_badges (
          player_id TEXT NOT NULL,
          badge_id TEXT NOT NULL,
          earned_at TEXT DEFAULT (datetime('now')),
          PRIMARY KEY (player_id, badge_id)
        )`
      )
      .run();

    await this.seedBadgeDefinitions();
  }

  /*
    INSERT OR IGNORE — safe to run on every request. Adding
    a new badge later, or a whole new category, is a plain
    row insert here (or directly in D1), never an app update.
  */
  async seedBadgeDefinitions() {
    const badges = [
      // --- streak ---
      ["streak_bronze", "streak", "Bon Trabou!", "Hunga 3 dia sigui.", "longest_streak", 3, 10],
      ["streak_silver", "streak", "Masha Bon!", "Hunga 7 dia sigui.", "longest_streak", 7, 11],
      ["streak_gold", "streak", "Dushi!", "Hunga 30 dia sigui.", "longest_streak", 30, 12],
      ["streak_platinum", "streak", "Kandela!", "Hunga 100 dia sigui.", "longest_streak", 100, 13],

      // --- performance ---
      ["perfect_day_1", "performance", "Perfekshonista", "Haña tur palabra den un wega.", "perfect_days", 1, 20],
      ["perfect_day_5", "performance", "Perfekshonista di Bronse", "Haña tur palabra 5 biaha.", "perfect_days", 5, 21],
      ["perfect_day_25", "performance", "Perfekshonista di Oro", "Haña tur palabra 25 biaha.", "perfect_days", 25, 22],
      ["words_100", "performance", "Sentenario", "Haña 100 palabra na total.", "total_words", 100, 23],
      ["words_500", "performance", "Konosedó di Palabra", "Haña 500 palabra na total.", "total_words", 500, 24],
      ["words_2000", "performance", "Maestro di Palabra", "Haña 2000 palabra na total.", "total_words", 2000, 25],
      ["pangram_10", "performance", "Kasadó di Pangrama", "Haña 10 pangrama na total.", "total_pangrams", 10, 26],
      ["pangram_50", "performance", "Rei di Pangrama", "Haña 50 pangrama na total.", "total_pangrams", 50, 27],
      ["score_10000", "performance", "Leyenda", "Ranka 10,000 punto na total.", "total_score", 10000, 28],

      // --- rank (best single-day rank ever reached) ---
      ["rank_eksèlente", "rank", "Eksèlente", "Yega rango Eksèlente den un wega.", "best_rank_index", 6, 30],
      ["rank_formidabel", "rank", "Formidabel", "Yega rango Formidabel den un wega.", "best_rank_index", 7, 31],
      ["rank_konosedo", "rank", "Konosedó", "Haña 100% den un wega.", "best_rank_index", 8, 32],
    ];

    for (const row of badges) {
      await this.env.GAME_HISTORY
        .prepare(
          `INSERT OR IGNORE INTO badge_definitions
             (id, category, name, description, threshold_type, threshold_value, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(...row)
        .run();
    }
  }

  /*
    Recomputes player_stats from scratch off leaderboard_scores
    (never incrementally), then evaluates every badge_definitions
    row against the fresh stats and inserts any newly-earned
    badges. Returns the fresh stats plus only the badges that
    were newly earned by this call (for a "new badge!" toast),
    not the player's full trophy case.
  */
  async recomputeStatsAndBadges(playerId, date) {
    await this.ensureStatsTables();

    const rows = await this.env.GAME_HISTORY
      .prepare(
        `SELECT date, score, words, pangrams, max_score AS maxScore
         FROM leaderboard_scores
         WHERE player_id = ?
         ORDER BY date ASC`
      )
      .bind(playerId)
      .all();

    const days = rows.results || [];

    let totalScore = 0;
    let totalWords = 0;
    let totalPangrams = 0;
    let perfectDays = 0;
    let bestRankIndex = 0;

    const dateSet = new Set();

    days.forEach((day) => {
      totalScore += day.score || 0;
      totalWords += day.words || 0;
      totalPangrams += day.pangrams || 0;

      if (day.maxScore > 0 && day.score === day.maxScore) {
        perfectDays++;
      }

      const ratio = day.maxScore > 0 ? day.score / day.maxScore : 0;
      bestRankIndex = Math.max(bestRankIndex, this.rankIndexForRatio(ratio));

      dateSet.add(day.date);
    });

    const daysPlayed = dateSet.size;

    // Current streak: consecutive days ending at `date`.
    let currentStreak = 0;
    if (dateSet.has(date)) {
      currentStreak = 1;
      let cursor = date;
      while (dateSet.has(this.previousDateStr(cursor))) {
        cursor = this.previousDateStr(cursor);
        currentStreak++;
      }
    }

    // Longest streak: longest run anywhere in the history.
    const sortedDates = [...dateSet].sort();
    let longestStreak = 0;
    let run = 0;
    let prevDate = null;
    sortedDates.forEach((d) => {
      run = prevDate && this.previousDateStr(d) === prevDate ? run + 1 : 1;
      longestStreak = Math.max(longestStreak, run);
      prevDate = d;
    });

    const bestRankName = this.rankThresholds()[bestRankIndex].name;

    await this.env.GAME_HISTORY
      .prepare(
        `INSERT INTO player_stats
           (player_id, total_score, total_words, total_pangrams,
            days_played, perfect_days, current_streak, longest_streak,
            best_rank_index, best_rank_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(player_id) DO UPDATE SET
           total_score = excluded.total_score,
           total_words = excluded.total_words,
           total_pangrams = excluded.total_pangrams,
           days_played = excluded.days_played,
           perfect_days = excluded.perfect_days,
           current_streak = excluded.current_streak,
           longest_streak = excluded.longest_streak,
           best_rank_index = excluded.best_rank_index,
           best_rank_name = excluded.best_rank_name,
           updated_at = datetime('now')`
      )
      .bind(
        playerId,
        totalScore,
        totalWords,
        totalPangrams,
        daysPlayed,
        perfectDays,
        currentStreak,
        longestStreak,
        bestRankIndex,
        bestRankName
      )
      .run();

    const stats = {
      totalScore,
      totalWords,
      totalPangrams,
      daysPlayed,
      perfectDays,
      currentStreak,
      longestStreak,
      bestRankIndex,
      bestRankName,
    };

    const newBadges = await this.evaluateBadges(playerId, stats);

    return { stats, newBadges };
  }

  async evaluateBadges(playerId, stats) {
    const statValueFor = {
      longest_streak: stats.longestStreak,
      current_streak: stats.currentStreak,
      total_words: stats.totalWords,
      total_pangrams: stats.totalPangrams,
      total_score: stats.totalScore,
      perfect_days: stats.perfectDays,
      days_played: stats.daysPlayed,
      best_rank_index: stats.bestRankIndex,
    };

    const definitions = await this.env.GAME_HISTORY
      .prepare(`SELECT * FROM badge_definitions`)
      .all();

    const alreadyEarned = await this.env.GAME_HISTORY
      .prepare(`SELECT badge_id FROM player_badges WHERE player_id = ?`)
      .bind(playerId)
      .all();

    const earnedIds = new Set(
      (alreadyEarned.results || []).map((row) => row.badge_id)
    );

    const newlyEarned = [];

    for (const def of definitions.results || []) {
      if (earnedIds.has(def.id)) continue;

      const value = statValueFor[def.threshold_type];
      if (value === undefined) continue;

      if (value >= def.threshold_value) {
        await this.env.GAME_HISTORY
          .prepare(
            `INSERT INTO player_badges (player_id, badge_id)
             VALUES (?, ?)
             ON CONFLICT(player_id, badge_id) DO NOTHING`
          )
          .bind(playerId, def.id)
          .run();

        newlyEarned.push(def);
      }
    }

    return newlyEarned;
  }

  async handleStatsGet(request) {
    try {
      await this.ensureStatsTables();

      const url = new URL(request.url);
      const playerId = url.searchParams.get("playerId");

      if (!playerId) {
        return json({ error: "playerId query param required" }, 400);
      }
      if (!playerId.startsWith("acct:")) {
        return json({ stats: null, badges: [] }, 200);
      }

      const stats = await this.env.GAME_HISTORY
        .prepare(`SELECT * FROM player_stats WHERE player_id = ?`)
        .bind(playerId)
        .first();

      const badges = await this.env.GAME_HISTORY
        .prepare(
          `SELECT b.id, b.category, b.name, b.description, pb.earned_at
           FROM player_badges pb
           JOIN badge_definitions b ON b.id = pb.badge_id
           WHERE pb.player_id = ?
           ORDER BY b.sort_order ASC`
        )
        .bind(playerId)
        .all();

      return json({
        stats: stats || null,
        badges: badges.results || [],
      }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureStatsTables();
        return this.handleStatsGet(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async ensureFeedbackTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_id TEXT,
          name TEXT,
          category TEXT,
          message TEXT NOT NULL,
          date TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();
  }

  async handleFeedbackPost(request) {
    try {
      await this.ensureFeedbackTable();
      const { playerId, name, category, message, date } =
        await request.json();

      const text = (message || "").trim();

      if (!text) {
        return json({ error: "Skirbi algu prome ku manda" }, 400);
      }
      if (text.length > 2000) {
        return json({ error: "Komentario muy largu" }, 400);
      }

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO feedback
             (player_id, name, category, message, date)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          playerId || null,
          name || null,
          category || null,
          text,
          date || null
        )
        .run();

      return json({ ok: true }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureFeedbackTable();
        return this.handleFeedbackPost(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  /* ---------------------------------------------------------
     WORD REPORTS

     A player flagging an existing word/definition as wrong,
     offensive, nonsensical, or "other". Stored in D1 as a
     durable log, and emailed to Julia immediately so it
     doesn't require checking a database to notice.
  --------------------------------------------------------- */

  async ensureReportsTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS word_reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          word TEXT NOT NULL,
          reason TEXT NOT NULL,
          message TEXT,
          player_id TEXT,
          game_date TEXT,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();
  }

  async handleReportWord(request) {
    try {
      await this.ensureReportsTable();
      const { word, reason, message, playerId, date } = await request.json();

      const validReasons = ["wrong", "offensive", "nonsense", "other"];
      if (!word || !validReasons.includes(reason)) {
        return json({ error: "Data inkompletu òf inválido" }, 400);
      }

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO word_reports
             (word, reason, message, player_id, game_date)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          String(word).slice(0, 40),
          reason,
          String(message || "").slice(0, 500),
          playerId || null,
          date || null
        )
        .run();

      return json({ ok: true }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureReportsTable();
        return this.handleReportWord(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  /* ---------------------------------------------------------
     WORD SUBMISSIONS

     A player suggesting a word be added, adjusted, or
     removed — quick free-text, no structured fields. Also
     the landing spot for any future AI-drafted candidates
     from an offline batch script (tagged separately if that
     gets built later); for now every row here comes from a
     real player.
  --------------------------------------------------------- */

  async ensureSubmissionsTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS word_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          word TEXT NOT NULL,
          note TEXT NOT NULL,
          player_id TEXT,
          game_date TEXT,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();
  }

  async handleSubmitWord(request) {
    try {
      await this.ensureSubmissionsTable();
      const { type, word, note, playerId, date } = await request.json();

      const validTypes = ["add", "adjust", "remove"];
      if (!validTypes.includes(type) || !word || !note) {
        return json({ error: "Data inkompletu òf inválido" }, 400);
      }

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO word_submissions
             (type, word, note, player_id, game_date)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          type,
          String(word).slice(0, 40),
          String(note).slice(0, 500),
          playerId || null,
          date || null
        )
        .run();

      return json({ ok: true }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureSubmissionsTable();
        return this.handleSubmitWord(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  /*
    EMAIL DELIVERY — Cloudflare Email Routing.

    Setup required (one-time, in the Cloudflare dashboard):
    1. Email > Email Routing on your domain — enable it and
       verify juliettesjakshie248@gmail.com as a destination.
    2. In wrangler.jsonc, add:
         "send_email": [
           { "name": "NOTIFY", "destination_address": "juliettesjakshie248@gmail.com" }
         ]
    3. The FROM address below must be a mailbox on a domain
       YOU control through Email Routing (not gmail.com) —
       Cloudflare only relays outbound mail for domains you've
       verified.

    If Email Routing setup is fiddly, swap this method's body
    for the Resend version instead (see notes further below in
    this file's git history / the worker_additions.js reference
    — third-party API, works immediately with any from/to,
    needs RESEND_API_KEY as a secret).

    Failures here are swallowed on purpose — a broken email
    should never block the actual D1 write, which already
    succeeded by the time this runs.
  */
  async sendNotificationEmail(subject, text) {
    try {
      const { EmailMessage } = await import("cloudflare:email");
      const raw =
        `From: Palabra di Kòrsou <notify@palabradikorsou.com>\r\n` +
        `To: juliettesjakshie248@gmail.com\r\n` +
        `Subject: ${subject}\r\n` +
        `Content-Type: text/plain; charset=utf-8\r\n\r\n${text}`;
      const message = new EmailMessage(
        "notify@palabradikorsou.com",
        "juliettesjakshie248@gmail.com",
        raw
      );
      await this.env.NOTIFY.send(message);
    } catch (e) {
      console.error("Email send failed:", e);
    }
  }

  /*
    WEEKLY DIGEST — Cron Trigger, not called by any request.

    Setup required in wrangler.jsonc:
      "triggers": { "crons": ["0 13 * * 1"] }
    (13:00 UTC every Monday = 9am AST/Curaçao time. Adjust the
    cron string for a different day/time — cron field order is
    minute hour day-of-month month day-of-week.)

    Pulls every still-pending report/submission, sends ONE
    email listing all of them, then marks those rows
    'digested' so they don't get re-listed next week. They
    stay in D1 either way — 'digested' just means "already
    surfaced to Julia," not "resolved." Actually applying a
    suggestion still means writing the definition into
    index.html and merging it, same as every other batch.
  */
  async scheduled(controller) {
    try {
      await this.ensureReportsTable();
      await this.ensureSubmissionsTable();

      const reports = await this.env.GAME_HISTORY
        .prepare(
          `SELECT word, reason, message, game_date, created_at
           FROM word_reports WHERE status = 'pending'
           ORDER BY created_at ASC`
        )
        .all();

      const submissions = await this.env.GAME_HISTORY
        .prepare(
          `SELECT type, word, note, game_date, created_at
           FROM word_submissions WHERE status = 'pending'
           ORDER BY created_at ASC`
        )
        .all();

      const reportRows = reports.results || [];
      const submissionRows = submissions.results || [];

      if (reportRows.length === 0 && submissionRows.length === 0) {
        return;
      }

      const typeLabels = { add: "AGREGÁ", adjust: "AHUSTÁ", remove: "KITA" };
      let text = `Resúmen simanal — Palabra di Kòrsou\n\n`;

      if (submissionRows.length) {
        text += `SUGERENSIA (${submissionRows.length}):\n`;
        submissionRows.forEach((row, i) => {
          const label = typeLabels[row.type] || row.type;
          text += `${i + 1}. [${label}] "${row.word}" — ${row.note}\n`;
        });
        text += `\n`;
      }

      if (reportRows.length) {
        text += `RAPÒRT (${reportRows.length}):\n`;
        reportRows.forEach((row, i) => {
          const detail = row.message ? `: ${row.message}` : "";
          text += `${i + 1}. "${row.word}" — ${row.reason}${detail}\n`;
        });
      }

      await this.sendNotificationEmail(
        `[Palabra di Kòrsou] Resúmen simanal (${submissionRows.length + reportRows.length} pendiente)`,
        text
      );

      await this.env.GAME_HISTORY
        .prepare(`UPDATE word_reports SET status = 'digested' WHERE status = 'pending'`)
        .run();

      await this.env.GAME_HISTORY
        .prepare(`UPDATE word_submissions SET status = 'digested' WHERE status = 'pending'`)
        .run();

    } catch (e) {
      console.error("Weekly digest failed:", e);
    }
  }

  async ensureGlossaryTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS word_glossary (
          word TEXT PRIMARY KEY,
          display TEXT,
          tags TEXT,
          definition TEXT,
          example TEXT,
          english TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();

    // Idempotent: adding a column that already exists throws,
    // which is swallowed.
    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE word_glossary ADD COLUMN source TEXT DEFAULT 'claude'")
        .run();
    } catch {
      // column already exists
    }
  }

  /*
    Auto-writes the glossary as new words show up in puzzles.
    On the first request for a word, Claude drafts:
    - a short Papiamentu definition
    - one natural example
    - a concise English translation

    Grammatical labels such as "Sustantivo" are intentionally
    no longer generated because they are not necessary for the
    quick word-lookup experience.

    The result is cached in D1, so later requests use the
    stored result instead of calling the model again.
  */
  async handleDefine(request) {
    try {
      await this.ensureGlossaryTable();

      const url = new URL(request.url);
      const word = (url.searchParams.get("word") || "")
        .trim()
        .toLowerCase();
      const display = url.searchParams.get("display") || word;

      if (!word || !/^[a-zñ]+$/.test(word)) {
        return json({ error: "Palabra inválido" }, 400);
      }

      /*
        Notice that "tags" is no longer selected.

        Existing rows can still contain the old tags column,
        so there is no risky database migration required.
        The frontend simply stops receiving/using it.
      */
      const cached = await this.env.GAME_HISTORY
        .prepare(
          `SELECT
             display,
             definition,
             example,
             english,
             source
           FROM word_glossary
           WHERE word = ?`
        )
        .bind(word)
        .first();

      if (cached) {
        return json({ word, ...cached, cached: true }, 200);
      }

      let generated = null;

      /*
        Preferred source:
        Claude generates a natural Papiamentu definition.
      */
      if (this.env.ANTHROPIC_API_KEY) {
        generated =
          await this.generateDefinition(
            word,
            display
          );
      }

      /*
        Fallback:
        If Claude is unavailable or doesn't recognize the word,
        try Google Translate.

        This only gives us a basic English gloss, so it remains
        tagged as source="google".
      */
      if (
        (!generated ||
          !generated.definition) &&
        this.env.GOOGLE_TRANSLATE_API_KEY
      ) {

        const googleGloss =
          await this.googleTranslateWord(word);

        if (googleGloss) {
          generated = {
            display,
            definition: googleGloss,
            example: "",
            english: googleGloss,
            source: "google",
          };
        }
      }

      /*
        Neither source produced something useful.
      */
      if (
        !generated ||
        !generated.definition
      ) {
        return json(
          {
            error:
              "Definishon no ta disponibel awor aki",
          },
          503
        );
      }

      generated.source =
        generated.source || "claude";

      /*
        Save only the information actually needed by
        the current UX.

        The old tags column can stay in D1 for backward
        compatibility, but we no longer write to it.
      */
      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO word_glossary
             (
               word,
               display,
               definition,
               example,
               english,
               source
             )
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(word) DO NOTHING`
        )
        .bind(
          word,
          generated.display || display,
          generated.definition || null,
          generated.example || null,
          generated.english || null,
          generated.source
        )
        .run();

      return json({ word, ...generated, cached: false }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureGlossaryTable();
        return this.handleDefine(request);
      }

      console.error(
        "Glossary error:",
        e
      );
      return json({ error: "Server error" }, 500);
    }
  }

  /*
    Basic English translation fallback using
    Google Cloud Translation API.

    This is deliberately treated as a fallback instead of
    the primary definition source.
  */
  async googleTranslateWord(word) {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.env.GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            q: word,
            source: "pap",
            target: "en",
            format: "text",
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data =
        await response.json();
      const translated =
        data?.data
          ?.translations?.[0]
          ?.translatedText;

      /*
        If Google simply sends the original word back,
        it hasn't given us a useful translation.
      */
      if (
        !translated ||
        translated.toLowerCase() ===
          word.toLowerCase()
      ) {
        return null;
      }

      return translated
        .trim()
        .slice(0, 100);
    } catch (e) {
      console.error(
        "Google translation failed:",
        e
      );
      return null;
    }
  }

  /*
    Generate a concise, game-friendly definition.

    IMPORTANT UX decision:
    We intentionally ask for exactly three fields:

    1. definition
    2. example
    3. english

    No grammatical classification is generated because
    labels such as "Sustantivo" added visual noise without
    helping the primary quick-lookup interaction.
  */
  async generateDefinition(word, display) {
    const prompt =
      `Palabra na Papiamentu: "${display}" ` +
      `(normalisá: "${word}").\n\n` +
      `Duna SOLAMENTE un opheto JSON válido, ` +
      `sin markdown ni teksto adishonal, ` +
      `ku exactamente e tres kamponan aki:\n` +
      `- "definition": un definishon kla, natural i ` +
      `kortiku na Papiamentu, preferiblemente 1 frase. ` +
      `Splik'é manera un hende lokal lo splika e palabra ` +
      `na un otro hende. Evitá lengahe tékniko òf ` +
      `repetitivo.\n` +
      `- "example": 1 frase natural na Papiamentu ku usa ` +
      `e palabra den un konteksto realistiko. ` +
      `No ripití e definishon.\n` +
      `- "english": e tradukshon mas natural i komun na ` +
      `Ingles, preferiblemente 1-3 palabra. ` +
      `No agregá palabra redundante; por ehèmpel, ` +
      `si "rose" ta sufisiente, no skirbi ` +
      `"rose flower".\n\n` +
      `Si bo no ta sigur ku e palabra ta un palabra real ` +
      `na Papiamentu, laga "definition" bashí ("").`;

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": this.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Claude definition request failed:",
        response.status
      );
      throw new Error("Model request failed");
    }

    const data = await response.json();
    /*
      Claude normally responds with one text content block,
      but joining all text blocks makes this more robust.
    */
    const text = (
      data.content || []
    )
      .filter((block) => block.type === "text")
      .map(
        (block) =>
          block.text
      )
      .join("")
      .trim()
      /*
        Be tolerant if the model still wraps its JSON
        in a markdown code fence.
      */
      .replace(/^```(json)?/i, "")
      .replace(/```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error(
        "Could not parse definition JSON:",
        text
      );
      parsed = {};
    }

    /*
      Return ONLY what the mobile definition view needs.
    */
    return {
      display:
        (display || word)
          .slice(0, 60),
      definition:
        (parsed.definition || "")
          .trim()
          .slice(0, 500),
      example:
        (parsed.example || "")
          .trim()
          .slice(0, 300),
      english:
        (parsed.english || "")
          .trim()
          .slice(0, 120),
    };
  }

  async ensureUsersTable() {
    await this.env.GAME_HISTORY
      .prepare(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))"
      )
      .run();

    /*
      Idempotent: adding a column that already exists throws,
      which we just swallow. This lets existing deployments
      (with plaintext-only rows) pick up the new salt column
      without a manual migration step.
    */
    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE users ADD COLUMN salt TEXT")
        .run();
    } catch {
      // column already exists
    }
  }

  randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async hashPassword(password, salt) {
    const data = new TextEncoder().encode(salt + password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async handleSignup(request) {
    try {
      await this.ensureUsersTable();

      const { username, password } = await request.json();
      if (!username || !password) {
        return json({ error: "Username and password required" }, 400);
      }
      if (password.length < 4) {
        return json({ error: "Password must be at least 4 characters" }, 400);
      }
      const existing = await this.env.GAME_HISTORY
        .prepare("SELECT username FROM users WHERE username = ?")
        .bind(username)
        .first();
      if (existing) {
        return json({ error: "Username already taken" }, 409);
      }

      const salt = this.randomHex(16);
      const hashed = await this.hashPassword(password, salt);

      await this.env.GAME_HISTORY
        .prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)")
        .bind(username, hashed, salt)
        .run();

      return json({ username }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }

  async handleSignin(request) {
    try {
      await this.ensureUsersTable();

      const { username, password } = await request.json();
      if (!username || !password) {
        return json({ error: "Username and password required" }, 400);
      }

      const row = await this.env.GAME_HISTORY
        .prepare("SELECT username, password, salt FROM users WHERE username = ?")
        .bind(username)
        .first();

      if (!row) {
        return json({ error: "Invalid username or password" }, 401);
      }

      let valid = false;

      if (row.salt) {
        const hashed = await this.hashPassword(password, row.salt);
        valid = hashed === row.password;
      } else {
        /*
          Legacy row from before hashing was added — this
          account's "password" column is still plaintext.
          If it matches, migrate it to a salted hash right
          now so the plaintext value never gets written or
          read again after this one comparison.
        */
        valid = password === row.password;

        if (valid) {
          const salt = this.randomHex(16);
          const hashed = await this.hashPassword(password, salt);

          await this.env.GAME_HISTORY
            .prepare("UPDATE users SET password = ?, salt = ? WHERE username = ?")
            .bind(hashed, salt, username)
            .run();
        }
      }

      if (!valid) {
        return json({ error: "Invalid username or password" }, 401);
      }

      return json({ username: row.username }, 200);
    } catch (e) {
      return json({ error: "Server error" }, 500);
    }
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const AUTH_CSS = `<style>
#cf-account-wrap{
  position:relative;
  display:flex;
  align-items:center;
}
#cf-account-btn svg{width:18px;height:18px;display:block;}
#cf-account-btn.signed-in{
  background:var(--flag);
  border-color:var(--flag);
  color:var(--ink-fixed);
}
#cf-account-popover{
  display:none;
  position:absolute;
  top:calc(100% + 8px);
  right:0;
  min-width:150px;
  background:var(--bg);
  border:1px solid var(--line);
  border-radius:12px;
  padding:12px;
  box-shadow:0 12px 30px rgba(0,0,0,.25);
  z-index:10000;
}
#cf-account-popover.open{display:block;}
.cf-popover-name{
  font-family:'Karla',sans-serif;
  font-size:13px;
  font-weight:700;
  color:var(--ink);
  margin-bottom:10px;
  white-space:nowrap;
}
.cf-logout-btn{
  border:1px solid var(--line);
  background:transparent;
  border-radius:11px;
  color:var(--dim);
  cursor:pointer;
  font-family:'Karla',sans-serif;
  font-size:12px;
  font-weight:700;
  padding:8px 12px;
  width:100%;
}
#cf-auth-overlay{
  display:none;
  position:fixed;
  inset:0;
  z-index:9999;
  background:rgba(8,31,54,.55);
  backdrop-filter:blur(4px);
  align-items:center;
  justify-content:center;
  padding:20px;
}
#cf-auth-overlay.open{display:flex;}
.cf-auth-dialog{
  position:relative;
  width:100%;
  max-width:360px;
  background:var(--bg);
  border:1px solid var(--line);
  border-radius:18px;
  padding:20px;
  box-shadow:0 20px 60px rgba(0,0,0,.35);
}
.cf-auth-close{
  position:absolute;
  top:12px;
  right:12px;
  width:28px;
  height:28px;
  border-radius:50%;
  border:1px solid var(--line);
  background:transparent;
  color:var(--ink);
  font-size:16px;
  line-height:1;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.cf-auth-error{
  color:var(--no);
  font-size:12px;
  margin-bottom:10px;
  display:none;
}
.cf-auth-fields{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-bottom:12px;
}
</style>`;

const AUTH_ICON_HTML = `
<span id="cf-account-wrap">
  <button id="cf-account-btn" class="header-btn" aria-label="Kuenta">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  </button>
  <div id="cf-account-popover">
    <div class="cf-popover-name" id="cf-popover-name"></div>
    <button class="cf-logout-btn" id="cf-logout-btn" type="button">Sali</button>
  </div>
</span>`;

const AUTH_MODAL_HTML = `
<div id="cf-auth-overlay">
  <div class="cf-auth-dialog">
    <button class="cf-auth-close" id="cf-auth-close" aria-label="Sera">&times;</button>
    <div class="auth-title" id="cf-auth-title">Drenta</div>
    <div class="auth-intro">Ku un kuenta bo progreso ta keda wardá i bo por sigui hunga ku e mesun score riba tur bo aparatonan.</div>
    <div class="cf-auth-error" id="cf-auth-error"></div>
    <form id="cf-auth-form" class="cf-auth-fields">
      <input class="name-input" id="cf-auth-username" type="text" autocomplete="username" placeholder="Bo nòmber di uzuario" required>
      <input class="name-input" id="cf-auth-password" type="password" autocomplete="current-password" placeholder="Kontraseña" required>
      <button class="auth-submit" type="submit">Sigui</button>
    </form>
    <div class="auth-links">
      <button class="auth-link" id="cf-auth-toggle" type="button">No tin kuenta? Krea un</button>
    </div>
  </div>
</div>
<script>(function(){
  var openBtn=document.getElementById('cf-account-btn'),
      popover=document.getElementById('cf-account-popover'),
      popoverName=document.getElementById('cf-popover-name'),
      logoutBtn=document.getElementById('cf-logout-btn'),
      overlay=document.getElementById('cf-auth-overlay'),
      closeBtn=document.getElementById('cf-auth-close'),
      title=document.getElementById('cf-auth-title'),
      form=document.getElementById('cf-auth-form'),
      toggle=document.getElementById('cf-auth-toggle'),
      errorEl=document.getElementById('cf-auth-error'),
      mode='signin';

  function setMode(m){
    mode=m;
    title.textContent = m==='signin' ? 'Drenta' : 'Krea kuenta';
    toggle.textContent = m==='signin' ? 'No tin kuenta? Krea un' : 'Bo tin kuenta kaba? Drenta';
    errorEl.style.display='none';
  }

  function openModal(){ setMode('signin'); overlay.classList.add('open'); }
  function closeModal(){ overlay.classList.remove('open'); }
  function closePopover(){ popover.classList.remove('open'); }

  function setSignedIn(username){
    openBtn.dataset.user = username;
    openBtn.classList.add('signed-in');
    openBtn.setAttribute('aria-label', username);
    popoverName.textContent = username;
  }

  function setSignedOut(){
    delete openBtn.dataset.user;
    openBtn.classList.remove('signed-in');
    openBtn.setAttribute('aria-label', 'Kuenta');
    closePopover();
    localStorage.removeItem('cf_user');
  }

  openBtn.addEventListener('click', function(e){
    e.stopPropagation();
    if(openBtn.dataset.user){
      popover.classList.toggle('open');
    }else{
      openModal();
    }
  });
  document.addEventListener('click', function(e){
    if(!popover.contains(e.target) && e.target!==openBtn){
      closePopover();
    }
  });
  logoutBtn.addEventListener('click', setSignedOut);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
  toggle.addEventListener('click', function(){ setMode(mode==='signin' ? 'signup' : 'signin'); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var u=document.getElementById('cf-auth-username').value,
        p=document.getElementById('cf-auth-password').value;
    errorEl.style.display='none';
    fetch('/api/auth/'+mode,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:u,password:p})
    }).then(function(r){return r.json();}).then(function(d){
      if(d.error){
        errorEl.textContent=d.error;
        errorEl.style.display='block';
      }else{
        localStorage.setItem('cf_user', d.username);
        setSignedIn(d.username);
        closeModal();
      }
    }).catch(function(){
      errorEl.textContent='Error di konekshon';
      errorEl.style.display='block';
    });
  });

  var saved=localStorage.getItem('cf_user');
  if(saved){
    setSignedIn(saved);
  }
})();</script>`;