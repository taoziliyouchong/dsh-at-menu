# dsh-at-menu

**中文** | [English](README.en.md)

按 `@` 弹出的引用菜单顶部多一排类别标签：点标签只看该类候选，不用一直往下滚动找组。

## 有什么类别

只内置 DSH 会话界面本来就有数据的三类：

| 类别 | 数据来源 |
| --- | --- |
| 工作区文件 | 会话工作区的文件引用接口；文件与文件夹同列一类，文件夹行尾部箭头（或 Tab）进入目录，面包屑点上级 |
| 历史会话 | 会话引用候选里的普通会话 |
| 子代理会话 | 同一份候选里带子代理标记的行 |

技能、插件、常用提示词、侧栏引用等类别**不由本插件内置**：它们由各自的插件通过
`ctx.inputTriggers.registerSource({ trigger: '@', name: '类别名', candidates, onPick })`
注册到宿主，面板会把注册过的源显示成类别标签——`name` 就是标签文字，装得越多标签越多。

## 安装

```sh
dsh plugin --profile desktop add github:taoziliyouchong/dsh-at-menu
```

发布到 npm 之后也可以：

```sh
dsh plugin --profile desktop add dsh-at-menu
```

装完重启 DSH。用别的 profile 就把 `desktop` 换成你的 profile 名。

要求：DSH 0.2.2 系列的桌面端或 `dsh web`（需要会话输入框的 @ 菜单；验证版本 0.2.2-rc.1）。
兼容：DSH 0.2.2-rc.1 验证通过；更高版本未验证。

## 建议同时关掉内置的 @ 菜单

内置的引用菜单（loader id `ui-reference`）也会注册「工作区文件」「历史会话」这类源。
两份源同名同时存在，菜单里会出现重复组。推荐在 profile 的 `cordis.patch.yml` 里把它关掉：

```yaml
- id: ui-reference
  disabled: true
```

关掉之后的代价：历史消息里的 `@路径` 不再有装饰样式、文件引用不再能点击打开——文字内容不丢。
不关也能用（本插件会隐藏内置菜单的外观），只是候选会有重复。

## 怎么工作

- 面板挂在 list 槽 `conversation.input.overlay` 上，与内置菜单同一个座位；只在 @ 菜单打开期间
  用一条注入样式隐藏内置菜单（`body[data-dsh-at-open] [data-trigger-menu]`），`/` 斜杠菜单保持内置外观。
- 候选数据、键盘（上下 / 回车 / Esc）、插入动作仍由内置 controller 拥有；面板只订阅它的
  menu store，再把 pick / hover / dismiss 回投回去。
- 引用以纯文本落进草稿（`@路径`、`@[标题](dsh-session:…)`），宿主侧现有的文本解析链照旧工作。
- 不联网、不上传任何内容。

## 已知限制

- 与内置 `ui-reference` 同时启用时，同名的候选组会重复出现（见上一节）。
- 类别标签只显示 `CATEGORY_SOURCES` 里登记过的源；新插件注册了新名字的源，要改 `src/entry.jsx`
  里那一行才会出标签。
- 只改 @ 菜单的外观与分组，不改变草稿的插入格式。

## 开发

```sh
npm install
npm run build:client    # 从 src/entry.jsx 重新生成 lib/client.js
npm run check:client    # 已提交产物与源码一致
npm run check           # 语法
npm run smoke           # 结构 / 组合声明 / 宿主 / 产物 / 伴随插件 五关
```

`lib/client.js` 是提交进仓库的构建产物：从 GitHub 安装时不跑构建，缺了它界面不加载。
打包要求：`react`、`react/jsx-runtime` 保持 external（由 DSH 客户端模块表提供）；
产物外壳 `window.__ModuleLoader__.load({ id, factory })` 里的 `id` 必须等于包名。

源码只有两处：

- `src/entry.jsx` —— 浏览器半边（面板、类别标签、源注册）
- `index.js` —— 宿主半边（本包没有宿主行为，只为被插件系统加载）

## 反馈

插件有问题，按这个顺序：

1. 开 Issue：https://github.com/taoziliyouchong/dsh-at-menu/issues —— 能留痕、能搜历史；
2. 急着问或不想开 Issue，QQ 号：**2171960697**（加好友请注明装的是哪个插件）。

反馈时带上：DSH 版本、插件版本、报错原文、截图。

## 许可

MIT
