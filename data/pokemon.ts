import axios from 'axios';

/**
 * ポケモンAPIから返される個別のポケモンオブジェクトの型 (必要なプロパティのみ抜粋)
 */
export interface Pokemon {
  id: number;
  name: string; // 英語名 (元のAPIレスポンスに含まれる)
  japaneseName?: string; // ★追加: 日本語名を格納
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  // 他にも多くのプロパティがありますが、今回は省略
}

/**
 * 日本語名が含まれる pokemon-species API からのレスポンスの一部
 */
interface SpeciesName {
  name: string; // 言語ごとの名前
  language: {
    name: string; // 例: "ja", "en"
    url: string;
  };
}

/**
 * pokemon-species API からの完全なレスポンスの型 (名前リスト部分のみ使用)
 */
interface PokemonSpecies {
  names: SpeciesName[]; // 言語名リスト
  // ... 他のプロパティは省略
}


// Promise.allの最終的な返り値の型
export type PokemonResult = (Pokemon | null)[];

// ----------------------------------------------------------------------
// 2. getAllPokemons 関数の修正
// ----------------------------------------------------------------------

/**
 * PokéAPI から初代ポケモン（ID 1〜151）のデータと日本語名を並行して取得します。
 * @returns {Promise<PokemonResult>} 成功したポケモンデータ（Pokemon）または失敗時に null が格納された配列
 */
export const getAllPokemons = async (): Promise<PokemonResult> => {
  const MAX_POKEMONS = 151;
  console.log(`Fetching the first ${MAX_POKEMONS} Pokemons, including Japanese names.`);
  
  const fetchPromises: Promise<Pokemon | null>[] = [...Array(MAX_POKEMONS)].map(async (_, index) => {
    const pokemonId: number = index + 1;
    
    try {
      // 1. 基本データ（英語名、画像など）を取得
      const [pokemonResponse, speciesResponse] = await Promise.all([
        axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
        // 2. ★追加: 種族データ（Species）を取得し、日本語名を探す ★
        axios.get<PokemonSpecies>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
      ]);
      
      const pokemonData: Pokemon = pokemonResponse.data;
      const speciesData: PokemonSpecies = speciesResponse.data;

      // names配列から language.name が "ja" の名前を見つける
      const japaneseNameEntry = speciesData.names.find(
        (nameEntry) => nameEntry.language.name === 'ja'
      );

      // 日本語名が見つかれば、データに追加
      if (japaneseNameEntry) {
        pokemonData.japaneseName = japaneseNameEntry.name;
      }
      
      return pokemonData;

    } catch (error) {
      // エラー処理（どちらかのリクエストが失敗した場合）
      if (axios.isAxiosError(error) && error.response) {
        console.warn(`HTTP Error fetching ID ${pokemonId}: Status ${error.response.status}. Skipping.`);
      } else if (error instanceof Error) {
        console.error(`Network error for ID ${pokemonId}. Skipping.`, error.message);
      } else {
        console.error(`Unknown error for ID ${pokemonId}. Skipping.`);
      }
      // エラー発生時は null を返す
      return null;
    }
  });

  // 3. すべての Promise が解決するのを待つ
  return Promise.all(fetchPromises);
};