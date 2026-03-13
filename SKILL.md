# SKILL.md - Map 插件技能定义

## 技能信息

- **名称**: Map
- **描述**: OpenClaw多Agent协作项目管理插件
- **版本**: 1.0.0
- **作者**: xiaobai

---

## 功能列表

### Agent管理
- `/agent status` - 显示所有Agent状态

### 项目管理
- `/project new [名称]` - 创建新项目
- `/project list` - 查看项目列表
- `/project add @Agent` - 拉Agent进群
- `/project remove @Agent` - 踢Agent出群

### 任务管理
- `/task add [任务名]` - 添加任务
- `/task list` - 查看任务列表
- `/task done [任务名]` - 完成任务

---

## 使用场景

1. **查看团队状态**: 发送 `/agent status`
2. **创建项目**: 发送 `/project new 电商项目`
3. **分配任务**: 发送 `/task add 上架商品`
4. **查看进度**: 发送 `/task list`

---

## 数据存储

使用LocalStorage存储项目、任务数据。

---

## 依赖

- OpenClaw Gateway
- 飞书插件（用于群管理）
