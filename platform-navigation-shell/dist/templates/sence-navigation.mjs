export const platformCatalog = [
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
];
export const senceNavigationTemplate = {
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
            id: "portal-home",
            label: "门户首页",
            href: "/dashboard",
            icon: "home",
            matchers: ["/dashboard"],
        },
        {
            id: "workspace",
            label: "我的服务台",
            href: "/approvals",
            icon: "briefcase",
            matchers: ["/approvals$"],
        },
        {
            id: "apps",
            label: "应用服务中心",
            href: "/",
            icon: "layoutGrid",
            matchers: ["/", "/batches", "/workflows", "/positions", "/students", "/scenarios"],
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
            id: "scene-evaluation",
            label: "场景任务评价",
            icon: "clipboardCheck",
            href: "/approvals/grading",
            matchers: ["/approvals/grading"],
        },
    ],
};
export const sceneNavigationTemplate = senceNavigationTemplate;
