'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

// Historische karakters per tijdperk
const HISTORICAL_PERIODS = {
  roman: {
    name: "Het Romeinse Rijk",
    icon: "🏛️",
    color: "red",
    description: "27 v.Chr. - 476 n.Chr.",
    characters: [
      {
        id: "julius-caesar",
        name: "Julius Caesar",
        title: "Romeins Generaal & Dictator",
        period: "100-44 v.Chr.",
        icon: "👑",
        description: "Beroemde Romeinse generaal die Gallië veroverde en de Republiek omvormde",
        personality: "Ambitieus, charismatisch, strategisch denker",
        background: "Ik ben Gaius Julius Caesar, geboren in een patricische familie. Ik heb Gallië veroverd, de Rubicon overgestoken en Rome getransformeerd. Mijn militaire campagnes en politieke hervormingen hebben de geschiedenis voor altijd veranderd.",
        expertise: ["Militaire strategie", "Politiek", "Romeinse geschiedenis", "Gallische oorlogen", "Romeinse wet"],
        funFacts: [
          "Ik ben de eerste Romein die Brittannië heeft bezocht",
          "Mijn naam werd de basis voor het woord 'keizer' (Kaiser, Czar)",
          "Ik heb de Juliaanse kalender ingevoerd die bijna 1600 jaar werd gebruikt"
        ],
        historicalConnections: ["Marcus Antonius", "Cleopatra", "Brutus", "Cicero"],
        timelineEvents: [
          { year: "59 v.Chr.", event: "Consul van Rome" },
          { year: "58-50 v.Chr.", event: "Verovering van Gallië" },
          { year: "49 v.Chr.", event: "Oversteek van de Rubicon" },
          { year: "44 v.Chr.", event: "Vermoord op de Iden van Maart" }
        ]
      },
      {
        id: "marcus-aurelius",
        name: "Marcus Aurelius",
        title: "Filosoof-Keizer",
        period: "121-180 n.Chr.",
        icon: "🧠",
        description: "De laatste van de 'Vijf Goede Keizers', bekend om zijn filosofische geschriften",
        personality: "Wijze, bedachtzaam, stoïcijns, rechtvaardig",
        background: "Ik ben Marcus Aurelius, keizer van Rome en aanhanger van de stoïcijnse filosofie. Mijn 'Zelfbeschouwingen' reflecteren mijn gedachten over leiderschap, deugd en de menselijke natuur tijdens mijn regering.",
        expertise: ["Stoïcijnse filosofie", "Leiderschap", "Romeinse politiek", "Ethiek", "Zelfverbetering"],
        funFacts: [
          "Ik schreef mijn 'Zelfbeschouwingen' tijdens militaire campagnes",
          "Ik ben de laatste keizer van de Pax Romana",
          "Mijn adoptievader was keizer Antoninus Pius"
        ],
        historicalConnections: ["Antoninus Pius", "Lucius Verus", "Commodus"],
        timelineEvents: [
          { year: "161 n.Chr.", event: "Wordt keizer van Rome" },
          { year: "161-166 n.Chr.", event: "Parthische oorlogen" },
          { year: "167-180 n.Chr.", event: "Marcomannenoorlogen" },
          { year: "180 n.Chr.", event: "Sterft in Vindobona (Wenen)" }
        ]
      },
      {
        id: "spartacus",
        name: "Spartacus",
        title: "Gladiator & Rebellenleider",
        period: "111-71 v.Chr.",
        icon: "⚔️",
        description: "Thracische gladiator die de grootste slavenopstand in de Romeinse geschiedenis leidde",
        personality: "Moedig, vastberaden, charismatisch leider",
        background: "Ik ben Spartacus, ooit een vrije Thraciër, later gladiator in Capua. Ik leidde een opstand van slaven tegen Rome die drie jaar duurde. Wij vochten voor vrijheid tegen de onderdrukking.",
        expertise: ["Gladiatorengevechten", "Militaire tactiek", "Slavernij in Rome", "Opstand en rebellie", "Thracische cultuur"],
        funFacts: [
          "Mijn leger groeide van 70 naar 120.000 rebellen",
          "Ik versloeg meerdere Romeinse legers voordat ik werd verslagen",
          "Mijn opstand inspireerde latere vrijheidsbewegingen"
        ],
        historicalConnections: ["Crixus", "Oenomaus", "Marcus Crassus", "Pompejus"],
        timelineEvents: [
          { year: "73 v.Chr.", event: "Ontsnapping uit gladiatorenschool Capua" },
          { year: "73-72 v.Chr.", event: "Overwinningen in Zuid-Italië" },
          { year: "72 v.Chr.", event: "Mars naar het noorden" },
          { year: "71 v.Chr.", event: "Nederlaag en dood in Apulië" }
        ]
      },
      {
        id: "cleopatra",
        name: "Cleopatra VII",
        title: "Koningin van Egypte",
        period: "69-30 v.Chr.",
        icon: "👸",
        description: "Laatste farao van Egypte, bekend om haar intelligentie en politieke allianties",
        personality: "Intelligent, diplomatiek, charismatisch, meertalig",
        background: "Ik ben Cleopatra VII, koningin van Egypte en laatste van de Ptolemeeën. Ik spreek negen talen en heb allianties gesmeed met Julius Caesar en Marcus Antonius om Egypte's onafhankelijkheid te behouden.",
        expertise: ["Egyptische cultuur", "Diplomatie", "Ptolemeeënse dynastie", "Romeins-Egyptische relaties", "Oude talen"],
        funFacts: [
          "Ik ben de eerste Ptolemeeër die Egyptisch leerde spreken",
          "Mijn bibliotheek van Alexandrië was de grootste ter wereld",
          "Ik financierde wetenschappelijk onderzoek en kunsten"
        ],
        historicalConnections: ["Julius Caesar", "Marcus Antonius", "Octavianus", "Ptolemeus XIII"],
        timelineEvents: [
          { year: "51 v.Chr.", event: "Wordt koningin van Egypte" },
          { year: "48 v.Chr.", event: "Ontmoet Julius Caesar" },
          { year: "41 v.Chr.", event: "Alliantie met Marcus Antonius" },
          { year: "30 v.Chr.", event: "Zelfmoord na nederlaag bij Actium" }
        ]
      },
      {
        id: "cicero",
        name: "Marcus Tullius Cicero",
        title: "Redenaar & Filosoof",
        period: "106-43 v.Chr.",
        icon: "📜",
        description: "Grootste redenaar van Rome, verdediger van de Republiek",
        personality: "Welbespraakt, principieel, intellectueel, republikeins",
        background: "Ik ben Cicero, advocaat, redenaar en filosoof. Mijn speeches tegen Marcus Antonius en mijn verdediging van de Romeinse Republiek hebben mij beroemd gemaakt. Ik geloof in de kracht van woorden en recht.",
        expertise: ["Retorica", "Romeinse wet", "Filosofie", "Politieke theorie", "Republikeinse waarden"],
        funFacts: [
          "Mijn Filippica's tegen Antonius kostten me uiteindelijk mijn leven",
          "Ik introduceerde Griekse filosofie in de Romeinse cultuur",
          "Mijn brieven geven ons het beste beeld van het late Republikeinse Rome"
        ],
        historicalConnections: ["Julius Caesar", "Marcus Antonius", "Octavianus", "Catiline"],
        timelineEvents: [
          { year: "63 v.Chr.", event: "Consul, ontmaskert Catilina samenzwering" },
          { year: "58 v.Chr.", event: "Ballingschap door Clodius" },
          { year: "44 v.Chr.", event: "Filippica's tegen Marcus Antonius" },
          { year: "43 v.Chr.", event: "Vermoord op bevel van Antonius" }
        ]
      }
    ]
  },
  wwii: {
    name: "De Tweede Wereldoorlog",
    icon: "⚔️",
    color: "gray",
    description: "1939-1945",
    characters: [
      {
        id: "winston-churchill",
        name: "Winston Churchill",
        title: "Britse Premier",
        period: "1874-1965",
        icon: "🇬🇧",
        description: "Britse premier die Groot-Brittannië door de Tweede Wereldoorlog leidde",
        personality: "Vastberaden, welbespraakt, optimistisch, strategisch",
        background: "Ik ben Winston Churchill, premier van Groot-Brittannië tijdens onze donkerste uren. Met mijn speeches en vastberadenheid heb ik het Britse volk geïnspireerd om vol te houden tegen de nazi-dreiging.",
        expertise: ["Britse politiek", "Militaire strategie", "Oorlogsvoering", "Diplomatie", "Leiderschap in crisis"],
        funFacts: [
          "Ik won de Nobelprijs voor Literatuur in 1953",
          "Ik schilderde meer dan 500 kunstwerken",
          "Mijn moeder was Amerikaans, mijn vader Brits"
        ],
        historicalConnections: ["Franklin Roosevelt", "Joseph Stalin", "Charles de Gaulle", "Dwight Eisenhower"],
        timelineEvents: [
          { year: "1940", event: "Wordt premier tijdens Duitse invasie" },
          { year: "1940", event: "Battle of Britain speech" },
          { year: "1941", event: "Ontmoet Roosevelt - Atlantisch Handvest" },
          { year: "1945", event: "VE Day - overwinning in Europa" }
        ]
      },
      {
        id: "anne-frank",
        name: "Anne Frank",
        title: "Joods meisje in onderduik",
        period: "1929-1945",
        icon: "📖",
        description: "Joods meisje dat haar ervaringen in het Achterhuis documenteerde",
        personality: "Hoopvol, intelligent, gevoelig, vastberaden",
        background: "Ik ben Anne Frank. Samen met mijn familie zit ik ondergedoken in het Achterhuis in Amsterdam. In mijn dagboek schrijf ik over mijn dromen, angsten en hoop voor de toekomst, ondanks de verschrikkingen om ons heen.",
        expertise: ["Joods leven tijdens WWII", "Onderduik in Nederland", "Dagboek schrijven", "Jeugd tijdens oorlog", "Holocaust ervaring"],
        funFacts: [
          "Mijn dagboek werd vertaald in meer dan 70 talen",
          "Ik droomde ervan om journalist of schrijver te worden",
          "Ik schreef ook verhalen en sprookjes naast mijn dagboek"
        ],
        historicalConnections: ["Otto Frank", "Margot Frank", "Familie van Pels", "Johannes Kleiman"],
        timelineEvents: [
          { year: "1942", event: "Gaat onderduiken in het Achterhuis" },
          { year: "1942-1944", event: "Schrijft dagboek in onderduik" },
          { year: "1944", event: "Arrestatie en deportatie" },
          { year: "1945", event: "Sterft in Bergen-Belsen" }
        ]
      },
      {
        id: "dwight-eisenhower",
        name: "Dwight D. Eisenhower",
        title: "Geallieerde Opperbevelhebber",
        period: "1890-1969",
        icon: "⭐",
        description: "Amerikaans generaal die D-Day en de bevrijding van Europa leidde",
        personality: "Strategisch, diplomatiek, besluitvaardig, samenwerkend",
        background: "Ik ben Dwight Eisenhower, opperbevelhebber van de geallieerde strijdkrachten in Europa. Ik heb D-Day georganiseerd en geleid, de grootste amfibische invasie in de geschiedenis.",
        expertise: ["Militaire strategie", "D-Day operatie", "Geallieerde samenwerking", "Oorlogsplanning", "Leiderschap"],
        funFacts: [
          "Ik werd later de 34e president van de Verenigde Staten",
          "Ik had een brief klaar voor als D-Day zou mislukken",
          "Ik speelde golf met meer dan 100 verschillende partners"
        ],
        historicalConnections: ["Winston Churchill", "Franklin Roosevelt", "Bernard Montgomery", "George Patton"],
        timelineEvents: [
          { year: "1942", event: "Benoemd tot bevelhebber Operatie Torch" },
          { year: "1943", event: "Leidt invasie van Sicilië en Italië" },
          { year: "1944", event: "D-Day - Operatie Overlord" },
          { year: "1945", event: "Duitse overgave in Reims" }
        ]
      },
      {
        id: "resistance-fighter",
        name: "Marie Dubois",
        title: "Franse Verzetsstrijder",
        period: "1920-2010",
        icon: "🕊️",
        description: "Fictieve Franse verzetsstrijder gebaseerd op echte verhalen",
        personality: "Moedig, vindingrijk, patriottisch, vastberaden",
        background: "Ik ben Marie, een Franse verzetsstrijder. Ik help geallieerde piloten ontsnappen, verzamel informatie over Duitse troepenbewegingen en organiseer sabotageacties. Elke dag riskeer ik mijn leven voor de vrijheid van Frankrijk.",
        expertise: ["Frans verzet", "Sabotage technieken", "Ondergrondse netwerken", "Bezet Frankrijk", "Burgerlijke moed"],
        funFacts: [
          "Vrouwen vormden 15-20% van het Franse verzet",
          "Ik gebruik codenamen en geheime berichten",
          "Ik help bij de 'Comet Line' om piloten te evacueren"
        ],
        historicalConnections: ["Charles de Gaulle", "Jean Moulin", "Lucie Aubrac", "Nancy Wake"],
        timelineEvents: [
          { year: "1940", event: "Duitse bezetting van Frankrijk" },
          { year: "1941", event: "Sluit me aan bij het verzet" },
          { year: "1943", event: "Organiseer sabotage spoorlijnen" },
          { year: "1944", event: "Helpt bij voorbereiding D-Day" }
        ]
      },
      {
        id: "german-soldier",
        name: "Hans Mueller",
        title: "Duitse Soldaat",
        period: "1918-1995",
        icon: "🪖",
        description: "Fictieve Duitse soldaat die de oorlog van de andere kant meemaakte",
        personality: "Conflicted, menselijk, nadenkend, spijt",
        background: "Ik ben Hans, een gewone Duitse soldaat. Ik werd opgeroepen voor militaire dienst en heb gevochten aan het Oostfront. Ik heb verschrikkelijke dingen gezien en gedaan waar ik spijt van heb. Niet alle Duitsers waren nazi's.",
        expertise: ["Duitse militaire ervaring", "Oostfront", "Gewone soldaat perspectief", "Oorlogstrauma", "Naoorlogse reflectie"],
        funFacts: [
          "Miljoenen Duitse soldaten waren gewone burgers",
          "Veel soldaten wisten niet van de Holocaust",
          "Na de oorlog hielp ik bij de wederopbouw"
        ],
        historicalConnections: ["Erwin Rommel", "Heinz Guderian", "Duitse burgers", "Krijgsgevangenen"],
        timelineEvents: [
          { year: "1939", event: "Opgeroepen voor militaire dienst" },
          { year: "1941", event: "Operatie Barbarossa - invasie USSR" },
          { year: "1943", event: "Slag om Stalingrad" },
          { year: "1945", event: "Krijgsgevangenschap en terugkeer" }
        ]
      }
    ]
  }
}

