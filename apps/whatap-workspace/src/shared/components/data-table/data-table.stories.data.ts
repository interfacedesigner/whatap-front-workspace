export interface DataTableStoriesDataType extends Record<string, number | string> {
  oid: string;
  oname: string;
  ip: string;
  cpu_cores: number;
  cpu_usedPercent: number;
  memory_total: number;
  memory_used: number;
  memory_usedPercent: number;
  disk_total: number;
  disk_used: number;
  disk_usedPercent: number;
  network_rxBytes: number;
  network_txBytes: number;
  network_rxPackets: number;
  network_txPackets: number;
  status: string;
  uptime: number;
  load_avg_1m: number;
  load_avg_5m: number;
  load_avg_15m: number;
  temperature: number;
  power_usage: number;
  fan_speed: number;
  gpu_count: number;
  process_count: number;
  connection_count: number;
  last_updated: string;
}

function randomIp() {
  return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function randomName(idx: number) {
  const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
  return `Server ${names[idx % names.length]} #${idx + 1}`;
}

function randomStatus() {
  const statuses = ['Online', 'Offline', 'Warning', 'Critical', 'Maintenance'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function randomTimestamp() {
  const now = new Date();
  const offset = Math.floor(Math.random() * 3600000); // 0-1시간 전
  return new Date(now.getTime() - offset).toISOString();
}

export const DataTableStoriesData: DataTableStoriesDataType[] = Array.from({ length: 1200 }, (_, i) => {
  const memoryTotal = 8192 + (i % 8) * 8192; // 8GB ~ 64GB
  const memoryUsed = Math.floor(memoryTotal * (0.3 + Math.random() * 0.6));
  const diskTotal = 500000 + (i % 10) * 100000; // 500GB ~ 1.5TB
  const diskUsed = Math.floor(diskTotal * (0.2 + Math.random() * 0.7));

  return {
    oid: (i + 1).toString(),
    oname: randomName(i),
    ip: randomIp(),
    cpu_cores: 2 + (i % 16),
    cpu_usedPercent: Math.floor(Math.random() * 100),
    memory_total: memoryTotal,
    memory_used: memoryUsed,
    memory_usedPercent: Math.floor((memoryUsed / memoryTotal) * 100),
    disk_total: diskTotal,
    disk_used: diskUsed,
    disk_usedPercent: Math.floor((diskUsed / diskTotal) * 100),
    network_rxBytes: Math.floor(Math.random() * 1000000000),
    network_txBytes: Math.floor(Math.random() * 1000000000),
    network_rxPackets: Math.floor(Math.random() * 10000000),
    network_txPackets: Math.floor(Math.random() * 10000000),
    status: randomStatus(),
    uptime: Math.floor(Math.random() * 8760), // 0-8760 hours
    load_avg_1m: Math.random() * 8,
    load_avg_5m: Math.random() * 8,
    load_avg_15m: Math.random() * 8,
    temperature: 35 + Math.random() * 30, // 35-65°C
    power_usage: 100 + Math.random() * 400, // 100-500W
    fan_speed: 30 + Math.random() * 70, // 30-100%
    gpu_count: i % 5, // 0-4 GPUs
    process_count: 50 + Math.floor(Math.random() * 200),
    connection_count: Math.floor(Math.random() * 1000),
    last_updated: randomTimestamp(),
  };
});
