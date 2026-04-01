import { Routes, Route } from 'react-router-dom';
import { Home } from './components/home/Home';
import { Info } from './components/info/info';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/info/:searchTerm" element={<Info />} />
    </Routes>
  );
}