// Suggestievragen per karakter
const SUGGESTED_QUESTIONS = {
  "julius-caesar": [
    "Hoe voelde het om de Rubicon over te steken?",
    "Wat was je grootste militaire overwinning?",
    "Waarom wilde je dictator worden?",
    "Hoe was je relatie met Cleopatra?"
  ],
  "marcus-aurelius": [
    "Wat betekent stoïcisme voor jou?",
    "Hoe combineer je filosofie met regeren?",
    "Wat is je beste levensadvies?",
    "Hoe ga je om met stress als keizer?"
  ],
  "spartacus": [
    "Hoe was het leven als gladiator?",
    "Waarom begon je de opstand?",
    "Hoe motiveerde je je rebellen?",
    "Wat betekende vrijheid voor jou?"
  ],
  "cleopatra": [
    "Hoe was het om de laatste farao te zijn?",
    "Vertel over je relatie met Julius Caesar",
    "Hoe behield je Egypte's macht?",
    "Welke talen sprak je allemaal?"
  ],
  "cicero": [
    "Wat maakt een goede speech?",
    "Waarom verdedigde je de Republiek?",
    "Hoe belangrijk is retorica?",
    "Wat vind je van Julius Caesar?"
  ],
  "winston-churchill": [
    "Hoe hield je Engeland moed in tijdens de Blitz?",
    "Wat was je beroemdste speech?",
    "Hoe werkte je samen met Roosevelt?",
    "Wat betekende D-Day voor jou?"
  ],
  "anne-frank": [
    "Hoe was het leven in het Achterhuis?",
    "Waarom schreef je een dagboek?",
    "Wat waren je dromen voor de toekomst?",
    "Hoe bleef je hoopvol in donkere tijden?"
  ],
  "dwight-eisenhower": [
    "Hoe plande je D-Day?",
    "Wat was het moeilijkste aan leiderschap?",
    "Hoe werkte je met andere geallieerde leiders?",
    "Wat voelde je op 6 juni 1944?"
  ],
  "resistance-fighter": [
    "Hoe organiseerde je sabotageacties?",
    "Wat was het gevaarlijkste moment?",
    "Hoe communiceerde het verzet?",
    "Waarom riskeerde je je leven?"
  ],
  "german-soldier": [
    "Hoe was het leven aan het Oostfront?",
    "Wat dacht je over de oorlog?",
    "Hoe ging je om met oorlogstrauma?",
    "Wat leerde je van de oorlog?"
  ]
}

