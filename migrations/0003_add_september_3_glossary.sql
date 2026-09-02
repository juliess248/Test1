-- Adds the September 3, 2026 glossary entries.
-- The definition column currently contains the supplied English definition.
-- Review and replace it with Papiamentu before changing verification_status to approved.
-- Run with: npx wrangler d1 execute GAME_HISTORY --remote --file=migrations/0003_add_september_3_glossary.sql

INSERT INTO word_glossary (
  word, display, definition, example, english, source,
  definition_source, translation_source, source_language, target_language,
  verification_status, needs_review
) VALUES
  ('emiti', 'emiti', 'To issue, transmit, or broadcast a signal.', 'TeleCuraçao ta emiti un transmišon en bibu di e marchi di Karnaval direktamente pa kas di e hentenan.', 'emit, issue, transmit, broadcast', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('estetisismo', 'estetisismo', 'A strong devotion to artistic beauty and visual appeal.', 'Artistanan lokal na Willemstad ta mustra nan enfoke riba estetisismo dor di ferf Handelskade ku kolornan briante di Karibe.', 'a devotion to artistic beauty', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('item', 'item', 'A single entry or unit on a list.', 'Un panadero ta chèk kada item riba su lista di mainta promé ku e habri su tienditu na Otrobanda.', 'item, entry, unit on a list', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('meimei', 'meimei', 'Located in the middle, center, or halfway point.', 'Landhuis Brakkeput Mei Mei a haña su nòmber pasobra e ta keda eifòs meimei di e tereno di e plantashi históriko di Brakkeput.', 'in the middle, center, halfway point', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('memo', 'memo', 'A short written note used to share quick operational updates.', 'E meneher di e resòrt ta manda un memo kòrtiku pa notifiká e personal di un barku di krusero ku ta yegando.', 'memo, short written note', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('mest', 'mest', 'To mix ingredients or apply organic fertilizer.', 'Un meitier ta usa mest orgániko pa nutri su kualidat di aloe vera den kunuku.', 'mix ingredients; organic fertilizer', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('meste', 'meste', 'An essential need, requirement, or obligation.', 'Bo meste hiba hopi awa ku bo ora bo ta bai kana subí e seru di Kristòf.', 'must, need to, be required to', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('mete', 'mete', 'To meddle or step into someone else''s personal affairs.', 'Bisiñanan ta faborabel pa mete den chisme di bario ora nan ta kure papia mas di hardin den e friche di atardi.', 'meddle, interfere', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('metí', 'metí', 'To be entangled, deeply involved, or caught up in a situation.', 'Un piskadó lokal ta haña su liña di piska metí den e koral bou di awa ora e ta hara su piska subí.', 'entangled, involved, caught up', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('mimesis', 'mimesis', 'The artistic imitation of real-life human behavior and gestures.', 'Un akteur ta usa mimesis pa e imitá e movesonnam di un kontadó di kuenta tradishonal.', 'artistic imitation, mimicry', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('mito', 'mito', 'A traditional story, myth, or legend passed down through generations.', 'E abuelonan ta konta un mito tokante tesoro skondí di pirata paden di e kuévannan di Hato.', 'myth, legend, traditional story', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('omiti', 'omiti', 'To intentionally leave out or skip a specific detail.', 'E guia di turis ta skohe pa omiti fechanan históriko largu pa keda ku e karakter atrayente pa e meynan.', 'omit, leave out, skip', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('ompi', 'ompi', 'An affectionate, informal term for an uncle or older family friend.', 'Un ompi di edat ta sende su gril tur djadumingu pa un barkakua di famia na playa.', 'uncle; older family friend', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('optimismo', 'optimismo', 'A hopeful, positive outlook regarding future outcomes.', 'Propietarionan di hòtel ta mustra gran optimismo ora reservashon di buelo pa e isla ta oumentá.', 'optimism, hopeful outlook', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('optimo', 'optimo', 'The most ideal, perfect, or favorable condition.', 'Un dia solá ta krea kondishonnan optimo pa bai buseá na e barku hundi di Tugboat.', 'optimal, ideal, most favorable', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('pesimismo', 'pesimismo', 'The expectation or belief that things will turn out poorly.', 'E shofùrnan ta ekspresá pesimismo ora tráfiko di orario di piko ta stanka riba e brùg di Koningina Emma.', 'pessimism, expectation of poor results', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('pesimo', 'pesimo', 'Something dreadful, unpleasant, or of very low quality.', 'Un lobi pisá ta kousa bista pesimo bou di awa kantu di e koral.', 'terrible, unpleasant, very poor', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('pimpi', 'pimpi', 'Sleek, stylish, or sharply dressed in appearance.', 'E hóbennan ta lusi nan karrunan pimpi i modifiká durante koredanan di fin di siman kantu di Caracasbaai.', 'sleek, stylish, sharply dressed', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('pomp', 'pomp', 'A mechanical device used to move liquids or gas.', 'E trahadó di bomb ta usa un pomp pa yena tanki di karrunan na e stashon di disel na Saliña.', 'pump', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('potem', 'potem', 'The main supporting stalk or stem of a plant.', 'Un hardinero ta kòrta un potem gordo for di un mata di suker den kunuku.', 'stalk, stem of a plant', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('semi', 'semi', 'A partial state, half-level, or intermediate degree.', 'Un deportista di windsurf semi-profeshonal ta entrená tur atardi den awa di Sint Joris Bay.', 'semi-, partly, halfway', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('septimo', 'septimo', 'The seventh position in an ordered sequence.', 'Un famia ta selebrá nan séptimo reunion di anja ku un bolo di kashupete tradishonal.', 'seventh', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('sismo', 'sismo', 'A minor earth tremor or seismic vibration.', 'Geólogonan ta midi un sismo chikí detektá kantu di e kosta sur di e isla.', 'earthquake, tremor', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('smet', 'smet', 'A noticeable stain, blemish, or mark left on a surface.', 'Un drop di sop''i iguana ta laga un smet chikí riba su kamisa blanku di lino.', 'stain, blemish, mark', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('somete', 'somete', 'To hand over work for review, judgment, or official approval.', 'E arkitekt lo somete su plannan nobo di edifisio na e ofisina di gobièrnu na Punda.', 'submit, hand over for review', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('stem', 'stem', 'A formal vote, vocal choice, or official expression of opinion.', 'Siudadanonan ta usa nan stem durante elekshon di parlamento pa yuda forma polítika lokal.', 'vote, cast a vote, expression of opinion', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('stom', 'stom', 'A foolish, unthinking, or reckless mistake.', 'Laga un telefòn sin atenshon riba un playa yen di hende ta un eror stom.', 'foolish, reckless, unthinking', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('stompi', 'stompi', 'Blunt, dull, or rounded at the cutting edge.', 'Un busadó ta kambia su kuche stompi promé ku e kòrta e liñanan di piska mará.', 'blunt, dull, rounded', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('teim', 'teim', 'The aromatic culinary herb known as thyme.', 'E koki ta boga teim frens pa duna sabo na e piska kora hurchí na Plasa Bieu.', 'thyme', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('teimoso', 'teimoso', 'Bothersome, persistent, or nagging in an insistent way.', 'Un bendedó di kaya teimoso por bira fastioso ora e sigi turistanan koredó abou di e bulevat.', 'bothersome, persistent, nagging', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('teme', 'teme', 'To feel fear or anxiety toward a potential danger.', 'E landadónan ta teme e korientenan fuerte bou di awa serka di e barankanan di nort.', 'fear, be afraid of', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('temi', 'temi', 'Something widely feared, dreaded, or held in awe.', 'E marineronan ta respeta e olanan temi ku ta bati kontra e barankanan na Shete Boka.', 'feared, dreaded, held in awe', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('tempo', 'tempo', 'Time, a period, or a duration.', 'Mucha i amigonan ta pasa un bon tempo huntu na playa disfrutando di e aire fresku di atardi.', 'time, period, duration', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1),
  ('tomo', 'tomo', 'A tome or single volume in a multi-book collection.', 'Un historiador ta saka un tomo pisá di historia for di e kais di e Archivo Nashonal na Willemstad.', 'tome, volume', 'manual_upload', 'owner_supplied', 'owner_supplied', 'en', 'pap', 'pending_review', 1)
ON CONFLICT(word) DO UPDATE SET
  display = excluded.display,
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
  previous_definition = word_glossary.definition;
