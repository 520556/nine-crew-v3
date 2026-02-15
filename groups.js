// ===== 分组数据 =====
const groupsData = [
    {
        id: 1,
        name: '演员组',
        icon: 'fas fa-user',
        description: '演绎角色灵魂，通过角色申请系统参与剧组活动，展示你的表演才华。',
        memberCount: 24,
        active: 'high',
        needsAudit: false,
        tags: ['角色扮演', '表演艺术', '试镜审核'],
        leaders: [
            { name: '张艺', avatar: '张', role: '表演指导' },
            { name: '陈曦', avatar: '陈', role: '选角导演' }
        ],
        inProgress: 4
    },
    {
        id: 2,
        name: '配音组',
        icon: 'fas fa-microphone',
        description: '用声音赋予角色生命，上传试音作品，参与配音角色申请。',
        memberCount: 18,
        active: 'high',
        needsAudit: true,
        tags: ['声音表演', '音频录制', '角色配音'],
        leaders: [
            { name: '王磊', avatar: '王', role: '配音指导' },
            { name: '赵晴', avatar: '赵', role: '音频总监' }
        ],
        inProgress: 3
    },
    {
        id: 3,
        name: '编剧组',
        icon: 'fas fa-pen-fancy',
        description: '用文字创造世界，专业剧本编辑器支持富文本创作、多格式文档上传。',
        memberCount: 12,
        active: 'high',
        needsAudit: false,
        hasEditor: true,
        tags: ['富文本编辑', '文档审核', '专业创作'],
        leaders: [
            { name: '刘畅', avatar: '刘', role: '主编剧' },
            { name: '周明', avatar: '周', role: '剧本指导' }
        ],
        inProgress: 3
    },
    {
        id: 4,
        name: '后期组',
        icon: 'fas fa-cut',
        description: '视频剪辑、特效制作、音频处理，用技术为作品增添专业质感。',
        memberCount: 10,
        active: 'medium',
        needsAudit: true,
        tags: ['视频剪辑', '特效制作', '音频处理'],
        leaders: [
            { name: '吴迪', avatar: '吴', role: '后期总监' },
            { name: '郑爽', avatar: '郑', role: '特效指导' }
        ],
        inProgress: 3
    },
    {
        id: 5,
        name: '摄影组',
        icon: 'fas fa-camera',
        description: '镜头设计、画面构图、光影艺术，捕捉每一个精彩瞬间。',
        memberCount: 15,
        active: 'high',
        needsAudit: false,
        tags: ['镜头设计', '画面构图', '光影艺术'],
        leaders: [
            { name: '孙阳', avatar: '孙', role: '摄影指导' },
            { name: '李娜', avatar: '李', role: '灯光设计' }
        ],
        inProgress: 4
    },
    {
        id: 6,
        name: '宣传组',
        icon: 'fas fa-bullhorn',
        description: '文案策划、海报设计、社群运营，让更多人看到我们的作品。',
        memberCount: 8,
        active: 'medium',
        needsAudit: false,
        tags: ['文案策划', '海报设计', '社群运营'],
        leaders: [
            { name: '徐静', avatar: '徐', role: '宣传主管' },
            { name: '高翔', avatar: '高', role: '视觉设计' }
        ],
        inProgress: 2
    },
    {
        id: 7,
        name: '气氛组',
        icon: 'fas fa-heart',
        description: '活跃气氛、活动组织、新人引导，让剧组更有温度。',
        memberCount: 20,
        active: 'high',
        needsAudit: false,
        tags: ['活动组织', '新人引导', '氛围担当'],
        leaders: [
            { name: '杨欢', avatar: '杨', role: '气氛组长' },
            { name: '林欣', avatar: '林', role: '活动策划' }
        ],
        inProgress: 5
    },
    {
        id: 8,
        name: '导演组',
        icon: 'fas fa-video',
        description: '现场指导、艺术把控、演员调度，掌控全局的创作核心。',
        memberCount: 8,
        active: 'high',
        needsAudit: false,
        tags: ['现场指导', '艺术把控', '演员调度'],
        leaders: [
            { name: '冯导', avatar: '冯', role: '总导演' },
            { name: '郭导', avatar: '郭', role: '执行导演' }
        ],
        inProgress: 2
    }
];

// ===== 渲染分组卡片 =====
function renderGroups() {
    const container = document.getElementById('groupsList');
    if (!container) return;
    
    container.innerHTML = groupsData.map(group => `
        <div class="group-card" data-group-id="${group.id}" onclick="toggleGroupExpand(${group.id})">
            <div class="group-header">
                <div class="group-icon">
                    <i class="${group.icon}"></i>
                </div>
                <div class="group-title">
                    <div class="group-name">
                        ${group.name}
                        ${group.needsAudit ? '<span class="audit-badge">需审核</span>' : ''}
                    </div>
                    <div class="group-meta">
                        <span><i class="far fa-user"></i> ${group.memberCount}人</span>
                        <span class="activity-indicator">
                            <span class="activity-dot ${group.active}"></span>
                            ${group.active === 'high' ? '活跃' : group.active === 'medium' ? '中等' : '较低'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="group-description">
                ${group.description}
            </div>
            
            <div class="leaders-section">
                <div class="leaders-title">👥 组长团队</div>
                <div class="leaders-list">
                    ${group.leaders.map(leader => `
                        <div class="leader-item">
                            <div class="leader-avatar">${leader.avatar}</div>
                            <div>
                                <span class="leader-name">${leader.name}</span>
                                <span class="leader-role">${leader.role}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="tags-list">
                ${group.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="group-footer">
                <div class="member-count">
                    <i class="far fa-clock"></i> ${group.inProgress}个进行中
                </div>
                <button class="join-btn" onclick="event.stopPropagation(); joinGroup(${group.id})">
                    加入分组 <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <!-- 展开内容（默认隐藏） -->
            <div class="group-expanded" id="expand-${group.id}" style="display: none;">
                <p style="color: var(--medium-gray); font-size: 14px; margin-bottom: var(--space-sm);">
                    <i class="fas fa-info-circle"></i> 
                    ${group.needsAudit ? '需要提交作品审核，审核通过后可加入' : '可直接加入，无需审核'}
                </p>
                ${group.hasEditor ? `
                    <button class="join-btn" style="width: 100%; justify-content: center;" onclick="event.stopPropagation(); location.href='script-editor.html'">
                        开始创作 <i class="fas fa-pen"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ===== 展开/收起分组 =====
function toggleGroupExpand(groupId) {
    const expandEl = document.getElementById(`expand-${groupId}`);
    if (expandEl) {
        if (expandEl.style.display === 'none') {
            expandEl.style.display = 'block';
        } else {
            expandEl.style.display = 'none';
        }
    }
}

// ===== 加入分组 =====
function joinGroup(groupId) {
    const group = groupsData.find(g => g.id === groupId);
    if (!group) return;
    
    if (group.needsAudit) {
        alert(`加入${group.name}需要提交作品审核，是否前往上传？`);
        // 这里可以跳转到作品上传页面
    } else {
        alert(`已提交加入${group.name}的申请，组长将通过审核`);
    }
}

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    renderGroups();
    
    // 底部导航激活状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.dataset.page === 'groups') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});
