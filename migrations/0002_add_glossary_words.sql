-- Adds/updates glossary entries from a curated Papiamentu word list.
-- Run with: npx wrangler d1 execute GAME_HISTORY --remote --file=migrations/0002_add_glossary_words.sql

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('amarga', 'amarga', 'Amarga ta usá den kòmbersashon di tur dia pa deskribí daño na un bon ambiente (''amarga e ambiente''), i tambe pa hasi kuminda bira marga.', 'To embitter / Make bitter', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('amargo', 'amargo', 'Amargo ta deskribí sabor duru manera kaffi sin sukú òf remedi, òf sintimentu desagradabel i realidat doloroso (''un berdad amargo'').', 'Bitter', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('amor', 'amor', 'Amor ta expresá amor romántiko, kariño profundo di famia, òf ta sirbi komo un palabra karinoso di tur dia (''mi amor'').', 'Love / Affection', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('amorfo', 'amorfo', 'Amorfo ta usá prinsipalmente den konteksto formal, akadémiko, òf sientífiko pa deskribí obhetonan sin forma, ideanan bagu, òf plannan sin struktura.', 'Amorphous / Shapeless', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('arma', 'arma', 'Arma ta referí na arma den konteksto di seguridat òf notisia, òf e akto di tur dia di hula i hinka mueble i mashin huntu (''arma e kùpòt'').', 'Weapon (noun) / To assemble (verb)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('aroma', 'aroma', 'Aroma ta deskribí e holó atraktivo di platunan lokal di e isla (manera stobá òf pastechi frens), kaffi trahá, òf perfumo.', 'Aroma / Pleasant fragrance', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('fama', 'fama', 'Fama ta hiba fuerte e sentido di e reputashon òf nòmber públiko di un persona den komunidat lokal (''tin bon fama'' òf ''mala fama'').', 'Fame / Reputation', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('forma', 'forma', 'Forma ta definí forma físiko, bon komportamentu (''na un bon forma''), òf e akto di kria i guia yu.', 'Shape / Form (noun) / To educate (verb)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('goma', 'goma', 'Goma ta referí riba e isla na tayer di koche, elástiko, pegamentu pa papel, òf gumi pa borá.', 'Rubber / Eraser / Glue / Tire', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('gram', 'gram', 'Gram ta e unidat métriko standard usá den tur supermerkado, panaderia, i merkado lokal di Kòrsou pa pisa kuminda.', 'Gram (unit of weight)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('kama', 'kama', 'Kama ta e palabra standard den kas pa un kama di drumi (''bai kama'' ta nifiká ''bai drumi'').', 'Bed', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('kamara', 'kamara', 'Kamara ta un palabra versátil di e isla usá pa kámara di potret/video, un kamber ofisial (''Kamara di Komersio''), òf un tubu di aire den tayer (''kamara di tayer'').', 'Camera / Official chamber / Inner tube', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('kamarografo', 'kamarografo', 'Kamarografo ta referí na profesional ku ta graba video pa medionan di komunikashon lokal (p.e., TeleCuraçao), eventonan bibo, i Karnaval.', 'Camera operator / Videographer', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('koma', 'koma', 'Koma ta marka frasenan òf estado médiko, ma den kultura di e isla e ta un manera karinoso pa yama mama di bautismo di un yu òf un amiga masha serkano.', 'Comma / Medical coma / Godmother or close female friend', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('komo', 'komo', 'Komo ta un konjunkshon di tur dia usá konstantemente pa konektá frase i introdusí motibu (''Komo mi no tabata tei...'') òf hasi komparashon.', 'As / Since / Because', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('kram', 'kram', 'Kram ta deskribí dolor di músculo sùpito miéntras ta landa na playa, òf grampa i kraf di meta uzá den konstrukshon.', 'Muscle cramp / Metal clamp or staple', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('mago', 'mago', 'Mago ta referí na ilusionista di esenario òf entretenedó kontratá pa fiesta di kumpleaño di mucha i show lokal.', 'Magician / Illusionist', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('mako', 'mako', 'Mako ta referí na e tribon Mako den mar, òf ta sirbi komo slang di kaya riba e isla pa rumor i chisme lokal.', 'Mako shark / Island gossip / Small toad', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('makro', 'makro', 'Makro ta usá den diskushon di negoshi i ekonomia na eskala grandi (''makro-ekonomia'') òf komando grabá di kompiuter.', 'Macro / Large-scale', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('mama', 'mama', 'Mama ta e palabra di famia klave pa mama den kultura di Kòrsou, i tambe ta un verbo ku ta deskribí ora un bebe ta chupa pechu.', 'Mother (noun) / To suckle or breastfeed (verb)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('mara', 'mara', 'Mara ta un verbo di tur dia pa mara zapatu (''mara zapatu''), mara cabey, enbolbe pakete, òf mara boto na haf.', 'To tie / Bind / Fasten', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('maraka', 'maraka', 'Maraka ta un instrumento di ritmo esensial den herensia musikal tradishonal di Kòrsou, spesialmente durante Seú (fiesta di kosecha) i Tumba (Karnaval).', 'Maraca (percussion instrument)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('marga', 'marga', 'Marga ta deskribí kuminda marga (sopropo), te di yerba tradishonal, òf un karakter i aktitud marga.', 'Bitter (taste) / Herbal tea or medicine', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('marka', 'marka', 'Marka ta usá den tiendanan lokal ora ta puntra pa nòmber di marka di un produkto (''Kiko ta e marka?'') òf pone un seña físiko.', 'Brand / Trademark (noun) / To mark (verb)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('marko', 'marko', 'Marko ta referí na struktura di porta i bentana den konstrukshon, òf kuadro pa potret i espejo pa dekorashon di kas.', 'Frame (door, window, or picture)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('mofa', 'mofa', 'Mofa ta referí na e akto di hasi burla òf hari un persona di un manera sin direspekto (''hasi mofa'').', 'Mockery / Ridicule', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('moka', 'moka', 'Moka ta referí na kaffi ku sabor di chokolati na kas di kaffi òf e ketel di traha kaffi stìf usá den kas.', 'Mocha coffee / Stovetop espresso pot', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('morfo', 'morfo', 'Morfo ta keda alabá prinsipalmente komo prefijo akadémiko den estudio di idioma Papiamentu (''morfologia'') òf biologia.', 'Morpho butterfly / Linguistic prefix (''shape'')', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('moro', 'moro', 'Moro ta referí na Aròs Moro, un platu faborito di e isla di aròs ku bonchi, popular na truk''i pan i restorantnan.', 'Moor / Seasoned rice with beans (Aròs Moro)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('rama', 'rama', 'Rama ta usá pa taku di palu rònt e isla (manera Wayaká òf Divi-divi) òf suksursal di banko i negoshi lokal.', 'Branch (tree or business)', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('ramakoko', 'ramakoko', 'Ramakoko ta un palabra típiko di e isla pa e taku di palu di koko òf e palu di koko mes ku ta haña cant''i playa i den hòfi.', 'Coconut palm tree / Coconut frond', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

INSERT INTO word_glossary (word, display, definition, english, source, definition_source, translation_source, source_language, target_language, verification_status, needs_review)
VALUES ('ramo', 'ramo', 'Ramo ta referí na un bosshi di flor regalá pa selebrashon, òf un sektor industrial spesífiko (''den e ramo di turismo'').', 'Bouquet (flowers) / Business sector', 'manual_upload', 'owner_approved', 'owner_approved', 'pap', 'en', 'approved', 0)
ON CONFLICT(word) DO UPDATE SET
  definition = excluded.definition,
  english = excluded.english,
  source = excluded.source,
  definition_source = excluded.definition_source,
  translation_source = excluded.translation_source,
  verification_status = excluded.verification_status,
  previous_definition = word_glossary.definition,
  needs_review = 0;

