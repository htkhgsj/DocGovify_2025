/**
 * 公文生成组件
 * 负责处理公文类型选择、模板管理和文档生成功能
 */
class DocumentGeneration {
    constructor() {
        // 公文类型默认填充内容配置
        this.documentTypeDefaults = {
            notice: {
                title: '关于{主题}的通知',
                recipientUnit: '能源算力融合（哈密）研究院各部门、各项目组',
                senderUnit: '能源算力融合（哈密）研究院',
                content: '请详细描述通知的主要内容、目的、要求等信息。例如：\n\n1. 通知的背景和目的\n2. 具体的工作安排或要求\n3. 时间节点和责任人\n4. 其他相关说明\n\n请根据实际情况填写具体内容。',
                hasRecipient: true,
                hasSender: true,
                description: '通知类公文，用于发布重要事项、工作安排等',
                defaultContent: '为加强我院各项工作管理，提高工作效率，现就有关事项通知如下：\n\n一、工作目标\n明确本次工作的具体目标和预期成果。\n\n二、工作内容\n详细说明需要完成的具体工作内容。\n\n三、时间安排\n明确各项工作的时间节点和完成期限。\n\n四、工作要求\n提出具体的工作要求和注意事项。\n\n五、组织保障\n明确责任分工和保障措施。\n\n请各部门、各项目组按照通知要求，认真组织实施，确保各项工作按时完成。'
            },
            request: {
                title: '关于{事项}的请示',
                recipientUnit: '上级主管部门',
                senderUnit: '能源算力融合（哈密）研究院',
                content: '请详细描述请示事项的具体内容。例如：\n\n1. 请示事项的背景和现状\n2. 需要上级批准或指示的具体内容\n3. 相关依据和理由\n4. 建议的处理方案\n5. 其他需要说明的情况\n\n请根据实际情况填写具体内容。',
                hasRecipient: true,
                hasSender: true,
                description: '请示类公文，用于向上级请求指示或批准',
                defaultContent: '我院在开展{事项}工作中，遇到以下问题需要上级指示：\n\n一、基本情况\n简要说明当前工作的基本情况和进展。\n\n二、存在问题\n详细描述工作中遇到的具体问题和困难。\n\n三、请示事项\n明确需要上级批准或指示的具体内容。\n\n四、相关依据\n提供相关的政策依据、法律法规等。\n\n五、建议方案\n提出解决问题的建议方案和措施。\n\n六、其他说明\n其他需要上级了解或考虑的情况。\n\n特此请示，请予批示。'
            },
            report: {
                title: '{期间}工作总结报告',
                recipientUnit: '上级主管部门',
                senderUnit: '能源算力融合（哈密）研究院',
                content: '请详细描述报告的主要内容。例如：\n\n1. 工作完成情况和主要成果\n2. 工作中遇到的问题和困难\n3. 采取的措施和解决方案\n4. 下一步工作计划和建议\n5. 其他需要报告的事项\n\n请根据实际情况填写具体内容。',
                hasRecipient: true,
                hasSender: true,
                description: '报告类公文，用于向上级汇报工作情况和成果',
                defaultContent: '现将我院{期间}的工作情况报告如下：\n\n一、工作完成情况\n（一）主要工作成果\n详细说明完成的主要工作和取得的成果。\n\n（二）重点工作进展\n重点介绍重要项目的进展情况。\n\n（三）创新工作亮点\n突出工作中的创新做法和亮点。\n\n二、存在的问题和困难\n客观分析工作中存在的问题和遇到的困难。\n\n三、采取的措施和解决方案\n说明为解决这些问题采取的具体措施。\n\n四、下一步工作计划\n提出下一阶段的工作计划和目标。\n\n五、工作建议\n对上级部门提出相关工作建议。\n\n特此报告。'
            },
            meeting: {
                title: '{会议名称}会议纪要',
                recipientUnit: '相关部门和人员',
                senderUnit: '能源算力融合（哈密）研究院',
                content: '请详细描述会议的主要内容。例如：\n\n1. 会议时间、地点和参会人员\n2. 会议议题和讨论内容\n3. 形成的决议和决定\n4. 需要落实的具体事项\n5. 责任分工和时间安排\n\n请根据实际情况填写具体内容。',
                hasRecipient: true,
                hasSender: true,
                description: '会议纪要类公文，用于记录会议内容和决议',
                defaultContent: '会议时间：{具体时间}\n会议地点：{具体地点}\n主持人：{主持人姓名}\n参会人员：{参会人员名单}\n记录人：{记录人姓名}\n\n一、会议议题\n{具体议题内容}\n\n二、会议内容\n（一）{议题1}\n详细记录讨论内容和形成的意见。\n\n（二）{议题2}\n详细记录讨论内容和形成的意见。\n\n三、会议决议\n1. {决议1}\n2. {决议2}\n3. {决议3}\n\n四、工作安排\n1. {工作1}，责任人：{姓名}，完成时间：{时间}\n2. {工作2}，责任人：{姓名}，完成时间：{时间}\n\n五、其他事项\n{其他需要说明的事项}\n\n请相关部门和人员按照会议要求，认真落实各项工作。'
            },
            reply: {
                title: '关于{事项}的批复',
                recipientUnit: '请示单位',
                senderUnit: '能源算力融合（哈密）研究院',
                content: '请详细描述批复的主要内容。例如：\n\n1. 对请示事项的审查意见\n2. 批准或不予批准的决定\n3. 相关要求和注意事项\n4. 执行时间和监督要求\n5. 其他需要说明的事项\n\n请根据实际情况填写具体内容。',
                hasRecipient: true,
                hasSender: true,
                description: '批复类公文，用于回复下级请示事项',
                defaultContent: '你单位关于{事项}的请示已收悉。经研究，现批复如下：\n\n一、审查意见\n经审查，{请示事项}符合{相关条件或要求}，原则同意。\n\n二、批复决定\n（一）同意{具体内容}。\n（二）{其他决定内容}。\n\n三、相关要求\n（一）{要求1}\n（二）{要求2}\n（三）{要求3}\n\n四、注意事项\n1. {注意事项1}\n2. {注意事项2}\n3. {注意事项3}\n\n五、执行要求\n请严格按照批复要求执行，确保各项工作规范有序开展。\n\n特此批复。'
            },
            custom: {
                title: '自定义公文标题',
                recipientUnit: '',
                senderUnit: '能源算力融合（哈密）研究院',
                content: '请详细描述自定义公文的类型、格式要求和具体内容。例如：\n\n1. 公文类型和用途\n2. 格式和结构要求\n3. 主要内容描述\n4. 特殊要求或注意事项\n\n请根据实际需要填写具体内容。',
                hasRecipient: false,
                hasSender: true,
                description: '自定义公文类型，可根据需要设置格式和内容',
                defaultContent: '根据{相关依据或要求}，现就{具体事项}制定如下{公文类型}：\n\n一、总体要求\n明确公文的总体要求和目标。\n\n二、具体内容\n（一）{内容1}\n详细说明具体内容。\n\n（二）{内容2}\n详细说明具体内容。\n\n三、实施要求\n1. {要求1}\n2. {要求2}\n3. {要求3}\n\n四、保障措施\n（一）组织保障\n（二）制度保障\n（三）监督保障\n\n五、其他说明\n{其他需要说明的事项}\n\n请相关部门和人员按照要求认真执行。'
            }
        };
    }

