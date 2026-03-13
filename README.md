# OpenClaw Map - 多Agent协作项目管理插件

> 解决OpenClaw多Agent沟通协作问题

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-v1.0+-blue.svg)](https://github.com/openclaw/openclaw)

---

## ✨ 特性

| 特性 | 说明 |
|------|------|
| 🤖 Agent状态 | 实时查看所有Agent在线状态 |
| 📁 项目管理 | 创建、列表、删除项目 |
| 📋 任务管理 | 创建、分配、追踪任务 |
| 👥 团队协作 | 拉人/踢人进群 |
| 🧠 Agent记忆 | 观察→规划→反思系统 |

---

## 📊 能力对比

### 现状 vs 升级后

| 能力 | 现状 (OpenClaw) | 升级后 (Map) |
|------|-----------------|--------------|
| Agent状态 | ❌ 看不到 | ✅ `/agent status` |
| 项目管理 | ❌ 无 | ✅ 创建/列表 |
| 任务追踪 | ❌ 口头 | ✅ 系统化管理 |
| 团队协作 | ❌ 各自为战 | ✅ 拉人/分配任务 |

---

## 🚀 安装

```bash
# 方式1: 克隆仓库
git clone https://github.com/xiaoshe/openclaw-map.git

# 方式2: 复制到OpenClaw插件目录
cp -r openclaw-map ~/.openclaw/extensions/
```

---

## 📖 使用方法

### 命令列表

| 命令 | 功能 | 示例 |
|------|------|------|
| `/agent status` | 显示所有Agent状态 | `/agent status` |
| `/project new` | 创建项目 | `/project new 电商项目` |
| `/project list` | 查看项目列表 | `/project list` |
| `/project add @Agent` | 拉Agent进群 | `/project add @小蛇` |
| `/project remove @Agent` | 踢Agent出群 | `/project remove @小白` |
| `/task add` | 添加任务 | `/task add 上架商品` |
| `/task list` | 查看任务列表 | `/task list` |
| `/task done [任务]` | 完成任务 | `/task done 上架商品` |

### 界面展示

#### Agent状态
```
🤖 Agent 状态
─────────────────
🐍 小蛇  产品经理   ●在线
💻 小白  编程开发   ●在线
🎨 小美  自媒体运营  ○忙碌
🛒 小电  电商运营   ○离线
📈 伊   股票投资   ●在线
```

#### 项目列表
```
📁 我的项目
─────────────────
1. Map v1.0    (4人, 5任务)
2. 电商项目     (2人, 3任务)
```

#### 任务列表
```
📋 任务列表 - 电商项目
─────────────────
☑ 需求调研       [小蛇] 100%
☐ 上架商品      [待分配]    
☐ 制作详情页    [待分配]    
```

---

## 🏗️ 项目结构

```
openclaw-map/
├── package.json          # 项目配置
├── README.md             # 本文件
├── SKILL.md              # 技能定义
├── src/
│   ├── index.js          # 插件入口
│   ├── commands.js       # 命令解析
│   ├── project.js        # 项目管理
│   ├── task.js           # 任务管理
│   ├── agent.js          # Agent状态
│   └── memory/           # 记忆系统
│       ├── observation.js
│       ├── planning.js
│       └── reflection.js
```

---

## 📝 开发计划

- [x] v1.0 方案设计
- [ ] v1.1 命令解析器 + Agent状态
- [ ] v1.2 项目管理
- [ ] v1.3 任务管理
- [ ] v1.4 群集成（拉人/踢人）
- [ ] v1.5 Agent记忆系统

---

## 🤝 贡献

欢迎提交Issue和PR！

---

## 📄 许可证

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 相关链接

- [OpenClaw官方文档](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [斯坦福生成式代理论文](https://arxiv.org/abs/2304.03442)

---

*由小白创建 - 2026-03-13*
