import {
  Box,
  Code,
  Database,
  Eye,
  GitBranch,
  Layers,
  LayoutTemplate,
  Monitor,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

interface Satellite {
  label: string
  icon: LucideIcon
  angle: number
}

interface Stage {
  id: string
  title: string
  subtitle?: string
  icon: LucideIcon
  satellites: Satellite[]
}

const stages: Stage[] = [
  {
    id: "basic",
    title: "基础学习",
    subtitle: "入门",
    icon: Eye,
    satellites: [
      { label: "HTML5/CSS3", icon: LayoutTemplate, angle: -60 },
      { label: "JavaScript", icon: Code, angle: -30 },
      { label: "TypeScript", icon: Terminal, angle: 30 },
      { label: "浏览器原理", icon: Monitor, angle: 60 },
      { label: "响应式布局", icon: Smartphone, angle: 90 },
    ],
  },
  {
    id: "admin",
    title: "电商后台管理",
    icon: Database,
    satellites: [
      { label: "React/Vue", icon: Layers, angle: -70 },
      { label: "状态管理", icon: Box, angle: -40 },
      { label: "路由权限", icon: Wrench, angle: 40 },
      { label: "表单表格", icon: LayoutTemplate, angle: 70 },
      { label: "接口联调", icon: Server, angle: 95 },
    ],
  },
  {
    id: "h5",
    title: "移动端H5活动页",
    icon: Smartphone,
    satellites: [
      { label: "移动端适配", icon: Smartphone, angle: -70 },
      { label: "动画交互", icon: Sparkles, angle: -35 },
      { label: "微信H5", icon: Monitor, angle: 35 },
      { label: "性能优化", icon: Wrench, angle: 70 },
      { label: "埋点统计", icon: Eye, angle: 100 },
    ],
  },
  {
    id: "visualization",
    title: "数据可视化大屏",
    icon: Monitor,
    satellites: [
      { label: "ECharts", icon: Layers, angle: -65 },
      { label: "Canvas/SVG", icon: LayoutTemplate, angle: -30 },
      { label: "大屏适配", icon: Monitor, angle: 30 },
      { label: "实时数据", icon: Server, angle: 65 },
      { label: "交互设计", icon: Sparkles, angle: 95 },
    ],
  },
  {
    id: "engineering",
    title: "前端量化工程",
    icon: Wrench,
    satellites: [
      { label: "Webpack/Vite", icon: Wrench, angle: -65 },
      { label: "CI/CD", icon: Server, angle: -30 },
      { label: "自动化测试", icon: Terminal, angle: 30 },
      { label: "代码规范", icon: Code, angle: 65 },
      { label: "性能监控", icon: Eye, angle: 95 },
    ],
  },
  {
    id: "collaboration",
    title: "团队协作开发",
    icon: Users,
    satellites: [
      { label: "Git 工作流", icon: GitBranch, angle: -65 },
      { label: "Code Review", icon: Eye, angle: -30 },
      { label: "敏捷开发", icon: Layers, angle: 30 },
      { label: "文档规范", icon: LayoutTemplate, angle: 65 },
      { label: "沟通协作", icon: Users, angle: 95 },
    ],
  },
  {
    id: "fullstack",
    title: "全栈实战",
    icon: Server,
    satellites: [
      { label: "Node.js", icon: Server, angle: -65 },
      { label: "数据库", icon: Database, angle: -30 },
      { label: "RESTful API", icon: Code, angle: 30 },
      { label: "Docker", icon: Box, angle: 65 },
      { label: "项目部署", icon: Monitor, angle: 95 },
    ],
  },
]

function SatelliteNode({ satellite }: { satellite: Satellite }) {
  const Icon = satellite.icon
  const radius = 116
  const rad = (satellite.angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative">
        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500">
          <Icon className="w-4 h-4" />
        </div>
        <div
          className="absolute top-1/2 left-1/2 w-[76px] h-px bg-gray-200 -z-10"
          style={{
            transform: `rotate(${satellite.angle}deg)`,
            transformOrigin: "0 50%",
          }}
        />
      </div>
      <span className="mt-1.5 text-[10px] text-gray-500 whitespace-nowrap bg-white/80 px-1.5 py-0.5 rounded">
        {satellite.label}
      </span>
    </div>
  )
}

function StageNode({ stage, variant = "top" }: { stage: Stage; variant?: "top" | "bottom" }) {
  const Icon = stage.icon
  const isTop = variant === "top"

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-52 h-52">
        {stage.satellites.map((satellite, index) => (
          <SatelliteNode key={index} satellite={satellite} />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#4a4a4a] shadow-lg flex items-center justify-center text-white z-10">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <div
        className={`absolute ${isTop ? "bottom-2" : "top-2"} left-1/2 -translate-x-1/2 whitespace-nowrap`}
      >
        <div className="bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
          <span className="text-sm font-medium text-gray-700">{stage.title}</span>
          {stage.subtitle && (
            <span className="ml-1 text-xs text-gray-400">({stage.subtitle})</span>
          )}
        </div>
      </div>
    </div>
  )
}

function ConnectionLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 L0,0" fill="#d1d5db" />
        </marker>
      </defs>
      <line x1="12%" y1="35%" x2="28%" y2="35%" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="28%" y1="35%" x2="44%" y2="35%" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="44%" y1="35%" x2="60%" y2="35%" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="60%" y1="35%" x2="60%" y2="65%" stroke="#d1d5db" strokeWidth="1.5" />
      <line x1="60%" y1="65%" x2="44%" y2="65%" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="44%" y1="65%" x2="28%" y2="65%" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="28%" y1="65%" x2="12%" y2="65%" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#arrow)" />
    </svg>
  )
}

export default function LearningRoutePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fb] to-[#eef0f4] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">前端开发学习路线</h1>
          <p className="mt-2 text-sm text-gray-500">
            从基础入门到全栈实战，系统化构建前端工程师核心能力
          </p>
        </div>

        <div className="relative hidden lg:block">
          <ConnectionLines />
          <div className="flex justify-between items-start mb-8">
            {stages.slice(0, 4).map((stage) => (
              <StageNode key={stage.id} stage={stage} variant="top" />
            ))}
          </div>
          <div className="flex justify-between items-end mt-20">
            {stages.slice(4).map((stage) => (
              <StageNode key={stage.id} stage={stage} variant="bottom" />
            ))}
          </div>
        </div>

        <div className="lg:hidden space-y-12">
          {stages.map((stage) => (
            <StageNode key={stage.id} stage={stage} variant="top" />
          ))}
        </div>
      </div>
    </div>
  )
}
