/**
 * AI服务模块
 * 负责与AI API通信，处理文档润色和生成功能
 */
class AIService {
    constructor() {
        this.modelConfigs = {
            deepseek: {
                name: 'DeepSeek',
                apiUrl: 'https://api.deepseek.com/chat/completions',
                models: [
                    { value: 'deepseek-chat', text: 'deepseek-chat (通用对话)' },
                    { value: 'deepseek-reasoner', text: 'deepseek-reasoner (推理专用)' }
                ]
            },
            openai: {
                name: 'OpenAI',
                apiUrl: 'https://api.openai.com/v1/chat/completions',
                models: [
                    { value: 'gpt-4', text: 'GPT-4 (最强模型)' },
                    { value: 'gpt-4-turbo', text: 'GPT-4 Turbo (平衡性能)' },
                    { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo (经济实惠)' }
                ]
            },
            custom: {
                name: '自定义',
                apiUrl: '',
                models: [
                    { value: 'custom-model', text: '自定义模型' }
                ]
            }
        };
    }

    // 验证API密钥
    validateApiKey(elements, assistant) {
        // 如果是非个性化模式且使用默认DeepSeek，直接使用默认密钥
        if (!elements.personalizeMode.checked && elements.apiProvider.value === 'deepseek') {
            assistant.apiKey = assistant.defaultApiKey;
            console.log('使用默认DeepSeek密钥');
            return true;
        }
        
        // 个性化模式或其他提供商，检查输入的密钥
        assistant.apiKey = elements.apiKey.value.trim();
        if (!assistant.apiKey) {
            assistant.showError('请输入 API 密钥');
            return false;
        }
        return true;
    }

    // 处理句子批次
    async processSentenceBatch(sentenceBatch, elements, assistant) {
        // 动态提示词模板
        const promptTemplates = [
            '请检查以下句子中是否存在语病、错别字、标点错误等问题',
            '请校对下列句子的语法、用词和表达是否准确规范',
            '请审查以下句子是否有错误，包括用词不当、语法错误等',
            '请检查这些句子的语言表达是否符合公文写作规范',
            '请校验下列句子中的用词、语法和标点符号是否正确',
            '请分析以下句子是否存在表达问题和错误用法'
        ];

        const batchIndex = Math.floor(assistant.textStream.processedSentences / assistant.textStream.batchSize);
        const templateIndex = batchIndex % promptTemplates.length;
        
        // 构建批次文本
        const batchText = sentenceBatch.map((sentence, index) => 
            `句子${index + 1}：${sentence.text}`
        ).join('\n\n');

        const prompt = `${promptTemplates[templateIndex]}。

对于每个有问题的句子，请以JSON格式返回建议：
{
    "suggestions": [
        {
            "sentenceIndex": 句子编号(0-${sentenceBatch.length - 1}),
            "original": "有问题的原句",
            "replacement": "修改后的句子",
            "reason": "修改原因和说明",
            "errorType": "错误类型"
        }
    ]
}

如果所有句子都没有问题，请返回：{"suggestions": []}

待检查的句子：

${batchText}`;

        try {
            // 确定API URL
            let apiUrl;
            if (elements.personalizeMode.checked) {
                const provider = elements.apiProvider.value;
                if (provider === 'custom') {
                    apiUrl = elements.apiUrl.value.trim();
                    if (!apiUrl) {
                        throw new Error('请设置自定义API地址');
                    }
                } else {
                    apiUrl = this.modelConfigs[provider].apiUrl;
                }
            } else {
                apiUrl = this.modelConfigs.deepseek.apiUrl;
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${assistant.apiKey}`
                },
                body: JSON.stringify({
                    model: assistant.apiModel,
                    messages: [
                        { role: 'system', content: '你是一个专业的公文校对助手。请仔细检查句子中的语病、错别字、标点符号等问题，只对确实有问题的句子提出修改建议。' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: parseInt(elements.maxTokens.value) / 2,
                    temperature: 0.1
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || '请求失败'}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || '';

            // 解析AI响应
            const suggestions = this.parseAISuggestions(aiResponse);
            
            // 将建议关联到具体句子
            suggestions.forEach(suggestion => {
                if (suggestion.sentenceIndex >= 0 && suggestion.sentenceIndex < sentenceBatch.length) {
                    const sentence = sentenceBatch[suggestion.sentenceIndex];
                    sentence.suggestions.push(suggestion);
                }
            });

            return suggestions;

        } catch (error) {
            console.warn('批次处理错误:', error);
            return [];
        }
    }

    // 解析AI建议
    parseAISuggestions(aiResponse) {
        try {
            // 尝试提取JSON部分
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.suggestions || [];
            }
            
            // 如果没有找到JSON，返回空数组
            return [];
        } catch (error) {
            console.warn('解析AI响应失败:', error);
            // 如果解析失败，尝试简单的文本分析
            return this.parseTextSuggestions(aiResponse);
        }
    }

    // 文本建议解析备用方法
    parseTextSuggestions(aiResponse) {
        // 这里可以实现简单的文本解析逻辑
        // 作为JSON解析失败时的备用方案
        return [];
    }

    // 公文生成请求
    async sendGenerationRequest(prompt, elements, assistant) {
        try {
            console.log('🚀 开始AI公文生成请求...');
            console.log('🔑 API密钥状态:', assistant.apiKey ? '已配置' : '未配置');
            console.log('🔑 API密钥长度:', assistant.apiKey ? assistant.apiKey.length : 0);
            
            // 确定API URL
            let apiUrl;
            let provider = 'deepseek';
            
            if (elements.personalizeMode && elements.personalizeMode.checked) {
                provider = elements.apiProvider.value;
                if (provider === 'custom') {
                    apiUrl = elements.apiUrl.value.trim();
                    if (!apiUrl) {
                        throw new Error('请设置自定义API地址');
                    }
                } else {
                    apiUrl = this.modelConfigs[provider].apiUrl;
                }
            } else {
                apiUrl = this.modelConfigs.deepseek.apiUrl;
                provider = 'deepseek';
            }

            console.log('🌐 使用API提供商:', provider);
            console.log('🌐 API地址:', apiUrl);
            console.log('🤖 使用模型:', assistant.apiModel);
            console.log('📝 提示词长度:', prompt.length);
            console.log('📝 提示词内容:', prompt.substring(0, 200) + '...');

            // 构建请求体
            const requestBody = {
                model: assistant.apiModel,
                messages: [
                    { 
                        role: 'system', 
                        content: '你是一个专业的公文写作助手，精通各类公文的格式和写作规范。请严格按照公文写作标准生成内容，确保格式规范、语言准确、结构完整。' 
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: parseInt(elements.maxTokens?.value || 4000),
                temperature: parseFloat(elements.temperature?.value || 0.7),
                top_p: parseFloat(elements.topP?.value || 0.9),
                frequency_penalty: parseFloat(elements.frequencyPenalty?.value || 0.1)
            };
            
            console.log('📤 发送请求体:', JSON.stringify(requestBody, null, 2));

            // 发送请求
            console.log('📡 正在发送请求到AI服务...');
            const startTime = Date.now();
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${assistant.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            console.log('📥 响应状态:', response.status, response.statusText);
            console.log('⏱️ 响应时间:', responseTime + 'ms');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API错误响应:', errorData);
                
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                if (errorData.error?.message) {
                    errorMessage += ` - ${errorData.error.message}`;
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ API响应数据:', data);
            
            // 验证响应结构
            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error('AI响应格式异常：缺少choices数组');
            }
            
            const choice = data.choices[0];
            if (!choice.message || !choice.message.content) {
                throw new Error('AI响应格式异常：缺少message.content');
            }
            
            const content = choice.message.content.trim();
            console.log('📄 提取的AI生成内容长度:', content.length);
            console.log('📄 内容预览:', content.substring(0, 200) + '...');
            
            // 验证内容质量
            if (content.length < 50) {
                console.warn('⚠️ AI生成的内容较短，可能存在问题');
            }
            
            if (content.includes('抱歉') || content.includes('无法') || content.includes('错误')) {
                console.warn('⚠️ AI响应可能包含错误信息');
            }
            
            console.log('🎉 AI公文生成成功完成！');
            return content;

        } catch (error) {
            console.error('💥 AI生成请求异常:', error);
            
            // 根据错误类型提供更友好的错误信息
            let userMessage = 'AI生成失败';
            
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                userMessage = 'API密钥无效或已过期，请检查设置';
            } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                userMessage = 'API访问被拒绝，请检查密钥权限';
            } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
                userMessage = '请求过于频繁，请稍后重试';
            } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
                userMessage = 'AI服务内部错误，请稍后重试';
            } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                userMessage = '网络连接失败，请检查网络设置';
            } else if (error.message.includes('timeout')) {
                userMessage = '请求超时，请检查网络连接';
            } else {
                userMessage = error.message;
            }
            
            throw new Error(userMessage);
        }
    }

    // 构建生成提示词
    buildGenerationPrompt(title, recipient, sender, content, selectedDocumentType) {
        const typeMap = {
            notice: '通知',
            request: '请示', 
            report: '报告',
            meeting: '会议纪要',
            reply: '批复',
            custom: '自定义公文'
        };
        
        const docType = typeMap[selectedDocumentType] || '公文';
        
        // 根据公文类型构建特定的提示词
        let typeSpecificPrompt = '';
        switch (selectedDocumentType) {
            case 'notice':
                typeSpecificPrompt = '通知类公文要求：\n- 标题简洁明确，突出主题\n- 正文结构：背景说明、具体事项、工作要求、时间安排\n- 语言庄重严肃，表达准确\n- 结尾明确执行要求';
                break;
            case 'request':
                typeSpecificPrompt = '请示类公文要求：\n- 标题明确请示事项\n- 正文结构：基本情况、存在问题、请示事项、相关依据、建议方案\n- 语言恳切，理由充分\n- 结尾使用"特此请示，请予批示"等规范用语';
                break;
            case 'report':
                typeSpecificPrompt = '报告类公文要求：\n- 标题明确报告期间和内容\n- 正文结构：工作完成情况、存在问题、采取措施、下一步计划、工作建议\n- 数据准确，分析客观\n- 结尾使用"特此报告"等规范用语';
                break;
            case 'meeting':
                typeSpecificPrompt = '会议纪要要求：\n- 标题明确会议名称和性质\n- 正文结构：会议概况、议题讨论、会议决议、工作安排\n- 记录准确，重点突出\n- 明确责任人和时间节点';
                break;
            case 'reply':
                typeSpecificPrompt = '批复类公文要求：\n- 标题明确批复事项\n- 正文结构：审查意见、批复决定、相关要求、注意事项\n- 语言明确，要求具体\n- 结尾使用"特此批复"等规范用语';
                break;
            default:
                typeSpecificPrompt = '公文写作要求：\n- 格式规范，符合公文写作标准\n- 语言准确，表达清晰\n- 结构完整，层次分明\n- 包含必要的公文要素';
        }
        
        return `请生成一份规范的${docType}，要求如下：

标题：${title}
${recipient ? `收文单位：${recipient}` : ''}
${sender ? `发文单位：${sender}` : ''}

主要内容描述：
${content}

${typeSpecificPrompt}

具体要求：
1. 严格按照公文写作格式规范，包含完整的公文要素
2. 语言庄重、准确、简洁，符合公文写作风格
3. 结构清晰，层次分明，逻辑严密
4. 内容充实，信息完整，表达准确
5. 字数控制在800-1500字之间，确保内容详实
6. 使用规范的公文用语和表达方式
7. 确保格式美观，段落合理，便于阅读

请直接返回完整的公文内容，不要包含任何解释或说明文字：`;
    }
}

// 导出类供其他模块使用
window.AIService = AIService;
