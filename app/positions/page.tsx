"use client"

import { ChevronDown, ChevronRight, Edit2, Plus, Save, Trash2, X } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { professions, positionAbilities, type PositionAbility } from "@/lib/mock-data"

export default function PositionsPage() {
  const [expandedProfessions, setExpandedProfessions] = useState<string[]>(["prof-1"])
  const [selectedPosition, setSelectedPosition] = useState<string | null>("pos-1")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAbility, setEditingAbility] = useState<PositionAbility | null>(null)
  
  // Form state for new/edit ability
  const [abilityForm, setAbilityForm] = useState({
    name: "",
    description: "",
    weight: 10,
    category: "技术能力",
  })

  const toggleProfession = (profId: string) => {
    setExpandedProfessions((prev) =>
      prev.includes(profId) ? prev.filter((id) => id !== profId) : [...prev, profId]
    )
  }

  const getPositionAbilities = (positionId: string) => {
    return positionAbilities.filter((a) => a.positionId === positionId)
  }

  const selectedPositionData = professions
    .flatMap((p) => p.positions)
    .find((p) => p.id === selectedPosition)

  const abilities = selectedPosition ? getPositionAbilities(selectedPosition) : []
  const totalWeight = abilities.reduce((sum, a) => sum + a.weight, 0)

  const handleAddAbility = () => {
    setAbilityForm({ name: "", description: "", weight: 10, category: "技术能力" })
    setIsAddDialogOpen(true)
  }

  const handleEditAbility = (ability: PositionAbility) => {
    setEditingAbility(ability)
    setAbilityForm({
      name: ability.name,
      description: ability.description,
      weight: ability.weight,
      category: ability.category,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveAbility = () => {
    // In real app, would save to backend
    console.log("Saving ability:", abilityForm)
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
  }

  const categories = ["技术能力", "工程能力", "软技能", "业务能力", "分析能力", "运营能力", "营销能力", "表达能力"]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      技术能力: "bg-blue-100 text-blue-700",
      工程能力: "bg-purple-100 text-purple-700",
      软技能: "bg-green-100 text-green-700",
      业务能力: "bg-orange-100 text-orange-700",
      分析能力: "bg-cyan-100 text-cyan-700",
      运营能力: "bg-pink-100 text-pink-700",
      营销能力: "bg-amber-100 text-amber-700",
      表达能力: "bg-indigo-100 text-indigo-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">岗位能力点管理</h1>
        <p className="text-gray-500 mt-1">为每个岗位配置能力评估指标，用于学生胜任度分析</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Position Tree */}
        <div className="col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">岗位列表</CardTitle>
              <CardDescription>选择岗位配置能力点</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {professions.map((profession) => (
                  <div key={profession.id}>
                    <button
                      onClick={() => toggleProfession(profession.id)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      {expandedProfessions.includes(profession.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-700">{profession.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {profession.positions.length} 岗位
                      </Badge>
                    </button>
                    {expandedProfessions.includes(profession.id) && (
                      <div className="bg-gray-50">
                        {profession.positions.map((position) => {
                          const posAbilities = getPositionAbilities(position.id)
                          return (
                            <button
                              key={position.id}
                              onClick={() => setSelectedPosition(position.id)}
                              className={cn(
                                "flex items-center gap-2 w-full px-4 py-2.5 pl-10 text-left transition-colors",
                                selectedPosition === position.id
                                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                                  : "hover:bg-gray-100 text-gray-600"
                              )}
                            >
                              <span className="text-sm">{position.name}</span>
                              <span className="ml-auto text-xs text-gray-400">
                                {posAbilities.length} 能力点
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Ability Configuration */}
        <div className="col-span-8">
          {selectedPositionData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedPositionData.name}</CardTitle>
                    <CardDescription>
                      配置该岗位的能力评估指标，权重总和应为 100%
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddAbility}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加能力点
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weight Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">权重分配总览</span>
                    <span className={cn(
                      "text-sm font-bold",
                      totalWeight === 100 ? "text-green-600" : "text-red-600"
                    )}>
                      {totalWeight}% / 100%
                    </span>
                  </div>
                  <Progress value={totalWeight} className="h-2" />
                  {totalWeight !== 100 && (
                    <p className="text-xs text-red-500 mt-2">
                      权重总和应为 100%，当前相差 {100 - totalWeight}%
                    </p>
                  )}
                </div>

                {/* Abilities List */}
                <div className="space-y-3">
                  {abilities.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>该岗位暂无能力点配置</p>
                      <p className="text-sm mt-1">点击上方按钮添加能力点</p>
                    </div>
                  ) : (
                    abilities.map((ability, index) => (
                      <div
                        key={ability.id}
                        className="flex items-start gap-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        {/* Index */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                          {index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{ability.name}</h4>
                            <Badge className={cn("text-xs", getCategoryColor(ability.category))}>
                              {ability.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{ability.description}</p>
                        </div>

                        {/* Weight */}
                        <div className="text-right shrink-0">
                          <div className="text-lg font-bold text-primary">{ability.weight}%</div>
                          <div className="text-xs text-gray-400">权重</div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditAbility(ability)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Weight Visualization */}
                {abilities.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">权重可视化</h4>
                    <div className="h-8 flex rounded-lg overflow-hidden">
                      {abilities.map((ability, index) => {
                        const colors = [
                          "bg-blue-500",
                          "bg-green-500",
                          "bg-purple-500",
                          "bg-orange-500",
                          "bg-cyan-500",
                          "bg-pink-500",
                        ]
                        return (
                          <div
                            key={ability.id}
                            className={cn("flex items-center justify-center text-white text-xs font-medium", colors[index % colors.length])}
                            style={{ width: `${ability.weight}%` }}
                            title={`${ability.name}: ${ability.weight}%`}
                          >
                            {ability.weight >= 10 && `${ability.weight}%`}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {abilities.map((ability, index) => {
                        const colors = [
                          "bg-blue-500",
                          "bg-green-500",
                          "bg-purple-500",
                          "bg-orange-500",
                          "bg-cyan-500",
                          "bg-pink-500",
                        ]
                        return (
                          <div key={ability.id} className="flex items-center gap-1.5 text-xs">
                            <div className={cn("w-3 h-3 rounded", colors[index % colors.length])} />
                            <span className="text-gray-600">{ability.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-gray-500">
                请从左侧选择一个岗位
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Ability Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>添加能力点</DialogTitle>
            <DialogDescription>
              为 {selectedPositionData?.name} 添加新的能力评估指标
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>能力点名称</Label>
              <Input
                value={abilityForm.name}
                onChange={(e) => setAbilityForm({ ...abilityForm, name: e.target.value })}
                placeholder="如：React 框架开发"
              />
            </div>
            <div className="space-y-2">
              <Label>能力描述</Label>
              <Textarea
                value={abilityForm.description}
                onChange={(e) => setAbilityForm({ ...abilityForm, description: e.target.value })}
                placeholder="描述该能力点的具体内涵和评估标准"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>能力分类</Label>
                <Select
                  value={abilityForm.category}
                  onValueChange={(v) => setAbilityForm({ ...abilityForm, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>权重 (%)</Label>
                <Input
                  type="number"
                  value={abilityForm.weight}
                  onChange={(e) => setAbilityForm({ ...abilityForm, weight: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveAbility}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ability Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑能力点</DialogTitle>
            <DialogDescription>修改能力点信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>能力点名称</Label>
              <Input
                value={abilityForm.name}
                onChange={(e) => setAbilityForm({ ...abilityForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>能力描述</Label>
              <Textarea
                value={abilityForm.description}
                onChange={(e) => setAbilityForm({ ...abilityForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>能力分类</Label>
                <Select
                  value={abilityForm.category}
                  onValueChange={(v) => setAbilityForm({ ...abilityForm, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>权重 (%)</Label>
                <Input
                  type="number"
                  value={abilityForm.weight}
                  onChange={(e) => setAbilityForm({ ...abilityForm, weight: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveAbility}>
              <Save className="mr-2 h-4 w-4" />
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
