# 军训模拟器 - 全栈项目

## 项目简介

军训模拟器是一款基于选择的文字冒险游戏。玩家扮演一名参加军训的学生，在7天的军训生活中通过做出不同选择，影响体力、纪律、心情、教官好感、同学关系等属性，最终根据表现获得不同的正能量结局。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React 18 + TypeScript | 组件化开发，类型安全 |
| 状态管理 | Zustand | 轻量，适合游戏状态 |
| UI 样式 | Tailwind CSS | 主题切换、响应式设计 |
| 前端构建 | Vite | 快速开发与打包 |
| 后端 | Python 3.11 + FastAPI | 高性能异步框架 |
| 数据库 | SQLite | 轻量级文件数据库 |
| 认证 | JWT (PyJWT) | 无状态认证 |

## 项目结构

```
军训模拟器/
├── backend/                      # 后端项目
│   ├── app/
│   │   ├── main.py               # FastAPI入口
│   │   ├── config.py             # 配置
│   │   ├── database.py           # 数据库连接
│   │   ├── models.py             # 数据模型
│   │   ├── schemas.py            # Pydantic模型
│   │   ├── auth.py               # JWT认证工具
│   │   ├── routers/              # API路由
│   │   │   ├── auth.py           # 认证路由
│   │   │   └── game.py           # 游戏路由
│   │   ├── services/             # 业务逻辑
│   │   │   └── game_engine.py    # 游戏引擎
│   │   └── core/                 # 游戏核心
│   │       ├── attribute_system.py
│   │       └── endings.py       # 结局库
│   ├── data/
│   │   └── events.json           # 事件库(76个事件)
│   ├── static/images/            # 场景图片(15张)
│   ├── requirements.txt
│   └── run.py
│
├── frontend/                     # 前端项目
│   ├── src/
│   │   ├── components/           # UI组件
│   │   │   ├── AttributeBar.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── ThemeSwitcher.tsx
│   │   ├── pages/                # 页面
│   │   │   ├── LoginPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── GamePage.tsx
│   │   │   ├── EndingPage.tsx
│   │   │   └── SavePage.tsx
│   │   ├── stores/gameStore.ts   # Zustand状态
│   │   ├── api/client.ts         # API调用
│   │   ├── styles/themes.ts      # 主题配置
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 快速开始

### 1. 环境要求

- Python 3.10+
- Node.js 18+
- npm 或 yarn

### 2. 启动后端

```bash
cd backend
pip install -r requirements.txt
python run.py
```

后端启动后访问 http://127.0.0.1:8000/docs 可查看API文档。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端启动后访问 http://localhost:5173 即可开始游戏。

### 4. 游戏流程

1. 注册/登录账号
2. 输入角色名，开始新游戏
3. 每天经历7个阶段：早操→训练→午间→训练→休息→晚点名→夜间
4. 每个阶段触发事件，选择选项影响属性
5. 7天后根据属性和标记获得结局评价
6. 可随时保存/加载进度（3个存档槽位）

## 游戏特性

- **76个事件**：涵盖队列训练、方阵专项、生活休息、特殊事件等
- **23种正能量结局**：按优先级匹配，最多同时获得3个
- **7项属性系统**：体力、纪律、心情、教官好感、同学关系、健康、口渴度
- **5套主题**：军训迷彩、沙漠风暴、森林绿意、简约白、夜间模式
- **3个存档槽位**：支持随时保存和加载
- **15张AI生成场景图**：覆盖核心事件场景
- **天气系统**：晴天/雨天/大风随机切换
- **方阵选择**：持枪方阵/防暴棍方阵/正常连队
- **随机结果**：部分选项有成功/失败概率
- **事件冷却**：避免重复事件

## 评分系统

| 等级 | 分数 | 说明 |
|------|------|------|
| S | 90+ | 完美收官 |
| A | 80-89 | 优秀 |
| B | 70-79 | 良好 |
| C | 60-69 | 及格 |
| D | <60 | 需要努力 |

## API 接口

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 游戏
- `POST /api/game/start` - 开始新游戏
- `POST /api/game/choose` - 选择选项
- `GET /api/game/state` - 获取当前状态
- `GET /api/game/saves` - 获取存档列表
- `POST /api/game/save` - 保存游戏
- `POST /api/game/load` - 加载存档
- `DELETE /api/game/saves/{slot}` - 删除存档
