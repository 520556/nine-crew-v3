// groups.js - 分组页面交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 分组页面初始化');
    
    const groupsContainer = document.getElementById('groupsContainer');
    
    // 模拟分组数据（后续从Supabase获取）
    const groupsData = [
        {
            id: 1,
            name: '演员组',
            icon: 'fas fa-user',
            description: '角色多多，请看清楚要求报名哦，报名自动积分',
            members: 45,
            isActive: true,
            requirements: '1. 热爱表演，有表现欲\n2. 能够按照剧本要求演绎角色\n3. 愿意学习和提升演技\n4. 按时参加排练和拍摄',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                },
                {
                    name: '李四（测试）',
                    avatar: '李',
                    role: '组长'
                }
            ],
            needsAudit: false,  // 添加这个字段
            qrCodeUpdated: '2024-01-15'
        },
        {
            id: 2,
            name: '配音组',
            icon: 'fas fa-microphone',
            description: '为作品提供声音表演，需要清晰的发音和情感表达能力。',
            members: 28,
            isActive: true,
            requirements: '1. 普通话标准，发音清晰\n2. 能够表达角色情感\n3. 有录音设备（基础即可）\n4. 需要提交作品审核',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            needsAudit: true,  // 需要审核
            qrCodeUpdated: '2024-01-18'
        },
        {
            id: 3,
            name: '编剧组',
            icon: 'fas fa-pen-fancy',
            description: '创作剧本和故事，需要有创意和文字表达能力。',
            members: 32,
            isActive: true,
            requirements: '1. 有创意，喜欢讲故事\n2. 文字表达能力良好\n3. 跟进剧本内容\n4. 接受团队讨论修改',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            hasEditor: true,
            needsAudit: false,  // 添加这个字段
            qrCodeUpdated: '2024-01-10'
        },
        {
            id: 4,
            name: '后期组',
            icon: 'fas fa-cut',
            description: '视频剪辑、特效制作、音频处理，需要相关软件操作经验。',
            members: 36,
            isActive: false,
            requirements: '1. 会使用剪辑软件（剪映/PR等）\n2. 有耐心，注重细节\n3. 需要提交作品审核\n4. 愿意学习新技能',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            needsAudit: true,  // 需要审核
            qrCodeUpdated: '2024-01-12'
        },
        {
            id: 5,
            name: '摄影组',
            icon: 'fas fa-camera',
            description: '负责拍摄和镜头设计，需要有画面构图能力。',
            members: 40,
            isActive: true,
            requirements: '1. 熟悉光遇游戏摄影，画质清晰\n2. 有画面构图意识\n3. 能够按导演要求拍摄\n4. 按时提交拍摄素材',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            needsAudit: false,  // 添加这个字段
            qrCodeUpdated: '2024-01-14'
        },
        {
            id: 6,
            name: '宣传组',
            icon: 'fas fa-bullhorn',
            description: '负责剧组宣传和社交媒体运营，需要有文案和设计能力。',
            members: 25,
            isActive: true,
            requirements: '1. 喜欢社交媒体运营\n2. 有文案或设计能力\n3. 能够定期产出内容\n4. 了解光遇玩家社区',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            needsAudit: false,  // 添加这个字段
            qrCodeUpdated: '2024-01-16'
        },
        {
            id: 7,
            name: '气氛组',
            icon: 'fas fa-laugh-beam',
            description: '营造剧组氛围，组织娱乐活动，需要有组织能力和亲和力。',
            members: 38,
            isActive: true,
            requirements: '1. 性格开朗，有亲和力\n2. 喜欢组织活动\n3. 能够活跃气氛\n4. 愿意帮助新人',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            needsAudit: false,  // 添加这个字段
            qrCodeUpdated: '2024-01-11'
        },
        {
            id: 8,
            name: '导演组',
            icon: 'fas fa-video',
            description: '指导拍摄和艺术把控，需要有整体创作视野和领导能力。',
            members: 18,
            isActive: true,
            requirements: '1. 有创作视野和领导能力\n2. 能够协调各组工作\n3. 熟悉影视制作流程\n4. 需要经验积累',
            leaders: [
                {
                    name: '张三',
                    avatar: '张',
                    role: '组长'
                }
            ],
            needsAudit: false,  // 添加这个字段
            qrCodeUpdated: '2024-01-17'
        }
    ];
    
    // 渲染分组卡片
    function renderGroups() {
        groupsContainer.innerHTML = '';
        
        groupsData.forEach(group => {
            const groupCard = createGroupCard(group);
            groupsContainer.appendChild(groupCard);
        });
        
        console.log(`✅ 渲染完成：${groupsData.length}个分组`);
    }
    
    // 创建单个分组卡片
    function createGroupCard(group) {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.dataset.groupId = group.id;
        
        // 卡片HTML结构
        card.innerHTML = `
            <div class="card-header">
                <div class="group-icon">
                    <i class="${group.icon}"></i>
                </div>
                <div class="group-info">
                    <h2 class="group-name">${group.name}</h2>
                    <div class="group-stats">
                        <span class="member-count">
                            <i class="fas fa-users"></i> ${group.members}人
                        </span>
                        <span class="activity-indicator ${group.isActive ? 'active' : ''}">
                            <span class="dot"></span>
                            ${group.isActive ? '活跃中' : '近期休息'}
                        </span>
                    </div>
                    <p class="group-description">${group.description}</p>
                </div>
                <div class="expand-icon">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            
            <div class="card-content">
                <!-- 分组要求 -->
                <div class="content-section">
                    <h3 class="section-title">
                        <i class="fas fa-clipboard-check"></i> 分组要求
                    </h3>
                    <div class="group-requirements">
                        ${group.requirements.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <!-- 微信群二维码 -->
                <div class="content-section">
                    <h3 class="section-title">
                        <i class="fas fa-qrcode"></i> 微信群
                    </h3>
                    <div class="qr-code-container">
                        <div class="qr-code-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <span>扫描加入微信群</span>
                        </div>
                        <div class="qr-code-info">
                            二维码更新时间：${group.qrCodeUpdated}
                        </div>
                    </div>
                </div>
                
                <!-- 组长信息（如果有） -->
                ${group.leaders && group.leaders.length > 0 ? `
<div class="content-section">
    <h3 class="section-title">
        <i class="fas fa-crown"></i> 分组管理 ${group.leaders.length > 1 ? `(${group.leaders.length}位)` : ''}
    </h3>
    <div class="leaders-container">
        ${group.leaders.map((leader, index) => `
        <div class="leader-card">
            <div class="leader-card-bg" data-leader-index="${index}"></div>
            
            <div class="leader-card-content">
                <div class="leader-header">
                    <div class="leader-avatar">
                        ${leader.avatar}
                    </div>
                    <div class="leader-info">
                        <div class="leader-name">${leader.name}</div>
                        <div class="leader-title">
                            <span class="leader-badge">
                                <i class="fas fa-star"></i> ${leader.role}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="leader-action">
                    <a href="javascript:void(0)" class="view-profile-btn" 
                       onclick="viewLeaderProfile('${leader.name}', ${group.id})">
                        <i class="fas fa-user-circle"></i> 查看主页
                    </a>
                </div>
            </div>
        </div>
        `).join('')}
    </div>
</div>
` : ''}

               <!-- 剧本创作区域（仅编剧组显示） -->
${group.id === 3 ? `
<div class="content-section editor-section">
    <h3 class="section-title">
        <i class="fas fa-edit"></i> 剧本创作
    </h3>
    <p style="font-size: 14px; color: var(--medium-gray); margin-bottom: 12px;">
        为活动创作剧本或上传已有文档
    </p>
    <button class="create-script-btn" onclick="openScriptEditor(${group.id})">
        <i class="fas fa-pen-alt"></i> 开始创作剧本
    </button>
    <p style="font-size: 11px; color: var(--light-gray); margin-top: 8px;">
        支持富文本编辑，可上传文档，提交后需审核
    </p>
</div>
` : ''} 

                <!-- 加入按钮 -->
                <div class="content-section join-section">
                    <button class="join-button" onclick="joinGroup(${group.id}, ${group.needsAudit})">
                        ${group.needsAudit ? '提交作品申请加入' : '立即加入该分组'}
                    </button>
                    <p style="font-size: 12px; color: var(--medium-gray); margin-top: 8px;">
                        ${group.needsAudit ? '此分组需要审核作品，请准备好你的作品' : '点击后即可加入，开始你的剧组之旅'}
                    </p>
                </div>
            </div>
        `;
        
        // 点击展开/收起
        card.querySelector('.card-header').addEventListener('click', function(e) {
            if (!e.target.closest('.view-profile-btn') && !e.target.closest('.join-button')) {
                card.classList.toggle('expanded');
            }
        });
        
        return card;
    }
    
    // 初始化
    setTimeout(() => {
        renderGroups();
    }, 300);
    
    // ⬇️ ⬇️ ⬇️ 修复这个函数 ⬇️ ⬇️ ⬇️
    window.viewLeaderProfile = function(leaderName, groupId) {
        console.log('查看组长主页:', leaderName, '分组:', groupId);
        alert(`即将查看 ${leaderName} 的主页\n\n个人主页功能开发中，敬请期待！`);
    };
    
    window.joinGroup = function(groupId, needsAudit) {
        console.log('申请加入分组:', groupId, '需要审核:', needsAudit);
        
        if (needsAudit) {
            alert('此分组需要提交作品审核。\n\n请准备好你的作品（视频/图片/音频），我们将在24小时内审核。\n\n审核标准：作品质量、创意性、符合分组要求。');
        } else {
            alert('已提交加入申请！\n\n分组管理员将在24小时内处理您的申请。\n\n通过后您将收到通知，并可以开始参与分组活动。');
        }
    };
});
window.openScriptEditor = function(groupId) {
    console.log('打开剧本编辑器，分组:', groupId);
    
    // 保存当前分组ID到localStorage，供编辑器页面使用
    localStorage.setItem('currentGroupId', groupId);
    localStorage.setItem('currentGroupName', '编剧组');
    
    // 跳转到编辑器页面
    window.location.href = 'script-editor.html';
};
