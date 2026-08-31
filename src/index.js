import { WorkerEntrypoint } from "cloudflare:workers";

const DAILY_GLOSSARIES = {
  "2026-08-31": {
    "dios": { english: "God", explanation: "When you're talking about God in a religious or spiritual sense. \"Thank God,\" \"God willing.\"" },
    "disidi": { english: "decide, choose", explanation: "This is for when someone makes up their mind about something. \"I decided to stay home instead of going out.\"" },
    "disididu": { english: "determined, resolute", explanation: "Describes someone who's firm and won't change their mind. \"She was determined to finish the race.\"" },
    "domi": { english: "pastor, minister", explanation: "What you call the pastor at church. \"The domi gave a great sermon on Sunday.\"" },
    "dominio": { english: "control, mastery, dominance", explanation: "For when someone has strong control or skill over something. \"He has real mastery over the language.\"" },
    "domino": { english: "dominoes", explanation: "Dominoes is a major part of everyday social life in Curaçao, played outdoors in neighborhoods and at family gatherings, often with real competitive spirit, not just casual fun." },
    "dùim": { english: "thumb", explanation: "The body part. \"He hurt his thumb closing the door.\"" },
    "dùin": { english: "dune", explanation: "A sand mound near the beach. \"We walked over the dune to reach the shore.\"" },
    "indio": { english: "Indian", explanation: "Describes someone or something from India. \"My neighbor is Indian.\"" },
    "inisio": { english: "beginning, start", explanation: "The start of something. \"At the beginning of the movie, nothing made sense yet.\"" },
    "insiso": { english: "clause, point", explanation: "One point or clause in a document. \"Check clause three of the contract.\"" },
    "midi": { english: "measure; midi skirt", explanation: "Either measuring something, or a mid-length skirt. \"Can you measure the table?\" / \"She wore a midi skirt to the party.\"" },
    "midí": { english: "measurement, size", explanation: "The actual measurement or size that results. \"What's the measurement of this room?\"" },
    "mimu": { english: "thin-skinned, overly sensitive to pain", explanation: "For teasing someone who overreacts to tiny pains. \"Stop being such a baby, it's just a scratch.\"" },
    "mini": { english: "mini, miniskirt", explanation: "A very short skirt. \"She bought a new miniskirt for the party.\"" },
    "minímo": { english: "minimum, least", explanation: "The smallest possible amount. \"That's the minimum you need to pass.\"" },
    "minusioso": { english: "meticulous, thorough", explanation: "Describes someone extremely careful and detail-oriented. \"He checked every detail meticulously.\"" },
    "mion": { english: "million", explanation: "The number one million. \"The lottery prize was a million dollars.\"" },
    "miou": { english: "meow", explanation: "The sound a cat makes. \"The cat let out a loud meow.\"" },
    "modismo": { english: "idiom, expression", explanation: "An expression that doesn't translate literally. \"'Kick the bucket' is an idiom for dying.\"" },
    "mondi": { english: "bush, scrubland", explanation: "Wild, uncultivated countryside. \"We went hiking through the bush.\"" },
    "niun": { english: "none, not one", explanation: "Saying \"not even one.\" \"None of the students answered correctly.\"" },
    "nodi": { english: "necessity, need", explanation: "When something is required. \"There's no need to worry about it.\"" },
    "nudismo": { english: "nudism", explanation: "Talking about the practice of going nude socially. \"That beach is known for nudism.\"" },
    "nunsio": { english: "nuncio", explanation: "The Pope's diplomatic representative. \"The nuncio visited the president.\"" },
    "odio": { english: "hatred", explanation: "Strong hatred. \"His hatred for injustice drove him to act.\"" },
    "odioso": { english: "hateful, spiteful", explanation: "Describes someone or something spiteful. \"That was a really hateful comment.\"" },
    "oido": { english: "hearing, ear (for music)", explanation: "Hearing, or a natural talent for music. \"She has a great ear for music.\"" },
    "sino": { english: "but rather, otherwise", explanation: "Contrasting with what was just said. \"It's not red, but rather orange.\"" },
    "sinónimo": { english: "synonym", explanation: "When two words mean the same thing. \"'Happy' and 'glad' are synonyms.\"" },
    "sinùs": { english: "sinus", explanation: "The sinus cavity in the face. \"My sinuses are blocked from the cold.\"" },
    "sismo": { english: "earthquake, tremor", explanation: "An earthquake tremor. \"A small earthquake shook the city last night.\"" },
    "snui": { english: "prune, trim", explanation: "Trimming trees or plants. \"He pruned the roses before winter.\"" },
    "sosio": { english: "partner, associate, member", explanation: "A partner, buddy, or club member. \"He's my business partner.\"" },
    "suin": { english: "swing (dance)", explanation: "The swing dance style. \"They danced the swing all night.\"" },
    "suisidio": { english: "suicide", explanation: "Talking about someone ending their own life. \"The news reported on the suicide.\"" },
    "sumiso": { english: "submissive, obedient", explanation: "Describes someone who obeys without resistance. \"The dog was very submissive to its owner.\"" },
    "union": { english: "union, unity", explanation: "A joining together, like a group or alliance. \"The union represents all the workers.\"" },
    "unisóno": { english: "unison", explanation: "When everyone sings or plays the same note together. \"The choir sang the last line in unison.\"" },
  },
  "2026-09-01": {
    "kikiriki": { english: "Cock-a-doodle-do / Rooster crow", explanation: "Kikiriki is the onomatopoeic word used in Papiamentu to imitate the crowing sound of a rooster." },
    "kiko": { english: "What", explanation: "Kiko is an interrogative pronoun used to ask questions about things or actions (e.g., 'Kiko bo ke?' means 'What do you want?')." },
    "kimiko": { english: "Chemical (or Chemistry student)", explanation: "Kimiko describes something related to chemistry, such as a chemical reaction or compound." },
    "kiosko": { english: "Kiosk / Newsstand", explanation: "A kiosko is a small open hut or booth where drinks, newspapers, or snacks are sold." },
    "koki": { english: "Cook / Chef", explanation: "Koki refers to a person who prepares and cooks food professionally or at home." },
    "koko": { english: "Coconut", explanation: "Koko is the tropical palm fruit widely used in Caribbean cuisine and drinks." },
    "kokoi": { english: "Quail", explanation: "Kokoi is a small wild bird native to the region, often referenced in local folklore and nature." },
    "kokoyoko": { english: "Crowing / Cock-a-doodle-do", explanation: "Kokoyoko refers specifically to the act or sound of a rooster crowing at dawn." },
    "komi": { english: "Caraway seed / Cumin", explanation: "Komi is a common aromatic spice used to flavor local stews and dishes." },
    "komiko": { english: "Comical / Funny / Comic", explanation: "Komiko describes someone or something that causes laughter or amusement." },
    "komis": { english: "Customs officer / Superintendent", explanation: "Komis refers to a border tax/customs official or high-ranking supervisor." },
    "komo": { english: "Since / As / Because", explanation: "Komo is a conjunction used to introduce a reason or cause for an event." },
    "korki": { english: "Cork / Cap", explanation: "Korki is the stopper material used to seal bottles, or a bottle cap." },
    "koro": { english: "Choir / Chorus", explanation: "Koro refers to an organized group of singers or the repeating main part of a song." },
    "korokoro": { english: "Throat / Voice box / Windpipe", explanation: "Korokoro is an informal or anatomical term for the human throat." },
    "kosmiko": { english: "Cosmic", explanation: "Kosmiko describes anything related to outer space, the universe, or astronomy." },
    "kosmos": { english: "Cosmos / Universe", explanation: "Kosmos refers to the universe seen as a well-ordered whole." },
    "kriki": { english: "Cricket (insect)", explanation: "Kriki is the small jumping insect known for making chirping sounds at night." },
    "krio": { english: "Creole / Native-born", explanation: "Krio refers to things, traditions, or language varieties originating locally in the region." },
    "krioyismo": { english: "Local folklore / Creole localism", explanation: "Krioyismo represents the local cultural expressions, idioms, and traditions unique to the island." },
    "krioyo": { english: "Local / Creole / Traditional", explanation: "Krioyo describes authentic local cuisine, culture, or traditions (such as 'kuminda krioyo', meaning local island food)." },
    "krisis": { english: "Crisis", explanation: "Krisis refers to a time of intense difficulty, danger, or emergency." },
    "kros": { english: "Cross / Crossing", explanation: "Kros refers to an intersecting shape/symbol or passing across a path." },
    "mikro": { english: "Micro", explanation: "Mikro is a prefix or modifier meaning extremely small." },
    "mimiko": { english: "Mimic / Mime", explanation: "Mimiko refers to non-verbal theatrical performance using gestures and facial expressions." },
    "morkoi": { english: "Land tortoise", explanation: "Morkoi is the Papiamentu term for a terrestrial tortoise found on the islands." },
    "rikisimo": { english: "Extremely rich / Delicious", explanation: "Rikisimo is used to describe food that is exceptionally tasty or a person with vast wealth." },
    "sikiko": { english: "Psychic / Mental", explanation: "Sikiko pertains to the human mind or extra-sensory psychic abilities." },
    "sirko": { english: "Circus", explanation: "Sirko refers to a traveling show of acrobats, clowns, and performances." },
    "sismiko": { english: "Seismic", explanation: "Sismiko refers to phenomena related to earthquakes or earth vibrations." },
    "skor": { english: "Score", explanation: "Skor is the tally of points scored in a game or match." },
    "yorki": { english: "Dried meat / Jerky / Traditional Curaçaoan stew", explanation: "In Curaçao, Yorki is a traditional comfort dish made of salted, cured goat meat (or sometimes pork) that is soaked, boiled until tender, and sautéed with aromatics like onions, tomatoes, peppers, and vinegar." },
  },
};

