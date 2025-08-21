/**
 * 公文写作助手主应用程序
 * 整合所有模块并初始化应用
 */

// 扩展DocumentAssistant类，集成各种服务和组件
class DocumentAssistantApp extends DocumentAssistant {
    constructor() {
        super();
        
        // 初始化服务模块
        this.configService = new ConfigService();
        this.aiService = new AIService();
        this.documentGeneration = new DocumentGeneration();
        
        // 绑定服务方法到主类
        this.bindServiceMethods();
        
        // 绑定额外的事件处理
        this.bindAdditionalEvents();
        
        console.log('🚀 公文写作助手已初始化');
    }

    // 绑定服务方法
    bindServiceMethods() {
        // 配置服务方法
        this.showConfigModal = () => this.configService.showConfigModal(this.elements);
        this.hideConfigModal = () => this.configService.hideConfigModal(this.elements);
        this.updateTokensDisplay = () => this.configService.updateTokensDisplay(this.elements);
        this.updateTemperatureDisplay = () => this.configService.updateTemperatureDisplay(this.elements);
        this.updateTopPDisplay = () => this.configService.updateTopPDisplay(this.elements);
        this.updateFrequencyPenaltyDisplay = () => this.configService.updateFrequencyPenaltyDisplay(this.elements);
        this.togglePersonalizeMode = () => this.configService.togglePersonalizeMode(this.elements);
        this.switchProvider = () => this.configService.switchProvider(this.elements);
        this.toggleApiKeyVisibility = () => this.configService.toggleApiKeyVisibility(this.elements);
        this.saveConfig = () => this.configService.saveConfig(this.elements, this);
        this.resetConfig = () => this.configService.resetConfig(this.elements, this);
        this.useDefaultConfig = () => this.configService.useDefaultConfig(this.elements, this);
        this.loadSettings = () => this.configService.loadSettings(this.elements, this);
        
        // AI服务方法
        this.validateApiKey = () => this.aiService.validateApiKey(this.elements, this);
        this.processSentenceBatch = (sentenceBatch) => this.aiService.processSentenceBatch(sentenceBatch, this.elements, this);
        this.sendGenerationRequest = (prompt) => this.aiService.sendGenerationRequest(prompt, this.elements, this);
        this.buildGenerationPrompt = (title, recipient, sender, content) => this.aiService.buildGenerationPrompt(title, recipient, sender, content, this.selectedDocumentType);
        
        // 公文生成组件方法
        this.selectDocumentType = (card) => {
            this.selectedDocumentType = this.documentGeneration.selectDocumentType(card, this.elements);
        };
        this.initializeGenerationWorkspace = () => this.documentGeneration.initializeGenerationWorkspace(this.elements);
        this.generateDocument = () => this.documentGeneration.generateDocument(this.elements, this);
        this.useTemplate = () => this.documentGeneration.useTemplate(this.elements);
        this.editTemplate = () => this.documentGeneration.editTemplate(this.elements);
        this.saveTemplate = () => this.documentGeneration.saveTemplate(this.elements);
        this.resetTemplate = () => this.documentGeneration.resetTemplate(this.elements);
    }

