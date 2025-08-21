/**
 * 公文写作助手核心类
 * 主要负责协调各个模块和组件的工作
 */
class DocumentAssistant {
    constructor() {
        this.originalText = '';
        this.currentText = '';
        this.suggestions = [];
        this.currentSuggestionIndex = 0;
        this.apiKey = '';
        this.apiModel = 'deepseek-chat';
        this.isProcessing = false;
        
        // 文字流管理
        this.textStream = {
            sentences: [],           // 句子数组
            currentBatchIndex: 0,    // 当前处理的批次索引
            batchSize: 3,           // 每批处理的句子数量
            processedSentences: 0   // 已处理的句子数量
        };
        
        // 功能模式管理
        this.currentMode = 'upload';  // 'upload' 或 'generate'
        
        // 编辑状态
        this.isEditing = false; // 是否正在编辑
        
        // 默认配置
        this.defaultApiKey = 'sk-cfc4379bbb1b4592858914139c4d9120';
        
        // 初始化
        this.initializeElements();
        this.bindEvents();
        
        // 延迟调用配置相关方法，等待子类初始化完成
        setTimeout(() => {
            this.initializeConfig();
        }, 100);
    }

    // 初始化配置（延迟调用，避免方法覆盖问题）
    initializeConfig() {
        try {
            // 确保默认状态下使用默认密钥
            if (this.elements.personalizeMode && !this.elements.personalizeMode.checked) {
                this.apiKey = this.defaultApiKey;
            }
            
            // 如果loadSettings方法存在（通过子类绑定），则调用
            if (typeof this.loadSettings === 'function') {
                this.loadSettings();
            }
        } catch (error) {
            console.warn('⚠️ 配置初始化失败:', error.message);
        }
    }

