#!/usr/bin/env python3
import re

with open('/root/zhiyu-scene/public/student_3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the aiGuideSteps array and replace it
pattern = r"(const aiGuideSteps = \[)(.*?)(\];\s*function showAiGuide)"

def replacer(m):
    new_steps = """const aiGuideSteps = [
            {
                title: '欢迎',
                text: '你好！我是你的 AI 学习伴侣。在这个智能学习模式中，我会全程陪伴你完成本任务的学习与测评。\n\n右侧的「AI 分析」面板会实时展示你的知识点掌握度和能力预估，你可以随时查看，不用刻意等待我的引导。\n\n我们的导学主要分为两个环节：**任务说明查看** 和 **任务测评**。你可以随时向我提问，我会根据你的需求提供帮助。当我们充分交流、你完全理解当前步骤后，点击底部的「我已了解本步骤，进入下一步」即可继续。\n\n准备好了吗？让我们开始吧！',
                suggestedQs: ['这个任务主要学什么？', '我需要准备什么？', '大概要花多长时间？'],
                onEnter: null
            },
            {
                title: '任务说明',
                text: '第一步：请仔细阅读左侧的「任务说明」，了解核心学习目标、涉及的知识点和能力点，以及最终的交付标准。\n\n右侧的「AI 分析」面板会同步展示你的知识点掌握情况，「学习路径」Tab 也有推荐的学习路线，你可以随时查看参考。\n\n如果你觉得任务说明太长，可以在任务说明面板中点击「AI 摘要」按钮，我会为你提炼关键要点。\n\n有任何不理解的地方，随时在这里问我！',
                suggestedQs: ['能帮我总结一下任务要点吗？', '这个任务最难的部分是什么？', '我需要掌握哪些前置知识？'],
                onEnter: 'scrollToLearningPanel'
            },
            {
                title: '任务测评',
                text: '第二步：实践出真知，现在进入测评环节！\n\n请下滑到「任务测评」区域，认真完成每一道题目。做题时可以先独立思考，如果遇到卡壳的地方，每道题旁边都有「AI 提示」按钮，我会给你思路引导（但不会直接告诉答案哦）。\n\n答完所有题目后，点击「确认答案」提交。我会立即分析你的答题情况，生成一份包含综合等级、能力分析、错题解析和改进建议的详细学习报告。\n\n关于答题策略或题目类型有任何问题，随时问我！',
                suggestedQs: ['测评有多少道题？', '答错了可以重新答吗？', '每道题都有 AI 提示吗？'],
                onEnter: 'scrollToAssessment'
            }
        ];\n\n        function showAiGuide"""
    return new_steps

new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)

if new_content == content:
    print("WARNING: replacement did not match, trying alternative approach")
    # Alternative: find by line numbers
    lines = content.split('\n')
    start_idx = None
    end_idx = None
    for i, line in enumerate(lines):
        if 'const aiGuideSteps = [' in line:
            start_idx = i
        if start_idx is not None and '];' in line and 'function showAiGuide' in lines[i+1] if i+1 < len(lines) else False:
            end_idx = i + 1
            break
    if start_idx is not None and end_idx is not None:
        new_lines = lines[:start_idx] + [
            "        const aiGuideSteps = [",
            "            {",
            "                title: '欢迎',",
            "                text: '你好！我是你的 AI 学习伴侣。在这个智能学习模式中，我会全程陪伴你完成本任务的学习与测评。\\n\\n右侧的「AI 分析」面板会实时展示你的知识点掌握度和能力预估，你可以随时查看，不用刻意等待我的引导。\\n\\n我们的导学主要分为两个环节：**任务说明查看** 和 **任务测评**。你可以随时向我提问，我会根据你的需求提供帮助。当我们充分交流、你完全理解当前步骤后，点击底部的「我已了解本步骤，进入下一步」即可继续。\\n\\n准备好了吗？让我们开始吧！',",
            "                suggestedQs: ['这个任务主要学什么？', '我需要准备什么？', '大概要花多长时间？'],",
            "                onEnter: null",
            "            },",
            "            {",
            "                title: '任务说明',",
            "                text: '第一步：请仔细阅读左侧的「任务说明」，了解核心学习目标、涉及的知识点和能力点，以及最终的交付标准。\\n\\n右侧的「AI 分析」面板会同步展示你的知识点掌握情况，「学习路径」Tab 也有推荐的学习路线，你可以随时查看参考。\\n\\n如果你觉得任务说明太长，可以在任务说明面板中点击「AI 摘要」按钮，我会为你提炼关键要点。\\n\\n有任何不理解的地方，随时在这里问我！',",
            "                suggestedQs: ['能帮我总结一下任务要点吗？', '这个任务最难的部分是什么？', '我需要掌握哪些前置知识？'],",
            "                onEnter: 'scrollToLearningPanel'",
            "            },",
            "            {",
            "                title: '任务测评',",
            "                text: '第二步：实践出真知，现在进入测评环节！\\n\\n请下滑到「任务测评」区域，认真完成每一道题目。做题时可以先独立思考，如果遇到卡壳的地方，每道题旁边都有「AI 提示」按钮，我会给你思路引导（但不会直接告诉答案哦）。\\n\\n答完所有题目后，点击「确认答案」提交。我会立即分析你的答题情况，生成一份包含综合等级、能力分析、错题解析和改进建议的详细学习报告。\\n\\n关于答题策略或题目类型有任何问题，随时问我！',",
            "                suggestedQs: ['测评有多少道题？', '答错了可以重新答吗？', '每道题都有 AI 提示吗？'],",
            "                onEnter: 'scrollToAssessment'",
            "            }",
            "        ];",
            "",
            "        function showAiGuide"
        ] + lines[end_idx+1:]
        new_content = '\n'.join(new_lines)
        print(f"Replaced lines {start_idx} to {end_idx}")
    else:
        print(f"Could not find bounds: start={start_idx}, end={end_idx}")

with open('/root/zhiyu-scene/public/student_3.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done')
