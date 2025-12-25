import { getAllPokemons } from '../../data/pokemon';

export default async function Home() {
  const pokemons = await getAllPokemons();
  console.log(pokemons)
  return <main>
      <div className="grid grid-cols-3 gap-4">
        {pokemons.map((pokemon) => {
          return <div key={pokemon.id} className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-bold">{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>;
        })}
      </div>
    </main>;
}
