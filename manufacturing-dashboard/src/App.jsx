import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Bell, 
  DollarSign, 
  LineChart, 
  Cpu, 
  AlertCircle, 
  Package, 
  ShieldCheck, 
  Factory, 
  Bot, 
  ChevronRight, 
  Activity, 
  Box,
  Menu,
  Search,
  ChevronLeft,
  Thermometer,
  Zap,
  Droplet,
  Gauge,
  Clipboard,
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Timer,
  Maximize2,
  User,
  ArrowRight,
  Filter,
  Shield,
  Award,
  BookOpen,
  ArrowLeft,
  Siren,
  Info,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Trash2,
  Bug
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LabelList,
  Legend,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';

// --- Mock Data ---

const KPI_DATA = [
  {
    id: "active",
    title: "ACTIVE MACHINES",
    value: "64",
    subtext: "Online Units",
    icon: <Cpu className="w-6 h-6 text-slate-400" />,
    borderColor: "border-blue-500",
    textColor: "text-blue-400"
  },
  {
    id: "down",
    title: "DOWN MACHINES",
    value: "5",
    subtext: "Requires Maintenance",
    icon: <AlertCircle className="w-6 h-6 text-slate-400" />,
    borderColor: "border-red-500",
    textColor: "text-red-400"
  },
  {
    id: "output",
    title: "TOTAL OUTPUT",
    value: "124k",
    subtext: "Units Produced Today",
    icon: <Package className="w-6 h-6 text-slate-400" />,
    borderColor: "border-emerald-500",
    textColor: "text-emerald-400"
  },
  {
    id: "safety",
    title: "AVG SAFETY",
    value: "98%",
    subtext: "Plant Wide Score",
    icon: <ShieldCheck className="w-6 h-6 text-slate-400" />,
    borderColor: "border-purple-500",
    textColor: "text-purple-400"
  }
];

const DEPARTMENTS = [
  {
    id: 1,
    name: "Assembly",
    totalUnits: 45,
    downCount: 0,
    activeCount: 45,
    icon: <Factory className="w-6 h-6 text-slate-300" />,
    status: "good"
  },
  {
    id: 2,
    name: "Casting",
    totalUnits: 12,
    downCount: 1,
    activeCount: 11,
    icon: <Activity className="w-6 h-6 text-slate-300" />,
    status: "warning"
  },
  {
    id: 3,
    name: "Finishing",
    totalUnits: 18,
    downCount: 0,
    activeCount: 18,
    icon: <ShieldCheck className="w-6 h-6 text-slate-300" />,
    status: "good"
  },
  {
    id: 4,
    name: "Machining",
    totalUnits: 24,
    downCount: 2,
    activeCount: 22,
    icon: <Bot className="w-6 h-6 text-slate-300" />,
    status: "warning"
  },
  {
    id: 5,
    name: "Packaging",
    totalUnits: 30,
    downCount: 3,
    activeCount: 27,
    icon: <Package className="w-6 h-6 text-slate-300" />,
    status: "critical"
  }
];

const ACTIVITY_FEED = [
  { id: 1, message: "Batch #20248: Started", time: "3:18:17 PM", type: "info" },
  { id: 2, message: "Packaging: Speed Up", time: "3:18:14 PM", type: "alert" },
  { id: 3, message: "Packaging: Speed Up", time: "3:18:10 PM", type: "alert" },
  { id: 4, message: "Maint. Request: Unit 4", time: "3:15:00 PM", type: "warning" },
  { id: 5, message: "Shift Change Complete", time: "3:00:00 PM", type: "info" },
];

const MAINT_LOGS = [
  { date: "2023-10-20", type: "Routine Check", technician: "J. Doe", cost: "$250" },
  { date: "2023-09-15", type: "Calibration", technician: "S. Smith", cost: "$120" },
  { date: "2023-08-05", type: "Filter Replacement", technician: "M. Johnson", cost: "$85" },
];

const DOWN_MACHINES_LIST = [
  {
    id: "M-1014",
    name: "Machining #3",
    dept: "Machining",
    issue: "Overheating",
    downtime: "9 min",
    estFix: "2h 38m",
    impact: "Low - Buffer Available",
    impactLevel: "low",
  },
  {
    id: "M-1036",
    name: "Finishing #1",
    dept: "Finishing",
    issue: "Software Error",
    downtime: "43 min",
    estFix: "1h 0m",
    impact: "Low - Buffer Available",
    impactLevel: "low",
  },
  {
    id: "P-2002",
    name: "Packaging #4",
    dept: "Packaging",
    issue: "Jam / Blockage",
    downtime: "1h 12m",
    estFix: "4h 0m",
    impact: "Medium - Reduced Rate",
    impactLevel: "medium",
  },
  {
    id: "C-005",
    name: "Casting #5",
    dept: "Casting",
    issue: "Power Failure",
    downtime: "3h 05m",
    estFix: "Unknown",
    impact: "High - Line Blockage",
    impactLevel: "high",
  },
  {
    id: "M-1015",
    name: "Machining #4",
    dept: "Machining",
    issue: "Tool Breakage",
    downtime: "15 min",
    estFix: "0h 45m",
    impact: "Low - Buffer Available",
    impactLevel: "low",
  },
];

const FLEET_DATA = [
  {
    id: "C-1009",
    name: "Casting #9",
    dept: "Casting",
    manufacturer: "Siemens",
    status: "active",
    isCritical: true,
    rul: "3987h",
    cost: "$4948",
    safety: "90%",
    operator: "Elena Rodriguez",
    image: "image_177e9e.jpg", 
    imageGradient: "from-orange-900/60 to-slate-900",
    temp: 512,
    output: "0.5k"
  },
  {
    id: "M-1019",
    name: "Machining #19",
    dept: "Machining",
    manufacturer: "Kuka",
    status: "active",
    isCritical: false,
    rul: "8005h",
    cost: "$4919",
    safety: "91%",
    operator: "Elena Rodriguez",
    image: "image_177ed9.jpg", 
    imageGradient: "from-blue-900/60 to-slate-900",
    temp: 420,
    output: "0.8k"
  },
  {
    id: "P-2002",
    name: "Packaging #2",
    dept: "Packaging",
    manufacturer: "Fanuc",
    status: "active",
    isCritical: false,
    rul: "3580h",
    cost: "$4918",
    safety: "95%",
    operator: "Mike Ross",
    image: "image_177e66.jpg", 
    imageGradient: "from-emerald-900/60 to-slate-900",
    temp: 120,
    output: "2.1k"
  },
  {
    id: "A-3017",
    name: "Assembly #5",
    dept: "Assembly",
    manufacturer: "Fanuc",
    status: "active",
    isCritical: true,
    rul: "4238h",
    cost: "$4994",
    safety: "92%",
    operator: "James Wilson",
    image: "image_177b9d.jpg", 
    imageGradient: "from-purple-900/60 to-slate-900",
    temp: 305,
    output: "1.2k"
  },
  {
    id: "A-3018",
    name: "Assembly #18",
    dept: "Assembly",
    manufacturer: "ABB",
    status: "idle",
    isCritical: true,
    rul: "1150h",
    cost: "$3100",
    safety: "89%",
    operator: "John Smith",
    image: "image_177b9d.jpg", 
    imageGradient: "from-indigo-900/60 to-slate-900",
    temp: 200,
    output: "0.0k"
  },
  {
    id: "F-5001", 
    name: "Finishing #4",
    dept: "Finishing",
    manufacturer: "Doosan",
    status: "active",
    isCritical: false,
    rul: "6540h",
    cost: "$4200",
    safety: "94%",
    operator: "David Chen",
    image: "image_177b57.jpg", 
    imageGradient: "from-amber-900/60 to-slate-900",
    temp: 150,
    output: "1.8k"
  }
];