function normaliseGlossaryKey(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toLowerCase();
}

export default class extends WorkerEntrypoint {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth/signup" && request.method === "POST") {
      return this.handleSignup(request);
    }
    if (url.pathname === "/api/auth/signin" && request.method === "POST") {
      return this.handleSignin(request);
    }
    // Password reset is temporarily disabled until the flow is finished (see handleResetPassword below).
    if (url.pathname === "/api/auth/reset-password" && request.method === "POST") {
      return json({ error: "Password reset is temporarily unavailable" }, 503);
    }
    if (url.pathname === "/api/auth/me" && request.method === "GET") {
      return this.handleAuthMe(request);
    }
    if (url.pathname === "/api/auth/signout" && request.method === "POST") {
      return this.handleSignout(request);
    }
    if (url.pathname === "/api/account/username" && request.method === "PATCH") {
      return this.handleUsernameChange(request);
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

      const user =
        await this.getAuthenticatedUser(
          request
        );

      if (!user) {
        return json(
          {
            error:
              "Sign in required to save score"
          },
          401
        );
      }

      const {
        date,
        score,
        words,
        pangrams,
        maxScore
      } = await request.json();

      if (!date) {
        return json(
          {
            error: "date required"
          },
          400
        );
      }

      const playerId =
        "acct:" + user.id;

      const name =
        user.username;

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

      const today =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT
               player_id AS playerId,
               name,
               score,
               words,
               pangrams
             FROM leaderboard_scores
             WHERE date = ?
             ORDER BY score DESC
             LIMIT 100`
          )
          .bind(date)
          .all();

      const allTime =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT
               l1.player_id AS playerId,
               (
                 SELECT name
                 FROM leaderboard_scores l2
                 WHERE l2.player_id =
                       l1.player_id
                 ORDER BY date DESC
                 LIMIT 1
               ) AS name,
               SUM(l1.score) AS score,
               COUNT(DISTINCT l1.date)
                 AS days
             FROM leaderboard_scores l1
             GROUP BY l1.player_id
             ORDER BY score DESC
             LIMIT 100`
          )
          .all();

      const statsResult =
        await this.recomputeStatsAndBadges(
          playerId,
          date
        );

      return json(
        {
          today:
            today.results || [],
          allTime:
            allTime.results || [],
          stats:
            statsResult.stats,
          newBadges:
            statsResult.newBadges
        },
        200
      );

    } catch (e) {
      console.error(
        "Leaderboard POST error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
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

  async handleProgressGet(request) {
    try {
      await this.ensureProgressTable();

      const user =
        await this.getAuthenticatedUser(
          request
        );

      if (!user) {
        return json(
          {
            error:
              "Sign in required"
          },
          401
        );
      }

      const url =
        new URL(request.url);

      const date =
        url.searchParams.get("date");

      if (!date) {
        return json(
          {
            error:
              "date query param required"
          },
          400
        );
      }

      const playerId =
        "acct:" + user.id;

      const row =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT found_words
             FROM game_progress
             WHERE player_id = ?
               AND date = ?`
          )
          .bind(
            playerId,
            date
          )
          .first();

      let found = [];

      if (row && row.found_words) {
        try {
          const parsed =
            JSON.parse(
              row.found_words
            );

          if (Array.isArray(parsed)) {
            found = parsed;
          }

        } catch {
          found = [];
        }
      }

      return json(
        {
          found
        },
        200
      );

    } catch (e) {
      console.error(
        "Progress GET error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
    }
  }

  async handleProgressPost(request) {
    try {
      await this.ensureProgressTable();

      const user =
        await this.getAuthenticatedUser(
          request
        );

      if (!user) {
        return json(
          {
            error:
              "Sign in required"
          },
          401
        );
      }

      const {
        date,
        found
      } = await request.json();

      if (
        !date ||
        !Array.isArray(found)
      ) {
        return json(
          {
            error:
              "date and found[] required"
          },
          400
        );
      }

      const playerId =
        "acct:" + user.id;

      const cleaned =
        found
          .filter(
            word =>
              typeof word === "string"
          )
          .slice(0, 500)
          .map(
            word =>
              word.slice(0, 40)
          );

      await this.env.GAME_HISTORY
        .prepare(
          `INSERT INTO game_progress
             (player_id, date, found_words)
           VALUES (?, ?, ?)
           ON CONFLICT(player_id, date)
           DO UPDATE SET
             found_words =
               excluded.found_words,
             updated_at =
               datetime('now')`
        )
        .bind(
          playerId,
          date,
          JSON.stringify(cleaned)
        )
        .run();

      return json(
        {
          ok: true
        },
        200
      );

    } catch (e) {
      console.error(
        "Progress POST error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
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

      const user =
        await this.getAuthenticatedUser(
          request
        );

      if (!user) {
        return json(
          {
            error:
              "Sign in required"
          },
          401
        );
      }

      const playerId =
        "acct:" + user.id;

      const stats =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT *
             FROM player_stats
             WHERE player_id = ?`
          )
          .bind(playerId)
          .first();

      const badges =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT
               b.id,
               b.category,
               b.name,
               b.description,
               pb.earned_at
             FROM player_badges pb
             JOIN badge_definitions b
               ON b.id = pb.badge_id
             WHERE pb.player_id = ?
             ORDER BY b.sort_order ASC`
          )
          .bind(playerId)
          .all();

      return json(
        {
          stats: stats || null,
          badges:
            badges.results || []
        },
        200
      );

    } catch (e) {
      console.error(
        "Stats error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
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

      await this.sendFeedbackEmail({
        playerId: playerId || null,
        name: name || null,
        category: category || null,
        message: text,
        date: date || null,
      });

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
  async sendNotificationEmail(subject, text, html) {
    try {
      const { EmailMessage } = await import("cloudflare:email");
      const messageId = `<${crypto.randomUUID()}@palabradikorsou.com>`;
      const raw = html
        ? `From: Palabra di Korsou <notify@palabradikorsou.com>\r\nTo: juliettesjakshie248@gmail.com\r\nSubject: ${subject.replace(/[^\x00-\x7F]/g, "-")}\r\nMessage-ID: ${messageId}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary="palabra-boundary"\r\n\r\n--palabra-boundary\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${text}\r\n--palabra-boundary\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${html}\r\n--palabra-boundary--`
        : `From: Palabra di Korsou <notify@palabradikorsou.com>\r\n` +
          `To: juliettesjakshie248@gmail.com\r\n` +
          `Subject: ${subject}\r\n` +
          `Message-ID: ${messageId}\r\n` +
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

  async sendFeedbackEmail(feedback) {
    const receivedAt = new Date().toISOString();
    const category = feedback.category || "Not provided";
    const name = feedback.name || "Anonymous";
    const text = [
      `From: ${name}`,
      `Category: ${category}`,
      `Message: ${feedback.message}`,
      `Player ID: ${feedback.playerId || "Not provided"}`,
      `In-game date: ${feedback.date || "Not provided"}`,
      `Received at: ${receivedAt}`,
    ].join("\n");
    const field = (label, value) =>
      `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#52606d">${escapeHtmlServer(label)}</th><td style="padding:8px 12px;vertical-align:top">${escapeHtmlServer(value)}</td></tr>`;
    const html = `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#081f36"><main style="max-width:600px;margin:24px auto;padding:24px;background:#fff;border:1px solid #ddd6c9"><h1 style="font-size:22px;margin:0 0 18px">Palabra di Kòrsou feedback</h1><table style="width:100%;border-collapse:collapse">${field("From", name)}${field("Category", category)}${field("Message", feedback.message)}${field("Player ID", feedback.playerId || "Not provided")}${field("In-game date", feedback.date || "Not provided")}${field("Received at", receivedAt)}</table></main></body></html>`;
    await this.sendNotificationEmail(
      `[Palabra di Kòrsou] Feedback: ${category}`,
      text,
      html
    );
  }

  async sendReportEmail(report, token, origin) {
    const approveUrl = `${origin}/moderate/approve?action=approve&token=${encodeURIComponent(token)}`;
    const editUrl = `${origin}/moderate/approve?token=${encodeURIComponent(token)}`;
    const reason = report.reason || "Not provided";
    const reportedAt = report.reportedAt || new Date().toISOString();
    const text = [
      `Word: ${report.word}`,
      `Current definition: ${report.currentDefinition}`,
      `Current source: ${report.currentSource || "Not provided"}`,
      `Player suggestion: ${report.suggestedDefinition}`,
      `Report reason: ${reason}`,
      `Player note: ${report.message || "Not provided"}`,
      `Status: ${report.status}`,
      `Report ID: ${report.id}`,
      `Reported at: ${reportedAt}`,
      `Approve suggestion: ${approveUrl}`,
      `Edit & approve: ${editUrl}`,
    ].join("\n");
    const field = (label, value) =>
      `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#52606d">${escapeHtmlServer(label)}</th><td style="padding:8px 12px;vertical-align:top">${escapeHtmlServer(value)}</td></tr>`;
    const html = `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#081f36"><main style="max-width:600px;margin:24px auto;padding:24px;background:#fff;border:1px solid #ddd6c9"><h1 style="font-size:22px;margin:0 0 18px">Palabra di Kòrsou report</h1><table style="width:100%;border-collapse:collapse">${field("Word", report.word)}${field("Current definition", report.currentDefinition)}${field("Current source", report.currentSource || "Not provided")}${field("Player suggestion", report.suggestedDefinition)}${field("Report reason", reason)}${field("Player note", report.message || "Not provided")}${field("Status", report.status)}${field("Report ID", report.id)}${field("Reported at", reportedAt)}</table><p style="margin:24px 0 10px"><a href="${escapeHtmlServer(approveUrl)}" style="display:inline-block;background:#2e7864;color:#fff;padding:12px 16px;text-decoration:none;margin:0 8px 8px 0">&#10003; Approve suggestion</a><a href="${escapeHtmlServer(editUrl)}" style="display:inline-block;background:#0f9fe0;color:#fff;padding:12px 16px;text-decoration:none;margin:0 8px 8px 0">&#9999; Edit &amp; approve</a></p></main></body></html>`;
    await this.sendNotificationEmail(
      `[Palabra di Kòrsou] Report: ${report.word} — ${reason}`,
      text,
      html
    );
  }

  async getPuzzlePreview(dateString) {
    const assetResponse = await this.env.ASSETS.fetch(
      new Request("https://assets.local/index.html")
    );
    if (!assetResponse.ok) {
      throw new Error("Could not load the game dictionary");
    }

    const page = await assetResponse.text();
    const listStart = page.indexOf("const PALABRANAN = [");
    const arrayStart = page.indexOf("[", listStart);
    const arrayEnd = page.indexOf("\n];", arrayStart);
    if (listStart < 0 || arrayStart < 0 || arrayEnd < 0) {
      throw new Error("Could not find the game dictionary");
    }

    const words = JSON.parse(page.slice(arrayStart, arrayEnd + 2));
    const fold = {
      "á": "a", "à": "a", "é": "e", "è": "e", "í": "i", "ì": "i",
      "ó": "o", "ò": "o", "ú": "u", "ù": "u", "ü": "u", "ç": "c",
    };
    const normalise = (value) => [...String(value).normalize("NFC").toLowerCase().trim()]
      .map((letter) => fold[letter] || letter)
      .join("");
    const letterBit = (letter) => letter === "ñ"
      ? 1 << 26
      : 1 << (letter.charCodeAt(0) - 97);
    const countBits = (mask) => {
      let count = 0;
      while (mask) {
        mask &= mask - 1;
        count++;
      }
      return count;
    };
    const display = {};
    const entries = words.reduce((all, spelling) => {
      const word = normalise(spelling);
      if ([...word].length < 4 || !/^[a-zñ]+$/.test(word) || display[word]) {
        return all;
      }
      display[word] = spelling;
      let mask = 0;
      for (const letter of word) mask |= letterBit(letter);
      all.push({ word, mask, distinct: countBits(mask) });
      return all;
    }, []);
    const hives = new Set(entries.filter((entry) => entry.distinct === 7).map((entry) => entry.mask));
    const pool = [];
    for (const mask of hives) {
      const fitting = entries.filter((entry) => (entry.mask & ~mask) === 0);
      const letters = [];
      for (let index = 0; index < 26; index++) {
        if (mask & (1 << index)) letters.push(String.fromCharCode(97 + index));
      }
      if (mask & (1 << 26)) letters.push("ñ");
      for (const centre of letters) {
        const answers = fitting.filter((entry) => entry.mask & letterBit(centre));
        if (answers.length < 14 || answers.length > 55) continue;
        const pangrams = answers.filter((entry) => entry.mask === mask);
        if (!pangrams.length) continue;
        pool.push({
          mask,
          centre,
          letters,
          answers: answers.map((entry) => entry.word).sort(),
          pangrams: pangrams.map((entry) => entry.word).sort(),
        });
      }
    }
    pool.sort((left, right) => left.mask - right.mask || (left.centre < right.centre ? -1 : 1));
    let seed = 0x9e3779b9;
    const random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
    for (let index = pool.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(random() * (index + 1));
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }

    const epoch = Date.UTC(2026, 7, 20);
    const number = Math.round((Date.parse(`${dateString}T00:00:00Z`) - epoch) / 86400000);
    const puzzle = pool[(number % pool.length + pool.length) % pool.length];
    return {
      centre: puzzle.centre,
      letters: [puzzle.centre, ...puzzle.letters.filter((letter) => letter !== puzzle.centre)],
      words: puzzle.answers.map((word) => display[word]),
      pangrams: puzzle.pangrams.map((word) => display[word]),
      definitions: Object.fromEntries(puzzle.answers.map((word) => [word, ""])),
    };
  }

  async sendTomorrowPuzzleEmail(date = new Date().toISOString().slice(0, 10)) {
    const puzzle = await this.getPuzzlePreview(date);
    const definitionTemplate = JSON.stringify(puzzle.definitions, null, 2);
    const text = [
      `Tomorrow's puzzle: ${date}`,
      `Letters: ${puzzle.letters.join(" ").toUpperCase()}`,
      `Center letter: ${puzzle.centre.toUpperCase()}`,
      `Pangrams: ${puzzle.pangrams.join(", ")}`,
      "",
      "Write the Papiamento definitions below, then paste the completed entries into DEFINITIONS in public/index.html and deploy.",
      "",
      definitionTemplate,
    ].join("\n");
    const html = `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Arial,sans-serif;color:#081f36"><main style="max-width:700px;margin:24px auto;padding:24px;background:#fff;border:1px solid #ddd6c9"><h1 style="font-size:22px;margin:0 0 18px">Tomorrow's Palabra di Kòrsou puzzle</h1><p><strong>Date:</strong> ${date}<br><strong>Letters:</strong> ${puzzle.letters.join(" ").toUpperCase()}<br><strong>Center:</strong> ${puzzle.centre.toUpperCase()}<br><strong>Pangram:</strong> ${escapeHtmlServer(puzzle.pangrams.join(", "))}</p><p>Write the Papiamento definitions, paste them into <code>DEFINITIONS</code> in <code>public/index.html</code>, then deploy.</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere;padding:16px;background:#f4f1ea;border:1px solid #ddd6c9">${escapeHtmlServer(definitionTemplate)}</pre></main></body></html>`;
    await this.sendNotificationEmail(
      `[Palabra di Kòrsou] Definitions for ${date}`,
      text,
      html
    );
  }

  /*
    WEEKLY DIGEST — Cron Trigger, not called by any request.

    Setup required in wrangler.jsonc:
      "triggers": { "crons": ["0 13 * * 1"] }
    (13:00 UTC every Monday = 9am AST/Curaçao time. Adjust the
    cron string for a different day/time — cron field order is
    minute hour day-of-month month day-of-week.)

    Pulls still-pending word submissions for the legacy digest.
    Word reports are sent immediately and remain pending until
    their one-time moderation link is used.
  */
  async scheduled(controller) {
    try {
      if (controller.cron === "0 0 * * *") {
        await this.sendTomorrowPuzzleEmail();
        return;
      }

      await this.ensureReportsTable();
      await this.ensureSubmissionsTable();

      const submissions = await this.env.GAME_HISTORY
        .prepare(
          `SELECT type, word, note, game_date, created_at
           FROM word_submissions WHERE status = 'pending'
           ORDER BY created_at ASC`
        )
        .all();

      const submissionRows = submissions.results || [];

      if (submissionRows.length === 0) {
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

      await this.sendNotificationEmail(
        `[Palabra di Kòrsou] Resúmen simanal (${submissionRows.length} pendiente)`,
        text
      );

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
          source TEXT DEFAULT 'legacy',
          translation_source TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          definition_source TEXT DEFAULT 'legacy',
          source_language TEXT,
          target_language TEXT,
          verification_status TEXT DEFAULT 'unverified',
          source_reference TEXT,
          previous_definition TEXT,
          needs_review INTEGER NOT NULL DEFAULT 0,
          translation_ambiguous INTEGER NOT NULL DEFAULT 0,
          pipeline_version INTEGER NOT NULL DEFAULT 0
        )`
      )
      .run();

    // Idempotent: only add columns that are actually missing,
    // checked via PRAGMA rather than firing ALTER TABLE and
    // hoping to catch a "duplicate column" failure.
    const existingColumns = await this.env.GAME_HISTORY
      .prepare(`PRAGMA table_info(word_glossary)`)
      .all();
    const existingNames = new Set(
      (existingColumns.results || []).map((col) => col.name)
    );

    for (const [name, type] of [
      ["tags", "TEXT"],
      ["source", "TEXT DEFAULT 'legacy'"],
      ["translation_source", "TEXT"],
      ["definition_source", "TEXT DEFAULT 'legacy'"],
      ["source_language", "TEXT"],
      ["target_language", "TEXT"],
      ["verification_status", "TEXT DEFAULT 'unverified'"],
      ["source_reference", "TEXT"],
      ["previous_definition", "TEXT"],
      ["needs_review", "INTEGER NOT NULL DEFAULT 0"],
      ["translation_ambiguous", "INTEGER NOT NULL DEFAULT 0"],
      ["pipeline_version", "INTEGER NOT NULL DEFAULT 0"],
    ]) {
      if (existingNames.has(name)) continue;
      await this.env.GAME_HISTORY
        .prepare(`ALTER TABLE word_glossary ADD COLUMN ${name} ${type}`)
        .run();
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
        .normalize("NFC")
        .trim()
        .toLowerCase();
      const display = url.searchParams.get("display") || word;
      const tags = (url.searchParams.get("tags") || "").slice(0, 40);
      const date = url.searchParams.get("date") || "";

      if (!word || !/^[a-zàáèéìíòóùúñ]+$/.test(word)) {
        return json({ error: "Palabra inválido" }, 400);
      }

      const dailyGlossary = DAILY_GLOSSARIES[date];
      const dailyEntry = dailyGlossary && (
        dailyGlossary[display] ||
        dailyGlossary[word] ||
        Object.entries(dailyGlossary).find(
          ([entryWord]) => normaliseGlossaryKey(entryWord) === normaliseGlossaryKey(display)
        )?.[1]
      );
      if (dailyEntry) {
        if (!this.env.GOOGLE_TRANSLATE_API_KEY) {
          return json({ error: "Google Translate no ta konfigurá" }, 503);
        }
        const definition = await this.translateTextGoogle(dailyEntry.explanation, "en", "pap");
        if (!definition) {
          return json({ error: "Definishon no ta disponibel awor aki", word }, 503);
        }
        return json({
          word,
          display,
          definition: definition.trim().slice(0, 500),
          example: "",
          english: dailyEntry.english,
          source: "daily_google_translate",
          definition_source: "google",
          translation_source: "google",
          cached: false,
        }, 200);
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
             tags,
             source,
             definition_source,
             translation_source,
             source_language,
             target_language,
             verification_status,
             source_reference,
             needs_review,
             translation_ambiguous,
             pipeline_version
           FROM word_glossary
           WHERE word = ?`
        )
        .bind(word)
        .first();

      if (cached && (
        cached.verification_status === "verified" ||
        cached.verification_status === "approved" ||
        cached.source === "verified_dictionary" ||
        cached.source === "owner_approved" ||
        cached.definition_source === "verified_dictionary" ||
        cached.definition_source === "owner_approved"
      )) {
        return json({ word, ...cached, definitionNl: cached.definition, cached: true }, 200);
      }

        if (cached && cached.definition_source === "google" &&
          cached.translation_source === "google" &&
          cached.pipeline_version === 3) {
        return json({ word, ...cached, definitionNl: cached.definition, cached: true }, 200);
      }

      if (url.searchParams.get("override") === "1") {
        return json({ error: "No moderated override" }, 404);
      }

      const generated = await this.resolveDefinition(word, display, tags);

      if (!generated) {
        return json(
          { error: "Definishon no ta disponibel awor aki", word },
          503
        );
      }

      generated.source = generated.source || "ai_fallback";

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
               tags,
               definition,
               example,
               english,
               source,
               definition_source,
               translation_source,
               source_language,
               target_language,
                 verification_status,
                 needs_review,
                 translation_ambiguous,
                 pipeline_version
             )
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(word) DO UPDATE SET
             display = excluded.display,
             tags = excluded.tags,
             definition = excluded.definition,
             example = excluded.example,
             english = excluded.english,
             source = excluded.source,
             definition_source = excluded.definition_source,
             translation_source = excluded.translation_source,
             source_language = excluded.source_language,
             target_language = excluded.target_language,
             verification_status = excluded.verification_status,
             needs_review = excluded.needs_review,
             translation_ambiguous = excluded.translation_ambiguous,
             pipeline_version = excluded.pipeline_version
           WHERE word_glossary.verification_status NOT IN ('approved', 'verified')`
        )
        .bind(
          word,
          generated.display || display,
          tags,
          generated.definition || null,
          generated.example || null,
          generated.english || null,
          generated.source,
          generated.definition_source || "anthropic",
          generated.translation_source || "anthropic",
          generated.source_language || "pap",
          generated.target_language || "en",
          generated.verification_status || "unverified",
          generated.needs_review ? 1 : 0,
          generated.translation_ambiguous ? 1 : 0,
          3
        )
        .run();

      return json({
        word,
        display: generated.display || display,
        definition: generated.definition,
        example: generated.example,
        english: generated.english,
        source: generated.source,
        cached: false,
      }, 200);
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await this.ensureGlossaryTable();
        return this.handleDefine(request);
      }

      console.error(
        "Glossary error:",
        e
      );
      if (e.message && e.message.startsWith("Google Translate failed")) {
        return json({ error: e.message }, 502);
      }
      return json({ error: "Server error" }, 500);
    }
  }

  async handleTranslateUndefined(request) {
    if (!this.env.TRANSLATION_ADMIN_TOKEN ||
        request.headers.get("authorization") !== `Bearer ${this.env.TRANSLATION_ADMIN_TOKEN}`) {
      return json({ error: "Unauthorized" }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "JSON body required" }, 400);
    }

    const words = Array.isArray(body.words)
      ? [...new Set(body.words.map((word) => String(word).trim().toLowerCase()))]
          .filter((word) => /^[a-zàáèéìíòóùúñ]+$/.test(word))
          .slice(0, 500)
      : [];
    const results = [];
    for (const word of words) {
      const response = await this.handleDefine(
        new Request(`${new URL(request.url).origin}/api/define?word=${encodeURIComponent(word)}`)
      );
      const data = await response.json();
      results.push({ word, status: response.status, cached: data.cached === true, source: data.source });
    }
    return json({ translated: results.filter((result) => result.status === 200 && !result.cached).length, results }, 200);
  }

  /*
    Preliminary English translation using
    Google Cloud Translation API.

    This is the primary automatic source and is cached in D1.
  */
  async googleTranslateWord(word) {
    try {
      const googleResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(this.env.GOOGLE_TRANSLATE_API_KEY)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: word,
            source: "pap",
            target: "en",
            format: "text",
          }),
        }
      );

      const googleText = await googleResponse.text();
      console.log("Google status:", googleResponse.status);
      console.log("Google response:", googleText);

      if (!googleResponse.ok) {
        throw new Error(
          `Google Translate failed (${googleResponse.status}): ${googleText}`
        );
      }

      let data;
      try {
        data = JSON.parse(googleText);
      } catch {
        throw new Error(
          `Google Translate failed (invalid JSON): ${googleText}`
        );
      }
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

      const meaning = translated.trim().slice(0, 100);
      const normalisedWord = word.toLowerCase();
      const needsReview = meaning.toLowerCase() === normalisedWord ||
        meaning.length > 60 || /[,;/]|\bor\b|\band\b/i.test(meaning);
      return { meaning, needsReview };
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
  /*
    Generic text translation via Google Cloud Translation API — translates
    a full sentence, as opposed to googleTranslateWord() above which
    translates a single Papiamentu word and applies word-specific checks.
    Used to turn Claude's English example sentences into Papiamentu.
  */
  async translateTextGoogle(text, sourceLang, targetLang) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(this.env.GOOGLE_TRANSLATE_API_KEY)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text",
          }),
        }
      );
      clearTimeout(timeout);
      if (!res.ok) {
        console.error("Google text translation failed:", res.status, await res.text());
        return null;
      }
      const data = await res.json();
      return data?.data?.translations?.[0]?.translatedText ?? null;
    } catch (e) {
      console.error("Google text translation failed:", e);
      return null;
    }
  }

  async generateDefinition(word, display, tags, englishMeaning) {

    const grounding =
      englishMeaning
        ? (
            `Google Cloud Translation translated this Papiamentu word ` +
            `to English as: "${englishMeaning}".\n` +
            `Treat this English translation as FIXED grounding. ` +
            `Do NOT replace it with another English meaning.\n`
          )
        : (
            `Google Cloud Translation did not return a usable English meaning.\n` +
            `Use your knowledge of Papiamentu cautiously to determine the meaning. ` +
            `If you are not confident, leave the definition empty rather than inventing one.\n`
          );

    const prompt =
      `Papiamentu word: "${display}" ` +
      `(normalisá: "${word}").\n\n` +
      grounding +
      `Grammatical code: ${tags || "none"}.\n` +
      `The grammatical code and translation are separate pieces ` +
      `of information. Do not use the grammatical code to change ` +
      `the meaning supplied by Google.\n\n` +
      `Duna SOLAMENTE un opheto JSON válido, ` +
      `sin markdown ni teksto adishonal, ` +
      `ku exactamente e tres kamponan aki:\n` +
      `- "definition": un splikashon kla i natural na Papiamentu ` +
      `ku ta deskribí e palabra, preferiblemente un frase. ` +
      `Uza e English meaning solamente pa komprondé e sentido; ` +
      `no inkluí Ingles den e splikashon.\n` +
      `- "exampleEnglish": one natural English sentence that uses the ` +
      `word's concept in a realistic context. Do not repeat the ` +
      `definition. Write it in plain English — it will be translated ` +
      `to Papiamentu separately.\n` +
      `- "english": the fixed Google English meaning, or your best ` +
      `English fallback only when Google returned no usable result.\n\n` +
      `If unsure, leave "definition" and "exampleEnglish" empty ("").`;

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": this.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          // Some Anthropic API keys are "identity-linked" and require this
          // header to say which workspace the request acts in. Only added
          // when the env var is actually set, so it's a no-op for keys that
          // don't need it.
          ...(this.env.ANTHROPIC_WORKSPACE_ID
            ? { "anthropic-workspace-id": this.env.ANTHROPIC_WORKSPACE_ID }
            : {}),
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
      const errorBody = await response.text();
      console.error(
        "Claude definition request failed:",
        response.status,
        errorBody
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

    const exampleEnglishFromModel = (parsed.exampleEnglish || "").trim().slice(0, 300);
    let example = "";
    if (exampleEnglishFromModel && this.env.GOOGLE_TRANSLATE_API_KEY) {
      const translated = await this.translateTextGoogle(exampleEnglishFromModel, "en", "pap");
      example = (translated || "").trim().slice(0, 300);
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
      example,
      english:
        (parsed.english || "")
          .trim()
          .slice(0, 120),
    };
  }

  /*
    Dictionary-grounded definition path — simplified.

    Given dictionary entries pulled from the PDF-derived Dutch-Papiamentu
    dictionary (KV lookup happens in handleDefine before this is called),
    asks Claude to write the Papiamentu definition directly, grounded in
    that dictionary context. One API call, no extra Google round-trip.
  */
  async generateDefinitionFromDictionary(word, display, tags, dictEntry) {
    const dutchWords = [...new Set(dictEntry.map((d) => d.nl))];
    const glosses = dictEntry.map((d) => d.gloss).join("; ");

    const prompt =
      `Papiamentu word: "${display}" (normalisá: "${word}").\n\n` +
      `A Dutch-Papiamentu dictionary shows this word corresponds to the ` +
      `Dutch word(s): ${dutchWords.join(", ")}.\n` +
      `Dictionary entries (Dutch context - Papiamentu usage): ${glosses}\n\n` +
      `Using ONLY this dictionary grounding, give ONLY a valid JSON object, ` +
      `no markdown or extra text, with exactly these three fields:\n` +
      `- "definition": un splikashon kla i natural na Papiamentu ku ta ` +
      `deskribí e palabra "${word}", preferiblemente un frase kòrtiku.\n` +
      `- "exampleEnglish": one natural English sentence that uses the ` +
      `concept behind "${word}" in a realistic context. Do not repeat ` +
      `the definition. Write it in plain English — it will be translated ` +
      `to Papiamentu separately.\n` +
      `- "english": a short English translation (a word or short phrase).\n\n` +
      `If unsure, leave all fields empty ("").`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        ...(this.env.ANTHROPIC_WORKSPACE_ID
          ? { "anthropic-workspace-id": this.env.ANTHROPIC_WORKSPACE_ID }
          : {}),
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Claude dictionary-grounded definition request failed:",
        response.status,
        errorBody
      );
      throw new Error("Model request failed");
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("Could not parse dictionary-grounded definition JSON:", text);
      parsed = {};
    }

    const exampleEnglish = (parsed.exampleEnglish || "").trim().slice(0, 300);
    let example = "";
    if (exampleEnglish && this.env.GOOGLE_TRANSLATE_API_KEY) {
      const translated = await this.translateTextGoogle(exampleEnglish, "en", "pap");
      example = (translated || "").trim().slice(0, 300);
    }

    return {
      display: (display || word).slice(0, 60),
      definition: (parsed.definition || "").trim().slice(0, 500),
      example,
      english: (parsed.english || "").trim().slice(0, 120),
    };
  }

  /*
    THE TRANSLATION ENGINE.

    One job: given a word, return a definition — or null if nothing
    worked. Everything about HOW that happens lives here, in order:

      1. Try the PDF dictionary (KV) + Claude.
      2. If that didn't work, try Google + Claude (the original flow).
      3. If neither worked, return null.

    handleDefine() doesn't know or care which path succeeded — it just
    calls this once, checks for null, and moves on to caching/example
    sentence/D1. All the branching complexity is contained right here.
  */
  async resolveDefinition(word, display, tags) {

    const displayWord =
      String(display || word)
        .normalize("NFC")
        .trim()
        .toLowerCase();

    const normalWord =
      String(word || displayWord)
        .normalize("NFC")
        .trim()
        .toLowerCase();

    if (!this.env.GOOGLE_TRANSLATE_API_KEY) {
      return null;
    }

    const googleMeaning = await this.googleTranslateWord(displayWord);
    if (!googleMeaning?.meaning) {
      return null;
    }

    const definition = await this.translateTextGoogle(
      `This word means: ${googleMeaning.meaning}.`,
      "en",
      "pap"
    );
    if (!definition) {
      return null;
    }

    return {
      display: (display || word).slice(0, 60),
      definition: definition.trim().slice(0, 500),
      example: "",
      english: googleMeaning.meaning,
      source: "google_translate",
      definition_source: "google",
      translation_source: "google",
      source_language: "pap",
      target_language: "en",
      verification_status: "automatic",
      needs_review: 1,
      translation_ambiguous: googleMeaning.needsReview ? 1 : 0,
    };

    /*
      Also try the spelling without accent marks.

      Example:
        mèlè -> mele

      This is useful because different Papiamentu /
      Papiamento dictionary sources may store either
      orthography.
    */
    const unaccentedDisplay =
      displayWord
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .normalize("NFC");

    const unaccentedWord =
      normalWord
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .normalize("NFC");


    // ========================================================
    // ATTEMPT 1
    // Dictionary + Claude
    // ========================================================

    if (
      this.env.PA_DICTIONARY &&
      this.env.ANTHROPIC_API_KEY
    ) {

      try {

        const candidateKeys =
          [...new Set(
            [
              displayWord,
              normalWord,
              unaccentedDisplay,
              unaccentedWord
            ]
              .filter(Boolean)
          )];


        console.log(
          "Dictionary candidates:",
          candidateKeys
        );


        let dictEntry = null;
        let matchedDictionaryKey = null;


        for (
          const candidateKey
          of candidateKeys
        ) {

          const rawDictEntry =
            await this.env.PA_DICTIONARY
              .get(candidateKey);


          if (rawDictEntry) {

            dictEntry =
              JSON.parse(
                rawDictEntry
              );

            matchedDictionaryKey =
              candidateKey;

            break;

          }

        }


        if (
          Array.isArray(dictEntry) &&
          dictEntry.length
        ) {

          console.log(
            "Dictionary match:",
            matchedDictionaryKey
          );


          const result =
            await this.generateDefinitionFromDictionary(
              normalWord,
              displayWord,
              tags,
              dictEntry
            );


          if (
            result?.definition
          ) {

            return {

              ...result,

              source:
                "dictionary",

              definition_source:
                "dictionary",

              translation_source:
                "dictionary",

              source_language:
                "pap",

              target_language:
                "en",

              verification_status:
                "automatic",

              needs_review:
                1,

              translation_ambiguous:
                0

            };

          }

        }

      } catch (e) {

        console.error(
          `Dictionary lookup failed for "${displayWord}", trying Google instead:`,
          e
        );

      }

    }


    // ========================================================
    // ATTEMPT 2
    // Google → Claude
    // ========================================================

    if (
      this.env.GOOGLE_TRANSLATE_API_KEY &&
      this.env.ANTHROPIC_API_KEY
    ) {

      const googleMeaning =
        await this.googleTranslateWord(
          displayWord
        );


      if (
        googleMeaning?.meaning
      ) {

        const result =
          await this.generateDefinition(
            normalWord,
            displayWord,
            tags,
            googleMeaning.meaning
          );


        if (
          result?.definition
        ) {

          return {

            ...result,

            source:
              "google+anthropic",

            definition_source:
              "anthropic",

            translation_source:
              "google",

            source_language:
              "pap",

            target_language:
              "en",

            verification_status:
              "automatic",

            english:
              googleMeaning.meaning,

            needs_review:
              1,

            translation_ambiguous:
              googleMeaning.needsReview
                ? 1
                : 0

          };

        }

      } else {

        console.log(
          `Google returned no usable translation for "${displayWord}".`
        );

      }

    }


    // ========================================================
    // ATTEMPT 3
    // Claude-only fallback
    //
    // Important:
    // This is deliberately marked unverified and needs_review
    // because it has no Google/dictionary grounding.
    // ========================================================

    if (
      this.env.ANTHROPIC_API_KEY
    ) {

      try {

        console.log(
          `Trying Anthropic-only fallback for "${displayWord}".`
        );


        const result =
          await this.generateDefinition(
            normalWord,
            displayWord,
            tags,
            null
          );


        if (
          result?.definition
        ) {

          return {

            ...result,

            source:
              "anthropic-fallback",

            definition_source:
              "anthropic",

            translation_source:
              "anthropic",

            source_language:
              "pap",

            target_language:
              "en",

            verification_status:
              "unverified",

            needs_review:
              1,

            translation_ambiguous:
              1

          };

        }

      } catch (e) {

        console.error(
          `Anthropic fallback failed for "${displayWord}":`,
          e
        );

      }

    }


    console.error(
      `No definition source succeeded for "${displayWord}".`
    );

    return null;

  }


  async ensureAuthSessionsTable() {
    await this.env.GAME_HISTORY
      .prepare(
        `CREATE TABLE IF NOT EXISTS auth_sessions (
          token_hash TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          created_at TEXT DEFAULT (datetime('now')),
          expires_at TEXT NOT NULL
        )`
      )
      .run();

    await this.env.GAME_HISTORY
      .prepare(
        `DELETE FROM auth_sessions
         WHERE expires_at <= datetime('now')`
      )
      .run();
  }

  getCookie(request, name) {
    const header =
      request.headers.get("Cookie") || "";

    for (const item of header.split(";")) {
      const parts =
        item.trim().split("=");

      const key =
        parts.shift();

      if (key === name) {
        return decodeURIComponent(
          parts.join("=")
        );
      }
    }

    return null;
  }

  async hashSessionToken(token) {
    const data =
      new TextEncoder().encode(token);

    const digest =
      await crypto.subtle.digest(
        "SHA-256",
        data
      );

    return Array.from(
      new Uint8Array(digest)
    )
      .map(
        b =>
          b.toString(16).padStart(2, "0")
      )
      .join("");
  }

  async getAuthenticatedUser(request) {
    await this.ensureUsersTable();
    await this.ensureAuthSessionsTable();

    const token =
      this.getCookie(
        request,
        "pdk_session"
      );

    if (!token) {
      return null;
    }

    const tokenHash =
      await this.hashSessionToken(token);

    return await this.env.GAME_HISTORY
      .prepare(
        `SELECT
           u.id,
           u.username
         FROM auth_sessions s
         JOIN users u
           ON u.id = s.user_id
         WHERE s.token_hash = ?
           AND s.expires_at > datetime('now')
         LIMIT 1`
      )
      .bind(tokenHash)
      .first();
  }

  async createSessionResponse(user) {
    await this.ensureAuthSessionsTable();

    const token =
      this.randomHex(32);

    const tokenHash =
      await this.hashSessionToken(token);

    await this.env.GAME_HISTORY
      .prepare(
        `INSERT INTO auth_sessions
           (token_hash, user_id, expires_at)
         VALUES (
           ?,
           ?,
           datetime('now', '+30 days')
         )`
      )
      .bind(
        tokenHash,
        user.id
      )
      .run();

    return new Response(
      JSON.stringify({
        authenticated: true,
        id: user.id,
        username: user.username
      }),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
          "Set-Cookie":
            `pdk_session=${encodeURIComponent(token)}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`
        }
      }
    );
  }

  async handleAuthMe(request) {
    try {
      const user =
        await this.getAuthenticatedUser(
          request
        );

      if (!user) {
        return json(
          {
            authenticated: false
          },
          401
        );
      }

      return json(
        {
          authenticated: true,
          id: user.id,
          username: user.username
        },
        200
      );

    } catch (e) {
      console.error(
        "Auth me error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
    }
  }

  async handleSignout(request) {
    try {
      await this.ensureAuthSessionsTable();

      const token =
        this.getCookie(
          request,
          "pdk_session"
        );

      if (token) {
        const tokenHash =
          await this.hashSessionToken(
            token
          );

        await this.env.GAME_HISTORY
          .prepare(
            `DELETE FROM auth_sessions
             WHERE token_hash = ?`
          )
          .bind(tokenHash)
          .run();
      }

      return new Response(
        JSON.stringify({
          ok: true
        }),
        {
          status: 200,
          headers: {
            "Content-Type":
              "application/json; charset=utf-8",
            "Set-Cookie":
              "pdk_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
          }
        }
      );

    } catch (e) {
      console.error(
        "Signout error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
    }
  }

  async handleUsernameChange(request) {
    try {
      const user =
        await this.getAuthenticatedUser(
          request
        );

      if (!user) {
        return json(
          {
            error: "Not signed in"
          },
          401
        );
      }

      await this.ensureUsersTable();

      const body =
        await request.json();

      const username =
        String(body.username || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 20);

      if (!username) {
        return json(
          {
            error:
              "Username required"
          },
          400
        );
      }

      if (username.length < 3) {
        return json(
          {
            error:
              "Username must be at least 3 characters"
          },
          400
        );
      }

      if (
        username.toLowerCase() ===
        String(user.username || "")
          .toLowerCase()
      ) {
        return json(
          {
            id: user.id,
            username: user.username
          },
          200
        );
      }

      const existing =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT id
             FROM users
             WHERE lower(trim(username))
                   = lower(trim(?))
               AND id != ?
             LIMIT 1`
          )
          .bind(username, user.id)
          .first();

      if (existing) {
        return json(
          {
            error:
              "Username already taken"
          },
          409
        );
      }

      try {
        await this.env.GAME_HISTORY
          .prepare(
            `UPDATE users
             SET username = ?
             WHERE id = ?`
          )
          .bind(username, user.id)
          .run();

      } catch (e) {

        if (
          String(e)
            .toLowerCase()
            .includes("unique")
        ) {
          return json(
            {
              error:
                "Username already taken"
            },
            409
          );
        }

        throw e;
      }

      return json(
        {
          id: user.id,
          username: username
        },
        200
      );

    } catch (e) {
      console.error(
        "Username change error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
    }
  }

  async ensureUsersTable() {
    await this.env.GAME_HISTORY
      .prepare(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))"
      )
      .run();

    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE users ADD COLUMN salt TEXT")
        .run();
    } catch {
      // column already exists
    }

    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE users ADD COLUMN email TEXT")
        .run();
    } catch {
      // column already exists
    }

    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE users ADD COLUMN password_reset_token_hash TEXT")
        .run();
    } catch {
      // column already exists
    }

    try {
      await this.env.GAME_HISTORY
        .prepare("ALTER TABLE users ADD COLUMN password_reset_expires_at TEXT")
        .run();
    } catch {
      // column already exists
    }

    await this.env.GAME_HISTORY
      .prepare(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL"
      )
      .run();
  }

  randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async hashPassword(password, salt) {
    const encoder =
      new TextEncoder();

    const keyMaterial =
      await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );

    const bits =
      await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          hash: "SHA-256",
          salt: encoder.encode(salt),
          iterations: 100000
        },
        keyMaterial,
        256
      );

    return Array.from(
      new Uint8Array(bits)
    )
      .map(
        b =>
          b.toString(16).padStart(2, "0")
      )
      .join("");
  }

  async createPasswordResetToken(userId, passwordHash, expiresAt) {
    const secret = String(this.env.PASSWORD_RESET_SECRET || "");
    if (secret.length < 32) {
      throw new Error("PASSWORD_RESET_SECRET must be at least 32 characters");
    }

    const expiry = expiresAt || Math.floor(Date.now() / 1000) + 30 * 60;
    const payload = `${userId}.${expiry}.${passwordHash}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload)
    );
    const encodedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signature))
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return `${userId}.${expiry}.${encodedSignature}`;
  }

  async verifyPasswordResetToken(token, user) {
    const match = /^(\d+)\.(\d+)\.([A-Za-z0-9_-]{43})$/.exec(token);
    if (!match || Number(match[1]) !== user.id || Number(match[2]) <= Date.now() / 1000) {
      return false;
    }

    const expectedToken = await this.createPasswordResetToken(
      user.id,
      user.password,
      Number(match[2])
    );
    const actualBytes = new TextEncoder().encode(token);
    const expectedBytes = new TextEncoder().encode(expectedToken);
    if (actualBytes.length !== expectedBytes.length) {
      return false;
    }

    let difference = 0;
    for (let index = 0; index < actualBytes.length; index += 1) {
      difference |= actualBytes[index] ^ expectedBytes[index];
    }
    return difference === 0;
  }





  async handleResetPassword(request) {
    try {
      await this.ensureUsersTable();

      const body = await request.json();
      const token = String(body.token || "");
      const password = String(body.password || "");

      if (!/^\d+\.\d+\.[A-Za-z0-9_-]{43}$/.test(token)) {
        return json({ error: "Invalid or expired reset link" }, 400);
      }

      if (password.length < 6) {
        return json({ error: "Password must be at least 6 characters" }, 400);
      }

      const tokenHash = await this.hashSessionToken(token);
      const user = await this.env.GAME_HISTORY
        .prepare(
          `SELECT id, password
           FROM users
           WHERE password_reset_token_hash = ?
             AND password_reset_expires_at > datetime('now')
           LIMIT 1`
        )
        .bind(tokenHash)
        .first();

      if (!user) {
        return json({ error: "Invalid or expired reset link" }, 400);
      }

      if (!(await this.verifyPasswordResetToken(token, user))) {
        return json({ error: "Invalid or expired reset link" }, 400);
      }

      const salt = this.randomHex(16);
      const hashedPassword = await this.hashPassword(password, salt);
      const result = await this.env.GAME_HISTORY
        .prepare(
          `UPDATE users
           SET password = ?,
               salt = ?,
               password_reset_token_hash = NULL,
               password_reset_expires_at = NULL
           WHERE id = ?
             AND password_reset_token_hash = ?
             AND password_reset_expires_at > datetime('now')`
        )
        .bind(hashedPassword, salt, user.id, tokenHash)
        .run();

      if (!result.meta.changes) {
        return json({ error: "Invalid or expired reset link" }, 400);
      }

      await this.ensureAuthSessionsTable();
      await this.env.GAME_HISTORY
        .prepare("DELETE FROM auth_sessions WHERE user_id = ?")
        .bind(user.id)
        .run();

      return json({ ok: true }, 200);
    } catch (e) {
      console.error("Reset password error:", e);
      return json({ error: "Unable to reset password" }, 500);
    }
  }

  async handleSignup(request) {
    try {
      await this.ensureUsersTable();

      const body =
        await request.json();

      const username =
        String(body.username || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 20);

      const password =
        String(body.password || "");

      const email =
        String(body.email || "")
          .trim()
          .toLowerCase()
          .slice(0, 254) || null;

      if (!username || !password) {
        return json(
          {
            error:
              "Username and password required"
          },
          400
        );
      }

      if (password.length < 6) {
        return json(
          {
            error:
              "Password must be at least 6 characters"
          },
          400
        );
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json(
          {
            error:
              "Email invalido"
          },
          400
        );
      }

      const existing =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT id
             FROM users
             WHERE lower(trim(username))
                   = lower(trim(?))
             LIMIT 1`
          )
          .bind(username)
          .first();

      if (existing) {
        return json(
          {
            error:
              "Username already taken"
          },
          409
        );
      }

      const salt =
        this.randomHex(16);

      const hashed =
        await this.hashPassword(
          password,
          salt
        );

      try {
        await this.env.GAME_HISTORY
          .prepare(
            `INSERT INTO users
               (username, password, salt, email)
             VALUES (?, ?, ?, ?)`
          )
          .bind(
            username,
            hashed,
            salt,
            email
          )
          .run();

      } catch (e) {

        if (
          String(e)
            .toLowerCase()
            .includes("users.email")
        ) {
          return json(
            {
              error:
                "This email is already linked to an account"
            },
            409
          );
        }

        if (
          String(e)
            .toLowerCase()
            .includes("unique")
        ) {
          return json(
            {
              error:
                "Username already taken"
            },
            409
          );
        }

        throw e;
      }

      const user =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT id, username
             FROM users
             WHERE lower(trim(username))
                   = lower(trim(?))
             LIMIT 1`
          )
          .bind(username)
          .first();

      return this.createSessionResponse(
        user
      );

    } catch (e) {
      console.error(
        "Signup error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
    }
  }

  async handleSignin(request) {
    try {
      await this.ensureUsersTable();

      const body =
        await request.json();

      const username =
        String(body.username || "")
          .replace(/\s+/g, " ")
          .trim();

      const password =
        String(body.password || "");

      if (!username || !password) {
        return json(
          {
            error:
              "Username and password required"
          },
          400
        );
      }

      const row =
        await this.env.GAME_HISTORY
          .prepare(
            `SELECT
               id,
               username,
               password,
               salt
             FROM users
             WHERE lower(trim(username))
                   = lower(trim(?))
             LIMIT 1`
          )
          .bind(username)
          .first();

      if (!row) {
        return json(
          {
            error:
              "Invalid username or password"
          },
          401
        );
      }

      const hashed =
        await this.hashPassword(
          password,
          row.salt
        );

      if (hashed !== row.password) {
        return json(
          {
            error:
              "Invalid username or password"
          },
          401
        );
      }

      return this.createSessionResponse({
        id: row.id,
        username: row.username
      });

    } catch (e) {
      console.error(
        "Signin error:",
        e
      );

      return json(
        {
          error: "Server error"
        },
        500
      );
    }
  }

}

