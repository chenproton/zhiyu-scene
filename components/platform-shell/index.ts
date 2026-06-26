export { PlatformShell, PlatformSideNav, PlatformTopNav } from "./PlatformShell"

export {
  platformIconMap,
  resolvePlatformIcon,
} from "./icons"

import type {
  PlatformCatalogItem,
  PlatformNavigationConfig,
  SideNavChild,
  SideNavItem,
  TopNavItem,
  UserMenuItem,
} from "./config"

export type {
  PlatformCatalogItem,
  PlatformNavigationConfig,
  SideNavChild,
  SideNavItem,
  TopNavItem,
  UserMenuItem,
}

export type {
  PlatformIcon,
  PlatformIconKey,
} from "./icons"

// Navigation template (migrated from platform-navigation-shell/templates/sence-navigation.ts)
export const platformCatalog: PlatformCatalogItem[] = [
  { id: "career", label: "职业岗位学习平台", icon: "briefcase" },
  { id: "scene", label: "实践场景学习平台", icon: "layers3" },
  { id: "ability", label: "能力测评认证平台", icon: "badgeCheck" },
  { id: "course", label: "数字课程服务平台", icon: "bookOpen" },
  { id: "ai", label: "AI服务平台", icon: "sparkles" },
  { id: "resource", label: "教学资源共享服务平台", icon: "share2" },
  { id: "research", label: "教科研服务平台", icon: "fileText" },
  { id: "affairs", label: "教务服务平台", icon: "calendar" },
  { id: "decision", label: "决策支持平台", icon: "lineChart" },
  { id: "employment", label: "就业服务平台", icon: "graduationCap" },
]

export const senceNavigationTemplate: PlatformNavigationConfig = {
  brandTitle: "场景化数智教学服务平台",
  currentPlatformId: "scene",
  currentPlatformLabel: "实践场景学习平台",
  brandHref: "/",
  brandIcon: "settings",
  platformIcon: "settings",
  sideBackHref: "/",
  currentUserName: "管理员",
  currentUserRoleLabel: "实践场景学习平台",
  showCurrentTime: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    {
      id: "portal",
      label: "门户首页",
      href: "http://111.170.170.202:3001/portal",
      icon: "home",
    },
    {
      id: "workspace",
      label: "我的服务台",
      href: "http://111.170.170.202:3001/portal/workspace",
      icon: "briefcase",
    },
    {
      id: "apps",
      label: "应用服务中心",
      href: "http://111.170.170.202:3001/portal/apps",
      icon: "layoutGrid",
    },
  ],
  sideNavItems: [
    {
      id: "scene-construction",
      label: "场景建设管理",
      icon: "layoutGrid",
      children: [
        { id: "scene-resource", label: "场景资源管理", href: "/", matchers: ["/"] },
        { id: "batch-group", label: "批次分组管理", href: "/batches", matchers: ["/batches"] },
        { id: "approval-workflow", label: "审批流程管理", href: "/workflows", matchers: ["/workflows"] },
        { id: "resource-approval", label: "资源审批管理", href: "/approvals", matchers: ["/approvals$"] },
      ],
    },
    {
      id: "heart-scenes",
      label: "心仪岗位场景",
      icon: "heart",
      href: "/heart-scenes",
      matchers: ["/heart-scenes"],
    },
    {
      id: "teacher-grading",
      label: "教师任务评分",
      icon: "clipboardCheck",
      href: "/approvals/grading",
      matchers: ["/approvals/grading$"],
    },
    {
      id: "student-assessment",
      label: "学生任务测评",
      icon: "graduationCap",
      href: "/student.html",
      matchers: ["/student.html"],
    },
    {
      id: "ai-assisted",
      label: "AI 辅助功能",
      icon: "sparkles",
      children: [
        { id: "ai-assisted-scenarios", label: "场景资源编辑(AI辅助)", href: "/ai-assisted", matchers: ["/ai-assisted"] },
        { id: "ai-assisted-batch-create", label: "批量场景创建(智能体)", href: "/ai-first/scenarios/scenario-1/edit", matchers: ["/ai-first/scenarios/scenario-1/edit"] },
        { id: "ai-assisted-grading", label: "教师场景评分(AI辅助)", href: "/ai-first/approvals/grading", matchers: ["/ai-first/approvals/grading$"] },
        { id: "ai-assisted-simulation", label: "学生场景学习(AI辅助)", href: "/student_3.html", matchers: ["/student_3.html", "/ai-first/approvals/grading/simulation"] },
      ],
    },
  ],
}

export const sceneNavigationTemplate = senceNavigationTemplate
