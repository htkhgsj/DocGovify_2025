/**
 * 配置服务模块
 * 负责处理API配置、设置保存等功能
 */
class ConfigService {
    constructor() {
        // 模型配置 - 统一管理，避免重复
        this.modelConfigs = {
            deepseek: {
                name: 'DeepSeek',
                apiUrl: 'https://api.deepseek.com/chat/completions',
                models: [
                    { value: 'deepseek-chat', text: 'deepseek-chat (通用对话)' },
                    { value: 'deepseek-reasoner', text: 'deepseek-reasoner (推理专用)' }
                ],
                helpLink: 'https://platform.deepseek.com',
                modelHelp: '推理模型更适合逻辑分析和复杂问题'
            },
            openai: {
                name: 'OpenAI',
                apiUrl: 'https://api.openai.com/v1/chat/completions',
                models: [
                    { value: 'gpt-4', text: 'GPT-4 (最强模型)' },
                    { value: 'gpt-4-turbo', text: 'GPT-4 Turbo (平衡性能)' },
                    { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo (经济实惠)' }
                ],
                helpLink: 'https://platform.openai.com',
                modelHelp: 'GPT-4系列模型具有更强的理解和生成能力'
            },
            custom: {
                name: '自定义',
                apiUrl: '',
                models: [
                    { value: 'custom-model', text: '自定义模型' }
                ],
                helpLink: '',
                modelHelp: '请根据您的自定义模型特性选择合适的参数'
            }
        };

        // 默认配置
        this.defaultSettings = {
            personalizeMode: false,
            apiProvider: 'deepseek',
            apiKey: '',
            apiUrl: '',
            apiModel: 'deepseek-chat',
            maxTokens: '8000',
            temperature: '0.7',
            topP: '0.9',
            frequencyPenalty: '0.1'
        };
    }

    // 显示配置模态框
    showConfigModal(elements) {
        if (!elements.configModal) {
            console.error('configModal element not found!');
            return;
        }
        
        elements.configModal.classList.add('show');
        elements.configModal.style.display = 'flex';
        
        // 自动聚焦到API密钥输入框
        setTimeout(() => {
            if (elements.apiKey && !elements.apiKey.value.trim()) {
                elements.apiKey.focus();
            }
        }, 300);
    }

    // 隐藏配置模态框
    hideConfigModal(elements) {
        elements.configModal.classList.remove('show');
        setTimeout(() => {
            elements.configModal.style.display = 'none';
        }, 300);
    }

    // 更新滑块显示值
    updateTokensDisplay(elements) {
        if (elements.tokensValue) {
            elements.tokensValue.textContent = elements.maxTokens.value;
        }
    }

    updateTemperatureDisplay(elements) {
        if (elements.temperatureValue) {
            elements.temperatureValue.textContent = elements.temperature.value;
        }
    }

    updateTopPDisplay(elements) {
        if (elements.topPValue) {
            elements.topPValue.textContent = elements.topP.value;
        }
    }

    updateFrequencyPenaltyDisplay(elements) {
        if (elements.frequencyPenaltyValue) {
            elements.frequencyPenaltyValue.textContent = elements.frequencyPenalty.value;
        }
    }

    // 切换个性化模式
    togglePersonalizeMode(elements) {
        const isPersonalized = elements.personalizeMode.checked;
        
        if (isPersonalized) {
            elements.configOptions.style.display = 'block';
        } else {
            elements.configOptions.style.display = 'none';
            // 重置为默认DeepSeek配置
            elements.apiProvider.value = 'deepseek';
            this.switchProvider(elements);
        }
    }

    // 切换API提供商
    switchProvider(elements) {
        const provider = elements.apiProvider.value;
        const config = this.modelConfigs[provider];
        
        if (!config) {
            console.error('Unknown provider:', provider);
            return;
        }
        
        // 更新模型选项
        if (elements.apiModel) {
            elements.apiModel.innerHTML = '';
            config.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.value;
                option.textContent = model.text;
                elements.apiModel.appendChild(option);
            });
        }
        
