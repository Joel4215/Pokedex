interface TypeProps {
  types?: Array<{ type: { name: string } }>;
}

export function Type({ types }: TypeProps) {
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <div className="type-container">
      {types.map((t, index) => (
        <span key={index} className={`type-badge ${t.type.name}`}>
          {t.type.name}
        </span>
      ))}
    </div>
  );
}
