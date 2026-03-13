/**
 * OpenClaw Map 插件
 * 多Agent协作项目管理
 * 
 * 作者: xiaobai
 * 版本: 1.0.0
 */

const fs = require('fs');
const path = require('path');

// 数据存储路径
const DATA_DIR = path.join(__dirname, '..', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify({ projects: [] }, null, 2));
}

// Agent列表（从MEMORY.md读取）
const AGENTS = [
    { id: 'agent_xiaoshe', name: '小蛇', role: '产品经理', status: 'online' },
    { id: 'agent_xiaobai', name: '小白', role: '编程开发', status: 'online' },
    { id: 'agent_xiaomei', name: '小美', role: '自媒体运营', status: 'busy' },
    { id: 'agent_xiaodian', name: '小电', role: '电商运营', status: 'offline' },
    { id: 'agent_yi', name: '伊', role: '股票投资', status: 'online' }
];

/**
 * 处理命令
 */
function handleCommand(message, context) {
    const cmd = message.trim();
    
    // /agent status
    if (cmd === '/agent status' || cmd === '/agent') {
        return handleAgentStatus();
    }
    
    // /project new [名称]
    if (cmd.startsWith('/project new ')) {
        const name = cmd.replace('/project new ', '').trim();
        return handleProjectNew(name);
    }
    
    // /project list
    if (cmd === '/project list' || cmd === '/project') {
        return handleProjectList();
    }
    
    // /task add [任务名]
    if (cmd.startsWith('/task add ')) {
        const title = cmd.replace('/task add ', '').trim();
        return handleTaskAdd(title);
    }
    
    // /task list
    if (cmd === '/task list' || cmd === '/task') {
        return handleTaskList();
    }
    
    // /help
    if (cmd === '/help' || cmd === '/map help') {
        return handleHelp();
    }
    
    return null;
}

/**
 * 处理 Agent 状态查询
 */
function handleAgentStatus() {
    const statusMap = {
        'online': '●',
        'busy': '○',
        'offline': '○'
    };
    
    let response = '🤖 Agent 状态\n─────────────────\n';
    
    AGENTS.forEach(agent => {
        const status = statusMap[agent.status] || '○';
        response += `${agent.name}  ${agent.role}  ${status}${agent.status === 'online' ? '在线' : agent.status === 'busy' ? '忙碌' : '离线'}\n`;
    });
    
    return response;
}

/**
 * 处理创建项目
 */
function handleProjectNew(name) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    const project = {
        id: 'proj_' + Date.now(),
        name: name,
        members: [],
        tasks: [],
        createdAt: new Date().toISOString()
    };
    
    data.projects.push(project);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    return `✅ 项目"${name}"已创建！\n📋 可用命令:\n  /task add [任务] - 添加任务\n  /project add @Agent - 拉人进群`;
}

/**
 * 处理项目列表
 */
function handleProjectList() {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '📁 暂无项目\n使用 /project new [名称] 创建项目';
    }
    
    let response = '📁 我的项目\n─────────────────\n';
    
    data.projects.forEach((project, index) => {
        response += `${index + 1}. ${project.name}  (${project.members.length}人, ${project.tasks.length}任务)\n`;
    });
    
    return response;
}

/**
 * 处理添加任务
 */
function handleTaskAdd(title) {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 请先创建项目: /project new [名称]';
    }
    
    // 默认添加到第一个项目
    const project = data.projects[0];
    
    const task = {
        id: 'task_' + Date.now(),
        title: title,
        assignee: '待分配',
        status: 'todo',
        createdAt: new Date().toISOString()
    };
    
    project.tasks.push(task);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
    
    return `✅ 任务"${title}"已添加到项目"${project.name}"\n📋 使用 /task list 查看`;
}

/**
 * 处理任务列表
 */
function handleTaskList() {
    const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    
    if (data.projects.length === 0) {
        return '❌ 暂无项目';
    }
    
    const project = data.projects[0];
    
    if (project.tasks.length === 0) {
        return `📋 任务列表 - ${project.name}\n─────────────────\n暂无任务`;
    }
    
    let response = `📋 任务列表 - ${project.name}\n─────────────────\n`;
    
    project.tasks.forEach(task => {
        const check = task.status === 'completed' ? '☑' : '☐';
        response += `${check} ${task.title}    [${task.assignee}]\n`;
    });
    
    return response;
}

/**
 * 处理帮助
 */
function handleHelp() {
    return `📖 Map 命令帮助
─────────────────

🤖 Agent命令
  /agent status   查看Agent状态

📁 项目命令
  /project new [名称]  创建项目
  /project list       查看项目列表
  /project add @Agent 拉人进群

📋 任务命令
  /task add [任务]  添加任务
  /task list        查看任务列表
  /task done [任务] 完成任务

🔧 其他
  /help             显示帮助
`;
}

// 导出模块
module.exports = {
    handleCommand,
    AGENTS
};
