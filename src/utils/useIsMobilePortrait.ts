import { useEffect, useState } from 'react';

/**
 * Detecta si el dispositivo es móvil usando userAgent
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined')
    return false;

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Detecta dispositivos móviles comunes
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

/**
 * Hook que detecta si el dispositivo es móvil
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());

  useEffect(() => {
    // Actualiza si cambia el userAgent (raro, pero por consistencia)
    setIsMobile(isMobileDevice());
  }, []);

  return isMobile;
}
