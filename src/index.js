/**
 * OpenClaw Map 插件 - 完整版
 * 多Agent协作项目管理
 * 
 * 作者: xiaobai
 * 版本: 1.1.0
 */

const fs = require('fs');
const path = require('path');

// 数据存储路径
const DATA_DIR = path.join(__dirname, '..', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const MEMORY_FILE = path.join(DATA_DIR, 'memory.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify({ projects: [] }, null, 2));
}

if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify({ memories: {} }, null, 2));
}

// Agent列表
const AGENTS = [
    { id: 'agent_xiaoshe', name: '小蛇', role: '产品经理', status: 'online', feishuId: '' },
    { id: 'agent_xiaobai', name: '小白', role: '编程开发', status: 'online', feishuId: '' },
    { id: 'agent_xiaomei', name: '小美', role: '自媒体运营', status: 'busy', feishuId: '' },
    { id: 'agent_xiaodian', name: '小电', role: '电商运营', status: 'offline', feishuId: '' },
    { id: 'agent_yi', name: '伊', role: '股票投资', status: 'online', feishuId: '' }
];

/**
 * 处理所有命令
 */
function handleCommand(message, context = {}) {
    const msg = message.trim();
    
    // 解析命令
    if (msg.startsWith('/agent')) return handleAgentCommand(msg, context);
    if (msg.startsWith('/project')) return handleProjectCommand(msg, context);
    if (msg.startsWith('/task')) return handleTaskCommand(msg, context);
    if (msg.startsWith('/map')) return handleMapCommand(msg, context);
    if (msg === '/help') return handleHelp();
    
    return null;
}

// ==================== Agent命令 ====================

function handleAgentCommand(msg, context) {
    const args = msg.replace('/agent', '').trim();
    
    if (!args || args === 'status') {
        return handleAgentStatus();
    }
    
    if (args.startsWith('detail ')) {
        const name = args.replace('detail ', '').trim();
        return handleAgentDetail(name);
    }
    
    return handleAgentStatus();
}

function handleAgentStatus() {
    const statusMap = {
        'online': '●',
        'busy': '○',
        'offline': '○'
    };
    
    let response = '🤖 Agent 状态\n─────────────────\n';
    
    AGENTS.forEach(agent => {
        const status = statusMap[agent.status] || '○';
        const statusText = agent.status === 'online' ? '在线' : agent.status === 'busy' ? '忙碌' : '离线';
        response += `${agent.name}  ${agent.role}  ${status}${statusText}\n`;
    });
    
    response += '\n📝 发送 /agent detail [名字] 查看详情';
    
    return response;
}

function handleAgentDetail(name) {
    const agent = AGENTS.find(a => a.name === name);
    
    if (!agent) {
        return `❌ 未找到Agent: ${name}`;
    }
    
    return `🤖 ${agent.name} 详情
─────────────────
角色: ${agent.role}
状态: ${agent.status === 'online' ? '●在线' : agent.status === 'busy' ? '○忙碌' : '○离线'}
ID: ${agent.id}
`;
}

// ==================== Project命令 ====================

function handleProjectCommand(msg, context) {
    const args = msg.replace('/project', '').trim();
    
    // /project new [名称]
    if (args.startsWith('new ')) {
        const name = args.replace('new ', '').trim();
        return handleProjectNew(name);
    }
    
    // /project list
    if (!args || args === 'list') {
        return handleProjectList();
    }
    
    // /project add @Agent
    if (args.startsWith('add ')) {
        const name = args.replace('add ', '').replace('@', '').trim();
        return handleProjectAddMember(name, context);
    }
    
    // /project remove @Agent
    if (args.startsWith('remove ')) {
        const name = args.replace('remove ', '').replace('@', '').trim();
        return handleProjectRemoveMember(name, context);
    }
    
    // /project detail
    if (args.startsWith('detail ')) {
        const name = args.replace('detail ', '').trim();
        return handleProjectDetail(name);
    }
    
    return handleProjectList();
}

function handleProjectNew(name) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    const project = {
        id: 'proj_' + Date.now(),
        name: name,
        members: [],
        tasks: [],
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    data.projects.push(project);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    // 记录到记忆系统
    addObservation('系统', `创建了新项目: ${name}`);
    
    return `✅ 项目"${name}"已创建！
📋 可用命令:
  /task add [任务] - 添加任务
  /project add @小蛇 - 拉人进群
  /project list - 查看项目`;
}

