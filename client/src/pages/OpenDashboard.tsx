import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  Search,
  Bell,
  TrendingUp,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Projects", icon: FolderKanban, active: false },
  { label: "Tasks", icon: CheckSquare, active: false },
  { label: "Team", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const STATS = [
  { label: "Total Revenue", value: "$45,231.89", delta: "+20.1% from last month", deltaPositive: true },
  { label: "Active Projects", value: "12", delta: "+3 from last month", deltaPositive: false },
  { label: "Completed Tasks", value: "1,240", delta: "+15% from last month", deltaPositive: false },
  { label: "Team Members", value: "8", delta: "Since last month", deltaPositive: false },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 19500 },
  { month: "Apr", revenue: 27000 },
  { month: "May", revenue: 25000 },
  { month: "Jun", revenue: 32000 },
  { month: "Jul", revenue: 30500 },
  { month: "Aug", revenue: 38000 },
  { month: "Sep", revenue: 36000 },
  { month: "Oct", revenue: 42000 },
  { month: "Nov", revenue: 40500 },
  { month: "Dec", revenue: 45231 },
];

const ACTIVITY = [
  { text: "Kenny H. created a new project", time: "2 hrs ago" },
  { text: "Mindy I. completed task 'Design UI'", time: "4 hrs ago" },
  { text: "Kevin H. joined the team", time: "1 day ago" },
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-800 bg-slate-950 px-5 py-6">
      <p className="text-lg font-bold tracking-widest text-white">GIANTBITE</p>
      <nav className="mt-8 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-8 py-4">
      <div className="relative w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
          Upgrade
        </button>
        <button className="text-slate-400 transition hover:text-white">
          <Bell size={20} />
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
      </div>
    </header>
  );
}

function StatCard({ label, value, delta, deltaPositive }: { label: string; value: string; delta: string; deltaPositive: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className={`mt-1 text-xs ${deltaPositive ? "text-green-400" : "text-slate-400"}`}>{delta}</p>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm font-semibold text-white">Revenue Overview</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "0.75rem", color: "#fff" }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2.5} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm font-semibold text-white">Recent Activity</p>
      <ul className="mt-4 space-y-4">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <TrendingUp size={14} className="text-indigo-400" />
            </span>
            <div>
              <p className="text-sm text-slate-200">{a.text}</p>
              <p className="text-xs text-slate-500">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OpenDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="px-8 py-8">
          <h1 className="text-2xl font-semibold text-white">Welcome back, Kenny!</h1>
          <p className="mt-1 text-sm text-slate-400">Here's what's happening with your projects today.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}
