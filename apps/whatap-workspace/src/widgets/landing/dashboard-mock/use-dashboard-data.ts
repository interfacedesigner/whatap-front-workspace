import { useMemo } from 'react';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateChartData(points: number, seed: number, base: number, amplitude: number): number[] {
  const rng = seededRandom(seed);
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const sine = Math.sin((i / points) * Math.PI * 2) * amplitude * 0.6;
    const noise = (rng() - 0.5) * amplitude * 0.5;
    const trend = (i / points) * amplitude * 0.3;
    data.push(base + sine + noise + trend);
  }
  return data;
}

function generateSparklineData(seed: number): number[] {
  const rng = seededRandom(seed);
  const data: number[] = [];
  let val = 50;
  for (let i = 0; i < 12; i++) {
    val += (rng() - 0.45) * 20;
    val = Math.max(10, Math.min(90, val));
    data.push(val);
  }
  return data;
}

export function useDashboardData() {
  const mainChartData = useMemo(() => generateChartData(24, 42, 60, 25), []);
  const secondaryChartData = useMemo(() => generateChartData(24, 87, 40, 15), []);
  const sparklines = useMemo(
    () => [generateSparklineData(11), generateSparklineData(22), generateSparklineData(33)],
    [],
  );

  return { mainChartData, secondaryChartData, sparklines };
}