    // 选择文档类型
    selectDocumentType(card, elements) {
        console.log('🎯 DocumentGeneration.selectDocumentType 被调用');
        console.log('📋 卡片元素:', card);
        console.log('📋 卡片类型:', card.dataset.type);
        console.log('📋 elements参数:', elements);
        
        // 移除其他卡片的选中状态
        const typeCards = document.querySelectorAll('.type-card');
        console.log('📋 找到的typeCards数量:', typeCards.length);
        typeCards.forEach(c => c.classList.remove('selected'));
        
        // 添加选中状态
        card.classList.add('selected');
        console.log('✅ 已添加选中状态');
        
        // 记录选中的类型
        const selectedDocumentType = card.dataset.type;
        console.log('📝 选中的文档类型:', selectedDocumentType);
        
        // 自动填充默认内容
        this.fillDefaultContent(selectedDocumentType, elements);
        
        console.log(`📝 选择文档类型完成: ${selectedDocumentType}`);
        return selectedDocumentType;
    }

    // 填充默认内容
    fillDefaultContent(documentType, elements) {
        console.log('🔧 fillDefaultContent 被调用');
        console.log('📋 文档类型:', documentType);
        console.log('📋 elements参数:', elements);
        
        const defaults = this.documentTypeDefaults[documentType];
        if (!defaults) {
            console.warn('⚠️ 未找到文档类型配置:', documentType);
            return;
        }
        
        console.log('📋 找到的默认配置:', defaults);
        
        // 填充标题
        if (elements.documentTitle) {
            elements.documentTitle.value = defaults.title;
            console.log('✅ 已填充标题:', defaults.title);
        } else {
            console.warn('⚠️ 未找到documentTitle元素');
        }
        
        // 填充收文单位
        if (elements.recipientUnit) {
            elements.recipientUnit.value = defaults.recipientUnit;
            console.log('✅ 已填充收文单位:', defaults.recipientUnit);
            // 根据配置显示/隐藏收文单位
            const recipientGroup = elements.recipientUnit.closest('.form-group');
            if (recipientGroup) {
                recipientGroup.style.display = defaults.hasRecipient ? 'block' : 'none';
                console.log('✅ 已设置收文单位显示状态:', defaults.hasRecipient);
            }
        } else {
            console.warn('⚠️ 未找到recipientUnit元素');
        }
        
        // 填充发文单位
        if (elements.senderUnit) {
            elements.senderUnit.value = defaults.senderUnit;
            console.log('✅ 已填充发文单位:', defaults.senderUnit);
            // 根据配置显示/隐藏发文单位
            const senderGroup = elements.senderUnit.closest('.form-group');
            if (senderGroup) {
                senderGroup.style.display = defaults.hasSender ? 'block' : 'none';
                console.log('✅ 已设置发文单位显示状态:', defaults.hasSender);
            }
        } else {
            console.warn('⚠️ 未找到senderUnit元素');
        }
        
        // 填充主要内容描述
        if (elements.documentContent) {
            elements.documentContent.value = defaults.content;
            console.log('✅ 已填充主要内容描述');
        } else {
            console.warn('⚠️ 未找到documentContent元素');
        }
        
        // 在右侧显示默认模板内容
        this.showTemplatePreview(defaults.defaultContent, elements);
        
        console.log('✅ fillDefaultContent 完成');
    }

