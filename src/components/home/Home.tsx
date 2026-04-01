import './Home.css';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigate(`/info/${searchTerm}`);
    }
  };

  return (
    <div className="app">
      <h1>Pokemon Finder</h1>
      <div className="search-bar">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search for a Pokémon using name or dex number"
        />
        <Search className="search-icon" />
      </div>
    </div>
  );
};
