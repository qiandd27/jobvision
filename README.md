# JobVision - 求职智能仪表盘

一站式 AI 求职决策与面试辅助平台。React 19 + TypeScript + Express + SQLite + ECharts 5。

## 快速开始

```bash
npm install && cd server && npm install && cd ..
npm run build && npm start
# 打开 http://localhost:3001
```

## 技术栈
- 前端: React 19 + MUI 7 + Tailwind CSS 4 + ECharts 5
- 后端: Express + TypeScript + better-sqlite3
- 爬虫: Playwright (BOSS直聘/天眼查)
- AI: 规则引擎简历分析 + 面试题库

## API 端点
- GET /api/jobs - 岗位列表
- POST /api/crawler/boss - BOSS爬虫
- POST /api/ai/analyze-resume - AI简历分析
- POST /api/ai/interview-questions - 面试题

## 页面
/ | /jobs | /jobs/:id | /applications | /resume