    // 绑定额外事件
    bindAdditionalEvents() {
        console.log('🔧 开始绑定额外事件...');
        
        // 公文生成相关事件 - 移除typeCards绑定，现在在DocumentAssistant中处理
        // this.elements.typeCards?.forEach(card => {
        //     card.addEventListener('click', () => this.selectDocumentType(card));
        // });
        
        if (this.elements.generateDocument) {
            this.elements.generateDocument.addEventListener('click', () => this.generateDocument());
            console.log('✅ 生成公文按钮事件已绑定');
        }
        
        // 模板管理相关事件
        if (this.elements.useTemplateBtn) {
            this.elements.useTemplateBtn.addEventListener('click', () => this.useTemplate());
            console.log('✅ 使用模板按钮事件已绑定');
        }
        
        if (this.elements.editTemplateBtn) {
            this.elements.editTemplateBtn.addEventListener('click', () => this.editTemplate());
            console.log('✅ 编辑模板按钮事件已绑定');
        }
        
        if (this.elements.saveTemplateBtn) {
            this.elements.saveTemplateBtn.addEventListener('click', () => this.saveTemplate());
            console.log('✅ 保存模板按钮事件已绑定');
        }
        
        if (this.elements.resetTemplateBtn) {
            this.elements.resetTemplateBtn.addEventListener('click', () => this.resetTemplate());
            console.log('✅ 重置模板按钮事件已绑定');
        }
        
        // 模板管理按钮事件
        const templateManageBtn = document.getElementById('templateManageBtn');
        const templateModal = document.getElementById('templateModal');
        const closeTemplateModal = document.getElementById('closeTemplateModal');
        
        if (templateManageBtn && templateModal) {
            templateManageBtn.addEventListener('click', () => {
                templateModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeTemplateModal && templateModal) {
            closeTemplateModal.addEventListener('click', () => {
                templateModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // 点击模态窗口外部区域关闭
        if (templateModal) {
            templateModal.addEventListener('click', (e) => {
                if (e.target === templateModal) {
                    templateModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // 文档操作相关事件

        
        // 文档润色相关事件
        if (this.elements.uploadArea) {
            this.elements.uploadArea.addEventListener('dragover', (e) => DragUtils.handleDragOver(e));
            this.elements.uploadArea.addEventListener('drop', (e) => DragUtils.handleFileDrop(e, (file) => this.processFile(file)));
            console.log('✅ 上传区域拖拽事件已绑定');
        }
        
        if (this.elements.selectFileBtn) {
            this.elements.selectFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.elements.fileInput.click();
            });
            console.log('✅ 选择文件按钮事件已绑定');
        }
        
        if (this.elements.startProofreadingProcess) {
            this.elements.startProofreadingProcess.addEventListener('click', () => this.startProofreadingProcess());
            console.log('✅ 开始润色按钮事件已绑定');
        }
        
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            console.log('✅ 文件输入事件已绑定');
        }
        
        // 新增润色界面事件
        if (this.elements.navItems && this.elements.navItems.length > 0) {
            this.elements.navItems.forEach(nav => {
                nav.addEventListener('click', () => this.switchInputMethod(nav.dataset.method));
            });
            console.log('✅ 润色导航事件已绑定');
        }
        
        if (this.elements.pasteTextarea) {
            this.elements.pasteTextarea.addEventListener('input', () => this.updatePasteStats());
            console.log('✅ 粘贴文本区域事件已绑定');
        }
        
        if (this.elements.startPasteProofreading) {
            this.elements.startPasteProofreading.addEventListener('click', () => this.startPasteProofreading());
            console.log('✅ 开始粘贴润色按钮事件已绑定');
        }

        // 全页面拖拽上传
        document.addEventListener('dragover', (e) => DragUtils.handleDragOver(e));
        document.addEventListener('dragleave', (e) => DragUtils.handleDragLeave(e));
        document.addEventListener('drop', (e) => DragUtils.handleFileDrop(e, (file) => this.processFile(file)));
        
        // 防止页面默认拖拽行为
        document.addEventListener('dragenter', (e) => e.preventDefault());
        document.addEventListener('dragover', (e) => e.preventDefault());
        
        console.log('�� 额外事件绑定完成');
    }

    // 文件处理
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    async processFile(file) {
        if (!file.name.toLowerCase().endsWith('.txt')) {
            this.showError('请选择 .txt 格式的文件');
            return;
        }

        try {
            const text = await FileUtils.readFileAsText(file);
            this.originalText = text;
            this.currentText = text;
            
            // 解析文字流
            this.textStream = TextUtils.parseTextStream(text);
            
            // 直接显示文档，不再显示处理信息
            this.displayDocument(file.name, text);
            this.updateStats();
            
            this.showStatus(`文件加载成功，共 ${this.textStream.sentences.length} 个句子`, 'success');
        } catch (error) {
            this.showError('文件读取失败: ' + error.message);
        }
    }

    // 显示文档
    displayDocument(fileName, text) {
        this.elements.fileName.textContent = fileName;
        this.elements.textDisplay.innerHTML = TextUtils.formatTextForDisplay(text);
        this.elements.functionSelection.style.display = 'none';
        this.elements.documentSection.style.display = 'flex';
    }

    // 更新统计信息
    updateStats() {
        const text = this.currentText;
        const charCount = text.length;
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        
        // 计算修改的句子数量
        const modifiedSentences = this.textStream.sentences ? 
            this.textStream.sentences.filter(s => s.status === 'modified').length : 0;
        
        this.elements.charCount.textContent = `${charCount} 字符`;
        this.elements.wordCount.textContent = `${wordCount} 词语`;
        this.elements.errorCount.textContent = `${modifiedSentences} 处修改`;
    }

    // 开始校对
    async startProofread() {
        if (!this.validateApiKey()) return;
        if (this.isProcessing) return;

        // 检查是否有解析的句子
        if (!this.textStream.sentences || this.textStream.sentences.length === 0) {
            this.showError('请先上传文档');
            return;
        }

        this.isProcessing = true;
        this.textStream.currentBatchIndex = 0;
        this.textStream.processedSentences = 0;

        try {
            this.showStatus('开始文字流校对...', 'info');
            const startTime = Date.now();
            
            // 使用新的文字流处理
            await this.processTextStream();
            
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            this.elements.processingTime.textContent = `${processingTime}ms`;
            
            this.showStatus('文字流校对完成！', 'success');
            
        } catch (error) {
            this.showError('处理过程中发生错误: ' + error.message);
        } finally {
            this.isProcessing = false;
        }
    }

    // 开始润色处理（新增方法）
    startProofreadingProcess() {
        console.log('🎯 startProofreadingProcess 被调用');
        
        // 检查是否有文档内容
        if (!this.originalText || this.originalText.trim().length === 0) {
            this.showError('请先上传或粘贴文档内容');
            return;
        }
        
        // 如果还没有解析文字流，先解析
        if (!this.textStream.sentences || this.textStream.sentences.length === 0) {
            this.textStream = TextUtils.parseTextStream(this.originalText);
        }
        
        // 开始校对
        this.startProofread();
    }

    // 处理文字流
    async processTextStream() {
        const totalSentences = this.textStream.sentences.length;
        const batchSize = this.textStream.batchSize;
        
        // 按批次处理句子
        for (let batchStart = 0; batchStart < totalSentences; batchStart += batchSize) {
            const batchEnd = Math.min(batchStart + batchSize, totalSentences);
            const currentBatch = this.textStream.sentences.slice(batchStart, batchEnd);
            
            this.showStatus(`处理句子 ${batchStart + 1}-${batchEnd}/${totalSentences}...`, 'info');
            
            // 标记当前批次为处理中
            currentBatch.forEach(sentence => {
                sentence.status = 'processing';
            });
            
            // 高亮显示当前处理的句子
            this.highlightProcessingBatch(currentBatch);
            
            try {
                // 向AI发送当前批次
                const suggestions = await this.processSentenceBatch(currentBatch);
                
                // 如果有建议，显示给用户选择
                if (suggestions.length > 0) {
                    await this.presentChoicesToUser(suggestions, currentBatch);
                }
                
                // 标记批次为已完成
                currentBatch.forEach(sentence => {
                    if (sentence.status !== 'modified') {
                        sentence.status = 'completed';
                    }
                });
                
            } catch (error) {
                console.warn(`批次 ${batchStart + 1}-${batchEnd} 处理失败:`, error);
                // 标记为失败但继续处理
                currentBatch.forEach(sentence => {
                    sentence.status = 'completed';
                });
            }
            
            this.textStream.processedSentences = batchEnd;
            
            // 更新显示
            this.updateTextStreamDisplay();
            
            // 批次间延迟
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    // 高亮处理批次
    highlightProcessingBatch(sentenceBatch) {
        // 高亮显示当前正在处理的句子批次
        sentenceBatch.forEach(sentence => {
            DOMUtils.highlightTextSegment(this.elements.textDisplay, sentence.startPos, sentence.endPos, 'segment-processing');
        });
    }

    // 向用户呈现选择
    async presentChoicesToUser(suggestions, sentenceBatch) {
        // 为每个有建议的句子显示选择界面
        for (const suggestion of suggestions) {
            if (suggestion.sentenceIndex >= 0 && suggestion.sentenceIndex < sentenceBatch.length) {
                const sentence = sentenceBatch[suggestion.sentenceIndex];
                const userChoice = await this.showSentenceChoice(sentence, suggestion);
                
                if (userChoice === 'accept') {
                    // 用户接受建议
                    await this.applySentenceModification(sentence, suggestion);
                } else {
                    // 用户拒绝建议
                    sentence.hasUserChoice = true;
                    sentence.status = 'completed';
                }
            }
        }
    }

    // 显示句子选择
    async showSentenceChoice(sentence, suggestion) {
        return new Promise((resolve) => {
            // 创建选择模态框
            const modal = DOMUtils.createChoiceModal(sentence, suggestion, resolve, this.escapeHtml);
            document.body.appendChild(modal);
            
            // 高亮当前句子
            DOMUtils.highlightTextSegment(this.elements.textDisplay, sentence.startPos, sentence.endPos, 'processing-highlight');
            
            // 显示模态框
            setTimeout(() => modal.classList.add('show'), 50);
        });
    }

    // 应用句子修改
    async applySentenceModification(sentence, suggestion) {
        // 应用句子修改
        sentence.text = suggestion.replacement;
        sentence.status = 'modified';
        sentence.hasUserChoice = true;
        
        // 重建当前文本
        this.currentText = TextUtils.rebuildCurrentText(this.textStream);
        
        // 更新显示
        this.updateTextStreamDisplay();
        
        // 高亮显示修改的句子
        DOMUtils.highlightTextSegment(this.elements.textDisplay, sentence.startPos, sentence.endPos, 'real-time-replacement');
        
        // 动画延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 清除高亮
        DOMUtils.clearTextHighlights(this.elements.textDisplay);
    }

    // 更新文字流显示
    updateTextStreamDisplay() {
        this.elements.textDisplay.innerHTML = TextUtils.formatTextForDisplay(this.currentText);
        this.updateStats();
    }

    // 导出文档
    exportDocument() {
        const filename = this.elements.fileName.textContent.replace('.txt', '_校对版.txt');
        FileUtils.exportDocument(this.currentText, filename);
        this.showStatus('文档导出成功', 'success');
    }

    // 重置文档
    resetDocument() {
        // 重置所有工作区显示状态
        this.elements.functionSelection.style.display = 'flex';
        this.elements.documentSection.style.display = 'none';
        this.elements.generationWorkspace.style.display = 'none';
        this.elements.proofreadingWorkspace.style.display = 'none';
        
        // 重置文件输入和文本数据
        this.elements.fileInput.value = '';
        this.originalText = '';
        this.currentText = '';
        this.suggestions = [];
        this.currentSuggestionIndex = 0;
        this.isProcessing = false;
        this.isEditing = false;
        
        // 重置润色界面的导航状态
        if (this.elements.navItems) {
            this.elements.navItems.forEach(nav => {
                nav.classList.remove('active');
                if (nav.dataset.method === 'upload') {
                    nav.classList.add('active');
                }
            });
        }
        
        // 重置润色界面的内容面板显示
        if (this.elements.uploadContent) {
            this.elements.uploadContent.style.display = 'flex';
        }
        if (this.elements.pasteContent) {
            this.elements.pasteContent.style.display = 'none';
        }
        if (this.elements.historyContent) {
            this.elements.historyContent.style.display = 'none';
        }
        
        // 重置粘贴区域的内容
        if (this.elements.pasteTextarea) {
            this.elements.pasteTextarea.value = '';
        }
        this.updatePasteStats();
        
        // 重置文字流数据
        this.textStream = {
            sentences: [],
            currentBatchIndex: 0,
            batchSize: 3,
            processedSentences: 0
        };
        
        // 展开右侧栏，方便用户访问设置和帮助
        this.expandRightSidebar();
        
        console.log('🔄 重置所有状态完成');
        this.showStatus('准备就绪', 'info');
    }

    // 启动润色模式
    startProofreadingMode() {
        this.currentMode = 'upload';
        this.elements.functionSelection.style.display = 'none';
        this.elements.proofreadingWorkspace.style.display = 'block';
        
        // 重置润色界面到默认状态
        this.resetProofreadingInterface();
        
        // 自动收起右侧栏
        this.collapseRightSidebar();
        
        console.log('✨ 启动文档润色模式');
    }

    // 显示润色工作区（从公文生成界面调用）
    showProofreadingWorkspace() {
        console.log('✨ 显示润色工作区');
        
        // 隐藏生成工作区
        if (this.elements.generationWorkspace) {
            this.elements.generationWorkspace.style.display = 'none';
        }
        
        // 显示润色工作区
        if (this.elements.proofreadingWorkspace) {
            this.elements.proofreadingWorkspace.style.display = 'block';
        }
        
        // 如果有生成的文档，直接显示在粘贴区域
        if (this.generatedDocument && this.generatedDocument.trim()) {
            this.showGeneratedDocumentInProofreading(this.generatedDocument);
        }
        
        // 自动收起右侧栏
        this.collapseRightSidebar();
        
        console.log('✅ 润色工作区已显示');
    }

    // 在润色界面显示生成的文档
    showGeneratedDocumentInProofreading(content) {
        console.log('📄 在润色界面显示生成的文档');
        
        // 切换到粘贴模式
        this.switchInputMethod('paste');
        
        // 设置粘贴区域的内容
        if (this.elements.pasteTextarea) {
            this.elements.pasteTextarea.value = content;
            this.updatePasteStats();
            
            // 滚动到文本框顶部
            this.elements.pasteTextarea.scrollTop = 0;
            
            // 聚焦到文本框
            this.elements.pasteTextarea.focus();
        }
        
        // 设置原始文本和当前文本
        this.originalText = content;
        this.currentText = content;
        
        // 更新统计信息
        this.updatePasteStats();
        
        // 显示成功消息
        this.showStatus(`文档"${this.getDocumentTitle(content)}"已加载到润色界面，可以开始润色`, 'success');
        
        console.log('✅ 文档已在润色界面显示，内容长度:', content.length);
    }

    // 获取文档标题（从内容中提取第一行作为标题）
    getDocumentTitle(content) {
        if (!content || !content.trim()) return '未命名文档';
        
        const lines = content.trim().split('\n');
        const firstLine = lines[0].trim();
        
        // 如果第一行太长，截取前20个字符
        if (firstLine.length > 20) {
            return firstLine.substring(0, 20) + '...';
        }
        
        return firstLine || '未命名文档';
    }

    // 重置润色界面
    resetProofreadingInterface() {
        // 重置润色界面的导航状态到默认（上传文件）
        if (this.elements.navItems) {
            this.elements.navItems.forEach(nav => {
                nav.classList.remove('active');
                if (nav.dataset.method === 'upload') {
                    nav.classList.add('active');
                }
            });
        }
        
        // 重置润色界面的内容面板显示
        if (this.elements.uploadContent) {
            this.elements.uploadContent.style.display = 'flex';
        }
        if (this.elements.pasteContent) {
            this.elements.pasteContent.style.display = 'none';
        }
        if (this.elements.historyContent) {
            this.elements.historyContent.style.display = 'none';
        }
        
        // 重置粘贴区域的内容
        if (this.elements.pasteTextarea) {
            this.elements.pasteTextarea.value = '';
        }
        this.updatePasteStats();
        
        // 重置文件输入
        if (this.elements.fileInput) {
            this.elements.fileInput.value = '';
        }
        
        // 重置文本数据
        this.originalText = '';
        this.currentText = '';
        this.isProcessing = false;
        this.isEditing = false;
        
        console.log('🔄 润色界面重置完成');
    }

    // 返回功能选择
    backToFunctionSelection() {
        // 隐藏所有工作区
        this.elements.generationWorkspace.style.display = 'none';
        this.elements.proofreadingWorkspace.style.display = 'none';
        this.elements.documentSection.style.display = 'none';
        
        // 显示功能选择
        this.elements.functionSelection.style.display = 'flex';
        
        // 重置润色界面到默认状态
        this.resetProofreadingInterface();
        
        // 展开右侧栏，方便用户访问设置和帮助
        this.expandRightSidebar();
        
        // 重置状态
        this.currentMode = 'selection';
        console.log('🔙 返回功能选择');
    }

    // 切换输入方式
    switchInputMethod(method) {
        // 更新导航项状态
        this.elements.navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.dataset.method === method) {
                nav.classList.add('active');
            }
        });

        // 显示对应内容区域
        const contents = ['uploadContent', 'pasteContent', 'historyContent'];
        contents.forEach(contentId => {
            const element = this.elements[contentId];
            if (element) {
                if (contentId === method + 'Content') {
                    element.style.display = 'flex';
                } else {
                    element.style.display = 'none';
                }
            }
        });

        // 如果是历史文档，加载历史列表
        if (method === 'history') {
            this.loadHistoryDocuments();
        }

        console.log(`📋 切换到输入方式: ${method}`);
    }

    // 更新粘贴统计
    updatePasteStats() {
        if (!this.elements.pasteTextarea) {
            return;
        }
        
        const text = this.elements.pasteTextarea.value || '';
        const charCount = text.length;
        const paragraphs = text.split('\n').filter(line => line.trim().length > 0).length;

        if (this.elements.pasteCharCount) {
            this.elements.pasteCharCount.textContent = `${charCount} 字符`;
        }
        if (this.elements.pasteWordCount) {
            this.elements.pasteWordCount.textContent = `${paragraphs} 段落`;
        }
    }

    // 开始粘贴润色
    startPasteProofreading() {
        const text = this.elements.pasteTextarea.value.trim();
        
        if (!text) {
            this.showError('请先粘贴文档内容');
            return;
        }

        if (text.length < 10) {
            this.showError('文档内容太短，请输入更多内容');
            return;
        }

        // 直接处理文档
        this.originalText = text;
        this.currentText = text;
        
        // 解析文字流
        this.textStream = TextUtils.parseTextStream(text);
        
        // 直接显示文档
        this.displayDocument('粘贴的文档.txt', text);
        this.updateStats();
        this.showStatus('文档加载成功，可以开始润色', 'success');

        console.log('📝 开始处理粘贴的文档:', text.length, '字符');
    }

    // 加载历史文档
    loadHistoryDocuments() {
        const savedDocuments = StorageUtils.getSavedDocuments();
        
        if (!this.elements.historyList) return;

        if (savedDocuments.length === 0) {
            this.elements.historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-inbox"></i>
                    <p>暂无已保存的文档</p>
                    <small>在公文生成功能中保存的文档会出现在这里</small>
                </div>
            `;
            return;
        }

        // 显示历史文档列表
        this.elements.historyList.innerHTML = savedDocuments.map((doc, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-item-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="history-item-content">
                    <h5 class="history-item-title">${this.escapeHtml(doc.title)}</h5>
                    <p class="history-item-meta">
                        <span class="history-item-type">${StorageUtils.getDocumentTypeName(doc.type)}</span>
                        <span class="history-item-date">${DateUtils.formatDate(doc.timestamp)}</span>
                    </p>
                    <p class="history-item-preview">${this.escapeHtml(doc.content.substring(0, 100))}...</p>
                </div>
                <div class="history-item-actions">
                    <button class="history-action-btn" onclick="assistant.loadHistoryDocument(${index})">
                        <i class="fas fa-feather-alt"></i>
                        润色
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 加载历史文档
    loadHistoryDocument(index) {
        const savedDocuments = StorageUtils.getSavedDocuments();
        
        if (index < 0 || index >= savedDocuments.length) {
            this.showError('文档不存在');
            return;
        }

        const doc = savedDocuments[index];
        
        // 设置文档内容
        this.originalText = doc.content;
        this.currentText = doc.content;
        
        // 解析文字流
        this.textStream = TextUtils.parseTextStream(doc.content);
        
        // 直接显示文档
        this.displayDocument(doc.title + '.txt', doc.content);
        this.updateStats();
        this.showStatus('历史文档加载成功，可以开始润色', 'success');

        console.log('📚 加载历史文档:', doc.title);
    }
}

// 初始化应用
let assistant;
document.addEventListener('DOMContentLoaded', () => {
    assistant = new DocumentAssistantApp();
    // 修复：将assistant实例设置到全局作用域
    window.assistant = assistant;
    console.log('�� 公文写作助手已加载');
});
