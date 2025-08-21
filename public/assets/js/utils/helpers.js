/**
 * 工具函数模块
 * 包含各种通用的辅助函数
 */

// 文件处理工具
const FileUtils = {
    // 读取文件为文本
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('文件读取错误'));
            reader.readAsText(file, 'UTF-8');
        });
    },

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    // 导出文档
    exportDocument(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// 文本处理工具
const TextUtils = {
    // 解析文字流
    parseTextStream(text) {
        const textStream = {
            sentences: [],
            currentBatchIndex: 0,
            batchSize: 3,
            pendingChoices: [],
            processedSentences: 0
        };

        // 使用更精确的句子分割正则表达式
        const sentenceEndPattern = /([。！？；])\s*/g;
        const sentences = [];
        let lastIndex = 0;
        let match;
        let sentenceId = 0;

        // 找到所有句子结束标记
        while ((match = sentenceEndPattern.exec(text)) !== null) {
            const sentenceText = text.substring(lastIndex, match.index + 1).trim();
            if (sentenceText) {
                sentences.push({
                    id: sentenceId++,
                    text: sentenceText,
                    startPos: lastIndex,
                    endPos: match.index + 1,
                    status: 'pending',     // pending, processing, completed, modified
                    originalText: sentenceText,
                    suggestions: [],
                    hasUserChoice: false
                });
            }
            lastIndex = match.index + 1;
        }

        // 处理最后一段（如果没有结束标点）
        if (lastIndex < text.length) {
            const remainingText = text.substring(lastIndex).trim();
            if (remainingText) {
                sentences.push({
                    id: sentenceId++,
                    text: remainingText,
                    startPos: lastIndex,
                    endPos: text.length,
                    status: 'pending',
                    originalText: remainingText,
                    suggestions: [],
                    hasUserChoice: false
                });
            }
        }

        textStream.sentences = sentences;
        console.log(`📝 文字流解析完成: ${sentences.length} 个句子`);
        return textStream;
    },

    // 格式化文本显示
    formatTextForDisplay(text) {
        // 将文本分割成字符，每个字符用span包装，便于后续替换动画
        return text.split('').map((char, index) => {
            if (char === '\n') {
                return '<br>';
            } else if (char === ' ') {
                return '<span class="char" data-index="' + index + '">&nbsp;</span>';
            } else {
                return '<span class="char" data-index="' + index + '">' + this.escapeHtml(char) + '</span>';
            }
        }).join('');
    },

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // 重建当前文本
    rebuildCurrentText(textStream) {
        const currentText = textStream.sentences.map(sentence => sentence.text).join('');
        
        // 重新计算所有句子的位置
        let currentPos = 0;
        textStream.sentences.forEach(sentence => {
            sentence.startPos = currentPos;
            sentence.endPos = currentPos + sentence.text.length;
            currentPos = sentence.endPos;
        });

        return currentText;
    }
};

// DOM操作工具
const DOMUtils = {
    // 高亮文本段落
    highlightTextSegment(textDisplay, start, end, cssClass = 'processing-highlight') {
        const chars = textDisplay.querySelectorAll('.char');
        for (let i = start; i < end && i < chars.length; i++) {
            if (chars[i]) {
                chars[i].classList.add(cssClass);
            }
        }
    },

    // 清除文本高亮
    clearTextHighlights(textDisplay) {
        const chars = textDisplay.querySelectorAll('.char');
        chars.forEach(char => {
            char.classList.remove('processing-highlight', 'real-time-replacement', 'segment-processing');
        });
    },

    // 创建选择模态框
    createChoiceModal(sentence, suggestion, resolve, escapeHtml) {
        const modal = document.createElement('div');
        modal.className = 'choice-modal';
        modal.innerHTML = `
            <div class="choice-modal-content">
                <div class="choice-modal-header">
                    <h3><i class="fas fa-edit"></i> 发现问题</h3>
                    <span class="error-type">${suggestion.errorType || '语言问题'}</span>
                </div>
                <div class="choice-modal-body">
                    <div class="sentence-comparison">
                        <div class="original-sentence">
                            <label>原句：</label>
                            <div class="sentence-text original">${escapeHtml(sentence.text)}</div>
                        </div>
                        <div class="suggested-sentence">
                            <label>建议修改为：</label>
                            <div class="sentence-text suggested">${escapeHtml(suggestion.replacement)}</div>
                        </div>
                        <div class="modification-reason">
                            <label>修改原因：</label>
                            <div class="reason-text">${escapeHtml(suggestion.reason)}</div>
                        </div>
                    </div>
                </div>
                <div class="choice-modal-actions">
                    <button class="choice-btn accept-btn">
                        <i class="fas fa-check"></i> 接受修改
                    </button>
                    <button class="choice-btn reject-btn">
                        <i class="fas fa-times"></i> 保持原句
                    </button>
                </div>
            </div>
        `;

        // 绑定事件
        const acceptBtn = modal.querySelector('.accept-btn');
        const rejectBtn = modal.querySelector('.reject-btn');

        acceptBtn.addEventListener('click', () => {
            this.closeChoiceModal(modal);
            resolve('accept');
        });

        rejectBtn.addEventListener('click', () => {
            this.closeChoiceModal(modal);
            resolve('reject');
        });

        // ESC键关闭
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                this.closeChoiceModal(modal);
                resolve('reject');
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        return modal;
    },

    // 关闭选择模态框
    closeChoiceModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
};

// 日期时间工具
const DateUtils = {
    // 格式化日期
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return '今天';
        } else if (days === 1) {
            return '昨天';
        } else if (days < 7) {
            return `${days}天前`;
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }
};

// 存储工具
const StorageUtils = {
    // 保存文档到本地存储
    saveDocument(documentData) {
        const savedDocuments = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
        savedDocuments.push(documentData);
        localStorage.setItem('savedDocuments', JSON.stringify(savedDocuments));
    },

    // 获取保存的文档
    getSavedDocuments() {
        return JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    },

    // 获取文档类型名称
    getDocumentTypeName(type) {
        const typeNames = {
            notice: '通知',
            request: '请示',
            report: '报告',
            meeting: '会议纪要',
            reply: '批复',
            custom: '自定义'
        };
        return typeNames[type] || '文档';
    }
};

// 拖拽处理工具
const DragUtils = {
    // 处理拖拽进入
    handleDragOver(e) {
        e.preventDefault();
        document.body.classList.add('drag-over');
    },

    // 处理拖拽离开
    handleDragLeave(e) {
        e.preventDefault();
        // 只有在离开body时才移除样式
        if (e.target === document.body) {
            document.body.classList.remove('drag-over');
        }
    },

    // 处理文件拖放
    handleFileDrop(e, processFileCallback) {
        e.preventDefault();
        document.body.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFileCallback(files[0]);
        }
    }
};

// 导出所有工具模块
window.FileUtils = FileUtils;
window.TextUtils = TextUtils;
window.DOMUtils = DOMUtils;
window.DateUtils = DateUtils;
window.StorageUtils = StorageUtils;
window.DragUtils = DragUtils;
