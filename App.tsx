import React, { useState, useCallback } from 'react';
import { Button } from './components/Button';
import { getNumberFact } from './services/gemini';
import { Sparkles, Copy, Check } from 'lucide-react';

const App: React.FC = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [fact, setFact] = useState<string>("");
  const [loadingFact, setLoadingFact] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // State for custom range
  const [minRange, setMinRange] = useState<string>("1");
  const [maxRange, setMaxRange] = useState<string>("100");

  const generateNumber = useCallback(() => {
    const min = parseInt(minRange, 10);
    const max = parseInt(maxRange, 10);

    // Default to 1-100 if invalid inputs
    const validMin = isNaN(min) ? 1 : min;
    const validMax = isNaN(max) ? 100 : max;

    // Handle swapped ranges gracefully
    const start = Math.min(validMin, validMax);
    const end = Math.max(validMin, validMax);

    setIsAnimating(true);
    setFact("");
    setIsCopied(false);
    
    // Simple animation effect: shuffle numbers briefly before settling
    let shuffleCount = 0;
    const maxShuffles = 15; // Increased slightly for better effect
    const interval = setInterval(() => {
      const randomVal = Math.floor(Math.random() * (end - start + 1)) + start;
      setCurrentNumber(randomVal);
      shuffleCount++;
      
      if (shuffleCount >= maxShuffles) {
        clearInterval(interval);
        const finalNumber = Math.floor(Math.random() * (end - start + 1)) + start;
        setCurrentNumber(finalNumber);
        setIsAnimating(false);
        
        // Fetch AI fact after number is settled
        fetchFact(finalNumber);
      }
    }, 60);

  }, [minRange, maxRange]);

  const fetchFact = async (num: number) => {
    setLoadingFact(true);
    const aiFact = await getNumberFact(num);
    setFact(aiFact);
    setLoadingFact(false);
  };

  const handleCopy = () => {
    if (currentNumber !== null) {
      navigator.clipboard.writeText(currentNumber.toString());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white w-full max-w-md p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        
        <h1 className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8">
          Генератор Случайных Чисел
        </h1>

        <div className="relative mb-8 md:mb-10 flex items-center justify-center h-32 md:h-48 w-full perspective-500">
           {currentNumber === null ? (
             <div className="text-5xl md:text-6xl text-slate-200 font-black select-none">?</div>
           ) : (
             <div className="flex items-center justify-center gap-3 md:gap-6 w-full">
               <span 
                key={isAnimating ? 'shuffling' : `final-${currentNumber}`}
                className={`
                  text-7xl md:text-9xl font-black text-slate-800 leading-none block select-none
                  ${isAnimating ? 'opacity-40 blur-[1px] scale-95' : 'animate-pop-in'}
                `}
                style={{
                  textShadow: isAnimating ? 'none' : `
                    1px 1px 0 #cbd5e1,
                    2px 2px 0 #cbd5e1,
                    3px 3px 0 #cbd5e1,
                    4px 4px 0 #cbd5e1,
                    5px 5px 0 #cbd5e1,
                    6px 6px 0 #cbd5e1,
                    7px 7px 0 #cbd5e1,
                    8px 8px 0 #cbd5e1,
                    10px 10px 25px rgba(0,0,0,0.2)
                  `,
                  transition: 'all 0.3s ease'
                }}
               >
                 {currentNumber}
               </span>
               
               {!isAnimating && (
                 <button 
                   onClick={handleCopy}
                   className="p-3 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 animate-[fadeIn_0.5s_ease-out_0.5s_forwards]"
                   title="Копировать число"
                   aria-label="Копировать число"
                   style={{ opacity: 1 }}
                 >
                   {isCopied ? (
                     <Check className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                   ) : (
                     <Copy className="w-6 h-6 md:w-8 md:h-8" />
                   )}
                 </button>
               )}
             </div>
           )}
        </div>

        <div className="min-h-[6rem] w-full flex items-center justify-center mb-6">
          {loadingFact ? (
            <div className="flex items-center space-x-2 text-slate-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Ищу интересный факт...</span>
            </div>
          ) : fact ? (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-fade-in w-full">
               <p className="text-blue-800 text-sm leading-relaxed font-medium">
                 <Sparkles className="w-3 h-3 inline mr-1 text-blue-500" />
                 {fact}
               </p>
            </div>
          ) : (
            <div className="text-transparent select-none">Placeholder</div>
          )}
        </div>

        <Button onClick={generateNumber} disabled={isAnimating} className="w-full md:w-auto text-lg py-4">
          {isAnimating ? 'Генерация...' : 'Сгенерировать'}
        </Button>

        <div className="mt-8 w-full border-t border-slate-100 pt-6">
          <div className="flex items-center justify-center space-x-4">
             <div className="flex flex-col items-center">
              <label htmlFor="min-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">От</label>
              <input 
                id="min-input"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={minRange}
                onChange={(e) => setMinRange(e.target.value)}
                className="w-20 md:w-24 bg-slate-50 border border-slate-200 text-slate-700 text-center font-bold text-lg rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
                placeholder="1"
              />
            </div>
            <div className="h-px w-4 md:w-6 bg-slate-300 mt-5"></div>
             <div className="flex flex-col items-center">
              <label htmlFor="max-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">До</label>
              <input 
                id="max-input"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxRange}
                onChange={(e) => setMaxRange(e.target.value)}
                className="w-20 md:w-24 bg-slate-50 border border-slate-200 text-slate-700 text-center font-bold text-lg rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-300"
                placeholder="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;