const BATCH_DATA = [
  {
    id: "B-20240",
    name: "Engine Block V8",
    planned: 2000,
    actual: 900,
    deadline: "2023-11-10",
    completion: 45.0,
    stages: [
      { name: "Casting", percent: 37, color: "bg-blue-500" },
      { name: "Machining", percent: 17, color: "bg-blue-500" },
      { name: "Finishing", percent: 38, color: "bg-blue-500" },
      { name: "Assembly", percent: 43, color: "bg-blue-500" },
      { name: "Packaging", percent: 13, color: "bg-blue-500" },
    ],
    activeMachines: ["Assembly #13", "Casting #4", "Finishing #5", "Machining #9"],
    activeMachinesCount: 16,
    operators: ["David Chen", "Elena Rodriguez", "James Wilson"],
    operatorsMore: 2,
    yield: "95%",
    defects: 12
  },
  {
    id: "B-20241",
    name: "Transmission Case",
    planned: 1500,
    actual: 1200,
    deadline: "2023-11-12",
    completion: 80.0,
    stages: [
      { name: "Casting", percent: 100, color: "bg-emerald-500" },
      { name: "Machining", percent: 95, color: "bg-emerald-500" },
      { name: "Finishing", percent: 85, color: "bg-emerald-500" },
      { name: "Assembly", percent: 60, color: "bg-blue-500" },
      { name: "Packaging", percent: 20, color: "bg-blue-500" },
    ],
    activeMachines: ["Casting #1", "Machining #2", "Assembly #4"],
    activeMachinesCount: 8,
    operators: ["Sarah Connor", "Mike Ross"],
    operatorsMore: 0,
    yield: "98%",
    defects: 5
  },
  {
    id: "B-20242",
    name: "Brake Caliper Assembly",
    planned: 5000,
    actual: 250,
    deadline: "2023-11-20",
    completion: 5.0,
    stages: [
      { name: "Casting", percent: 15, color: "bg-blue-500" },
      { name: "Machining", percent: 5, color: "bg-blue-500" },
      { name: "Finishing", percent: 0, color: "bg-slate-700" },
      { name: "Assembly", percent: 0, color: "bg-slate-700" },
      { name: "Packaging", percent: 0, color: "bg-slate-700" },
    ],
    activeMachines: ["Casting #8", "Machining #12"],
    activeMachinesCount: 4,
    operators: ["John Smith"],
    operatorsMore: 1,
    yield: "92%",
    defects: 24
  }
];

const OPERATORS_DATA = [
  {
    id: "OP-101",
    name: "Sarah Jenkins",
    role: "Senior Operator",
    shift: "Shift A",
    experience: "5 Years Exp.",
    machinesActive: "17 Active",
    safetyScore: "98",
    safetyScoreColor: "text-emerald-400",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random&color=fff",
    incidents: 0,
    nearMisses: 1,
    ppeCompliance: 100,
    sopAdherence: 99,
    safetyViolations: 0,
    assignedUnits: 17,
    performance: "98%",
    qualifiedMachines: ["Assembly #5", "Packaging #2", "Sorting Unit A"]
  },
  {
    id: "OP-102",
    name: "Mike Ross",
    role: "Machinist",
    shift: "Shift B",
    experience: "2 Years Exp.",
    machinesActive: "17 Active",
    safetyScore: "82",
    safetyScoreColor: "text-yellow-400",
    avatar: "https://ui-avatars.com/api/?name=Mike+Ross&background=random&color=fff",
    incidents: 1,
    nearMisses: 3,
    ppeCompliance: 92,
    sopAdherence: 88,
    safetyViolations: 1,
    assignedUnits: 12,
    performance: "85%",
    qualifiedMachines: ["Machining #19", "Casting #12"]
  },
  {
    id: "OP-103",
    name: "David Chen",
    role: "Technician",
    shift: "Shift A",
    experience: "12 Years Exp.",
    machinesActive: "16 Active",
    safetyScore: "95",
    safetyScoreColor: "text-emerald-400",
    avatar: "https://ui-avatars.com/api/?name=David+Chen&background=random&color=fff",
    incidents: 0,
    nearMisses: 0,
    ppeCompliance: 100,
    sopAdherence: 100,
    safetyViolations: 0,
    assignedUnits: 16,
    performance: "99%",
    qualifiedMachines: ["Finishing #4", "Packaging #1", "Assembly #3"]
  },
  {
    id: "OP-104",
    name: "Elena Rodriguez",
    role: "Operator",
    shift: "Shift C",
    experience: "4 Years Exp.",
    machinesActive: "15 Active",
    safetyScore: "90",
    safetyScoreColor: "text-yellow-400",
    avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random&color=fff",
    incidents: 0,
    nearMisses: 2,
    ppeCompliance: 95,
    sopAdherence: 94,
    safetyViolations: 0,
    assignedUnits: 15,
    performance: "92%",
    qualifiedMachines: ["Casting #9", "Machining #19"]
  }
];

const ALERT_DATA = [
  {
    id: "AL-101",
    type: "safety",
    priority: "high",
    machine: "Casting #9",
    message: "Emergency Stop Triggered - Manual Intervention Required",
    time: "2 mins ago",
    details: "Emergency stop button pressed at station 4. Machine halted immediately. Requires manual reset and safety check before restart.",
    status: "new"
  },
  {
    id: "AL-102",
    type: "predictive",
    priority: "medium",
    machine: "Machining #19",
    message: "Vibration anomalies detected - 85% probability of spindle failure within 48h",
    time: "15 mins ago",
    details: "Vibration sensor reading exceeded threshold (4.5mm/s) for > 10 minutes. Pattern matches bearing wear signature.",
    status: "new"
  },
  {
    id: "AL-103",
    type: "safety",
    priority: "high",
    machine: "Assembly #5",
    message: "Light curtain breach detected during operation cycle",
    time: "1 hour ago",
    details: "Safety light curtain interrupted while machine was in motion. Automatic braking engaged.",
    status: "acknowledged"
  },
  {
    id: "AL-104",
    type: "predictive",
    priority: "low",
    machine: "Packaging #2",
    message: "Motor temperature rising steadily - potential filter clog",
    time: "3 hours ago",
    details: "Temperature gradient +2°C/hr over last 4 hours. Airflow sensors indicate reduced intake.",
    status: "acknowledged"
  },
  {
    id: "AL-105",
    type: "safety",
    priority: "medium",
    machine: "Finishing #4",
    message: "Safety guard door sensor intermittent signal",
    time: "5 hours ago",
    details: "Door interlock sensor reporting open/closed rapid cycling. Wiring or sensor fault suspected.",
    status: "resolved"
  },
  {
    id: "AL-106",
    type: "predictive",
    priority: "medium",
    machine: "Assembly #18",
    message: "Hydraulic pressure dropping below optimal range",
    time: "Yesterday",
    details: "System pressure at 85% of nominal. Leak test recommended.",
    status: "resolved"
  }
];