    // 显示模板预览
    showTemplatePreview(defaultContent, elements) {
        console.log('🔧 showTemplatePreview 被调用');
        console.log('📋 默认内容:', defaultContent);
        console.log('📋 elements参数:', elements);
        console.log('📋 elements.templateContent:', elements.templateContent);
        
        // 在右侧模板预览区域显示内容
        if (elements.templateContent) {
            console.log('✅ 找到templateContent元素，开始设置内容');
            elements.templateContent.innerHTML = `
                <div class="template-text">
                    <pre>${this.escapeHtml(defaultContent)}</pre>
                </div>
            `;
            console.log('✅ 模板内容设置完成');
        } else {
            console.error('❌ 未找到templateContent元素');
            // 尝试通过ID直接查找
            const templateContent = document.getElementById('templateContent');
            if (templateContent) {
                console.log('✅ 通过ID找到templateContent元素');
                templateContent.innerHTML = `
                    <div class="template-text">
                        <pre>${this.escapeHtml(defaultContent)}</pre>
                    </div>
                `;
                console.log('✅ 模板内容设置完成（通过ID查找）');
            } else {
                console.error('❌ 通过ID也找不到templateContent元素');
            }
        }
        
        // 保存当前模板内容到实例变量
        this.currentTemplateContent = defaultContent;
        this.originalTemplateContent = defaultContent;
        console.log('✅ 模板内容已保存到实例变量');
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 启动生成模式
    initializeGenerationWorkspace(elements) {
        elements.functionSelection.style.display = 'none';
        elements.generationWorkspace.style.display = 'block';
        
        // 绑定模板管理按钮事件
        this.bindTemplateManageEvent();
        
        console.log('✨ 启动公文生成模式');
    }

    // 绑定模板管理事件
    bindTemplateManageEvent() {
        const templateManageBtn = document.getElementById('templateManageBtn');
        const templateModal = document.getElementById('templateModal');
        const closeTemplateModal = document.getElementById('closeTemplateModal');
        
        if (templateManageBtn && templateModal) {
            templateManageBtn.addEventListener('click', () => {
                // 显示模板管理模态窗口
                templateModal.style.display = 'flex';
                // 阻止背景滚动
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeTemplateModal && templateModal) {
            closeTemplateModal.addEventListener('click', () => {
                // 隐藏模板管理模态窗口
                templateModal.style.display = 'none';
                // 恢复背景滚动
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
    }

    // 初始化编辑器
    initializeEditor(title, content) {
        console.log('🔧 开始初始化编辑器...');
        
        const editorTitleInput = document.getElementById('editorDocumentTitle');
        const documentTextarea = document.getElementById('documentTextEditor');
        const saveStatus = document.getElementById('saveStatus');
        const wordCount = document.getElementById('wordCount');
        const createTime = document.getElementById('createTime');
        const lastModified = document.getElementById('lastModified');
        const documentType = document.getElementById('documentType');
        
        console.log('🔍 查找编辑器元素:', {
            editorTitleInput: !!editorTitleInput,
            documentTextarea: !!documentTextarea,
            saveStatus: !!saveStatus,
            wordCount: !!wordCount,
            createTime: !!createTime,
            lastModified: !!lastModified,
            documentType: !!documentType
        });
        
        // 设置文档标题
        if (editorTitleInput) {
            editorTitleInput.value = title || '未命名文档';
            console.log('📝 设置文档标题:', title || '未命名文档');
        } else {
            console.error('❌ 找不到editorDocumentTitle元素');
        }
        
        // 设置文档内容
        if (documentTextarea) {
            documentTextarea.value = content || '';
            console.log('📄 设置文档内容，长度:', (content || '').length);
        } else {
            console.error('❌ 找不到documentTextEditor元素');
        }
        
        // 更新文档信息
        const now = new Date();
        if (createTime) createTime.textContent = now.toLocaleString();
        if (lastModified) lastModified.textContent = now.toLocaleString();
        if (documentType) {
            const selectedType = document.querySelector('.type-card.selected');
            documentType.textContent = selectedType ? selectedType.querySelector('.type-name').textContent : '未知类型';
        }
        
        // 绑定编辑器事件
        this.bindEditorEvents();
        
        // 初始更新字数统计
        this.updateWordCount();
        
        console.log('✅ 编辑器初始化完成');
    }

    // 绑定编辑器事件
    bindEditorEvents() {
        console.log('🔗 开始绑定编辑器事件...');
        
        const documentTextarea = document.getElementById('documentTextEditor');
        const editorTitleInput = document.getElementById('editorDocumentTitle');
        const saveDocumentBtn = document.getElementById('saveDocumentBtn');
        const goToProofreadBtn = document.getElementById('goToProofreadBtn');
        const downloadDocBtn = document.getElementById('downloadDocBtn');
        const closeEditorBtn = document.getElementById('closeEditorBtn');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const editorSidebar = document.getElementById('editorSidebar');
        
        console.log('🔍 查找编辑器按钮元素:', {
            documentTextarea: !!documentTextarea,
            editorTitleInput: !!editorTitleInput,
            saveDocumentBtn: !!saveDocumentBtn,
            goToProofreadBtn: !!goToProofreadBtn,
            downloadDocBtn: !!downloadDocBtn,
            closeEditorBtn: !!closeEditorBtn,
            sidebarToggle: !!sidebarToggle,
            editorSidebar: !!editorSidebar
        });
        
        // 文档内容变化事件
        if (documentTextarea) {
            documentTextarea.addEventListener('input', () => {
                this.updateWordCount();
                this.updateSaveStatus('unsaved');
                this.updateLastModified();
            });
            console.log('✅ 绑定文档内容变化事件');
        }
        
        // 标题变化事件
        if (editorTitleInput) {
            editorTitleInput.addEventListener('input', () => {
                this.updateSaveStatus('unsaved');
                this.updateLastModified();
            });
            console.log('✅ 绑定标题变化事件');
        }
        
        // 保存按钮
        if (saveDocumentBtn) {
            saveDocumentBtn.addEventListener('click', () => {
                this.saveDocument();
            });
            console.log('✅ 绑定保存按钮事件');
        }
        
        // 转到润色按钮
        if (goToProofreadBtn) {
            goToProofreadBtn.addEventListener('click', () => {
                this.goToProofreading();
            });
            console.log('✅ 绑定转到润色按钮事件');
        }
        
        // 下载按钮
        if (downloadDocBtn) {
            downloadDocBtn.addEventListener('click', () => {
                this.downloadDocument();
            });
            console.log('✅ 绑定下载按钮事件');
        }
        
        // 关闭编辑器按钮
        if (closeEditorBtn) {
            closeEditorBtn.addEventListener('click', () => {
                this.closeEditor();
            });
            console.log('✅ 绑定关闭编辑器按钮事件');
        }
        
        // 侧边栏切换
        if (sidebarToggle && editorSidebar) {
            sidebarToggle.addEventListener('click', () => {
                editorSidebar.classList.toggle('collapsed');
            });
            console.log('✅ 绑定侧边栏切换事件');
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveDocument();
            }
        });
        
        console.log('✅ 编辑器事件绑定完成');
    }

    // 更新字数统计
    updateWordCount() {
        const documentTextarea = document.getElementById('documentTextEditor');
        const wordCount = document.getElementById('wordCount');
        
        if (documentTextarea && wordCount) {
            const text = documentTextarea.value;
            const count = text.length;
            wordCount.textContent = `${count} 字`;
        }
    }

    // 更新保存状态
    updateSaveStatus(status) {
        const saveStatus = document.getElementById('saveStatus');
        if (!saveStatus) return;
        
        const statusIndicator = saveStatus.querySelector('i');
        const statusText = saveStatus.childNodes[saveStatus.childNodes.length - 1];
        
        saveStatus.className = 'status-indicator';
        
        switch (status) {
            case 'saved':
                saveStatus.classList.add('saved');
                if (statusIndicator) statusIndicator.className = 'fas fa-circle';
                if (statusText) statusText.textContent = ' 已保存';
                break;
            case 'unsaved':
                saveStatus.classList.add('unsaved');
                if (statusIndicator) statusIndicator.className = 'fas fa-circle';
                if (statusText) statusText.textContent = ' 未保存';
                break;
            case 'saving':
                saveStatus.classList.add('saving');
                if (statusIndicator) statusIndicator.className = 'fas fa-circle';
                if (statusText) statusText.textContent = ' 保存中...';
                break;
        }
    }

    // 更新最后修改时间
    updateLastModified() {
        const lastModified = document.getElementById('lastModified');
        if (lastModified) {
            lastModified.textContent = new Date().toLocaleString();
        }
    }

    // 保存文档
    async saveDocument() {
        const editorTitleInput = document.getElementById('editorDocumentTitle');
        const documentTextarea = document.getElementById('documentTextEditor');
        
        if (!editorTitleInput || !documentTextarea) return;
        
        this.updateSaveStatus('saving');
        
        try {
            // 模拟保存延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 更新生成的文档内容
            const assistant = window.documentAssistant;
            if (assistant) {
                assistant.generatedDocument = documentTextarea.value;
            }
            
            this.updateSaveStatus('saved');
            console.log('📁 文档已保存');
        } catch (error) {
            console.error('❌ 保存失败:', error);
            this.updateSaveStatus('unsaved');
        }
    }

    // 转到润色
    goToProofreading() {
        const documentTextarea = document.getElementById('documentTextEditor');
        if (!documentTextarea) return;
        
        const assistant = window.documentAssistant;
        if (assistant) {
            assistant.generatedDocument = documentTextarea.value;
            assistant.showProofreadingWorkspace();
        }
    }

    // 下载文档
    downloadDocument() {
        const editorTitleInput = document.getElementById('editorDocumentTitle');
        const documentTextarea = document.getElementById('documentTextEditor');
        
        if (!editorTitleInput || !documentTextarea) return;
        
        const title = editorTitleInput.value || '未命名文档';
        const content = documentTextarea.value;
        
        // 创建下载链接
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('📥 文档已下载');
    }

    // 关闭编辑器
    closeEditor() {
        console.log('🔒 关闭编辑器');
        
        // 隐藏编辑器
        const documentEditor = document.getElementById('documentEditor');
        if (documentEditor) {
            documentEditor.style.display = 'none';
        }
        
        // 重新显示生成工作区
        const generationPanel = document.querySelector('.generation-panel-new');
        if (generationPanel) {
            generationPanel.style.display = 'block';
        }
        
        // 清空编辑器内容
        const documentTextarea = document.getElementById('documentTextEditor');
        const editorTitleInput = document.getElementById('editorDocumentTitle');
        if (documentTextarea) documentTextarea.value = '';
        if (editorTitleInput) editorTitleInput.value = '';
        
        console.log('✅ 编辑器已关闭，返回生成界面');
    }

    // 在编辑器中显示等待动画
    showEditorLoading(title) {
        const documentTextarea = document.getElementById('documentTextEditor');
        const editorTitleInput = document.getElementById('editorDocumentTitle');
        
        // 设置文档标题
        if (editorTitleInput) {
            editorTitleInput.value = title || '未命名文档';
        }
        
        // 在编辑器中显示等待动画
        if (documentTextarea) {
            documentTextarea.value = `正在生成公文内容，请稍候...

生成中...
⏳ 请耐心等待AI生成公文内容
⏳ 生成完成后将自动显示内容
⏳ 您可以先编辑文档标题`;
        }
        
        // 初始化编辑器基本信息
        this.initializeEditorBasic(title);
    }

    // 初始化编辑器基本信息
    initializeEditorBasic(title) {
        const createTime = document.getElementById('createTime');
        const lastModified = document.getElementById('lastModified');
        const documentType = document.getElementById('documentType');
        
        // 更新文档信息
        const now = new Date();
        if (createTime) createTime.textContent = now.toLocaleString();
        if (lastModified) lastModified.textContent = now.toLocaleString();
        if (documentType) {
            const selectedType = document.querySelector('.type-card.selected');
            documentType.textContent = selectedType ? selectedType.querySelector('.type-name').textContent : '未知类型';
        }
        
        // 绑定编辑器事件
        this.bindEditorEvents();
        
        // 初始更新字数统计
        this.updateWordCount();
    }

    // 异步生成内容
    async generateContentAsync(assistant, prompt, title, recipient, sender, content) {
        try {
            console.log('🔄 开始异步生成内容...');
            
            // 调用AI服务生成内容
            let generatedText = await assistant.sendGenerationRequest(prompt);
            
            // 如果AI没有返回内容，使用模拟数据
            if (!generatedText) {
                generatedText = `关于${title}的公文

尊敬的${recipient}：

    根据您的要求，我们特此发布关于${title}的公文。

主要内容：
${content}

此公文自发布之日起生效，请相关部门遵照执行。

特此通知。

${sender}
${new Date().toLocaleDateString()}`;
                console.log('🔧 使用模拟数据');
            }
            
            console.log('🤖 AI返回结果:', generatedText ? '有内容' : '无内容', generatedText?.length || 0, '字符');
            
            if (generatedText) {
                // 更新编辑器内容
                const documentTextarea = document.getElementById('documentTextEditor');
                if (documentTextarea) {
                    documentTextarea.value = generatedText;
                    console.log('📄 更新编辑器内容');
                }
                
                // 更新字数统计
                this.updateWordCount();
                
                // 更新保存状态
                this.updateSaveStatus('saved');
                
                // 更新最后修改时间
                this.updateLastModified();
                
                assistant.generatedDocument = generatedText;
                assistant.isEditing = false;
                
                console.log('🔘 内容生成完成');
                assistant.showStatus('公文生成完成！可以编辑、保存或转到润色界面', 'success');
            } else {
                console.error('❌ AI返回内容为空');
                assistant.showError('AI返回的内容为空，请检查API配置或重试');
            }
        } catch (error) {
            console.error('❌ 异步生成失败:', error);
            
            // 在编辑器中显示错误信息
            const documentTextarea = document.getElementById('documentTextEditor');
            if (documentTextarea) {
                documentTextarea.value = `生成失败: ${error.message}

请检查网络连接或API配置，然后重试。

错误详情：
${error.message}`;
            }
            
            assistant.showError('公文生成失败: ' + error.message);
        }
    }

    // 更新默认标题
    updateDefaultTitle(elements, selectedDocumentType) {
        if (!selectedDocumentType) return;
        
        const titleTemplates = {
            notice: '关于{主题}的通知',
            request: '关于{事项}的请示',
            report: '{期间}工作总结报告',
            memo: '关于{事项}的备忘录',
            decision: '关于{事项}的决定',
            reply: '关于{事项}的批复'
        };
        
        // 如果标题输入框为空，则设置默认标题
        if (!elements.documentTitle.value.trim()) {
            const template = titleTemplates[selectedDocumentType];
            if (template) {
                // 生成一个简单的默认标题
                const defaultTitle = template.replace(/\{.*?\}/g, '相关事项');
                elements.documentTitle.value = defaultTitle;
            }
        }
    }

    // 模板管理方法
    useTemplate(elements) {
        if (this.currentTemplateContent) {
            if (elements.documentContent) {
                elements.documentContent.value = this.currentTemplateContent;
                // 显示状态
                if (window.assistant) {
                    window.assistant.showStatus('已使用模板内容', 'success');
                }
            }
        }
    }

    editTemplate(elements) {
        const templateContent = document.getElementById('templateContent');
        if (templateContent) {
            templateContent.innerHTML = `
                <textarea id="editableTemplate" class="template-editor" rows="15">${this.escapeHtml(this.currentTemplateContent)}</textarea>
            `;
            
            // 聚焦到编辑器
            const textarea = document.getElementById('editableTemplate');
            if (textarea) {
                textarea.focus();
            }
            
            if (window.assistant) {
                window.assistant.showStatus('进入模板编辑模式', 'info');
            }
        }
    }

    saveTemplate(elements) {
        const textarea = document.getElementById('editableTemplate');
        if (textarea) {
            this.currentTemplateContent = textarea.value;
            
            // 恢复显示模式
            const templateContent = document.getElementById('templateContent');
            if (templateContent) {
                templateContent.innerHTML = `
                    <div class="template-text">
                        <pre>${this.escapeHtml(this.currentTemplateContent)}</pre>
                    </div>
                `;
            }
            
            if (window.assistant) {
                window.assistant.showStatus('模板已保存', 'success');
            }
        }
    }

    resetTemplate(elements) {
        if (this.originalTemplateContent) {
            this.currentTemplateContent = this.originalTemplateContent;
            
            // 恢复显示模式
            const templateContent = document.getElementById('templateContent');
            if (templateContent) {
                templateContent.innerHTML = `
                    <div class="template-text">
                        <pre>${this.escapeHtml(this.currentTemplateContent)}</pre>
                    </div>
                `;
            }
            
            if (window.assistant) {
                window.assistant.showStatus('模板已恢复到默认', 'info');
            }
        }
    }

    // 生成文档
    async generateDocument(elements, assistant) {
        console.log('🚀 开始生成公文...');
        
        if (!assistant.validateApiKey()) return;
        
        const title = elements.documentTitle.value.trim();
        const recipient = elements.recipientUnit.value.trim();
        const sender = elements.senderUnit.value.trim();
        const content = elements.documentContent.value.trim();
        
        console.log('📋 表单数据:', { title, recipient, sender, content, selectedType: assistant.selectedDocumentType });
        
        if (!assistant.selectedDocumentType) {
            assistant.showError('请选择公文类型');
            return;
        }
        
        if (!title || !content) {
            assistant.showError('请填写文档标题和主要内容');
            return;
        }
        
        try {
            // 修改生成按钮状态为"正在生成..."
            const generateBtn = document.getElementById('generateBtn');
            if (generateBtn) {
                const originalText = generateBtn.innerHTML;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';
                generateBtn.disabled = true;
                
                // 保存原始文本，以便后续恢复
                generateBtn.dataset.originalText = originalText;
            }
            
            // 直接构建提示词并调用AI服务
            const prompt = assistant.buildGenerationPrompt(title, recipient, sender, content);
            console.log('📝 生成的提示词:', prompt);
            
            // 调用AI服务生成内容
            const generatedText = await this.generateWithAI(assistant, prompt, title);
            
            if (generatedText && generatedText.trim()) {
                console.log('✅ AI生成成功，内容长度:', generatedText.length);
                
                // 直接显示生成结果
                this.showGenerationResult(title, generatedText, assistant);
                
                // 保存生成的文档
                assistant.generatedDocument = generatedText;
                assistant.isEditing = false;
                
                assistant.showStatus('公文生成完成！可以编辑、保存或转到润色界面', 'success');
            } else {
                throw new Error('AI返回的内容为空');
            }
            
        } catch (error) {
            console.error('❌ 生成失败:', error);
            
            // 显示错误信息
            this.showGenerationError(error.message, assistant);
            
            assistant.showError('公文生成失败: ' + error.message);
        } finally {
            // 恢复生成按钮状态
            const generateBtn = document.getElementById('generateBtn');
            if (generateBtn && generateBtn.dataset.originalText) {
                generateBtn.innerHTML = generateBtn.dataset.originalText;
                generateBtn.disabled = false;
                delete generateBtn.dataset.originalText;
            }
        }
    }

    // 显示等待页面
    showWaitingPage(title) {
        console.log('🎬 显示等待页面...');
        
        // 隐藏生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'none';
        }
        
        // 隐藏模板管理模态窗口
        const templateModal = document.getElementById('templateModal');
        if (templateModal) {
            templateModal.style.display = 'none';
        }
        
        // 显示等待页面
        const waitingPage = this.createWaitingPage(title);
        document.body.appendChild(waitingPage);
        
        // 启动进度更新动画
        this.startWaitingProgress(waitingPage);
        
        console.log('✅ 等待页面已显示');
    }

    // 创建等待页面
    createWaitingPage(title) {
        const waitingPage = document.createElement('div');
        waitingPage.className = 'waiting-page';
        waitingPage.innerHTML = `
            <div class="waiting-container">
                <div class="waiting-header">
                    <h2><i class="fas fa-magic"></i> AI公文生成中</h2>
                    <p class="waiting-subtitle">正在使用大语言模型生成"${title}"</p>
                </div>
                
                <div class="waiting-content">
                    <div class="loading-animation">
                        <div class="spinner"></div>
                        <div class="pulse-ring"></div>
                        <div class="pulse-ring"></div>
                        <div class="pulse-ring"></div>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text" id="waitingProgressText">正在分析公文类型和内容要求...</div>
                        
                        <div class="status-section">
                            <div class="status-item">
                                <i class="fas fa-brain"></i>
                                <span>AI正在理解您的公文需求</span>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-cogs"></i>
                                <span>正在生成符合规范的公文内容</span>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-check-circle"></i>
                                <span>即将完成，请耐心等待</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tips-section">
                    <h4><i class="fas fa-lightbulb"></i> 生成提示</h4>
                    <ul>
                        <li>AI会根据您选择的公文类型自动调整格式和结构</li>
                        <li>生成的内容将符合公文写作规范和要求</li>
                        <li>您可以对生成的内容进行编辑和调整</li>
                        <li>生成完成后可以直接保存或转到润色界面</li>
                    </ul>
                </div>
                
                <div class="waiting-footer">
                    <button class="cancel-btn" id="cancelGenerationBtn">
                        <i class="fas fa-times"></i> 取消生成
                    </button>
                </div>
            </div>
        `;
        
        // 绑定取消按钮事件
        const cancelBtn = waitingPage.querySelector('#cancelGenerationBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelGeneration(waitingPage);
            });
        }
        
        return waitingPage;
    }

    // 启动等待进度动画
    startWaitingProgress(waitingPage) {
        const progressText = waitingPage.querySelector('#waitingProgressText');
        if (!progressText) return;
        
        const progressSteps = [
            '正在分析公文类型和内容要求...',
            '正在构建AI提示词...',
            '正在调用大语言模型...',
            '正在生成公文内容...',
            '正在优化格式和结构...',
            '正在完善语言表达...',
            '即将完成，请稍候...'
        ];
        
        let currentStep = 0;
        
        const updateProgress = () => {
            if (progressText && currentStep < progressSteps.length) {
                progressText.textContent = progressSteps[currentStep];
                currentStep++;
            }
        };
        
        // 每1.5秒更新一次进度
        this.waitingProgressInterval = setInterval(updateProgress, 1500);
        
        // 立即显示第一步
        updateProgress();
    }

    // 停止等待进度动画
    stopWaitingProgress() {
        if (this.waitingProgressInterval) {
            clearInterval(this.waitingProgressInterval);
            this.waitingProgressInterval = null;
        }
    }

    // 取消生成
    cancelGeneration(waitingPage) {
        console.log('❌ 用户取消生成');
        
        // 停止进度动画
        this.stopWaitingProgress();
        
        // 移除等待页面
        if (waitingPage && waitingPage.parentNode) {
            waitingPage.parentNode.removeChild(waitingPage);
        }
        
        // 显示生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'grid';
        }
        
        // 显示取消状态
        if (window.assistant) {
            window.assistant.showStatus('公文生成已取消', 'info');
        }
    }

