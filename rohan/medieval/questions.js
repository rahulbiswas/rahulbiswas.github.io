// Question bank — The Fall of Rome & Medieval Europe
// Each item: q (question), choices (4 options), answer (must match one choice exactly), rule (one-line reminder shown after answering).
// Add new items to the end of the array. index.html shuffles the order and the choices automatically.

var QUESTIONS = [
  // --- Rome at Its Greatest ---
  { q: "At its peak, Rome controlled land from Britain to which country?", choices: ["Egypt", "India", "China", "Russia"], answer: "Egypt", rule: "Rome stretched from Britain to Egypt, across three continents." },
  { q: "How many continents did the Roman Empire span at its peak?", choices: ["Three", "Two", "Four", "Five"], answer: "Three", rule: "Europe, Africa, and Asia." },
  { q: "About how many miles of roads connected the Roman Empire?", choices: ["50,000", "5,000", "500", "500,000"], answer: "50,000", rule: "Roads fueled commerce and communication across the empire." },
  { q: "Rome's highly trained soldiers were organized into what?", choices: ["Legions", "Knights", "Militias", "Crusades"], answer: "Legions", rule: "Legions kept order and expanded Rome's borders." },
  { q: "Which of these was part of Rome's sophisticated government?", choices: ["Laws, courts, and administration", "Feudal lords", "Walled castles", "Nomadic tribes"], answer: "Laws, courts, and administration", rule: "Rome governed millions with laws, courts, and administration." },

  // --- The Emperors ---
  { q: "What pattern does the table of late Roman emperors show?", choices: ["Many were murdered or overthrown", "All ruled for decades", "Most died of old age", "Power passed peacefully from father to son"], answer: "Many were murdered or overthrown", rule: "Constant coups and assassinations weakened central leadership." },
  { q: "Who was the last emperor of the Western Roman Empire?", choices: ["Romulus Augustus", "Julius Nepos", "Theodosius I", "Valentinian I"], answer: "Romulus Augustus", rule: "Romulus Augustus ruled 475–476, then Germanic invaders overthrew him." },
  { q: "After 455, Rome had nine emperors in about how many years?", choices: ["21", "50", "100", "5"], answer: "21", rule: "Nine emperors from 455 to 476 — political chaos." },

  // --- Key Dates ---
  { q: "In what year did the Visigoths sack Rome?", choices: ["410", "455", "476", "370"], answer: "410", rule: "410: Visigoths sack Rome." },
  { q: "In what year did the Vandals sack Rome?", choices: ["455", "410", "476", "429"], answer: "455", rule: "455: Vandals sack Rome." },
  { q: "In what year was the last Western Roman emperor overthrown?", choices: ["476", "455", "410", "500"], answer: "476", rule: "476: the Fall of Rome and the start of the Medieval era." },
  { q: "Which tribe crossed into North Africa in 429 and took Carthage in 439?", choices: ["Vandals", "Visigoths", "Huns", "Franks"], answer: "Vandals", rule: "Vandals: North Africa 429, Carthage 439, sacked Rome 455." },
  { q: "Which group was moving along the Dnieper River around 370?", choices: ["Huns", "Vandals", "Angles", "Franks"], answer: "Huns", rule: "The Huns pushed west from Asia, pressing other tribes into Rome." },
  { q: "Which tribe sacked Rome FIRST?", choices: ["Visigoths", "Vandals", "Ostrogoths", "Huns"], answer: "Visigoths", rule: "Visigoths 410, then Vandals 455." },

  // --- Why Rome Fell ---
  { q: "According to the notes, what was one of the MOST significant reasons for the fall of Rome?", choices: ["Invasion from outside tribes", "A volcanic eruption", "The Renaissance", "Too much trade"], answer: "Invasion from outside tribes", rule: "Rome was under constant threat of invasion from all sides." },
  { q: "Where did the Germanic tribes come from?", choices: ["North-central Europe", "Asia", "Africa", "Egypt"], answer: "North-central Europe", rule: "Germanic tribes from the north, Huns from Asia, African tribes from the south." },
  { q: "Where did the Huns come from?", choices: ["Asia", "Africa", "Britain", "Spain"], answer: "Asia", rule: "The Huns came from Asia." },
  { q: "The fall of Rome in the west marked the beginning of which era?", choices: ["The Medieval era", "The Renaissance", "The Modern era", "The Classical era"], answer: "The Medieval era", rule: "476 begins the Middle Ages." },

  // --- Four Buckets: Political / Economic / Military / Social & External ---
  { q: "Which category does this belong to: emperors came and went; coups and civil wars?", choices: ["Political", "Economic", "Military", "Social & External"], answer: "Political", rule: "Power struggles weakened central leadership — political." },
  { q: "Which category does this belong to: rising taxes and inflation?", choices: ["Economic", "Political", "Military", "Social & External"], answer: "Economic", rule: "Taxes, inflation, disrupted trade — economic." },
  { q: "Which category does this belong to: thousands of miles of borders and costly armies?", choices: ["Military", "Economic", "Political", "Social & External"], answer: "Military", rule: "Borders too long, armies too expensive — military." },
  { q: "Which category does this belong to: growing inequality plus Huns and Goths pressing from outside?", choices: ["Social & External", "Political", "Economic", "Military"], answer: "Social & External", rule: "Inequality at home + migrations from outside — social & external." },
  { q: "Which category does this belong to: disrupted trade drained the empire's wealth?", choices: ["Economic", "Military", "Political", "Social & External"], answer: "Economic", rule: "Trade and wealth — economic." },
  { q: "Which category does this belong to: internal conflicts stretched Rome's armies thin?", choices: ["Military", "Social & External", "Economic", "Political"], answer: "Military", rule: "Armies stretched thin — military." },

  // --- Medieval Periods ---
  { q: "The Early Middle Ages lasted from about 476 to what year?", choices: ["1000", "1300", "1450", "800"], answer: "1000", rule: "Early Middle Ages: c. 476–1000." },
  { q: "The High Middle Ages lasted from about 1000 to what year?", choices: ["1300", "1000", "1450", "1500"], answer: "1300", rule: "High Middle Ages: c. 1000–1300." },
  { q: "The Late Middle Ages lasted from about 1300 to what year?", choices: ["1450", "1300", "1000", "1600"], answer: "1450", rule: "Late Middle Ages: c. 1300–1450." },
  { q: "What formed a bridge between the Middle Ages and the modern era?", choices: ["The Renaissance", "The Fall of Rome", "Feudalism", "The Barbarian Invasions"], answer: "The Renaissance", rule: "The Renaissance bridges the Middle Ages and the modern era." },
  { q: "The period from about 500 to 1000 was marked by what?", choices: ["Frequent warfare", "World peace", "Rapid growth of cities", "A powerful central emperor"], answer: "Frequent warfare", rule: "Frequent warfare and a virtual disappearance of Roman order." },

  // --- Who Settled Where ---
  { q: "Where did the Ostrogoths settle?", choices: ["The Italian peninsula", "Modern-day Spain", "Modern-day Britain", "Central Europe"], answer: "The Italian peninsula", rule: "Ostrogoths → Italy." },
  { q: "Where did the Visigoths settle?", choices: ["Modern-day Spain", "The Italian peninsula", "Modern-day Britain", "North Africa"], answer: "Modern-day Spain", rule: "Visigoths → Spain." },
  { q: "Where did the Angles and Saxons settle?", choices: ["Modern-day Britain", "Modern-day Spain", "Central Europe", "The Italian peninsula"], answer: "Modern-day Britain", rule: "Angles & Saxons → Britain." },
  { q: "Where did the Franks settle?", choices: ["Central Europe", "Modern-day Britain", "The Italian peninsula", "North Africa"], answer: "Central Europe", rule: "Franks → central Europe (later led by Charlemagne)." },
  { q: "Which two groups came from Asia?", choices: ["Huns and Magyars", "Angles and Saxons", "Ostrogoths and Visigoths", "Franks and Vandals"], answer: "Huns and Magyars", rule: "Huns and Magyars from Asia; the rest were Germanic." },
  { q: "After the invasions, what change happened to the invading tribes?", choices: ["They became less nomadic and built permanent settlements", "They returned to Asia", "They rebuilt the Roman Empire", "They all converted to Roman law"], answer: "They became less nomadic and built permanent settlements", rule: "Invaders settled down and created kingdoms." },
  { q: "The new kingdoms created by the invaders were mostly what?", choices: ["Short-lived and unstable", "Large and peaceful", "Ruled from Rome", "Democratic"], answer: "Short-lived and unstable", rule: "Unstable, but they started European development away from Rome." },

  // --- Three Primary Goals ---
  { q: "What were the three primary goals of former Roman citizens after the fall?", choices: ["Shelter, Protection, Leadership", "Trade, Roads, Legions", "Art, Religion, Music", "Taxes, Courts, Elections"], answer: "Shelter, Protection, Leadership", rule: "Shelter, Protection, Leadership — the three goals." },
  { q: "Why did people in Feudal Europe build walled cities and castles?", choices: ["For shelter and protection from invaders", "To impress Roman emperors", "For trade with Asia", "Because Roman law required it"], answer: "For shelter and protection from invaders", rule: "Walls and castles answered Goal #1 (Shelter) and Goal #2 (Protection)." },
  { q: "After the fall of Rome, safety was no longer provided by whom?", choices: ["A single ruler", "The local lord", "The church", "The knights"], answer: "A single ruler", rule: "No single ruler meant each region had to protect itself." },
  { q: "Who built Rome's apartments and mansions before the fall?", choices: ["Slaves, designed by professionals", "Knights", "Monks", "Barbarian tribes"], answer: "Slaves, designed by professionals", rule: "After the fall those builders were gone, so shelter had to be rebuilt." },
  { q: "After the fall, the people of the Western Empire still existed, but what was gone?", choices: ["Roman laws and leadership", "All the people", "The land", "The Germanic tribes"], answer: "Roman laws and leadership", rule: "People remained, but Roman law and leadership vanished." },

  // --- Leadership & the Franks ---
  { q: "Which three roles did the most successful medieval leaders combine?", choices: ["Military dictator, peace maker, business man", "King, priest, farmer", "Emperor, senator, general", "Knight, lord, serf"], answer: "Military dictator, peace maker, business man", rule: "The best leaders were a bit of all three." },
  { q: "Which role did most early medieval leaders most resemble?", choices: ["Military dictator", "Peace maker", "Business man", "Philosopher"], answer: "Military dictator", rule: "Little time for diplomacy — most were military dictators." },
  { q: "Charlemagne was the leader of which people?", choices: ["The Franks", "The Visigoths", "The Huns", "The Saxons"], answer: "The Franks", rule: "Charlemagne, leader of the Franks." },
  { q: "Which is the correct order of the three Frankish leaders?", choices: ["Clovis, Charles Martel, Charlemagne", "Charlemagne, Clovis, Charles Martel", "Charles Martel, Charlemagne, Clovis", "Clovis, Charlemagne, Charles Martel"], answer: "Clovis, Charles Martel, Charlemagne", rule: "Clovis → Charles Martel → Charlemagne." },
  { q: "Which of these was NOT a Frankish leader?", choices: ["Romulus Augustus", "Clovis", "Charles Martel", "Charlemagne"], answer: "Romulus Augustus", rule: "Romulus Augustus was the last Roman emperor, not a Frank." },

  // --- Feudalism ---
  { q: "Feudalism granted land and privileges in return for what?", choices: ["Military service and loyalty", "Gold", "Roman citizenship", "Religious conversion"], answer: "Military service and loyalty", rule: "Feudalism: land for military service (loyalty)." },
  { q: "Which leader encouraged feudalism in Europe?", choices: ["Charlemagne", "Romulus Augustus", "Attila the Hun", "Theodosius I"], answer: "Charlemagne", rule: "Charlemagne encouraged the feudal system." },
  { q: "Feudalism developed mainly to meet what need?", choices: ["Order and protection", "Trade with Egypt", "Building roads", "Electing emperors"], answer: "Order and protection", rule: "Restructuring: a need for order and protection." },

  // --- Review Questions (Slide 14) ---
  { q: "After the fall of Rome, people were mainly concerned with figuring out ___.", choices: ["how to survive: shelter, protection, and leadership", "how to build more roads", "how to elect a new emperor", "how to trade with China"], answer: "how to survive: shelter, protection, and leadership", rule: "Review #1: survival — shelter, protection, leadership." },
  { q: "Why did small kingdoms develop instead of a giant empire?", choices: ["Roman law and leadership were gone, and each tribe carved out its own region", "The Romans wanted smaller kingdoms", "The pope divided the land", "Trade made empires unnecessary"], answer: "Roman law and leadership were gone, and each tribe carved out its own region", rule: "Review #2: no single ruler + tribes settling in separate regions." },
  { q: "Why was life in a developing kingdom not easy?", choices: ["Invasions continued, kingdoms were unstable, and there were no laws", "There was too much food", "Everyone was too rich", "The Roman army protected everyone"], answer: "Invasions continued, kingdoms were unstable, and there were no laws", rule: "Review #3: constant invasions, instability, no laws, military dictators." },
  { q: "What system was used to solve the problems Europe was facing after Rome fell?", choices: ["Feudalism", "Democracy", "The Roman Republic", "Communism"], answer: "Feudalism", rule: "Review #4: feudalism — land for loyalty and military service." },
];
