// Types
export interface Profession {
  id: string
  name: string
  positions: Position[]
}

export interface Position {
  id: string
  name: string
  professionId: string
}

export interface Batch {
  id: string
  name: string
  code: string
  departmentId: string
  departmentName: string
  professionId?: string
  professionName?: string
  workflowId: string
  workflowName: string
  status: "open" | "closed"
  scenarioCount: number
  createdAt: string
}

export interface ApprovalWorkflow {
  id: string
  name: string
  description: string
  steps: ApprovalStep[]
  createdAt: string
}

export interface ApprovalStep {
  id: string
  order: number
  name: string
  approverRole: string
}

export interface ApprovalItem {
  id: string
  scenarioId: string
  scenarioName: string
  scenarioCode: string
  version: string
  positionName?: string
  batchId: string
  batchName: string
  submitterId: string
  submitterName: string
  currentStep: number
  totalSteps: number
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  comments?: string
  rejectReason?: string
}

export interface TodoItem {
  id: string
  type: "rejected_draft" | "pending_approval"
  title: string
  description: string
  scenarioId?: string
  batchId?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  role: "admin" | "builder" | "reviewer"
  department: string
}

export interface Scenario {
  id: string
  name: string
  code: string
  coverImage: string
  positionId?: string
  positionName?: string
  professionId?: string
  professionName?: string
  industryId?: string
  industryName?: string
  batchId?: string
  batchName?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  version: string
  status: "draft" | "pending" | "approved" | "rejected" | "published"
  background: string
  deliveryGoal: string
  creatorId: string
  creatorName: string
  coBuilders: { id: string; name: string }[]
  tasks: Task[]
  weightConfig: WeightConfig
  gradeMapping: GradeMapping[]
  createdAt: string
  updatedAt: string
  publishTime?: string
}

export interface Task {
  id: string
  name: string
  code: string
  order: number
  description: string
  detailedDescription?: string
  estimatedHours: number
  taskType: "assessment" | "training"
  difficulty: 1 | 2 | 3 | 4 | 5
  background: string
  dependencies: string[]
  resources: string[]
  deliverables: TaskDeliverable[]
  knowledgePoints: string[]
  abilityPoints: string[]
  assessment: Assessment | null
  isReferenced?: boolean
  sourceScenarioId?: string
  sourceScenarioName?: string
}

export interface TaskDeliverable {
  id: string
  type: "exercise" | "onsite_evaluation" | "result_file"
  name: string
  description: string
  evaluationPoints?: EvaluationPoint[]
}

export interface EvaluationPoint {
  id: string
  name: string
  description: string
  maxLevel: 5
}

export interface Resource {
  id: string
  name: string
  type: "document" | "video" | "link" | "file"
  url: string
  size?: string
}

export interface DeliverableType {
  id: string
  name: string
  type: "report" | "code" | "video" | "presentation" | "document" | "other"
  required: boolean
  description: string
}

export interface Assessment {
  type: "objective" | "subjective" | "mixed"
  objectiveConfig?: ObjectiveConfig
  subjectiveConfig?: SubjectiveConfig
  mixedWeights?: { objective: number; subjective: number }
}

export interface ObjectiveConfig {
  totalScore: number
  questions: QuestionItem[]
  randomDraw?: {
    enabled: boolean
    count: number
    fromPool: string
  }
}

export interface QuestionItem {
  id: string
  type: "single" | "multiple" | "judgment"
  content: string
  options?: string[]
  answer: string | string[]
  score: number
}

export interface SubjectiveConfig {
  totalScore: number
  rubricPoints: RubricPoint[]
  synthesisRule: "sum" | "weighted"
}

export interface RubricPoint {
  id: string
  name: string
  weight: number
  maxScore: number
  levels: RubricLevel[]
}

export interface RubricLevel {
  id: string
  name: string
  minScore: number
  maxScore: number
  description: string
  color: string
}

export interface WeightConfig {
  tasks: { taskId: string; weight: number }[]
}

export interface GradeMapping {
  id: string
  grade: string
  minScore: number
  maxScore: number
  color: string
  remark?: string
}

export interface GranularLesson {
  id: string
  name: string
  description: string
  code: string
}

export interface KnowledgePoint {
  id: string
  name: string
  description: string
  category?: string
  relatedResources?: string[]
  code?: string
  granularLessons?: string[]
}

export interface AbilityPoint {
  id: string
  name: string
  description: string
  category?: string
  domain?: string
  proficiencyDesc?: string
  code?: string
  positionIds?: string[]
  requiredLevel?: "了解" | "理解" | "掌握" | "熟练" | "精通"
}

export interface LearningResource {
  id: string
  name: string
  type: "document" | "spreadsheet" | "image" | "link" | "audio" | "video" | "archive" | "tool" | "venue" | "facility" | "software" | "other"
  url: string
  size?: string
  description?: string
  knowledgePoints: string[]
  uploadedAt: string
  uploadedBy: string
  thumbnail?: string
}

// Position Ability Types
export interface PositionAbility {
  id: string
  positionId: string
  name: string
  description: string
  weight: number // Percentage weight within the position (0-100)
  category: string
}

export interface TaskAbilityMapping {
  taskId: string
  abilityId: string
  contributionWeight: number // How much this task contributes to the ability (0-100)
}

export interface Student {
  id: string
  name: string
  studentNumber: string
  class: string
  department: string
  enrollmentYear: number
  avatar?: string
}

export interface StudentScenarioScore {
  id: string
  studentId: string
  scenarioId: string
  scenarioName: string
  positionId: string
  positionName: string
  totalScore: number
  taskScores: {
    taskId: string
    taskName: string
    score: number
    maxScore: number
  }[]
  completedAt: string
}

export interface StudentAbilityScore {
  studentId: string
  abilityId: string
  abilityName: string
  positionId: string
  score: number // 0-100
  level: "expert" | "proficient" | "familiar" | "beginner" // 精通/熟练/了解/待提升
  scenarioContributions: {
    scenarioId: string
    scenarioName: string
    contribution: number
  }[]
  updatedAt: string
}

// Mock Data
export const professions: Profession[] = [
  {
    id: "prof-1",
    name: "信息技术",
    positions: [
      { id: "pos-1", name: "前端开发工程师", professionId: "prof-1" },
      { id: "pos-2", name: "后端开发工程师", professionId: "prof-1" },
      { id: "pos-3", name: "全栈开发工程师", professionId: "prof-1" },
      { id: "pos-4", name: "数据分析师", professionId: "prof-1" },
    ],
  },
  {
    id: "prof-2",
    name: "电子商务",
    positions: [
      { id: "pos-5", name: "电商运营专员", professionId: "prof-2" },
      { id: "pos-6", name: "网络营销师", professionId: "prof-2" },
      { id: "pos-7", name: "客户服务主管", professionId: "prof-2" },
    ],
  },
  {
    id: "prof-3",
    name: "财务管理",
    positions: [
      { id: "pos-8", name: "会计师", professionId: "prof-3" },
      { id: "pos-9", name: "财务分析师", professionId: "prof-3" },
      { id: "pos-10", name: "审计专员", professionId: "prof-3" },
    ],
  },
  {
    id: "prof-4",
    name: "市场营销",
    positions: [
      { id: "pos-11", name: "市场专员", professionId: "prof-4" },
      { id: "pos-12", name: "品牌经理", professionId: "prof-4" },
    ],
  },
]

const defaultRubricLevels: RubricLevel[] = [
  { id: "level-1", name: "优秀", minScore: 90, maxScore: 100, description: "表现卓越，超出预期", color: "bg-green-500" },
  { id: "level-2", name: "良好", minScore: 75, maxScore: 89, description: "表现良好，达到预期", color: "bg-blue-500" },
  { id: "level-3", name: "及格", minScore: 60, maxScore: 74, description: "基本合格，有待提升", color: "bg-yellow-500" },
  { id: "level-4", name: "不合格", minScore: 0, maxScore: 59, description: "未达标准，需要改进", color: "bg-red-500" },
]

const defaultGradeMapping: GradeMapping[] = [
  { id: "grade-1", grade: "A", minScore: 90, maxScore: 100, color: "bg-green-500", remark: "表现卓越，完全超出预期要求，可作为标杆示范" },
  { id: "grade-2", grade: "B", minScore: 75, maxScore: 89, color: "bg-blue-500", remark: "表现良好，达到预期要求，仅有少量可改进之处" },
  { id: "grade-3", grade: "C", minScore: 60, maxScore: 74, color: "bg-yellow-500", remark: "基本达标，核心要求已满足，但存在明显不足" },
  { id: "grade-4", grade: "D", minScore: 0, maxScore: 59, color: "bg-red-500", remark: "未达标准，核心要求未完成，需要重新学习或训练" },
]

// Industries
export const industries = [
  { id: "ind-1", name: "互联网/IT" },
  { id: "ind-2", name: "电子商务" },
  { id: "ind-3", name: "金融" },
  { id: "ind-4", name: "制造业" },
  { id: "ind-5", name: "服务业" },
]

