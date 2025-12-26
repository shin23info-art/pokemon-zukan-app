export const dynamic = 'force-dynamic';

import { getAllPokemons } from '../../data/pokemon';
import HomeClient from './home-client';

/**
 * Server Component: データを取得し、HomeClientに渡す
 * このコンポーネントが実行されるのは一度きりであり、無限リクエストを防ぐ鍵となる
 */
export default async function PokemonListWrapper() {
    // APIリクエストはここで一度だけ実行される
    const pokemons = await getAllPokemons();

    // 取得したデータをClient ComponentにPropsとして渡す
    return <HomeClient initialPokemons={pokemons} />;
}