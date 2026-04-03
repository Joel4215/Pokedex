import axios from 'axios';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

function parseEvolutionChain(chain: any): string {
    const stages: string[] = [];
    
    function traverse(node: any) {
        if (node?.species?.name) {
            stages.push(node.species.name);
        }
        if (node?.evolves_to?.length > 0) {
            node.evolves_to.forEach(traverse);
        }
    }
    
    traverse(chain);
    return stages.join(' → ') || 'None';
}

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
  generation?: string;
  evolution_chain?: string;
  cries?:{
    latest: string;
    legacy: string;
  }
}

export const pokemonService = {
    getPokemon: async (nameOrId: string | number): Promise<Pokemon> => {
        const response = await axios.get(`${API_BASE_URL}/pokemon/${nameOrId}`);
        const pokemonData = response.data;
        
        // Fetch species data to get generation and evolution chain URL
        const speciesResponse = await axios.get(pokemonData.species.url);
        const generation = speciesResponse.data.generation.name;
        
        // Fetch evolution chain
        let evolutionChain = 'None';
        if (speciesResponse.data.evolution_chain?.url) {
            const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
            evolutionChain = parseEvolutionChain(evolutionResponse.data.chain);
        }
        
        return {
            ...pokemonData,
            generation: generation,
            evolution_chain: evolutionChain
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