// Historische quiz vragen
const QUIZ_QUESTIONS = {
  roman: [
    {
      question: "In welk jaar stak Julius Caesar de Rubicon over?",
      options: ["50 v.Chr.", "49 v.Chr.", "48 v.Chr.", "47 v.Chr."],
      correct: 1,
      explanation: "Caesar stak de Rubicon over in 49 v.Chr., wat het begin markeerde van de burgeroorlog."
    },
    {
      question: "Welke filosofie volgde Marcus Aurelius?",
      options: ["Epicurisme", "Stoïcisme", "Platonisme", "Aristotelisme"],
      correct: 1,
      explanation: "Marcus Aurelius was een toegewijde stoïcijn en schreef zijn 'Zelfbeschouwingen' vanuit deze filosofie."
    },
    {
      question: "Hoeveel jaar duurde Spartacus' opstand?",
      options: ["1 jaar", "2 jaar", "3 jaar", "4 jaar"],
      correct: 2,
      explanation: "De opstand van Spartacus duurde van 73-71 v.Chr., dus ongeveer 3 jaar."
    }
  ],
  wwii: [
    {
      question: "Op welke datum vond D-Day plaats?",
      options: ["5 juni 1944", "6 juni 1944", "7 juni 1944", "8 juni 1944"],
      correct: 1,
      explanation: "D-Day vond plaats op 6 juni 1944, de grootste amfibische invasie in de geschiedenis."
    },
    {
      question: "Hoeveel jaar zat Anne Frank ondergedoken?",
      options: ["1 jaar", "2 jaar", "3 jaar", "4 jaar"],
      correct: 1,
      explanation: "Anne Frank zat van juli 1942 tot augustus 1944 ondergedoken, ongeveer 2 jaar."
    },
    {
      question: "Welke operatie leidde Eisenhower in Noord-Afrika?",
      options: ["Operatie Torch", "Operatie Husky", "Operatie Overlord", "Operatie Market Garden"],
      correct: 0,
      explanation: "Operatie Torch was de geallieerde invasie van Noord-Afrika in 1942, geleid door Eisenhower."
    }
  ]
}

