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
    if (url.pathname === "/api/translate-undefined" && request.method === "POST") {
      return this.handleTranslateUndefined(request);
    }
    if (url.pathname === "/api/report-word" && request.method === "POST") {
      return this.handleReportWord(request);
    }
    if (url.pathname === "/moderate/approve" && (request.method === "GET" || request.method === "POST")) {
      return this.handleModeration(request);
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
          current_definition TEXT,
          current_source TEXT,
          suggested_definition TEXT,
          reason TEXT NOT NULL,
          message TEXT,
          player_id TEXT,
          game_date TEXT,
          status TEXT DEFAULT 'pending',
          approved_definition TEXT,
          source TEXT,
          reviewed_at TEXT,
          approval_token_hash TEXT,
          reported_at TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )`
      )
      .run();

    const columns = [
      ["current_definition", "TEXT"],
      ["current_source", "TEXT"],
      ["suggested_definition", "TEXT"],
      ["approved_definition", "TEXT"],
      ["source", "TEXT"],
      ["reviewed_at", "TEXT"],
      ["approval_token_hash", "TEXT"],
      ["reported_at", "TEXT"],
    ];
    const existingReportColumns = await this.env.GAME_HISTORY
      .prepare(`PRAGMA table_info(word_reports)`)
      .all();
    const existingReportNames = new Set(
      (existingReportColumns.results || []).map((col) => col.name)
    );
    for (const [name, type] of columns) {
      if (existingReportNames.has(name)) continue;
      await this.env.GAME_HISTORY
        .prepare(`ALTER TABLE word_reports ADD COLUMN ${name} ${type}`)
        .run();
    }
  }

  async handleReportWord(request) {
    try {
      await this.ensureReportsTable();
      const {
        word,
        currentDefinition,
        currentSource,
        suggestedDefinition,
        reason,
        message,
        playerId,
        date,
      } = await request.json();

      const validReasons = ["wrong", "offensive", "nonsense", "other"];
      const cleanWord = String(word || "").trim().toLowerCase().slice(0, 40);
      const cleanCurrentDefinition = String(currentDefinition || "").trim().slice(0, 500);
      const cleanCurrentSource = String(currentSource || "").trim().slice(0, 80);
      const cleanSuggestedDefinition = String(suggestedDefinition || "").trim().slice(0, 500);
      const cleanMessage = String(message || "").trim().slice(0, 500);
      if (!cleanWord || !validReasons.includes(reason)) {
        return json({ error: "Data inkompletu òf inválido" }, 400);
      }

      const token = this.randomHex(32);
      const tokenHash = await this.hashToken(token);
      const reportedAt = new Date().toISOString();

      const result = await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO word_reports
             (word, current_definition, current_source, suggested_definition, reason, message,
               player_id, game_date, approval_token_hash, reported_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          cleanWord,
          cleanCurrentDefinition,
          cleanCurrentSource || null,
          cleanSuggestedDefinition,
          reason,
          cleanMessage,
          playerId || null,
          date || null,
          tokenHash,
          reportedAt
        )
        .run();

      const reportId = String(result.meta.last_row_id);
      const report = {
        id: reportId,
        word: cleanWord,
        currentDefinition: cleanCurrentDefinition || "(no definition shown)",
        currentSource: cleanCurrentSource || "Not provided",
        suggestedDefinition: cleanSuggestedDefinition || "(none provided)",
        reason,
        message: cleanMessage,
        status: "pending",
        reportedAt,
      };
      await this.sendReportEmail(report, token, new URL(request.url).origin);

      return json({ ok: true, id: reportId }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureReportsTable();
        return this.handleReportWord(request);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async hashToken(token) {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token)
    );
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async findPendingReport(token) {
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) return null;
    const hash = await this.hashToken(token);
    return this.env.GAME_HISTORY
      .prepare("SELECT * FROM word_reports WHERE approval_token_hash = ? AND status = 'pending'")
      .bind(hash)
      .first();
  }

  async publishReport(report, definition, source) {
    const finalDefinition = String(definition || "").trim().slice(0, 500);
    if (!finalDefinition) return false;
    const reviewedAt = new Date().toISOString();
    const sourceReference = String(source || "").trim().slice(0, 500) || null;
    const definitionSource = sourceReference ? "verified_dictionary" : "owner_approved";
    const verificationStatus = sourceReference ? "verified" : "approved";
    await this.ensureGlossaryTable();
    const previous = await this.env.GAME_HISTORY
      .prepare("SELECT definition FROM word_glossary WHERE word = ?")
      .bind(report.word)
      .first();
    const result = await this.env.GAME_HISTORY.batch([
      this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO word_glossary
             (word, display, definition, example, english, source,
              definition_source, translation_source, source_language, target_language,
              verification_status, source_reference, previous_definition)
            VALUES (?, ?, ?, '', '', ?, ?, ?, 'pap', 'en', ?, ?, ?)
           ON CONFLICT(word) DO UPDATE SET
             definition = excluded.definition,
             source = excluded.source,
             definition_source = excluded.definition_source,
             translation_source = excluded.translation_source,
             source_language = 'pap',
             target_language = 'en',
             verification_status = excluded.verification_status,
             source_reference = excluded.source_reference,
             previous_definition = word_glossary.definition,
             needs_review = 0`
        )
        .bind(
          report.word,
          report.display || report.word,
          finalDefinition,
          definitionSource,
          definitionSource,
          definitionSource,
          verificationStatus,
          sourceReference,
          previous?.definition || null
        ),
      this.env.GAME_HISTORY
        .prepare(
          `UPDATE word_reports
           SET status = 'approved', approved_definition = ?, source = ?,
               reviewed_at = ?, approval_token_hash = NULL
           WHERE id = ? AND status = 'pending'`
        )
        .bind(finalDefinition, String(source || "").trim().slice(0, 500) || null, reviewedAt, report.id),
    ]);
    return Boolean(result[1]?.meta?.changes);
  }

  async handleModeration(request) {
    try {
      await this.ensureReportsTable();
      const url = new URL(request.url);
      const token = url.searchParams.get("token") || "";
      const report = await this.findPendingReport(token);
      if (!report) return moderationPage("This moderation link is invalid or has already been used.", 410);

      if (request.method === "GET" && url.searchParams.get("action") === "approve") {
        const approved = await this.publishReport(report, report.suggested_definition, null);
        return moderationPage(
          approved ? "The definition was updated and published." : "This report has already been reviewed.",
          approved ? 200 : 409
        );
      }

      if (request.method === "GET") {
        return moderationForm(report, token);
      }

      const form = await request.formData();
      const action = form.get("action");
      if (action === "reject") {
        const result = await this.env.GAME_HISTORY
          .prepare(
            `UPDATE word_reports SET status = 'rejected', source = ?, reviewed_at = ?, approval_token_hash = NULL
             WHERE id = ? AND status = 'pending'`
          )
          .bind(String(form.get("source") || "").trim().slice(0, 500) || null, new Date().toISOString(), report.id)
          .run();
        return moderationPage(result.meta.changes ? "The report was rejected." : "This report has already been reviewed.", result.meta.changes ? 200 : 409);
      }

      const approved = await this.publishReport(report, form.get("definition"), form.get("source"));
      return moderationPage(
        approved ? "The definition was updated and published." : "The final definition is required, or this report has already been reviewed.",
        approved ? 200 : 400
      );
    } catch (error) {
      console.error("Moderation failed:", error);
      return moderationPage("Moderation could not be completed.", 500);
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
      verify juliettesjakshie@gmail.com as a destination.
    2. In wrangler.jsonc, add:
         "send_email": [
           { "name": "NOTIFY", "destination_address": "juliettesjakshie@gmail.com" }
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
  async sendNotificationEmail(subject, text, html) {
    try {
      const { EmailMessage } = await import("cloudflare:email");
      const messageId = `<${crypto.randomUUID()}@palabradikorsou.com>`;
      const raw = html
        ? `From: Palabra di Korsou <notify@palabradikorsou.com>\r\nTo: juliettesjakshie@gmail.com\r\nSubject: ${subject.replace(/[^