function handleProjectList() {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '📁 暂无项目\n使用 /project new [名称] 创建项目';
    }
    
    let response = '📁 我的项目\n─────────────────\n';
    
    data.projects.forEach((project, index) => {
        const memberCount = project.members?.length || 0;
        const taskCount = project.tasks?.length || 0;
        const status = project.status === 'active' ? '🟢' : '🔴';
        response += `${index + 1}. ${status} ${project.name} (${memberCount}人, ${taskCount}任务)\n`;
    });
    
    return response;
}

function handleProjectDetail(name) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    const project = data.projects.find(p => p.name === name);
    
    if (!project) {
        return `❌ 未找到项目: ${name}`;
    }
    
    let response = `📁 ${project.name}
─────────────────
创建时间: ${new Date(project.createdAt).toLocaleDateString()}
状态: ${project.status === 'active' ? '🟢进行中' : '🔴已结束'}
成员: ${project.members?.join(', ') || '暂无'}
任务: ${project.tasks?.length || 0}个
`;
    
    if (project.tasks?.length > 0) {
        response += '\n📋 任务列表:\n';
        project.tasks.forEach(task => {
            const check = task.status === 'completed' ? '☑' : '☐';
            response += `  ${check} ${task.title} [${task.assignee}]\n`;
        });
    }
    
    return response;
}

function handleProjectAddMember(name, context) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    // 默认添加到第一个项目
    if (data.projects.length === 0) {
        return '❌ 请先创建项目: /project new [名称]';
    }
    
    const project = data.projects[0];
    
    if (!project.members) project.members = [];
    
    if (project.members.includes(name)) {
        return `❌ ${name} 已在项目中`;
    }
    
    project.members.push(name);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    addObservation('系统', `${name} 加入了项目 ${project.name}`);
    
    return `✅ ${name} 已添加到项目"${project.name}"`;
}

function handleProjectRemoveMember(name, context) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 暂无项目';
    }
    
    const project = data.projects[0];
    const index = project.members?.indexOf(name);
    
    if (index === -1 || !project.members) {
        return `❌ ${name} 不在项目中`;
    }
    
    project.members.splice(index, 1);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    addObservation('系统', `${name} 离开了项目 ${project.name}`);
    
    return `✅ ${name} 已从项目"${project.name}"移除`;
}

// ==================== Task命令 ====================

function handleTaskCommand(msg, context) {
    const args = msg.replace('/task', '').trim();
    
    // /task add [任务名]
    if (args.startsWith('add ')) {
        const title = args.replace('add ', '').trim();
        return handleTaskAdd(title, context);
    }
    
    // /task list
    if (!args || args === 'list') {
        return handleTaskList(context);
    }
    
    // /task done [任务名]
    if (args.startsWith('done ')) {
        const title = args.replace('done ', '').trim();
        return handleTaskDone(title, context);
    }
    
    // /task assign [任务] to [Agent]
    if (args.startsWith('assign ')) {
        const match = args.match(/assign (.+) to (.+)/);
        if (match) {
            return handleTaskAssign(match[1].trim(), match[2].trim(), context);
        }
    }
    
    return handleTaskList(context);
}

function handleTaskAdd(title, context) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 请先创建项目: /project new [名称]';
    }
    
    const project = data.projects[0];
    
    if (!project.tasks) project.tasks = [];
    
    const task = {
        id: 'task_' + Date.now(),
        title: title,
        assignee: '待分配',
        status: 'todo',
        priority: project.tasks.length + 1,
        createdAt: new Date().toISOString()
    };
    
    project.tasks.push(task);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    addObservation('系统', `在项目 ${project.name} 中添加了任务: ${title}`);
    
    return `✅ 任务"${title}"已添加到项目"${project.name}"\n📋 使用 /task assign "${title}" to [Agent] 分配任务`;
}

function handleTaskList(context) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 暂无项目';
    }
    
    const project = data.projects[0];
    
    if (!project.tasks || project.tasks.length === 0) {
        return `📋 任务列表 - ${project.name}\n─────────────────\n暂无任务\n\n使用 /task add [任务] 添加任务`;
    }
    
    let response = `📋 任务列表 - ${project.name}\n─────────────────\n`;
    
    const inProgress = project.tasks.filter(t => t.status === 'in_progress');
    const completed = project.tasks.filter(t => t.status === 'completed');
    const todo = project.tasks.filter(t => t.status === 'todo');
    
    response += `🟡 进行中 (${inProgress.length}):\n`;
    inProgress.forEach(task => {
        response += `  ☑ ${task.title} [${task.assignee}]\n`;
    });
    
    response += `\n✅ 已完成 (${completed.length}):\n`;
    completed.forEach(task => {
        response += `  ☑ ${task.title} [${task.assignee}]\n`;
    });
    
    response += `\n⏳ 待处理 (${todo.length}):\n`;
    todo.forEach(task => {
        response += `  ☐ ${task.title} [${task.assignee}]\n`;
    });
    
    return response;
}

