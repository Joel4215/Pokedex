import { useState, useEffect, useRef } from 'react';
import './App.css';


interface Pokemon {
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

const formatGeneration = (gen: string) =>
  gen
    .split('-')
    .map((part, index) =>
      index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part.toUpperCase()
    )
    .join(' ');

const getCryUrl = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${encodeURIComponent(id)}.ogg`;
};

const parseEvolutionChain = (chain: any): string[] => {
  const names: string[] = [];

  const walk = (node: any) => {
    if (!node || !node.species) {
      return;
    }

    names.push(node.species.name);

    if (node.evolves_to && node.evolves_to.length > 0) {
      walk(node.evolves_to[0]);
    }
  };

  walk(chain);
  return names;
};

function App () {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayCry = () => {
    if (!data) {
      return;
    }

    const cryUrl = getCryUrl(data.id);
    if (!audioRef.current) {
      audioRef.current = new Audio(cryUrl);
    } else {
      audioRef.current.src = cryUrl;
    }

    audioRef.current.play().catch(() => {
      console.error('Unable to play cry:', cryUrl);
    });
  };

const [data, setData] = useState<Pokemon | null>(null);
const [generation, setGeneration] = useState<string | null>(null);
const [evolutionLine, setEvolutionLine] = useState<string[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [query, setQuery] = useState('1');
const [searchTerm, setSearchTerm] = useState('1');


useEffect(() => {
  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);
    setGeneration(null);
    setEvolutionLine([]);


    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}/`);
      if (!response.ok) {
        throw new Error('No Pokemon found! Please search again.');
      }
      const data = await response.json();
      setData(data);

      const speciesResponse = await fetch(data.species.url);
      if (speciesResponse.ok) {
        const speciesData = await speciesResponse.json();
        setGeneration(speciesData.generation?.name ?? null);

        if (speciesData.evolution_chain?.url) {
          const evoResponse = await fetch(speciesData.evolution_chain.url);
          if (evoResponse.ok) {
            const evoData = await evoResponse.json();
            setEvolutionLine(parseEvolutionChain(evoData.chain));
          } else {
            setEvolutionLine([]);
          }
        } else {
          setEvolutionLine([]);
        }
      } else {
        setGeneration(null);
        setEvolutionLine([]);
      }

      setError(null);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setData(null);
      setGeneration(null);
      setLoading(false);
    }
  };


  fetchPokemon();
}, [searchTerm]);




return (
  <div>
    <h1>Pokemon Finder</h1>




    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Enter Pokemon name or ID"
    />
    <button type="button" onClick={() => setSearchTerm(query)}>
      Search
    </button>
    {loading && <p>Loading data...</p>}
    {error && <p>Error: {error}</p>}
    {data && (
      <div>
        <h2>{data.name ? data.name[0].toUpperCase() + data.name.slice(1) : 'Unknown Pokemon'}</h2>
        <img src={data.sprites.front_default} alt={data.name ?? 'pokemon'} />
        <img src={data.sprites.back_default} alt={data.name ?? 'pokemon'} />
        <p>Generation: {generation ? formatGeneration(generation) : 'Unknown'}</p>
        <p>Types:</p>
        <ul>
          {data.types
            .sort((a, b) => a.slot - b.slot)
            .map((typeObj) => (
              <li key={typeObj.type.name}>{typeObj.type.name}</li>
            ))}
        </ul>
        <p>Abilities:</p>
        <ul>
          {data.abilities.map((abilityObj) => (
            <li key={abilityObj.ability.name}>{abilityObj.ability.name}</li>
          ))}
        </ul>
        <p>Stats:</p>
        <ul>
          {data.stats.map((statObj) => (
            <li key={statObj.stat.name}>
              {statObj.stat.name.replace('-', ' ')}: {statObj.base_stat}
            </li>
          ))}
        </ul>
        {evolutionLine.length > 0 && (
          <p>
            Evolution line: {evolutionLine.map((name) => name[0].toUpperCase() + name.slice(1)).join(' → ')}
          </p>
        )}
        <button type="button" onClick={handlePlayCry}>
          Hear Cry
        </button>
      </div>
    )}
  </div>
);
  }




export default App;