'use client'; 

import { useState, useMemo, useEffect } from 'react'; 
import { getAllPokemons, Pokemon, PokemonResult } from '../../data/pokemon'; 
// Shadcn/ui のコンポーネントをインポート
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// ポケモンIDに基づいて Tailwind の色クラスを返すヘルパー関数
const getBorderColor = (id: number): string => {
  const colors = [
    'border-red-500', 
    'border-blue-500', 
    'border-yellow-500', 
    'border-green-500'
  ];
  return colors[id % colors.length];
};

// Propsは不要になるため削除
// interface HomeProps {}

/**
 * Client Component: 検索、モーダル、UI操作、データ取得を担当
 */
export default function HomeClient() {
  // 状態管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  // ★追加: データとローディング状態の管理★
  const [pokemons, setPokemons] = useState<PokemonResult>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ★データ取得ロジックを useEffect に移動（コンポーネントマウント後に実行）★
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setIsLoading(true);
        const fetchedPokemons = await getAllPokemons();
        setPokemons(fetchedPokemons);
        setError(null);
      } catch (e) {
        setError("データの取得に失敗しました。");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemons();
  }, []); // 依存配列が空なので、マウント時のみ実行

  // 以前のロジックは pokemons (State) に基づいて実行
  const validPokemons: Pokemon[] = pokemons.filter(
    (pokemon): pokemon is Pokemon => pokemon !== null
  );

  const skippedCount = pokemons.length > 0 ? (pokemons.length - validPokemons.length) : 0;
  
  // 検索機能 (メモ化)
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
    // ★メインコンテンツのパディングを修正後の値 (pt-32) に設定★
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 pt-36">
      
      {/* -------------------------------------------------- */}
      {/* 固定ヘッダー（モダン化） - 変更なし */}
      {/* -------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 
                         bg-white/80 backdrop-blur-sm shadow-md 
                         py-4 px-6 md:px-12 transition-all duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          
          {/* ページタイトル */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              初代ポケモン図鑑
            </h1>
            <p className="hidden sm:block text-sm text-gray-600 mt-1">
              ID 1〜151 のポケモンを検索・表示
            </p>
          </div>

          {/* 検索入力欄 */}
          <div className="w-full max-w-xs ml-4 md:ml-8">
            <Input 
              type="text"
              placeholder="ポケモンを日本語名か英語名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 shadow-inner focus:border-blue-500"
            />
          </div>
        </div>
      </header>

      {/* -------------------------------------------------- */}
      {/* ★★★ ローディング・エラー状態の表示 ★★★ */}
      {/* -------------------------------------------------- */}
      {error && (
        <div className="max-w-xl mx-auto mb-8">
            <p className="bg-red-500 text-white p-3 rounded-lg text-center shadow-md">
                エラー: {error}
            </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center p-10 text-xl font-semibold text-gray-600">
          大量のポケモンデータを読み込み中です... (Client ComponentでAPIリクエスト中)
          {/* スケルトンUIなどをここに追加すると、よりモダンになります */}
        </div>
      )}
      
      {/* 警告エリア (データ取得完了後、かつ、データがある場合のみ表示) */}
      {!isLoading && skippedCount > 0 && (
        <div className="max-w-xl mx-auto mb-8">
            <p className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-center shadow-md">
                ⚠️ {skippedCount} 件のデータ取得に失敗しました。
            </p>
        </div>
      )}

      {/* ポケモンカードのグリッド (ローディング中でない場合のみ表示) */}
      {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6  pt-20">
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
      )}

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