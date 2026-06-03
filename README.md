# JobVision - 求职智能仪表盘

一站式 AI 求职决策与面试辅助平台。DeepSeek 驱动。

## 快速开始

```bash
npm install && cd server && npm install && cd ..
npm run build && npm start
# 打开 http://localhost:3001
```

双击 `start.bat` 一键启动。

## 启用 DeepSeek AI

1. 去 platform.deepseek.com 注册获取 API Key
2. 将 Key 写入 `server/data/.deepseek_key` 文件
3. 重启服务

或在页面右上角「配置 API Key」输入。

## 功能

### 6 个页面
- `/` 仪表盘 — 薪资热力图 + 公司风险雷达
- `/jobs` 岗位列表 — BOSS式卡片 + 筛选 + 一键投递
- `/jobs/:id` 岗位剖析 — 雷达图 + SWOT + 薪资分析 + 时间线
- `/applications` 投递管理 — 看板 + 漏斗图 + 日历热力图
- `/resume` 简历分析 — PDF上传 + AI对比 + 面试题库 + 🆕 模拟面试
- `/compare` Offer对比 — 多Offer打分 + 雷达图 + AI推荐

### AI 能力 (DeepSeek)
- 简历深度优化（改写 + 关键词补充）
- 模拟面试聊天（AI扮演面试官，实时评分）
- JD 深度解读（隐藏需求 + 红旗信号）
- Offer 对比分析（排名 + 因素分析）
- 面试题库生成

### 技术栈
| 层 | 技术 |
|---|------|
| 前端 | React 19 + MUI 7 + Tailwind CSS 4 + ECharts 5 |
| 后端 | Express + TypeScript + better-sqlite3 |
| 爬虫 | Playwright (BOSS直聘 + 拉勾) |
| AI | DeepSeek (deepseek-chat) + 本地规则引擎降级 |

## 分享给朋友

```bash
# 下载 ngrok → 注册 → 配置 authtoken
ngrok http 3001
# 把 https://xxxx.ngrok-free.app 发给朋友
```

## 线上演示

https://65794a2d3be84fe4a45ba32a83164184.app.codebuddy.work
