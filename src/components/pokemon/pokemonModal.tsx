import { Pokemon } from '@/data/pokemon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { typeColorMap } from '@/lib/constants'; // ★★★ 共通定数をインポート ★★★

interface PokemonModalProps {
  selectedPokemon: Pokemon | null;
  onClose: () => void;
}

export default function PokemonModal({ selectedPokemon, onClose }: PokemonModalProps) {
  
  if (!selectedPokemon) {
    return null;
  }

  return (
    // ★★★ app/home-client.tsx から移動した Dialog 全体 ★★★
    <Dialog open={!!selectedPokemon} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        
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

          {/* モーダル内のタイプバッジ表示 */}
          <div className="flex justify-center gap-2 mb-6">
            {selectedPokemon.types.map((typeInfo) => {
              const typeName = typeInfo.type.name;
              // typeColorMapから背景色クラスを取得
              const bgColorClass = typeColorMap[typeName] || typeColorMap['default'];
              return (
                <span
                  key={typeName}
                  className={`
                    ${bgColorClass} text-white text-sm font-semibold 
                    px-4 py-1 rounded-full shadow-lg capitalize
                  `}
                >
                  {typeName}
                </span>
              );
            })}
          </div>
          
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
      </DialogContent>
    </Dialog>
  );
}