// Approval Workflows
export const approvalWorkflows: ApprovalWorkflow[] = [
  {
    id: "wf-1",
    name: "单级教研组长审批",
    description: "仅需教研组长审批即可通过",
    steps: [
      { id: "step-1", order: 1, name: "教研组长审批", approverRole: "教研组长" },
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "wf-2",
    name: "多级校企联合审批",
    description: "需经教研组长、系主任、企业导师三级审批",
    steps: [
      { id: "step-1", order: 1, name: "教研组长审批", approverRole: "教研组长" },
      { id: "step-2", order: 2, name: "系主任审批", approverRole: "系主任" },
      { id: "step-3", order: 3, name: "企业导师审批", approverRole: "企业导师" },
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "wf-3",
    name: "两级部门审批",
    description: "教研组长和系主任两级审批",
    steps: [
      { id: "step-1", order: 1, name: "教研组长审批", approverRole: "教研组长" },
      { id: "step-2", order: 2, name: "系主任审批", approverRole: "系主任" },
    ],
    createdAt: "2024-01-05",
  },
]

// Batches
export const batches: Batch[] = [
  {
    id: "batch-1",
    name: "2026春季电商实训场景开发",
    code: "BG-2026-0001",
    departmentId: "dept-1",
    departmentName: "信息工程系",
    professionId: "prof-2",
    professionName: "电子商务",
    workflowId: "wf-2",
    workflowName: "多级校企联合审批",
    status: "open",
    scenarioCount: 12,
    createdAt: "2026-01-15",
  },
  {
    id: "batch-2",
    name: "2026春季前端开发场景建设",
    code: "BG-2026-0002",
    departmentId: "dept-1",
    departmentName: "信息工程系",
    professionId: "prof-1",
    professionName: "信息技术",
    workflowId: "wf-1",
    workflowName: "单级教研组长审批",
    status: "open",
    scenarioCount: 8,
    createdAt: "2026-01-10",
  },
  {
    id: "batch-3",
    name: "2025秋季财务管理场景",
    code: "BG-2025-0003",
    departmentId: "dept-2",
    departmentName: "经济管理系",
    professionId: "prof-3",
    professionName: "财务管理",
    workflowId: "wf-3",
    workflowName: "两级部门审批",
    status: "closed",
    scenarioCount: 6,
    createdAt: "2025-09-01",
  },
]

// Approval Items
export const approvalItems: ApprovalItem[] = [
  {
    id: "approval-1",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    scenarioCode: "SC-2026-0001",
    version: "v2.1",
    positionName: "前端开发工程师",
    batchId: "batch-2",
    batchName: "2026春季前端开发场景建设",
    submitterId: "user-1",
    submitterName: "张老师",
    currentStep: 1,
    totalSteps: 1,
    status: "pending",
    submittedAt: "2026-04-18",
  },
  {
    id: "approval-2",
    scenarioId: "scenario-4",
    scenarioName: "电商平台运营全流程",
    scenarioCode: "SC-2026-0004",
    version: "v3.0",
    positionName: "电商运营专员",
    batchId: "batch-1",
    batchName: "2026春季电商实训场景开发",
    submitterId: "user-2",
    submitterName: "李老师",
    currentStep: 2,
    totalSteps: 3,
    status: "pending",
    submittedAt: "2026-04-15",
  },
  {
    id: "approval-3",
    scenarioId: "scenario-3",
    scenarioName: "数据可视化分析实战",
    scenarioCode: "SC-2026-0003",
    version: "v1.2",
    positionName: "数据分析师",
    batchId: "batch-2",
    batchName: "2026春季前端开发场景建设",
    submitterId: "user-2",
    submitterName: "李老师",
    currentStep: 1,
    totalSteps: 1,
    status: "rejected",
    submittedAt: "2026-04-10",
    comments: "请补充数据清洗相关的任务节点",
    rejectReason: "场景任务链不完整，缺少数据清洗环节，请补充后再提交。",
  },
  {
    id: "approval-4",
    scenarioId: "scenario-5",
    scenarioName: "企业财务报表分析",
    scenarioCode: "SC-2025-0005",
    version: "v2.0",
    positionName: "会计师",
    batchId: "batch-3",
    batchName: "2025秋季财务管理场景",
    submitterId: "user-3",
    submitterName: "王老师",
    currentStep: 2,
    totalSteps: 2,
    status: "approved",
    submittedAt: "2026-03-20",
    comments: "内容完整，审核通过。",
  },
]

// Todo Items
export const todoItems: TodoItem[] = [
  {
    id: "todo-1",
    type: "rejected_draft",
    title: "数据可视化分析实战 - 需修改",
    description: "审批意见：请补充数据清洗相关的任务节点",
    scenarioId: "scenario-3",
    createdAt: "2026-04-17",
  },
  {
    id: "todo-2",
    type: "pending_approval",
    title: "待审批：企业级前端项目开发实战",
    description: "来自2026春季前端开发场景建设批次",
    scenarioId: "scenario-1",
    batchId: "batch-2",
    createdAt: "2026-04-18",
  },
]

// Users for co-builder selection
export const users: User[] = [
  { id: "user-1", name: "张老师", role: "builder", department: "信息工程系" },
  { id: "user-2", name: "李老师", role: "builder", department: "信息工程系" },
  { id: "user-3", name: "王老师", role: "reviewer", department: "经济管理系" },
  { id: "user-4", name: "赵老师", role: "builder", department: "经济管理系" },
  { id: "user-5", name: "刘老师", role: "admin", department: "教务处" },
]

// Dashboard stats
export const dashboardStats = {
  totalScenarios: 156,
  publishedScenarios: 98,
  draftScenarios: 42,
  pendingScenarios: 16,
  departmentDistribution: [
    { name: "信息工程系", count: 68, percentage: 43.6 },
    { name: "经济管理系", count: 45, percentage: 28.8 },
    { name: "艺术设计系", count: 28, percentage: 17.9 },
    { name: "其他", count: 15, percentage: 9.6 },
  ],
  professionDistribution: [
    { name: "信息技术", count: 42 },
    { name: "电子商务", count: 35 },
    { name: "财务管理", count: 28 },
    { name: "市场营销", count: 22 },
    { name: "其他", count: 29 },
  ],
  resourceCoverage: 78.5,
  abilityMappingCompleteness: 65.2,
}

export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    name: "企业级前端项目开发实战",
    code: "SC-2026-0001",
    coverImage: "/placeholder.svg?height=200&width=320",
    positionId: "pos-1",
    positionName: "前端开发工程师",
    professionId: "prof-1",
    professionName: "信息技术",
    industryId: "ind-1",
    industryName: "互联网/IT",
    batchId: "batch-2",
    batchName: "2026春季前端开发场景建设",
    difficulty: 5,
    version: "v2.1",
    status: "published",
    publishTime: "2024-03-15 10:30:00",
    creatorId: "user-1",
    creatorName: "张老师",
    coBuilders: [{ id: "user-2", name: "李老师" }],
    background: "在现代企业级应用开发中，前端工程师需要具备完整的项目开发能力，包括技术选型、架构设计、组件开发、性能优化等多个方面。本场景模拟真实企业项目环境，让学员体验完整的前端开发流程。",
    deliveryGoal: "完成一个功能完整的企业级管理后台前端项目，包含用户认证、数据展示、表单处理、权限控制等核心功能模块。",
    tasks: [
      {
        id: "task-1-1",
        name: "项目初始化与架构搭建",
        code: "T-001-001",
        order: 1,
        description: "使用 React + TypeScript 技术栈搭建项目基础架构，配置开发环境和工具链。",
        detailedDescription: "<p>本任务要求学员从零开始搭建一个企业级前端项目，需要完成以下内容：</p><ul><li>使用 Vite 或 Create React App 初始化项目</li><li>配置 TypeScript 环境</li><li>设置 ESLint 和 Prettier 代���规范</li><li>配置路由和状态管理</li></ul>",
        estimatedHours: 8,
        taskType: "assessment",
        difficulty: 3,
        background: "在现代企业开发中，规范的项目初始化是保证代码质量的第一步。",
        dependencies: [],
        resources: ["lr-1", "lr-2"],
        deliverables: [
          { id: "del-1", type: "exercise", name: "架构知识测验", description: "完成项目架构相关的测试题目", evaluationPoints: [] },
          { id: "del-2", type: "result_file", name: "项目代码仓库", description: "包含完整项目初始化代码的 Git 仓库", evaluationPoints: [
            { id: "ep-1", name: "目录结构合理性", description: "项目目录结构清晰、符合规范", maxLevel: 5 },
            { id: "ep-2", name: "配置文件完整性", description: "各类配置文件完整且正确", maxLevel: 5 },
          ] },
        ],
        knowledgePoints: ["kp-1", "kp-2", "kp-7"],
        abilityPoints: ["ab-1", "ab-2", "ab-7"],
        assessment: {
          type: "objective",
          objectiveConfig: {
            totalScore: 100,
            questions: [
              { id: "q-1", type: "single", content: "React 18 中引入的并发特性主要解决什么问题？", options: ["性能优化", "代码复用", "状态管理", "路由控制"], answer: "性能优化", score: 10 },
              { id: "q-2", type: "judgment", content: "TypeScript 是 JavaScript 的超集", answer: "true", score: 10 },
              { id: "q-3", type: "multiple", content: "以下哪些是常用的 React 状态管理方案？", options: ["Redux", "MobX", "Zustand", "jQuery"], answer: ["Redux", "MobX", "Zustand"], score: 20 },
            ],
          },
        },
      },
      {
        id: "task-1-2",
        name: "用户认证模块开发",
        code: "T-001-002",
        order: 2,
        description: "实现用户登录、注册、权限验证等认证相关功能。",
        detailedDescription: "<p>认证模块是企业应用的核心功能，本任务要求实现完整的用户认证流程。</p>",
        estimatedHours: 12,
        taskType: "assessment",
        difficulty: 4,
        background: "用户认证是企业级应用的基础安全保障。",
        dependencies: ["task-1-1"],
        resources: ["lr-6"],
        deliverables: [
          { id: "del-3", type: "result_file", name: "认证模块代码", description: "包含登录注册功能的完整代码", evaluationPoints: [
            { id: "ep-3", name: "代码质量", description: "代码规范、可读性强", maxLevel: 5 },
            { id: "ep-4", name: "功能完整性", description: "登录注册功能完整", maxLevel: 5 },
            { id: "ep-5", name: "安全性考虑", description: "密码加密、XSS 防护等", maxLevel: 5 },
          ] },
        ],
        knowledgePoints: ["kp-1", "kp-6"],
        abilityPoints: ["ab-1", "ab-5", "ab-9"],
        assessment: {
          type: "subjective",
          subjectiveConfig: {
            totalScore: 100,
            rubricPoints: [
              { id: "rp-1", name: "代码质量", weight: 40, maxScore: 40, levels: defaultRubricLevels },
              { id: "rp-2", name: "功能完整性", weight: 35, maxScore: 35, levels: defaultRubricLevels },
              { id: "rp-3", name: "安全性考虑", weight: 25, maxScore: 25, levels: defaultRubricLevels },
            ],
            synthesisRule: "weighted",
          },
        },
      },
      {
        id: "task-1-3",
        name: "核心业务组件开发",
        code: "T-001-003",
        order: 3,
        description: "开发数据表格、图表展示、表单处理等核心业务组件。",
        estimatedHours: 16,
        taskType: "training",
        difficulty: 4,
        background: "可复用的业务组件是提升开发效率的关键。",
        dependencies: ["task-1-1"],
        resources: ["lr-3"],
        deliverables: [
          { id: "del-4", type: "onsite_evaluation", name: "组件演示评审", description: "现场演示组件功能并接受评审", evaluationPoints: [
            { id: "ep-6", name: "组件设计", description: "组件接口设计合理", maxLevel: 5 },
            { id: "ep-7", name: "代码复用性", description: "组件可复用性强", maxLevel: 5 },
          ] },
        ],
        knowledgePoints: ["kp-1", "kp-3"],
        abilityPoints: ["ab-1", "ab-6"],
        assessment: {
          type: "mixed",
          objectiveConfig: {
            totalScore: 40,
            questions: [
              { id: "q-4", type: "single", content: "React 中 useMemo 的主要作用是？", options: ["缓存计算结果", "管理副作用", "处理事件", "路由跳转"], answer: "缓存计算结果", score: 20 },
            ],
          },
          subjectiveConfig: {
            totalScore: 60,
            rubricPoints: [
              { id: "rp-4", name: "组件设计", weight: 50, maxScore: 30, levels: defaultRubricLevels },
              { id: "rp-5", name: "代码复用性", weight: 50, maxScore: 30, levels: defaultRubricLevels },
            ],
            synthesisRule: "sum",
          },
          mixedWeights: { objective: 40, subjective: 60 },
        },
      },
      {
        id: "task-1-4",
        name: "项目优化与部署",
        code: "T-001-004",
        order: 4,
        description: "进行性能优化、打包配置，完成项目部署上线。",
        estimatedHours: 8,
        taskType: "assessment",
        difficulty: 3,
        background: "项目上线前的优化和部署是开发流程的最后关键环节。",
        dependencies: ["task-1-2", "task-1-3"],
        resources: [],
        deliverables: [
          { id: "del-5", type: "result_file", name: "部署报告", description: "项目部署过程和优化措施报告", evaluationPoints: [] },
        ],
        knowledgePoints: ["kp-7"],
        abilityPoints: ["ab-6", "ab-7"],
        assessment: null,
      },
    ],
    weightConfig: {
      tasks: [
        { taskId: "task-1-1", weight: 20 },
        { taskId: "task-1-2", weight: 30 },
        { taskId: "task-1-3", weight: 30 },
        { taskId: "task-1-4", weight: 20 },
      ],
    },
    gradeMapping: defaultGradeMapping,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
  {
    id: "scenario-2",
    name: "RESTful API 设计与开发",
    code: "SC-2026-0002",
    coverImage: "/placeholder.svg?height=200&width=320",
    positionId: "pos-2",
    positionName: "后端开发工程师",
    professionId: "prof-1",
    professionName: "信息技术",
    industryId: "ind-1",
    industryName: "互联网/IT",
    batchId: "batch-2",
    batchName: "2026春季前端开发场景建设",
    difficulty: 3,
    version: "v1.5",
    status: "published",
    publishTime: "2024-02-20 14:00:00",
    creatorId: "user-1",
    creatorName: "张老师",
    coBuilders: [],
    background: "RESTful API 是现代 Web 应用的基础，本场景帮助学员掌握 API 设计原则和最佳实践。",
    deliveryGoal: "设计并实现一套完整的 RESTful API，包含认证、CRUD 操作、错误处理等功能。",
    tasks: [
      {
        id: "task-2-1",
        name: "API 设计规范学习",
        code: "T-002-001",
        order: 1,
        description: "学习 RESTful API 设计原则和规范。",
        estimatedHours: 6,
        taskType: "training",
        difficulty: 2,
        background: "RESTful API 是现代 Web 服务的标准接口规范。",
        dependencies: [],
        resources: ["lr-4"],
        deliverables: [],
        knowledgePoints: ["kp-4"],
        abilityPoints: ["ab-3"],
        assessment: null,
      },
      {
        id: "task-2-2",
        name: "数据库设计",
        code: "T-002-002",
        order: 2,
        description: "设计数据库模型和关系。",
        estimatedHours: 8,
        taskType: "assessment",
        difficulty: 3,
        background: "合理的数据库设计是后端服务稳定运行的基础。",
        dependencies: ["task-2-1"],
        resources: ["lr-5"],
        deliverables: [],
        knowledgePoints: ["kp-5"],
        abilityPoints: ["ab-4"],
        assessment: null,
      },
    ],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
  },
  {
    id: "scenario-3",
    name: "数据可视化分析实战",
    code: "SC-2026-0003",
    coverImage: "/placeholder.svg?height=200&width=320",
    positionId: "pos-4",
    positionName: "数据分析师",
    professionId: "prof-1",
    professionName: "信息技术",
    industryId: "ind-1",
    industryName: "互联网/IT",
    batchId: "batch-2",
    batchName: "2026春季前端开发场景建设",
    difficulty: 3,
    version: "v1.2",
    status: "rejected",
    publishTime: "",
    creatorId: "user-2",
    creatorName: "李老师",
    coBuilders: [],
    background: "通过真实业务数据，学习数据处理、分析和可视化技术。",
    deliveryGoal: "完成一份完整的数据分析报告，包含数据清洗、分析和可视化展示。",
    tasks: [],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
  },
  {
    id: "scenario-4",
    name: "电商平台运营全流程",
    code: "SC-2026-0004",
    coverImage: "/placeholder.svg?height=200&width=320",
    positionId: "pos-5",
    positionName: "电商运营专员",
    professionId: "prof-2",
    professionName: "电子商务",
    industryId: "ind-2",
    industryName: "电子商务",
    batchId: "batch-1",
    batchName: "2026春季电商实训场景开发",
    difficulty: 2,
    version: "v3.0",
    status: "pending",
    publishTime: "",
    creatorId: "user-2",
    creatorName: "李老师",
    coBuilders: [{ id: "user-4", name: "赵老师" }],
    background: "从店铺搭建到运营推广，完整体验电商运营全流程。",
    deliveryGoal: "独立完成一个电商店铺的搭建、商品上架、营销活动策划。",
    tasks: [],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-08",
  },
  {
    id: "scenario-5",
    name: "企业财务报表分析",
    code: "SC-2025-0005",
    coverImage: "/placeholder.svg?height=200&width=320",
    positionId: "pos-8",
    positionName: "会计师",
    professionId: "prof-3",
    professionName: "财务管理",
    industryId: "ind-3",
    industryName: "金融",
    batchId: "batch-3",
    batchName: "2025秋季财务管理场景",
    difficulty: 3,
    version: "v2.0",
    status: "published",
    publishTime: "2024-01-10 09:00:00",
    creatorId: "user-3",
    creatorName: "王老师",
    coBuilders: [],
    background: "学习企业财务报表的编制和分析方法。",
    deliveryGoal: "能够独立完成企业财务报表的编制和分析。",
    tasks: [],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-05",
  },
  {
    id: "scenario-6",
    name: "品牌营销策划实战",
    code: "SC-2025-0006",
    coverImage: "/placeholder.svg?height=200&width=320",
    positionId: "pos-12",
    positionName: "品牌经理",
    professionId: "prof-4",
    professionName: "市场营销",
    industryId: "ind-5",
    industryName: "服务业",
    batchId: "batch-1",
    batchName: "2026春季电商实训场景开发",
    difficulty: 4,
    version: "v1.8",
    status: "draft",
    publishTime: "",
    creatorId: "user-4",
    creatorName: "赵老师",
    coBuilders: [{ id: "user-1", name: "张老师" }],
    background: "从品牌定位到营销执行，全面学习品牌管理技能。",
    deliveryGoal: "制定一份完整的品牌营销策划方案。",
    tasks: [],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2023-12-15",
    updatedAt: "2024-01-02",
  },
  {
    id: "scenario-7",
    name: "未分配岗位的测试草稿场景",
    code: "SC-2026-0007",
    coverImage: "/placeholder.svg?height=200&width=320",
    difficulty: 2,
    version: "v1.0",
    status: "draft",
    publishTime: "",
    creatorId: "user-1",
    creatorName: "张老师",
    coBuilders: [],
    background: "这是一个尚未关联岗位和批次的草稿场景。",
    deliveryGoal: "待补充。",
    tasks: [],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
  {
    id: "scenario-8",
    name: "独立项目草稿 - 新媒体运营",
    code: "SC-2026-0008",
    coverImage: "/placeholder.svg?height=200&width=320",
    difficulty: 3,
    version: "v1.0",
    status: "draft",
    publishTime: "",
    creatorId: "user-2",
    creatorName: "李老师",
    coBuilders: [],
    background: "探索新媒体运营相关的实践场景设计。",
    deliveryGoal: "待补充。",
    tasks: [],
    weightConfig: { tasks: [] },
    gradeMapping: defaultGradeMapping,
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
  },
]

// Knowledge Points Library
export const granularLessons: GranularLesson[] = [
  { id: "gl-1", name: "React 基础入门", description: "React 核心概念与 Hooks 使用", code: "GL-001" },
  { id: "gl-2", name: "TypeScript 实战", description: "TS 类型系统与工程化实践", code: "GL-002" },
  { id: "gl-3", name: "CSS 布局精讲", description: "Flexbox 与 Grid 布局详解", code: "GL-003" },
  { id: "gl-4", name: "RESTful API 设计", description: "API 设计规范与最佳实践", code: "GL-004" },
  { id: "gl-5", name: "数据库设计基础", description: "关系型数据库建模方法", code: "GL-005" },
  { id: "gl-6", name: "Node.js 服务端开发", description: "Node.js 后端服务开发与性能优化", code: "GL-006" },
  { id: "gl-7", name: "Docker 容器化部署", description: "Docker 镜像构建与容器编排", code: "GL-007" },
  { id: "gl-8", name: "Redis 缓存策略", description: "Redis 数据结构与缓存设计模式", code: "GL-008" },
  { id: "gl-9", name: "Git 工作流与协作", description: "Git 分支策略与团队协作规范", code: "GL-009" },
  { id: "gl-10", name: "电商数据分析", description: "电商运营数据分析与指标拆解", code: "GL-010" },
]

export const knowledgePoints: KnowledgePoint[] = [
  { id: "kp-1", name: "React Hooks", description: "React 函数组件中的状态和副作用管理", category: "前端开发", relatedResources: ["lr-1", "lr-2"], code: "KP-001", granularLessons: ["gl-1", "gl-2", "gl-3"] },
  { id: "kp-2", name: "TypeScript 基础", description: "TypeScript 类型系统和基本语法", category: "前端开发", relatedResources: ["lr-2", "lr-3"], code: "KP-002", granularLessons: ["gl-2", "gl-4", "gl-6"] },
  { id: "kp-3", name: "CSS Flexbox", description: "CSS 弹性盒子布局", category: "前端开发", relatedResources: ["lr-3"], code: "KP-003", granularLessons: ["gl-3", "gl-1"] },
  { id: "kp-4", name: "RESTful API", description: "REST 风格的 API 设计原则", category: "后端开发", relatedResources: ["lr-4", "lr-5"], code: "KP-004", granularLessons: ["gl-4", "gl-6", "gl-8"] },
  { id: "kp-5", name: "数据库设计", description: "关系型数据库表结构设计", category: "后端开发", relatedResources: ["lr-5"], code: "KP-005", granularLessons: ["gl-5", "gl-8", "gl-10"] },
  { id: "kp-6", name: "JWT 认证", description: "JSON Web Token 身份验证机制", category: "安全", relatedResources: ["lr-6", "lr-4"], code: "KP-006", granularLessons: ["gl-4", "gl-5", "gl-6", "gl-8"] },
  { id: "kp-7", name: "Git 版本控制", description: "Git 分支管理和协作开发", category: "工具", relatedResources: ["lr-7"], code: "KP-007", granularLessons: ["gl-9", "gl-2"] },
  { id: "kp-8", name: "电商运营基础", description: "电商平台运营的基本概念和流程", category: "电子商务", relatedResources: ["lr-9", "lr-10"], code: "KP-008", granularLessons: ["gl-10", "gl-5", "gl-9"] },
  { id: "kp-9", name: "数据可视化", description: "使用图表展示数据的方法和技巧", category: "数据分析", relatedResources: ["lr-10"], code: "KP-009", granularLessons: ["gl-3", "gl-10", "gl-1"] },
  { id: "kp-10", name: "财务报表分析", description: "企业财务报表的编制和分析方法", category: "财务管理", relatedResources: ["lr-10"], code: "KP-010", granularLessons: ["gl-10", "gl-5", "gl-8", "gl-9"] },
]

// Ability Points Library (global)
export const abilityPoints: AbilityPoint[] = [
  { id: "ab-1", name: "组件封装能力", description: "能够将业务逻辑封装为可复用的组件", category: "开发能力", domain: "前端工程化", proficiencyDesc: "L1:能使用现有组件; L2:能修改组件适配需求; L3:能独立封装通用组件; L4:能设计组件库架构; L5:能制定团队组件规范", code: "AB-001", positionIds: ["pos-1", "pos-3"], requiredLevel: "精通" },
  { id: "ab-2", name: "状态管理能力", description: "合理使用状态管理方案管理应用数据", category: "开发能力", domain: "前端工程化", proficiencyDesc: "L1:了解useState/useReducer; L2:能使用Context; L3:能使用Redux/Zustand; L4:能设计状态架构; L5:能优化大规模状态性能", code: "AB-002", positionIds: ["pos-1", "pos-3"], requiredLevel: "熟练" },
  { id: "ab-3", name: "接口设计能力", description: "设计清晰、规范的 API 接口", category: "设计能力", domain: "系统设计", proficiencyDesc: "L1:能调用现成接口; L2:能编写简单CRUD; L3:能设计RESTful接口; L4:能设计版本兼容策略; L5:能设计高并发接口架构", code: "AB-003", positionIds: ["pos-2", "pos-3"], requiredLevel: "精通" },
  { id: "ab-4", name: "数据库建模能力", description: "设计高效、规范的数据库表结构", category: "设计能力", domain: "系统设计", proficiencyDesc: "L1:能写基本SQL; L2:能设计单表结构; L3:能设计多表关联; L4:能优化查询性能; L5:能设计分库分表方案", code: "AB-004", positionIds: ["pos-2", "pos-3", "pos-4"], requiredLevel: "熟练" },
  { id: "ab-5", name: "安全编码能力", description: "编写安全的代码，防范常见安全漏洞", category: "开发能力", domain: "质量保障", proficiencyDesc: "L1:了解常见漏洞概念; L2:能避免XSS/SQL注入; L3:能实施认证授权; L4:能进行安全审计; L5:能设计安全架构", code: "AB-005", positionIds: ["pos-1", "pos-2", "pos-3"], requiredLevel: "理解" },
  { id: "ab-6", name: "性能优化能力", description: "识别性能瓶颈并进行优化", category: "优化能力", domain: "质量保障", proficiencyDesc: "L1:能使用性能分析工具; L2:能优化渲染性能; L3:能优化网络请求; L4:能优化构建体积; L5:能设计性能监控体系", code: "AB-006", positionIds: ["pos-1", "pos-2", "pos-3"], requiredLevel: "熟悉" },
  { id: "ab-7", name: "团队协作能力", description: "有效沟通、代码审查、文档编写", category: "软技能", domain: "职业素养", proficiencyDesc: "L1:能完成分配任务; L2:能主动沟通问题; L3:能进行代码审查; L4:能指导初级成员; L5:能推动团队协作文化", code: "AB-007", positionIds: ["pos-1", "pos-2", "pos-3", "pos-4", "pos-5", "pos-6", "pos-7", "pos-8", "pos-9", "pos-10", "pos-11", "pos-12"], requiredLevel: "理解" },
  { id: "ab-8", name: "数据分析能力", description: "使用数据驱动决策和分析", category: "分析能力", domain: "职业素养", proficiencyDesc: "L1:能查看基础报表; L2:能使用Excel分析; L3:能使用SQL取数; L4:能建立分析模型; L5:能搭建数据平台", code: "AB-008", positionIds: ["pos-4", "pos-5", "pos-9"], requiredLevel: "熟练" },
  { id: "ab-9", name: "问题排查能力", description: "定位和解决技术问题的能力", category: "开发能力", domain: "质量保障", proficiencyDesc: "L1:能根据报错搜索; L2:能使用调试工具; L3:能分析复杂链路; L4:能处理线上故障; L5:能设计容灾方案", code: "AB-009", positionIds: ["pos-1", "pos-2", "pos-3"], requiredLevel: "熟悉" },
  { id: "ab-10", name: "项目管理能力", description: "规划、跟踪和交付项目任务", category: "软技能", domain: "职业素养", proficiencyDesc: "L1:能管理个人任务; L2:能协助跟踪进度; L3:能主导小型项目; L4:能管理跨团队项目; L5:能制定项目管理规范", code: "AB-010", positionIds: ["pos-1", "pos-2", "pos-3", "pos-5", "pos-11", "pos-12"], requiredLevel: "理解" },
  { id: "ab-11", name: "CSS 样式开发能力", description: "掌握现代 CSS 技术，实现复杂的页面布局和视觉效果", category: "开发能力", domain: "前端工程化", proficiencyDesc: "L1:能写基础样式; L2:能使用Flexbox/Grid; L3:能实现响应式布局; L4:能优化样式性能; L5:能设计CSS架构", code: "AB-011", positionIds: ["pos-1", "pos-3"], requiredLevel: "熟练" },
  { id: "ab-12", name: "前端构建工具配置", description: "配置和优化前端工程化工具链", category: "开发能力", domain: "前端工程化", proficiencyDesc: "L1:能使用现成脚手架; L2:能配置Webpack/Vite; L3:能优化构建配置; L4:能定制构建流程; L5:能设计工程化体系", code: "AB-012", positionIds: ["pos-1", "pos-3"], requiredLevel: "熟悉" },
  { id: "ab-13", name: "服务端开发能力", description: "使用 Node.js 或其他服务端技术开发后端服务", category: "开发能力", domain: "服务端开发", proficiencyDesc: "L1:能写简单脚本; L2:能开发基础API; L3:能设计服务架构; L4:能优化服务性能; L5:能设计微服务架构", code: "AB-013", positionIds: ["pos-2", "pos-3"], requiredLevel: "熟练" },
  { id: "ab-14", name: "DevOps 运维能力", description: "掌握持续集成、持续部署和容器化技术", category: "工程能力", domain: "运维部署", proficiencyDesc: "L1:了解CI/CD概念; L2:能使用GitHub Actions; L3:能配置Docker; L4:能搭建K8s集群; L5:能设计DevOps体系", code: "AB-014", positionIds: ["pos-2", "pos-3"], requiredLevel: "理解" },
  { id: "ab-15", name: "数据可视化能力", description: "使用图表库实现数据的可视化展示", category: "分析能力", domain: "数据分析", proficiencyDesc: "L1:能使用基础图表; L2:能配置ECharts/D3; L3:能设计可视化方案; L4:能开发交互式大屏; L5:能设计可视化规范", code: "AB-015", positionIds: ["pos-4", "pos-1"], requiredLevel: "熟悉" },
]

// Learning Resources Library
export const learningResources: LearningResource[] = [
  { id: "lr-1", name: "React 官方文档", type: "link", url: "https://react.dev", description: "React 框架官方中文文档", knowledgePoints: ["kp-1"], uploadedAt: "2024-01-10", uploadedBy: "张老师", thumbnail: "/placeholder.svg" },
  { id: "lr-2", name: "TypeScript 入门教程.pdf", type: "document", url: "/files/ts-guide.pdf", size: "2.3MB", description: "TypeScript 从入门到精通", knowledgePoints: ["kp-2"], uploadedAt: "2024-01-08", uploadedBy: "李老师", thumbnail: "/placeholder.svg" },
  { id: "lr-3", name: "CSS 布局实战视频", type: "video", url: "/videos/css-layout.mp4", size: "156MB", description: "CSS Flexbox 和 Grid 布局详解", knowledgePoints: ["kp-3"], uploadedAt: "2024-01-05", uploadedBy: "王老师", thumbnail: "/placeholder.svg" },
  { id: "lr-4", name: "API 设计规范文档.docx", type: "document", url: "/files/api-spec.docx", size: "1.2MB", description: "RESTful API 设计最佳实践", knowledgePoints: ["kp-4"], uploadedAt: "2024-01-12", uploadedBy: "张老师", thumbnail: "/placeholder.svg" },
  { id: "lr-5", name: "数据库建模工具", type: "tool", url: "https://dbdiagram.io", description: "在线数据库设计工具", knowledgePoints: ["kp-5"], uploadedAt: "2024-01-15", uploadedBy: "赵老师", thumbnail: "/placeholder.svg" },
  { id: "lr-6", name: "JWT 认证流程图.png", type: "image", url: "/images/jwt-flow.png", size: "0.5MB", description: "JWT 认证工作流程图解", knowledgePoints: ["kp-6"], uploadedAt: "2024-01-18", uploadedBy: "李老师", thumbnail: "/placeholder.svg" },
  { id: "lr-7", name: "Git 协作开发指南", type: "document", url: "/files/git-guide.pdf", size: "3.1MB", description: "团队 Git 工作流最佳实践", knowledgePoints: ["kp-7"], uploadedAt: "2024-01-20", uploadedBy: "王老师", thumbnail: "/placeholder.svg" },
  { id: "lr-8", name: "实训室 A-301", type: "venue", url: "", description: "计算机实训室，配备50台电脑", knowledgePoints: [], uploadedAt: "2024-01-01", uploadedBy: "管理员", thumbnail: "/placeholder.svg" },
  { id: "lr-9", name: "电商平台演示系统", type: "software", url: "https://demo.shop.edu", description: "电商运营模拟平台", knowledgePoints: ["kp-8"], uploadedAt: "2024-01-22", uploadedBy: "赵老师", thumbnail: "/placeholder.svg" },
  { id: "lr-10", name: "数据分析案例集", type: "document", url: "/files/data-cases.pdf", size: "5.6MB", description: "真实业务数据分析案例", knowledgePoints: ["kp-9"], uploadedAt: "2024-01-25", uploadedBy: "刘老师", thumbnail: "/placeholder.svg" },
  // New resource types for expanded coverage
  { id: "lr-11", name: "学生成绩统计表.xlsx", type: "spreadsheet", url: "/files/grades.xlsx", size: "0.8MB", description: "2024春季学期学生实训成绩汇总表", knowledgePoints: [], uploadedAt: "2024-02-01", uploadedBy: "教务老师", thumbnail: "/placeholder.svg" },
  { id: "lr-12", name: "项目需求讲解音频", type: "audio", url: "/audio/requirements.mp3", size: "12MB", description: "企业导师对项目需求的详细讲解录音", knowledgePoints: ["kp-1"], uploadedAt: "2024-02-05", uploadedBy: "企业导师", thumbnail: "/placeholder.svg" },
  { id: "lr-13", name: "前端开发工具包.zip", type: "archive", url: "/files/frontend-toolkit.zip", size: "45MB", description: "包含常用前端工具、脚手架和配置文件", knowledgePoints: ["kp-1", "kp-2"], uploadedAt: "2024-02-08", uploadedBy: "张老师", thumbnail: "/placeholder.svg" },
  { id: "lr-14", name: "VS Code 开发环境", type: "tool", url: "https://code.visualstudio.com", description: "推荐使用的代码编辑器及插件配置说明", knowledgePoints: ["kp-1"], uploadedAt: "2024-02-10", uploadedBy: "李老师", thumbnail: "/placeholder.svg" },
  { id: "lr-15", name: "3D打印机设备", type: "facility", url: "", description: "创想三维3D打印机，用于原型制作", knowledgePoints: [], uploadedAt: "2024-02-12", uploadedBy: "实验室管理员", thumbnail: "/placeholder.svg" },
  { id: "lr-16", name: "服务器集群", type: "facility", url: "", description: "4台高性能服务器，用于部署和测试", knowledgePoints: ["kp-5"], uploadedAt: "2024-02-15", uploadedBy: "IT管理员", thumbnail: "/placeholder.svg" },
  { id: "lr-17", name: "设计规范表格", type: "spreadsheet", url: "/files/design-spec.xlsx", size: "1.5MB", description: "UI设计规范参数对照表", knowledgePoints: ["kp-3"], uploadedAt: "2024-02-18", uploadedBy: "王老师", thumbnail: "/placeholder.svg" },
  { id: "lr-18", name: "代码审查清单", type: "document", url: "/files/code-review.pdf", size: "0.6MB", description: "团队代码审查标准检查清单", knowledgePoints: ["kp-7"], uploadedAt: "2024-02-20", uploadedBy: "张老师", thumbnail: "/placeholder.svg" },
  { id: "lr-19", name: "微服务架构讲解", type: "audio", url: "/audio/microservices.mp3", size: "28MB", description: "微服务架构设计原则讲解录音", knowledgePoints: ["kp-4"], uploadedAt: "2024-02-22", uploadedBy: "李老师", thumbnail: "/placeholder.svg" },
  { id: "lr-20", name: "项目素材压缩包", type: "archive", url: "/files/project-assets.zip", size: "120MB", description: "包含图片、图标、字体等项目素材", knowledgePoints: ["kp-3"], uploadedAt: "2024-02-25", uploadedBy: "王老师", thumbnail: "/placeholder.svg" },
  { id: "lr-21", name: "Postman API测试工具", type: "tool", url: "https://www.postman.com", description: "API接口测试与协作平台", knowledgePoints: ["kp-4"], uploadedAt: "2024-03-01", uploadedBy: "赵老师", thumbnail: "/placeholder.svg" },
  { id: "lr-22", name: "多媒体教室 B-205", type: "venue", url: "", description: "配备投影仪、音响和80个座位", knowledgePoints: [], uploadedAt: "2024-03-05", uploadedBy: "管理员", thumbnail: "/placeholder.svg" },
  { id: "lr-23", name: "无人机实训设备", type: "facility", url: "", description: "大疆无人机及配套飞行模拟器", knowledgePoints: [], uploadedAt: "2024-03-08", uploadedBy: "实验室管理员", thumbnail: "/placeholder.svg" },
  { id: "lr-24", name: "React 18 新特性视频教程", type: "video", url: "/videos/react18-features.mp4", size: "230MB", description: "深入讲解 React 18 并发特性和自动批处理", knowledgePoints: ["kp-1"], uploadedAt: "2024-03-10", uploadedBy: "张老师", thumbnail: "/placeholder.svg" },
  { id: "lr-25", name: "百度统计后台链接", type: "link", url: "https://tongji.baidu.com", description: "网站流量分析平台入口", knowledgePoints: ["kp-9"], uploadedAt: "2024-03-12", uploadedBy: "刘老师", thumbnail: "/placeholder.svg" },
]

// Extended users list for co-builder search
export const allTeachers: User[] = [
  { id: "user-1", name: "张老师", role: "builder", department: "信息工程系" },
  { id: "user-2", name: "李老师", role: "builder", department: "信息工程系" },
  { id: "user-3", name: "王老师", role: "reviewer", department: "经济管理系" },
  { id: "user-4", name: "赵老师", role: "builder", department: "经济管理系" },
  { id: "user-5", name: "刘老师", role: "admin", department: "教务处" },
  { id: "user-6", name: "陈老师", role: "builder", department: "信息工程系" },
  { id: "user-7", name: "杨老师", role: "builder", department: "信息工程系" },
  { id: "user-8", name: "黄老师", role: "reviewer", department: "艺术设计系" },
  { id: "user-9", name: "周老师", role: "builder", department: "艺术设计系" },
  { id: "user-10", name: "吴老师", role: "builder", department: "经济管理系" },
  { id: "user-11", name: "郑老师", role: "builder", department: "机械工程系" },
  { id: "user-12", name: "孙老师", role: "reviewer", department: "机械工程系" },
  { id: "user-13", name: "马老师", role: "builder", department: "外语系" },
  { id: "user-14", name: "林老师", role: "builder", department: "外语系" },
  { id: "user-15", name: "何老师", role: "admin", department: "教务处" },
]

// Question bank for objective assessments
export const questionBank = {
  frontend: [
    { id: "qb-1", name: "React Hooks 识别", type: "single" as const, content: "以下哪个不是 React Hooks？", options: ["useState", "useEffect", "useClass", "useCallback"], answer: "useClass", score: 10, difficulty: "easy" as const, source: "public" as const },
    { id: "qb-2", name: "CSS flex 属性", type: "single" as const, content: "CSS 中 flex: 1 等价于？", options: ["flex-grow: 1", "flex-shrink: 1", "flex-grow: 1; flex-shrink: 1; flex-basis: 0%", "flex-basis: 100%"], answer: "flex-grow: 1; flex-shrink: 1; flex-basis: 0%", score: 10, difficulty: "medium" as const, source: "public" as const },
    { id: "qb-3", name: "Virtual DOM 性能判断", type: "judgment" as const, content: "Virtual DOM 可以提升所有场景下的渲染性能", answer: "false", score: 10, difficulty: "medium" as const, source: "collab" as const },
    { id: "qb-4", name: "JS 基本数据类型", type: "multiple" as const, content: "以下哪些是 JavaScript 的基本数据类型？", options: ["String", "Number", "Array", "Boolean", "Object"], answer: ["String", "Number", "Boolean"], score: 15, difficulty: "hard" as const, source: "my" as const },
    { id: "qb-7", name: "React 生命周期理解", type: "subjective" as const, content: "请简述 React 类组件的生命周期方法及其执行顺序，并说明在函数组件中如何替代这些生命周期方法。", score: 20, difficulty: "hard" as const, source: "my" as const },
    { id: "qb-8", name: "CSS 盒模型", type: "single" as const, content: "标准盒模型中，元素的总宽度等于？", options: ["width + padding + border + margin", "width + padding + border", "width", "width + margin"], answer: "width + padding + border + margin", score: 10, difficulty: "easy" as const, source: "public" as const },
    { id: "qb-9", name: "Promise 机制", type: "judgment" as const, content: "Promise.prototype.finally() 无论 Promise 成功或失败都会执行", answer: "true", score: 10, difficulty: "medium" as const, source: "collab" as const },
    { id: "qb-10", name: "前端性能优化", type: "subjective" as const, content: "请列举至少 5 种前端性能优化的方法，并说明适用场景。", score: 20, difficulty: "medium" as const, source: "public" as const },
  ],
  backend: [
    { id: "qb-5", name: "HTTP 状态码", type: "single" as const, content: "HTTP 状态码 401 表示？", options: ["未找到", "未授权", "服务器错误", "请求成功"], answer: "未授权", score: 10, difficulty: "easy" as const, source: "public" as const },
    { id: "qb-6", name: "RESTful API 方法", type: "judgment" as const, content: "RESTful API 中，PUT 方法用于创建资源", answer: "false", score: 10, difficulty: "easy" as const, source: "collab" as const },
    { id: "qb-11", name: "数据库索引原理", type: "multiple" as const, content: "以下哪些属于数据库索引的优点？", options: ["加快查询速度", "减少磁盘 I/O", "自动维护数据一致性", "占用额外存储空间", "降低写操作性能"], answer: ["加快查询速度", "减少磁盘 I/O"], score: 15, difficulty: "hard" as const, source: "my" as const },
    { id: "qb-12", name: "微服务架构", type: "subjective" as const, content: "请阐述微服务架构相比单体架构的优势与挑战，并给出适用场景建议。", score: 25, difficulty: "hard" as const, source: "public" as const },
  ],
  draft: [
    { id: "qb-d1", name: "HTML5 新特性", type: "multiple" as const, content: "以下哪些是 HTML5 引入的新特性？", options: ["Canvas", "LocalStorage", "WebSocket", "Flash"], answer: ["Canvas", "LocalStorage", "WebSocket"], score: 15, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d2", name: "Git 分支管理", type: "single" as const, content: "Git 中合并分支使用的命令是？", options: ["git merge", "git branch", "git checkout", "git push"], answer: "git merge", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d3", name: "跨域请求", type: "judgment" as const, content: "CORS 是一种解决浏览器跨域请求的安全机制", answer: "true", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d4", name: "Docker 容器化", type: "single" as const, content: "Docker 中用于查看运行中容器的命令是？", options: ["docker ps", "docker images", "docker build", "docker run"], answer: "docker ps", score: 10, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d5", name: "TCP 与 UDP", type: "multiple" as const, content: "以下关于 TCP 和 UDP 的描述，正确的有？", options: ["TCP 是面向连接的", "UDP 传输效率更高", "TCP 保证数据顺序", "UDP 提供重传机制"], answer: ["TCP 是面向连接的", "UDP 传输效率更高", "TCP 保证数据顺序"], score: 15, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d6", name: "Linux 文件权限", type: "single" as const, content: "Linux 中设置文件权限为 755 的命令是？", options: ["chmod 755 file", "chown 755 file", "perm 755 file", "access 755 file"], answer: "chmod 755 file", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d7", name: "Web 安全 XSS", type: "judgment" as const, content: "XSS 攻击是指通过注入恶意脚本到网页中，从而窃取用户信息的攻击方式", answer: "true", score: 10, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d8", name: "敏捷开发 Scrum", type: "single" as const, content: "Scrum 中一个 Sprint 的时长通常是？", options: ["1-4 周", "1-2 天", "1-2 月", "6 个月"], answer: "1-4 周", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d9", name: "设计模式原则", type: "multiple" as const, content: "以下属于 SOLID 原则的有？", options: ["单一职责原则", "开闭原则", "依赖倒置原则", "快速迭代原则"], answer: ["单一职责原则", "开闭原则", "依赖倒置原则"], score: 15, difficulty: "hard" as const, source: "my" as const },
    { id: "qb-d10", name: "CI/CD 流程", type: "single" as const, content: "CI/CD 中的 CD 通常指？", options: ["持续交付/持续部署", "持续开发", "代码审查", "容器交付"], answer: "持续交付/持续部署", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d11", name: "OAuth2 授权", type: "judgment" as const, content: "OAuth2 是一种开放授权协议，允许第三方应用在不获取用户密码的情况下访问用户资源", answer: "true", score: 10, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d12", name: "网络 OSI 七层模型", type: "single" as const, content: "HTTP 协议工作在 OSI 七层模型的哪一层？", options: ["应用层", "传输层", "网络层", "会话层"], answer: "应用层", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d13", name: "Redis 缓存策略", type: "multiple" as const, content: "以下哪些是常见的 Redis 缓存淘汰策略？", options: ["LRU", "LFU", "FIFO", "Random"], answer: ["LRU", "LFU", "Random"], score: 15, difficulty: "hard" as const, source: "my" as const },
    { id: "qb-d14", name: "代码版本控制", type: "single" as const, content: "Git 中撤销工作区修改的命令是？", options: ["git checkout -- file", "git reset", "git revert", "git rm"], answer: "git checkout -- file", score: 10, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d15", name: "JSON 与 XML", type: "judgment" as const, content: "JSON 的数据格式比 XML 更轻量，解析效率更高", answer: "true", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d16", name: "敏捷开发实践", type: "subjective" as const, content: "请简述每日站会（Daily Stand-up）的目的和常见流程，并说明如何避免站会流于形式。", score: 20, difficulty: "medium" as const, source: "my" as const },
    { id: "qb-d17", name: "数据库事务", type: "single" as const, content: "ACID 中的 I 指的是？", options: ["隔离性", "一致性", "原子性", "持久性"], answer: "隔离性", score: 10, difficulty: "easy" as const, source: "my" as const },
    { id: "qb-d18", name: "前端工程化工具", type: "multiple" as const, content: "以下哪些工具常用于前端工程化？", options: ["Webpack", "Vite", "Gulp", "Photoshop"], answer: ["Webpack", "Vite", "Gulp"], score: 15, difficulty: "easy" as const, source: "my" as const },
  ],
}

// Position Abilities - Each position has a set of predefined abilities
export const positionAbilities: PositionAbility[] = [
  // 前端开发工程师 (pos-1)
  { id: "ability-1", positionId: "pos-1", name: "React 框架开发", description: "使用 React 构建现代 Web 应用的能力", weight: 25, category: "技术能力" },
  { id: "ability-2", positionId: "pos-1", name: "TypeScript 应用", description: "TypeScript 类型系统和高级特性的运用", weight: 20, category: "技术能力" },
  { id: "ability-3", positionId: "pos-1", name: "CSS 布局与样式", description: "CSS 响应式布局和现代样式技术", weight: 15, category: "技术能力" },
  { id: "ability-4", positionId: "pos-1", name: "前端工程化", description: "构建工具、代码规范、自动化测试", weight: 15, category: "工程能力" },
  { id: "ability-5", positionId: "pos-1", name: "性能优化", description: "Web 性能分析和优化技术", weight: 15, category: "工程能力" },
  { id: "ability-6", positionId: "pos-1", name: "团队协作", description: "代码审查、文档编写、沟通协调", weight: 10, category: "软技能" },
  
  // 后端开发工程师 (pos-2)
  { id: "ability-7", positionId: "pos-2", name: "API 设计与开发", description: "RESTful API 设计原则和实现", weight: 25, category: "技术能力" },
  { id: "ability-8", positionId: "pos-2", name: "数据库设计", description: "关系型数据库建模和 SQL 优化", weight: 25, category: "技术能力" },
  { id: "ability-9", positionId: "pos-2", name: "系统安全", description: "认证授权、数据安全、防攻击", weight: 20, category: "技术能力" },
  { id: "ability-10", positionId: "pos-2", name: "服务部署", description: "容器化、CI/CD、云服务", weight: 20, category: "工程能力" },
  { id: "ability-11", positionId: "pos-2", name: "问题排查", description: "日志分析、性能监控、故障处理", weight: 10, category: "工程能力" },
  
  // 电商运营专员 (pos-5)
  { id: "ability-12", positionId: "pos-5", name: "店铺运营", description: "电商平台店铺搭建和日常运营", weight: 30, category: "运营能力" },
  { id: "ability-13", positionId: "pos-5", name: "商品管理", description: "商品上架、定价、库存管理", weight: 25, category: "运营能力" },
  { id: "ability-14", positionId: "pos-5", name: "营销推广", description: "活动策划、推广投放、流量运营", weight: 25, category: "营销能力" },
  { id: "ability-15", positionId: "pos-5", name: "数据分析", description: "运营数据分析和决策支持", weight: 20, category: "分析能力" },
  
  // 数据分析师 (pos-4)
  { id: "ability-16", positionId: "pos-4", name: "数据处理", description: "数据清洗、转换、整合能力", weight: 25, category: "技术能力" },
  { id: "ability-17", positionId: "pos-4", name: "统计分析", description: "统计方法和假设检验应用", weight: 25, category: "分析能力" },
  { id: "ability-18", positionId: "pos-4", name: "数据可视化", description: "图表设计和数据故事讲述", weight: 25, category: "表达能力" },
  { id: "ability-19", positionId: "pos-4", name: "业务理解", description: "业务需求分析和指标设计", weight: 25, category: "业务能力" },
]

// Task to Ability Mappings - Which tasks contribute to which abilities
export const taskAbilityMappings: TaskAbilityMapping[] = [
  // Scenario 1 tasks -> Front-end abilities
  { taskId: "task-1-1", abilityId: "ability-1", contributionWeight: 30 },
  { taskId: "task-1-1", abilityId: "ability-2", contributionWeight: 40 },
  { taskId: "task-1-1", abilityId: "ability-4", contributionWeight: 50 },
  { taskId: "task-1-2", abilityId: "ability-1", contributionWeight: 40 },
  { taskId: "task-1-2", abilityId: "ability-9", contributionWeight: 60 },
  { taskId: "task-1-3", abilityId: "ability-1", contributionWeight: 50 },
  { taskId: "task-1-3", abilityId: "ability-3", contributionWeight: 70 },
  { taskId: "task-1-4", abilityId: "ability-5", contributionWeight: 80 },
  { taskId: "task-1-4", abilityId: "ability-6", contributionWeight: 40 },
]

// Students
export const students: Student[] = [
  { id: "stu-1", name: "张三", studentNumber: "2024001", class: "软件工程2401班", department: "信息工程系", enrollmentYear: 2024 },
  { id: "stu-2", name: "李四", studentNumber: "2024002", class: "软件工程2401班", department: "信息工程系", enrollmentYear: 2024 },
  { id: "stu-3", name: "王五", studentNumber: "2024003", class: "电子商务2401班", department: "经济管理系", enrollmentYear: 2024 },
  { id: "stu-4", name: "赵六", studentNumber: "2024004", class: "软件工程2402班", department: "信息工程系", enrollmentYear: 2024 },
  { id: "stu-5", name: "陈七", studentNumber: "2023001", class: "数据科学2301班", department: "信息工程系", enrollmentYear: 2023 },
]

// Student Scenario Scores - Records of students completing scenarios
export const studentScenarioScores: StudentScenarioScore[] = [
  {
    id: "score-1",
    studentId: "stu-1",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    positionId: "pos-1",
    positionName: "前端开发工程师",
    totalScore: 85,
    taskScores: [
      { taskId: "task-1-1", taskName: "项目初始化与架构搭建", score: 88, maxScore: 100 },
      { taskId: "task-1-2", taskName: "用户认证模块开发", score: 82, maxScore: 100 },
      { taskId: "task-1-3", taskName: "核心业务组件开发", score: 90, maxScore: 100 },
      { taskId: "task-1-4", taskName: "项目优化与部署", score: 80, maxScore: 100 },
    ],
    completedAt: "2026-04-15",
  },
  {
    id: "score-2",
    studentId: "stu-2",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    positionId: "pos-1",
    positionName: "前端开发工程师",
    totalScore: 72,
    taskScores: [
      { taskId: "task-1-1", taskName: "项目初始化与架构搭建", score: 75, maxScore: 100 },
      { taskId: "task-1-2", taskName: "用户认证模块开发", score: 68, maxScore: 100 },
      { taskId: "task-1-3", taskName: "核心业务组件开发", score: 78, maxScore: 100 },
      { taskId: "task-1-4", taskName: "项目优化与部署", score: 65, maxScore: 100 },
    ],
    completedAt: "2026-04-16",
  },
  {
    id: "score-3",
    studentId: "stu-1",
    scenarioId: "scenario-2",
    scenarioName: "RESTful API 设计与开发",
    positionId: "pos-2",
    positionName: "后端开发工程师",
    totalScore: 78,
    taskScores: [
      { taskId: "task-2-1", taskName: "API 设计规范学习", score: 85, maxScore: 100 },
      { taskId: "task-2-2", taskName: "数据库设计", score: 71, maxScore: 100 },
    ],
    completedAt: "2026-04-18",
  },
]

// Student Ability Scores - Calculated from scenario scores
export const studentAbilityScores: StudentAbilityScore[] = [
  {
    studentId: "stu-1",
    abilityId: "ability-1",
    abilityName: "React 框架开发",
    positionId: "pos-1",
    score: 87,
    level: "proficient",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 87 },
    ],
    updatedAt: "2026-04-15",
  },
  {
    studentId: "stu-1",
    abilityId: "ability-2",
    abilityName: "TypeScript 应用",
    positionId: "pos-1",
    score: 88,
    level: "proficient",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 88 },
    ],
    updatedAt: "2026-04-15",
  },
  {
    studentId: "stu-1",
    abilityId: "ability-3",
    abilityName: "CSS 布局与样式",
    positionId: "pos-1",
    score: 90,
    level: "expert",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 90 },
    ],
    updatedAt: "2026-04-15",
  },
  {
    studentId: "stu-1",
    abilityId: "ability-4",
    abilityName: "前端工程化",
    positionId: "pos-1",
    score: 88,
    level: "proficient",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 88 },
    ],
    updatedAt: "2026-04-15",
  },
  {
    studentId: "stu-1",
    abilityId: "ability-5",
    abilityName: "性能优化",
    positionId: "pos-1",
    score: 80,
    level: "proficient",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 80 },
    ],
    updatedAt: "2026-04-15",
  },
  {
    studentId: "stu-1",
    abilityId: "ability-6",
    abilityName: "团队协作",
    positionId: "pos-1",
    score: 80,
    level: "proficient",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 80 },
    ],
    updatedAt: "2026-04-15",
  },
  // Student 2 scores
  {
    studentId: "stu-2",
    abilityId: "ability-1",
    abilityName: "React 框架开发",
    positionId: "pos-1",
    score: 74,
    level: "familiar",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 74 },
    ],
    updatedAt: "2026-04-16",
  },
  {
    studentId: "stu-2",
    abilityId: "ability-2",
    abilityName: "TypeScript 应用",
    positionId: "pos-1",
    score: 75,
    level: "familiar",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 75 },
    ],
    updatedAt: "2026-04-16",
  },
  {
    studentId: "stu-2",
    abilityId: "ability-3",
    abilityName: "CSS 布局与样式",
    positionId: "pos-1",
    score: 78,
    level: "proficient",
    scenarioContributions: [
      { scenarioId: "scenario-1", scenarioName: "企业级前端项目开发实战", contribution: 78 },
    ],
    updatedAt: "2026-04-16",
  },
]

