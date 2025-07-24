# 贡献指南

感谢你对 TT-Components 的关注！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📖 改进文档
- 🔧 提交代码修复
- ✨ 开发新功能

## 🚀 开发流程

### 环境准备

1. **Node.js 要求**: >= 16.0.0
2. **包管理器**: 推荐使用 pnpm >= 7.0.0

### 本地开发

```bash
# 1. Fork 项目到你的 GitHub 账户

# 2. 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/tt-components.git
cd tt-components

# 3. 添加上游仓库
git remote add upstream https://github.com/HuareuT/tt-components.git

# 4. 安装依赖
pnpm install

# 5. 启动开发服务器
pnpm examples

# 6. 在另一个终端启动构建监听
pnpm build --watch
```

### 开发规范

#### 代码风格

项目使用 Prettier 来保证代码格式的一致性：

```bash
# 自动修复代码格式
pnpm format
```

#### 提交规范

我们使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范：

```
<类型>[可选 作用域]: <描述>

[可选 正文]

[可选 脚注]
```

**常用类型：**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例：**

```
feat(table): 添加表格导出功能
fix(modal): 修复拖拽边界检测问题
docs: 更新组件 API 文档
```

## 📝 提交流程

### 1. 创建功能分支

```bash
# 确保本地 main 分支是最新的
git checkout main
git pull upstream main

# 创建功能分支
git checkout -b feat/your-feature-name
```

### 2. 开发和测试

```bash
# 开发你的功能...

# 运行测试
pnpm test

# 格式化代码
pnpm format

# 构建验证
pnpm build
```

### 3. 提交代码

```bash
# 添加文件
git add .

# 提交（请遵循提交规范）
git commit -m "feat: 添加新功能"

# 推送到你的 fork
git push origin feat/your-feature-name
```

### 4. 创建 Pull Request

1. 在 GitHub 上打开你的 fork
2. 点击 "Compare & pull request"
3. 填写 PR 模板
4. 等待代码审查

## 🐛 Bug 报告

发现 Bug？请帮助我们改进！

### 报告前的检查

- [ ] 确认这是一个 Bug，而不是使用问题
- [ ] 搜索 [现有 issues](https://github.com/HuareuT/tt-components/issues) 确认没有重复
- [ ] 使用最新版本重现问题

### Bug 报告模板

```markdown
## Bug 描述

简洁明了地描述问题

## 重现步骤

1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 期望行为

描述你期望发生什么

## 实际行为

描述实际发生了什么

## 环境信息

- OS: [e.g. macOS 12.0]
- 浏览器: [e.g. Chrome 96.0]
- Vue 版本: [e.g. 3.4.27]
- TT-Components 版本: [e.g. 0.1.6]

## 附加信息

添加任何其他有助于解释问题的信息、截图等
```

## 💡 功能建议

有好的想法？我们很乐意听到！

### 建议模板

```markdown
## 功能描述

清楚地描述你想要的功能

## 解决的问题

这个功能要解决什么问题？

## 详细设计

描述功能的详细设计方案

## 替代方案

考虑过其他解决方案吗？

## 附加信息

添加任何其他相关信息
```

## 📚 文档贡献

文档和代码同样重要！你可以：

- 修复文档中的错误
- 改进现有文档的清晰度
- 添加缺失的文档
- 翻译文档
- 添加使用示例

## ✅ Pull Request 检查清单

提交 PR 前请确认：

- [ ] 代码通过所有测试
- [ ] 代码格式符合项目规范（通过 format 检查）
- [ ] 添加了必要的测试用例
- [ ] 更新了相关文档
- [ ] 提交信息符合约定式提交规范
- [ ] PR 描述清晰，说明了变更内容

## 🎯 开发注意事项

### 组件开发

1. **命名规范**: 组件名使用 `Tt` 前缀，采用 PascalCase
2. **文件结构**: 每个组件放在独立目录中，包含 `index.vue` 文件
3. **样式**: 使用 Ant Design Vue 的设计语言
4. **属性**: 提供完整的 props 定义和默认值
5. **事件**: 清晰定义 emits
6. **文档**: 为新组件添加完整的 API 文档

### 构建和发布

- 只有维护者可以发布新版本
- 版本号遵循语义化版本规范
- 发布前必须更新 CHANGELOG.md

## 📞 联系方式

如果你有任何问题，可以通过以下方式联系我们：

- GitHub Issues: [提交问题](https://github.com/HuareuT/tt-components/issues)
- 邮箱: [your-email@example.com]

## 📄 许可证

通过贡献代码，你同意你的贡献将在 [MIT 许可证](./LICENSE) 下授权。

---

再次感谢你的贡献！🎉
