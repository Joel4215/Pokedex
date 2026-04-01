import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pokemonService } from '../../services/pokemon.service';
import type { Pokemon } from '../../services/pokemon.service';
import { Type } from '../type/type';

export function Info() {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const term = searchTerm ?? '';

const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!term) {
      setPokemon(null);
      return;
    }
    
    setLoading(true);
    const fetchPokemon = async () => {
      try {
        const data = await pokemonService.getPokemon(term);
        setPokemon(data);
      } catch (err) {
        console.error('Failed to fetch pokemon:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [term]);

  if (!term) {
    return <div className="info-container"><p>Enter a Pokemon name or ID</p></div>;
  }

  if (loading) {
    return <div className="info-container"><p>Loading...</p></div>;
  }

  return (
    <div className="info-container">

        <h2>{pokemon?.name}</h2>
        <img src={pokemon?.sprites.front_default} alt={pokemon?.name ?? 'pokemon'} />
        <img src={pokemon?.sprites.back_default} alt={pokemon?.name ?? 'pokemon'} />
        <p>Generation: {pokemon?.generation}</p>
      <Type types={pokemon?.types} />
    </div>
  );
}