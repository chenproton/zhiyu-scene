"use client"

import { FolderKanban, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { batches, approvalWorkflows, professions } from "@/lib/mock-data"

export default function BatchesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">批次管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理场景建设批次，关联审批流程</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建批次
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>新建批次</DialogTitle>
              <DialogDescription>
                创建新的场景建设批次，并关联审批流程。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="batchName">批次名称</Label>
                <Input id="batchName" placeholder="例如：2026春季电商实训场景开发" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">所属院系</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="选择院系" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dept-1">信息工程系</SelectItem>
                      <SelectItem value="dept-2">经济管理系</SelectItem>
                      <SelectItem value="dept-3">艺术设计系</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profession">专业方向</Label>
                  <Select>
                    <SelectTrigger id="profession">
                      <SelectValue placeholder="选择专业（可选）" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workflow">关联审批流 <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger id="workflow">
                    <SelectValue placeholder="选择审批流程" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvalWorkflows.map((wf) => (
                      <SelectItem key={wf.id} value={wf.id}>
                        <div>
                          <span>{wf.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({wf.steps.length}步)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  批次内所有场景将强制使用相同的审批流程
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>创建批次</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Batches table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            批次列表
          </CardTitle>
          <CardDescription>共 {batches.length} 个批次</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>批次名称</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>专业方向</TableHead>
                <TableHead>审批流程</TableHead>
                <TableHead>场景数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.departmentName}</TableCell>
                  <TableCell>{batch.professionName || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {batch.workflowName}
                    </Badge>
                  </TableCell>
                  <TableCell>{batch.scenarioCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        batch.status === "open"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }
                    >
                      {batch.status === "open" ? "开放中" : "已截稿"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {batch.status === "open" ? "截稿" : "重新开放"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
