"use client"

import { useState } from "react"
import {
  BookMarked,
  Lightbulb,
  Award,
  Link2,
  Video,
  Image,
  FileText,
  ExternalLink,
  X,
  Minimize2,
  Maximize2,
  GraduationCap,
  Target,
  ChevronUp,
  ChevronDown,
  Eye,
  File,
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Package,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { granularLessons } from "./task-data"
import type { SimulatedTask, KnowledgePointItem, AbilityPointItem, ResourceItem } from "./types"

const resourceTypeIcons: Record<string, React.ReactNode> = {
  link: <ExternalLink className="h-4 w-4 text-blue-500" />,
  document: <FileText className="h-4 w-4 text-blue-500" />,
  video: <Video className="h-4 w-4 text-rose-500" />,
  image: <Image className="h-4 w-4 text-green-500" />,
  tool: <ExternalLink className="h-4 w-4 text-cyan-500" />,
  spreadsheet: <FileText className="h-4 w-4 text-teal-500" />,
  audio: <Video className="h-4 w-4 text-violet-500" />,
  archive: <FileText className="h-4 w-4 text-orange-500" />,
  venue: <GraduationCap className="h-4 w-4 text-indigo-500" />,
  facility: <GraduationCap className="h-4 w-4 text-gray-500" />,
  software: <ExternalLink className="h-4 w-4 text-pink-500" />,
  other: <File className="h-4 w-4 text-gray-500" />,
}

const resourceTypeColors: Record<string, string> = {
  document: "bg-blue-50 text-blue-600 border-blue-200",
  spreadsheet: "bg-teal-50 text-teal-600 border-teal-200",
  image: "bg-green-50 text-green-600 border-green-200",
  link: "bg-cyan-50 text-cyan-600 border-cyan-200",
  audio: "bg-violet-50 text-violet-600 border-violet-200",
  video: "bg-rose-50 text-rose-600 border-rose-200",
  archive: "bg-orange-50 text-orange-600 border-orange-200",
  tool: "bg-cyan-50 text-cyan-600 border-cyan-200",
  venue: "bg-indigo-50 text-indigo-600 border-indigo-200",
  facility: "bg-gray-50 text-gray-600 border-gray-200",
  software: "bg-pink-50 text-pink-600 border-pink-200",
  other: "bg-gray-50 text-gray-600 border-gray-200",
}

const resourceTypeLabels: Record<string, string> = {
  link: "链接",
  document: "文档",
  video: "视频",
  image: "图片",
  tool: "工具",
  spreadsheet: "表格",
  audio: "音频",
  archive: "压缩包",
  venue: "场地",
  facility: "设备",
  software: "软件",
  other: "其他",
}

const requiredLevelColors: Record<string, string> = {
  "精通": "border-green-200 text-green-700 bg-green-50",
  "熟练": "border-blue-200 text-blue-700 bg-blue-50",
  "掌握": "border-cyan-200 text-cyan-700 bg-cyan-50",
  "理解": "border-amber-200 text-amber-700 bg-amber-50",
  "了解": "border-gray-200 text-gray-700 bg-gray-50",
}

interface LearningFloatProps {
  task: SimulatedTask
  defaultExpanded?: boolean
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export function LearningFloat({ task, defaultExpanded = true }: LearningFloatProps) {
  const [minimized, setMinimized] = useState(!defaultExpanded)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailType, setDetailType] = useState<"knowledge" | "ability" | "resource" | null>(null)
  const [detailItem, setDetailItem] = useState<KnowledgePointItem | AbilityPointItem | ResourceItem | null>(null)

  // AI 问答状态
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `你好！我是你的 AI 学习助手。关于「${task.name}」这个任务，你可以问我任何问题，比如：\n\n· 这个任务的重点是什么？\n· 某个知识点怎么理解？\n· 有哪些学习建议？`,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const openDetail = (type: "knowledge" | "ability" | "resource", item: KnowledgePointItem | AbilityPointItem | ResourceItem) => {
    setDetailType(type)
    setDetailItem(item)
    setDetailOpen(true)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: inputValue.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const replies = [
        `这是一个很好的问题！关于「${task.name}」，建议你重点关注任务说明中的核心目标，并结合学习资源中的文档进行预习。`,
        `针对这个知识点，你可以在学习助手的「知识点」Tab 中找到相关内容，点击可以查看详细说明和关联颗粒课。`,
        `建议你先阅读任务背景，理解业务场景后再开始实践。遇到困难可以随时在「资源」Tab 中查阅配套材料。`,
        `根据任务要求，你需要特别注意测评标准中的准确性、完整性和规范性三个方面。加油！`,
      ]
      const reply = replies[Math.floor(Math.random() * replies.length)]
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: reply }])
      setIsTyping(false)
    }, 1200)
  }

  // 最小化状态：底部输入框条
  if (minimized) {
    const handleQuickAsk = () => {
      if (!inputValue.trim()) return
      handleSendMessage()
    }

    return (
      <>
        <div className="fixed bottom-4 right-6 z-50 w-[420px]">
          <div className="bg-white border rounded-xl shadow-lg flex items-center gap-2 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="随时向 AI 助手提问..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleQuickAsk()
                }
              }}
              onFocus={() => setMinimized(false)}
            />
            <Button
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={handleQuickAsk}
              disabled={!inputValue.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0 text-gray-400 hover:text-gray-600"
              onClick={() => setMinimized(false)}
              title="展开学习助手"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <DetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          type={detailType}
          item={detailItem}
        />
      </>
    )
  }

  // ============================================================================
  // AI 问答内容
  // ============================================================================
  const aiChatContent = (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "assistant" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  msg.role === "assistant"
                    ? "bg-gray-50 border border-gray-200 text-gray-700"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg px-3 py-2 bg-gray-50 border border-gray-200">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-3 border-t shrink-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="输入问题，AI 助手为你解答..."
            className="min-h-[44px] text-sm resize-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button size="sm" className="shrink-0 self-end h-10 w-10 p-0" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  // ============================================================================
  // 普通浮窗内容（列表形式）
  // ============================================================================
  const compactPanelContent = (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">学习助手</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setFullscreenOpen(true)} title="全屏展开">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setMinimized(true)} title="最小化">
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ai" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-2 mt-2 shrink-0 grid grid-cols-4">
          <TabsTrigger value="ai" className="text-xs gap-1"><Bot className="h-3 w-3" />AI 问答</TabsTrigger>
          <TabsTrigger value="knowledge" className="text-xs gap-1"><Lightbulb className="h-3 w-3" />知识点</TabsTrigger>
          <TabsTrigger value="ability" className="text-xs gap-1"><Award className="h-3 w-3" />能力点</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs gap-1"><Link2 className="h-3 w-3" />资源</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="m-0 flex flex-col h-[calc(100%-40px)]">
          {aiChatContent}
        </TabsContent>

        <TabsContent value="knowledge" className="m-0 px-3 py-3 overflow-y-auto">
          <div className="space-y-2">
            {task.knowledgePoints.map((kp) => (
              <div key={kp.id} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-amber-50 cursor-pointer border border-transparent hover:border-amber-200 transition-colors"
                onClick={() => openDetail("knowledge", kp)}>
                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{kp.name}</span>
                    {kp.code && <Badge variant="outline" className="text-[10px] h-4 px-1">{kp.code}</Badge>}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{kp.description}</div>
                  {kp.category && <Badge variant="secondary" className="mt-1 text-[10px] h-4">{kp.category}</Badge>}
                </div>
                <Eye className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ability" className="m-0 px-3 py-3 overflow-y-auto">
          <div className="space-y-2">
            {task.abilityPoints.map((ap) => (
              <div key={ap.id} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-purple-50 cursor-pointer border border-transparent hover:border-purple-200 transition-colors"
                onClick={() => openDetail("ability", ap)}>
                <Award className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{ap.name}</span>
                    {ap.code && <Badge variant="outline" className="text-[10px] h-4 px-1">{ap.code}</Badge>}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">{ap.description}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {ap.domain && <Badge variant="secondary" className="text-[10px] h-4">{ap.domain}</Badge>}
                    {ap.requiredLevel && (
                      <Badge variant="outline" className={`text-[10px] h-4 ${requiredLevelColors[ap.requiredLevel] || ""}`}>
                        {ap.requiredLevel}
                      </Badge>
                    )}
                  </div>
                </div>
                <Eye className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="m-0 px-3 py-3 overflow-y-auto">
          <div className="space-y-2">
            {task.resources.map((res) => (
              <div key={res.id} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-cyan-50 cursor-pointer border border-transparent hover:border-cyan-200 transition-colors"
                onClick={() => openDetail("resource", res)}>
                <div className="shrink-0 mt-0.5">{resourceTypeIcons[res.type] || <FileText className="h-4 w-4 text-gray-400" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{res.name}</div>
                  <div className="text-xs text-gray-500 line-clamp-2">{res.description}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-[10px] h-4">{resourceTypeLabels[res.type] || res.type}</Badge>
                    {res.size && <span className="text-[10px] text-gray-400">{res.size}</span>}
                  </div>
                </div>
                <Eye className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  // ============================================================================
  // 全屏面板内容（卡片网格形式）
  // ============================================================================
  const fullscreenPanelContent = (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-blue-500" />
          <span className="text-base font-medium">学习助手</span>
          <Badge variant="outline" className="text-xs">
            {task.scenarioName}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setFullscreenOpen(false)} title="退出全屏">
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="ai" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-3 shrink-0 grid grid-cols-4 h-10">
          <TabsTrigger value="ai" className="text-sm gap-1.5"><Bot className="h-4 w-4" />AI 问答</TabsTrigger>
          <TabsTrigger value="knowledge" className="text-sm gap-1.5"><Lightbulb className="h-4 w-4" />知识点</TabsTrigger>
          <TabsTrigger value="ability" className="text-sm gap-1.5"><Award className="h-4 w-4" />能力点</TabsTrigger>
          <TabsTrigger value="resources" className="text-sm gap-1.5"><Link2 className="h-4 w-4" />资源</TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="ai" className="m-0 h-full">
            {aiChatContent}
          </TabsContent>

          <TabsContent value="knowledge" className="m-0 h-full overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {task.knowledgePoints.map((kp) => {
                const relatedLessons = kp.granularLessons?.map((gid) => granularLessons.find((g) => g.id === gid)).filter(Boolean) || []
                return (
                  <Card
                    key={kp.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-amber-300"
                    onClick={() => openDetail("knowledge", kp)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="p-1.5 bg-amber-50 rounded-lg shrink-0">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{kp.name}</p>
                        {kp.code && (
                          <Badge variant="outline" className="text-[10px] h-4 font-mono mt-0.5">
                            {kp.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{kp.description}</p>
                    {kp.category && (
                      <Badge variant="secondary" className="text-[10px] h-4">
                        {kp.category}
                      </Badge>
                    )}
                    {relatedLessons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {relatedLessons.slice(0, 3).map((gl) => (
                          <Badge key={gl!.id} variant="outline" className="text-[10px] h-4">
                            <Sparkles className="h-2.5 w-2.5 mr-0.5 text-blue-400" />
                            {gl!.name}
                          </Badge>
                        ))}
                        {relatedLessons.length > 3 && (
                          <Badge variant="outline" className="text-[10px] h-4">+{relatedLessons.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="ability" className="m-0 h-full overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {task.abilityPoints.map((ap) => (
                <Card
                  key={ap.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-300"
                  onClick={() => openDetail("ability", ap)}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 bg-purple-50 rounded-lg shrink-0">
                      <Award className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{ap.name}</p>
                      {ap.code && (
                        <Badge variant="outline" className="text-[10px] h-4 font-mono mt-0.5">
                          {ap.code}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ap.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {ap.domain && (
                      <Badge variant="secondary" className="text-[10px] h-4">{ap.domain}</Badge>
                    )}
                    {ap.requiredLevel && (
                      <Badge variant="outline" className={`text-[10px] h-4 ${requiredLevelColors[ap.requiredLevel] || ""}`}>
                        {ap.requiredLevel}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="m-0 h-full overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {task.resources.map((res) => (
                <Card
                  key={res.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => openDetail("resource", res)}
                >
                  {/* 预览图区域 */}
                  <div className="relative h-24 bg-gray-50 border-b border-gray-100 overflow-hidden">
                    {res.type === "image" ? (
                      <img src={res.url || "/placeholder.svg"} alt={res.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className={cn("p-2.5 rounded-xl border", resourceTypeColors[res.type] || "bg-gray-50 border-gray-200")}>
                          {resourceTypeIcons[res.type] || <Package className="h-6 w-6 text-gray-400" />}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5">
                      <Badge className={cn("text-[9px] border", resourceTypeColors[res.type] || "")}>
                        {resourceTypeLabels[res.type] || res.type}
                      </Badge>
                    </div>
                  </div>
                  {/* 信息区域 */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate mb-1">{res.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{res.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{res.size || "—"}</span>
                      <span className="flex items-center gap-0.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3 w-3" />查看详情
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )

  return (
    <>
      {/* 普通浮窗 — 高度增加一倍 */}
      <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[85vh] flex flex-col">
        <Card className="shadow-xl border overflow-hidden flex flex-col h-[600px]">
          {compactPanelContent}
        </Card>
      </div>

      {/* 全屏弹窗 */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-[95vw] sm:max-h-[95vh] h-[95vh] w-[95vw] p-0 flex flex-col gap-0">
          <div className="flex-1 min-h-0 overflow-hidden">
            {fullscreenPanelContent}
          </div>
        </DialogContent>
      </Dialog>

      <DetailDialog open={detailOpen} onOpenChange={setDetailOpen} type={detailType} item={detailItem} />
    </>
  )
}

// ============================================================================
// 详情弹窗组件
// ============================================================================
function DetailDialog({
  open,
  onOpenChange,
  type,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "knowledge" | "ability" | "resource" | null
  item: KnowledgePointItem | AbilityPointItem | ResourceItem | null
}) {
  if (!item || !type) return null

  if (type === "knowledge") {
    const kp = item as KnowledgePointItem
    const relatedLessons = kp.granularLessons?.map((gid) => granularLessons.find((g) => g.id === gid)).filter(Boolean) || []

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              知识点详情
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">知识点名称</div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{kp.name}</p>
                {kp.code && <Badge variant="outline" className="text-[10px] h-5 font-mono">{kp.code}</Badge>}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">知识点描述</div>
              <p className="text-sm text-gray-700">{kp.description}</p>
            </div>
            {kp.category && (
              <div>
                <div className="text-xs text-gray-500 mb-1">所属分类</div>
                <Badge variant="secondary">{kp.category}</Badge>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500 mb-1">关联颗粒课 ({relatedLessons.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {relatedLessons.length > 0 ? (
                  relatedLessons.map((gl) => (
                    <Badge key={gl!.id} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                      <Sparkles className="h-3 w-3 mr-1 text-blue-400" />
                      {gl!.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">暂无关联颗粒课</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (type === "ability") {
    const ap = item as AbilityPointItem
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              能力点详情
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">能力点名称</div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-semibold">{ap.name}</p>
                {ap.code && <Badge variant="outline" className="text-[10px] h-5 font-mono">{ap.code}</Badge>}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">能力点描述</div>
              <p className="text-sm text-gray-700">{ap.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ap.domain && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">所属领域</div>
                  <Badge variant="secondary">{ap.domain}</Badge>
                </div>
              )}
              {ap.category && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">分类</div>
                  <Badge variant="outline">{ap.category}</Badge>
                </div>
              )}
            </div>
            {ap.requiredLevel && (
              <div>
                <div className="text-xs text-gray-500 mb-1">掌握程度要求</div>
                <Badge variant="outline" className={requiredLevelColors[ap.requiredLevel] || "border-gray-200 text-gray-700 bg-gray-50"}>
                  {ap.requiredLevel}
                </Badge>
              </div>
            )}
            {ap.proficiencyDesc && (
              <div>
                <div className="text-xs text-gray-500 mb-1">熟练程度描述</div>
                <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 rounded-lg p-3">
                  {ap.proficiencyDesc}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const res = item as ResourceItem
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-cyan-500" />
            资源详情
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {resourceTypeIcons[res.type] || <FileText className="h-5 w-5 text-gray-400" />}
            </div>
            <div>
              <p className="text-sm font-semibold">{res.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">{resourceTypeLabels[res.type] || res.type}</Badge>
                {res.size && <span className="text-xs text-gray-400">{res.size}</span>}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">资源描述</div>
            <p className="text-sm text-gray-700">{res.description}</p>
          </div>
          {res.url && (
            <div>
              <div className="text-xs text-gray-500 mb-1">访问链接</div>
              <p className="text-sm text-blue-600 break-all">{res.url}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