function handleTaskDone(title, context) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 暂无项目';
    }
    
    const project = data.projects[0];
    const task = project.tasks?.find(t => t.title === title);
    
    if (!task) {
        return `❌ 未找到任务: ${title}`;
    }
    
    task.status = 'completed';
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    addObservation('系统', `任务 "${title}" 已完成`);
    
    return `✅ 任务"${title}"已标记为完成！`;
}

function handleTaskAssign(title, assignee, context) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 暂无项目';
    }
    
    const project = data.projects[0];
    const task = project.tasks?.find(t => t.title === title);
    
    if (!task) {
        return `❌ 未找到任务: ${title}`;
    }
    
    task.assignee = assignee;
    task.status = 'in_progress';
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    addObservation(assignee, `接手任务: ${title}`);
    
    return `✅ 任务"${title}"已分配给${assignee}`;
}

// ==================== Map命令 ====================

function handleMapCommand(msg, context) {
    const args = msg.replace('/map', '').trim();
    
    if (args === 'memory' || args === '记忆') {
        return handleShowMemory();
    }
    
    if (args.startsWith('memory ')) {
        const agent = args.replace('memory ', '').trim();
        return handleShowAgentMemory(agent);
    }
    
    if (args === 'stats' || args === '统计') {
        return handleShowStats();
    }
    
    return handleHelp();
}

function handleShowMemory() {
    const data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
    
    let response = '🧠 Agent 记忆系统\n─────────────────\n';
    
    Object.keys(data.memories).forEach(agent => {
        const memories = data.memories[agent];
        const obsCount = memories.observations?.length || 0;
        response += `${agent}: ${obsCount}条观察记录\n`;
    });
    
    response += '\n📝 使用 /map memory [Agent] 查看详情';
    
    return response;
}

function handleShowAgentMemory(agent) {
    const data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
    const memories = data.memories[agent];
    
    if (!memories || !memories.observations || memories.observations.length === 0) {
        return `🧠 ${agent} 的记忆为空`;
    }
    
    let response = `🧠 ${agent} 的记忆\n─────────────────\n`;
    
    const recent = memories.observations.slice(-10).reverse();
    recent.forEach(obs => {
        response += `• ${obs.content}\n`;
    });
    
    return response;
}

function handleShowStats() {
    const projectData = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    const memoryData = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
    
    const totalProjects = projectData.projects.length;
    const totalTasks = projectData.projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
    const completedTasks = projectData.projects.reduce((acc, p) => acc + (p.tasks?.filter(t => t.status === 'completed').length || 0), 0);
    const totalObservations = Object.values(memoryData.memories).reduce((acc, m) => acc + (m.observations?.length || 0), 0);
    
    return `📊 统计面板
─────────────────
📁 项目: ${totalProjects}个
📋 任务: ${totalTasks}个
✅ 完成: ${completedTasks}个
🧠 记忆: ${totalObservations}条
🤖 Agent: ${AGENTS.length}个
`;
}

// ==================== 记忆系统 ====================

function addObservation(agent, content) {
    const data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
    
    if (!data.memories[agent]) {
        data.memories[agent] = { observations: [], plans: [], reflections: [] };
    }
    
    data.memories[agent].observations.push({
        id: 'obs_' + Date.now(),
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // 只保留最近100条
    if (data.memories[agent].observations.length > 100) {
        data.memories[agent].observations = data.memories[agent].observations.slice(-100);
    }
    
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

// ==================== 帮助 ====================

function handleHelp() {
    return `📖 Map 命令帮助
─────────────────

🤖 Agent命令
  /agent status      查看Agent状态
  /agent detail [名字] 查看Agent详情

📁 项目命令
  /project new [名称]   创建项目
  /project list        查看项目列表
  /project add @[名字]  拉人进群
  /project remove @[名字] 踢人出群
  /project detail [名称] 项目详情

📋 任务命令
  /task add [任务]    添加任务
  /task list         查看任务列表
  /task done [任务]   完成任务
  /task assign [任务] to [Agent] 分配任务

🧠 记忆命令
  /map memory        查看记忆统计
  /map memory [Agent] 查看Agent记忆
  /map stats         查看整体统计

🔧 其他
  /help              显示帮助
`;
}

// 导出模块
module.exports = {
    handleCommand,
    AGENTS,
    addObservation
};
