/**
 * Map 插件测试 - v1.1.0
 */

const map = require('./src/index.js');

console.log('='.repeat(50));
console.log('🧪 Map 插件 v1.1.0 功能测试');
console.log('='.repeat(50));

// 测试1: Agent状态
console.log('\n📌 测试1: /agent status');
console.log('-'.repeat(30));
console.log(map.handleCommand('/agent status'));

// 测试2: Agent详情
console.log('\n📌 测试2: /agent detail 小白');
console.log('-'.repeat(30));
console.log(map.handleCommand('/agent detail 小白'));

// 测试3: 创建项目
console.log('\n📌 测试3: /project new 电商项目');
console.log('-'.repeat(30));
console.log(map.handleCommand('/project new 电商项目'));

// 测试4: 添加第二个项目
console.log('\n📌 测试4: /project new Map插件');
console.log('-'.repeat(30));
console.log(map.handleCommand('/project new Map插件'));

// 测试5: 项目列表
console.log('\n📌 测试5: /project list');
console.log('-'.repeat(30));
console.log(map.handleCommand('/project list'));

// 测试6: 添加任务
console.log('\n📌 测试6: /task add 上架5款商品');
console.log('-'.repeat(30));
console.log(map.handleCommand('/task add 上架5款商品'));

// 测试7: 添加更多任务
console.log('\n📌 测试7: /task add 制作商品详情页');
console.log('-'.repeat(30));
console.log(map.handleCommand('/task add 制作商品详情页'));

// 测试8: 分配任务
console.log('\n📌 测试8: /task assign 上架5款商品 to 小电');
console.log('-'.repeat(30));
console.log(map.handleCommand('/task assign 上架5款商品 to 小电'));

// 测试9: 任务列表
console.log('\n📌 测试9: /task list');
console.log('-'.repeat(30));
console.log(map.handleCommand('/task list'));

// 测试10: 完成任务
console.log('\n📌 测试10: /task done 上架5款商品');
console.log('-'.repeat(30));
console.log(map.handleCommand('/task done 上架5款商品'));

// 测试11: 拉人进群
console.log('\n📌 测试11: /project add @小蛇');
console.log('-'.repeat(30));
console.log(map.handleCommand('/project add @小蛇'));

// 测试12: 拉更多人进群
console.log('\n📌 测试12: /project add @小美');
console.log('-'.repeat(30));
console.log(map.handleCommand('/project add @小美'));

// 测试13: 项目详情
console.log('\n📌 测试13: /project detail 电商项目');
console.log('-'.repeat(30));
console.log(map.handleCommand('/project detail 电商项目'));

// 测试14: 统计面板
console.log('\n📌 测试14: /map stats');
console.log('-'.repeat(30));
console.log(map.handleCommand('/map stats'));

// 测试15: 记忆系统
console.log('\n📌 测试15: /map memory');
console.log('-'.repeat(30));
console.log(map.handleCommand('/map memory'));

// 测试16: 查看系统记忆
console.log('\n📌 测试16: /map memory 系统');
console.log('-'.repeat(30));
console.log(map.handleCommand('/map memory 系统'));

// 测试17: 帮助
console.log('\n📌 测试17: /help');
console.log('-'.repeat(30));
console.log(map.handleCommand('/help'));

console.log('\n' + '='.repeat(50));
console.log('✅ 测试完成！');
console.log('='.repeat(50));
