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
        expertise: ["Militaire strategie", "Politiek", "Romeinse geschiedenis", "Gallische oorlogen", "Romeinse wet"]
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
        expertise: ["Stoïcijnse filosofie", "Leiderschap", "Romeinse politiek", "Ethiek", "Zelfverbetering"]
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
        expertise: ["Gladiatorengevechten", "Militaire tactiek", "Slavernij in Rome", "Opstand en rebellie", "Thracische cultuur"]
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
        expertise: ["Egyptische cultuur", "Diplomatie", "Ptolemeeënse dynastie", "Romeins-Egyptische relaties", "Oude talen"]
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
        expertise: ["Retorica", "Romeinse wet", "Filosofie", "Politieke theorie", "Republikeinse waarden"]
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
        expertise: ["Britse politiek", "Militaire strategie", "Oorlogsvoering", "Diplomatie", "Leiderschap in crisis"]
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
        expertise: ["Joods leven tijdens WWII", "Onderduik in Nederland", "Dagboek schrijven", "Jeugd tijdens oorlog", "Holocaust ervaring"]
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
        expertise: ["Militaire strategie", "D-Day operatie", "Geallieerde samenwerking", "Oorlogsplanning", "Leiderschap"]
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
        expertise: ["Frans verzet", "Sabotage technieken", "Ondergrondse netwerken", "Bezet Frankrijk", "Burgerlijke moed"]
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
        expertise: ["Duitse militaire ervaring", "Oostfront", "Gewone soldaat perspectief", "Oorlogstrauma", "Naoorlogse reflectie"]
      }
    ]
  }
}

interface Message {
  id: string
  type: 'user' | 'character'
  content: string
  timestamp: Date
  characterId?: string
}

export default function HistoryChat() {
  const [selectedPeriod, setSelectedPeriod] = useState<'roman' | 'wwii' | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState('')
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
    setMessages([
      {
        id: 'welcome',
        type: 'character',
        content: `Groetingen! Ik ben **${character.name}**, ${character.title}. ${character.background}\n\nIk kan je vertellen over ${character.expertise.join(', ')}. Wat zou je graag willen weten over mijn tijd of mijn ervaringen?`,
        timestamp: new Date(),
        characterId: character.id
      }
    ])
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

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Create character-specific prompt
      const characterPrompt = `Je bent ${selectedCharacter.name}, ${selectedCharacter.title} (${selectedCharacter.period}). 

KARAKTER INFORMATIE:
- Persoonlijkheid: ${selectedCharacter.personality}
- Achtergrond: ${selectedCharacter.background}
- Expertise: ${selectedCharacter.expertise.join(', ')}

INSTRUCTIES:
1. Antwoord ALTIJD in de eerste persoon als ${selectedCharacter.name}
2. Gebruik historisch accurate informatie uit jouw tijdperk
3. Spreek Nederlands, maar gebruik soms historische termen
4. Toon je persoonlijkheid en emoties
5. Verwijs naar echte gebeurtenissen, mensen en plaatsen uit jouw tijd
6. Als je iets niet weet, geef dat eerlijk toe vanuit je karakter
7. Houd antwoorden boeiend en educatief voor middelbare scholieren
8. Gebruik maximaal 200 woorden per antwoord

VRAAG VAN LEERLING: ${inputMessage}

Antwoord als ${selectedCharacter.name}:`

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
                <p className="text-gray-700 text-sm">
                  {character.description}
                </p>
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

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
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
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Tip: Vraag naar specifieke gebeurtenissen, dagelijks leven, of persoonlijke ervaringen!
        </p>
      </div>
    </div>
  )
}