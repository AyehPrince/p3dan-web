"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { DashboardCharts as DashboardChartsType } from "@/lib/admin";

const STATUS_COLORS: Record<string, string> = {
  pending: "#B4B2A9",
  active: "#0F6E56",
  rejected: "#D85A30",
  rented: "#F0997B",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  rejected: "Rejected",
  rented: "Rented",
};

export default function DashboardCharts({ data }: { data: DashboardChartsType }) {
  const trendData = data.trend.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  const statusData = data.byStatus.map((s) => ({
    ...s,
    label: statusLabels[s.status] || s.status,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
      <div className="lg:col-span-2 bg-canvas-card border border-warmgray-100 rounded-2xl p-5">
        <h2 className="font-medium text-sm mb-4">New listings, last 14 days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F6E56" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0F6E56" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#888780" }}
              axisLine={{ stroke: "#D3D1C7" }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#888780" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                background: "#F7F3EA",
                border: "1px solid #D3D1C7",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0F6E56"
              strokeWidth={2}
              fill="url(#trendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-canvas-card border border-warmgray-100 rounded-2xl p-5">
        <h2 className="font-medium text-sm mb-4">Listings by status</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="count"
              nameKey="label"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {statusData.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#F7F3EA",
                border: "1px solid #D3D1C7",
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: "#5F5E5A" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:col-span-3 bg-canvas-card border border-warmgray-100 rounded-2xl p-5">
        <h2 className="font-medium text-sm mb-4">Listings by city</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.byCity}>
            <XAxis
              dataKey="city"
              tick={{ fontSize: 11, fill: "#888780" }}
              axisLine={{ stroke: "#D3D1C7" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#888780" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{
                background: "#F7F3EA",
                border: "1px solid #D3D1C7",
                borderRadius: 10,
                fontSize: 12,
              }}
              cursor={{ fill: "#EDE7DC" }}
            />
            <Bar dataKey="count" fill="#D85A30" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}