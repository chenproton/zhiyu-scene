#!/usr/bin/env python3
import re

with open('/root/zhiyu-scene/public/student_2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ==================== 1. 插入 AI 辅助 CSS ====================
ai_css = '''
        /* ====== AI 辅助学习样式 ====== */
        .ai-purple { color: #7c3aed; }
        .ai-purple-bg { background: #7c3aed; }
        .ai-purple-light { background: #f3e8ff; }
        .ai-purple-border { border-color: #d8b4fe; }
        
        .ai-float-btn {
            position: fixed;
            right: 24px;
            bottom: 100px;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
            transition: all 0.3s;
            z-index: 80;
        }
        .ai-float-btn:hover { transform: scale(1.1) rotate(-5deg); box-shadow: 0 6px 24px rgba(124, 58, 237, 0.45); }
        .ai-float-btn.pulse { animation: aiPulse 2s infinite; }
        @keyframes aiPulse {
            0% { box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
            50% { box-shadow: 0 4px 24px rgba(124, 58, 237, 0.6); }
            100% { box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
        }

        .ai-sidebar-panel {
            position: fixed;
            top: 56px;
            right: -380px;
            width: 380px;
            max-width: 90vw;
            height: calc(100vh - 56px);
            background: var(--bg-white);
            box-shadow: -4px 0 24px rgba(0,0,0,0.1);
            border-left: 1px solid #f0f0f0;
            transition: right 0.35s ease;
            display: flex;
            flex-direction: column;
            z-index: 95;
        }
        .ai-sidebar-panel.open { right: 0; }
        .ai-sidebar-header {
            padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #faf5ff, #f3e8ff);
        }
        .ai-sidebar-avatar {
            width: 40px; height: 40px; border-radius: 50%;
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 18px;
        }
        .ai-sidebar-title { font-weight: 600; font-size: 15px; color: var(--text-primary); }
        .ai-sidebar-subtitle { font-size: 12px; color: var(--text-secondary); }
        .ai-sidebar-close {
            width: 28px; height: 28px; border-radius: 6px;
            border: none; background: transparent; color: var(--text-tertiary);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            margin-left: auto;
        }
        .ai-sidebar-close:hover { background: #f0f0f0; color: var(--text-primary); }
        .ai-sidebar-body { flex: 1; overflow-y: auto; padding: 16px; }
        .ai-action-btn {
            display: flex; align-items: center; gap: 8px;
            padding: 10px 14px;
            border: 1px solid #d8b4fe;
            border-radius: 8px;
            background: #faf5ff;
            color: #7c3aed;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            margin-bottom: 8px;
            width: 100%;
        }
        .ai-action-btn:hover { background: #f3e8ff; border-color: #a855f7; transform: translateX(2px); }
        .ai-action-btn i { font-size: 14px; }
        .ai-action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .ai-output-box {
            background: #faf5ff;
            border: 1px solid #e9d5ff;
            border-radius: 10px;
            padding: 14px;
            margin-top: 12px;
            font-size: 13px;
            line-height: 1.7;
            color: var(--text-secondary);
            animation: fadeIn 0.3s ease;
        }
        .ai-output-box .ai-output-title {
            font-weight: 600;
            color: #7c3aed;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
        }
        .ai-output-box ul { padding-left: 16px; margin: 6px 0; }
        .ai-output-box li { margin-bottom: 4px; }

        .ai-loading-dots {
            display: flex; align-items: center; gap: 4px;
            padding: 12px; color: #7c3aed; font-size: 13px;
        }
        .ai-loading-dots span {
            width: 6px; height: 6px; border-radius: 50%;
            background: #a855f7; animation: aiDotBounce 1.4s infinite ease-in-out both;
        }
        .ai-loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .ai-loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes aiDotBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        .ai-hint-btn {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 4px 10px; border-radius: 4px;
            border: 1px solid #d8b4fe; background: #faf5ff;
            color: #7c3aed; font-size: 12px; cursor: pointer;
            transition: all 0.2s; margin-left: 8px;
        }
        .ai-hint-btn:hover { background: #f3e8ff; }
        .ai-hint-popup {
            background: #faf5ff; border: 1px solid #e9d5ff;
            border-radius: 8px; padding: 12px;
            margin-top: 8px; font-size: 12px;
            color: var(--text-secondary); line-height: 1.6;
        }

        .ai-summary-bar {
            display: flex; align-items: center; gap: 8px;
            padding: 8px 12px;
            background: linear-gradient(135deg, #faf5ff, #f3e8ff);
            border: 1px solid #e9d5ff;
            border-radius: 8px;
            margin-bottom: 12px;
            font-size: 13px;
        }
        .ai-summary-bar i { color: #9333ea; }
        .ai-summary-bar button {
            margin-left: auto;
            padding: 4px 12px; border-radius: 4px;
            border: 1px solid #d8b4fe; background: white;
            color: #7c3aed; font-size: 12px; cursor: pointer;
        }
        .ai-summary-bar button:hover { background: #f3e8ff; }

        .ai-badge {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 2px 8px; border-radius: 10px;
            font-size: 11px; font-weight: 500;
            background: #f3e8ff; color: #7c3aed;
        }
        .ai-score-card {
            background: linear-gradient(135deg, #faf5ff, #f3e8ff);
            border: 1px solid #e9d5ff;
            border-radius: 10px;
            padding: 16px;
            margin-top: 12px;
        }
        .ai-score-card-title {
            font-weight: 600;
            color: #7c3aed;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
        }
        .ai-score-item {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px dashed #e9d5ff;
            font-size: 13px;
        }
        .ai-score-item:last-child { border-bottom: none; }
'''

# Insert CSS before </style>
content = content.replace('    </style>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>', ai_css + '    </style>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>')

# ==================== 2. 修改 taskLearningView 的 tl-header 添加 AI 标识 ====================
old_tl_header = '''            <div class="tl-title-row">
                    <h2 class="tl-task-name" id="tlTaskName"'''
new_tl_header = '''            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <span class="ai-badge"><i class="fas fa-robot"></i> AI 辅助学习模式</span>
                </div>
                <div class="tl-title-row">
                    <h2 class="tl-task-name" id="tlTaskName"'''
content = content.replace(old_tl_header, new_tl_header)

# ==================== 3. 修改学习面板 header 添加 AI 摘要按钮 ====================
old_panel_header = '''                    <div class="tl-panel" id="learningPanel">
                        <div class="tl-panel-header">
                            <i class="fas fa-book-open"></i>
                            <span>任务说明</span>
                            <button class="tl-fullscreen-btn" onclick="openTaskDescFullscreen()">
                                <i class="fas fa-expand"></i> 全屏查看
                            </button>
                        </div>'''
new_panel_header = '''                    <div class="tl-panel" id="learningPanel">
                        <div class="tl-panel-header">
                            <i class="fas fa-book-open"></i>
                            <span>任务说明</span>
                            <div style="display:flex;align-items:center;gap:8px;margin-left:auto;">
                                <button class="ai-hint-btn" onclick="handleAiSummary(currentTaskId)" id="aiSummaryBtn" style="margin-left:0;">
                                    <i class="fas fa-sparkles"></i> AI 摘要
                                </button>
                                <button class="tl-fullscreen-btn" onclick="openTaskDescFullscreen()">
                                    <i class="fas fa-expand"></i> 全屏查看
                                </button>
                            </div>
                        </div>'''
content = content.replace(old_panel_header, new_panel_header)

# ==================== 4. 在 </main> 前插入 AI 浮动按钮和侧边栏 ====================
ai_sidebar_html = '''
    <!-- AI 学习助手浮动按钮 -->
    <button class="ai-float-btn pulse" id="aiFloatBtn" onclick="toggleAiSidebar()">
        <i class="fas fa-robot"></i>
    </button>

    <!-- AI 学习助手侧边栏 -->
    <div class="ai-sidebar-panel" id="aiSidebarPanel">
        <div class="ai-sidebar-header">
            <div class="ai-sidebar-avatar"><i class="fas fa-robot"></i></div>
            <div>
                <div class="ai-sidebar-title">AI 学习助手</div>
                <div class="ai-sidebar-subtitle">随时为你答疑解惑</div>
            </div>
            <button class="ai-sidebar-close" onclick="toggleAiSidebar()"><i class="fas fa-times"></i></button>
        </div>
        <div class="ai-sidebar-body" id="aiSidebarBody">
            <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:12px;">
                点击下方功能，获取 AI 智能辅助：
            </div>
            <button class="ai-action-btn" onclick="handleAiParseTask()">
                <i class="fas fa-list-check"></i> 解析任务要点
            </button>
            <button class="ai-action-btn" onclick="handleAiRecommendResources()">
                <i class="fas fa-book-open"></i> 推荐学习资源
            </button>
            <button class="ai-action-btn" onclick="handleAiLearningPath()">
                <i class="fas fa-route"></i> 生成学习路径
            </button>
            <button class="ai-action-btn" onclick="handleAiWeakPointAnalysis()">
                <i class="fas fa-chart-line"></i> 薄弱点分析
            </button>
            <div id="aiOutputArea"></div>
        </div>
    </div>
'''
content = content.replace('    </main>', ai_sidebar_html + '    </main>')

# ==================== 5. 修改 renderQuizAssessment 添加 AI 提示按钮 ====================
# 在题目标题行添加 AI 提示按钮
old_question_title = '''                        html += `<div class="tl-question-title">`;
                        html += `<span class="tl-question-num">${idx + 1}</span>`;
                        html += `<span>${q.content}</span>`;
                        html += `<span class="tl-question-score">${q.score}\u5206</span>`;
                        html += `</div>`;'''
new_question_title = '''                        html += `<div class="tl-question-title">`;
                        html += `<span class="tl-question-num">${idx + 1}</span>`;
                        html += `<span>${q.content}</span>`;
                        html += `<span class="tl-question-score">${q.score}\u5206</span>`;
                        html += `<button class="ai-hint-btn" onclick="handleAiQuestionHint('${task.id}', '${q.id}')" style="margin-left:auto;"><i class="fas fa-lightbulb"></i> AI 提示</button>`;
                        html += `</div>`;'''
content = content.replace(old_question_title, new_question_title)

# ==================== 6. 插入 AI JS 功能代码 ====================
ai_js = '''
        // ==================== AI 辅助学习功能 ====================
        let aiSidebarOpen = false;
        let aiLoading = false;

        function toggleAiSidebar() {
            aiSidebarOpen = !aiSidebarOpen;
            const panel = document.getElementById('aiSidebarPanel');
            const btn = document.getElementById('aiFloatBtn');
            if (aiSidebarOpen) {
                panel.classList.add('open');
                btn.style.transform = 'scale(0)';
                btn.style.opacity = '0';
            } else {
                panel.classList.remove('open');
                btn.style.transform = '';
                btn.style.opacity = '';
            }
        }

        function setAiLoading(loading) {
            aiLoading = loading;
            const outputArea = document.getElementById('aiOutputArea');
            if (loading) {
                outputArea.innerHTML = `
                    <div class="ai-loading-dots">
                        <span></span><span></span><span></span>
                        <span style="margin-left:8px;">AI 正在思考中...</span>
                    </div>`;
            }
        }

        function showAiOutput(title, html) {
            const outputArea = document.getElementById('aiOutputArea');
            outputArea.innerHTML = `
                <div class="ai-output-box">
                    <div class="ai-output-title"><i class="fas fa-sparkles"></i> ${title}</div>
                    <div>${html}</div>
                </div>`;
        }

        function showAiScoreCard(title, items) {
            const outputArea = document.getElementById('aiOutputArea');
            let itemsHtml = items.map(it => `<div class="ai-score-item"><span>${it.label}</span><span style="font-weight:600;color:${it.color || '#7c3aed'};">${it.value}</span></div>`).join('');
            outputArea.innerHTML = `
                <div class="ai-score-card">
                    <div class="ai-score-card-title"><i class="fas fa-sparkles"></i> ${title}</div>
                    ${itemsHtml}
                </div>`;
        }

        // AI 解析任务要点
        function handleAiParseTask() {
            if (aiLoading) return;
            const task = currentLearningTask;
            if (!task) { alert('请先选择一个任务'); return; }
            setAiLoading(true);
            setTimeout(() => {
                setAiLoading(false);
                const abilities = task.abilityPoints?.map(id => getAbilityPointById(id)?.name).filter(Boolean) || [];
                const knowledges = task.knowledgePoints?.map(id => getKnowledgePointById(id)?.name).filter(Boolean) || [];
                const deliverables = task.deliverables?.map(d => d.name) || [];
                const html = `
                    <ul>
                        <li><strong>核心目标：</strong>${task.description}</li>
                        <li><strong>关键技能：</strong>${abilities.slice(0, 4).join('\u3001') || '暂无'}</li>
                        <li><strong>涉及知识点：</strong>${knowledges.slice(0, 4).join('\u3001') || '暂无'}</li>
                        <li><strong>交付物：</strong>${deliverables.slice(0, 3).join('\u3001') || '暂无'}</li>
                        <li><strong>预估难度：</strong>${'\u2605'.repeat(task.difficulty || 1)}${'\u2606'.repeat(5 - (task.difficulty || 1))}</li>
                        <li><strong>AI 学习建议：</strong>建议先阅读配套资源，重点关注「${knowledges[0] || '核心知识点'}」，再进入测评环节。</li>
                    </ul>
                `;
                showAiOutput('任务要点解析', html);
            }, 1200);
        }

        // AI 推荐学习资源
        function handleAiRecommendResources() {
            if (aiLoading) return;
            const task = currentLearningTask;
            if (!task) { alert('请先选择一个任务'); return; }
            setAiLoading(true);
            setTimeout(() => {
                setAiLoading(false);
                const resources = getTaskResources(task);
                const kps = getTaskKnowledgePoints(task);
                let html = '<p style="margin-bottom:8px;"><strong>根据当前任务，为你推荐以下资源：</strong></p><ul>';
                resources.forEach((r, i) => {
                    if (i < 4) html += `<li><strong>${r.name}</strong> \u2014 ${r.description?.substring(0, 50) || '配套学习资源'}...</li>`;
                });
                html += '</ul>';
                if (kps.length > 0) {
                    html += `<p style="margin-top:8px;"><i class="fas fa-lightbulb" style="color:#faad14;"></i> <strong>重点掌握：</strong>${kps.slice(0, 3).map(k => k.name).join('\u3001')}</p>`;
                }
                html += `<p style="margin-top:8px;color:var(--text-tertiary);"><i class="fas fa-info-circle"></i> 以上资源按与任务的关联度排序</p>`;
                showAiOutput('智能资源推荐', html);
            }, 1000);
        }

        // AI 生成学习路径
        function handleAiLearningPath() {
            if (aiLoading) return;
            const task = currentLearningTask;
            if (!task) { alert('请先选择一个任务'); return; }
            setAiLoading(true);
            setTimeout(() => {
                setAiLoading(false);
                const kps = getTaskKnowledgePoints(task);
                const html = `
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#f0fdf4;border-radius:6px;border:1px solid #bbf7d0;">
                            <span style="width:22px;height:22px;border-radius:50%;background:#22c55e;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">1</span>
                            <div style="font-size:13px;"><strong>阅读任务说明</strong><br><span style="color:var(--text-tertiary);">了解任务目标和交付标准（${task.estimatedHours}课时）</span></div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#fff7ed;border-radius:6px;border:1px solid #fed7aa;">
                            <span style="width:22px;height:22px;border-radius:50%;background:#f97316;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">2</span>
                            <div style="font-size:13px;"><strong>学习配套资源</strong><br><span style="color:var(--text-tertiary);">重点掌握：${kps.slice(0, 2).map(k => k.name).join('\u3001') || '关联知识点'}</span></div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#eff6ff;border-radius:6px;border:1px solid #bfdbfe;">
                            <span style="width:22px;height:22px;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">3</span>
                            <div style="font-size:13px;"><strong>完成练习与测评</strong><br><span style="color:var(--text-tertiary);">检验学习成果，查漏补缺</span></div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#faf5ff;border-radius:6px;border:1px solid #e9d5ff;">
                            <span style="width:22px;height:22px;border-radius:50%;background:#9333ea;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">4</span>
                            <div style="font-size:13px;"><strong>提交并获取反馈</strong><br><span style="color:var(--text-tertiary);">等待评分，根据反馈改进</span></div>
                        </div>
                    </div>
                `;
                showAiOutput('推荐学习路径', html);
            }, 1000);
        }

        // AI 薄弱点分析
        function handleAiWeakPointAnalysis() {
            if (aiLoading) return;
            const task = currentLearningTask;
            if (!task) { alert('请先选择一个任务'); return; }
            setAiLoading(true);
            setTimeout(() => {
                setAiLoading(false);
                const items = [
                    { label: 'React 并发特性', value: '待提升', color: '#f97316' },
                    { label: 'TypeScript 泛型', value: '良好', color: '#22c55e' },
                    { label: '数据库索引优化', value: '薄弱', color: '#ef4444' },
                    { label: 'RESTful API 设计', value: '优秀', color: '#22c55e' },
                ];
                showAiScoreCard('知识点掌握度分析', items);
            }, 1200);
        }

        // AI 摘要任务说明
        function handleAiSummary(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const btn = document.getElementById('aiSummaryBtn');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...'; }
            setTimeout(() => {
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
                if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sparkles"></i> AI 摘要'; }
            }, 800);
        }

        // AI 答题思路提示
        function handleAiQuestionHint(taskId, questionId) {
            const task = getTaskById(taskId);
            if (!task) return;
            const q = task.assessment?.objectiveConfig?.questions?.find(q => q.id === questionId);
            if (!q) return;
            const hintId = `ai-hint-${questionId}`;
            let hintEl = document.getElementById(hintId);
            if (hintEl) {
                hintEl.remove();
                return;
            }
            const card = document.getElementById(`q-${questionId}`);
            if (!card) return;
            hintEl = document.createElement('div');
            hintEl.id = hintId;
            hintEl.className = 'ai-hint-popup';
            const typeName = q.type === 'single' ? '\u5355\u9009' : q.type === 'multiple' ? '\u591a\u9009' : '\u5224\u65ad';
            const kpName = getTaskKnowledgePoints(task)[0]?.name || '\u6838\u5fc3\u77e5\u8bc6\u70b9';
            hintEl.innerHTML = `<i class="fas fa-robot" style="color:#9333ea;margin-right:4px;"></i> <strong>AI 思路提示：</strong>这是一道${typeName}题，涉及「${kpName}」。建议从${q.type === 'judgment' ? '概念定义和核心原理' : '选项间的逻辑关系'}入手分析，先排除明显错误的选项，再对剩余选项进行仔细比对。`;
            card.appendChild(hintEl);
        }
'''

content = content.replace('        init();', ai_js + '\n        init();')

with open('/root/zhiyu-scene/public/student_2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('student_2.html modified successfully')