const COST_KPI_DATA = [
  {
    title: "TOTAL OPERATING COST",
    value: "$918,816",
    subtext: "/ Target: $872,875",
    trend: "5.3% vs Budget",
    trendColor: "text-red-400",
    trendIcon: <TrendingUp className="w-4 h-4 mr-1" />
  },
  {
    title: "COST PER UNIT",
    value: "$124.50",
    subtext: null,
    trend: "-2.4% vs Last Month",
    trendColor: "text-emerald-400",
    trendIcon: <TrendingDown className="w-4 h-4 mr-1" />
  },
  {
    title: "DOWNTIME COST",
    value: "$24,742",
    subtext: "Est. Lost Revenue",
    trend: null,
    trendColor: "text-orange-400" // Using orange for warning-like metric
  },
  {
    title: "SCRAP COST",
    value: "$6,388",
    subtext: "Material Waste",
    trend: null,
    trendColor: "text-slate-400"
  }
];

const QUALITY_KPI_DATA = [
  {
    title: "FIRST PASS YIELD",
    value: "94.5%",
    subtext: "Target: 96%",
    color: "text-white",
    barColor: "bg-emerald-500",
    icon: <CheckCircle className="w-5 h-5 text-slate-400" />
  },
  {
    title: "DEFECT RATE",
    value: "1250 PPM",
    subtext: "Parts Per Million",
    color: "text-white",
    barColor: "bg-red-500",
    icon: <Bug className="w-5 h-5 text-slate-400" />
  },
  {
    title: "SCRAP COST (SHIFT)",
    value: "$4200",
    subtext: "Material Loss",
    color: "text-white",
    barColor: "bg-orange-500",
    icon: <Trash2 className="w-5 h-5 text-slate-400" />
  },
  {
    title: "REWORK RATE",
    value: "3.2%",
    subtext: "Units Reprocessed",
    color: "text-white",
    barColor: "bg-blue-500",
    icon: <Wrench className="w-5 h-5 text-slate-400" />
  }
];

const QUALITY_INCIDENTS = [
  { id: "QI-209", machine: "Casting #9", defect: "Porosity", time: "10:23 AM", status: "Investigating" },
  { id: "QI-210", machine: "Machining #19", defect: "Dim. Tolerance", time: "11:45 AM", status: "Resolved" },
  { id: "QI-211", machine: "Assembly #5", defect: "Misalignment", time: "01:15 PM", status: "Pending" },
  { id: "QI-212", machine: "Packaging #2", defect: "Label Error", time: "02:30 PM", status: "Resolved" },
  { id: "QI-213", machine: "Finishing #4", defect: "Scratch", time: "03:10 PM", status: "Investigating" },
];

// Helper to generate machine data for the drill down view
const generateMachines = (deptName, count) => {
  return Array.from({ length: count }, (_, i) => {
    const isDown = Math.random() > 0.85;
    const isCritical = Math.random() > 0.9;
    return {
      id: `${deptName.substring(0, 3).toUpperCase()}-${100 + i}`,
      name: `${deptName} #${i + 1}`,
      status: isDown ? 'down' : 'active',
      isCritical: isCritical,
      temp: Math.floor(Math.random() * (550 - 300) + 300), 
      output: (Math.random() * (0.8 - 0.1) + 0.1).toFixed(1) + 'k' 
    };
  });
};

// --- Components ---

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 
      ${active 
        ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/10' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-4 border-transparent'
      }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const KPICard = ({ data, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-slate-800 rounded-lg p-5 relative overflow-hidden flex flex-col justify-between h-32 shadow-xl shadow-black/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 border border-slate-700/50 
    ${onClick ? 'cursor-pointer hover:bg-slate-750 active:scale-95' : ''}`}
  >
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{data.title}</span>
      <div className="bg-slate-700/50 p-2 rounded-lg shadow-inner shadow-black/20">
        {data.icon}
      </div>
    </div>
    <div>
      <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">{data.value}</div>
      <div className={data.textColor + " text-xs font-medium"}>{data.subtext}</div>
    </div>
    <div className={`absolute bottom-0 left-0 w-full h-1 ${data.borderColor.replace('border', 'bg')}`}></div>
    <div className={`absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-${data.borderColor.split('-')[1]}-500/10 to-transparent pointer-events-none`}></div>
  </div>
);

// New Cost KPI Card component
const CostKPICard = ({ data }) => (
  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg flex flex-col justify-between h-40 hover:border-slate-600 transition-colors">
    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">{data.title}</div>
    <div>
      <div className="flex items-end gap-2 mb-1">
        <span className="text-3xl font-bold text-white">{data.value}</span>
        {data.subtext && <span className="text-slate-500 text-xs mb-1">{data.subtext}</span>}
      </div>
      {data.trend ? (
        <div className={`text-xs font-bold ${data.trendColor} flex items-center`}>
          {data.trendIcon}
          {data.trend}
        </div>
      ) : (
        <div className={`text-xs font-bold ${data.trendColor || 'text-slate-500'}`}>
           {data.subtext} {/* Reuse subtext if no trend, or specific text from image */}
        </div>
      )}
    </div>
  </div>
);

const QualityKPICard = ({ data }) => (
  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-lg flex flex-col justify-between h-40 hover:border-slate-600 transition-colors relative overflow-hidden">
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{data.title}</span>
      <div className="bg-slate-700/50 p-2 rounded-lg shadow-inner shadow-black/20">
        {data.icon}
      </div>
    </div>
    <div>
      <div className="text-4xl font-bold text-white mb-1">{data.value}</div>
      <div className="text-slate-500 text-xs font-medium">{data.subtext}</div>
    </div>
    {/* Colored Bar at Bottom */}
    <div className={`absolute bottom-0 left-4 right-4 h-1.5 rounded-t-full ${data.barColor}`}></div>
  </div>
);


const DepartmentCard = ({ dept, onDrillDown }) => {
  const activePercent = (dept.activeCount / dept.totalUnits) * 100;
  
  return (
    <div 
      onClick={() => onDrillDown(dept)}
      className="bg-slate-700/30 border border-slate-700 rounded-xl p-5 flex flex-col space-y-4 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all cursor-pointer group shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-700 p-3 rounded-lg group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors shadow-md shadow-black/20">
            {dept.icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg drop-shadow-sm">{dept.name}</h3>
            <span className="text-slate-400 text-xs">{dept.totalUnits} UNITS</span>
          </div>
        </div>
        {dept.downCount > 0 ? (
          <div className="flex items-center space-x-1 text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span className="text-xs font-bold drop-shadow-md">{dept.downCount} Down</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-emerald-400">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
             <span className="text-xs font-bold drop-shadow-md">All Active</span>
          </div>
        )}
      </div>

      <div className="w-full bg-slate-900/50 h-2 rounded-full overflow-hidden flex shadow-inner shadow-black/40">
        <div className="bg-emerald-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: `${activePercent}%` }}></div>
        <div className="bg-red-500 h-full flex-grow shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-emerald-400 text-xs font-bold drop-shadow-sm">Active: {dept.activeCount}</span>
        <div className="flex items-center text-blue-400 text-xs font-bold group-hover:text-blue-300 transition-colors drop-shadow-sm">
          Drill Down 
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

const MachineCard = ({ machine, onClick }) => (
  <div 
    onClick={() => onClick(machine)}
    className={`relative bg-slate-800 rounded-xl p-4 border transition-all hover:shadow-2xl hover:shadow-black/60 cursor-pointer hover:border-emerald-500/50 hover:-translate-y-1 shadow-lg shadow-black/40 group
    ${machine.isCritical ? 'border-purple-500/50 shadow-purple-900/10' : 'border-slate-700'}
    ${machine.status === 'down' ? 'opacity-90' : ''}
  `}>
    {/* Status Dot */}
    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10
      ${machine.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]'}
    `}></div>

    <h3 className="text-white font-bold text-lg mb-2 pr-6 drop-shadow-md group-hover:text-emerald-400 transition-colors">{machine.name}</h3>

    {machine.isCritical ? (
      <div className="inline-block px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider mb-4 shadow-lg shadow-purple-900/50 border border-purple-400/30">
        Critical
      </div>
    ) : <div className="h-[22px] mb-4"></div>} 

    <div className="grid grid-cols-2 gap-2">
      <div className="bg-[#0B1120] rounded p-2 text-center shadow-inner shadow-black/40 border border-slate-700/30">
        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Temp</div>
        <div className="text-white font-mono font-bold text-sm">{machine.temp}°</div>
      </div>
      <div className="bg-[#0B1120] rounded p-2 text-center shadow-inner shadow-black/40 border border-slate-700/30">
        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Out</div>
        <div className="text-white font-mono font-bold text-sm">{machine.output}</div>
      </div>
    </div>
  </div>
);

