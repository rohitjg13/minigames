import Link from "next/link";
export default function Home() {
  const games = [
    { 
      name: "Card Master 21", 
      path: "/CardMaster21", 
      description: "Test your luck by drawing out cards till you reach 21 before Mr. Card Master!",
      emoji: "♣️"
    },
    { 
      name: "Memory Game", 
      path: "/MemoryGame", 
      description: "Match pairs of cards to test your memory",
      emoji: "🧠"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center p-8">
      <header className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Mini Games</h1>
        <p className="text-lg text-gray-600">Choose a game to play!</p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {games.map((game, index) => (
          <Link 
            href={game.path} 
            key={index}
            className="no-underline"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="text-5xl mb-4 text-center">{game.emoji}</div>
                <h2 className="text-xl font-bold text-blue-700 mb-2">{game.name}</h2>
                <p className="text-gray-600 text-sm flex-grow">{game.description}</p>
                <div className="mt-4 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>

      <footer className="mt-16 text-center text-gray-500 text-sm pb-8">
      </footer>
    </div>
  );
}