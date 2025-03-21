# TT-Components

基于 Vue 3 的 UI 组件库，包含可拖拽模态框、文件预览等组件。

## 特性

- 可拖拽的模态框，支持调整大小
- 支持图片预览（缩放、旋转、翻转）
- 支持视频预览
- 支持文件列表导航
- 支持持久化模态框位置和大小

## 安装

```bash
npm install tt-components
```

## API 文档

### DraggableModal 组件

可拖拽的模态框基础组件。

#### 属性

| 属性名          | 类型    | 默认值                     | 说明                 |
| --------------- | ------- | -------------------------- | -------------------- |
| title           | String  | ''                         | 模态框标题           |
| width           | Number  | 800                        | 模态框初始宽度       |
| fileList        | Array   | []                         | 文件列表             |
| storageKey      | String  | 'draggable-modal-settings' | 本地存储键名         |
| persistPosition | Boolean | true                       | 是否持久化位置和大小 |

#### 方法

| 方法名    | 参数            | 说明                           |
| --------- | --------------- | ------------------------------ |
| open      | (index: Number) | 打开模态框，可指定初始文件索引 |
| nextFile  | -               | 切换到下一个文件               |
| prevFile  | -               | 切换到上一个文件               |
| resetFile | (index: Number) | 重置当前文件                   |

### PreviewFileModal 组件

文件预览模态框组件，基于 DraggableModal。

#### 属性

| 属性名          | 类型    | 默认值                        | 说明                                |
| --------------- | ------- | ----------------------------- | ----------------------------------- |
| title           | String  | ''                            | 模态框标题                          |
| width           | Number  | 800                           | 模态框初始宽度                      |
| fileList        | Array   | []                            | 文件列表，每项包含 name 和 url 属性 |
| storageKey      | String  | 'preview-file-modal-settings' | 本地存储键名                        |
| persistPosition | Boolean | true                          | 是否持久化位置和大小                |

#### 方法

| 方法名    | 参数            | 说明                               |
| --------- | --------------- | ---------------------------------- |
| open      | (index: Number) | 打开预览模态框，可指定初始文件索引 |
| resetFile | (index: Number) | 重置当前文件                       |

## 许可证

MIT
