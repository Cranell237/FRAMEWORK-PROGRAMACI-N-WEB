import { useEffect, useState } from 'react';
import type { Referido } from '../data/red';
import { getRed } from '../services/api';

export function useRed(email?: string) {
  const [red, setRed] = useState<Referido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    getRed(email)
      .then((data) => {
        if (activo) setRed(data);
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar la red de referidos.');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => { activo = false; };
  }, [email]);

  return { red, loading, error };
}
