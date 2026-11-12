# dsh-at-menu

**中文** | [English](README.en.md)

按 `@` 弹出的引用菜单顶部多一排类别标签：点标签只看该类候选，不用一直往下滚动找组。

## 有什么类别

| 类别 | 数据来源 |
| --- | --- |
| 文件与文件夹 | 内置 `ui-reference` 的 @ 候选（宿主文件引用接口）；文件夹行尾部箭头或 Tab 进入目录，面包屑点上级 |
| 子智能体 | 内置 `ui-reference` 的 @ 候选（当前会话的子代理） |
| 对话 | 内置 `ui-reference` 的 @ 候选（其余历史会话） |
| 插件 | 本插件内置：读常用提示词插件（`dsh-prompt-shelf`）的插件清单路由 `/dsh-prompt-shelf/api/plugins`（与窗口里「插件」那一项同一份）；没装那个插件时这一类不出现 |

其它插件注册的 `@` 源照常并列显示成类别标签（`name` 就是标签文字），装得越多标签越多。

## 安装

```sh
dsh plugin --profile desktop add github:taoziliyouchong/dsh-at-menu
```

发布到 npm 之后也可以：

```sh
dsh plugin --profile desktop add dsh-at-menu
```

装完重启 DSH。用别的 profile 就把 `desktop` 换成你的 profile 名。

要求：DSH 0.2.1 及以上的桌面端或 `dsh web`（需要会话输入框的 @ 菜单；验证版本 0.2.2-rc.1）。
要求 DSH >= 0.2.1-alpha.1（下限按用到的服务与槽在 alpha.1 已存在推定）；实测 0.2.2-rc.1，更低版本未验证。

## 与内置 @ 菜单共存

内置的 `ui-reference` 不用关，两者同时启用。它提供 `source "reference"`，管两件本插件不做的事：

- 往输入框拖文件、或点「添加文件」时生成的文件引用卡片，由它转成文字；它不在，发送会报
  `slash: no serializer for reference source "reference"`；
- 历史消息里 `@路径` 的装饰样式和点击打开。

本插件的面板只接管 @ 菜单的外观：内置那一组候选不进面板，键盘高亮落到它时会被推回可见类别。
两边同时启用不会出现重复候选。

## 怎么工作

- 面板挂在 list 槽 `conversation.input.overlay` 上，与内置菜单同一个座位；只在 @ 菜单打开期间
  用一条注入样式隐藏内置菜单（`body[data-dsh-at-open] [data-trigger-menu]`），`/` 斜杠菜单保持内置外观。
- 候选数据、键盘（上下 / 回车 / Esc）、插入动作仍由内置 controller 拥有；面板只订阅它的
  menu store，再把 pick / hover / dismiss 回投回去。
- 引用以纯文本落进草稿（`@路径`、`@[标题](dsh-session:…)`），宿主侧现有的文本解析链照旧工作。
- 不联网、不上传任何内容。

## 已知限制

- 类别标签按候选里出现的类别动态生成：没数据的类别不出现；内置 reference 组某次查询失败会被整组丢掉
  （面板底部留一句提示，Esc 后重开一次会重试）。
- 只改 @ 菜单的外观与分组；插入格式仍由各源自己决定（常用提示词与文件引用都是纯文本）。

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
