// script-editor.js - 剧本编辑器交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 剧本编辑器初始化');
    
    // ===== 全局变量 =====
    let quill = null;
    let autoSaveTimer = null;
    let uploadedFiles = [];
    let isSaving = false;
    let isFullscreen = false;
    
    // ===== DOM元素引用 =====
    const elements = {
        editor: document.getElementById('editor'),
        scriptTitle: document.getElementById('scriptTitle'),
        scriptDescription: document.getElementById('scriptDescription'),
        wordCount: document.getElementById('wordCount'),
        lastSaved: document.getElementById('lastSaved'),
        saveStatus: document.getElementById('saveStatus'),
        fileInput: document.getElementById('fileInput'),
        uploadArea: document.getElementById('uploadArea'),
        uploadedFiles: document.getElementById('uploadedFiles'),
        formatHelpBtn: document.getElementById('formatHelp'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        insertImage: document.getElementById('insertImage'),
        insertLink: document.getElementById('insertLink'),
        clearFormat: document.getElementById('clearFormat'),
        saveDraftBtn: document.getElementById('saveDraftBtn'),
        submitScriptBtn: document.getElementById('submitScriptBtn'),
        formatHelpModal: document.getElementById('formatHelpModal'),
        closeModalBtn: document.querySelector('.close-modal')
    };
    
    // ===== 初始化Quill编辑器 =====
    function initializeQuill() {
        console.log('初始化Quill编辑器...');
        
        // Quill配置
        const quillOptions = {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link', 'image', 'video'],
                    ['clean'],
                    ['code-block']
                ],
                clipboard: {
                    matchVisual: false
                }
            },
            placeholder: '开始创作您的剧本...\n\n提示：\n• 使用标题分级组织剧本结构\n• 使用列表整理角色设定\n• 可以插入图片作为参考\n• 自动保存，无需担心丢失',
            formats: [
                'header', 'bold', 'italic', 'underline', 'strike',
                'list', 'bullet', 'indent', 'link', 'image', 'video',
                'color', 'background', 'font', 'align', 'code-block'
            ]
        };
        
        // 创建Quill实例
        quill = new Quill('#editor', quillOptions);
        
        // 加载草稿（如果有）
        loadDraft();
        
        // 初始化字数统计
        updateWordCount();
        
        // 监听内容变化
        quill.on('text-change', function() {
            updateWordCount();
            startAutoSave();
        });
        
        console.log('✅ Quill编辑器初始化完成');
    }
    
    // ===== 字数统计 =====
    function updateWordCount() {
        if (!quill) return;
        
        const text = quill.getText().trim();
        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;
        
        elements.wordCount.textContent = `${words}字/${chars}字符`;
        
        // 保存状态提示
        if (words > 0) {
            elements.saveStatus.innerHTML = '<i class="fas fa-sync-alt"></i><span>正在保存...</span>';
            elements.saveStatus.style.background = '#f59e0b';
        }
    }
    
    // ===== 自动保存系统 =====
    function startAutoSave() {
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        
        autoSaveTimer = setTimeout(function() {
            saveDraft();
        }, 3000); // 3秒后自动保存
    }
    
    function saveDraft() {
        if (isSaving) return;
        
        isSaving = true;
        
        // 获取编辑器内容
        const content = quill.root.innerHTML;
        const title = elements.scriptTitle.value.trim();
        const description = elements.scriptDescription.value.trim();
        
        // 简单验证
        if (!title && content === '<p><br></p>') {
            isSaving = false;
            return;
        }
        
        // 创建草稿对象
        const draft = {
            title: title,
            description: description,
            content: content,
            files: uploadedFiles,
            lastSaved: new Date().toISOString(),
            wordCount: elements.wordCount.textContent
        };
        
        // 保存到localStorage
        try {
            const groupId = localStorage.getItem('currentGroupId') || '3';
            const draftKey = `script_draft_${groupId}`;
            localStorage.setItem(draftKey, JSON.stringify(draft));
            
            // 更新保存状态
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            elements.lastSaved.textContent = timeStr;
            elements.saveStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>已保存</span>';
            elements.saveStatus.style.background = '#10b981';
            
            console.log('✅ 草稿保存成功:', draft);
            
            // 短暂显示保存成功提示
            setTimeout(() => {
                elements.saveStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>已保存</span>';
            }, 2000);
            
        } catch (error) {
            console.error('❌ 保存草稿失败:', error);
            elements.saveStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>保存失败</span>';
            elements.saveStatus.style.background = '#ef4444';
        }
        
        isSaving = false;
    }
    
    function loadDraft() {
        try {
            const groupId = localStorage.getItem('currentGroupId') || '3';
            const draftKey = `script_draft_${groupId}`;
            const draftData = localStorage.getItem(draftKey);
            
            if (draftData) {
                const draft = JSON.parse(draftData);
                
                // 恢复数据
                elements.scriptTitle.value = draft.title || '';
                elements.scriptDescription.value = draft.description || '';
                
                if (draft.content && draft.content !== '<p><br></p>') {
                    quill.root.innerHTML = draft.content;
                }
                
                // 恢复上传的文件
                if (draft.files && Array.isArray(draft.files)) {
                    uploadedFiles = draft.files;
                    renderUploadedFiles();
                }
                
                // 恢复保存时间
                if (draft.lastSaved) {
                    const savedTime = new Date(draft.lastSaved);
                    const timeStr = savedTime.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    elements.lastSaved.textContent = timeStr;
                }
                
                console.log('✅ 草稿加载成功');
                showToast('已恢复上次的草稿', 'success');
            }
        } catch (error) {
            console.error('❌ 加载草稿失败:', error);
        }
    }
    
    // ===== 文件上传功能 =====
    function initializeFileUpload() {
        console.log('初始化文件上传...');
        
        // 点击上传区域
        elements.uploadArea.addEventListener('click', function() {
            elements.fileInput.click();
        });
        
        // 拖拽上传
        elements.uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = '#6a11cb';
            this.style.background = 'rgba(106, 17, 203, 0.1)';
        });
        
        elements.uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = '';
            this.style.background = '';
        });
        
        elements.uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = '';
            this.style.background = '';
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        // 文件选择变化
        elements.fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            handleFiles(files);
            this.value = ''; // 重置input
        });
        
        console.log('✅ 文件上传初始化完成');
    }
    
    function handleFiles(files) {
        if (!files || files.length === 0) return;
        
        // 验证文件
        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['.txt', '.doc', '.docx', '.pdf', '.md'];
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();
            const isValidType = validTypes.includes(fileExt);
            const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB
            
            if (!isValidType) {
                showToast(`不支持的文件类型: ${fileExt}`, 'error');
                return false;
            }
            
            if (!isValidSize) {
                showToast(`文件太大: ${file.name} (最大100MB)`, 'error');
                return false;
            }
            
            return true;
        });
        
        if (validFiles.length === 0) return;
        
        // 添加上传队列
        validFiles.forEach(file => {
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            uploadedFiles.push({
                id: fileId,
                name: file.name,
                size: formatFileSize(file.size),
                type: getFileType(file.name),
                file: file,
                uploadTime: new Date().toISOString()
            });
        });
        
        // 渲染文件列表
        renderUploadedFiles();
        
        // 保存草稿
        saveDraft();
        
        // 显示成功提示
        showToast(`成功添加 ${validFiles.length} 个文件`, 'success');
    }
    
    function renderUploadedFiles() {
        if (!elements.uploadedFiles) return;
        
        if (uploadedFiles.length === 0) {
            elements.uploadedFiles.innerHTML = `
                <div class="no-files">
                    <i class="fas fa-folder-open"></i>
                    <p>还没有上传任何文件</p>
                </div>
            `;
            return;
        }
        
        const filesHTML = uploadedFiles.map(file => `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-${getFileIcon(file.type)}"></i>
                    </div>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${file.size} • ${new Date(file.uploadTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-file" data-file-id="${file.id}">
                        <i class="fas fa-trash"></i> 移除
                    </button>
                </div>
            </div>
        `).join('');
        
        elements.uploadedFiles.innerHTML = filesHTML;
        
        // 添加移除事件监听
        elements.uploadedFiles.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', function() {
                const fileId = this.getAttribute('data-file-id');
                removeFile(fileId);
            });
        });
    }
    
    function removeFile(fileId) {
        uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
        renderUploadedFiles();
        saveDraft();
        showToast('文件已移除', 'info');
    }
    
    function getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const types = {
            'txt': 'text',
            'doc': 'word',
            'docx': 'word',
            'pdf': 'pdf',
            'md': 'markdown'
        };
        return types[ext] || 'file';
    }
    
    function getFileIcon(fileType) {
        const icons = {
            'text': 'file-alt',
            'word': 'file-word',
            'pdf': 'file-pdf',
            'markdown': 'file-code'
        };
        return icons[fileType] || 'file';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // ===== 编辑器工具功能 =====
    function initializeEditorTools() {
        console.log('初始化编辑器工具...');
        
        // 插入图片
        elements.insertImage.addEventListener('click', function() {
            const url = prompt('请输入图片URL:', 'https://');
            if (url && url !== 'https://') {
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
            }
        });
        
        // 插入链接
        elements.insertLink.addEventListener('click', function() {
            const url = prompt('请输入链接URL:', 'https://');
            if (url && url !== 'https://') {
                const text = prompt('请输入链接文字:', '点击这里');
                const range = quill.getSelection();
                quill.insertText(range.index, text || '链接', { link: url });
            }
        });
        
        // 清除格式
        elements.clearFormat.addEventListener('click', function() {
            const range = quill.getSelection();
            if (range) {
                quill.removeFormat(range.index, range.length);
                showToast('格式已清除', 'info');
            }
        });
        
        // 格式帮助
        elements.formatHelpBtn.addEventListener('click', function() {
            elements.formatHelpModal.style.display = 'flex';
        });
        
        // 全屏模式
        elements.fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen();
        });
        
        // 关闭模态框
        elements.closeModalBtn.addEventListener('click', function() {
            elements.formatHelpModal.style.display = 'none';
        });
        
        // 点击模态框外部关闭
        elements.formatHelpModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
        
        console.log('✅ 编辑器工具初始化完成');
    }
    
    function toggleFullscreen() {
        const editorContainer = document.querySelector('.editor-container');
        
        if (!isFullscreen) {
            // 进入全屏
            editorContainer.classList.add('fullscreen-mode');
            elements.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> 退出全屏';
            document.body.style.overflow = 'hidden';
            isFullscreen = true;
            showToast('已进入全屏模式', 'info');
        } else {
            // 退出全屏
            editorContainer.classList.remove('fullscreen-mode');
            elements.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> 全屏';
            document.body.style.overflow = '';
            isFullscreen = false;
        }
    }
    
    // ===== 提交功能 =====
    function initializeSubmitButtons() {
        console.log('初始化提交按钮...');
        
        // 保存草稿按钮
        elements.saveDraftBtn.addEventListener('click', function() {
            saveDraft();
            showToast('草稿保存成功！', 'success');
        });
        
        // 提交审核按钮
        elements.submitScriptBtn.addEventListener('click', function() {
            submitScript();
        });
        
        // "我的剧本"按钮
        const myScriptsBtn = document.getElementById('myScriptsBtn');
        if (myScriptsBtn) {
            myScriptsBtn.addEventListener('click', function() {
                showToast('我的剧本功能开发中...', 'info');
            });
        }
        
        console.log('✅ 提交按钮初始化完成');
    }
    
    function submitScript() {
        // 获取表单数据
        const title = elements.scriptTitle.value.trim();
        const description = elements.scriptDescription.value.trim();
        const content = quill.root.innerHTML;
        
        // 验证必填字段
        if (!title) {
            showToast('请填写剧本标题', 'error');
            elements.scriptTitle.focus();
            return;
        }
        
        if (content === '<p><br></p>' || content.trim().length < 50) {
            showToast('剧本内容太短，请至少输入50个字符', 'error');
            quill.focus();
            return;
        }
        
        // 创建提交数据
        const scriptData = {
            id: 'script_' + Date.now(),
            title: title,
            description: description,
            content: content,
            files: uploadedFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            groupId: localStorage.getItem('currentGroupId') || '3',
            groupName: localStorage.getItem('currentGroupName') || '编剧组',
            author: localStorage.getItem('userName') || '匿名用户',
            status: 'pending', // pending, approved, rejected
            submittedAt: new Date().toISOString(),
            wordCount: elements.wordCount.textContent
        };
        
        // 显示确认对话框
        if (confirm(`确定提交剧本《${title}》审核吗？\n\n提交后：\n• 剧本将进入审核队列\n• 审核通过后编剧需二次确认发布\n• 剧本将导入活动页面\n• 编剧无法直接修改，需等待审核结果`)) {
            // 模拟提交到Supabase（后续实现）
            simulateSubmitToSupabase(scriptData);
        }
    }
    
    function simulateSubmitToSupabase(scriptData) {
        console.log('提交剧本到审核队列:', scriptData);
        
        // 显示提交中状态
        elements.submitScriptBtn.disabled = true;
        elements.submitScriptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        
        // 模拟网络请求延迟
        setTimeout(() => {
            // 保存到localStorage（临时方案）
            try {
                const submissions = JSON.parse(localStorage.getItem('script_submissions') || '[]');
                submissions.push(scriptData);
                localStorage.setItem('script_submissions', JSON.stringify(submissions));
                
                // 清除草稿
                const groupId = localStorage.getItem('currentGroupId') || '3';
                const draftKey = `script_draft_${groupId}`;
                localStorage.removeItem(draftKey);
                
                // 重置表单
                resetForm();
                
                // 显示成功消息
                showToast('剧本提交成功！等待审核中...', 'success');
                
                // 3秒后跳转回分组页面
                setTimeout(() => {
                    window.location.href = 'groups.html';
                }, 3000);
                
            } catch (error) {
                console.error('提交失败:', error);
                showToast('提交失败，请重试', 'error');
            } finally {
                // 恢复按钮状态
                elements.submitScriptBtn.disabled = false;
                elements.submitScriptBtn.innerHTML = '<i class="fas fa-check-circle"></i> 提交审核';
            }
        }, 1500);
    }
    
    function resetForm() {
        elements.scriptTitle.value = '';
        elements.scriptDescription.value = '';
        quill.root.innerHTML = '<p><br></p>';
        uploadedFiles = [];
        renderUploadedFiles();
        updateWordCount();
    }
    
    // ===== 辅助函数 =====
    function showToast(message, type = 'info') {
        // 移除现有的toast
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 3秒后自动移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
    
    function getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // ===== 初始化所有功能 =====
    function initializeAll() {
        console.log('开始初始化剧本编辑器...');
        
        // 检查Quill库是否加载
        if (typeof Quill === 'undefined') {
            console.error('❌ Quill.js库未加载！');
            showToast('编辑器库加载失败，请刷新页面', 'error');
            return;
        }
        
        // 按顺序初始化
        initializeQuill();
        initializeFileUpload();
        initializeEditorTools();
        initializeSubmitButtons();
        
        // 添加toast样式（如果不存在）
        addToastStyles();
        
        // 添加页面卸载前的保存提示
        window.addEventListener('beforeunload', function(e) {
            const title = elements.scriptTitle.value.trim();
            const content = quill.getText().trim();
            
            if ((title || content) && !isSaving) {
                saveDraft(); // 最后一次保存
            }
        });
        
        console.log('✅ 剧本编辑器初始化完成！');
        showToast('剧本编辑器已就绪，开始创作吧！', 'success');
    }
    
    function addToastStyles() {
        if (document.getElementById('toast-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 10px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999;
                opacity: 0;
                transform: translateX(100px);
                transition: all 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            
            .toast-message.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .toast-success {
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            }
            
            .toast-error {
                background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
            }
            
            .toast-warning {
                background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
            }
            
            .toast-info {
                background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // ===== 启动初始化 =====
    initializeAll();
});
