"use client"

import { ArrowRight, GitBranch, MoreHorizontal, Pencil, Plus, Trash2, User } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { approvalWorkflows } from "@/lib/mock-data"

export default function WorkflowsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">审批流程管理</h1>
          <p className="text-sm text-gray-500 mt-1">预设校内审批流模板，供批次关联使用</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建流程
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>新建审批流程</DialogTitle>
              <DialogDescription>
                创建新的审批流程模板，定义审批步骤和角色。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="workflowName">流程名称</Label>
                <Input id="workflowName" placeholder="例如：单级教研组长审批" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">流程说明</Label>
                <Textarea 
                  id="description" 
                  placeholder="描述该流程的适用场景和审批规则..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>审批步骤</Label>
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center">1</Badge>
                    <Input placeholder="步骤名称" className="flex-1" />
                    <Input placeholder="审批角色" className="w-32" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    添加步骤
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>创建流程</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflow cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {approvalWorkflows.map((workflow) => (
          <Card key={workflow.id} className="group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <CardDescription className="text-xs">
                      创建于 {workflow.createdAt}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{workflow.description}</p>
              
              {/* Steps visualization */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="flex flex-col items-center min-w-[100px]">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700">{step.approverRole}</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{step.name}</span>
                    </div>
                    {index < workflow.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <Badge variant="outline" className="text-xs">
                  {workflow.steps.length} 个审批步骤
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
