interface Props {
  id: number;
  nombre: string;
  imagen: string;
}

export default function TarjetaPokemon({ id, nombre, imagen }: Props) {
  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center">
      <span className="self-end text-xs font-semibold text-slate-400">
        #{id.toString().padStart(3, '0')}
      </span>
      <img
        src={imagen}
        alt={nombre}
        loading="lazy"
        className="w-24 h-24 object-contain"
      />
      <h3 className="mt-2 text-base font-semibold text-slate-800 capitalize">
        {nombre}
      </h3>
    </div>
  );
}
