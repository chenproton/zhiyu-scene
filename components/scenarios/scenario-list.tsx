"use client"

import { Copy, Eye, GitBranch, Pencil, Send, Trash2, Undo2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Scenario } from "@/lib/mock-data"

const statusConfig = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-500" },
  pending: { label: "审批中", className: "bg-yellow-50 text-yellow-600" },
  approved: { label: "已通过", className: "bg-blue-50 text-blue-600" },
  rejected: { label: "已驳回", className: "bg-red-50 text-red-500" },
  published: { label: "已发布", className: "bg-green-50 text-green-600" },
}

interface ScenarioListProps {
  scenarios: Scenario[]
  selectedIds?: string[]
  onSelectId?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onClone?: (scenario: Scenario) => void
  onDelete?: (scenario: Scenario) => void
  onSubmitApproval?: (scenario: Scenario) => void
  onWithdrawApproval?: (scenario: Scenario) => void
  onViewRejectReason?: (scenario: Scenario) => void
  className?: string
}

export function ScenarioList({
  scenarios,
  selectedIds = [],
  onSelectId,
  onSelectAll,
  onClone,
  onDelete,
  onSubmitApproval,
  onWithdrawApproval,
  onViewRejectReason,
  className,
}: ScenarioListProps) {
  if (scenarios.length === 0) return null

  const allSelected = scenarios.length > 0 && scenarios.every((s) => selectedIds.includes(s.id))
  const someSelected = scenarios.some((s) => selectedIds.includes(s.id)) && !allSelected

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white overflow-hidden", className)}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 border-b border-slate-100 items-center">
        <div className="col-span-1 flex justify-center">
          <Checkbox
            checked={someSelected ? "indeterminate" : allSelected}
            onCheckedChange={(checked) => onSelectAll?.(checked === true)}
            aria-label="全选"
          />
        </div>
        <div className="col-span-2">场景名称</div>
        <div className="col-span-1">场景编码</div>
        <div className="col-span-1 text-center">版本</div>
        <div className="col-span-1">所属岗位</div>
        <div className="col-span-2">所属批次分组</div>
        <div className="col-span-1">创建人</div>
        <div className="col-span-1">发布时间</div>
        <div className="col-span-1 text-center">场景任务数量</div>
        <div className="col-span-1 text-right">操作</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-slate-100">
        {scenarios.map((scenario) => {
          const status = statusConfig[scenario.status]
          const isSelected = selectedIds.includes(scenario.id)

          return (
            <div
              key={scenario.id}
              className={cn(
                "grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50 transition-colors group relative",
                isSelected && "bg-primary/5"
              )}
            >
              <div className="col-span-1 flex justify-center">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectId?.(scenario.id, checked === true)}
                  aria-label={`选择 ${scenario.name}`}
                />
              </div>
              <div className="col-span-2">
                <Link href={`/scenarios/${scenario.id}/edit`} className="block">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1 hover:text-primary">{scenario.name}</p>
                </Link>
                <Badge variant="secondary" className={cn("text-xs mt-1", status.className)}>
                  {status.label}
                </Badge>
              </div>
              <div className="col-span-1 text-sm text-slate-600 truncate">{scenario.code}</div>
              <div className="col-span-1 text-center text-sm text-slate-600">{scenario.version}</div>
              <div className="col-span-1 text-sm text-slate-600 truncate">{scenario.positionName || "-"}</div>
              <div className="col-span-2 text-sm text-slate-600 truncate">{scenario.batchName || "-"}</div>
              <div className="col-span-1 text-xs text-slate-500 truncate">{scenario.creatorName}</div>
              <div className="col-span-1 text-xs text-slate-500 truncate">{scenario.publishTime || "-"}</div>
              <div className="col-span-1 text-center">
                <Link
                  href={`/scenarios/${scenario.id}/edit/tasks`}
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {scenario.tasks.length}
                </Link>
              </div>
              <div className="col-span-1 text-right relative">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm z-10 px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                    <Link href={`/scenarios/${scenario.id}/edit`}>
                      <Eye className="mr-1 h-3 w-3" />
                      查看详情
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                    <Link href={`/scenarios/${scenario.id}/edit`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      编辑
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                    <Link href={`/scenarios/${scenario.id}/edit/tasks`}>
                      <GitBranch className="mr-1 h-3 w-3" />
                      编排任务
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClone?.(scenario)
                    }}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    克隆场景
                  </Button>
                  {scenario.status === "draft" && onSubmitApproval && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSubmitApproval(scenario)
                      }}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      提交审批
                    </Button>
                  )}
                  {scenario.status === "pending" && onWithdrawApproval && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onWithdrawApproval(scenario)
                      }}
                    >
                      <Undo2 className="mr-1 h-3 w-3" />
                      撤回审批
                    </Button>
                  )}
                  {scenario.status === "rejected" && onViewRejectReason && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewRejectReason(scenario)
                      }}
                    >
                      <MessageSquare className="mr-1 h-3 w-3" />
                      查看驳回原因
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(scenario)
                      }}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      删除
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
