import axios from 'axios';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export interface Pokemon {
  name: string;
  id: number;
  sprites: {
    front_default: string;
    back_default: string;
  };
  height: number;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
    };
  }[];
  species: {
    url: string;
  };
}

export const pokemonService = {
    getPokemon: async (nameOrId: string | number): Promise<Pokemon> => {
        const response = await axios.get(`${API_BASE_URL}/pokemon/${nameOrId}`);
        const pokemonData = response.data;
        
        // Fetch species data to get generation
        const speciesResponse = await axios.get(pokemonData.species.url);
        const generation = speciesResponse.data.generation.name;
        
        return {
            ...pokemonData,
            generation: generation
        };
    },

    getPokemonList: async (limit: number = 20, offset: number = 0) => {
        const response = await axios.get(
            `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
        );
        return response.data;
    },

    searchPokemon: async (query: string): Promise<Pokemon> => {
        return pokemonService.getPokemon(query.toLowerCase());
    },
};