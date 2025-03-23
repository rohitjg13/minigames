"use client"
import { useState, useEffect } from "react";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCount, setFlippedCount] = useState(0);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  
  const initializeGame = () => {
    console.log("Initializing game...");
    
    const duplicatedEmojis = [...emojis, ...emojis];
    
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    
    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    }));
    
    console.log("Cards created:", newCards.length);
    
    setCards(newCards);
    setFlippedCount(0);
    setFlippedIndexes([]);
    setMoves(0);
    setGameOver(false);
    setGameReady(true);
  };
  
  const handleCardClick = (index: number) => {
    if (!cards[index]) {
      console.error("Card at index", index, "doesn't exist!");
      return;
    }
  
    if (flippedIndexes.includes(index) || cards[index].matched) return;
    
    if (flippedCount === 2) return;
    
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);
    
    const newFlippedCount = flippedCount + 1;
    setFlippedCount(newFlippedCount);
    
    if (newFlippedCount === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndexes;
      
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        const newCards = [...cards];
        newCards[firstIndex].matched = true;
        newCards[secondIndex].matched = true;
        setCards(newCards);
        
        setFlippedCount(0);
        setFlippedIndexes([]);
        
        if (newCards.every(card => card.matched)) {
          setGameOver(true);
        }
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].flipped = false;
          newCards[secondIndex].flipped = false;
          setCards(newCards);
          
          setFlippedCount(0);
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {      
      setTimeout(() => {
        initializeGame();
      }, 200);
    }
    
    return () => {

    };
  }, []);
  

  const displayCards = cards;
  
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Memory Match</h1>
      
      <div className="mb-4">
        <p className="text-lg text-black">Moves: {moves}</p>
      </div>
      
      {gameOver ? (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
          <p className="mb-4">You completed the game in {moves} moves.</p>
          <button 
            onClick={initializeGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-md"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {displayCards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="aspect-square flex items-center justify-center rounded-lg cursor-pointer shadow-md"
                style={{
                  backgroundColor: card.flipped || card.matched ? "white" : "#3B82F6",
                  opacity: card.matched ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                  border: "2px solid #2563EB",
                  minWidth: "70px",
                  height: "80px",
                }}
              >
                {(card.flipped || card.matched) && (
                  <span className="text-4xl">{card.emoji}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
        <button 
            onClick={initializeGame}
            className="bg-white text-black px-4 py-2 rounded-full text-lg font-bold mt-4 hover:bg-blue-100 hover:shadow-md transition-all duration-200"
            >
            Reset Game
        </button>
    </div>
  );
}