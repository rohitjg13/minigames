"use client"
import { useState, useEffect } from "react";

type Card = {
  suit: string;
  value: string;
  numerical: number;
};

export default function Home() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'playerBust' | 'dealerBust' | 'playerWin' | 'dealerWin' | 'push'>('idle');
  const [dealersTurn, setDealersTurn] = useState(false);

  const initializeDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: Card[] = [];

    for (const suit of suits) {
      for (const value of values) {
        let numerical = 0;
        if (value === 'A') numerical = 11;
        else if (['J', 'Q', 'K'].includes(value)) numerical = 10;
        else numerical = parseInt(value);

        newDeck.push({ suit, value, numerical });
      }
    }

    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  };

  const startGame = () => {
    const newDeck = initializeDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState('playing');
    setDealersTurn(false);
  };

  const calculateHandValue = (hand: Card[]) => {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      value += card.numerical;
      if (card.value === 'A') aces += 1;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  const hit = () => {
    if (gameState !== 'playing' || dealersTurn) return;
    
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];
    
    setDeck(newDeck);
    setPlayerHand(newHand);
    
    const handValue = calculateHandValue(newHand);
    if (handValue > 21) {
      setGameState('playerBust');
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;
    setDealersTurn(true);
  };

  useEffect(() => {
    if (!dealersTurn || gameState !== 'playing') return;

    const dealerTurn = async () => {
      let currentDealerHand = [...dealerHand];
      let newDeck = [...deck];
      
      while (calculateHandValue(currentDealerHand) < 17) {
        await new Promise(resolve => setTimeout(resolve, 700)); // Animation delay
        const newCard = newDeck.pop()!;
        currentDealerHand = [...currentDealerHand, newCard];
        setDealerHand(currentDealerHand);
        setDeck(newDeck);
      }
      
      const dealerValue = calculateHandValue(currentDealerHand);
      const playerValue = calculateHandValue(playerHand);
      
      if (dealerValue > 21) {
        setGameState('dealerBust');
      } else if (dealerValue > playerValue) {
        setGameState('dealerWin');
      } else if (dealerValue < playerValue) {
        setGameState('playerWin');
      } else {
        setGameState('push');
      }
    };
    
    dealerTurn();
  }, [dealersTurn, dealerHand, deck, gameState, playerHand]);

  const getResultMessage = () => {
    switch (gameState) {
      case 'playerBust': return "Bust! You went over 21.";
      case 'dealerBust': return "Mr. Card Master busts! You win!";
      case 'playerWin': return "You win!";
      case 'dealerWin': return "Mr. Card Master wins!";
      case 'push': return "Push! It's a tie.";
      default: return "";
    }
  };

  const renderCard = (card: Card, index: number) => (
    <div 
      key={index} 
      className="bg-white rounded-lg border border-gray-200 shadow-md w-24 h-36 flex flex-col justify-center items-center relative overflow-hidden"
      style={{ margin: "-10px" }}
    >
      <div className={`text-${card.suit === 'hearts' || card.suit === 'diamonds' ? 'red-600' : 'black'} font-bold text-xl absolute top-2 left-2`}>
        {card.value}
      </div>
      <div className="text-2xl">{
        card.suit === 'hearts' ? '♥' : 
        card.suit === 'diamonds' ? '♦' : 
        card.suit === 'clubs' ? '♣' : '♠'
      }</div>
      <div className={`text-${card.suit === 'hearts' || card.suit === 'diamonds' ? 'red-600' : 'black'} font-bold text-xl absolute bottom-2 right-2 rotate-180`}>
        {card.value}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 mt-4">CardMaster21</h1>
      
      {gameState === 'idle' ? (
        <div className="text-center">
          <p className="text-white text-lg mb-6">A classic card game where you try to get as close to 21 as possible without going over!</p>
          <button 
            onClick={startGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full text-xl shadow-lg transition duration-300"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-white text-xl mb-2">Mr. Card Master: {!dealersTurn && gameState === 'playing' ? '?' : calculateHandValue(dealerHand)}</h2>
            <div className="flex justify-center">
              {dealerHand.map((card, index) => {
                if (index === 1 && !dealersTurn && gameState === 'playing') {
                  return (
                    <div 
                      key="hidden" 
                      className="bg-blue-800 rounded-lg border border-gray-200 shadow-md w-24 h-36 flex justify-center items-center"
                      style={{ margin: "-10px" }}
                    >
                      <div className="text-white font-bold">?</div>
                    </div>
                  );
                }
                return renderCard(card, index);
              })}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-white text-xl mb-2">Your Hand: {calculateHandValue(playerHand)}</h2>
            <div className="flex justify-center">
              {playerHand.map((card, index) => renderCard(card, index))}
            </div>
          </div>
          
          {gameState === 'playing' && !dealersTurn ? (
            <div className="flex gap-4 mb-6">
              <button 
                onClick={hit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-md"
              >
                Hit
              </button>
              <button 
                onClick={stand}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md"
              >
                Stand
              </button>
            </div>
          ) : gameState !== 'playing' ? (
            <div className="text-center mb-6">
              <h2 className="text-white text-2xl font-bold mb-4">{getResultMessage()}</h2>
              <button 
                onClick={startGame}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded shadow-md"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="text-white text-xl">Mr. Card Master is playing...</div>
          )}
        </>
      )}
      
      <div className="mt-auto text-white text-sm opacity-70">
      </div>
    </div>
  );
}