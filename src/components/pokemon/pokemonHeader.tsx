'use client'; 
import React from 'react';
import { Input } from '@/components/ui/input'; 
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'; 
import { InfoIcon } from 'lucide-react'; 

interface PokemonHeaderProps {
  headerRef: React.RefObject<HTMLElement | null>; 
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
}

export default function PokemonHeader({
  headerRef,
  searchTerm,
  setSearchTerm,
  isLoading,
}: PokemonHeaderProps) {
  
  const headerClassName = "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-md py-4 px-6 md:px-12 transition-all duration-300";

  return (
    <header 
      ref={headerRef}
      className={headerClassName}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* ページタイトルブロックとPopoverボタン */}
        <div className="flex items-center min-w-0 pr-4"> 
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              初代ポケモン図鑑
            </h1>
            <p className="hidden sm:block text-sm text-gray-600 mt-1">
              ID 1〜151 のポケモンを検索・表示
            </p>
          </div>
          
          {/* Popover コンポーネント: 技術スタック情報 */}
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="技術スタック情報"
              >
                <InfoIcon className="h-5 w-5 text-gray-600" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 text-sm bg-white shadow-xl rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">技術スタック</h4>
              
              {/* カテゴリごとのリストに整理 (全てリンク化) */}
              <div className="space-y-2">
                
                {/* フレームワーク・言語 */}
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold text-gray-600">フレームワーク/言語:</span>
                  <span className="text-gray-800 text-right space-x-2">
                    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Next.js (SPA)</a>
                    <span>/</span>
                    <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">TypeScript</a>
                  </span>
                </div>

                {/* UI/スタイリング */}
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold text-gray-600">UI/スタイリング:</span>
                  <span className="text-gray-800 text-right space-x-2">
                    <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Tailwind CSS</a>
                    <span>/</span>
                    <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">shadcn/ui</a>
                  </span>
                </div>
                
                {/* ホスティング */}
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold text-gray-600">ホスティング:</span>
                  <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Vercel</a>
                </div>

                {/* データソース */}
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-gray-600">データソース:</span>
                  <a 
                    href="https://pokeapi.co/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    Pokémon API
                  </a>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Popover コンポーネントここまで */}

        </div>

        {/* 検索入力欄とスピナー */}
        <div className="flex items-center w-full max-w-xs ml-4 md:ml-8 relative"> 
          <Input 
            type="text"
            placeholder="ポケモンを日本語名か英語名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 shadow-inner focus:border-blue-500 pr-10" 
          />
          
          {/* ローディングスピナー */}
          {isLoading && (
            <svg 
              className="animate-spin h-5 w-5 text-blue-600 absolute right-3" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-label="Loading..."
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
      </div>
    </header>
  );
}