import { useEffect, useState } from 'react';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

const shades = '    .:-+*=%@#';
const shadesLength = shades.length;

function convertToChar(value: number) {
  return shades[Math.min(Math.floor(value * shadesLength), shadesLength - 1)];
}

function drawPlasma(t: number) {
  let output = '';

  const windowWidth = Math.min(window.screen.width, window.innerWidth);
  const width = windowWidth / 13;
  const height = 400 / 20;

  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      let r = (noise3D(x / 32, y / 32, t / 64) + 1) / 2;
      output += convertToChar(r);
    }
    output += '\n';
  }

  return output;
}

export function Plasma({ children }: { children?: React.ReactNode }) {
  const [plasma, setPlasma] = useState('');

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      setPlasma(drawPlasma(t++));
    }, 1000 / 8);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ overflow: 'hidden', maxWidth: '100vw' }}
      className="relative h-[400px] border-t border-white border-opacity-10"
    >
      <pre
        className="z-[-1] absolute top-0 left-0"
        style={{
          fontFamily: 'geist-mono',
          fontSize: '16px',
          lineHeight: '20px',
          letterSpacing: '4px',
          color: '#202020'
        }}
      >
        {plasma}
      </pre>
      {children}
    </div>
  );
}