// Helper function to get ability level from score
export function getAbilityLevel(score: number): StudentAbilityScore["level"] {
  if (score >= 90) return "expert"      // 精通
  if (score >= 75) return "proficient"  // 熟练
  if (score >= 60) return "familiar"    // 了解
  return "beginner"                      // 待提升
}

// Helper function to get level label in Chinese
export function getAbilityLevelLabel(level: StudentAbilityScore["level"]): string {
  const labels = {
    expert: "精通",
    proficient: "熟练",
    familiar: "了解",
    beginner: "待提升",
  }
  return labels[level]
}

// Helper function to get level color
export function getAbilityLevelColor(level: StudentAbilityScore["level"]): string {
  const colors = {
    expert: "bg-green-500",
    proficient: "bg-blue-500",
    familiar: "bg-yellow-500",
    beginner: "bg-red-500",
  }
  return colors[level]
}

// ============================================================================
// 教师评分相关数据模型
// ============================================================================

/** 学生任务提交记录 */
export interface StudentSubmission {
  id: string
  studentId: string
  scenarioId: string
  scenarioName: string
  taskId: string
  taskName: string
  assessmentType: "objective" | "subjective" | "mixed"
  assessmentForm: string // 测评形式名称：试卷、题库、评审、现场问答、答辩等
  status: "pending" | "graded"
  submittedAt: string
  objectiveAnswers?: ObjectiveSubmissionAnswer[]
  subjectiveContent?: SubjectiveSubmissionContent
  rubricScores?: RubricScoreRecord[]
  objectiveTotalScore?: number
  subjectiveTotalScore?: number
  totalScore?: number
  maxScore: number
  teacherComment?: string
  gradedAt?: string
  gradedBy?: string
}

