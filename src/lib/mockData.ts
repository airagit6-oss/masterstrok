// Generate realistic mock data for the admin panel

export const generateSparkline = (points = 20, min = 10, max = 100) => {
  const data = [];
  let val = Math.random() * (max - min) + min;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * (max - min) * 0.15;
    val = Math.max(min, Math.min(max, val));
    data.push({ t: i, v: Math.round(val) });
  }
  return data;
};

export const generateTimeSeries = (points = 50, min = 0, max = 100) => {
  const now = Date.now();
  const data = [];
  let val = Math.random() * (max - min) + min;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * (max - min) * 0.08;
    val = Math.max(min, Math.min(max, val));
    data.push({
      time: new Date(now - (points - i) * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(val * 10) / 10,
    });
  }
  return data;
};

export const kpiData = () => ({
  activeUsers: { value: Math.floor(Math.random() * 5000 + 12000), change: +(Math.random() * 10 - 2).toFixed(1) },
  requestsPerSec: { value: Math.floor(Math.random() * 2000 + 8000), change: +(Math.random() * 8 - 1).toFixed(1) },
  errorRate: { value: +(Math.random() * 3 + 0.5).toFixed(2), change: +(Math.random() * 2 - 1).toFixed(1) },
  revenuePerMin: { value: Math.floor(Math.random() * 500 + 2000), change: +(Math.random() * 12 - 3).toFixed(1) },
  activeSubs: { value: Math.floor(Math.random() * 2000 + 45000), change: +(Math.random() * 5).toFixed(1) },
});

const eventTypes = ['login', 'app_launch', 'payment', 'error', 'logout', 'api_call', 'signup', 'subscription'] as const;
const statuses = ['success', 'fail'] as const;
const appNames = ['WebApp Pro', 'Mobile Suite', 'Analytics Engine', 'API Gateway', 'Auth Service', 'Payment Processor', 'Data Pipeline', 'CDN Manager'];
const userNames = ['alex.chen', 'sarah.kumar', 'mike.ross', 'emma.wilson', 'james.lee', 'lisa.wang', 'david.park', 'anna.smith', 'tom.jones', 'nina.patel'];
const locations = ['US-East', 'US-West', 'EU-West', 'EU-Central', 'AP-South', 'AP-East', 'SA-East'];
const devices = ['Chrome/Mac', 'Safari/iOS', 'Firefox/Linux', 'Chrome/Win', 'Edge/Win', 'Chrome/Android'];
const serverNames = ['prod-web-01', 'prod-web-02', 'prod-api-01', 'prod-api-02', 'prod-db-01', 'prod-db-02', 'prod-cache-01', 'prod-worker-01'];

export const generateLog = (id: number) => ({
  id,
  timestamp: new Date().toISOString(),
  eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
  userId: `usr_${Math.random().toString(36).substring(2, 10)}`,
  appName: appNames[Math.floor(Math.random() * appNames.length)],
  status: Math.random() > 0.15 ? 'success' : 'fail' as typeof statuses[number],
  message: Math.random() > 0.15 ? 'Request processed successfully' : `Error: ${['Timeout', 'Auth failed', '500 Internal', 'Rate limited', 'Connection refused'][Math.floor(Math.random() * 5)]}`,
});

export const generateLogs = (count = 50) => Array.from({ length: count }, (_, i) => ({
  ...generateLog(i),
  timestamp: new Date(Date.now() - (count - i) * 3000).toISOString(),
}));

export const generateUsers = (count = 20) => Array.from({ length: count }, (_, i) => ({
  id: `usr_${Math.random().toString(36).substring(2, 10)}`,
  name: userNames[i % userNames.length],
  status: Math.random() > 0.3 ? 'live' : 'offline' as const,
  currentApp: appNames[Math.floor(Math.random() * appNames.length)],
  location: locations[Math.floor(Math.random() * locations.length)],
  device: devices[Math.floor(Math.random() * devices.length)],
  sessionDuration: `${Math.floor(Math.random() * 120)}m ${Math.floor(Math.random() * 60)}s`,
}));

export const generateApps = () => appNames.map(name => ({
  name,
  status: Math.random() > 0.1 ? 'Running' : 'Down' as const,
  activeUsers: Math.floor(Math.random() * 5000 + 100),
  requestsMin: Math.floor(Math.random() * 3000 + 200),
  errorPercent: +(Math.random() * 5).toFixed(2),
  sparkline: generateSparkline(15, 0, 100),
}));

export const generateServers = () => serverNames.map(name => ({
  name,
  cpu: Math.floor(Math.random() * 60 + 20),
  ram: Math.floor(Math.random() * 50 + 30),
  disk: Math.floor(Math.random() * 40 + 20),
  status: Math.random() > 0.05 ? 'Healthy' : 'Warning' as const,
  sparkline: generateSparkline(15, 10, 95),
}));

export const generateAlerts = () => [
  { id: 1, name: 'CPU Spike on prod-api-01', severity: 'Critical' as const, status: 'Active' as const, time: '2 min ago', rule: 'CPU > 90%' },
  { id: 2, name: 'Error rate above threshold', severity: 'Medium' as const, status: 'Active' as const, time: '15 min ago', rule: 'Error rate > 5%' },
  { id: 3, name: 'Payment failure spike', severity: 'Critical' as const, status: 'Resolved' as const, time: '1 hour ago', rule: 'Payment fail > 10%' },
  { id: 4, name: 'Suspicious login detected', severity: 'Medium' as const, status: 'Active' as const, time: '30 min ago', rule: 'Geo anomaly' },
  { id: 5, name: 'Disk usage warning', severity: 'Low' as const, status: 'Resolved' as const, time: '3 hours ago', rule: 'Disk > 80%' },
  { id: 6, name: 'Memory leak detected', severity: 'Critical' as const, status: 'Active' as const, time: '5 min ago', rule: 'RAM growth > 5%/min' },
  { id: 7, name: 'API latency degradation', severity: 'Medium' as const, status: 'Active' as const, time: '45 min ago', rule: 'p99 > 500ms' },
  { id: 8, name: 'SSL certificate expiring', severity: 'Low' as const, status: 'Active' as const, time: '2 days ago', rule: 'Cert < 7 days' },
];
