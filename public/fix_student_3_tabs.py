#!/usr/bin/env python3
with open('/root/zhiyu-scene/public/student_3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ===================== 1. 修改右侧面板 HTML，增加 5 个 tabs =====================
old_right_panel = '''                <!-- 右侧列：AI 智能分析面板 -->
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

new_right_panel = '''                <!-- 右侧列：AI 智能分析 + 基础关联信息面板 -->
                <div class="tl-right">
                    <div class="tl-side-panel" style="min-height: auto;">
                        <div class="tl-side-tabs">
                            <div class="tl-side-tab active" data-side-tab="ai-analysis" onclick="switchAiAnalysisTab('ai-analysis')">
                                <i class="fas fa-chart-pie"></i> AI 分析
                            </div>
                            <div class="tl-side-tab" data-side-tab="ai-path" onclick="switchAiAnalysisTab('ai-path')">
                                <i class="fas fa-route"></i> 路径
                            </div>
                            <div class="tl-side-tab" data-side-tab="knowledge" onclick="switchSideTab('knowledge')">
                                <i class="fas fa-lightbulb"></i> 知识点
                            </div>
                            <div class="tl-side-tab" data-side-tab="ability" onclick="switchSideTab('ability')">
                                <i class="fas fa-star"></i> 能力点
                            </div>
                            <div class="tl-side-tab" data-side-tab="resource" onclick="switchSideTab('resource')">
                                <i class="fas fa-folder-open"></i> 资源
                            </div>
                        </div>
                        <div class="tl-side-body" id="aiAnalysisBody">
                            <!-- 内容由 JS 渲染 -->
                        </div>
                    </div>
                </div>'''

content = content.replace(old_right_panel, new_right_panel)

# ===================== 2. 修改 switchSideTab，让它渲染到 aiAnalysisBody =====================
old_switch_side = '''        function switchSideTab(tab) {
            document.querySelectorAll('.tl-side-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tl-side-tab[data-side-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');

            const body = document.getElementById('tlSideBody');
            const task = currentLearningTask;
            if (!task) { body.innerHTML = ''; return; }'''

new_switch_side = '''        function switchSideTab(tab) {
            document.querySelectorAll('.tl-side-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tl-side-tab[data-side-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');

            const body = document.getElementById('aiAnalysisBody');
            const task = currentLearningTask;
            if (!task) { if (body) body.innerHTML = ''; return; }'''

content = content.replace(old_switch_side, new_switch_side)

# ===================== 3. 修改 switchAiAnalysisTab，确保它不会清空知识/能力/资源的内容 =====================
old_switch_ai = '''        function switchAiAnalysisTab(tab) {
            document.querySelectorAll('.tl-side-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tl-side-tab[data-side-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');
            if (tab === 'ai-analysis') renderAiAnalysisPanel();
            else if (tab === 'ai-path') renderAiPathPanel();
        }'''

new_switch_ai = '''        function switchAiAnalysisTab(tab) {
            document.querySelectorAll('.tl-side-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tl-side-tab[data-side-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');
            if (tab === 'ai-analysis') renderAiAnalysisPanel();
            else if (tab === 'ai-path') renderAiPathPanel();
        }
        // 使 switchSideTab 也能被外部调用渲染基础内容
        window.switchSideTab = switchSideTab;'''

content = content.replace(old_switch_ai, new_switch_ai)

# ===================== 4. 修改 renderSidePanel 覆盖，让它默认切换到 AI 分析面板（保留基础功能） =====================
old_render_override = '''        const originalRenderSidePanel = renderSidePanel;
        renderSidePanel = function(task) {
            // AI-first 模式下，右侧面板由 AI 分析接管
            renderAiAnalysisPanel();
        };'''

new_render_override = '''        const originalRenderSidePanel = renderSidePanel;
        renderSidePanel = function(task) {
            // AI-first 模式下默认显示 AI 分析面板，同时保留基础 tab 功能
            renderAiAnalysisPanel();
        };'''

content = content.replace(old_render_override, new_render_override)

with open('/root/zhiyu-scene/public/student_3.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('student_3.html tabs fixed successfully')