/** 客观题学生作答记录 */
export interface ObjectiveSubmissionAnswer {
  questionId: string
  questionType: "single" | "multiple" | "judgment"
  questionContent: string
  options?: string[]
  correctAnswer: string | string[]
  studentAnswer: string | string[]
  score: number
  maxScore: number
  isCorrect: boolean
}

/** 主观题学生提交内容 */
export interface SubjectiveSubmissionContent {
  textAnswer?: string
  attachments?: SubmissionAttachment[]
}

/** 提交附件 */
export interface SubmissionAttachment {
  id: string
  name: string
  type: "document" | "code" | "video" | "image" | "other"
  url: string
}

/** 教师对主观题维度的评分记录 */
export interface RubricScoreRecord {
  rubricPointId: string
  rubricPointName: string
  weight: number
  maxScore: number
  levelId?: string
  levelName?: string
  score: number
  comment?: string
}

// ============================================================================
// 教师评分 Mock 数据
// ============================================================================

export const studentSubmissions: StudentSubmission[] = [
  {
    id: "sub-1",
    studentId: "stu-1",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    taskId: "task-1-1",
    taskName: "项目初始化与架构搭建",
    assessmentType: "objective",
    assessmentForm: "试卷",
    status: "pending",
    submittedAt: "2026-04-20 14:30:00",
    maxScore: 100,
    objectiveAnswers: [
      {
        questionId: "q-1",
        questionType: "single",
        questionContent: "React 18 中引入的并发特性主要解决什么问题？",
        options: ["性能优化", "代码复用", "状态管理", "路由控制"],
        correctAnswer: "性能优化",
        studentAnswer: "性能优化",
        score: 10,
        maxScore: 10,
        isCorrect: true,
      },
      {
        questionId: "q-2",
        questionType: "judgment",
        questionContent: "TypeScript 是 JavaScript 的超集",
        correctAnswer: "true",
        studentAnswer: "true",
        score: 10,
        maxScore: 10,
        isCorrect: true,
      },
      {
        questionId: "q-3",
        questionType: "multiple",
        questionContent: "以下哪些是常用的 React 状态管理方案？",
        options: ["Redux", "MobX", "Zustand", "jQuery"],
        correctAnswer: ["Redux", "MobX", "Zustand"],
        studentAnswer: ["Redux", "MobX", "jQuery"],
        score: 10,
        maxScore: 20,
        isCorrect: false,
      },
    ],
  },
  {
    id: "sub-2",
    studentId: "stu-2",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    taskId: "task-1-2",
    taskName: "用户认证模块开发",
    assessmentType: "subjective",
    assessmentForm: "评审",
    status: "pending",
    submittedAt: "2026-04-21 09:15:00",
    maxScore: 100,
    subjectiveContent: {
      textAnswer:
        "我使用 React + TypeScript 完成了用户认证模块的开发。主要实现了以下功能：\n\n1. 登录页面：包含表单验证、密码加密传输\n2. 注册功能：邮箱验证、密码强度检测\n3. 权限控制：基于 JWT 的鉴权机制\n4. 路由守卫：未登录用户自动跳转登录页\n\n代码仓库地址：https://github.com/stu2/auth-demo",
      attachments: [
        {
          id: "att-1",
          name: "auth-module.zip",
          type: "code",
          url: "#",
        },
        {
          id: "att-2",
          name: "项目演示视频.mp4",
          type: "video",
          url: "#",
        },
      ],
    },
  },
  {
    id: "sub-3",
    studentId: "stu-1",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    taskId: "task-1-3",
    taskName: "核心业务组件开发",
    assessmentType: "mixed",
    assessmentForm: "混合测评",
    status: "pending",
    submittedAt: "2026-04-22 16:45:00",
    maxScore: 100,
    objectiveAnswers: [
      {
        questionId: "q-4",
        questionType: "single",
        questionContent: "React 中 useMemo 的主要作用是？",
        options: ["缓存计算结果", "管理副作用", "处理事件", "路由跳转"],
        correctAnswer: "缓存计算结果",
        studentAnswer: "缓存计算结果",
        score: 20,
        maxScore: 20,
        isCorrect: true,
      },
    ],
    subjectiveContent: {
      textAnswer:
        "我开发了一个可复用的数据表格组件和图表展示组件。数据表格支持排序、筛选、分页功能；图表组件基于 ECharts 封装，支持柱状图、折线图、饼图三种类型。",
      attachments: [
        {
          id: "att-3",
          name: "components-demo.zip",
          type: "code",
          url: "#",
        },
      ],
    },
  },
  {
    id: "sub-4",
    studentId: "stu-3",
    scenarioId: "scenario-2",
    scenarioName: "RESTful API 设计与开发",
    taskId: "task-2-1",
    taskName: "API 设计规范学习",
    assessmentType: "objective",
    assessmentForm: "题库",
    status: "graded",
    submittedAt: "2026-04-18 10:00:00",
    maxScore: 100,
    objectiveTotalScore: 85,
    totalScore: 85,
    teacherComment: "整体掌握较好，但在 RESTful 状态码使用上还需加强。",
    gradedAt: "2026-04-19 11:30:00",
    gradedBy: "张老师",
    objectiveAnswers: [
      {
        questionId: "q-api-1",
        questionType: "single",
        questionContent: "HTTP GET 请求的幂等性是指什么？",
        options: [
          "多次请求结果一致",
          "请求不会被缓存",
          "请求体不能为空",
          "响应状态码固定为 200",
        ],
        correctAnswer: "多次请求结果一致",
        studentAnswer: "多次请求结果一致",
        score: 20,
        maxScore: 20,
        isCorrect: true,
      },
      {
        questionId: "q-api-2",
        questionType: "multiple",
        questionContent: "以下哪些 HTTP 状态码表示请求成功？",
        options: ["200", "201", "301", "204"],
        correctAnswer: ["200", "201", "204"],
        studentAnswer: ["200", "201"],
        score: 15,
        maxScore: 20,
        isCorrect: false,
      },
    ],
  },
  {
    id: "sub-5",
    studentId: "stu-4",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    taskId: "task-1-1",
    taskName: "项目初始化与架构搭建",
    assessmentType: "objective",
    assessmentForm: "试卷",
    status: "pending",
    submittedAt: "2026-04-22 11:20:00",
    maxScore: 100,
    objectiveAnswers: [
      {
        questionId: "q-1",
        questionType: "single",
        questionContent: "React 18 中引入的并发特性主要解决什么问题？",
        options: ["性能优化", "代码复用", "状态管理", "路由控制"],
        correctAnswer: "性能优化",
        studentAnswer: "状态管理",
        score: 0,
        maxScore: 10,
        isCorrect: false,
      },
      {
        questionId: "q-2",
        questionType: "judgment",
        questionContent: "TypeScript 是 JavaScript 的超集",
        correctAnswer: "true",
        studentAnswer: "true",
        score: 10,
        maxScore: 10,
        isCorrect: true,
      },
      {
        questionId: "q-3",
        questionType: "multiple",
        questionContent: "以下哪些是常用的 React 状态管理方案？",
        options: ["Redux", "MobX", "Zustand", "jQuery"],
        correctAnswer: ["Redux", "MobX", "Zustand"],
        studentAnswer: ["Redux", "MobX", "Zustand"],
        score: 20,
        maxScore: 20,
        isCorrect: true,
      },
    ],
  },
  {
    id: "sub-6",
    studentId: "stu-5",
    scenarioId: "scenario-1",
    scenarioName: "企业级前端项目开发实战",
    taskId: "task-1-2",
    taskName: "用户认证模块开发",
    assessmentType: "subjective",
    assessmentForm: "现场问答",
    status: "pending",
    submittedAt: "2026-04-23 09:00:00",
    maxScore: 100,
    subjectiveContent: {
      textAnswer:
        "现场答辩记录：\n\n1. 请简述 JWT 鉴权流程：答对了基本流程，但缺少 Refresh Token 机制说明。\n2. 如何防止 XSS 攻击：提到了输入过滤和 CSP，但缺少输出编码。\n3. 密码加密方案：正确回答了 bcrypt 加盐哈希。",
    },
  },
]

