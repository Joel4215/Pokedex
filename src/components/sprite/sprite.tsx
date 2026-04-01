import { useState } from 'react';

interface SpriteProps {
  sprites?: {
    front_default?: string;
    back_default?: string;
  };
}

export function Sprite({ sprites }: SpriteProps) {
  const [frontFailed, setFrontFailed] = useState(false);
  const [backFailed, setBackFailed] = useState(false);

  if (!sprites) {
    return <div className="sprite-container">No sprites available</div>;
  }

  const handleFrontError = () => setFrontFailed(true);
  const handleBackError = () => setBackFailed(true);

  return (
    <div className="sprite-container">
      {sprites.front_default && !frontFailed && (
        <img 
          src={sprites.front_default} 
          alt="Front" 
          className="sprite front"
          onError={handleFrontError}
        />
      )}
      {sprites.front_default && frontFailed && (
        <div className="sprite-placeholder">Front sprite unavailable</div>
      )}
    </div>
  );
}
