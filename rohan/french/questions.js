// Banque de questions — Les Verbes de Français 1A
// Each item: q (question), choices (4 options), answer (must match one choice exactly), rule (one-line reminder shown after answering).
// Add new items to the end of the array. index.html shuffles the order and the choices automatically.

var QUESTIONS = [
  // --- Verbes réguliers en -ER ---
  { q: "Tu ___ (aimer) la musique.", choices: ["aimes", "aime", "aimez", "aimons"], answer: "aimes", rule: "Verbes en -ER : tu → -es" },
  { q: "Nous ___ (parler) français.", choices: ["parlons", "parlent", "parlez", "parle"], answer: "parlons", rule: "Verbes en -ER : nous → -ons" },
  { q: "Vous ___ (regarder) la télé.", choices: ["regardez", "regardes", "regardent", "regardons"], answer: "regardez", rule: "Verbes en -ER : vous → -ez" },
  { q: "Ils ___ (jouer) au foot.", choices: ["jouent", "joues", "joue", "jouez"], answer: "jouent", rule: "Verbes en -ER : ils/elles → -ent" },
  { q: "Elle ___ (chanter) bien.", choices: ["chante", "chantes", "chantent", "chantez"], answer: "chante", rule: "Verbes en -ER : il/elle/on → -e" },
  { q: "___ (habiter) à Palo Alto.", choices: ["J'habite", "Je habite", "J'habites", "Je habites"], answer: "J'habite", rule: "Je → J' devant une voyelle ou un h muet ; je → -e" },
  { q: "On ___ (étudier) le français.", choices: ["étudie", "étudies", "étudient", "étudions"], answer: "étudie", rule: "On se conjugue comme il/elle → -e" },
  { q: "___ (écouter) de la musique.", choices: ["J'écoute", "Je écoute", "J'écoutes", "Je écoutes"], answer: "J'écoute", rule: "Je → J' devant une voyelle ; je → -e" },
  { q: "Je ___ (travailler) le samedi.", choices: ["travaille", "travailles", "travaillons", "travaillez"], answer: "travaille", rule: "Verbes en -ER : je → -e (pas de contraction devant une consonne)" },
  { q: "Tu ___ (danser) bien.", choices: ["danses", "danse", "dansez", "dansent"], answer: "danses", rule: "Verbes en -ER : tu → -es" },

  // --- Verbes en -GER ---
  { q: "Nous ___ (voyager) en France.", choices: ["voyageons", "voyagons", "voyagez", "voyagent"], answer: "voyageons", rule: "Verbes en -GER : nous → -geons (on garde le e)" },
  { q: "Nous ___ (manger) une pizza.", choices: ["mangeons", "mangons", "mangez", "mangent"], answer: "mangeons", rule: "Verbes en -GER : nous → -geons" },
  { q: "Nous ___ (nager) à la piscine.", choices: ["nageons", "nagons", "nagez", "nagent"], answer: "nageons", rule: "Verbes en -GER : nous → -geons" },
  { q: "Nous ___ (partager) le gâteau.", choices: ["partageons", "partagons", "partagez", "partagent"], answer: "partageons", rule: "Verbes en -GER : nous → -geons" },
  { q: "Tu ___ (voyager) beaucoup.", choices: ["voyages", "voyage", "voyageons", "voyagez"], answer: "voyages", rule: "Le -ge- est seulement pour nous ; tu → -es" },
  { q: "Ils ___ (manger) au restaurant.", choices: ["mangent", "mangeent", "mangez", "mangeons"], answer: "mangent", rule: "Le -ge- est seulement pour nous ; ils → -ent" },

  // --- Verbes en -CER ---
  { q: "Nous ___ (commencer) le devoir.", choices: ["commençons", "commencons", "commencez", "commencent"], answer: "commençons", rule: "Verbes en -CER : nous → -çons (c cédille)" },
  { q: "Nous ___ (lancer) le ballon.", choices: ["lançons", "lancons", "lancez", "lancent"], answer: "lançons", rule: "Verbes en -CER : nous → -çons" },
  { q: "Nous ___ (placer) les livres.", choices: ["plaçons", "placons", "placez", "placent"], answer: "plaçons", rule: "Verbes en -CER : nous → -çons" },
  { q: "Vous ___ (commencer) à huit heures.", choices: ["commencez", "commençez", "commences", "commençons"], answer: "commencez", rule: "La cédille est seulement pour nous ; vous → -ez" },

  // --- Verbes « boot » comme préférer ---
  { q: "Je ___ (préférer) le chocolat.", choices: ["préfère", "préfére", "préfères", "préférons"], answer: "préfère", rule: "Verbes « boot » : é → è sauf pour nous et vous" },
  { q: "Nous ___ (préférer) la pizza.", choices: ["préférons", "préfèrons", "préfèrent", "préférez"], answer: "préférons", rule: "Nous et vous gardent l'accent aigu : préférons" },
  { q: "Vous ___ (préférer) le café.", choices: ["préférez", "préfèrez", "préfères", "préférons"], answer: "préférez", rule: "Nous et vous gardent l'accent aigu : préférez" },
  { q: "Ils ___ (préférer) le thé.", choices: ["préfèrent", "préférent", "préfèrons", "préférez"], answer: "préfèrent", rule: "Verbes « boot » : ils → è + -ent" },
  { q: "Tu ___ (espérer) gagner.", choices: ["espères", "espéres", "espère", "espérez"], answer: "espères", rule: "Verbes « boot » : tu → è + -es" },
  { q: "Elle ___ (répéter) la phrase.", choices: ["répète", "répéte", "répètes", "répétons"], answer: "répète", rule: "Verbes « boot » : elle → è + -e" },
  { q: "Nous ___ (espérer) réussir.", choices: ["espérons", "espèrons", "espèrent", "espérez"], answer: "espérons", rule: "Nous et vous gardent l'accent aigu" },

  // --- Verbes réguliers en -RE ---
  { q: "___ (attendre) le bus.", choices: ["J'attends", "Je attends", "J'attend", "Je attend"], answer: "J'attends", rule: "Je → J' devant une voyelle ; verbes en -RE : je → -s" },
  { q: "Tu ___ (attendre) ton ami.", choices: ["attends", "attend", "attendes", "attendez"], answer: "attends", rule: "Verbes en -RE : tu → -s" },
  { q: "Il ___ (attendre) le train.", choices: ["attend", "attends", "attende", "attendent"], answer: "attend", rule: "Verbes en -RE : il/elle/on → pas de terminaison" },
  { q: "Nous ___ (attendre) le professeur.", choices: ["attendons", "attendont", "attendez", "attendent"], answer: "attendons", rule: "Verbes en -RE : nous → -ons" },
  { q: "Vous ___ (attendre) depuis une heure.", choices: ["attendez", "attendes", "attendons", "attendent"], answer: "attendez", rule: "Verbes en -RE : vous → -ez" },
  { q: "Elles ___ (attendre) leurs parents.", choices: ["attendent", "attendes", "attendez", "attend"], answer: "attendent", rule: "Verbes en -RE : ils/elles → -ent" },
  { q: "Tu ___ (répondre) à la question.", choices: ["réponds", "répond", "répondes", "répondez"], answer: "réponds", rule: "Verbes en -RE : tu → -s" },
  { q: "Elle ___ (répondre) au téléphone.", choices: ["répond", "réponds", "réponde", "répondent"], answer: "répond", rule: "Verbes en -RE : il/elle/on → pas de terminaison" },
  { q: "Nous ___ (vendre) des gâteaux.", choices: ["vendons", "vendont", "vendez", "vendent"], answer: "vendons", rule: "Verbes en -RE : nous → -ons" },
  { q: "Ils ___ (vendre) leur maison.", choices: ["vendent", "vendes", "vendez", "vend"], answer: "vendent", rule: "Verbes en -RE : ils/elles → -ent" },
  { q: "Je ___ (perdre) mes clés.", choices: ["perds", "perd", "perde", "perdons"], answer: "perds", rule: "Verbes en -RE : je → -s" },
  { q: "Vous ___ (perdre) le match.", choices: ["perdez", "perdes", "perdons", "perdent"], answer: "perdez", rule: "Verbes en -RE : vous → -ez" },
]