const DepartmentDetail = ({ department, onBack, onSelectMachine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Generate machines only when department changes to keep data stable during search
  const machines = React.useMemo(() => generateMachines(department.name, department.totalUnits), [department]);

  const filteredMachines = machines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1120] shadow-md z-10">
        <div className="flex items-center space-x-4">
           <button 
            onClick={onBack} 
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 shadow-sm"
           > 
             <ChevronLeft className="w-5 h-5" /> 
           </button>
           <div>
             <h2 className="text-xl font-bold text-slate-400">Live Status of <span className="text-white mx-1">{machines.length}</span> machines in <span className="text-white">{department.name}</span></h2>
           </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search ID..." 
            className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full md:w-64 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
          {filteredMachines.map(machine => (
            <MachineCard key={machine.id} machine={machine} onClick={onSelectMachine} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ title, value, unit, status, statusText, isWarning }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all hover:-translate-y-0.5">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</span>
      {isWarning && <AlertTriangle className="w-4 h-4 text-red-500 drop-shadow-md" />}
      {!isWarning && status === 'good' && <CheckCircle className="w-4 h-4 text-emerald-500 drop-shadow-md" />}
    </div>
    <div className="mb-2">
      <span className="text-2xl font-bold text-white drop-shadow-sm">{value}</span>
      <span className="text-sm text-slate-500 ml-1">{unit}</span>
    </div>
    <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase w-fit shadow-sm
      ${status === 'good' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
      ${status === 'warning' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : ''}
      ${status === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
    `}>
      {statusText}
    </div>
  </div>
);

const DownMachinesModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0B1120]">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Down Machines</h2>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              {DOWN_MACHINES_LIST.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto p-6 space-y-4 bg-slate-900/50">
          {DOWN_MACHINES_LIST.map((machine, index) => (
            <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg hover:border-slate-600 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Left: Icon & Name */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center border border-slate-600 shadow-inner">
                   <Bot className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{machine.name}</h3>
                  <div className="text-sm text-slate-400 flex items-center space-x-2">
                    <span className="font-mono text-xs">{machine.id}</span>
                    <span>•</span>
                    <span>{machine.dept}</span>
                  </div>
                </div>
              </div>

              {/* Middle: Stats */}
              <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:px-8">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Downtime</div>
                  <div className="text-white font-mono font-medium">{machine.downtime}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Est. Fix</div>
                  <div className="text-white font-mono font-medium">{machine.estFix}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Impact</div>
                  <div className={`text-sm font-bold
                    ${machine.impactLevel === 'low' ? 'text-yellow-400' : ''}
                    ${machine.impactLevel === 'medium' ? 'text-orange-400' : ''}
                    ${machine.impactLevel === 'high' ? 'text-red-400' : ''}
                  `}>
                    {machine.impact}
                  </div>
                </div>
              </div>

              {/* Right: Issue Tag */}
              <div className="w-full md:w-auto flex justify-end">
                <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide">{machine.issue}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MachineDetail = ({ machine, onBack }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-[#0B1120] border-b border-slate-800 p-6 shadow-md shadow-black/20 z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <button 
              onClick={onBack}
              className="mt-1 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-md shadow-black/30 border border-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-white drop-shadow-sm">{machine.name}</h1>
                {machine.isCritical && (
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-purple-900/50 border border-purple-400/30">
                    Critical Asset
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-slate-400 font-mono">ID: {machine.id}</span>
                {machine.status === 'active' ? (
                  <span className="flex items-center text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    Running
                  </span>
                ) : (
                  <span className="flex items-center text-red-400 font-bold text-xs uppercase tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right hidden lg:block">
             <div className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-md">
               {currentTime.toLocaleTimeString('en-US', { hour12: true })}
             </div>
             <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1 drop-shadow-sm">Live Feed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-8 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('live')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors
              ${activeTab === 'live' ? 'border-emerald-500 text-emerald-400 drop-shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-300'}
            `}
          >
            Live & Today
          </button>
          <button 
             onClick={() => setActiveTab('meta')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors
              ${activeTab === 'meta' ? 'border-emerald-500 text-emerald-400 drop-shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-300'}
            `}
          >
            Machine Meta & History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {activeTab === 'live' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Real-time Readings */}
            {machine.status === 'active' ? (
              <section>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 drop-shadow-sm">Real-time Readings</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <DetailCard title="Temperature" value="517.6" unit="°C" status="danger" statusText="Overheat" isWarning={true} />
                  <DetailCard title="Vibration" value="0.41" unit="mm/s" status="good" statusText="Stable" />
                  <DetailCard title="Power Load" value="12.1" unit="kW" status="good" statusText="Normal" />
                  <DetailCard title="Coolant" value="99.2" unit="%" status="good" statusText="OK" />
                  <DetailCard title="Current Stress" value="88" unit="%" status="good" statusText="Normal" />
                </div>
              </section>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center shadow-inner shadow-black/20">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3 drop-shadow-md" />
                <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">Machine Offline</h3>
                <p className="text-slate-400 text-sm">Real-time telemetry is unavailable while the machine is down.</p>
              </div>
            )}

            {/* Today's Production */}
            <section>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 drop-shadow-sm">Today's Production</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <DetailCard title="Utilization" value="87.3" unit="%" status="good" statusText="Optimal" />
                <DetailCard title="Output Qty" value="209" unit="Units" status="good" statusText="On Target" />
                <DetailCard title="Cycle Time" value="13.8" unit="sec" status="good" statusText="Optimal" />
                <DetailCard title="Defect Rate" value="1.97" unit="%" status="warning" statusText="Acceptable" />
                <DetailCard title="Downtime" value="14" unit="min" status="good" statusText="Minimal" />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DetailCard title="Tool Wear" value="76" unit="%" status="warning" statusText="Replace Soon" />
              <DetailCard title="Rem. Useful Life" value="7,388" unit="Hrs" status="good" statusText="Healthy" />
              <DetailCard title="Accum. Stress" value="2,564" unit="Hrs" status="good" statusText="Tracking" />
              <DetailCard title="Maint. Cost" value="$2996" unit="YTD" status="warning" statusText="High Cost" />
            </div>

            {/* Bottom Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Asset Metadata */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl shadow-black/40">
                <h3 className="text-white font-bold text-lg mb-6 drop-shadow-sm">Asset Metadata</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Install Date</div>
                    <div className="text-slate-200 font-mono">2019-08-15</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Serial</div>
                    <div className="text-slate-200 font-mono">SN-4439</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Firmware</div>
                    <div className="text-slate-200 font-mono">v2.8</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Total Hours</div>
                    <div className="text-slate-200 font-mono">2,710</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Total Repairs</div>
                    <div className="text-slate-200 font-mono">10</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Lifetime Output</div>
                    <div className="text-slate-200 font-mono">297,677</div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                   <h4 className="text-slate-400 text-xs uppercase font-bold mb-4">Safety Compliance</h4>
                   <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-emerald-400 drop-shadow-md">99%</div>
                        <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase mt-1 border border-emerald-500/20 shadow-sm">Safe</div>
                      </div>
                      <ShieldCheck className="w-16 h-16 text-emerald-500/20 drop-shadow-lg" />
                   </div>
                   <p className="text-slate-500 text-xs mt-2">Based on operator incidents & audits</p>
                </div>
              </div>

              {/* Maintenance Logs */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl shadow-black/40">
                <div className="flex items-center space-x-2 mb-6">
                  <Clipboard className="w-5 h-5 text-blue-400 drop-shadow-md" />
                  <h3 className="text-white font-bold text-lg drop-shadow-sm">Maintenance Logs</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Technician</th>
                        <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {MAINT_LOGS.map((log, i) => (
                        <tr key={i} className="group hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 text-sm text-slate-300 font-mono">{log.date}</td>
                          <td className="py-4 text-sm text-white font-medium">{log.type}</td>
                          <td className="py-4 text-sm text-slate-400">{log.technician}</td>
                          <td className="py-4 text-sm text-slate-300 font-mono text-right">{log.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors drop-shadow-sm">View All Logs</button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- New Components for Fleet Management ---

const FleetCard = ({ machine, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={() => onClick(machine)}
      className="bg-[#1e293b] rounded-xl overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-all group flex flex-col h-full border border-slate-700/50 hover:border-emerald-500/50 group"
    >
      {/* Image / Header Area - ISOLATED FOR SCALING */}
      <div className="relative h-48 shrink-0 overflow-hidden">
        {/* The image scales on hover */}
        {!imgError && machine.image ? (
          <img 
            src={machine.image} 
            alt={machine.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${machine.imageGradient} transition-transform duration-500 group-hover:scale-110`}></div>
        )}
        
        {/* The text overlays are STATIC relative to the container, sitting ON TOP of the scaling image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent p-5 flex flex-col justify-between z-10 pointer-events-none">
          <div className="flex justify-end items-start space-x-2">
             {/* Status Pill */}
             {machine.status === 'down' ? (
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-red-500/90 backdrop-blur border border-white/10 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-[10px] font-bold text-white uppercase">DOWN</span>
                </div>
             ) : (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded bg-black/60 backdrop-blur border border-white/10 shadow-lg`}>
                  <div className={`w-2 h-2 rounded-full ${machine.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                  <span className="text-[10px] font-bold text-white uppercase">{machine.status === 'active' ? 'Running' : 'Idle'}</span>
                </div>
             )}
             
             {/* Expand Icon */}
             <div className="p-1.5 rounded bg-black/60 backdrop-blur border border-white/10 text-white transition-colors shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
             </div>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-2xl font-bold text-white drop-shadow-md tracking-tight">{machine.name}</h3>
              {machine.isCritical && (
                 <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg border border-purple-400/30">Critical</span>
              )}
            </div>
            <p className="text-slate-300 text-sm font-medium drop-shadow-sm">{machine.manufacturer} • {machine.dept}</p>
          </div>
        </div>
      </div>

      {/* Content Container (Metrics + Footer) - STATIC BACKGROUND */}
      <div className="flex-1 bg-[#111827] flex flex-col p-5 border-t border-slate-700/50 z-20 relative">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1f2937] border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-center shadow-inner shadow-black/20">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">RUL</div>
            <div className="text-white font-bold text-sm">{machine.rul}</div>
          </div>
          <div className="bg-[#1f2937] border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-center shadow-inner shadow-black/20">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Cost</div>
            <div className="text-white font-bold text-sm">{machine.cost}</div>
          </div>
          <div className="bg-[#1f2937] border border-slate-700 rounded-lg p-3 flex flex-col items-center justify-center shadow-inner shadow-black/20">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Safety</div>
            <div className={`font-bold text-sm ${parseInt(machine.safety) >= 90 ? 'text-emerald-400' : 'text-orange-400'}`}>
              {machine.safety}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-800 w-full mb-4"></div>

        {/* Footer / Operator */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600 shadow-sm">
               <img src={`https://ui-avatars.com/api/?name=${machine.operator.replace(' ', '+')}&background=random&color=fff`} alt={machine.operator} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-slate-400 font-medium">{machine.operator}</span>
          </div>
          <button className="flex items-center text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-200 uppercase tracking-wide">
            Full Report <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- New Components for Batches ---

const BatchCard = ({ batch }) => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl mb-6 last:mb-0">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <div className="flex items-center space-x-3 mb-1">
          <h3 className="text-2xl font-bold text-white">{batch.name}</h3>
          <span className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600 text-slate-300 text-xs font-mono font-bold">{batch.id}</span>
        </div>
        <div className="text-sm text-slate-400">
          <span className="text-slate-500">Planned:</span> <span className="font-bold text-white">{batch.planned}</span>
          <span className="mx-2 text-slate-600">|</span>
          <span className="text-slate-500">Actual:</span> <span className="font-bold text-emerald-400">{batch.actual}</span>
          <span className="mx-2 text-slate-600">|</span>
          <span className="text-slate-500">Deadline:</span> <span className="font-bold text-white">{batch.deadline}</span>
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-right">
        <div className="text-3xl font-bold text-white">{batch.completion.toFixed(1)}%</div>
        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Completion</div>
      </div>
    </div>

    {/* Main Progress Bar */}
    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-8">
      <div 
        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${batch.completion}%` }}
      ></div>
    </div>

    {/* Stages Breakdown */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {batch.stages.map((stage, idx) => (
        <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">{stage.name}</span>
            <span className="text-sm font-bold text-white">{stage.percent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`${stage.color} h-full rounded-full`} 
              style={{ width: `${stage.percent}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>

    {/* Footer Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-700/50">
      
      {/* Machines Active */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider">Machines Active</div>
        <div className="flex flex-wrap gap-2">
          {batch.activeMachines.map((machine, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-slate-700 border border-slate-600 text-slate-300 text-xs font-medium">
              {machine}
            </span>
          ))}
          {batch.activeMachinesCount > batch.activeMachines.length && (
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-500 text-xs font-medium">
              +{batch.activeMachinesCount - batch.activeMachines.length}
            </span>
          )}
        </div>
      </div>

      {/* Operators Involved */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider">Operators Involved</div>
        <div className="flex flex-wrap gap-2">
          {batch.operators.map((op, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-slate-700 border border-slate-600 text-slate-300 text-xs font-medium">
              {op}
            </span>
          ))}
          {batch.operatorsMore > 0 && (
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-500 text-xs font-medium">
              +{batch.operatorsMore}
            </span>
          )}
        </div>
      </div>

      {/* Quality Metrics */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider">Quality Metrics</div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-slate-400">First Pass Yield:</span>
          <span className="text-sm font-bold text-white">{batch.yield}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Total Defects:</span>
          <span className="text-sm font-bold text-red-400">{batch.defects}</span>
        </div>
      </div>

    </div>
  </div>
);

const ProductionBatches = () => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-300 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Production & Batches</h2>
           <p className="text-slate-400 text-sm">Real-time tracking of active production orders.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors">
            All Batches
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors">
            High Priority
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2">
        {BATCH_DATA.map(batch => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>
    </div>
  );
};

const FleetManagement = ({ onSelectMachine, handleKPIClick }) => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-300 p-6 lg:p-8">
      
      {/* Removed KPI cards as requested */}

      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Fleet Management</h2>
           <p className="text-slate-400 text-sm">Overview of all machinery assets and status.</p>
        </div>
        <div className="hidden md:flex items-center bg-slate-800/80 rounded-full px-4 py-1.5 border border-slate-700 shadow-inner shadow-black/30">
          <span className="relative flex h-2 w-2 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          </span>
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            PRODUCTION LIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
         {FLEET_DATA.map((machine) => (
           <FleetCard key={machine.id} machine={machine} onClick={onSelectMachine} />
         ))}
      </div>
    </div>
  );
};

const OperatorCard = ({ operator, onClick }) => (
  <div 
    onClick={() => onClick(operator)}
    className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg cursor-pointer hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
  >
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-emerald-500/50 transition-colors">
          <img src={operator.avatar} alt={operator.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{operator.name}</h3>
          <div className="flex flex-col mt-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit mb-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
              {operator.role}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {operator.id}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-3 pt-4 border-t border-slate-700/50">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Shift:</span>
        <span className="text-sm font-bold text-white">{operator.shift}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Experience:</span>
        <span className="text-sm font-bold text-white">{operator.experience}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Machines:</span>
        <span className="text-sm font-bold text-blue-400 hover:underline">{operator.machinesActive}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Safety Score:</span>
        <span className={`text-sm font-bold ${operator.safetyScoreColor}`}>{operator.safetyScore}</span>
      </div>
    </div>
  </div>
);

const OperatorDetail = ({ operator, onBack }) => {
  return (
    <div className="flex flex-col md:flex-row h-full bg-[#0f172a] animate-in slide-in-from-right duration-300">
      
      {/* LEFT COLUMN - Profile Info (Darker) */}
      <div className="w-full md:w-80 lg:w-96 bg-[#0B1120] p-8 flex flex-col border-r border-slate-800 relative">
        <button 
          onClick={onBack}
          className="self-start mb-8 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          {/* Avatar with Active Badge */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full p-1 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <img src={operator.avatar} alt={operator.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-2 bg-emerald-500 text-[#0B1120] text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-[#0B1120] tracking-wider shadow-md">
              ACTIVE
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1">{operator.name}</h2>
          <p className="text-blue-400 text-sm font-medium mb-8">{operator.role} • {operator.experience}</p>

          {/* Stats Card - Dark with thin border */}
          <div className="w-full bg-[#111827] rounded-xl border border-slate-700/50 p-5 grid grid-cols-2 gap-y-6 gap-x-4 text-left shadow-lg">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Employee ID</div>
              <div className="text-sm font-bold text-slate-200 font-mono">{operator.id}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Current Shift</div>
              <div className="text-sm font-bold text-white">{operator.shift}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Performance</div>
              <div className="text-sm font-bold text-emerald-400">{operator.performance} Avg</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Assigned Units</div>
              <div className="text-sm font-bold text-white">{operator.assignedUnits}</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Stats & Details */}
      <div className="flex-1 p-8 overflow-y-auto bg-[#0f172a]">
        
        {/* Header */}
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-white">Safety Scorecard</h3>
        </div>

        {/* Score Cards - Exactly like image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Overall Score */}
          <div className="bg-[#111827] rounded-xl p-6 border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             <div className="text-5xl font-bold text-white mb-2">{operator.safetyScore}</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall Safety Score</div>
          </div>
          
          {/* Reported Incidents */}
          <div className="bg-[#111827] rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center shadow-lg">
             <div className="text-5xl font-bold text-white mb-2">{operator.incidents}</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reported Incidents</div>
          </div>

          {/* Near Misses */}
          <div className="bg-[#111827] rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center shadow-lg">
             <div className="text-5xl font-bold text-white mb-2">{operator.nearMisses}</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Near Misses</div>
          </div>
        </div>

        {/* Compliance Breakdown */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-white mb-4 ml-1">Compliance Breakdown</h3>
          <div className="bg-[#111827] rounded-xl border border-slate-700 p-8 space-y-8 shadow-lg">
            
            {/* PPE */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-slate-400">PPE Compliance</span>
                <span className="text-xs font-bold text-white">{operator.ppeCompliance}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${operator.ppeCompliance}%` }}></div>
              </div>
            </div>

            {/* SOP */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-slate-400">SOP Adherence</span>
                <span className="text-xs font-bold text-white">{operator.sopAdherence}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${operator.sopAdherence}%` }}></div>
              </div>
            </div>

            {/* Violations - Keep it empty/grey if 0 */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-slate-400">Safety Violations</span>
                <span className="text-xs font-bold text-white">{operator.safetyViolations}</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Machines List (Requested) */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4 ml-1">Assigned Machines</h3>
          <div className="bg-[#111827] rounded-xl border border-slate-700 p-6 shadow-lg">
             <div className="flex flex-wrap gap-3">
               {operator.qualifiedMachines.map((machine, index) => (
                 <div key={index} className="flex items-center space-x-2 bg-slate-800 border border-slate-600 px-4 py-2.5 rounded-lg text-slate-300 hover:border-blue-500/50 transition-colors cursor-default">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold">{machine}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const OperatorManagement = ({ onSelectOperator }) => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-300 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Shift & Operator Management</h2>
           <p className="text-slate-400 text-sm">Manage active personnel, shifts, and safety compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {OPERATORS_DATA.map((operator) => (
          <OperatorCard key={operator.id} operator={operator} onClick={onSelectOperator} />
        ))}
      </div>
    </div>
  );
};

const AlertDetailModal = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0B1120]">
          <h2 className="text-xl font-bold text-white">Alert Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg border ${
              alert.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
              alert.priority === 'medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
              'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}>
              {alert.priority === 'high' ? <Siren className="w-8 h-8" /> :
               alert.priority === 'medium' ? <AlertTriangle className="w-8 h-8" /> :
               <Info className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{alert.machine}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  alert.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  alert.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {alert.priority}
                </span>
              </div>
              <div className="text-slate-400 text-xs font-mono">{alert.id} • {alert.time}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-300 mb-2">Issue</h4>
            <p className="text-white text-base leading-relaxed">{alert.message}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-300 mb-2">Technical Details</h4>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-slate-300 text-sm">
              {alert.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertCard = ({ alert, onClick }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-l-4 border-l-red-500',
          badge: 'bg-red-500/10 text-red-400 border-red-500/20',
          icon: <Siren className="w-5 h-5 text-red-500" />
        };
      case 'medium':
        return {
          border: 'border-l-4 border-l-orange-500',
          badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />
        };
      case 'low':
      default:
        return {
          border: 'border-l-4 border-l-blue-500',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: <Info className="w-5 h-5 text-blue-500" />
        };
    }
  };

  const styles = getPriorityStyles(alert.priority);

  return (
    <div 
      onClick={() => onClick(alert)}
      className={`bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700 shadow-md ${styles.border} flex items-center justify-between hover:bg-slate-750 transition-colors cursor-pointer group`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${styles.badge} border`}>
          {styles.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-bold text-sm">{alert.machine}</h4>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${styles.badge}`}>
              {alert.priority}
            </span>
            {alert.type === 'predictive' && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-purple-500/20 bg-purple-500/10 text-purple-400">
                Predictive
              </span>
            )}
          </div>
          <p className="text-slate-300 text-sm line-clamp-1 group-hover:text-white transition-colors">{alert.message}</p>
        </div>
      </div>
      
      <div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

const AlertCenter = () => {
  const [filter, setFilter] = useState('all'); // all, high, medium, predictive, safety
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = ALERT_DATA.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'high' || filter === 'medium') return alert.priority === filter;
    return alert.type === filter;
  });

  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-300 p-6 lg:p-8">
      {selectedAlert && (
        <AlertDetailModal 
          alert={selectedAlert} 
          onClose={() => setSelectedAlert(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Alert Center</h2>
           <p className="text-slate-400 text-sm">Real-time safety warnings and predictive maintenance insights.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
            <Siren className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-xl font-bold text-white">2</div>
              <div className="text-[10px] uppercase font-bold text-red-400">Critical Safety</div>
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-xl font-bold text-white">3</div>
              <div className="text-[10px] uppercase font-bold text-purple-400">Predictive Maint</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-4 border-b border-slate-800">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'high', label: 'Critical Only' },
          { id: 'safety', label: 'Safety' },
          { id: 'predictive', label: 'Maintenance' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
              ${filter === f.id 
                ? 'bg-slate-700 text-white border border-slate-600' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onClick={setSelectedAlert}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <CheckCircle className="w-12 h-12 mb-4 opacity-20" />
            <p>No alerts found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Chart Components
const CostTrendChart = () => {
  const data = [
    { label: 'Jun', value: 120 },
    { label: 'Jul', value: 118 },
    { label: 'Aug', value: 122 },
    { label: 'Sep', value: 121 },
    { label: 'Oct', value: 123 },
    { label: 'Nov', value: 124.5 }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center">
        <LineChart className="w-4 h-4 mr-2 text-blue-400" /> Cost Per Unit Trend (Last 6 Months)
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} 
              itemStyle={{ color: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            >
              <LabelList dataKey="value" position="top" fill="#fff" fontSize={10} formatter={(val) => `$${val}`} />
            </Line>
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CostWaterfallChart = () => {
  // Logic: Revenue (Positive) -> Expenses (Negative) -> Total (Result)
  const data = [
    { name: 'Revenue', value: 100, spacer: 0, fill: '#10b981', label: '$100k' },
    { name: 'Material', value: 25, spacer: 75, fill: '#f87171', label: '-$25k' },
    { name: 'Comps', value: 15, spacer: 60, fill: '#f87171', label: '-$15k' },
    { name: 'Maint', value: 10, spacer: 50, fill: '#f87171', label: '-$10k' },
    { name: 'Total', value: 50, spacer: 0, fill: '#64748b', label: '$50k' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center">
        <BarChart3 className="w-4 h-4 mr-2 text-purple-400" /> Manufacturing Cost Breakdown
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} />
            <Bar dataKey="spacer" stackId="a" fill="transparent" />
            <Bar dataKey="value" stackId="a" radius={[2, 2, 2, 2]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList dataKey="label" position="top" fill="#fff" fontSize={10} />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CostByDeptChart = () => {
  const data = [
    { name: "Assembly", value: 40, fill: "url(#colorBlue)" },
    { name: "Machining", value: 25, fill: "url(#colorBlue)" },
    { name: "Casting", value: 20, fill: "url(#colorBlue)" },
    { name: "Finishing", value: 10, fill: "url(#colorBlue)" },
    { name: "Packaging", value: 5, fill: "url(#colorBlue)" },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center">
        <PieChart className="w-4 h-4 mr-2 text-emerald-400" /> Cost by Department (%)
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            barSize={20}
          >
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={70} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList dataKey="value" position="right" fill="#fff" fontSize={10} formatter={(val) => `${val}%`} />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CostAnalysis = () => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-300 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Cost Analysis</h2>
           <p className="text-slate-400 text-sm">Financial overview of operations and maintenance costs.</p>
        </div>
      </div>

      {/* Cost KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {COST_KPI_DATA.map((data, index) => (
          <CostKPICard key={index} data={data} />
        ))}
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        
        {/* Row 1: Trend & Waterfall (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <div className="flex-1 flex gap-6 h-full">
             {/* Trend Chart */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex-1">
              <CostTrendChart />
            </div>
            {/* Waterfall Chart */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex-1">
               <CostWaterfallChart />
            </div>
          </div>
        </div>

        {/* Column 2: Department Breakdown (1/3 width) */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex-1 flex flex-col h-full">
          <CostByDeptChart />
        </div>
        
      </div>
    </div>
  );
};

const YieldTrendChart = () => {
  // 30-Day Yield Trend - Recharts
  const data = [
    { day: '1', value: 92 }, { day: '5', value: 93 }, { day: '10', value: 91 },
    { day: '15', value: 94 }, { day: '20', value: 95 }, { day: '25', value: 94 },
    { day: '30', value: 96 }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center">
        <LineChart className="w-4 h-4 mr-2 text-emerald-400" /> 30-Day Yield Trend
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} 
              itemStyle={{ color: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={{ r: 3, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TopDefectsChart = () => {
  // Defects by Machine/Operator
  const data = [
    { name: "Cast #9 (E.R.)", value: 12 },
    { name: "Mach #19 (E.R.)", value: 8 },
    { name: "Pack #2 (M.R.)", value: 5 },
    { name: "Assem #5 (J.W.)", value: 3 },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2 text-red-400" /> Top Defects by Machine & Op
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            barSize={15}
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={80} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#ef4444">
              <LabelList dataKey="value" position="right" fill="#fff" fontSize={10} />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const YieldByDeptChart = () => {
  const data = [
    { name: "Assembly", value: 98 },
    { name: "Machining", value: 92 },
    { name: "Casting", value: 88 },
    { name: "Finishing", value: 95 },
    { name: "Packaging", value: 99 },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center">
        <PieChart className="w-4 h-4 mr-2 text-purple-400" /> Yield by Department
      </h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#8b5cf6">
              <LabelList dataKey="value" position="top" fill="#fff" fontSize={10} formatter={(val) => `${val}%`} />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const QualityYield = () => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-300 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Quality & Yield</h2>
           <p className="text-slate-400 text-sm">Real-time quality control metrics and defect analysis.</p>
        </div>
      </div>

      {/* Quality KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {QUALITY_KPI_DATA.map((data, index) => (
          <QualityKPICard key={index} data={data} />
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-[350px]">
        
        {/* 30-Day Yield Trend */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex-1">
           <YieldTrendChart />
        </div>

        {/* Top Defects */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex-1">
           <TopDefectsChart />
        </div>

        {/* Yield by Department */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex-1">
           <YieldByDeptChart />
        </div>
      </div>

      {/* Recent Quality Incidents Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
           <h3 className="text-sm font-bold text-white flex items-center">
             <Clipboard className="w-4 h-4 mr-2 text-blue-400" /> Recent Quality Incidents
           </h3>
           <button className="text-xs text-blue-400 hover:text-white transition-colors">View All</button>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 font-bold sticky top-0">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Machine</th>
                <th className="p-4">Defect Type</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm text-slate-300">
              {QUALITY_INCIDENTS.map((incident, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-mono text-slate-400">{incident.id}</td>
                  <td className="p-4 font-bold text-white">{incident.machine}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                      {incident.defect}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">{incident.time}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      incident.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 
                      incident.status === 'Investigating' ? 'bg-orange-500/10 text-orange-400' : 
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Live Floor');
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [showDownMachines, setShowDownMachines] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const handleBackToDept = () => {
    setSelectedMachine(null);
  };

  const handleBackToHome = () => {
    setSelectedDept(null);
    setSelectedMachine(null);
    setSelectedOperator(null);
  };

  const handleKPIClick = (id) => {
    if (id === 'down') {
      setShowDownMachines(true);
    }
  };

  const handleNotificationClick = () => {
    setActiveTab('Alerts');
    handleBackToHome();
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      
      {/* Down Machines Modal */}
      {showDownMachines && <DownMachinesModal onClose={() => setShowDownMachines(false)} />}

      {/* Sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0B1120] border-r border-slate-800 flex flex-col transition-transform duration-300 shadow-2xl shadow-black/50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shadow-sm">
          <Factory className="w-6 h-6 text-emerald-500 mr-2 drop-shadow-md" />
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">PRO<span className="text-emerald-500">MFG</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          <div>
            <div className="px-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Operations</div>
            <div className="space-y-1">
              <SidebarItem 
                icon={<LayoutDashboard className="w-5 h-5" />} 
                label="Live Floor" 
                active={activeTab === 'Live Floor'} 
                onClick={() => { setActiveTab('Live Floor'); handleBackToHome(); }}
              />
              <SidebarItem 
                icon={<Box className="w-5 h-5" />} 
                label="Production & Batches" 
                active={activeTab === 'Production'} 
                onClick={() => { setActiveTab('Production'); handleBackToHome(); }}
              />
              <SidebarItem 
                icon={<Truck className="w-5 h-5" />} 
                label="Fleet Management" 
                active={activeTab === 'Fleet'} 
                onClick={() => { setActiveTab('Fleet'); handleBackToHome(); }}
              />
              <SidebarItem 
                icon={<Users className="w-5 h-5" />} 
                label="Operators" 
                active={activeTab === 'Operators'} 
                onClick={() => { setActiveTab('Operators'); handleBackToHome(); }}
              />
            </div>
          </div>

          <div>
            <div className="px-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Intelligence</div>
            <div className="space-y-1">
              <SidebarItem 
                icon={<Bell className="w-5 h-5" />} 
                label="Alert Center" 
                active={activeTab === 'Alerts'} 
                onClick={() => { setActiveTab('Alerts'); handleBackToHome(); }}
              />
              <SidebarItem 
                icon={<DollarSign className="w-5 h-5" />} 
                label="Cost Analysis" 
                active={activeTab === 'Cost'} 
                onClick={() => { setActiveTab('Cost'); handleBackToHome(); }}
              />
              <SidebarItem 
                icon={<LineChart className="w-5 h-5" />} 
                label="Quality & Yield" 
                active={activeTab === 'Quality'} 
                onClick={() => { setActiveTab('Quality'); handleBackToHome(); }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 shadow-inner shadow-black/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-900/50">
              JD
            </div>
            <div>
              <div className="text-sm font-medium text-white">John Doe</div>
              <div className="text-xs text-slate-400">Plant Manager</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0f172a]">
        
        {/* Header Logic - Hide if not in specific views */}
        {!selectedDept && !selectedMachine && !selectedOperator && activeTab !== 'Fleet' && activeTab !== 'Production' && activeTab !== 'Operators' && activeTab !== 'Alerts' && activeTab !== 'Cost' && activeTab !== 'Quality' && (
          <header className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-6 lg:px-8 shadow-md shadow-black/20 z-10">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="mr-4 lg:hidden text-slate-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-slate-100 mr-6 drop-shadow-sm">Live Production Floor</h1>
              
              <div className="hidden md:flex items-center bg-slate-800/80 rounded-full px-4 py-1.5 border border-slate-700 shadow-inner shadow-black/30">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="text-xs font-semibold text-slate-300 tracking-wide">
                  PRODUCTION LIVE • <span className="text-emerald-400 drop-shadow-sm">{formatTime(currentTime)} UTC</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleNotificationClick}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5 drop-shadow-md" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a] shadow-sm"></span>
              </button>
            </div>
          </header>
        )}

        {/* Content Navigation Logic */}
        {selectedMachine ? (
          <MachineDetail 
            machine={selectedMachine} 
            onBack={handleBackToDept}
          />
        ) : selectedDept ? (
          <DepartmentDetail 
            department={selectedDept} 
            onBack={handleBackToHome}
            onSelectMachine={setSelectedMachine}
          />
        ) : selectedOperator ? (
          <OperatorDetail 
            operator={selectedOperator} 
            onBack={handleBackToHome} 
          />
        ) : activeTab === 'Fleet' ? (
          <FleetManagement onSelectMachine={setSelectedMachine} handleKPIClick={handleKPIClick} />
        ) : activeTab === 'Production' ? (
          <ProductionBatches />
        ) : activeTab === 'Operators' ? (
          <OperatorManagement onSelectOperator={setSelectedOperator} />
        ) : activeTab === 'Alerts' ? (
          <AlertCenter />
        ) : activeTab === 'Cost' ? (
          <CostAnalysis />
        ) : activeTab === 'Quality' ? (
          <QualityYield />
        ) : (
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {KPI_DATA.map((item, idx) => (
                <KPICard 
                  key={idx} 
                  data={item} 
                  onClick={() => handleKPIClick(item.id)} 
                />
              ))}
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100%-11rem)]">
              {/* Dept Overview */}
              <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-2xl shadow-black/50 flex flex-col border border-slate-700/50">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <Factory className="w-5 h-5 text-emerald-500 drop-shadow-md" />
                    <h2 className="text-lg font-bold text-white drop-shadow-sm">Department Overview</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  {DEPARTMENTS.map(dept => (
                    <DepartmentCard 
                      key={dept.id} 
                      dept={dept} 
                      onDrillDown={setSelectedDept}
                    />
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl shadow-black/50 flex flex-col border border-slate-700/50">
                <h2 className="text-lg font-bold text-white mb-6 drop-shadow-sm">Batch Activity Feed</h2>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {ACTIVITY_FEED.map((activity) => (
                    <div key={activity.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 flex items-start justify-between group hover:border-slate-600 transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-black/20">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(0,0,0,0.5)] ${
                          activity.type === 'alert' ? 'bg-blue-500 shadow-blue-500/50' : 
                          activity.type === 'warning' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-emerald-500 shadow-emerald-500/50'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{activity.message}</p>
                          <p className="text-xs text-slate-500 mt-1">Production Floor 1</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        /* Global Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a; /* Match main bg */ 
        }
        ::-webkit-scrollbar-thumb {
          background: #334155; /* Slate-700 */
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #475569; /* Slate-600 */
        }
      `}</style>
    </div>
  );
}