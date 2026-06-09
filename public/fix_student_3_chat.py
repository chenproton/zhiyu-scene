#!/usr/bin/env python3
with open('/root/zhiyu-scene/public/student_3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ===================== 1. 添加新的 CSS =====================
new_css = '''
        .ai-guide-dialog-large {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(120%);
            background: white;
            border-radius: 16px;
            padding: 0;
            box-shadow: 0 12px 40px rgba(0,0,0,0.18);
            border: 1px solid #e9d5ff;
            z-index: 85;
            width: 560px;
            max-width: 92vw;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            max-height: 420px;
        }
        .ai-guide-dialog-large.show {
            transform: translateX(-50%) translateY(0);
        }
        .ai-guide-dialog-header {
            padding: 14px 18px;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }
        .ai-guide-dialog-header-avatar {
            width: 32px; height: 32px; border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center;
            font-size: 14px;
        }
        .ai-guide-dialog-header-title {
            font-weight: 600; font-size: 14px; flex: 1;
        }
        .ai-guide-dialog-header-step {
            font-size: 12px; opacity: 0.85;
            background: rgba(255,255,255,0.15);
            padding: 2px 10px; border-radius: 10px;
        }
        .ai-guide-dialog-close {
            width: 28px; height: 28px; border-radius: 50%;
            border: none; background: transparent; color: white;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 13px;
        }
        .ai-guide-dialog-close:hover { background: rgba(255,255,255,0.2); }
        .ai-guide-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #fafafa;
        }
        .ai-guide-msg-ai {
            display: flex; align-items: flex-start; gap: 8px;
            max-width: 88%;
        }
        .ai-guide-msg-ai-avatar {
            width: 28px; height: 28px; border-radius: 50%;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 12px; flex-shrink: 0;
        }
        .ai-guide-msg-ai-bubble {
            background: #faf5ff;
            border: 1px solid #e9d5ff;
            border-radius: 12px;
            border-top-left-radius: 2px;
            padding: 10px 14px;
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.7;
        }
        .ai-guide-msg-user {
            display: flex; align-items: flex-start; gap: 8px;
            align-self: flex-end;
            max-width: 80%;
        }
        .ai-guide-msg-user-bubble {
            background: #f0f7ff;
            border: 1px solid #bae0ff;
            border-radius: 12px;
            border-top-right-radius: 2px;
            padding: 10px 14px;
            font-size: 13px;
            color: var(--text-primary);
            line-height: 1.7;
        }
        .ai-guide-msg-user-avatar {
            width: 28px; height: 28px; border-radius: 50%;
            background: #e6f4ff;
            display: flex; align-items: center; justify-content: center;
            color: #1677ff; font-size: 12px; flex-shrink: 0;
        }
        .ai-guide-suggested-q {
            display: flex; flex-wrap: wrap; gap: 6px;
            margin-top: 6px;
        }
        .ai-guide-suggested-q-btn {
            padding: 5px 12px; border-radius: 14px;
            border: 1px solid #d8b4fe; background: white;
            color: #7c3aed; font-size: 12px; cursor: pointer;
            transition: all 0.2s;
        }
        .ai-guide-suggested-q-btn:hover {
            background: #f3e8ff; border-color: #a855f7;
        }
        .ai-guide-input-area {
            padding: 10px 14px;
            border-top: 1px solid #f0f0f0;
            background: white;
            flex-shrink: 0;
        }
        .ai-guide-input-row {
            display: flex; gap: 8px; margin-bottom: 8px;
        }
        .ai-guide-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
        }
        .ai-guide-input:focus {
            border-color: #a855f7;
        }
        .ai-guide-send-btn {
            width: 36px; height: 36px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px;
            transition: transform 0.2s;
        }
        .ai-guide-send-btn:hover { transform: scale(1.08); }
        .ai-guide-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .ai-guide-next-row {
            display: flex; justify-content: center;
            padding-top: 6px;
            border-top: 1px dashed #f0f0f0;
        }
        .ai-guide-confirm-btn {
            padding: 8px 24px;
            border-radius: 20px;
            border: none;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
        }
        .ai-guide-confirm-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
        }
        .ai-guide-confirm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .ai-guide-confirm-btn.confirmed {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.25);
        }
        .ai-guide-typing {
            display: flex; align-items: center; gap: 4px;
            padding: 8px 14px;
            font-size: 12px; color: #7c3aed;
        }
        .ai-guide-typing span {
            width: 5px; height: 5px; border-radius: 50%;
            background: #a855f7; animation: aiTypingBounce 1.4s infinite ease-in-out both;
        }
        .ai-guide-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ai-guide-typing span:nth-child(3) { animation-delay: 0.4s; }
'''

content = content.replace('        .ai-guide-close {', new_css + '        .ai-guide-close {')

# ===================== 2. 重写 AI 底部引导对话框 HTML =====================
old_guide_dialog = '''    <!-- AI 底部引导对话框 -->
    <div class="ai-guide-dialog" id="aiGuideDialog">
        <div class="ai-guide-avatar"><i class="fas fa-robot"></i></div>
        <div class="ai-guide-content">
            <div class="ai-guide-text" id="aiGuideText">欢迎来到 AI 智能学习模式！我会陪伴你完成整个学习过程。</div>
            <div class="ai-guide-actions" id="aiGuideActions">
                <button class="ai-guide-btn primary" onclick="startAiGuidedLearning()">开始导学</button>
                <button class="ai-guide-btn" onclick="dismissAiGuide()">稍后</button>
            </div>
        </div>
        <button class="ai-guide-close" onclick="dismissAiGuide()"><i class="fas fa-times"></i></button>
    </div>'''

new_guide_dialog = '''    <!-- AI 对话式导学对话框 -->
    <div class="ai-guide-dialog-large" id="aiGuideDialog">
        <div class="ai-guide-dialog-header">
            <div class="ai-guide-dialog-header-avatar"><i class="fas fa-robot"></i></div>
            <div class="ai-guide-dialog-header-title">AI 学习伴侣</div>
            <div class="ai-guide-dialog-header-step" id="aiGuideStepBadge">步骤 1/5</div>
            <button class="ai-guide-dialog-close" onclick="dismissAiGuide()"><i class="fas fa-times"></i></button>
        </div>
        <div class="ai-guide-messages" id="aiGuideMessages">
            <!-- 消息动态渲染 -->
        </div>
        <div class="ai-guide-input-area">
            <div class="ai-guide-input-row">
                <input type="text" class="ai-guide-input" id="aiGuideInput" placeholder="向 AI 提问或表达你的需求..." onkeydown="if(event.key==='Enter')handleAiUserMessage()">
                <button class="ai-guide-send-btn" id="aiGuideSendBtn" onclick="handleAiUserMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
            <div class="ai-guide-next-row">
                <button class="ai-guide-confirm-btn" id="aiGuideConfirmBtn" onclick="confirmStepAndNext()">
                    <i class="fas fa-check-circle"></i> 我已了解本步骤，进入下一步
                </button>
            </div>
        </div>
    </div>'''

content = content.replace(old_guide_dialog, new_guide_dialog)

# ===================== 3. 重写 AI 导学 JS 逻辑 =====================
old_ai_guide_js = '''        // ==================== AI-first 智能学习模式 ====================
        let aiGuideShown = false;
        let aiCurrentStep = 0;
        let aiLearningProgress = 0;
        const aiGuideSteps = [
            {
                text: '欢迎来到 AI 智能学习模式！我会根据你的学习状态，定制个性化的学习路径。',
                actions: [{label:'开始导学',primary:true,action:'nextAiGuide'},{label:'稍后',primary:false,action:'dismissAiGuide'}],
                onEnter: null
            },
            {
                text: '第一步：阅读任务说明，了解学习目标和交付标准。我已为你准备好 AI 摘要，点击"查看摘要"可快速掌握要点。',
                actions: [{label:'已阅读',primary:true,action:'nextAiGuide'},{label:'查看摘要',primary:false,action:'aiSummaryGuide'}],
                onEnter: 'scrollToLearningPanel'
            },
            {
                text: '第二步：查看右侧 AI 分析面板，了解你的知识点掌握度和能力预估。针对性补强薄弱环节。',
                actions: [{label:'切换至分析面板',primary:true,action:'switchToAiPathTab'},{label:'继续下一步',primary:false,action:'nextAiGuide'}],
                onEnter: 'highlightAnalysisPanel'
            },
            {
                text: '第三步：进入测评环节。我会根据你的答题表现，实时分析知识掌握情况。完成后将生成详细的学习报告。',
                actions: [{label:'展开测评',primary:true,action:'expandAssessment'},{label:'继续下一步',primary:false,action:'nextAiGuide'}],
                onEnter: 'scrollToAssessment'
            },
            {
                text: '第四步：完成答题后点击"提交答案"，我会为你生成个性化的 AI 学习报告，包含能力分析和改进建议。',
                actions: [{label:'知道了',primary:true,action:'finishAiGuide'}],
                onEnter: null
            }
        ];

        function showAiGuide() {
            const dialog = document.getElementById('aiGuideDialog');
            dialog.classList.add('show');
        }
        function dismissAiGuide() {
            document.getElementById('aiGuideDialog').classList.remove('show');
        }
        function renderAiGuideStep(idx) {
            const step = aiGuideSteps[idx];
            if (!step) return;
            document.getElementById('aiGuideText').textContent = step.text;
            const actionsEl = document.getElementById('aiGuideActions');
            actionsEl.innerHTML = step.actions.map(a =>
                `<button class="ai-guide-btn ${a.primary ? 'primary' : ''}" onclick="${a.action}()">${a.label}</button>`
            ).join('');
        }
        function nextAiGuide() {
            aiCurrentStep++;
            if (aiCurrentStep < aiGuideSteps.length) {
                renderAiGuideStep(aiCurrentStep);
                executeStepAction(aiGuideSteps[aiCurrentStep].onEnter);
                updateAiProgress();
            } else {
                finishAiGuide();
            }
        }
        function startAiGuidedLearning() {
            aiCurrentStep = 0;
            renderAiGuideStep(0);
            showAiGuide();
        }
        function aiSummaryGuide() {
            if (currentTaskId) handleAiSummary(currentTaskId);
            // 高亮任务说明面板
            const panel = document.getElementById('learningPanel');
            if (panel) {
                panel.classList.add('ai-guide-highlight');
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => panel.classList.remove('ai-guide-highlight'), 6000);
            }
            showStepToast('AI 摘要已生成，请查看任务说明区域');
        }
        function finishAiGuide() {
            dismissAiGuide();
            aiCurrentStep = 0;
            showStepToast('AI 导学完成，祝你学习顺利！');
            updateAiProgress(100);
        }
        function showStepToast(msg) {
            const toast = document.getElementById('aiStepCompleteToast');
            document.getElementById('aiStepCompleteText').textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
        function updateAiProgress(pct) {
            if (pct !== undefined) {
                aiLearningProgress = pct;
            } else {
                aiLearningProgress = Math.min(100, Math.round((aiCurrentStep / (aiGuideSteps.length - 1)) * 100));
            }
            const fill = document.getElementById('aiLearningProgressFill');
            if (fill) fill.style.width = aiLearningProgress + '%';
        }
        function executeStepAction(actionName) {
            if (!actionName) return;
            setTimeout(() => {
                if (actionName === 'scrollToLearningPanel') {
                    const panel = document.getElementById('learningPanel');
                    if (panel) {
                        panel.classList.add('ai-guide-highlight');
                        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => panel.classList.remove('ai-guide-highlight'), 5000);
                    }
                } else if (actionName === 'highlightAnalysisPanel') {
                    switchAiAnalysisTab('ai-analysis');
                    const panel = document.querySelector('.tl-right .tl-side-panel');
                    if (panel) {
                        panel.classList.add('ai-guide-highlight');
                        setTimeout(() => panel.classList.remove('ai-guide-highlight'), 5000);
                    }
                } else if (actionName === 'scrollToAssessment') {
                    const panel = document.getElementById('assessmentPanel');
                    if (panel) {
                        panel.style.display = 'block';
                        panel.classList.add('ai-guide-highlight');
                        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => panel.classList.remove('ai-guide-highlight'), 5000);
                    }
                }
            }, 400);
        }
        function switchToAiPathTab() {
            switchAiAnalysisTab('ai-path');
            nextAiGuide();
        }
        function expandAssessment() {
            const task = currentLearningTask;
            if (task) {
                // 展开所有测评区域
                const methods = task.evaluationMethods || [];
                methods.forEach(m => {
                    if (m === 'paper' || m === 'question_bank' || m === 'quiz') {
                        quizExpanded[`${task.id}-${m}`] = true;
                    }
                });
                renderAssessmentPanel(task);
                const panel = document.getElementById('assessmentPanel');
                if (panel) {
                    panel.style.display = 'block';
                    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            nextAiGuide();
        }

        // 在 showTaskLearningView 中延迟显示 AI 引导
        const originalShowTaskLearningView = showTaskLearningView;
        showTaskLearningView = function(taskId, mode) {
            originalShowTaskLearningView(taskId, mode);
            aiLearningProgress = 0;
            updateAiProgress(0);
            // 延迟显示 AI 引导
            if (!aiGuideShown) {
                aiGuideShown = true;
                setTimeout(() => {
                    startAiGuidedLearning();
                }, 1200);
            }
            // 渲染 AI 分析面板
            setTimeout(() => renderAiAnalysisPanel(), 300);
        };'''

new_ai_guide_js = '''        // ==================== AI-first 智能学习模式（对话式导学） ====================
        let aiGuideShown = false;
        let aiCurrentStep = 0;
        let aiLearningProgress = 0;
        let aiChatHistory = []; // {role:'ai'|'user', content, suggestedQs?}
        let aiStepConfirmed = [false, false, false, false, false];
        let aiIsTyping = false;

        const aiGuideSteps = [
            {
                title: '欢迎',
                text: '你好！我是你的 AI 学习伴侣。在这个智能学习模式中，我会全程陪伴你完成本任务的学习与测评。\\n\\n你可以随时向我提问，我会根据你的需求提供帮助。当我们充分交流、你完全理解当前步骤后，点击底部的"我已了解本步骤，进入下一步"即可继续。\\n\\n准备好了吗？让我们开始吧！',
                suggestedQs: ['这个任务主要学什么？', '我需要准备什么？', '大概要花多长时间？'],
                onEnter: null
            },
            {
                title: '理解任务',
                text: '第一步：让我们先深入理解这个任务的目标和要求。\\n\\n请仔细阅读左侧的「任务说明」，了解核心学习目标、涉及的知识点和能力点，以及最终的交付标准。\\n\\n如果你觉得任务说明太长，可以在任务说明面板中点击「AI 摘要」按钮，我会为你提炼关键要点。\\n\\n有任何不理解的地方，随时在这里问我！',
                suggestedQs: ['能帮我总结一下任务要点吗？', '这个任务最难的部分是什么？', '我需要掌握哪些前置知识？'],
                onEnter: 'scrollToLearningPanel'
            },
            {
                title: '分析能力',
                text: '第二步：知己知彼，百战不殆。\\n\\n请查看右侧的「AI 分析」面板，了解我为你预估的知识点掌握度和能力水平。紫色区域代表你的优势，浅色区域则是可以重点提升的地方。\\n\\n你也可以切换到「学习路径」Tab，查看我为你定制的推荐学习路线。\\n\\n如果你对某个知识点的掌握度有疑问，或者想了解如何补强薄弱环节，尽管问我！',
                suggestedQs: ['我的薄弱点在哪里？', '推荐先看什么资源？', '这个任务的难点怎么突破？'],
                onEnter: 'highlightAnalysisPanel'
            },
            {
                title: '测评练习',
                text: '第三步：实践出真知，现在进入测评环节！\\n\\n请下滑到「任务测评」区域，认真完成每一道题目。做题时可以先独立思考，如果遇到卡壳的地方，每道题旁边都有「AI 提示」按钮，我会给你思路引导（但不会直接告诉答案哦）。\\n\\n答完所有题目后，点击「确认答案」提交。我会立即分析你的答题情况，生成一份详细的个性化学习报告。\\n\\n关于答题策略或题目类型有任何问题，随时问我！',
                suggestedQs: ['测评有多少道题？', '答错了可以重新答吗？', '每道题都有 AI 提示吗？'],
                onEnter: 'scrollToAssessment'
            },
            {
                title: '总结反馈',
                text: '第四步：完成答题后，记得点击「提交答案」按钮。\\n\\n提交后，我会立即为你生成一份 AI 学习报告，包含：\\n• 综合等级评定（A/B/C/D）\\n• 各维度能力分析\\n• 错题详细分析\\n• 个性化改进建议\\n• 下一步学习推荐\\n\\n报告生成后，你可以随时在「AI 分析」面板中回顾。\\n\\n祝你学习顺利，有任何问题随时找我！',
                suggestedQs: ['报告里有什么内容？', '如果成绩不理想怎么办？', '完成后可以重新测评吗？'],
                onEnter: null
            }
        ];

        function showAiGuide() {
            const dialog = document.getElementById('aiGuideDialog');
            dialog.classList.add('show');
        }
        function dismissAiGuide() {
            document.getElementById('aiGuideDialog').classList.remove('show');
        }

        function addAiMessage(text, suggestedQs) {
            const container = document.getElementById('aiGuideMessages');
            const msgDiv = document.createElement('div');
            msgDiv.className = 'ai-guide-msg-ai';
            let qsHtml = '';
            if (suggestedQs && suggestedQs.length > 0) {
                qsHtml = `<div class="ai-guide-suggested-q">` +
                    suggestedQs.map(q => `<button class="ai-guide-suggested-q-btn" onclick="sendAiQuickQuestion('${q.replace(/'/g, "\\'")}')">${q}</button>`).join('') +
                    `</div>`;
            }
            msgDiv.innerHTML = `
                <div class="ai-guide-msg-ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-guide-msg-ai-bubble">${text.replace(/\\n/g, '<br>')}${qsHtml}</div>
            `;
            container.appendChild(msgDiv);
            container.scrollTop = container.scrollHeight;
        }

        function addUserMessage(text) {
            const container = document.getElementById('aiGuideMessages');
            const msgDiv = document.createElement('div');
            msgDiv.className = 'ai-guide-msg-user';
            msgDiv.innerHTML = `
                <div class="ai-guide-msg-user-bubble">${text}</div>
                <div class="ai-guide-msg-user-avatar"><i class="fas fa-user"></i></div>
            `;
            container.appendChild(msgDiv);
            container.scrollTop = container.scrollHeight;
        }

        function showAiTyping() {
            const container = document.getElementById('aiGuideMessages');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'aiTypingIndicator';
            typingDiv.className = 'ai-guide-typing';
            typingDiv.innerHTML = `<span></span><span></span><span></span> AI 正在思考...`;
            container.appendChild(typingDiv);
            container.scrollTop = container.scrollHeight;
        }
        function hideAiTyping() {
            const el = document.getElementById('aiTypingIndicator');
            if (el) el.remove();
        }

        function renderStepToChat(stepIdx) {
            const step = aiGuideSteps[stepIdx];
            if (!step) return;
            document.getElementById('aiGuideStepBadge').textContent = `步骤 ${stepIdx + 1}/${aiGuideSteps.length} · ${step.title}`;
            addAiMessage(step.text, step.suggestedQs);
            executeStepAction(step.onEnter);
            updateAiProgress();
            // 重置确认按钮
            const btn = document.getElementById('aiGuideConfirmBtn');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check-circle"></i> 我已了解本步骤，进入下一步';
            btn.classList.remove('confirmed');
        }

        function confirmStepAndNext() {
            if (aiCurrentStep >= aiGuideSteps.length - 1) {
                // 最后一步确认后直接结束
                finishAiGuide();
                return;
            }
            aiStepConfirmed[aiCurrentStep] = true;
            aiCurrentStep++;
            renderStepToChat(aiCurrentStep);
        }

        function handleAiUserMessage() {
            const input = document.getElementById('aiGuideInput');
            const text = input.value.trim();
            if (!text || aiIsTyping) return;
            input.value = '';
            addUserMessage(text);
            aiIsTyping = true;
            document.getElementById('aiGuideSendBtn').disabled = true;
            showAiTyping();

            // 模拟 AI 思考延迟
            setTimeout(() => {
                hideAiTyping();
                const reply = generateAiReply(text, aiCurrentStep);
                addAiMessage(reply.text, reply.suggestedQs);
                aiIsTyping = false;
                document.getElementById('aiGuideSendBtn').disabled = false;
            }, 800 + Math.random() * 600);
        }

        function sendAiQuickQuestion(text) {
            document.getElementById('aiGuideInput').value = text;
            handleAiUserMessage();
        }

        function generateAiReply(userText, stepIdx) {
            const lower = userText.toLowerCase();
            const task = currentLearningTask;
            const kps = task ? getTaskKnowledgePoints(task) : [];
            const abilities = task ? (task.abilityPoints || []).map(id => getAbilityPointById(id)).filter(Boolean) : [];

            // 根据用户输入关键词匹配回复
            if (lower.includes('时间') || lower.includes('多久') || lower.includes('多长') || lower.includes('课时')) {
                return {
                    text: `本任务预估需要 ${task?.estimatedHours || 8} 课时完成。建议分 ${Math.ceil((task?.estimatedHours || 8) / 2)} 次进行，每次专注学习 1-2 小时效果最佳。\\n\\n如果你的基础较好，可以适当加快进度；如果某些知识点不熟悉，建议多预留一些时间进行巩固。`,
                    suggestedQs: ['时间不够怎么办？', '可以分几天完成吗？']
                };
            }
            if (lower.includes('难度') || lower.includes('难吗') || lower.includes('简单')) {
                const diff = task?.difficulty || 3;
                const diffText = diff >= 4 ? '较高' : diff >= 3 ? '中等' : '适中';
                return {
                    text: `本任务难度等级为 ${'★'.repeat(diff)}${'☆'.repeat(5 - diff)}（${diffText}）。\\n\\n主要挑战在于${abilities[0]?.name || '核心技能'}的灵活运用。建议先充分阅读配套资源，遇到困难随时向我提问。`,
                    suggestedQs: ['有哪些难点？', '新手能完成吗？']
                };
            }
            if (lower.includes('总结') || lower.includes('要点') || lower.includes('概括') || lower.includes('摘要')) {
                return {
                    text: `好的，我来为你总结本任务的核心要点：\\n\\n1. **核心目标**：${task?.description || '完成指定学习任务'}\\n2. **关键知识点**：${kps.slice(0, 3).map(k => k.name).join('、') || '详见任务说明'}\\n3. **重点能力**：${abilities.slice(0, 2).map(a => a.name).join('、') || '综合应用'}\\n4. **交付要求**：${task?.deliverables?.map(d => d.name).slice(0, 2).join('、') || '按任务要求提交'}\\n\\n你可以点击任务说明面板上的「AI 摘要」按钮，获取更详细的结构化摘要。`,
                    suggestedQs: ['能更详细一点吗？', '有没有学习技巧？']
                };
            }
            if (lower.includes('资源') || lower.includes('材料') || lower.includes('资料') || lower.includes('推荐')) {
                const resources = task ? getTaskResources(task) : [];
                return {
                    text: `根据本任务内容，我推荐你优先学习以下资源：\\n\\n${resources.slice(0, 3).map((r, i) => `${i + 1}. **${r.name}** — ${r.description?.substring(0, 40) || '配套资源'}...`).join('\\n')}\\n\\n你可以切换到右侧「资源」Tab 查看完整列表，或直接点击资源名称预览。`,
                    suggestedQs: ['还有别的资源吗？', '哪个资源最重要？']
                };
            }
            if (lower.includes('薄弱') || lower.includes('弱点') || lower.includes('不足') || lower.includes('提升')) {
                return {
                    text: `根据 AI 分析，你可能需要重点关注的方面：\\n\\n• **${kps[0]?.name || '核心概念'}**：这是本任务的基础，务必扎实掌握\\n• **${abilities[0]?.name || '关键能力'}**：实践应用中容易出现问题的地方\\n\\n建议策略：先通过「AI 分析」面板查看详细掌握度，然后针对性阅读相关资源，最后通过测评检验效果。`,
                    suggestedQs: ['怎么补强？', '有练习题吗？']
                };
            }
            if (lower.includes('提示') || lower.includes('帮助') || lower.includes('怎么做') || lower.includes('思路')) {
                return {
                    text: `没问题！我会尽力帮助你。\\n\\n如果是关于**任务内容**的问题，建议先阅读左侧的任务说明，或点击「AI 摘要」快速获取要点。\\n\\n如果是关于**测评答题**的问题，每道题旁边都有「AI 提示」按钮，可以提供解题思路。\\n\\n如果是关于**学习方法**的问题，我可以根据你的具体情况给出个性化建议。\\n\\n请具体描述你遇到的困难，我会更有针对性地帮助你！`,
                    suggestedQs: ['任务说明看不懂', '不知道怎么答题', '时间不够用']
                };
            }
            // 通用回复
            const genericReplies = [
                { text: `收到！关于这个问题，我建议你从以下几个方面思考：\\n\\n首先，回顾任务说明中的核心目标；其次，结合右侧「AI 分析」面板中的能力评估；最后，如果有具体卡点，随时继续向我提问。\\n\\n还有什么想了解的吗？`, suggestedQs: ['能举个例子吗？', '还有别的建议吗？'] },
                { text: `好的，我理解你的需求。在这个学习阶段，最重要的是保持耐心和系统性。\\n\\n建议你按照当前的步骤稳步推进，遇到不理解的概念及时提问。我可以帮你解释专业术语、梳理逻辑关系、推荐针对性资源。\\n\\n随时告诉我你的困惑！`, suggestedQs: ['术语不懂', '逻辑理不清', '资源太多看不过来'] },
                { text: `没问题！学习就是一个不断发现和解决问题的过程。\\n\\n你可以尝试：1）先通读一遍任务说明建立整体认知；2）针对不懂的部分标记出来；3）通过测评发现自己的薄弱点；4）根据 AI 报告针对性复习。\\n\\n需要我详细展开哪一步吗？`, suggestedQs: ['怎么建立整体认知？', '怎么标记不懂的地方？', '报告怎么看？'] }
            ];
            return genericReplies[Math.floor(Math.random() * genericReplies.length)];
        }

        function startAiGuidedLearning() {
            aiCurrentStep = 0;
            aiStepConfirmed = aiGuideSteps.map(() => false);
            // 清空消息区
            document.getElementById('aiGuideMessages').innerHTML = '';
            renderStepToChat(0);
            showAiGuide();
        }

        function aiSummaryGuide() {
            if (currentTaskId) handleAiSummary(currentTaskId);
            const panel = document.getElementById('learningPanel');
            if (panel) {
                panel.classList.add('ai-guide-highlight');
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => panel.classList.remove('ai-guide-highlight'), 6000);
            }
            addAiMessage('AI 摘要已生成！请查看左侧任务说明区域的高亮摘要内容。阅读完毕后，如果你已经充分理解了本步骤，可以点击底部的「我已了解本步骤，进入下一步」继续。', ['摘要内容还有不懂的', '能再详细解释一下吗？']);
        }

        function finishAiGuide() {
            aiStepConfirmed[aiCurrentStep] = true;
            addAiMessage('太棒了！AI 导学已全部完成。接下来你可以按照提示继续学习和测评。祝你学习顺利，有任何问题随时找我！', ['我想重新看某一步', '开始测评']);
            setTimeout(() => {
                dismissAiGuide();
                aiCurrentStep = 0;
                showStepToast('AI 导学完成，祝你学习顺利！');
                updateAiProgress(100);
            }, 1500);
        }

        function showStepToast(msg) {
            const toast = document.getElementById('aiStepCompleteToast');
            document.getElementById('aiStepCompleteText').textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function updateAiProgress(pct) {
            if (pct !== undefined) {
                aiLearningProgress = pct;
            } else {
                aiLearningProgress = Math.min(100, Math.round((aiCurrentStep / (aiGuideSteps.length - 1)) * 100));
            }
            const fill = document.getElementById('aiLearningProgressFill');
            if (fill) fill.style.width = aiLearningProgress + '%';
        }

        function executeStepAction(actionName) {
            if (!actionName) return;
            setTimeout(() => {
                if (actionName === 'scrollToLearningPanel') {
                    const panel = document.getElementById('learningPanel');
                    if (panel) {
                        panel.classList.add('ai-guide-highlight');
                        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => panel.classList.remove('ai-guide-highlight'), 5000);
                    }
                } else if (actionName === 'highlightAnalysisPanel') {
                    switchAiAnalysisTab('ai-analysis');
                    const panel = document.querySelector('.tl-right .tl-side-panel');
                    if (panel) {
                        panel.classList.add('ai-guide-highlight');
                        setTimeout(() => panel.classList.remove('ai-guide-highlight'), 5000);
                    }
                } else if (actionName === 'scrollToAssessment') {
                    const panel = document.getElementById('assessmentPanel');
                    if (panel) {
                        panel.style.display = 'block';
                        panel.classList.add('ai-guide-highlight');
                        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => panel.classList.remove('ai-guide-highlight'), 5000);
                    }
                }
            }, 400);
        }

        function switchToAiPathTab() {
            switchAiAnalysisTab('ai-path');
        }

        function expandAssessment() {
            const task = currentLearningTask;
            if (task) {
                const methods = task.evaluationMethods || [];
                methods.forEach(m => {
                    if (m === 'paper' || m === 'question_bank' || m === 'quiz') {
                        quizExpanded[`${task.id}-${m}`] = true;
                    }
                });
                renderAssessmentPanel(task);
                const panel = document.getElementById('assessmentPanel');
                if (panel) {
                    panel.style.display = 'block';
                    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }

        // 在 showTaskLearningView 中延迟显示 AI 引导
        const originalShowTaskLearningView = showTaskLearningView;
        showTaskLearningView = function(taskId, mode) {
            originalShowTaskLearningView(taskId, mode);
            aiLearningProgress = 0;
            updateAiProgress(0);
            if (!aiGuideShown) {
                aiGuideShown = true;
                setTimeout(() => {
                    startAiGuidedLearning();
                }, 1200);
            }
            setTimeout(() => renderAiAnalysisPanel(), 300);
        };'''

content = content.replace(old_ai_guide_js, new_ai_guide_js)

with open('/root/zhiyu-scene/public/student_3.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('student_3.html chat guide fixed successfully')
