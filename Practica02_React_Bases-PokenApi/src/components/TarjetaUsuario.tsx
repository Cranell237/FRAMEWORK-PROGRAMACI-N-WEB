interface Props {
  nombre: string;
  correo: string;
}

export default function TarjetaUsuario({ nombre, correo,  }: Props) {
  return (
    <div className="mt-6 p-6 border border-slate-200 rounded-lg bg-white shadow-sm max-w-sm dark:bg-slate-800 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{nombre}</h2>
      <p className="text-slate-500 mt-1 dark:text-slate-400">{correo}</p>
    </div>
  );
}
