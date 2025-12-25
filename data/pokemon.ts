export const getAllPokemons = async () => {
  const MaxPokemons = 151;

  return Promise.all([...Array(MaxPokemons)].map(async (_, index) => {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`,
      {
        method: 'GET',
      }).then((response) => {
        return response.json();
    });
    return pokemon;
    })
  );
};