function escapeHtmlServer(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function moderationPage(message, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Palabra di Kòrsou moderation</title><style>body{margin:0;padding:24px;background:#f4f1ea;color:#081f36;font:16px/1.5 Arial,sans-serif}main{max-width:560px;margin:8vh auto;padding:28px;background:#fff;border:1px solid #ddd6c9}h1{font-size:22px;margin:0 0 12px}</style></head><body><main><h1>Palabra di Kòrsou</h1><p>${escapeHtmlServer(message)}</p></main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function moderationForm(report, token) {
  const field = (label, value) =>
    `<p><strong>${escapeHtmlServer(label)}</strong><br>${escapeHtmlServer(value || "Not provided")}</p>`;
  return new Response(
          `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Edit report</title><style>body{margin:0;padding:16px;background:#f4f1ea;color:#081f36;font:16px/1.5 Arial,sans-serif}main{max-width:560px;margin:0 auto;padding:24px;background:#fff;border:1px solid #ddd6c9}h1{font-size:22px;margin:0 0 20px}label{display:block;font-weight:700;margin:18px 0 6px}textarea,input{width:100%;padding:11px;border:1px solid #c8c0b4;border-radius:4px;font:inherit;box-sizing:border-box}button{border:0;border-radius:4px;padding:12px 16px;margin:18px 8px 0 0;color:#fff;background:#2e7864;font:inherit;font-weight:700}button[name=action]{background:#c1503f}</style></head><body><main><h1>Edit &amp; approve report</h1>${field("Word", report.word)}${field("Current definition", report.current_definition)}${field("Current source", report.current_source)}${field("Player suggestion", report.suggested_definition)}<form method="post" action="/moderate/approve?token=${encodeURIComponent(token)}"><label for="definition">Final definition</label><textarea id="definition" name="definition" rows="4" required>${escapeHtmlServer(report.suggested_definition)}</textarea><label for="source">Reliable source (optional)</label><input id="source" name="source" maxlength="500"><button type="submit" name="action" value="approve">Approve &amp; publish</button><button type="submit" name="action" value="reject" formnovalidate>Reject report</button></form></main></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
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
      <div id="cf-email-hint" style="display:none;padding:10px 12px;background:var(--line);border-radius:8px;font-size:12px;color:var(--dim);line-height:1.4;">
        Esaki parse un email — bo ke usa "<span id="cf-email-hint-value"></span>" komo bo email di rekuperashon i skohe un otro nòmber di uzuario?
        <button type="button" id="cf-use-as-email-btn" style="display:block;margin-top:6px;background:none;border:none;color:var(--flag);font-weight:700;font-size:12px;cursor:pointer;padding:0;text-decoration:underline;">Sí, usa dje</button>
      </div>
      <input class="name-input" id="cf-auth-email" type="email" autocomplete="email" placeholder="Email (opshonal, pa rekuperá bo kuenta)" style="display:none;">
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
      usernameInput=document.getElementById('cf-auth-username'),
      emailInput=document.getElementById('cf-auth-email'),
      emailHint=document.getElementById('cf-email-hint'),
      emailHintValue=document.getElementById('cf-email-hint-value'),
      useAsEmailBtn=document.getElementById('cf-use-as-email-btn'),
      EMAIL_PATTERN=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
      mode='signin';

  function setMode(m){
    mode=m;
    title.textContent = m==='signin' ? 'Drenta' : 'Krea kuenta';
    toggle.textContent = m==='signin' ? 'No tin kuenta? Krea un' : 'Bo tin kuenta kaba? Drenta';
    errorEl.style.display='none';
    emailInput.style.display = m==='signup' ? 'block' : 'none';
    emailHint.style.display='none';
    if(m==='signin'){ emailInput.value=''; }
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
  logoutBtn.addEventListener('click', function(){
    fetch('/api/auth/signout',{
      method:'POST'
    }).finally(function(){
      setSignedOut();
      location.reload();
    });
  });
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
  toggle.addEventListener('click', function(){ setMode(mode==='signin' ? 'signup' : 'signin'); });

  usernameInput.addEventListener('blur', function(){
    if(mode!=='signup') return;
    var value=usernameInput.value.trim();
    if(EMAIL_PATTERN.test(value)){
      emailHintValue.textContent=value;
      emailHint.style.display='block';
    }else{
      emailHint.style.display='none';
    }
  });

  useAsEmailBtn.addEventListener('click', function(){
    emailInput.value=usernameInput.value.trim();
    usernameInput.value='';
    usernameInput.focus();
    emailHint.style.display='none';
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var u=usernameInput.value,
        p=document.getElementById('cf-auth-password').value,
        payload={username:u,password:p};
    if(mode==='signup' && emailInput.value.trim()){
      payload.email=emailInput.value.trim();
    }
    errorEl.style.display='none';
    fetch('/api/auth/'+mode,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    }).then(function(r){return r.json();}).then(function(d){
      if(d.error){
        errorEl.textContent=d.error;
        errorEl.style.display='block';
      }else{
        location.reload();
      }
    }).catch(function(){
      errorEl.textContent='Error di konekshon';
      errorEl.style.display='block';
    });
  });

  window.addEventListener('load', function(){
    fetch('/api/auth/me',{
      method:'GET',
      cache:'no-store'
    })
    .then(function(r){
      if(!r.ok){
        throw new Error('signed out');
      }
      return r.json();
    })
    .then(function(d){
      setSignedIn(d.username);
    })
    .catch(function(){
      setSignedOut();
    });
  });
})();</script>`;