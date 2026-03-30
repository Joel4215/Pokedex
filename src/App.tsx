import React, { useState, useEffect } from 'react';
import './App.css';


interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
}


function App () {


const [data, setData] = useState<Pokemon | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [query, setQuery] = useState('1');
const [searchTerm, setSearchTerm] = useState('1');


useEffect(() => {
  const fetchPokemon = async () => {
    setLoading(true);
    setError(null);


    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}/`);
      if (!response.ok) {
        throw new Error('No Pokemon found! Please search again.');
      }
      const data = await response.json();
      setData(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setData(null);
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
        <p>Height: {data.height}</p>
        <p>Weight: {data.weight}</p>
      </div>
    )}
  </div>
);
  }




export default App;