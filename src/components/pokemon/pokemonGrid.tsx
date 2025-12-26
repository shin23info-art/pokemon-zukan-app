import { Pokemon } from '@/data/pokemon'; 
import PokemonCard from './pokemonCard';

const SkeletonCard = () => (
  <div 
    className="bg-white rounded-xl shadow-lg flex flex-col items-center text-center p-4 animate-pulse border-t-4 border-gray-200"
  >
    {/* 画像のプレースホルダー */}
    <div className="w-24 h-24 mb-3 p-1 rounded-full bg-gray-200"></div>

    {/* 名前と番号のプレースホルダー */}
    <div className="w-3/4 h-6 bg-gray-200 rounded mb-1.5"></div>
    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
  </div>
);

interface PokemonGridProps {
  filteredPokemons: Pokemon[];
  isLoading: boolean;
  searchTerm: string;
  onCardClick: (pokemon: Pokemon) => void;
}

export default function pokemonGrid({
  filteredPokemons,
  isLoading,
  searchTerm,
  onCardClick,
}: PokemonGridProps) {
  
  // Gridの共通クラス定義
  const gridClassName = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6";

  if (isLoading) {
    // ローディング時: スケルトン表示
    return (
      <div className={gridClassName}>
        {Array.from({ length: 18 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (filteredPokemons.length === 0) {
    // 検索結果がない場合
    if (searchTerm) {
      return (
        <p className="col-span-full text-center text-gray-500 mt-8">
            "{searchTerm}" に一致するポケモンは見つかりませんでした。
        </p>
      );
    }
    // データはロードされたが、そもそもリストが空の場合 (レアケースだが保険)
    return (
      <p className="col-span-full text-center text-gray-500 mt-8">
          表示できるポケモンデータがありません。
      </p>
    );
  }

  // 通常時: ポケモンカード一覧表示
  return (
    <div className={gridClassName}>
      {filteredPokemons.map((pokemon) => (
        <PokemonCard 
          key={pokemon.id}
          pokemon={pokemon}
          onClick={onCardClick} 
        />
      ))}
    </div>
  );
}