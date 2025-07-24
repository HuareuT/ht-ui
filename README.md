# TT-Components

[![npm version](https://badge.fury.io/js/tt-components.svg)](https://badge.fury.io/js/tt-components)
[![license](https://img.shields.io/npm/l/tt-components.svg)](https://github.com/HuareuT/tt-components/blob/main/LICENSE)

基于 Vue 3 和 Ant Design Vue 的高质量 UI 组件库，提供可拖拽模态框、文件预览、数据表格等实用组件。

## ✨ 特性

- 🚀 基于 Vue 3 Composition API
- 📱 响应式设计，支持移动端
- 🎨 基于 Ant Design Vue 设计语言
- 📦 支持按需加载
- 🌍 支持国际化
- 🔧 完整的 TypeScript 定义文件（即将支持）

## 📦 安装

```bash
# npm
npm install tt-components

# yarn
yarn add tt-components

# pnpm
pnpm add tt-components
```

## 🔨 使用

### 完整引入

```javascript
import { createApp } from 'vue';
import TTComponents from 'tt-components';
import 'tt-components/dist/style.css';

const app = createApp();
app.use(TTComponents);
```

### 按需引入

```javascript
import { TtDraggableModal, TtPreviewFileModal, TtTable } from 'tt-components';
import 'tt-components/dist/style.css';

export default {
  components: {
    TtDraggableModal,
    TtPreviewFileModal,
    TtTable,
  },
};
```

## 📖 组件文档

### TtDraggableModal 可拖拽模态框

功能强大的可拖拽模态框基础组件，支持拖拽、调整大小、位置记忆等功能。

#### 基础用法

```vue
<template>
  <tt-draggable-modal ref="modalRef" title="示例标题" :width="800">
    <p>模态框内容</p>
  </tt-draggable-modal>
</template>
```

#### API

**属性 (Props)**

| 参数            | 说明                 | 类型      | 默认值                       |
| --------------- | -------------------- | --------- | ---------------------------- |
| title           | 模态框标题           | `string`  | `''`                         |
| width           | 初始宽度             | `number`  | `800`                        |
| fileList        | 文件列表             | `Array`   | `[]`                         |
| storageKey      | 本地存储键名         | `string`  | `'draggable-modal-settings'` |
| persistPosition | 是否持久化位置和大小 | `boolean` | `true`                       |

**方法 (Methods)**

| 方法名    | 说明             | 参数               |
| --------- | ---------------- | ------------------ |
| open      | 打开模态框       | `(index?: number)` |
| nextFile  | 切换到下一个文件 | -                  |
| prevFile  | 切换到上一个文件 | -                  |
| resetFile | 重置当前文件     | `(index?: number)` |

### TtPreviewFileModal 文件预览模态框

基于 TtDraggableModal 的文件预览组件，支持图片、视频等多种文件格式预览。

#### 基础用法

```vue
<template>
  <tt-preview-file-modal ref="previewRef" title="文件预览" :file-list="fileList" />
</template>

<script setup>
  const fileList = [
    { name: '图片1.jpg', url: '/images/1.jpg' },
    { name: '视频1.mp4', url: '/videos/1.mp4' },
  ];
</script>
```

#### API

**属性 (Props)**

| 参数            | 说明                           | 类型                                 | 默认值                          |
| --------------- | ------------------------------ | ------------------------------------ | ------------------------------- |
| title           | 模态框标题                     | `string`                             | `''`                            |
| width           | 初始宽度                       | `number`                             | `800`                           |
| fileList        | 文件列表，每项包含 name 和 url | `Array<{name: string, url: string}>` | `[]`                            |
| storageKey      | 本地存储键名                   | `string`                             | `'preview-file-modal-settings'` |
| persistPosition | 是否持久化位置和大小           | `boolean`                            | `true`                          |

**方法 (Methods)**

| 方法名    | 说明           | 参数               |
| --------- | -------------- | ------------------ |
| open      | 打开预览模态框 | `(index?: number)` |
| resetFile | 重置当前文件   | `(index?: number)` |

### TtTable 数据表格

增强版数据表格组件，在 Ant Design Vue Table 基础上添加了全屏、刷新等功能。

#### 基础用法

```vue
<template>
  <tt-table :data-source="dataSource" :columns="columns" @refresh="handleRefresh">
    <template #operate>
      <a-button type="primary">新增</a-button>
    </template>
  </tt-table>
</template>
```

#### API

**属性 (Props)**

继承 Ant Design Vue Table 的所有属性，额外支持：

| 参数       | 说明     | 类型                | 默认值 |
| ---------- | -------- | ------------------- | ------ |
| tableTitle | 表格标题 | `string`            | `''`   |
| pagination | 分页配置 | `object \| boolean` | `{}`   |

**事件 (Events)**

| 事件名  | 说明               | 回调参数 |
| ------- | ------------------ | -------- |
| refresh | 点击刷新按钮时触发 | -        |

**插槽 (Slots)**

| 插槽名  | 说明         |
| ------- | ------------ |
| operate | 操作区域内容 |

## 🤝 开发

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 本地开发

```bash
# 克隆项目
git clone https://github.com/HuareuT/tt-components.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm examples

# 构建组件库
pnpm build
```

### 代码规范

```bash
# 代码格式化
pnpm format
```

### 发布流程

详细的发布流程请查看 [发布指南](./RELEASE.md)。

#### 快速发布

```bash
# 自动化发布（推荐）
pnpm release:publish

# 手动发布
pnpm release:patch  # 补丁版本
pnpm release:minor  # 小版本
pnpm release:major  # 大版本
```

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](./CONTRIBUTING.md)。

## 📝 更新日志

详细的更新日志请查看 [CHANGELOG.md](./CHANGELOG.md)。

## 📄 许可证

[MIT](./LICENSE) License © 2024 HuareuT