interface Message {
  id: string
  type: 'user' | 'character' | 'system'
  content: string
  timestamp: Date
  characterId?: string
  isQuiz?: boolean
  quizData?: any
}

export default function HistoryChat() {
  const [selectedPeriod, setSelectedPeriod] = useState<'roman' | 'wwii' | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState('')
  const [showCharacterInfo, setShowCharacterInfo] = useState(false)
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true)
  const [conversationCount, setConversationCount] = useState(0)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingResponse])

  const startNewConversation = (character: any) => {
    setSelectedCharacter(character)
    setConversationCount(0)
    setShowSuggestedQuestions(true)
    setMessages([
      {
        id: 'welcome',
        type: 'character',
        content: `Groetingen! Ik ben **${character.name}**, ${character.title}. ${character.background}\n\n🎯 **Mijn expertise:** ${character.expertise.join(', ')}\n\n💡 **Leuke feiten over mij:**\n${character.funFacts.map(fact => `• ${fact}`).join('\n')}\n\nWat zou je graag willen weten over mijn tijd of mijn ervaringen? Je kunt me alles vragen!`,
        timestamp: new Date(),
        characterId: character.id
      }
    ])
  }

  const askSuggestedQuestion = (question: string) => {
    setInputMessage(question)
    setShowSuggestedQuestions(false)
  }

  const startQuiz = () => {
    const periodQuestions = QUIZ_QUESTIONS[selectedPeriod!]
    const randomQuestion = periodQuestions[Math.floor(Math.random() * periodQuestions.length)]
    
    setCurrentQuiz(randomQuestion)
    
    const quizMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `🧠 **Geschiedenis Quiz!**\n\n**${randomQuestion.question}**\n\n${randomQuestion.options.map((option, index) => `${index + 1}. ${option}`).join('\n')}\n\nKlik op het juiste antwoord!`,
      timestamp: new Date(),
      isQuiz: true,
      quizData: randomQuestion
    }
    
    setMessages(prev => [...prev, quizMessage])
  }

  const answerQuiz = (selectedIndex: number) => {
    if (!currentQuiz) return
    
    const isCorrect = selectedIndex === currentQuiz.correct
    const resultMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: `${isCorrect ? '🎉 **Correct!**' : '❌ **Helaas, dat is niet juist.**'}\n\n**Het juiste antwoord is:** ${currentQuiz.options[currentQuiz.correct]}\n\n**Uitleg:** ${currentQuiz.explanation}`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, resultMessage])
    setCurrentQuiz(null)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedCharacter || isLoading || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsStreaming(false)
    setStreamingResponse('')
    setConversationCount(prev => prev + 1)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Enhanced character-specific prompt with more interactive elements
      const characterPrompt = `Je bent ${selectedCharacter.name}, ${selectedCharacter.title} (${selectedCharacter.period}). 

KARAKTER INFORMATIE:
- Persoonlijkheid: ${selectedCharacter.personality}
- Achtergrond: ${selectedCharacter.background}
- Expertise: ${selectedCharacter.expertise.join(', ')}
- Historische connecties: ${selectedCharacter.historicalConnections.join(', ')}

INSTRUCTIES VOOR INTERACTIEVE GESPREKKEN:
1. Antwoord ALTIJD in de eerste persoon als ${selectedCharacter.name}
2. Gebruik historisch accurate informatie uit jouw tijdperk
3. Spreek Nederlands, maar gebruik soms historische termen en uitdrukkingen
4. Toon je persoonlijkheid, emoties en menselijke kant
5. Verwijs naar echte gebeurtenissen, mensen en plaatsen uit jouw tijd
6. Vertel persoonlijke anekdotes en ervaringen
7. Stel soms tegenvragen om het gesprek interactiever te maken
8. Gebruik emoji's en markdown voor levendige verhalen
9. Verwijs naar andere historische figuren die je kende
10. Deel interessante details over dagelijks leven in jouw tijd
11. Als je iets niet weet, geef dat eerlijk toe vanuit je karakter
12. Houd antwoorden boeiend en educatief voor middelbare scholieren
13. Gebruik maximaal 250 woorden per antwoord
14. Eindig soms met een vraag terug aan de leerling

SPECIALE ELEMENTEN:
- Vertel over je gevoelens en motivaties
- Beschrijf zintuiglijke ervaringen (geuren, geluiden, bezienswaardigheden)
- Gebruik historische details die niet in schoolboeken staan
- Maak vergelijkingen met de moderne tijd
- Deel "geheimen" of minder bekende feiten

VRAAG VAN LEERLING: ${inputMessage}

Antwoord als ${selectedCharacter.name} met passie en persoonlijkheid:`

      // Start streaming request
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: characterPrompt,
          aiModel: 'smart' // Use smart model for good balance
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsLoading(false)
      setIsStreaming(true)

      // Process streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No readable stream available')
      }

      let buffer = ''
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.message || 'Streaming error')
              }
              
              if (data.done) {
                setIsStreaming(false)
                
                // Add final message
                const characterMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  type: 'character',
                  content: fullResponse,
                  timestamp: new Date(),
                  characterId: selectedCharacter.id
                }
                
                setMessages(prev => [...prev, characterMessage])
                setStreamingResponse('')
                
                // After 3 conversations, suggest a quiz
                if (conversationCount >= 2 && Math.random() > 0.5) {
                  setTimeout(() => {
                    const quizSuggestion: Message = {
                      id: (Date.now() + 2).toString(),
                      type: 'system',
                      content: `🎓 **Tijd voor een quiz!**\n\nJe hebt al een paar interessante gesprekken gehad. Wil je je kennis testen met een geschiedenisquiz over ${HISTORICAL_PERIODS[selectedPeriod!].name}?`,
                      timestamp: new Date()
                    }
                    setMessages(prev => [...prev, quizSuggestion])
                  }, 2000)
                }
                
                return
              }
              
              if (data.token) {
                fullResponse += data.token
                setStreamingResponse(fullResponse)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      setIsLoading(false)
      setIsStreaming(false)
      
      if (error.name !== 'AbortError') {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'character',
          content: `*Er is een fout opgetreden bij het laden van mijn antwoord. Probeer het opnieuw.*`,
          timestamp: new Date(),
          characterId: selectedCharacter.id
        }
        
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      abortControllerRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setSelectedPeriod(null)
    setSelectedCharacter(null)
    setMessages([])
    setInputMessage('')
    setStreamingResponse('')
    setConversationCount(0)
    setCurrentQuiz(null)
  }

  if (!selectedPeriod) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Kies een Tijdperk
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(HISTORICAL_PERIODS).map(([key, period]) => (
            <div
              key={key}
              onClick={() => setSelectedPeriod(key as 'roman' | 'wwii')}
              className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br ${
                period.color === 'red' 
                  ? 'from-red-50 to-red-100 border-red-200 hover:border-red-400' 
                  : 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{period.icon}</div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  period.color === 'red' ? 'text-red-800' : 'text-gray-800'
                }`}>
                  {period.name}
                </h3>
                <p className={`text-lg mb-4 ${
                  period.color === 'red' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {period.description}
                </p>
                <p className={`text-sm ${
                  period.color === 'red' ? 'text-red-700' : 'text-gray-700'
                }`}>
                  {period.characters.length} karakters beschikbaar
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!selectedCharacter) {
    const period = HISTORICAL_PERIODS[selectedPeriod]
    
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {period.icon} {period.name}
          </h2>
          <button
            onClick={() => setSelectedPeriod(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Terug naar tijdperken
          </button>
        </div>
        
        <p className="text-gray-600 mb-8 text-center">
          Kies een historisch karakter om mee te praten:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {period.characters.map((character) => (
            <div
              key={character.id}
              onClick={() => startNewConversation(character)}
              className="cursor-pointer p-6 rounded-xl border-2 border-gray-200 hover:border-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-amber-50 to-orange-50"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{character.icon}</div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  {character.name}
                </h3>
                <p className="text-amber-700 font-medium mb-2">
                  {character.title}
                </p>
                <p className="text-amber-600 text-sm mb-3">
                  {character.period}
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  {character.description}
                </p>
                <div className="text-xs text-gray-600">
                  <strong>Expertise:</strong> {character.expertise.slice(0, 2).join(', ')}
                  {character.expertise.length > 2 && '...'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{selectedCharacter.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
              <p className="text-amber-100">{selectedCharacter.title} • {selectedCharacter.period}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCharacterInfo(!showCharacterInfo)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              title="Karakter informatie"
            >
              ℹ️
            </button>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              title="Tijdlijn"
            >
              📅
            </button>
            <button
              onClick={startQuiz}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              title="Start quiz"
            >
              🧠
            </button>
            <button
              onClick={() => setSelectedCharacter(null)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ← Andere persoon
            </button>
            <button
              onClick={resetChat}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              🏠 Hoofdmenu
            </button>
          </div>
        </div>
      </div>

      {/* Character Info Panel */}
      {showCharacterInfo && (
        <div className="bg-amber-50 border-b border-amber-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-amber-800 mb-2">🎭 Persoonlijkheid</h4>
              <p className="text-amber-700 text-sm">{selectedCharacter.personality}</p>
            </div>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">🤝 Historische Connecties</h4>
              <p className="text-amber-700 text-sm">{selectedCharacter.historicalConnections.join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Panel */}
      {showTimeline && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <h4 className="font-bold text-blue-800 mb-3">📅 Belangrijke Gebeurtenissen</h4>
          <div className="space-y-2">
            {selectedCharacter.timelineEvents.map((event: any, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-blue-600 text-sm font-medium">{event.year}</div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-blue-700 text-sm">{event.event}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      {showSuggestedQuestions && messages.length <= 1 && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <h4 className="font-bold text-green-800 mb-3">💡 Suggestievragen</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS[selectedCharacter.id]?.map((question, index) => (
              <button
                key={index}
                onClick={() => askSuggestedQuestion(question)}
                className="text-left p-2 bg-white border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm text-green-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.isQuiz ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <MarkdownRenderer content={message.content} />
                {currentQuiz && (
                  <div className="mt-3 space-y-2">
                    {currentQuiz.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => answerQuiz(index)}
                        className="block w-full text-left p-2 bg-white border border-purple-200 rounded hover:bg-purple-100 transition-colors"
                      >
                        {index + 1}. {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : message.type === 'system' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <MarkdownRenderer content={message.content} />
                {message.content.includes('quiz') && (
                  <button
                    onClick={startQuiz}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🧠 Start Quiz
                  </button>
                )}
              </div>
            ) : (
              <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.type === 'character' ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Streaming Response */}
        {isStreaming && streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-100 text-gray-800">
              <MarkdownRenderer content={streamingResponse} />
              <span className="inline-block w-2 h-4 bg-gray-600 animate-pulse ml-1"></span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-100 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">{selectedCharacter.name} denkt na...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Response Actions for last character message */}
      {messages.length > 0 && messages[messages.length - 1].type === 'character' && !isStreaming && (
        <div className="px-6 pb-2">
          <ResponseActions 
            content={messages[messages.length - 1].content}
            isMarkdown={true}
            isStreaming={false}
            className="justify-end"
          />
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Stel een vraag aan ${selectedCharacter.name}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={isLoading || isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || isStreaming}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading || isStreaming ? '⏳' : '📤'}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500">
            💡 Tip: Vraag naar specifieke gebeurtenissen, dagelijks leven, of persoonlijke ervaringen!
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSuggestedQuestions(!showSuggestedQuestions)}
              className="text-xs text-amber-600 hover:text-amber-800"
            >
              💡 Suggesties
            </button>
            <button
              onClick={startQuiz}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              🧠 Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}