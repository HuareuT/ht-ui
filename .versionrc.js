module.exports = {
  // 指定需要更新版本号的文件
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json',
    },
  ],

  // 指定更新日志的配置
  types: [
    { type: 'feat', section: '✨ 新增功能' },
    { type: 'fix', section: '🐛 Bug 修复' },
    { type: 'docs', section: '📖 文档更新' },
    { type: 'style', section: '💄 样式更新' },
    { type: 'refactor', section: '🔨 代码重构' },
    { type: 'perf', section: '⚡ 性能优化' },
    { type: 'test', section: '✅ 测试' },
    { type: 'build', section: '📦 构建' },
    { type: 'ci', section: '🔧 CI/CD' },
    { type: 'chore', section: '🎯 其他' },
    { type: 'revert', section: '⏪ 回滚' },
  ],

  // 忽略的提交类型
  skipUnstable: false,

  // 自定义标题
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',

  // 标签前缀
  tagPrefix: 'v',

  // 版本号配置
  header: '# 更新日志\n\n',

  // 自定义比较链接
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',

  // 自定义Issue链接
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',

  // 自定义提交链接
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',

  // 自定义用户链接
  userUrlFormat: '{{host}}/{{user}}',
};
