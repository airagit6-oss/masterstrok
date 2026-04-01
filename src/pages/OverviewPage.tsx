import { useState } from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MetricPanel } from "@/components/dashboard/MetricPanel";
import { generateTimeSeries } from "@/lib/mockData";
import { useAdminMetrics } from "@/hooks/useAdminData";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Bar, BarChart, Line, LineChart, ComposedChart } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(215,28%,9%)", border: "1px solid hsl(215,18%,14%)", borderRadius: 6, fontSize: 12 },
  labelStyle: { color: "hsl(210,20%,88%)" },
  itemStyle: { color: "hsl(210,20%,75%)" },
};

export default function OverviewPage() {
  const { data: kpi } = useAdminMetrics();
  const [usersData] = useState(generateTimeSeries(30, 8000, 15000));
  const [revenueData] = useState(generateTimeSeries(30, 1500, 4000));
  const [appUsageData] = useState(() => ['WebApp', 'Mobile', 'API', 'Analytics', 'Auth', 'CDN'].map(n => ({
    name: n, value: Math.floor(Math.random() * 5000 + 500)
  })));
  const [errorData] = useState(generateTimeSeries(30, 0, 8));
  const [latencyData] = useState(generateTimeSeries(30, 20, 300));
  const [systemData] = useState(() => generateTimeSeries(30, 30, 90).map((d) => ({
    ...d, ram: Math.round(40 + Math.random() * 40), cpu: d.value
  })));

  if (!kpi) return null;

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3">
        <KpiCard title="Active Users" value={kpi.activeUsers.value} change={kpi.activeUsers.change} color="blue" />
        <KpiCard title="Req/sec" value={kpi.requestsPerSec.value} change={kpi.requestsPerSec.change} color="green" />
        <KpiCard title="Error Rate" value={kpi.errorRate.value} change={kpi.errorRate.change} color="red" suffix="%" />
        <KpiCard title="Revenue/min" value={kpi.revenuePerMin.value} change={kpi.revenuePerMin.change} color="yellow" prefix="$" />
        <KpiCard title="Active Subs" value={kpi.activeSubs.value} change={kpi.activeSubs.change} color="purple" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-3 gap-3">
        <MetricPanel title="Users Activity">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210,100%,56%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(210,100%,56%)" strokeWidth={2} fill="url(#userGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Revenue Stream">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142,71%,45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(142,71%,45%)" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="App Usage">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="value" fill="hsl(270,70%,60%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MetricPanel>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricPanel title="Error Rate">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={errorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="API Latency (ms)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="CPU / RAM">
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Area type="monotone" dataKey="cpu" stroke="hsl(210,100%,56%)" fill="hsl(210,100%,56%)" fillOpacity={0.15} strokeWidth={1.5} dot={false} name="CPU %" />
              <Line type="monotone" dataKey="ram" stroke="hsl(186,80%,50%)" strokeWidth={1.5} dot={false} name="RAM %" />
            </ComposedChart>
          </ResponsiveContainer>
        </MetricPanel>
      </div>
    </div>
  );
}
