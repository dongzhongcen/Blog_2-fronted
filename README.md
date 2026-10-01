# TechBlog 前端（Blog_2-fronted）

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/react-19.x-61dafb">
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-5.x-blue">
  <img alt="Vite" src="https://img.shields.io/badge/vite-7.x-646cff">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/tailwindcss-3.x-38bdf8">
  <img alt="Framer Motion" src="https://img.shields.io/badge/framer--motion-12.x-ff0055">
  <img alt="React Router" src="https://img.shields.io/badge/react--router-7.x-ca4245">
  <img alt="Vercel" src="https://img.shields.io/badge/deploy-vercel-black">
</p>

这是 dongzhongcen 博客（TechBlog）的前端项目，基于 React 19 + TypeScript + Vite，使用 Tailwind CSS、shadcn/ui 组件和 Framer Motion 动画，部署在 Vercel。前端通过 `VITE_API_URL` 调用后端 [Blog_2-backend](https://github.com/dongzhongcen/Blog_2-backend) 提供的文章、评论和点赞接口。项目目前实现了博客首页、全部文章页、文章详情弹窗、评论与点赞、数据自动刷新、进场加载动画、深浅色主题，以及一个管理后台页面。

## 功能特性

- **博客首页**（`/`）：Hero、精选文章轮播、文章列表、侧边栏和关于区块。
- **全部文章**（`/posts`）：展示全部文章并支持按标签筛选。
- **文章详情与互动**：弹窗阅读文章，支持发表评论和点赞（按 IP 判断是否已点赞，并用 localStorage 做本地缓存）。
- **数据实时刷新**：`useRealtimePosts` 每 30 秒自动刷新，窗口重新聚焦时立即刷新，右下角状态指示器可手动强制刷新。
- **进场加载动画**：首次进入时播放加载动画，最短 3 秒。
- **主题切换**：支持深色 / 浅色主题，默认深色并记住用户选择。
- **管理后台**（`/admin`）：仪表盘统计，文章的新建、编辑（内容支持 Markdown）、删除，评论管理和统计视图。
- **侧边栏小组件**：天气卡片和 GitHub 贡献图（目前均使用前端生成的模拟数据）。

## 项目结构

```text
src/
├── pages/            # BlogPage（首页）、AllPostsPage（全部文章）、AdminPage（管理后台）
├── sections/         # 首页区块：Hero、PostsSection、AboutSection、Sidebar、Footer
├── components/       # 文章卡片、轮播、评论区、加载动画、天气、GitHub 贡献图等
│   └── ui/           # shadcn/ui 组件
├── hooks/            # useBlog、useRealtime、useWeather、useGitHubContributions
├── contexts/         # ThemeContext（深浅色主题）
├── types/            # 类型定义
└── main.tsx / App.tsx
```

## 快速开始

### 环境要求

- Node.js 20.19+ 或 22.12+（Vite 7 的要求）
- npm

### 配置后端地址

`.env.production` 中已配置线上后端地址：

```text
VITE_API_URL=https://blog-2-backend.vercel.app/api
```

本地开发未设置 `VITE_API_URL` 时默认请求 `http://localhost:3001/api`，可在 `.env.local` 中覆盖。

### 本地开发

```bash
npm install
npm run dev
```

### 构建与预览

```bash
npm run build     # tsc -b && vite build，输出到 dist/
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 部署

`vercel.json` 已配置 Vercel 使用 `npm install` 安装依赖、`npm run build` 构建并发布 `dist/` 目录。

更多关于加载动画、数据刷新机制和 Hook 用法的说明见 [REALTIME_DATA_GUIDE.md](REALTIME_DATA_GUIDE.md)。

## 当前状态

博客的浏览、评论、点赞和后台管理功能已完成，天气和 GitHub 贡献图仍为模拟数据。后续可继续完善：

- 将管理后台改为由后端鉴权（目前登录只在前端校验）
- 接入真实的天气和 GitHub 贡献数据
- 增加 `.gitignore`，并从仓库中移除已提交的 `node_modules/` 和 `dist/`
- 更新 `package-lock.json`，使其与 `package.json` 保持一致（目前 `npm ci` 会因不同步而失败）
- 移除 `kimi-plugin-inspect-react` 等脚手架遗留插件
