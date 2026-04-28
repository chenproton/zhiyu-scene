"use client"

import { Check, CheckSquare, Eye, X } from "lucide-react"
import Link from "next/link"
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
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { approvalItems } from "@/lib/mock-data"

const statusConfig = {
  pending: { label: "待审批", className: "bg-yellow-50 text-yellow-600" },
  approved: { label: "已通过", className: "bg-green-50 text-green-600" },
  rejected: { label: "已驳回", className: "bg-red-50 text-red-500" },
}

export default function ApprovalsPage() {
  const [selectedItem, setSelectedItem] = useState<typeof approvalItems[0] | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectComment, setRejectComment] = useState("")

  const pendingItems = approvalItems.filter(a => a.status === "pending")
  const processedItems = approvalItems.filter(a => a.status !== "pending")

  const handleApprove = (item: typeof approvalItems[0]) => {
    // Approval logic would go here
    console.log("Approved:", item.id)
  }

  const handleReject = () => {
    // Reject logic would go here
    console.log("Rejected:", selectedItem?.id, "Comment:", rejectComment)
    setIsRejectDialogOpen(false)
    setRejectComment("")
    setSelectedItem(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">审批中心</h1>
        <p className="text-sm text-gray-500 mt-1">审核场景和批次的提交申请</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            待审批
            {pendingItems.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-yellow-100 text-yellow-700">
                {pendingItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed">已处理</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingItems.length > 0 ? (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={statusConfig[item.status].className}>
                            {statusConfig[item.status].label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            步骤 {item.currentStep}/{item.totalSteps}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg">{item.scenarioName}</h3>
                        <p className="text-sm text-gray-500 mt-1">批次: {item.batchName}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          <span>提交人: {item.submitterName}</span>
                          <span>提交时间: {item.submittedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/scenarios/${item.scenarioId}/edit`}>
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsRejectDialogOpen(true)
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          驳回
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(item)}>
                          <Check className="mr-2 h-4 w-4" />
                          通过
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">暂无待审批项</h3>
                <p className="text-sm text-gray-500 mt-1">所有提交的场景都已处理完毕</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processed" className="mt-6">
          {processedItems.length > 0 ? (
            <div className="space-y-4">
              {processedItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={statusConfig[item.status].className}>
                            {statusConfig[item.status].label}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-800">{item.scenarioName}</h3>
                        <p className="text-sm text-gray-500 mt-1">批次: {item.batchName}</p>
                        {item.comments && (
                          <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                            审批意见: {item.comments}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/scenarios/${item.scenarioId}/edit`}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">暂无已处理记录</h3>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回场景</DialogTitle>
            <DialogDescription>
              请填写驳回原因，建设者将收到修改通知。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="请详细说明需要修改的内容..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectComment.trim()}
            >
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
