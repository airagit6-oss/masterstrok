import { MetricPanel } from "@/components/dashboard/MetricPanel";
import { generateTimeSeries } from "@/lib/mockData";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart } from "recharts";

const tt = {
  contentStyle: { background: "hsl(215,28%,9%)", border: "1px solid hsl(215,18%,14%)", borderRadius: 6, fontSize: 12 },
  labelStyle: { color: "hsl(210,20%,88%)" },
  itemStyle: { color: "hsl(210,20%,75%)" },
};

export default function MetricsPage() {
  const [cpuData] = useState(generateTimeSeries(50, 20, 90));
  const [memData] = useState(generateTimeSeries(50, 30, 85));
  const [netData] = useState(generateTimeSeries(50, 100, 800));
  const [ioData] = useState(generateTimeSeries(50, 5, 60));

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Metrics Explorer</h2>
      <div className="grid grid-cols-2 gap-3">
        <MetricPanel title="CPU Utilization (%)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="cpuG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210,100%,56%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(210,100%,56%)" strokeWidth={2} fill="url(#cpuG)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Memory Usage (%)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={memData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="memG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142,71%,45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(142,71%,45%)" strokeWidth={2} fill="url(#memG)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Network I/O (MB/s)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={netData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <Line type="monotone" dataKey="value" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Disk I/O (ops/s)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <Line type="monotone" dataKey="value" stroke="hsl(270,70%,60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MetricPanel>
      </div>
    </div>
  );
}
