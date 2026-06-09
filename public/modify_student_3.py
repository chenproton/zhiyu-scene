#!/usr/bin/env python3
import re

with open('/root/zhiyu-scene/public/student_3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ==================== 1. 插入 AI-first CSS ====================
ai_css = '''
        /* ====== AI-first 智能学习模式样式 ====== */
        .ai-first-badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 4px 12px; border-radius: 20px;
            font-size: 12px; font-weight: 600;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        }
        .ai-first-header-bar {
            background: linear-gradient(135deg, #faf5ff, #f3e8ff);
            border: 1px solid #e9d5ff;
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .ai-first-header-title {
            display: flex; align-items: center; gap: 10px;
            font-size: 16px; font-weight: 600; color: #7c3aed;
        }
        .ai-first-header-desc {
            font-size: 12px; color: var(--text-secondary); margin-top: 2px;
        }

        .ai-nav-steps {
            display: flex; flex-direction: column; gap: 0;
            margin-bottom: 16px;
        }
        .ai-nav-step {
            display: flex; align-items: flex-start; gap: 12px;
            padding: 12px 14px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }
        .ai-nav-step:hover { background: #faf5ff; }
        .ai-nav-step.active { background: #f3e8ff; border: 1px solid #d8b4fe; }
        .ai-nav-step-connector {
            position: absolute; left: 25px; top: 44px; width: 2px; height: 20px;
            background: #e9d5ff;
        }
        .ai-nav-step-num {
            width: 28px; height: 28px; border-radius: 50%;
            background: #e9d5ff; color: #7c3aed;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 600; flex-shrink: 0;
        }
        .ai-nav-step.active .ai-nav-step-num {
            background: linear-gradient(135deg, #9333ea, #7c3aed); color: white;
        }
        .ai-nav-step.completed .ai-nav-step-num {
            background: #22c55e; color: white;
        }
        .ai-nav-step-content { flex: 1; }
        .ai-nav-step-name { font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .ai-nav-step-desc { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }

        .ai-chat-entry {
            background: linear-gradient(135deg, #faf5ff, #f3e8ff);
            border: 1px solid #e9d5ff;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 16px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ai-chat-entry:hover {
            border-color: #a855f7;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
            transform: translateY(-1px);
        }
        .ai-chat-avatar {
            width: 40px; height: 40px; border-radius: 50%;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 16px; flex-shrink: 0;
        }
        .ai-chat-text { flex: 1; }
        .ai-chat-text-title { font-weight: 500; font-size: 14px; color: var(--text-primary); }
        .ai-chat-text-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

        .ai-analysis-card {
            background: var(--bg-white);
            border: 1px solid #f0f0f0;
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .ai-analysis-card-header {
            display: flex; align-items: center; gap: 8px;
            font-weight: 600; font-size: 13px; color: var(--text-primary);
            margin-bottom: 10px;
        }
        .ai-analysis-card-header i { color: #9333ea; }

        .ai-radar-placeholder {
            width: 120px; height: 120px;
            border-radius: 50%;
            background: conic-gradient(
                #9333ea 0deg 120deg,
                #a855f7 120deg 200deg,
                #c4b5fd 200deg 280deg,
                #e9d5ff 280deg 360deg
            );
            margin: 0 auto 10px;
            position: relative;
        }
        .ai-radar-placeholder::after {
            content: '';
            position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px;
            background: white; border-radius: 50%;
        }
        .ai-radar-labels {
            display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
            font-size: 11px;
        }
        .ai-radar-label { display: flex; align-items: center; gap: 4px; }
        .ai-radar-dot { width: 8px; height: 8px; border-radius: 2px; }

        .ai-progress-item {
            display: flex; align-items: center; gap: 8px;
            margin-bottom: 8px;
        }
        .ai-progress-item:last-child { margin-bottom: 0; }
        .ai-progress-label { font-size: 12px; color: var(--text-secondary); width: 60px; }
        .ai-progress-track {
            flex: 1; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden;
        }
        .ai-progress-fill {
            height: 100%; border-radius: 3px; transition: width 0.5s;
        }
        .ai-progress-value { font-size: 11px; color: var(--text-tertiary); width: 32px; text-align: right; }

        .ai-insight-item {
            display: flex; align-items: flex-start; gap: 8px;
            padding: 8px 0;
            border-bottom: 1px dashed #f0f0f0;
            font-size: 12px;
        }
        .ai-insight-item:last-child { border-bottom: none; padding-bottom: 0; }
        .ai-insight-icon { color: #9333ea; font-size: 12px; margin-top: 2px; }
        .ai-insight-text { color: var(--text-secondary); line-height: 1.5; }

        .ai-report-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); z-index: 3000;
            display: none; align-items: center; justify-content: center;
        }
        .ai-report-overlay.active { display: flex; }
        .ai-report-box {
            background: white; border-radius: 16px;
            width: 720px; max-width: 95vw; max-height: 90vh;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            display: flex; flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.4s ease;
        }
        .ai-report-header {
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            padding: 20px 24px;
            display: flex; align-items: center; justify-content: space-between;
        }
        .ai-report-header-title { font-size: 18px; font-weight: 600; }
        .ai-report-header-desc { font-size: 13px; opacity: 0.85; margin-top: 2px; }
        .ai-report-close {
            width: 32px; height: 32px; border-radius: 50%;
            border: none; background: rgba(255,255,255,0.2); color: white;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .ai-report-close:hover { background: rgba(255,255,255,0.35); }
        .ai-report-body {
            flex: 1; overflow-y: auto; padding: 24px;
        }
        .ai-report-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
            margin-bottom: 20px;
        }
        .ai-report-stat {
            background: #faf5ff; border: 1px solid #e9d5ff;
            border-radius: 10px; padding: 16px; text-align: center;
        }
        .ai-report-stat-value { font-size: 24px; font-weight: 700; color: #7c3aed; }
        .ai-report-stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

        .ai-guide-dialog {
            position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(120%);
            background: white; border-radius: 12px; padding: 16px 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            border: 1px solid #e9d5ff;
            z-index: 85;
            max-width: 600px; width: 90vw;
            transition: transform 0.4s ease;
            display: flex; align-items: flex-start; gap: 12px;
        }
        .ai-guide-dialog.show { transform: translateX(-50%) translateY(0); }
        .ai-guide-avatar {
            width: 36px; height: 36px; border-radius: 50%;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 14px; flex-shrink: 0;
        }
        .ai-guide-content { flex: 1; }
        .ai-guide-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
        .ai-guide-actions { display: flex; gap: 8px; margin-top: 10px; }
        .ai-guide-btn {
            padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer;
            border: 1px solid #d8b4fe; background: #faf5ff; color: #7c3aed;
            transition: all 0.2s;
        }
        .ai-guide-btn:hover { background: #f3e8ff; }
        .ai-guide-btn.primary {
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white; border: none;
        }
        .ai-guide-btn.primary:hover { opacity: 0.9; }
        .ai-guide-close {
            width: 24px; height: 24px; border-radius: 50%;
            border: none; background: transparent; color: var(--text-tertiary);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 12px;
        }
        .ai-guide-close:hover { background: #f0f0f0; }
'''

content = content.replace('    </style>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>', ai_css + '    </style>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>')

# ==================== 2. 修改 taskLearningView 顶部添加 AI-first 标识 ====================
old_tl_header = '''            <div class="tl-title-row">
                    <h2 class="tl-task-name" id="tlTaskName"'''
new_tl_header = '''            <div class="ai-first-header-bar" id="aiFirstHeaderBar">
                    <div>
                        <div class="ai-first-header-title"><i class="fas fa-robot"></i> AI 智能学习模式</div>
                        <div class="ai-first-header-desc">AI 将为你定制个性化学习路径，实时分析学习状态</div>
                    </div>
                    <span class="ai-first-badge"><i class="fas fa-bolt"></i> AI 主导</span>
                </div>
                <div class="tl-title-row">
                    <h2 class="tl-task-name" id="tlTaskName"'''
content = content.replace(old_tl_header, new_tl_header)

# ==================== 3. 替换右侧面板为 AI 智能分析面板 ====================
old_right_panel = '''                <!-- 右侧列 -->
                <div class="tl-right">
                    <div class="tl-side-panel">
                        <div class="tl-side-tabs">
                            <div class="tl-side-tab active" data-side-tab="knowledge" onclick="switchSideTab('knowledge')">
                                <i class="fas fa-lightbulb"></i> 关联知识点
                            </div>
                            <div class="tl-side-tab" data-side-tab="ability" onclick="switchSideTab('ability')">
                                <i class="fas fa-star"></i> 关联能力点
                            </div>
                            <div class="tl-side-tab" data-side-tab="resource" onclick="switchSideTab('resource')">
                                <i class="fas fa-folder-open"></i> 配套资源
                            </div>
                        </div>
                        <div class="tl-side-body" id="tlSideBody"></div>
                    </div>
                </div>'''

new_right_panel = '''                <!-- 右侧列：AI 智能分析面板 -->
                <div class="tl-right">
                    <div class="tl-side-panel" style="min-height: auto;">
                        <div class="tl-side-tabs">
                            <div class="tl-side-tab active" data-side-tab="ai-analysis" onclick="switchAiAnalysisTab('ai-analysis')">
                                <i class="fas fa-chart-pie"></i> AI 学习分析
                            </div>
                            <div class="tl-side-tab" data-side-tab="ai-path" onclick="switchAiAnalysisTab('ai-path')">
                                <i class="fas fa-route"></i> 学习路径
                            </div>
                        </div>
                        <div class="tl-side-body" id="aiAnalysisBody">
                            <!-- AI 分析内容由 JS 渲染 -->
                        </div>
                    </div>
                </div>'''
content = content.replace(old_right_panel, new_right_panel)

# ==================== 4. 在学习面板前添加 AI 导学入口 ====================
old_learning_panel = '''                    <!-- 学习面板 -->
                    <div class="tl-panel" id="learningPanel">'''
new_learning_panel = '''                    <!-- AI 导学入口 -->
                    <div class="ai-chat-entry" onclick="startAiGuidedLearning()">
                        <div class="ai-chat-avatar"><i class="fas fa-robot"></i></div>
                        <div class="ai-chat-text">
                            <div class="ai-chat-text-title">开启 AI 导学</div>
                            <div class="ai-chat-text-desc">让 AI 分步骤引导你完成本任务的学习与测评</div>
                        </div>
                        <i class="fas fa-chevron-right" style="color:#d8b4fe;"></i>
                    </div>

                    <!-- 学习面板 -->
                    <div class="tl-panel" id="learningPanel">'''
content = content.replace(old_learning_panel, new_learning_panel)

# ==================== 5. 在 </main> 前插入 AI 报告弹窗和底部引导对话框 ====================
ai_modals = '''
    <!-- AI 学习报告弹窗 -->
    <div class="ai-report-overlay" id="aiReportOverlay" onclick="if(event.target===this)closeAiReport()">
        <div class="ai-report-box">
            <div class="ai-report-header">
                <div>
                    <div class="ai-report-header-title"><i class="fas fa-robot"></i> AI 学习报告</div>
                    <div class="ai-report-header-desc">基于你的答题表现，AI 生成的个性化学习分析</div>
                </div>
                <button class="ai-report-close" onclick="closeAiReport()"><i class="fas fa-times"></i></button>
            </div>
            <div class="ai-report-body" id="aiReportBody">
                <!-- 动态生成 -->
            </div>
        </div>
    </div>

    <!-- AI 底部引导对话框 -->
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
    </div>
'''
content = content.replace('    </main>', ai_modals + '    </main>')

# ==================== 6. 修改测评提交后的行为 ====================
# 修改 submitQuiz 函数，提交后显示 AI 报告按钮
old_submit_quiz = '''        function submitQuiz(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const answers = quizAnswers[taskId] || {};
            const questions = task.assessment?.objectiveConfig?.questions || [];
            if (questions.length > 0 && Object.keys(answers).length === 0) {
                alert('请至少作答一道题目');
                return;
            }
            quizSubmitted[taskId] = true;
            renderAssessmentPanel(task);
            renderSubmissionBar(task);
        }'''
new_submit_quiz = '''        function submitQuiz(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const answers = quizAnswers[taskId] || {};
            const questions = task.assessment?.objectiveConfig?.questions || [];
            if (questions.length > 0 && Object.keys(answers).length === 0) {
                alert('请至少作答一道题目');
                return;
            }
            quizSubmitted[taskId] = true;
            renderAssessmentPanel(task);
            renderSubmissionBar(task);
            // AI-first 模式：提交后自动弹出 AI 报告
            setTimeout(() => showAiLearningReport(taskId), 600);
        }'''
content = content.replace(old_submit_quiz, new_submit_quiz)

# ==================== 7. 插入 AI-first JS 功能代码 ====================
ai_first_js = '''
        // ==================== AI-first 智能学习模式 ====================
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
        };

        function switchAiAnalysisTab(tab) {
            document.querySelectorAll('.tl-side-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tl-side-tab[data-side-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');
            if (tab === 'ai-analysis') renderAiAnalysisPanel();
            else if (tab === 'ai-path') renderAiPathPanel();
        }

        function renderAiAnalysisPanel() {
            const body = document.getElementById('aiAnalysisBody');
            if (!body) return;
            const task = currentLearningTask;
            const kps = task ? getTaskKnowledgePoints(task) : [];
            const abilities = task ? (task.abilityPoints || []).map(id => getAbilityPointById(id)).filter(Boolean) : [];

            body.innerHTML = `
                <div class="ai-analysis-card">
                    <div class="ai-analysis-card-header"><i class="fas fa-chart-pie"></i> 能力掌握度预估</div>
                    <div class="ai-radar-placeholder"></div>
                    <div class="ai-radar-labels">
                        <div class="ai-radar-label"><span class="ai-radar-dot" style="background:#9333ea;"></span> 优秀</div>
                        <div class="ai-radar-label"><span class="ai-radar-dot" style="background:#a855f7;"></span> 良好</div>
                        <div class="ai-radar-label"><span class="ai-radar-dot" style="background:#c4b5fd;"></span> 一般</div>
                        <div class="ai-radar-label"><span class="ai-radar-dot" style="background:#e9d5ff;"></span> 待提升</div>
                    </div>
                </div>
                <div class="ai-analysis-card">
                    <div class="ai-analysis-card-header"><i class="fas fa-brain"></i> 知识点掌握进度</div>
                    <div class="ai-progress-item">
                        <span class="ai-progress-label">React</span>
                        <div class="ai-progress-track"><div class="ai-progress-fill" style="width:75%;background:#9333ea;"></div></div>
                        <span class="ai-progress-value">75%</span>
                    </div>
                    <div class="ai-progress-item">
                        <span class="ai-progress-label">TypeScript</span>
                        <div class="ai-progress-track"><div class="ai-progress-fill" style="width:60%;background:#a855f7;"></div></div>
                        <span class="ai-progress-value">60%</span>
                    </div>
                    <div class="ai-progress-item">
                        <span class="ai-progress-label">Node.js</span>
                        <div class="ai-progress-track"><div class="ai-progress-fill" style="width:45%;background:#c4b5fd;"></div></div>
                        <span class="ai-progress-value">45%</span>
                    </div>
                    <div class="ai-progress-item">
                        <span class="ai-progress-label">数据库</span>
                        <div class="ai-progress-track"><div class="ai-progress-fill" style="width:80%;background:#9333ea;"></div></div>
                        <span class="ai-progress-value">80%</span>
                    </div>
                </div>
                <div class="ai-analysis-card">
                    <div class="ai-analysis-card-header"><i class="fas fa-lightbulb"></i> AI 学习建议</div>
                    <div class="ai-insight-item">
                        <i class="fas fa-arrow-trend-up ai-insight-icon"></i>
                        <span class="ai-insight-text">你的数据库设计基础较好，可将重点放在后端接口开发上</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-clock ai-insight-icon"></i>
                        <span class="ai-insight-text">预计完成本任务需要 ${task?.estimatedHours || 8} 课时，建议分 ${Math.ceil((task?.estimatedHours || 8) / 2)} 次完成</span>
                    </div>
                    <div class="ai-insight-item">
                        <i class="fas fa-triangle-exclamation ai-insight-icon"></i>
                        <span class="ai-insight-text">TypeScript 泛型是你的薄弱点，建议额外练习</span>
                    </div>
                </div>
                <div class="ai-analysis-card">
                    <div class="ai-analysis-card-header"><i class="fas fa-star"></i> 关联能力点</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;">
                        ${abilities.slice(0, 5).map(a => `<span style="padding:3px 10px;background:#f3e8ff;color:#7c3aed;border-radius:12px;font-size:11px;">${a.name}</span>`).join('') || '<span style="font-size:12px;color:var(--text-tertiary);">暂无数据</span>'}
                    </div>
                </div>
            `;
        }

        function renderAiPathPanel() {
            const body = document.getElementById('aiAnalysisBody');
            if (!body) return;
            const task = currentLearningTask;
            body.innerHTML = `
                <div class="ai-analysis-card">
                    <div class="ai-analysis-card-header"><i class="fas fa-route"></i> AI 推荐学习路径</div>
                    <div class="ai-nav-steps">
                        <div class="ai-nav-step active">
                            <div class="ai-nav-step-num"><i class="fas fa-book-open" style="font-size:10px;"></i></div>
                            <div class="ai-nav-step-content">
                                <div class="ai-nav-step-name">理解任务目标</div>
                                <div class="ai-nav-step-desc">阅读任务说明，明确交付标准</div>
                            </div>
                        </div>
                        <div class="ai-nav-step">
                            <div class="ai-nav-step-connector"></div>
                            <div class="ai-nav-step-num">2</div>
                            <div class="ai-nav-step-content">
                                <div class="ai-nav-step-name">学习核心知识点</div>
                                <div class="ai-nav-step-desc">${task?.knowledgePoints?.map(id => getKnowledgePointById(id)?.name).filter(Boolean).slice(0, 2).join('\u3001') || '关联知识点'}</div>
                            </div>
                        </div>
                        <div class="ai-nav-step">
                            <div class="ai-nav-step-connector"></div>
                            <div class="ai-nav-step-num">3</div>
                            <div class="ai-nav-step-content">
                                <div class="ai-nav-step-name">完成测评练习</div>
                                <div class="ai-nav-step-desc">客观题 + 主观评审</div>
                            </div>
                        </div>
                        <div class="ai-nav-step">
                            <div class="ai-nav-step-connector"></div>
                            <div class="ai-nav-step-num">4</div>
                            <div class="ai-nav-step-content">
                                <div class="ai-nav-step-name">提交并获取 AI 反馈</div>
                                <div class="ai-nav-step-desc">查看个性化学习报告</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ai-analysis-card">
                    <div class="ai-analysis-card-header"><i class="fas fa-bullseye"></i> 难度自适应</div>
                    <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
                        <p>AI 检测到你的基础水平为 <strong style="color:#7c3aed;">中等偏上</strong>，已将本任务的学习建议调整如下：</p>
                        <ul style="padding-left:16px;margin-top:6px;">
                            <li>跳过基础概念回顾</li>
                            <li>重点攻克实战案例</li>
                            <li>增加扩展阅读材料</li>
                        </ul>
                    </div>
                </div>
            `;
        }

        function showAiLearningReport(taskId) {
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
        }

        function closeAiReport() {
            document.getElementById('aiReportOverlay').classList.remove('active');
        }

        // 覆盖原版的 switchSideTab，让资源面板也能正常显示
        const originalSwitchSideTab = switchSideTab;
        switchSideTab = function(tab) {
            if (tab === 'knowledge' || tab === 'ability' || tab === 'resource') {
                originalSwitchSideTab(tab);
            }
        };

        // AI 摘要（复用 student_2 的功能）
        function handleAiSummary(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const descEl = document.getElementById('tlTaskDesc');
            const knowledges = task.knowledgePoints?.map(id => getKnowledgePointById(id)?.name).filter(Boolean) || [];
            const abilities = task.abilityPoints?.map(id => getAbilityPointById(id)?.name).filter(Boolean) || [];
            const deliverables = task.deliverables?.map(d => d.name) || [];
            const summaryHtml = `
                <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:12px;margin-bottom:12px;">
                    <div style="font-weight:600;color:#7c3aed;margin-bottom:6px;font-size:13px;"><i class="fas fa-sparkles"></i> AI 智能摘要</div>
                    <div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">
                        <p><strong>一句话概括：</strong>${task.description}</p>
                        <p style="margin-top:6px;"><strong>关键要点：</strong></p>
                        <ul style="padding-left:16px;">
                            <li>掌握${knowledges.slice(0, 2).join('\u3001') || '核心知识点'}</li>
                            <li>运用${abilities.slice(0, 2).join('\u3001') || '专业技能'}</li>
                            <li>完成${deliverables.slice(0, 2).join('\u3001') || '指定交付物'}</li>
                        </ul>
                        <p style="margin-top:6px;"><i class="fas fa-clock" style="color:#9333ea;"></i> 建议用时：${task.estimatedHours}课时 | 难度：${'\u2605'.repeat(task.difficulty || 1)}${'\u2606'.repeat(5 - (task.difficulty || 1))}</p>
                    </div>
                </div>
            `;
            descEl.innerHTML = summaryHtml + (task.detailedDescription || task.description || '');
        }
'''

content = content.replace('        init();', ai_first_js + '\n        init();')

with open('/root/zhiyu-scene/public/student_3.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('student_3.html modified successfully')
