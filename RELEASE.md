# 发布指南

本文档说明如何发布 TT-Components 到 npm。

## 📋 发布前检查清单

在发布前，请确保：

- [ ] 所有代码已提交到 Git
- [ ] 通过了所有测试
- [ ] 更新了相关文档
- [ ] 检查了构建输出
- [ ] 确认 npm 登录状态

## 🚀 发布命令

### 1. 快速发布（推荐）

#### 自动化发布（使用 standard-version）

```bash
# 自动生成版本号和更新日志，然后发布
pnpm release:publish
```

这个命令会：

- 根据提交记录自动确定版本类型（patch/minor/major）
- 自动生成/更新 CHANGELOG.md
- 创建 Git 标签
- 发布到 npm

#### 手动指定版本类型

```bash
# 补丁版本（bug修复）：0.1.6 → 0.1.7
pnpm release:patch

# 小版本（新功能）：0.1.6 → 0.2.0
pnpm release:minor

# 大版本（破坏性变更）：0.1.6 → 1.0.0
pnpm release:major
```

### 2. 分步发布

#### 步骤1：检查发布内容

```bash
# 预览将要发布的文件
pnpm publish:check
```

#### 步骤2：更新版本

```bash
# 选择版本类型
pnpm version:patch   # 补丁版本
pnpm version:minor   # 小版本
pnpm version:major   # 大版本

# 或者使用 standard-version 自动生成
pnpm release
```

#### 步骤3：发布到 npm

```bash
# 发布正式版本
npm publish

# 发布测试版本
pnpm publish:beta    # 测试版
pnpm publish:alpha   # 内测版
```

## 📊 发布流程详解

### standard-version 工作流程

1. **分析提交记录**：根据约定式提交规范分析提交类型
2. **确定版本号**：
   - `feat:` → minor 版本
   - `fix:` → patch 版本
   - `BREAKING CHANGE:` → major 版本
3. **生成更新日志**：自动更新 CHANGELOG.md
4. **创建提交和标签**：提交版本变更并创建 Git 标签

### 版本号规范

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

```
主版本号.次版本号.修订号 (MAJOR.MINOR.PATCH)
```

- **MAJOR**：做了不兼容的 API 修改
- **MINOR**：做了向下兼容的功能性新增
- **PATCH**：做了向下兼容的问题修正

### 提交规范

为了让 standard-version 正确工作，请遵循约定式提交规范：

```
<类型>[可选 作用域]: <描述>

[可选 正文]

[可选 脚注]
```

**示例：**

```bash
feat(table): 添加表格导出功能
fix(modal): 修复拖拽边界检测问题
docs: 更新 API 文档
```

## 🔍 发布验证

发布后请验证：

1. **npm 包信息**

   ```bash
   npm view tt-components
   ```

2. **安装测试**

   ```bash
   # 在临时目录测试安装
   mkdir test-install && cd test-install
   npm init -y
   npm install tt-components
   ```

3. **功能测试**
   - 检查组件是否正常导入
   - 验证样式文件是否包含
   - 测试基本功能

## 🛠️ 故障排除

### 常见问题

1. **npm 登录问题**

   ```bash
   npm login
   npm whoami  # 验证登录状态
   ```

2. **版本冲突**

   ```bash
   npm view tt-components versions --json  # 查看已发布版本
   ```

3. **权限问题**

   ```bash
   npm owner ls tt-components  # 查看包管理员
   ```

4. **构建失败**
   ```bash
   pnpm clean && pnpm build  # 清理重新构建
   ```

### 回滚发布

如果需要撤销错误的发布：

```bash
# 撤销最近的发布（24小时内）
npm unpublish tt-components@版本号

# 废弃某个版本
npm deprecate tt-components@版本号 "版本有问题，请使用新版本"
```

## 📅 发布计划

### 发布频率

- **补丁版本**：根据需要（bug修复）
- **小版本**：每月1-2次（新功能）
- **大版本**：根据需要（破坏性变更）

### 发布时机

- 周二或周三发布（避免周末问题）
- 避免节假日发布
- 重要更新提前通知用户

## 🔒 安全注意事项

1. **双重验证**：确保 npm 账户开启 2FA
2. **权限控制**：限制包的发布权限
3. **代码审查**：发布前进行代码审查
4. **备份恢复**：保留重要版本的备份

---

如有疑问，请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 或提交 Issue。
