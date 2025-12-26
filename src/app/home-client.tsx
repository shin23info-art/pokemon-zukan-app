// File: app/home-client.tsx

'use client'; 

import { useState, useMemo, useEffect, useRef } from 'react'; 
import { getAllPokemons, Pokemon, PokemonResult } from '@/data/pokemon'; 
import PokemonHeader from '@/components/pokemon/pokemonHeader'; 
import PokemonGrid from '@/components/pokemon/pokemonGrid'; 
import PokemonModal from '@/components/pokemon/pokemonModal'; 

/**
 * Client Component: メインのデータ取得、状態管理、コンポーネントの統合を担当
 */
export default function HomeClient() {
  const headerRef = useRef<HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [pokemons, setPokemons] = useState<PokemonResult>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得ロジック
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
  }, []); 

  // ヘッダーの高さを計測し、CSS変数を設定する useEffect
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const actualHeight = headerRef.current.offsetHeight; 
        document.documentElement.style.setProperty(
          '--header-height', 
          `${actualHeight}px`
        );
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []); 

  const validPokemons: Pokemon[] = pokemons.filter(
    (pokemon): pokemon is Pokemon => pokemon !== null
  );
  // スキップされたデータのカウント (エラーメッセージ表示用)
  const skippedCount = pokemons.length > 0 ? (pokemons.length - validPokemons.length) : 0;
  
  // 検索フィルタリングロジック
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
      
      {/* 固定ヘッダー: 検索入力とローディングスピナー */}
      <PokemonHeader
        headerRef={headerRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoading={isLoading}
      />
      
      <div className="max-w-7xl mx-auto" style={{ paddingTop: 'var(--header-height)' }}>

        {/* データの取得エラー表示 */}
        {error && (
          <div className="max-w-xl mx-auto mb-8">
              <p className="bg-red-500 text-white p-3 rounded-lg text-center shadow-md">
                  エラー: {error}
              </p>
          </div>
        )}
        
        {/* データスキップ時の警告表示 */}
        {!isLoading && skippedCount > 0 && (
          <div className="max-w-xl mx-auto mb-8">
              <p className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-center shadow-md">
                  ⚠️ {skippedCount} 件のデータ取得に失敗しました。
              </p>
          </div>
        )}

        {/* ポケモン一覧のグリッド: カード、ローディングスケルトン、検索結果なしメッセージを内包 */}
        <PokemonGrid
          filteredPokemons={filteredPokemons}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onCardClick={setSelectedPokemon} 
        />
        
      </div> {/* コンテンツラッパー終了 */}

      {/* ポケモン詳細モーダル */}
      <PokemonModal
        selectedPokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
      
    </main>
  );
}