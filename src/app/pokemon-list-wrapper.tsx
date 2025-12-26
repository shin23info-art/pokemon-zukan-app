import HomeClient from './home-client'; 

/**
 * Server Component: データをClient Componentに渡すだけのシンプルなラッパー
 */
export default function PokemonListWrapper() {
    // データ取得は HomeClient 内で行うため、ここでは何も渡さない
    return <HomeClient />;
}