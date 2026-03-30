import { MetricPanel } from "@/components/dashboard/MetricPanel";
import { generateTimeSeries } from "@/lib/mockData";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Bar, BarChart, ComposedChart, Line } from "recharts";

const tt = {
  contentStyle: { background: "hsl(215,28%,9%)", border: "1px solid hsl(215,18%,14%)", borderRadius: 6, fontSize: 12 },
  labelStyle: { color: "hsl(210,20%,88%)" },
  itemStyle: { color: "hsl(210,20%,75%)" },
};

export default function RevenuePage() {
  const [revenueMin] = useState(generateTimeSeries(40, 1000, 5000));
  const [subGrowth] = useState(generateTimeSeries(30, 40000, 55000));
  const [paymentData] = useState(() => generateTimeSeries(20, 80, 100).map(d => ({
    ...d, success: d.value, failure: Math.round(100 - d.value)
  })));
  const topPayers = [
    { name: "Acme Corp", revenue: "$124,500", plan: "Enterprise" },
    { name: "TechStart Inc", revenue: "$89,200", plan: "Business" },
    { name: "Global Media", revenue: "$76,800", plan: "Enterprise" },
    { name: "DataFlow Labs", revenue: "$65,300", plan: "Business" },
    { name: "CloudNine AI", revenue: "$52,100", plan: "Business" },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Revenue Metrics</h2>
      <div className="grid grid-cols-2 gap-3">
        <MetricPanel title="Revenue Per Minute ($)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueMin}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="revMinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142,71%,45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(142,71%,45%)" strokeWidth={2} fill="url(#revMinGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Subscription Growth">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={subGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <defs>
                <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(270,70%,60%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(270,70%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(270,70%,60%)" strokeWidth={2} fill="url(#subGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Payment Success vs Failure (%)">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215,18%,14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215,15%,50%)" }} tickLine={false} axisLine={false} />
              <Tooltip {...tt} />
              <Bar dataKey="success" fill="hsl(142,71%,45%)" radius={[2, 2, 0, 0]} name="Success" />
              <Line type="monotone" dataKey="failure" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={false} name="Failure" />
            </ComposedChart>
          </ResponsiveContainer>
        </MetricPanel>

        <MetricPanel title="Top Paying Customers">
          <div className="space-y-2">
            {topPayers.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <span className="text-xs text-muted-foreground w-5">#{i + 1}</span>
                <div className="flex-1">
                  <div className="text-sm text-foreground font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.plan}</div>
                </div>
                <span className="text-sm font-mono text-dd-success font-medium">{p.revenue}</span>
              </div>
            ))}
          </div>
        </MetricPanel>
      </div>
    </div>
  );
}
