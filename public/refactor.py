import sys

def main():
    with open('public/student.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    original_count = len(lines)
    print(f"Original line count: {original_count}")

    # ============== A. 从后往前按行号删除死代码 ==============
    # 行号是 1-based，Python slice 是 0-based，end exclusive
    # 必须从大到小删除，这样前面的行号不受影响
    deletions = [
        (5609, 5641),   # Lines 5610-5641: #modeSelectModal HTML 弹窗
        (5238, 5285),   # Lines 5239-5285: renderSidebarAssessments + toggleTree
        (4973, 5101),   # Lines 4974-5101: renderSubmissionStep + renderDeliverableStep
        (4351, 4515),   # Lines 4352-4515: renderOverviewStep + renderKnowledgeStep + renderGuideStep + renderResourcesStep
        (2788, 2792),   # Lines 2789-2792: #simulationIframeContainer HTML
        (2384, 2520),   # Lines 2385-2520: .mode-modal-overlay + .simulation-iframe-container CSS (保留 2521 </style>)
        (2037, 2280),   # Lines 2038-2280: .view-switcher + .float-resource-toggle + .split-layout + .step-nav-buttons CSS
        (1774, 1811),   # Lines 1775-1811: .video-player-box CSS
        (1498, 1714),   # Lines 1499-1714: .step-sidebar 系列 CSS
        (1183, 1257),   # Lines 1184-1257: .job-ability-list + .assess-list + .other-resource-list CSS
    ]

    for start, end in deletions:
        # 验证要删除的范围
        preview_start = lines[start].rstrip() if start < len(lines) else ""
        preview_end = lines[end - 1].rstrip() if end - 1 < len(lines) else ""
        print(f"Deleting lines {start + 1}-{end} ({end - start} lines)")
        print(f"  Start: {preview_start[:80]}")
        print(f"  End:   {preview_end[:80]}")
        del lines[start:end]

    # 将列表合并为字符串，以便进行字符串替换
    content = ''.join(lines)

    # ============== B. 修改 JS 逻辑 ==============

    # B1. 删除 pendingSimulationTask 变量，并修改 enterTaskLearning
    old_enter = """        let pendingSimulationTask = null;

        function enterTaskLearning(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;

            currentTaskId = taskId;

            // 直接进入测评一体模式（跳过弹窗）
            pendingSimulationTask = task;
            selectMode('integrated');
        }"""
    new_enter = """        function enterTaskLearning(taskId) {
            const task = getTaskById(taskId);
            if (!task) return;

            currentTaskId = taskId;

            startOriginalLearning(task);
        }"""
    content = content.replace(old_enter, new_enter)

    # B2. startOriginalLearning 中删除 iframe 相关引用
    old_start_original = """            // 隐藏 iframe 容器
            document.getElementById('simulationIframeContainer').classList.remove('active');
            document.getElementById('simulationIframe').src = '';
            // 显示原生学习布局"""
    new_start_original = """            // 显示原生学习布局"""
    content = content.replace(old_start_original, new_start_original)

    # B3. 删除 closeModeModal 函数，并简化 selectMode
    old_select_mode = """        function closeModeModal() {
            document.getElementById('modeSelectModal').classList.remove('active');
            pendingSimulationTask = null;
        }

        function selectMode(mode) {
            if (!pendingSimulationTask) return;
            const task = pendingSimulationTask;
            closeModeModal();
            currentTaskId = task.id;

            // 进入任务学习视图
            document.getElementById('scenarioDetailView').style.display = 'none';
            document.getElementById('taskLearningView').classList.add('active');
            document.getElementById('breadcrumbScenarioName').textContent = task.name;
            document.getElementById('learningTaskName').textContent = task.name;
            document.getElementById('learningTaskMeta').textContent = 
                `${task.estimatedHours}课时 · ${'★'.repeat(task.difficulty)}${'☆'.repeat(5-task.difficulty)} · ${task.taskType === 'assessment' ? '考核任务' : '训练任务'}`;

            // 隐藏原生学习布局，显示 iframe
            document.getElementById('learningLayout').style.display = 'none';
            document.getElementById('taskSubmitBar').style.display = 'none';
            document.getElementById('taskPageHeader').style.display = 'none';
            document.getElementById('breadcrumbNav').style.display = 'none';
            document.getElementById('topHeader').style.display = 'none';
            const iframeContainer = document.getElementById('simulationIframeContainer');
            const iframe = document.getElementById('simulationIframe');
            const methods = task.evaluationMethods ? task.evaluationMethods.join(',') : '';
            iframe.src = '/approvals/grading/simulation/' + encodeURIComponent(task.simulationTaskId) + '?mode=' + encodeURIComponent(mode) + '&name=' + encodeURIComponent(task.name) + '&embedded=1&methods=' + encodeURIComponent(methods);
            iframeContainer.classList.add('active');
            window.scrollTo(0, 0);
        }"""
    new_select_mode = """        function selectMode(mode) {
            // 已不再使用 iframe，直接走原生双面板路径
        }"""
    content = content.replace(old_select_mode, new_select_mode)

    # B4. exitTaskLearning 中删除 iframe 清理逻辑
    old_exit = """            // 清理 iframe
            document.getElementById('simulationIframeContainer').classList.remove('active');
            document.getElementById('simulationIframe').src = '';
            document.getElementById('learningLayout').style.display = 'flex';
            document.getElementById('taskSubmitBar').style.display = 'flex';"""
    new_exit = """            document.getElementById('learningLayout').style.display = 'flex';
            document.getElementById('taskSubmitBar').style.display = 'flex';"""
    content = content.replace(old_exit, new_exit)

    # B5. 删除 iframe 消息监听
    old_message = """        // 监听 iframe 内返回按钮消息
        window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'exit-simulation') {
                exitTaskLearning();
            }
        });

        // ========== 单页双面板渲染 =========="""
    new_message = """        // ========== 单页双面板渲染 =========="""
    content = content.replace(old_message, new_message)

    # B6. selectQuizOption 中 renderCurrentStep() -> renderTaskPage(task)
    old_quiz = """            // 重新渲染当前步骤以更新 UI
            renderCurrentStep();"""
    new_quiz = """            // 重新渲染当前步骤以更新 UI
            renderTaskPage(task);"""
    content = content.replace(old_quiz, new_quiz)

    # B7. 删除 init() 中对已删除函数的调用 + 遗留的 iframe 注释
    old_init_call = """            renderKnowledgeTree();
            renderWeightTables();
            renderSidebarAssessments();"""
    new_init_call = """            renderKnowledgeTree();
            renderWeightTables();"""
    content = content.replace(old_init_call, new_init_call)

    old_iframe_comment = """    <!-- 模拟页面 iframe 容器（动态插入到 learningLayout 中） -->

    <!-- 能力/知识详情弹窗 -->"""
    new_iframe_comment = """    <!-- 能力/知识详情弹窗 -->"""
    content = content.replace(old_iframe_comment, new_iframe_comment)

    # ============== 写入文件 ==============
    with open('public/student.html', 'w', encoding='utf-8') as f:
        f.write(content)

    new_count = len(content.splitlines())
    print(f"\nNew line count: {new_count}")
    print(f"Lines removed: {original_count - new_count}")

    # 验证关键函数是否仍然存在
    checks = [
        'function renderTaskList',
        'function renderResources',
        'function renderAbilities',
        'function initKnowledgeGraph',
        'function renderWeightTables',
        'function startOriginalLearning',
        'function renderTaskPage',
        'function renderLearningStep',
        'function renderAssessmentStep',
        'function renderPaperAssessment',
        'function renderQuestionBankAssessment',
        'function renderMixedMethodAssessment',
        'function renderObjectiveAssessment',
        'function renderSubjectiveAssessment',
        'function renderMixedAssessment',
        'function renderReviewAssessment',
        'function renderRandomDrawAssessment',
        'function renderEvalPointsPreview',
    ]
    print("\n--- Verification ---")
    all_ok = True
    for func in checks:
        if func in content:
            print(f"[OK] {func}")
        else:
            print(f"[MISSING] {func}")
            all_ok = False

    # 验证已删除的内容
    removed_checks = [
        'modeSelectModal',
        'renderSidebarAssessments',
        'toggleTree',
        'renderSubmissionStep',
        'renderDeliverableStep',
        'renderOverviewStep',
        'renderKnowledgeStep',
        'renderGuideStep',
        'renderResourcesStep',
        'simulationIframeContainer',
        'pendingSimulationTask',
        'closeModeModal',
    ]
    print("\n--- Removed checks ---")
    for token in removed_checks:
        if token in content:
            print(f"[STILL PRESENT] {token}")
            all_ok = False
        else:
            print(f"[REMOVED] {token}")

    # 验证 HTML 结构完整性
    print("\n--- HTML structure checks ---")
    if '</style>' in content:
        print("[OK] </style> present")
    else:
        print("[MISSING] </style>")
        all_ok = False

    if content.count('<script') == content.count('</script>'):
        print("[OK] script tags balanced")
    else:
        print(f"[UNBALANCED] script tags: {content.count('<script')} open, {content.count('</script>')} close")
        all_ok = False

    if not all_ok:
        print("\nSome checks failed!")
        sys.exit(1)
    else:
        print("\nAll checks passed!")

if __name__ == '__main__':
    main()
