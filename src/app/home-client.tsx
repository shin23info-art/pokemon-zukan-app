'use client'; 

import { useState, useMemo } from 'react';
import { Pokemon, PokemonResult } from '../../data/pokemon';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// ポケモンIDに基づいて Tailwind の色クラスを返すヘルパー関数 (変更なし)
const getBorderColor = (id: number): string => {
  const colors = [
    'border-red-500', 
    'border-blue-500', 
    'border-yellow-500', 
    'border-green-500'
  ];
  return colors[id % colors.length];
};

interface HomeProps {
  initialPokemons: PokemonResult;
}

// HomeClient 関数全体をエクスポートする
export default function HomeClient({ initialPokemons }: HomeProps) {
  // ... 以前の HomeClient のロジック全体をここに貼り付けます ...
  // ★重要：HomeClient の中身（useState, useMemo, return JSX全体）を全てここに配置してください。
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  const validPokemons: Pokemon[] = initialPokemons.filter(
    (pokemon): pokemon is Pokemon => pokemon !== null
  );

  const skippedCount = initialPokemons.length - validPokemons.length;

  const filteredPokemons = useMemo(() => {
    if (!searchTerm) return validPokemons;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return validPokemons.filter(pokemon => {
      const japaneseMatch = pokemon.japaneseName?.toLowerCase().includes(lowerCaseSearch);
      const englishMatch = pokemon.name.toLowerCase().includes(lowerCaseSearch);
      
      return japaneseMatch || englishMatch;
    });
  }, [validPokemons, searchTerm]);


  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      {/* ページのヘッダー */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          初代ポケモン図鑑
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          ID 1〜151 のポケモンを日本語名で表示
        </p>
      </header>

      {/* 検索入力欄 */}
      <div className="max-w-md mx-auto mb-10">
        <Input 
          type="text"
          placeholder="ポケモンを日本語名か英語名で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border-2 border-gray-300 shadow-inner"
        />
      </div>
      
      {/* 警告エリア */}
      {skippedCount > 0 && (
        <div className="max-w-xl mx-auto mb-8">
            <p className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-center shadow-md">
                ⚠️ {skippedCount} 件のデータ取得に失敗しました。
            </p>
        </div>
      )}

      {/* ポケモンカードのグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredPokemons.map((pokemon) => {
          const displayName = pokemon.japaneseName || pokemon.name;
          const borderColorClass = getBorderColor(pokemon.id);
          
          return (
            <div 
              key={pokemon.id} 
              onClick={() => setSelectedPokemon(pokemon)}
              className={`
                bg-white p-4 rounded-xl shadow-lg cursor-pointer
                hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-in-out
                border-t-4 ${borderColorClass} 
                flex flex-col items-center text-center
              `}
            >
              <div className="w-24 h-24 mb-3 p-1 rounded-full bg-gray-50">
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={displayName} 
                  className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity" 
                  loading="lazy"
                />
              </div>

              <h2 className="text-xl font-extrabold text-gray-800 leading-tight">
                {displayName}
              </h2>
              
              <p className="text-sm font-medium text-gray-500 mt-1">
                図鑑 No. {pokemon.id.toString().padStart(3, '0')}
              </p>
              
              {pokemon.japaneseName && (
                <p className="text-xs text-gray-400 mt-0.5 capitalize italic">
                    ({pokemon.name})
                </p>
              )}
            </div>
          );
        })}
        {filteredPokemons.length === 0 && searchTerm && (
            <p className="col-span-full text-center text-gray-500 mt-8">
                "{searchTerm}" に一致するポケモンは見つかりませんでした。
            </p>
        )}
      </div>

      {/* Shadcn/ui モーダル（Dialog）コンポーネント */}
      <Dialog open={!!selectedPokemon} onOpenChange={() => setSelectedPokemon(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedPokemon && (
            <>
              <DialogHeader className="text-center">
                <DialogTitle className="text-3xl font-extrabold">
                  {selectedPokemon.japaneseName || selectedPokemon.name}
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-500">
                  図鑑 No. {selectedPokemon.id.toString().padStart(3, '0')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col items-center py-4">
                <img 
                  src={selectedPokemon.sprites.front_default} 
                  alt={selectedPokemon.name} 
                  className="w-32 h-32 object-contain bg-gray-50 rounded-full mb-4"
                />
                
                <ul className="space-y-2 text-left w-full max-w-xs">
                  <li className="flex justify-between border-b pb-1">
                    <span className="font-semibold text-gray-600">英語名:</span>
                    <span className="capitalize">{selectedPokemon.name}</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span className="font-semibold text-gray-600">高さ:</span>
                    <span>{selectedPokemon.height / 10} m</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span className="font-semibold text-gray-600">重さ:</span>
                    <span>{selectedPokemon.weight / 10} kg</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}