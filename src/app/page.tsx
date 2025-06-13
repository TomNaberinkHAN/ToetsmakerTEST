import HistoryChat from '@/components/HistoryChat'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-amber-800 mb-4">
            Tijdreis Gesprekken
          </h1>
          
          <p className="text-xl text-amber-700 font-medium mb-6 max-w-3xl mx-auto">
            Stap in een tijdmachine en voer echte gesprekken met historische figuren! 
            Ontdek hun verhalen, stel vragen over hun tijd, en leer geschiedenis op een unieke manier.
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              🎭 Beschikbare Tijdperken
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                <h3 className="text-lg font-bold text-red-800 mb-2">🏛️ Het Romeinse Rijk</h3>
                <p className="text-red-700 text-sm">
                  Praat met keizers, gladiatoren, filosofen en burgers uit het machtige Romeinse Rijk
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">⚔️ De Tweede Wereldoorlog</h3>
                <p className="text-gray-700 text-sm">
                  Ontmoet leiders, soldaten, verzetsstrijders en burgers uit de meest ingrijpende oorlog
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <HistoryChat />
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-amber-600">
            <span>📚</span>
            <span>Leer geschiedenis door te praten met de mensen die het hebben meegemaakt!</span>
            <span>🕰️</span>
          </div>
          <p className="text-amber-500 text-sm mt-2">
            Interactieve Geschiedenis Leeromgeving • Powered by AI & Gemini
          </p>
        </div>
      </div>
    </div>
  )
}