#!/usr/bin/env python3
with open('/root/zhiyu-scene/public/student_3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ===================== 1. 添加新的 CSS =====================
new_css = '''
        .ai-guide-highlight {
            animation: aiHighlightPulse 2s ease-in-out 3;
            border-radius: 8px;
        }
        @keyframes aiHighlightPulse {
            0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4); }
            50% { box-shadow: 0 0 0 6px rgba(147, 51, 234, 0); }
            100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
        }
        .ai-typing-indicator {
            display: flex; align-items: center; gap: 4px;
            padding: 10px 14px; background: #faf5ff;
            border-radius: 12px; border: 1px solid #e9d5ff;
            font-size: 12px; color: #7c3aed;
            width: fit-content; margin-bottom: 10px;
        }
        .ai-typing-indicator span {
            width: 6px; height: 6px; border-radius: 50%;
            background: #a855f7; animation: aiTypingBounce 1.4s infinite ease-in-out both;
        }
        .ai-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .ai-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aiTypingBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }
        .ai-learning-progress {
            position: fixed; top: 56px; left: 0; right: 0;
            height: 3px; background: #f0f0f0; z-index: 90;
        }
        .ai-learning-progress-fill {
            height: 100%; background: linear-gradient(90deg, #9333ea, #a855f7);
            transition: width 0.5s ease; width: 0%;
        }
        .ai-chat-bubble-left {
            display: flex; align-items: flex-start; gap: 8px;
            margin-bottom: 10px;
        }
        .ai-chat-bubble-avatar {
            width: 28px; height: 28px; border-radius: 50%;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 12px; flex-shrink: 0;
        }
        .ai-chat-bubble-text {
            background: #faf5ff; border: 1px solid #e9d5ff;
            border-radius: 12px; border-top-left-radius: 2px;
            padding: 10px 14px; font-size: 12px; color: var(--text-secondary);
            line-height: 1.6; max-width: 80%;
        }
        .ai-step-complete-toast {
            position: fixed; top: 70px; left: 50%; transform: translateX(-50%) translateY(-100px);
            background: linear-gradient(135deg, #9333ea, #7c3aed); color: white;
            padding: 10px 20px; border-radius: 24px; font-size: 13px;
            box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
            z-index: 200; transition: transform 0.4s ease;
            display: flex; align-items: center; gap: 8px;
        }
        .ai-step-complete-toast.show { transform: translateX(-50%) translateY(0); }
        .ai-report-suggestion-card {
            background: #faf5ff; border: 1px solid #e9d5ff;
            border-radius: 10px; padding: 14px; margin-top: 10px;
        }
        .ai-report-suggestion-card-title {
            font-weight: 600; color: #7c3aed; font-size: 13px;
            margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }
'''

# Insert CSS before the closing </style> tag
content = content.replace('        .ai-guide-close {', new_css + '        .ai-guide-close {')

# ===================== 2. 添加顶部进度条 HTML =====================
progress_html = '''
    <!-- AI 学习进度条 -->
    <div class="ai-learning-progress" id="aiLearningProgress">
        <div class="ai-learning-progress-fill" id="aiLearningProgressFill"></div>
    </div>

    <!-- AI 步骤完成提示 -->
    <div class="ai-step-complete-toast" id="aiStepCompleteToast">
        <i class="fas fa-check-circle"></i>
        <span id="aiStepCompleteText">步骤完成</span>
    </div>
'''
content = content.replace('    <!-- AI 学习报告弹窗 -->', progress_html + '    <!-- AI 学习报告弹窗 -->')

# ===================== 3. 重写 AI-first JS 部分 =====================
old_ai_js = '''        // ==================== AI-first 智能学习模式 ====================
        let aiGuideShown = false;
        let aiCurrentStep = 0;
        const aiGuideSteps = [
            { text: '欢迎来到 AI 智能学习模式！我会陪伴你完成整个学习过程。', actions: [{label:'开始导学',primary:true,action:'startAiGuidedLearning'},{label:'稍后',primary:false,action:'dismissAiGuide'}] },
            { text: '第一步：先阅读任务说明，了解学习目标和交付标准。', actions: [{label:'已阅读',primary:true,action:'nextAiGuide'},{label:'查看摘要',primary:false,action:'aiSummaryGuide'}] },
            { text: '第二步：学习右侧 AI 分析面板中的知识点掌握度，针对性补强。', actions: [{label:'知道了',primary:true,action:'nextAiGuide'}] },
            { text: '第三步：完成测评后，我会为你生成详细的学习报告和改进建议。', actions: [{label:'开始答题',primary:true,action:'nextAiGuide'}] },
        ];

        function showAiGuide() {
            const dialog = document.getElementById('aiGuideDialog');
            dialog.classList.add('show');
        }
        function dismissAiGuide() {
            document.getElementById('aiGuideDialog').classList.remove('show');
        }
        function nextAiGuide() {
            aiCurrentStep++;
            if (aiCurrentStep < aiGuideSteps.length) {
                const step = aiGuideSteps[aiCurrentStep];
                document.getElementById('aiGuideText').textContent = step.text;
                const actionsEl = document.getElementById('aiGuideActions');
                actionsEl.innerHTML = step.actions.map(a =>
                    `<button class="ai-guide-btn ${a.primary ? 'primary' : ''}" onclick="${a.action}()">${a.label}</button>`
                ).join('');
            } else {
                dismissAiGuide();
                aiCurrentStep = 0;
            }
        }
        function startAiGuidedLearning() {
            aiCurrentStep = 0;
            showAiGuide();
        }
        function aiSummaryGuide() {
            if (currentTaskId) handleAiSummary(currentTaskId);
            nextAiGuide();
        }

        // 在 showTaskLearningView 中延迟显示 AI 引导
        const originalShowTaskLearningView = showTaskLearningView;
        showTaskLearningView = function(taskId, mode) {
            originalShowTaskLearningView(taskId, mode);
            // 延迟显示 AI 引导
            if (!aiGuideShown) {
                aiGuideShown = true;
                setTimeout(() => showAiGuide(), 800);
            }
            // 渲染 AI 分析面板
            setTimeout(() => renderAiAnalysisPanel(), 300);
        };'''

new_ai_js = '''        // ==================== AI-first 智能学习模式 ====================
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

content = content.replace(old_ai_js, new_ai_js)

# ===================== 4. 修改 AI 报告，使其更丰富 =====================
old_report_func = '''        function showAiLearningReport(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const answers = quizAnswers[taskId] || {};
            const questions = task.assessment?.objectiveConfig?.questions || [];
            let correct = 0, wrong = 0, unanswered = 0;
            questions.forEach(q => {
                const ua = answers[q.id];
                if (ua === undefined) unanswered++;
                else if (String(ua) === String(q.answer) || (q.type === 'multiple' && Array.isArray(q.answer) && Array.isArray(ua) && q.answer.every(a => ua.includes(a)))) correct++;
                else wrong++;
            });
            const score = questions.reduce((sum, q) => {
                const ua = answers[q.id];
                if (ua === undefined) return sum;
                if (String(ua) === String(q.answer) || (q.type === 'multiple' && Array.isArray(q.answer) && Array.isArray(ua) && q.answer.every(a => ua.includes(a)))) return sum + (q.score || 0);
                return sum;
            }, 0);
            const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
            const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

            const reportBody = document.getElementById('aiReportBody');
            reportBody.innerHTML = `
                <div class="ai-report-grid">
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${score}</div>
                        <div class="ai-report-stat-label">得分 / ${totalScore}</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${accuracy}%</div>
                        <div class="ai-report-stat-label">正确率</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${correct}</div>
                        <div class="ai-report-stat-label">答对 ${questions.length} 题</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="ai-analysis-card" style="margin-bottom:0;">
                        <div class="ai-analysis-card-header"><i class="fas fa-check-circle"></i> 答题表现</div>
                        <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
                            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #f0f0f0;">
                                <span style="color:var(--text-secondary);">答对</span><span style="color:#22c55e;font-weight:500;">${correct} 题</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #f0f0f0;">
                                <span style="color:var(--text-secondary);">答错</span><span style="color:#ef4444;font-weight:500;">${wrong} 题</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:6px 0;">
                                <span style="color:var(--text-secondary);">未答</span><span style="color:var(--text-tertiary);font-weight:500;">${unanswered} 题</span>
                            </div>
                        </div>
                    </div>
                    <div class="ai-analysis-card" style="margin-bottom:0;">
                        <div class="ai-analysis-card-header"><i class="fas fa-brain"></i> 能力分析</div>
                        <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">知识理解</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${Math.min(accuracy + 10, 100)}%;background:#9333ea;"></div></div>
                                <span class="ai-progress-value">${Math.min(accuracy + 10, 100)}%</span>
                            </div>
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">应用能力</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${Math.max(accuracy - 10, 20)}%;background:#a855f7;"></div></div>
                                <span class="ai-progress-value">${Math.max(accuracy - 10, 20)}%</span>
                            </div>
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">分析能力</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${accuracy}%;background:#c4b5fd;"></div></div>
                                <span class="ai-progress-value">${accuracy}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ai-analysis-card" style="margin-top:16px;">
                    <div class="ai-analysis-card-header"><i class="fas fa-wand-magic-sparkles"></i> AI 改进建议</div>
                    <div class="ai-insight-item">
                        <i class="fas fa-star ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>优势领域：</strong>你在${correct > wrong ? '基础概念理解' : '部分知识点'}方面表现良好，继续保持。</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-arrow-up ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>提升空间：</strong>建议加强对${task.knowledgePoints?.map(id => getKnowledgePointById(id)?.name).filter(Boolean).slice(0, 1).join('') || '核心知识点'}的深入理解。</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-book ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>推荐资源：</strong>查看关联资源中的重点材料，针对性补强薄弱环节。</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-clock ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>时间建议：</strong>建议在下次学习时预留更多时间进行实践练习。</span>
                    </div>
                </div>
            `;
            document.getElementById('aiReportOverlay').classList.add('active');
        }'''

new_report_func = '''        function showAiLearningReport(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const answers = quizAnswers[taskId] || {};
            const questions = task.assessment?.objectiveConfig?.questions || [];
            let correct = 0, wrong = 0, unanswered = 0;
            questions.forEach(q => {
                const ua = answers[q.id];
                if (ua === undefined) unanswered++;
                else if (String(ua) === String(q.answer) || (q.type === 'multiple' && Array.isArray(q.answer) && Array.isArray(ua) && q.answer.every(a => ua.includes(a)))) correct++;
                else wrong++;
            });
            const score = questions.reduce((sum, q) => {
                const ua = answers[q.id];
                if (ua === undefined) return sum;
                if (String(ua) === String(q.answer) || (q.type === 'multiple' && Array.isArray(q.answer) && Array.isArray(ua) && q.answer.every(a => ua.includes(a)))) return sum + (q.score || 0);
                return sum;
            }, 0);
            const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
            const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
            const grade = accuracy >= 90 ? 'A' : accuracy >= 75 ? 'B' : accuracy >= 60 ? 'C' : 'D';
            const gradeColor = accuracy >= 90 ? '#22c55e' : accuracy >= 75 ? '#3b82f6' : accuracy >= 60 ? '#f97316' : '#ef4444';
            const gradeDesc = accuracy >= 90 ? '表现卓越，完全掌握核心知识点' : accuracy >= 75 ? '表现良好，大部分内容已掌握' : accuracy >= 60 ? '基本达标，部分知识点需要巩固' : '未达标准，建议重新学习后再次测评';

            const abilities = (task.abilityPoints || []).map(id => getAbilityPointById(id)).filter(Boolean);
            const kps = getTaskKnowledgePoints(task);

            // 错题分析
            let wrongQuestionsHtml = '';
            const wrongQs = questions.filter(q => {
                const ua = answers[q.id];
                return ua !== undefined && String(ua) !== String(q.answer) && !(q.type === 'multiple' && Array.isArray(q.answer) && Array.isArray(ua) && q.answer.every(a => ua.includes(a)));
            });
            if (wrongQs.length > 0) {
                wrongQuestionsHtml = `<div class="ai-report-suggestion-card">
                    <div class="ai-report-suggestion-card-title"><i class="fas fa-times-circle"></i> 错题分析（${wrongQs.length} 题）</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${wrongQs.map((q, i) => `
                            <div style="background:white;border:1px solid #f0f0f0;border-radius:6px;padding:10px;">
                                <div style="font-size:12px;font-weight:500;color:var(--text-primary);margin-bottom:4px;">${i+1}. ${q.content.substring(0, 60)}${q.content.length>60?'...':''}</div>
                                <div style="font-size:11px;color:#ef4444;">你的答案：${Array.isArray(answers[q.id]) ? answers[q.id].join('、') : (answers[q.id] || '未作答')}</div>
                                <div style="font-size:11px;color:#22c55e;">正确答案：${Array.isArray(q.answer) ? q.answer.join('、') : q.answer}</div>
                                <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px;"><i class="fas fa-lightbulb" style="color:#f59e0b;"></i> 涉及知识点：${kps[0]?.name || '核心概念'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }

            const reportBody = document.getElementById('aiReportBody');
            reportBody.innerHTML = `
                <div class="ai-report-grid">
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value" style="color:${gradeColor};">${grade}</div>
                        <div class="ai-report-stat-label">综合等级</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${score}</div>
                        <div class="ai-report-stat-label">得分 / ${totalScore}</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${accuracy}%</div>
                        <div class="ai-report-stat-label">正确率</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${correct}/${questions.length}</div>
                        <div class="ai-report-stat-label">答对/总题</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${wrong}</div>
                        <div class="ai-report-stat-label">答错</div>
                    </div>
                    <div class="ai-report-stat">
                        <div class="ai-report-stat-value">${unanswered}</div>
                        <div class="ai-report-stat-label">未答</div>
                    </div>
                </div>
                <div style="background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:1px solid #e9d5ff;border-radius:10px;padding:14px;margin-bottom:16px;">
                    <div style="font-weight:600;color:#7c3aed;margin-bottom:6px;font-size:14px;"><i class="fas fa-robot"></i> AI 综合评语</div>
                    <div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">${gradeDesc}</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="ai-analysis-card" style="margin-bottom:0;">
                        <div class="ai-analysis-card-header"><i class="fas fa-chart-bar"></i> 能力雷达</div>
                        <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">知识理解</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${Math.min(accuracy + (correct>wrong?10:0), 100)}%;background:#9333ea;"></div></div>
                                <span class="ai-progress-value">${Math.min(accuracy + (correct>wrong?10:0), 100)}%</span>
                            </div>
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">应用能力</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${Math.max(accuracy - (wrong>correct?15:5), 20)}%;background:#a855f7;"></div></div>
                                <span class="ai-progress-value">${Math.max(accuracy - (wrong>correct?15:5), 20)}%</span>
                            </div>
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">分析推理</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${accuracy}%;background:#c4b5fd;"></div></div>
                                <span class="ai-progress-value">${accuracy}%</span>
                            </div>
                            <div class="ai-progress-item">
                                <span class="ai-progress-label" style="width:70px;">综合素养</span>
                                <div class="ai-progress-track"><div class="ai-progress-fill" style="width:${Math.round((accuracy + (unanswered===0?10:0))/1.1)}%;background:#d8b4fe;"></div></div>
                                <span class="ai-progress-value">${Math.round((accuracy + (unanswered===0?10:0))/1.1)}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="ai-analysis-card" style="margin-bottom:0;">
                        <div class="ai-analysis-card-header"><i class="fas fa-tags"></i> 能力标签</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            ${abilities.slice(0,6).map((a,i) => `<span style="padding:3px 10px;background:${['#f3e8ff','#faf5ff','#fdf4ff'][i%3]};color:#7c3aed;border-radius:12px;font-size:11px;border:1px solid #e9d5ff;">${a.name}</span>`).join('') || '<span style="font-size:12px;color:var(--text-tertiary);">暂无数据</span>'}
                        </div>
                        <div style="margin-top:10px;font-size:12px;color:var(--text-secondary);">
                            <div style="margin-bottom:6px;"><i class="fas fa-star" style="color:#f59e0b;"></i> <strong>最强能力：</strong>${abilities[0]?.name || '综合应用'}</div>
                            <div><i class="fas fa-arrow-up" style="color:#22c55e;"></i> <strong>成长空间：</strong>${abilities[1]?.name || '分析推理'}</div>
                        </div>
                    </div>
                </div>
                ${wrongQuestionsHtml}
                <div class="ai-report-suggestion-card" style="margin-top:16px;">
                    <div class="ai-report-suggestion-card-title"><i class="fas fa-wand-magic-sparkles"></i> AI 个性化学习建议</div>
                    <div class="ai-insight-item">
                        <i class="fas fa-bullseye ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>目标达成：</strong>${accuracy >= 80 ? '已达成学习目标，可以进入下一任务' : accuracy >= 60 ? '基本达成目标，建议复习后再次测评' : '建议重新学习本任务内容后再测评'}</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-book-open ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>重点复习：</strong>《${kps[0]?.name || '核心知识点'}》和《${kps[1]?.name || '进阶技能'}》</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-route ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>推荐路径：</strong>${accuracy >= 80 ? '进入下一任务继续学习' : '先复习错题，再针对性练习'}</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-clock ai-insight-icon"></i>
                        <span class="ai-insight-text"><strong>时间规划：</strong>建议预留 ${Math.ceil((task.estimatedHours || 8) * (accuracy >= 80 ? 0.3 : 0.6))} 课时进行复习巩固</span>
                    </div>
                </div>
                <div style="text-align:center;margin-top:20px;">
                    <button class="ai-guide-btn primary" style="padding:10px 28px;font-size:14px;" onclick="closeAiReport();showStepToast('AI 报告已保存至学习记录')">
                        <i class="fas fa-check"></i> 确认并关闭报告
                    </button>
                </div>
            `;
            document.getElementById('aiReportOverlay').classList.add('active');
            updateAiProgress(100);
        }'''

content = content.replace(old_report_func, new_report_func)

with open('/root/zhiyu-scene/public/student_3.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('student_3.html fixed successfully')