    // 通过AI生成内容
    async generateWithAI(assistant, prompt, title) {
        console.log('🤖 开始调用AI服务...');
        
        try {
            // 调用AI服务生成内容
            const generatedText = await assistant.sendGenerationRequest(prompt);
            
            if (generatedText && generatedText.trim()) {
                console.log('✅ AI生成成功，内容长度:', generatedText.length);
                return generatedText;
        } else {
                throw new Error('AI返回的内容为空');
            }
            
        } catch (error) {
            console.error('❌ AI生成失败:', error);
            throw error;
        }
    }

    // 显示生成结果
    showGenerationResult(title, content, assistant) {
        console.log('📄 显示生成结果...');
        
        // 隐藏生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'none';
        }
        
        // 显示结果页面
        const resultPage = this.createResultPage(title, content, assistant);
        
        // 在生成工作区内显示结果，而不是弹出框
        const generationWorkspace = document.getElementById('generationWorkspace');
        if (generationWorkspace) {
            generationWorkspace.appendChild(resultPage);
        }
        
        console.log('✅ 结果页面已显示');
    }

    // 创建结果页面
    createResultPage(title, content, assistant) {
        const resultPage = document.createElement('div');
        resultPage.className = 'result-page-inline';
        resultPage.innerHTML = `
            <div class="result-container-inline">
                <div class="result-header">
                    <h2><i class="fas fa-check-circle"></i> 生成完成</h2>
                    <p class="result-subtitle">${title}</p>
                </div>
                
                <div class="result-content">
                    <div class="document-preview">
                        <h4><i class="fas fa-file-alt"></i> 预览</h4>
                        <div class="preview-content">
                            <pre>${this.escapeHtml(content)}</pre>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="action-btn success" id="downloadDocumentBtn">
                            <i class="fas fa-download"></i> 下载
                        </button>
                        <button class="action-btn info" id="goToProofreadingBtn">
                            <i class="fas fa-feather-alt"></i> 润色
                        </button>
                    </div>
                </div>
                
                <div class="result-footer">
                    <button class="back-btn" id="backToGenerationBtn">
                        <i class="fas fa-arrow-left"></i> 返回
                    </button>
                    <button class="new-btn" id="newDocumentBtn">
                        <i class="fas fa-plus"></i> 新建
                    </button>
                </div>
            </div>
        `;
        
        // 绑定按钮事件
        this.bindResultPageEvents(resultPage, title, content, assistant);
        
        return resultPage;
    }

    // 绑定结果页面事件
    bindResultPageEvents(resultPage, title, content, assistant) {
        const downloadBtn = resultPage.querySelector('#downloadDocumentBtn');
        const proofreadingBtn = resultPage.querySelector('#goToProofreadingBtn');
        const backBtn = resultPage.querySelector('#backToGenerationBtn');
        const newBtn = resultPage.querySelector('#newDocumentBtn');
        
        // 下载文档 - 直接下载文件
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                console.log('📥 下载文档按钮被点击');
                this.downloadDocumentFile(title, content);
            });
        }
        
        // 转到润色 - 直接跳转到润色界面
        if (proofreadingBtn) {
            proofreadingBtn.addEventListener('click', () => {
                console.log('✨ 转到润色按钮被点击');
                this.openProofreadingInterface(title, content, assistant);
            });
        }
        
        // 返回生成界面
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('🔙 返回生成界面按钮被点击');
                this.backToGeneration(resultPage);
            });
        }
        
        // 生成新文档
        if (newBtn) {
            newBtn.addEventListener('click', () => {
                console.log('🆕 生成新文档按钮被点击');
                this.newDocument(resultPage);
            });
        }
        
        console.log('✅ 结果页面事件绑定完成');
    }

    // 返回生成界面
    backToGeneration(resultPage) {
        console.log('🔙 返回生成界面');
        
        // 移除结果页面
        if (resultPage && resultPage.parentNode) {
            resultPage.parentNode.removeChild(resultPage);
        }
        
        // 显示生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'grid';
        }
        
        // 确保生成工作区可见
        const generationWorkspace = document.getElementById('generationWorkspace');
        if (generationWorkspace) {
            generationWorkspace.style.display = 'block';
        }
        
        console.log('✅ 已返回生成界面');
    }

    // 生成新文档
    newDocument(resultPage) {
        console.log('🆕 生成新文档');
        
        // 移除结果页面
        if (resultPage && resultPage.parentNode) {
            resultPage.parentNode.removeChild(resultPage);
        }
        
        // 显示生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'grid';
        }
        
        // 确保生成工作区可见
        const generationWorkspace = document.getElementById('generationWorkspace');
        if (generationWorkspace) {
            generationWorkspace.style.display = 'block';
        }
        
        // 重置表单
        this.resetGenerationForm();
        
        console.log('✅ 已准备生成新文档');
    }

    // 重置生成表单
    resetGenerationForm() {
        const documentTitle = document.getElementById('documentTitle');
        const recipientUnit = document.getElementById('recipientUnit');
        const senderUnit = document.getElementById('senderUnit');
        const documentContent = document.getElementById('documentContent');
        
        if (documentTitle) documentTitle.value = '';
        if (recipientUnit) recipientUnit.value = '';
        if (senderUnit) senderUnit.value = '';
        if (documentContent) documentContent.value = '';
        
        // 清除选中的公文类型
        const selectedType = document.querySelector('.type-card.selected');
        if (selectedType) {
            selectedType.classList.remove('selected');
        }
        
        // 清空模板预览
        const templateContent = document.getElementById('templateContent');
        if (templateContent) {
            templateContent.innerHTML = '<p class="template-placeholder">请先选择公文类型查看模板内容</p>';
        }
    }

    // 显示生成错误界面
    showGenerationError(errorMessage, assistant) {
        console.log('❌ 显示生成错误界面...');
        
        // 隐藏生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'none';
        }
        
        // 显示错误页面
        const errorPage = this.createErrorPage(errorMessage, assistant);
        
        // 在生成工作区内显示错误，而不是弹出框
        const generationWorkspace = document.getElementById('generationWorkspace');
        if (generationWorkspace) {
            generationWorkspace.appendChild(errorPage);
        }
        
        console.log('✅ 错误页面已显示');
    }

    // 创建错误页面
    createErrorPage(errorMessage, assistant) {
        const errorPage = document.createElement('div');
        errorPage.className = 'error-page-inline';
        errorPage.innerHTML = `
            <div class="error-container-inline">
                <div class="error-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> 生成失败</h2>
                    <p class="error-subtitle">公文生成过程中遇到问题</p>
                </div>
                
                <div class="error-content">
                    <div class="error-details">
                        <h4><i class="fas fa-bug"></i> 错误信息</h4>
                        <div class="error-message">${this.escapeHtml(errorMessage)}</div>
                    </div>
                    
                    <div class="error-suggestions">
                        <h4><i class="fas fa-lightbulb"></i> 解决建议</h4>
                        <ul>
                            <li>检查网络连接是否正常</li>
                            <li>验证API密钥是否有效</li>
                            <li>确认API服务是否可用</li>
                            <li>检查请求参数是否正确</li>
                        </ul>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="action-btn primary" id="retryBtn">
                            <i class="fas fa-redo"></i> 重试生成
                        </button>
                        <button class="action-btn secondary" id="checkConfigBtn">
                            <i class="fas fa-cog"></i> 检查配置
                        </button>
                    </div>
                </div>
                
                <div class="error-footer">
                    <button class="back-btn" id="backToGenerationFromErrorBtn">
                        <i class="fas fa-arrow-left"></i> 返回生成界面
                    </button>
                </div>
            </div>
        `;
        
        // 绑定错误页面事件
        this.bindErrorPageEvents(errorPage, errorMessage, assistant);
        
        return errorPage;
    }

    // 绑定错误页面事件
    bindErrorPageEvents(errorPage, errorMessage, assistant) {
        const retryBtn = errorPage.querySelector('#retryBtn');
        const checkConfigBtn = errorPage.querySelector('#checkConfigBtn');
        const backBtn = errorPage.querySelector('#backToGenerationFromErrorBtn');
        
        // 重试生成
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryGeneration(errorPage, assistant);
            });
        }
        
        // 检查配置
        if (checkConfigBtn) {
            checkConfigBtn.addEventListener('click', () => {
                this.checkConfiguration(errorPage);
            });
        }
        
        // 返回生成界面
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.backToGenerationFromError(errorPage);
            });
        }
    }

    // 重试生成
    retryGeneration(errorPage, assistant) {
        console.log('🔄 重试生成');
        
        // 移除错误页面
        if (errorPage && errorPage.parentNode) {
            errorPage.parentNode.removeChild(errorPage);
        }
        
        // 重新调用生成方法
        const elements = {
            documentTitle: document.getElementById('documentTitle'),
            recipientUnit: document.getElementById('recipientUnit'),
            senderUnit: document.getElementById('senderUnit'),
            documentContent: document.getElementById('documentContent')
        };
        
        this.generateDocument(elements, assistant);
        
        console.log('✅ 已重试生成');
    }

    // 检查配置
    checkConfiguration(errorPage) {
        console.log('🔧 检查配置');
        
        // 显示配置模态框
        const configModal = document.getElementById('configModal');
        if (configModal) {
            configModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // 从错误页面返回生成界面
    backToGenerationFromError(errorPage) {
        console.log('🔙 从错误页面返回生成界面');
        
        // 移除错误页面
        if (errorPage && errorPage.parentNode) {
            errorPage.parentNode.removeChild(errorPage);
        }
        
        // 显示生成面板
        const generationPanelNew = document.querySelector('.generation-panel-new');
        if (generationPanelNew) {
            generationPanelNew.style.display = 'grid';
        }
        
        console.log('✅ 已从错误页面返回生成界面');
    }

    // 编辑生成的文档
    editGeneratedDocument(assistant, elements) {
        // 此方法已废弃，使用openDocumentEditor替代
        console.warn('⚠️ editGeneratedDocument方法已废弃，请使用openDocumentEditor');
    }

    // 下载生成的文档
    downloadGeneratedDocument(assistant, elements) {
        // 此方法已废弃，使用downloadDocumentFile替代
        console.warn('⚠️ downloadGeneratedDocument方法已废弃，请使用downloadDocumentFile');
    }

    // 保存生成的文档
    saveGeneratedDocument(assistant, elements) {
        // 此方法已废弃，使用saveDocumentToLocal替代
        console.warn('⚠️ saveGeneratedDocument方法已废弃，请使用saveDocumentToLocal');
    }

    // 转到润色模式
    goToProofreadingMode(assistant, elements) {
        // 此方法已废弃，使用openProofreadingInterface替代
        console.warn('⚠️ goToProofreadingMode方法已废弃，请使用openProofreadingInterface');
    }

    // 打开文档编辑器
    openDocumentEditor(title, content, assistant) {
        console.log('📝 打开文档编辑器');
        
        // 移除结果页面
        const resultPage = document.querySelector('.result-page-inline');
        if (resultPage && resultPage.parentNode) {
            resultPage.parentNode.removeChild(resultPage);
        }
        
        // 隐藏生成工作区的其他部分，只显示编辑器
        const generationPanel = document.querySelector('.generation-panel-new');
        if (generationPanel) {
            generationPanel.style.display = 'none';
        }
        
        // 显示编辑器界面
        const documentEditor = document.getElementById('documentEditor');
        if (documentEditor) {
            documentEditor.style.display = 'block';
            
            // 初始化编辑器内容
            this.initializeEditor(title, content);
            
            // 显示成功状态
            this.showSuccess('已打开编辑器，可以开始编辑文档');
            
            console.log('✅ 编辑器已显示并初始化');
        } else {
            console.error('❌ 找不到文档编辑器元素');
            // 如果找不到编辑器，显示错误提示
            this.showError('找不到编辑器界面，请刷新页面重试');
        }
    }

    // 保存文档到本地
    saveDocumentToLocal(title, content) {
        console.log('💾 保存文档到本地');
        
        try {
            // 创建文档数据
            const documentData = {
                title: title || '未命名文档',
                content: content,
                timestamp: new Date().toISOString(),
                type: 'generated'
            };
            
            // 保存到localStorage
            const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
            savedDocs.push(documentData);
            localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
            
            // 显示成功状态
            this.showSuccess('文档已保存到本地存储');
            
            console.log('✅ 文档保存成功:', documentData.title);
            
        } catch (error) {
            console.error('❌ 保存失败:', error);
            this.showError('保存失败: ' + error.message);
        }
    }

    // 下载文档文件
    downloadDocumentFile(title, content) {
        console.log('📥 下载文档文件');
        
        try {
            const filename = `${title || '生成的公文'}.txt`;
            
            // 创建Blob对象
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            
            // 创建下载链接
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            // 触发下载
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // 释放URL对象
            window.URL.revokeObjectURL(url);
            
            // 显示成功状态
            this.showSuccess('文档下载成功');
            
            console.log('✅ 文档下载成功:', filename);
            
        } catch (error) {
            console.error('❌ 下载失败:', error);
            this.showError('下载失败: ' + error.message);
        }
    }

    // 打开润色界面
    openProofreadingInterface(title, content, assistant) {
        console.log('✨ 打开润色界面');
        
        // 移除结果页面
        const resultPage = document.querySelector('.result-page-inline');
        if (resultPage && resultPage.parentNode) {
            resultPage.parentNode.removeChild(resultPage);
        }
        
        // 设置润色界面的文档内容
        if (assistant) {
            assistant.generatedDocument = content;
            assistant.originalText = content;
            assistant.currentText = content;
            
            // 调用润色工作区显示方法
            if (assistant.showProofreadingWorkspace) {
                assistant.showProofreadingWorkspace();
            } else {
                // 备用方案：直接切换到润色工作区
                this.switchToProofreadingWorkspace(assistant);
            }
            
            // 显示成功状态
            this.showSuccess('已转到润色界面，可以开始校对');
        } else {
            console.error('❌ 找不到assistant实例');
            this.showError('无法打开润色界面，请刷新页面重试');
        }
    }

    // 切换到润色工作区
    switchToProofreadingWorkspace(assistant) {
        console.log('🔄 切换到润色工作区');
        
        // 隐藏生成工作区
        const generationWorkspace = document.getElementById('generationWorkspace');
        if (generationWorkspace) {
            generationWorkspace.style.display = 'none';
            console.log('✅ 隐藏生成工作区');
        }
        
        // 显示润色工作区
        const proofreadingWorkspace = document.getElementById('proofreadingWorkspace');
        if (proofreadingWorkspace) {
            proofreadingWorkspace.style.display = 'block';
            console.log('✅ 显示润色工作区');
        }
        
        // 显示文档内容
        const documentSection = document.getElementById('documentSection');
        if (documentSection) {
            documentSection.style.display = 'flex';
            console.log('✅ 显示文档区域');
        }
        
        // 更新文件信息显示
        this.updateProofreadingDocumentInfo(assistant);
        
        // 显示成功状态
        this.showSuccess('已成功切换到润色界面');
    }

    // 更新润色界面的文档信息
    updateProofreadingDocumentInfo(assistant) {
        console.log('📋 更新润色界面文档信息');
        
        const fileName = `${assistant.generatedDocument ? '生成的公文' : '未命名文档'}.txt`;
        
        // 更新文件名显示
        const fileNameElement = document.getElementById('fileName');
        if (fileNameElement) {
            fileNameElement.textContent = fileName;
            console.log('✅ 更新文件名:', fileName);
        } else {
            console.warn('⚠️ 找不到fileName元素');
        }
        
        // 更新文档内容显示
        const documentContent = document.getElementById('documentContent');
        if (documentContent && assistant.generatedDocument) {
            documentContent.textContent = assistant.generatedDocument;
            console.log('✅ 更新文档内容');
        } else {
            console.warn('⚠️ 找不到documentContent元素或内容为空');
        }
        
        // 更新统计信息
        if (assistant.updateStats) {
            assistant.updateStats();
            console.log('✅ 更新统计信息');
        } else {
            console.warn('⚠️ assistant.updateStats方法不存在');
        }
        
        console.log('✅ 润色界面文档信息更新完成');
    }

    // 显示成功状态
    showSuccess(message) {
        console.log('✅ 显示成功提示:', message);
        
        // 创建临时成功提示
        const successToast = document.createElement('div');
        successToast.className = 'success-toast';
        successToast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(successToast);
        
        // 显示动画
        setTimeout(() => successToast.classList.add('show'), 100);
        
        // 自动移除
        setTimeout(() => {
            successToast.classList.remove('show');
            setTimeout(() => {
                if (successToast.parentNode) {
                    successToast.parentNode.removeChild(successToast);
                }
            }, 300);
        }, 3000);
    }

    // 显示错误状态
    showError(message) {
        console.log('❌ 显示错误提示:', message);
        
        // 创建临时错误提示
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(errorToast);
        
        // 显示动画
        setTimeout(() => errorToast.classList.add('show'), 100);
        
        // 自动移除
        setTimeout(() => {
            errorToast.classList.remove('show');
            setTimeout(() => {
                if (errorToast.parentNode) {
                    errorToast.parentNode.removeChild(errorToast);
                }
            }, 300);
        }, 5000);
    }
}

// 导出类供其他模块使用
window.DocumentGeneration = DocumentGeneration;