    initializeElements() {
        this.elements = {
            // 配置相关
            settingsBtn: document.getElementById('settingsBtn'),
            configModal: document.getElementById('configModal'),
            closeModal: document.getElementById('closeModal'),
            personalizeMode: document.getElementById('personalizeMode'),
            configOptions: document.getElementById('configOptions'),
            apiProvider: document.getElementById('apiProvider'),
            apiKeySection: document.getElementById('apiKeySection'),
            apiKey: document.getElementById('apiKey'),
            apiKeyHelp: document.getElementById('apiKeyHelp'),
            apiUrlSection: document.getElementById('apiUrlSection'),
            apiUrl: document.getElementById('apiUrl'),
            modelSection: document.getElementById('modelSection'),
            apiModel: document.getElementById('apiModel'),
            modelHelp: document.getElementById('modelHelp'),
            tokensSection: document.getElementById('tokensSection'),
            maxTokens: document.getElementById('maxTokens'),
            tokensValue: document.getElementById('tokensValue'),
            toggleKey: document.getElementById('toggleKey'),
            
            // 新增配置参数
            temperatureSection: document.getElementById('temperatureSection'),
            temperature: document.getElementById('temperature'),
            temperatureValue: document.getElementById('temperatureValue'),
            topPSection: document.getElementById('topPSection'),
            topP: document.getElementById('topP'),
            topPValue: document.getElementById('topPValue'),
            frequencyPenaltySection: document.getElementById('frequencyPenaltySection'),
            frequencyPenalty: document.getElementById('frequencyPenalty'),
            frequencyPenaltyValue: document.getElementById('frequencyPenaltyValue'),
            
            saveConfig: document.getElementById('saveConfig'),
            resetConfig: document.getElementById('resetConfig'),
            useDefaultConfig: document.getElementById('useDefaultConfig'),

            // 功能选择相关
            functionSelection: document.getElementById('functionSelection'),
            proofreadingCard: document.getElementById('proofreadingCard'),
            generationCard: document.getElementById('generationCard'),
            fileInput: document.getElementById('fileInput'),
            helpBtn: document.getElementById('helpBtn'),
            
            // 工作区相关
            generationWorkspace: document.getElementById('generationWorkspace'),
            proofreadingWorkspace: document.getElementById('proofreadingWorkspace'),
            backToSelection: document.getElementById('backToSelection'),
            backToSelectionFromProofreading: document.getElementById('backToSelectionFromProofreading'),
            backToSelectionFromDocument: document.getElementById('backToSelectionFromDocument'),
            
            // 公文生成相关
            typeCards: document.querySelectorAll('.type-card'),
            documentTitle: document.getElementById('documentTitle'),
            recipientUnit: document.getElementById('recipientUnit'),
            senderUnit: document.getElementById('senderUnit'),
            documentContent: document.getElementById('documentContent'),
            generateDocument: document.getElementById('generateBtn'),
            previewContent: document.getElementById('previewContent'),
            editDocument: document.getElementById('editDocument'),
            downloadDocument: document.getElementById('downloadDocument'),
            
            // 新增模板相关元素
            templateContent: document.getElementById('templateContent'),
            resultContent: document.getElementById('resultContent'),
            useTemplateBtn: document.getElementById('useTemplateBtn'),
            editTemplateBtn: document.getElementById('editTemplateBtn'),
            saveTemplateBtn: document.getElementById('saveTemplateBtn'),
            resetTemplateBtn: document.getElementById('resetTemplateBtn'),
            editDocument: document.getElementById('editDocument'),
            goToProofread: document.getElementById('goToProofread'),
            downloadDocument: document.getElementById('downloadDocument'),
            previewLoading: document.getElementById('previewLoading'),
    
            // 文档润色相关
            uploadArea: document.getElementById('uploadArea'),
            selectFileBtn: document.getElementById('selectFileBtn'),
            processingInfo: document.getElementById('processingInfo'),
            startProofreadingProcess: document.getElementById('startProofreadingProcess'),
            
            // 新增润色界面元素
            navItems: document.querySelectorAll('.nav-item'),
            uploadContent: document.getElementById('uploadContent'),
            pasteContent: document.getElementById('pasteContent'),
            historyContent: document.getElementById('historyContent'),
            pasteTextarea: document.getElementById('pasteTextarea'),
            pasteCharCount: document.getElementById('pasteCharCount'),
            pasteWordCount: document.getElementById('pasteWordCount'),
            startPasteProofreading: document.getElementById('startPasteProofreading'),
            historyList: document.getElementById('historyList'),
            processingProgress: document.getElementById('processingProgress'),
            processingText: document.getElementById('processingText'),
            
            // 布局控制相关
            mainLayout: document.getElementById('mainLayout'),
            rightSection: document.getElementById('rightSection'),
            rightArrow: document.getElementById('rightArrow'),

            // 文档显示相关
            documentSection: document.getElementById('documentSection'),
            fileName: document.getElementById('fileName'),
            charCount: document.getElementById('charCount'),
            wordCount: document.getElementById('wordCount'),
            errorCount: document.getElementById('errorCount'),
            textDisplay: document.getElementById('textDisplay'),
            statusText: document.getElementById('statusText'),
            processingTime: document.getElementById('processingTime'),

            // 操作按钮
            checkBtn: document.getElementById('checkBtn'),
            exportBtn: document.getElementById('exportBtn'),
            resetBtn: document.getElementById('resetBtn'),
        };
    }