// 测评形式配置（用于评分页面展示）
export const assessmentFormConfig: Record<
  string,
  { label: string; category: string; icon: string; description: string }
> = {
  paper: { label: "试卷", category: "基础考核", icon: "fileText", description: "使用固定试卷进行考核" },
  question_bank: { label: "题库", category: "基础考核", icon: "database", description: "从题库选题组成测评资源" },
  quiz: { label: "随堂测", category: "基础考核", icon: "clipboardList", description: "课堂即时测验" },
  ai_qa: { label: "AI 问答", category: "智能评测", icon: "bot", description: "AI 智能问答评测" },
  random_draw: { label: "现场问答", category: "综合评估", icon: "mic", description: "从题库抽取题目，教师现场提问" },
  review: { label: "评审", category: "综合评估", icon: "clipboardCheck", description: "教师根据表现/材料给评价点打分" },
  outcome: { label: "成果评价", category: "综合评估", icon: "trophy", description: "对学习成果进行综合评价" },
  peer: { label: "学生互评", category: "综合评估", icon: "users", description: "学生之间相互评价" },
  defense: { label: "答辩", category: "互动评价", icon: "presentation", description: "学生答辩，教师评分" },
  debate: { label: "辩论", category: "互动评价", icon: "messageSquare", description: "学生辩论表现评价" },
  presentation: { label: "汇报", category: "互动评价", icon: "presentation", description: "学生汇报展示评价" },
  practical: { label: "现场实操", category: "互动评价", icon: "wrench", description: "现场实际操作考核" },
  roleplay: { label: "角色扮演", category: "互动评价", icon: "userCog", description: "角色扮演情境考核" },
}
