const typeImages = import.meta.glob('../../assets/type-charms/*.png', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const typeImageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(typeImages)) {
  const typeName = path.match(/\/([^/]+)\.png$/)?.[1];
  if (typeName) typeImageMap[typeName] = url;
}

interface TypeProps {
  types?: Array<{ type: { name: string } }>;
}

export function Type({ types }: TypeProps) {
  if (!types || types.length === 0) return null;

  return (
    <div className="flex flex-row gap-2">
      {types.map((t, index) => (
        <img
        className="w-[175px] h-[50px]"
          key={index}
          src={typeImageMap[t.type.name]}
          alt={t.type.name}
        />
      ))}
    </div>
  );
}