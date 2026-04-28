"use client"

import { Copy, Eye, MoreHorizontal, Send, Trash2, Undo2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
}: ScenarioListProps) {
  if (scenarios.length === 0) return null

  const allSelected = scenarios.length > 0 && scenarios.every((s) => selectedIds.includes(s.id))
  const someSelected = scenarios.some((s) => selectedIds.includes(s.id)) && !allSelected

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
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
          const canSubmit = scenario.status === "draft" || scenario.status === "rejected"
          const canWithdraw = scenario.status === "pending"
          const canDelete = scenario.status === "draft" || scenario.status === "rejected"
          const isSelected = selectedIds.includes(scenario.id)

          return (
            <div
              key={scenario.id}
              className={cn(
                "grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50 transition-colors group",
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
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href={`/scenarios/${scenario.id}/edit`} className="flex items-center cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        查看
                      </Link>
                    </DropdownMenuItem>
                    {onClone && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onClone(scenario)
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        克隆
                      </DropdownMenuItem>
                    )}
                    {canSubmit && onSubmitApproval && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onSubmitApproval(scenario)
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        提交审核
                      </DropdownMenuItem>
                    )}
                    {canWithdraw && onWithdrawApproval && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onWithdrawApproval(scenario)
                        }}
                      >
                        <Undo2 className="mr-2 h-4 w-4" />
                        撤回审批
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {canDelete && onDelete && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(scenario)
                        }}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
