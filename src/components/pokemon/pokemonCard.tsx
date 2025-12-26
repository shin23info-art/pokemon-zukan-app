import { Pokemon } from '@/data/pokemon'; 
import { typeColorMap, typeBorderMap } from '@/lib/constants';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const displayName = pokemon.japaneseName || pokemon.name;
  
  const mainType = pokemon.types[0]?.type.name || 'default';
  const overlayBgClass = typeColorMap[mainType];
  const borderClass = typeBorderMap[mainType];

  // ハイドレーションエラー対策済みのクラス名を使用
  const cardClassName = `relative bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.03] border-t-4 ${borderClass} flex flex-col items-center text-center p-4 group`;

  return (
    <div 
      key={pokemon.id} 
      onClick={() => onClick(pokemon)}
      className={cardClassName}
    >
      
      {/* ホバーオーバーレイ */}
      <div className={`absolute inset-0 ${overlayBgClass} bg-opacity-70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex flex-col justify-center items-center text-white p-4`}>
        <p className="text-xl font-bold mb-2">タイプ</p>
        <div className="flex flex-wrap justify-center gap-2">
            {pokemon.types.map((typeInfo) => (
                <span 
                    key={typeInfo.type.name}
                    className="bg-white/30 text-xs font-semibold px-3 py-1 rounded-full shadow-md capitalize"
                >
                    {typeInfo.type.name}
                </span>
            ))}
        </div>
      </div>

      {/* カードコンテンツ */}
      <div className="z-10 w-full flex flex-col items-center text-center">
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
    </div>
  );
}