        // 更新帮助信息
        this.updateHelpInfo(provider, elements);
        
        // 显示/隐藏自定义API地址
        if (elements.apiUrlSection) {
            elements.apiUrlSection.style.display = provider === 'custom' ? 'block' : 'none';
        }
        
        // 处理API密钥显示
        if (elements.apiKeySection) {
            if (provider === 'deepseek' && !elements.personalizeMode.checked) {
                // 非个性化模式下使用默认DeepSeek，完全隐藏密钥输入
                elements.apiKeySection.style.display = 'none';
            } else {
                // 个性化模式或其他提供商，显示密钥输入
                elements.apiKeySection.style.display = 'block';
                if (elements.apiKey) {
                    elements.apiKey.value = '';
                    elements.apiKey.placeholder = '请输入您的API密钥';
                }
            }
        }
    }

    // 更新帮助信息
    updateHelpInfo(provider, elements) {
        const config = this.modelConfigs[provider];
        if (!config) return;
        
        if (elements.apiKeyHelp) {
            const helpText = config.helpLink ? 
                `<small><i class="fas fa-info-circle"></i> 获取API密钥：<a href="${config.helpLink}" target="_blank">${config.name} Platform</a></small>` :
                `<small><i class="fas fa-info-circle"></i> 请参考您使用的API服务商文档</small>`;
            elements.apiKeyHelp.innerHTML = helpText;
        }
        
        if (elements.modelHelp) {
            elements.modelHelp.innerHTML = `<small><i class="fas fa-info-circle"></i> ${config.modelHelp}</small>`;
        }
    }

    // 切换API密钥可见性
    toggleApiKeyVisibility(elements) {
        if (!elements.apiKey || !elements.toggleKey) return;
        
        const input = elements.apiKey;
        const icon = elements.toggleKey.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // 保存配置
    saveConfig(elements, assistant) {
        try {
            const settings = {
                personalizeMode: elements.personalizeMode.checked,
                apiProvider: elements.apiProvider.value,
                apiKey: elements.apiKey.value.trim(),
                apiUrl: elements.apiUrl.value.trim(),
                apiModel: elements.apiModel.value,
                maxTokens: elements.maxTokens.value,
                temperature: elements.temperature.value,
                topP: elements.topP.value,
                frequencyPenalty: elements.frequencyPenalty.value
            };
            
            localStorage.setItem('documentAssistantSettings', JSON.stringify(settings));
            
            // 设置API密钥
            if (settings.personalizeMode && settings.apiKey) {
                assistant.apiKey = settings.apiKey;
            } else {
                assistant.apiKey = assistant.defaultApiKey; // 使用默认密钥
            }
            assistant.apiModel = settings.apiModel;
            
            assistant.showStatus('设置已保存', 'success');
            this.hideConfigModal(elements);
            
        } catch (error) {
            console.error('保存配置失败:', error);
            assistant.showError('保存配置失败: ' + error.message);
        }
    }

    // 重置配置
    resetConfig(elements, assistant) {
        try {
            // 应用默认设置
            this.applyDefaultSettings(elements);
            
            assistant.showStatus('配置已重置为默认设置', 'info');
            
        } catch (error) {
            console.error('重置配置失败:', error);
            assistant.showError('重置配置失败: ' + error.message);
        }
    }

    // 使用默认配置
    useDefaultConfig(elements, assistant) {
        try {
            // 应用默认设置
            this.applyDefaultSettings(elements);
            
            // 直接保存配置
            const settings = { ...this.defaultSettings };
            localStorage.setItem('documentAssistantSettings', JSON.stringify(settings));
            
            assistant.apiKey = assistant.defaultApiKey;
            assistant.apiModel = 'deepseek-chat';
            
            assistant.showStatus('已启用默认设置，可直接使用！', 'success');
            this.hideConfigModal(elements);
            
        } catch (error) {
            console.error('应用默认配置失败:', error);
            assistant.showError('应用默认配置失败: ' + error.message);
        }
    }

    // 应用默认设置到UI元素
    applyDefaultSettings(elements) {
        const settings = this.defaultSettings;
        
        if (elements.personalizeMode) elements.personalizeMode.checked = settings.personalizeMode;
        if (elements.apiProvider) elements.apiProvider.value = settings.apiProvider;
        if (elements.apiKey) elements.apiKey.value = settings.apiKey;
        if (elements.apiUrl) elements.apiUrl.value = settings.apiUrl;
        if (elements.apiModel) elements.apiModel.value = settings.apiModel;
        if (elements.maxTokens) elements.maxTokens.value = settings.maxTokens;
        if (elements.temperature) elements.temperature.value = settings.temperature;
        if (elements.topP) elements.topP.value = settings.topP;
        if (elements.frequencyPenalty) elements.frequencyPenalty.value = settings.frequencyPenalty;
        
        // 更新显示值
        this.updateTokensDisplay(elements);
        this.updateTemperatureDisplay(elements);
        this.updateTopPDisplay(elements);
        this.updateFrequencyPenaltyDisplay(elements);
        
        // 更新UI状态
        this.togglePersonalizeMode(elements);
        this.switchProvider(elements);
    }

    // 加载设置
    loadSettings(elements, assistant) {
        try {
            const saved = localStorage.getItem('documentAssistantSettings');
            let settings;
            
            if (saved) {
                settings = JSON.parse(saved);
                // 验证设置的有效性
                settings = this.validateSettings(settings);
            } else {
                settings = { ...this.defaultSettings };
            }
            
            // 应用设置到UI
            this.applySettingsToUI(elements, settings);
            
            // 设置API密钥
            if (settings.personalizeMode && settings.apiKey) {
                assistant.apiKey = settings.apiKey;
            } else {
                assistant.apiKey = assistant.defaultApiKey;
            }
            assistant.apiModel = settings.apiModel || 'deepseek-chat';
            
        } catch (error) {
            console.error('加载设置失败:', error);
            // 使用默认设置
            this.applyDefaultSettings(elements);
            assistant.apiKey = assistant.defaultApiKey;
            assistant.apiModel = 'deepseek-chat';
        }
    }

    // 验证设置的有效性
    validateSettings(settings) {
        const validSettings = { ...this.defaultSettings };
        
        // 只保留有效的设置项
        Object.keys(validSettings).forEach(key => {
            if (settings[key] !== undefined && settings[key] !== null) {
                validSettings[key] = settings[key];
            }
        });
        
        return validSettings;
    }

    // 应用设置到UI
    applySettingsToUI(elements, settings) {
        if (elements.personalizeMode) elements.personalizeMode.checked = settings.personalizeMode;
        if (elements.apiProvider) elements.apiProvider.value = settings.apiProvider;
        if (elements.apiKey) elements.apiKey.value = settings.apiKey;
        if (elements.apiUrl) elements.apiUrl.value = settings.apiUrl;
        if (elements.apiModel) elements.apiModel.value = settings.apiModel;
        if (elements.maxTokens) elements.maxTokens.value = settings.maxTokens;
        if (elements.temperature) elements.temperature.value = settings.temperature;
        if (elements.topP) elements.topP.value = settings.topP;
        if (elements.frequencyPenalty) elements.frequencyPenalty.value = settings.frequencyPenalty;
        
        // 更新显示值
        this.updateTokensDisplay(elements);
        this.updateTemperatureDisplay(elements);
        this.updateTopPDisplay(elements);
        this.updateFrequencyPenaltyDisplay(elements);
        
        // 更新UI状态
        this.togglePersonalizeMode(elements);
        this.switchProvider(elements);
    }

    // 获取模型配置
    getModelConfig(provider) {
        return this.modelConfigs[provider] || this.modelConfigs.deepseek;
    }

    // 获取API URL
    getApiUrl(provider, customUrl = '') {
        if (provider === 'custom' && customUrl) {
            return customUrl;
        }
        const config = this.getModelConfig(provider);
        return config ? config.apiUrl : this.modelConfigs.deepseek.apiUrl;
    }
}

// 导出类供其他模块使用
window.ConfigService = ConfigService;