    bindEvents() {
        console.log('🔧 开始绑定事件...');
        
        // 设置模态框
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.assistant && typeof window.assistant.showConfigModal === 'function') {
                    window.assistant.showConfigModal();
                } else {
                    console.warn('⚠️ window.assistant.showConfigModal 方法不存在');
                }
            });
            console.log('✅ 设置按钮事件已绑定');
        } else {
            console.warn('⚠️ 设置按钮元素未找到');
        }
        
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.hideConfigModal === 'function') {
                    window.assistant.hideConfigModal();
                } else {
                    console.warn('⚠️ window.assistant.hideConfigModal 方法不存在');
                }
            });
            console.log('✅ 关闭模态框事件已绑定');
        }
        
        if (this.elements.configModal) {
            this.elements.configModal.addEventListener('click', (e) => {
                if (e.target === this.elements.configModal) {
                    if (window.assistant && typeof window.assistant.hideConfigModal === 'function') {
                        window.assistant.hideConfigModal();
                    }
                }
            });
            console.log('✅ 模态框背景点击事件已绑定');
        }
        
        // 个性化开关
        if (this.elements.personalizeMode) {
            this.elements.personalizeMode.addEventListener('change', () => {
                if (window.assistant && typeof window.assistant.togglePersonalizeMode === 'function') {
                    window.assistant.togglePersonalizeMode();
                }
            });
            console.log('✅ 个性化模式开关事件已绑定');
        }
        
        // API提供商切换
        if (this.elements.apiProvider) {
            this.elements.apiProvider.addEventListener('change', () => {
                if (window.assistant && typeof window.assistant.switchProvider === 'function') {
                    window.assistant.switchProvider();
                }
            });
            console.log('✅ API提供商切换事件已绑定');
        }
        
        // API密钥显示切换
        if (this.elements.toggleKey) {
            this.elements.toggleKey.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.toggleApiKeyVisibility === 'function') {
                    window.assistant.toggleApiKeyVisibility();
                }
            });
            console.log('✅ API密钥显示切换事件已绑定');
        }

        // 配置保存和重置
        if (this.elements.saveConfig) {
            this.elements.saveConfig.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.saveConfig === 'function') {
                    window.assistant.saveConfig();
                }
            });
            console.log('✅ 保存配置事件已绑定');
        }
        
        if (this.elements.resetConfig) {
            this.elements.resetConfig.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.resetConfig === 'function') {
                    window.assistant.resetConfig();
                }
            });
            console.log('✅ 重置配置事件已绑定');
        }
        
        if (this.elements.useDefaultConfig) {
            this.elements.useDefaultConfig.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.useDefaultConfig === 'function') {
                    window.assistant.useDefaultConfig();
                }
            });
            console.log('✅ 使用默认配置事件已绑定');
        }

        // 滑块值更新
        if (this.elements.maxTokens) {
            this.elements.maxTokens.addEventListener('input', () => {
                if (window.assistant && typeof window.assistant.updateTokensDisplay === 'function') {
                    window.assistant.updateTokensDisplay();
                }
            });
            console.log('✅ 最大令牌滑块事件已绑定');
        }
        
        if (this.elements.temperature) {
            this.elements.temperature.addEventListener('input', () => {
                if (window.assistant && typeof window.assistant.updateTemperatureDisplay === 'function') {
                    window.assistant.updateTemperatureDisplay();
                }
            });
            console.log('✅ 温度滑块事件已绑定');
        }
        
        if (this.elements.topP) {
            this.elements.topP.addEventListener('input', () => {
                if (window.assistant && typeof window.assistant.updateTopPDisplay === 'function') {
                    window.assistant.updateTopPDisplay();
                }
            });
            console.log('✅ Top-P滑块事件已绑定');
        }
        
        if (this.elements.frequencyPenalty) {
            this.elements.frequencyPenalty.addEventListener('input', () => {
                if (window.assistant && typeof window.assistant.updateFrequencyPenaltyDisplay === 'function') {
                    window.assistant.updateFrequencyPenaltyDisplay();
                }
            });
            console.log('✅ 重复惩罚滑块事件已绑定');
        }

        // 功能选择事件 - 直接点击卡片
        if (this.elements.proofreadingCard) {
            this.elements.proofreadingCard.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.startProofreadingMode === 'function') {
                    window.assistant.startProofreadingMode();
                } else {
                    this.startProofreadingMode();
                }
            });
            console.log('✅ 文档润色卡片事件已绑定');
        }
        
        if (this.elements.generationCard) {
            this.elements.generationCard.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.startGenerationMode === 'function') {
                    // 调用子类的方法，但确保也调用基类的绑定逻辑
                    this.startGenerationMode();
                } else {
                    this.startGenerationMode();
                }
            });
            console.log('✅ 公文生成卡片事件已绑定');
        }
        
        // 返回按钮事件
        if (this.elements.backToSelection) {
            this.elements.backToSelection.addEventListener('click', () => {
                console.log('🔙 返回选择按钮被点击');
                if (window.assistant && typeof window.assistant.backToFunctionSelection === 'function') {
                    window.assistant.backToFunctionSelection();
                } else {
                    console.warn('⚠️ window.assistant.backToFunctionSelection 方法不存在，尝试直接调用');
                    // 如果子类方法不存在，尝试直接调用基类方法
                    this.backToFunctionSelection();
                }
            });
            console.log('✅ 返回选择按钮事件已绑定');
        }
        
        if (this.elements.backToSelectionFromProofreading) {
            this.elements.backToSelectionFromProofreading.addEventListener('click', () => {
                console.log('🔙 从润色返回按钮被点击');
                if (window.assistant && typeof window.assistant.backToFunctionSelection === 'function') {
                    window.assistant.backToFunctionSelection();
                } else {
                    console.warn('⚠️ window.assistant.backToFunctionSelection 方法不存在，尝试直接调用');
                    this.backToFunctionSelection();
                }
            });
            console.log('✅ 从润色返回按钮事件已绑定');
        }
        
        if (this.elements.backToSelectionFromDocument) {
            this.elements.backToSelectionFromDocument.addEventListener('click', () => {
                console.log('🔙 从文档返回按钮被点击');
                if (window.assistant && typeof window.assistant.backToFunctionSelection === 'function') {
                    window.assistant.backToFunctionSelection();
                } else {
                    console.warn('⚠️ window.assistant.backToFunctionSelection 方法不存在，尝试直接调用');
                    this.backToFunctionSelection();
                }
            });
            console.log('✅ 从文档返回按钮事件已绑定');
        }
        
        // 操作按钮
        if (this.elements.checkBtn) {
            this.elements.checkBtn.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.startProofread === 'function') {
                    window.assistant.startProofread();
                }
            });
            console.log('✅ 开始校对按钮事件已绑定');
        }
        
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.exportDocument === 'function') {
                    window.assistant.exportDocument();
                }
            });
            console.log('✅ 导出文档按钮事件已绑定');
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => {
                if (window.assistant && typeof window.assistant.resetDocument === 'function') {
                    window.assistant.resetDocument();
                }
            });
            console.log('✅ 重置文档按钮事件已绑定');
        }

        // 帮助按钮事件
        if (this.elements.helpBtn) {
            this.elements.helpBtn.addEventListener('click', () => this.showHelp());
            console.log('✅ 帮助按钮事件已绑定');
        }

        // 侧栏收纳按钮事件
        if (this.elements.rightArrow) {
            this.elements.rightArrow.addEventListener('click', () => this.toggleRightSidebar());
            console.log('✅ 右侧箭头按钮事件已绑定');
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.configModal && this.elements.configModal.classList.contains('show')) {
                this.hideConfigModal();
            }
        });
        
        console.log('🔧 事件绑定完成');
    }

    // 显示帮助信息
    showHelp() {
        const helpText = '公文写作助手使用说明：\n\n【文档润色功能】\n1. 点击"开始润色"选择功能\n2. 上传 .txt 格式的公文文档\n3. AI将逐句智能优化表达和纠正错误\n4. 为每个问题提供润色建议\n5. 可选择接受或拒绝每个建议\n6. 完成后导出润色版文档\n\n【公文生成功能】\n1. 点击"开始生成"选择功能\n2. 输入公文类型和具体要求\n3. AI根据规范自动生成完整公文\n4. 可编辑和完善生成的内容\n5. 导出最终公文文档\n\n配置API密钥后即可使用所有功能。';
        alert(helpText);
    }

    // 显示状态信息
    showStatus(message, type = 'info') {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        this.elements.statusText.innerHTML = `
            <i class="${icons[type] || icons.info}"></i> ${message}
        `;
        this.elements.statusText.className = `status-item status-${type}`;
    }

    // 显示错误信息
    showError(message) {
        this.showStatus(message, 'error');
        console.error('错误:', message);
    }

    // 显示成功消息
    showSuccess(message) {
        console.log('✅', message);
        this.showMessage(message, 'success');
    }

    // 显示错误消息
    showError(message) {
        console.error('❌', message);
        this.showMessage(message, 'error');
    }

    // 显示信息消息
    showInfo(message) {
        console.log('ℹ️', message);
        this.showMessage(message, 'info');
    }

    // 显示警告消息
    showWarning(message) {
        console.warn('⚠️', message);
        this.showMessage(message, 'warning');
    }

    // 显示消息提示
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message-toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="message-icon ${iconMap[type] || iconMap.info}"></i>
                <span class="message-text">${this.escapeHtml(message)}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(messageEl);
        
        // 自动移除（5秒后）
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.classList.add('hiding');
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }
        }, 5000);
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 切换右侧栏
    toggleRightSidebar() {
        const isCollapsed = this.elements.mainLayout.classList.contains('right-collapsed');
        
        if (isCollapsed) {
            this.elements.mainLayout.classList.remove('right-collapsed');
            this.elements.rightSection.classList.remove('collapsed');
            this.elements.rightArrow.classList.remove('collapsed');
        } else {
            this.elements.mainLayout.classList.add('right-collapsed');
            this.elements.rightSection.classList.add('collapsed');
            this.elements.rightArrow.classList.add('collapsed');
        }
    }

    // 收起右侧栏
    collapseRightSidebar() {
        this.elements.mainLayout.classList.add('right-collapsed');
        this.elements.rightSection.classList.add('collapsed');
        this.elements.rightArrow.classList.add('collapsed');
    }

    // 展开右侧栏
    expandRightSidebar() {
        this.elements.mainLayout.classList.remove('right-collapsed');
        this.elements.rightSection.classList.remove('collapsed');
        this.elements.rightArrow.classList.remove('collapsed');
    }

    // 启动公文生成模式
    startGenerationMode() {
        if (this.elements.functionSelection && this.elements.generationWorkspace) {
            this.elements.functionSelection.style.display = 'none';
            this.elements.generationWorkspace.style.display = 'block';
            
            // 自动收起右侧栏
            this.collapseRightSidebar();
            
            // 绑定公文类型卡片事件（确保在页面显示后再绑定）
            this.bindTypeCardEvents();
            
            console.log('✨ 启动公文生成模式');
        } else {
            console.error('❌ 找不到必要的DOM元素');
        }
    }

    // 绑定公文类型卡片事件
    bindTypeCardEvents() {
        // 重新获取公文类型卡片（因为可能在页面加载时还没有显示）
        const typeCards = document.querySelectorAll('.type-card');
        
        if (typeCards.length > 0) {
            console.log(`📝 找到 ${typeCards.length} 个公文类型卡片`);
            
            // 移除之前的事件监听器（如果有的话）
            typeCards.forEach(card => {
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
            });
            
            // 重新获取卡片并绑定事件
            const newTypeCards = document.querySelectorAll('.type-card');
            newTypeCards.forEach(card => {
                card.addEventListener('click', () => {
                    console.log('🎯 点击公文类型卡片:', card.dataset.type);
                    this.selectDocumentType(card);
                });
            });
            
            console.log('✅ 公文类型卡片事件绑定完成');
        } else {
            console.warn('⚠️ 未找到公文类型卡片');
        }
    }

    // 选择文档类型（临时方法，实际调用会通过app.js绑定）
    selectDocumentType(card) {
        console.log('🎯 DocumentAssistant.selectDocumentType 被调用');
        console.log('📋 卡片类型:', card.dataset.type);
        
        // 移除其他卡片的选中状态
        const typeCards = document.querySelectorAll('.type-card');
        typeCards.forEach(c => c.classList.remove('selected'));
        
        // 添加选中状态
        card.classList.add('selected');
        console.log('✅ 已添加选中状态');
        
        // 如果window.assistant存在，调用其selectDocumentType方法
        if (window.assistant && typeof window.assistant.selectDocumentType === 'function') {
            window.assistant.selectDocumentType(card);
        } else {
            console.warn('⚠️ window.assistant.selectDocumentType 方法不存在');
        }
    }

    // 启动润色模式
    startProofreadingMode() {
        if (this.elements.functionSelection && this.elements.proofreadingWorkspace) {
            this.elements.functionSelection.style.display = 'none';
            this.elements.proofreadingWorkspace.style.display = 'block';
            
            // 自动收起右侧栏
            this.collapseRightSidebar();
            
            // 绑定润色界面导航事件
            this.bindProofreadingNavigation();
            
            console.log('✨ 启动文档润色模式');
        } else {
            console.error('❌ 找不到必要的DOM元素');
        }
    }

    // 绑定润色界面导航事件
    bindProofreadingNavigation() {
        const navItems = document.querySelectorAll('.proofreading-workspace .nav-item');
        const contentPanels = document.querySelectorAll('.proofreading-workspace .content-panel');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const method = item.getAttribute('data-method');
                
                // 更新导航项状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // 显示对应的内容面板
                contentPanels.forEach(panel => {
                    panel.style.display = 'none';
                });
                
                const targetPanel = document.getElementById(method + 'Content');
                if (targetPanel) {
                    targetPanel.style.display = 'block';
                }
                
                console.log('🔄 切换到润色方法:', method);
            });
        });
        
        // 绑定文件上传功能
        this.bindFileUploadEvents();
        
        // 绑定粘贴文本功能
        this.bindPasteTextEvents();
        
        console.log('✅ 润色界面导航事件已绑定');
    }

    // 绑定文件上传事件
    bindFileUploadEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && selectFileBtn && fileInput) {
            // 点击上传区域选择文件
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 选择文件按钮
            selectFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
            
            // 文件选择处理
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
            
            // 拖拽上传
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
            
            console.log('✅ 文件上传事件已绑定');
        }
    }

    // 绑定粘贴文本事件
    bindPasteTextEvents() {
        const pasteTextarea = document.getElementById('pasteTextarea');
        const startPasteProofreading = document.getElementById('startPasteProofreading');
        
        if (pasteTextarea && startPasteProofreading) {
            // 实时更新字符和段落统计
            pasteTextarea.addEventListener('input', () => {
                this.updatePasteStats(pasteTextarea);
            });
            
            // 开始润色按钮
            startPasteProofreading.addEventListener('click', () => {
                const text = pasteTextarea.value.trim();
                if (text) {
                    this.startPasteProofreading(text);
                } else {
                    this.showError('请先粘贴文档内容');
                }
            });
            
            console.log('✅ 粘贴文本事件已绑定');
        }
    }

    // 处理文件上传
    handleFileUpload(file) {
        console.log('📁 处理文件上传:', file.name);
        
        if (!file.name.toLowerCase().endsWith('.txt')) {
            this.showError('只支持 .txt 格式的文件');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showError('文件大小不能超过 10MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.startFileProofreading(file.name, content);
        };
        reader.readAsText(file, 'UTF-8');
    }

    // 开始文件润色
    startFileProofreading(filename, content) {
        console.log('✨ 开始文件润色:', filename);
        
        // 这里可以调用润色功能
        // 暂时显示成功消息
        this.showSuccess(`文件 "${filename}" 已加载，可以开始润色`);
        
        // 可以在这里切换到润色结果界面
        // this.showProofreadingResult(filename, content);
    }

    // 开始粘贴文本润色
    startPasteProofreading(text) {
        console.log('✨ 开始粘贴文本润色');
        
        // 这里可以调用润色功能
        // 暂时显示成功消息
        this.showSuccess('文本已加载，可以开始润色');
        
        // 可以在这里切换到润色结果界面
        // this.showProofreadingResult('粘贴的文档', text);
    }

    // 更新粘贴统计
    updatePasteStats(textarea) {
        const charCount = document.getElementById('pasteCharCount');
        const wordCount = document.getElementById('pasteWordCount');
        
        if (charCount && wordCount) {
            const text = textarea.value;
            const chars = text.length;
            const paragraphs = text.split('\n').filter(line => line.trim().length > 0).length;
            
            charCount.textContent = `${chars} 字符`;
            wordCount.textContent = `${paragraphs} 段落`;
        }
    }

    // 开始校对（临时方法，实际调用会通过app.js绑定）
    startProofread() {
        console.log('🎯 DocumentAssistant.startProofread 被调用');
        
        // 如果window.assistant存在，调用其startProofread方法
        if (window.assistant && window.assistant.startProofread) {
            window.assistant.startProofread();
        } else {
            console.warn('⚠️ window.assistant.startProofread 方法不存在');
        }
    }

    // 导出文档（临时方法，实际调用会通过app.js绑定）
    exportDocument() {
        console.log('🎯 DocumentAssistant.exportDocument 被调用');
        
        // 如果window.assistant存在，调用其exportDocument方法
        if (window.assistant && window.assistant.exportDocument) {
            window.assistant.exportDocument();
        } else {
            console.warn('⚠️ window.assistant.exportDocument 方法不存在');
        }
    }

    // 重置文档（临时方法，实际调用会通过app.js绑定）
    resetDocument() {
        console.log('🎯 DocumentAssistant.resetDocument 被调用');
        
        // 如果window.assistant存在，调用其resetDocument方法
        if (window.assistant && window.assistant.resetDocument) {
            window.assistant.resetDocument();
        } else {
            console.warn('⚠️ window.assistant.resetDocument 方法不存在');
        }
    }

    // 返回功能选择（备用方法）
    backToFunctionSelection() {
        console.log('🔙 DocumentAssistant.backToFunctionSelection 被调用');
        
        try {
            // 隐藏所有工作区
            if (this.elements.generationWorkspace) {
                this.elements.generationWorkspace.style.display = 'none';
            }
            if (this.elements.proofreadingWorkspace) {
                this.elements.proofreadingWorkspace.style.display = 'none';
            }
            if (this.elements.documentSection) {
                this.elements.documentSection.style.display = 'none';
            }
            
            // 显示功能选择
            if (this.elements.functionSelection) {
                this.elements.functionSelection.style.display = 'flex';
            }
            
            // 展开右侧栏，方便用户访问设置和帮助
            this.expandRightSidebar();
            
            // 重置状态
            this.currentMode = 'selection';
            console.log('🔙 返回功能选择完成');
            
        } catch (error) {
            console.error('❌ 返回功能选择失败:', error.message);
        }
    }
}

// 导出类供其他模块使用
window.DocumentAssistant = DocumentAssistant;
