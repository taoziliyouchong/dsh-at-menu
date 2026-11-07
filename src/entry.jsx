/**
 * @ 菜单类别化：只内置官方标准模式里已有的 @ 分类——工作区文件（文件夹并入同一类，
 * 走官方的 Tab 下钻）／历史会话／子代理会话，每个源 = 菜单里独立的一组。技能、插件、
 * 提示词、侧栏引用等类别不由本插件内置：其他插件 registerSource('@') 注册的源出现在
 * 菜单数据里，但不进本插件标签；要显示需在 CATEGORY_SOURCES 登记。
 *
 * 面板与内置 MenuView 挂在同一个 list 槽 `conversation.input.overlay` 上；
 * 插件注入一条全局样式把内置菜单（`[data-trigger-menu]`）隐藏，视觉完全由本面板接管。
 * 数据、键盘（上下/回车/Esc）、插入行为仍由内置 controller 拥有：面板只订阅它的
 * menu store 并回投 pick / hover / dismiss。删掉插件那一行即可回到内置菜单。
 *
 * 引用一律以纯文本落进草稿（`@path ` / `@[label](dsh-session:…)`），宿主侧现有的
 * 文本解析链照旧工作，不依赖内置 ui-reference 的 codec/chip。
 */
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/** 需要的客户端服务：只接标准模式里官方已有的 @ 数据源（文件/会话），
 * 技能、插件、提示词等类别由各自的插件 registerSource('@') 扩展，本插件不内置。 */
export const inject = [
  'inputTriggers', 'sessions', 'slots', 'remote', 'remote.fileReferences',
  'remote.sessionReferenceResolver', 'sidebarRight',
]

/** 一个路径里取文件名（最后一段）。 */
function baseName(path) {
  const slash = path.lastIndexOf('/')
  return slash < 0 ? path : path.slice(slash + 1)
}

/** 一个路径的父目录；工作区根目录返回空串。 */
function parentOf(path) {
  const slash = path.lastIndexOf('/')
  return slash < 0 ? '' : path.slice(0, slash)
}

/** 写进草稿的 @ 形式：含空格的路径加引号。 */
function fileMention(path, directory) {
  const text = path.includes(' ') ? `@"${path}"` : `@${path}`
  return directory && !text.endsWith('/') ? `${text}/` : text
}

/** 面板只显示本插件注册的类别 + 已知第三方源（提示词货架）；其余源不进标签。 */
const CATEGORY_SOURCES = ['工作区文件', '历史会话', '子代理会话', '常用提示词']

/** 空文件夹的占位行：空组会让菜单自动关闭，留一行让 @ 界面停在该目录。 */
const EMPTY_FOLDER = '（此文件夹为空）'

/** 面包屑里「工作区根」的哨兵值；点它回到根列表。 */
const ROOT_CRUMB = '__dsh_at_root__'

/**
 * 下钻状态下的面包屑：工作区根 + 每一级目录，最后一级标记 current。
 * @param query - 下钻后的查询文本（形如 `src/client/`）。
 * @returns 面包屑；未下钻时为空。
 */
function folderCrumbs(query) {
  const path = query.endsWith('/') ? query.slice(0, -1) : query
  if (path === '') return []
  const parts = path.split('/').filter(Boolean)
  const crumbs = [{ label: '工作区', value: ROOT_CRUMB }]
  let acc = ''
  for (const part of parts) {
    acc = acc === '' ? part : `${acc}/${part}`
    crumbs.push({ label: `${part}/`, value: acc })
  }
  return crumbs.map((crumb, index) => index === crumbs.length - 1 ? { ...crumb, current: true } : crumb)
}

const S = {
  panel: {
    position: 'absolute',
    bottom: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 400,
    overflow: 'hidden',
    padding: 4,
    border: '0.5px solid var(--dsw-alias-border-l1, rgba(127,127,127,.25))',
    borderRadius: 10,
    // 与内置菜单同一层材质：菜单填充色 + 背景模糊，避免正文透过面板。
    background: 'var(--dsw-menu-surface-fill, Canvas)',
    backdropFilter: 'var(--dsw-menu-backdrop-filter, blur(20px))',
    boxShadow: 'var(--dsw-elevation-prominent, 0 8px 24px rgba(0,0,0,.18))',
    color: 'var(--dsw-alias-label-primary, CanvasText)',
    fontSize: 13,
  },
  tabs: {
    flex: 'none',
    display: 'flex',
    gap: 2,
    padding: '3px 3px 5px',
    marginBottom: 2,
    overflowX: 'auto',
    borderBottom: '0.5px solid var(--dsw-alias-border-l1, rgba(127,127,127,.25))',
  },
  tab: active => ({
    flex: '0 0 auto',
    padding: '2px 8px',
    border: 'none',
    borderRadius: 4,
    background: active ? 'var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.16))' : 'transparent',
    color: active ? 'var(--dsw-alias-label-primary, CanvasText)' : 'var(--dsw-alias-label-tertiary, GrayText)',
    fontFamily: 'inherit',
    fontSize: 11,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }),
  viewport: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflowY: 'auto',
    // 滚动条常驻占位（内容不足时不出现、出现时也不挤动布局），
    // 避免"数据到了才出滚动条"造成的左右/上下抖动。
    scrollbarGutter: 'stable',
  },
  groupTitle: {
    padding: '6px 8px',
    fontSize: 11,
    lineHeight: '15px',
    color: 'var(--dsw-alias-label-tertiary, GrayText)',
  },
  row: active => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    minHeight: 34,
    padding: '6px 8px',
    border: 'none',
    borderRadius: 6,
    background: active ? 'var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.16))' : 'transparent',
    color: 'inherit',
    font: 'inherit',
    fontSize: 13,
    lineHeight: '20px',
    textAlign: 'left',
    cursor: 'pointer',
  }),
  name: { flex: 'none', maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  alias: { flex: 'none', maxWidth: '20%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--dsw-alias-label-tertiary, GrayText)', fontSize: 12, lineHeight: '18px' },
  description: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', color: 'var(--dsw-alias-label-tertiary, GrayText)', fontSize: 12, lineHeight: '18px' },
  icon: { flex: 'none', display: 'inline-flex', width: 14, height: 14, alignItems: 'center', justifyContent: 'center', color: 'var(--dsw-alias-menu-icon, GrayText)' },
  pending: { padding: '10px 8px', color: 'var(--dsw-alias-label-tertiary, GrayText)', fontSize: 12 },
  skeletonRow: { display: 'flex', alignItems: 'center', boxSizing: 'border-box', minHeight: 34, padding: '6px 8px' },
  skeletonBar: width => ({ height: 18, width, borderRadius: 4, background: 'var(--dsw-alias-bg-skeleton, rgba(127,127,127,.18))' }),
  drill: { flex: 'none', marginLeft: 4, color: 'var(--dsw-alias-label-tertiary, GrayText)' },
  crumbs: { display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px 4px', overflowX: 'auto' },
  crumb: {
    border: 'none', background: 'transparent', color: 'var(--dsw-alias-label-tertiary, GrayText)',
    fontFamily: 'inherit', fontSize: 11, lineHeight: '16px', padding: '2px 5px', borderRadius: 4, cursor: 'pointer',
  },
}

/** 行首图标：与内置菜单的 ReferenceIconRegular 同一套观感（14px 线性）。 */
function RowIcon({ kind }) {
  const path = kind === 'folder'
    ? 'M1.8 4.2h3.4l1.2 1.3h5.8v6.1H1.8z'
    : kind === 'session'
      ? 'M2 3.6h10v6.1H6.6L4.2 11.7V9.7H2z'
      : 'M4 1.9h4.4L10.9 4.4v7.7H4z'
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
      strokeWidth="1.1" strokeLinejoin="round" aria-hidden>
      <path d={path} />
      {kind === 'file' ? <path d="M8.4 1.9v2.5h2.5" /> : null}
    </svg>
  )
}

/** 读取中的一行骨架（与真实行同高，减少数据到达时的高度跳动）。 */
function Skeleton() {
  return (
    <div role="status" aria-label="正在加载">
      <div style={S.skeletonRow}><span className="dsh-at-skelbar" style={S.skeletonBar('42%')} /></div>
    </div>
  )
}

/**
 * 菜单面板：顶部类别标签（鼠标点选），下面只列当前类别的候选。
 * @param props - 槽注入的 menu store 与回投函数。
 * @returns 面板；菜单关闭时 null。
 */
export function AtMenuPanel({ menu, headers, onPick, onCrumb, onHover, onDismiss }) {
  const state = useSyncExternalStore(fn => menu.subscribe(fn), () => menu.getSnapshot())
  const crumbs = useSyncExternalStore(fn => headers.subscribe(fn), () => headers.getSnapshot())
  const [active, setActive] = useState(null)
  const panelRef = useRef(null)
  const listRef = useRef(null)

  // 键盘移动高亮到别的组时，类别跟着切过去；菜单关闭时清空类别。
  useEffect(() => {
    if (!state.open) {
      if (active !== null) setActive(null)
      return
    }
    const highlight = state.highlight
    if (highlight !== null && active !== null && highlight.source !== active
      && CATEGORY_SOURCES.includes(highlight.source)) setActive(highlight.source)
  }, [state, active])

  // 内置 ui-reference 启用时，它的 source "reference" 也在这份菜单数据里，本面板不显示那一组。
  // 高亮一旦落到不显示的组，键盘就会走进看不见的行、回车选中没看见的候选——
  // 把它推回第一个可见类别的首项。
  useEffect(() => {
    if (!state.open) return
    const highlight = state.highlight
    if (highlight === null || CATEGORY_SOURCES.includes(highlight.source)) return
    const first = state.groups.find(group => CATEGORY_SOURCES.includes(group.source)
      && group.status === 'ready' && group.items.length > 0)
    if (first !== undefined) onHover(first.source, 0)
  }, [state])

  // 点面板外（且不在输入框里）关闭菜单。
  useEffect(() => {
    if (!state.open) return
    const onPointerDown = ev => {
      if (!(ev.target instanceof Node)) return
      if (panelRef.current?.contains(ev.target)) return
      const composerCard = panelRef.current?.closest('[data-composer-card]')
      if (composerCard?.contains(ev.target)) return
      onDismiss()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => { document.removeEventListener('pointerdown', onPointerDown, true) }
  }, [state.open, onDismiss])

  // 高亮行滚进视野（键盘与鼠标共用同一高亮）。
  useEffect(() => {
    const highlight = state.open ? state.highlight : null
    if (highlight === null) return
    listRef.current?.querySelector(`[data-row="${highlight.source}:${highlight.index}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [state])

  // 只有 @ 菜单由本面板接管；`/` 菜单保持内置外观。
  // 用 layout effect：面板挂上与前一刻画出内置菜单在同一帧内切换，避免闪一下。
  const ours = state.open && state.hit !== null && state.hit.trigger === '@'
  useLayoutEffect(() => {
    if (ours) document.body.setAttribute('data-dsh-at-open', '')
    else document.body.removeAttribute('data-dsh-at-open')
    return () => { document.body.removeAttribute('data-dsh-at-open') }
  }, [ours])

  if (!ours) return null

  const groups = state.groups.filter(group => CATEGORY_SOURCES.includes(group.source))
  const sources = groups.map(group => group.source)
  // 「全部」模式里空类别整块不渲染（连组标题一起），否则数据返回后空标题消失
  // 会让面板高度突然收缩、看起来在弹；选中某一类时空组仍在，给出"没有候选"提示。
  const visible = active === null
    ? groups.filter(group => !(group.status === 'ready' && group.items.length === 0))
    : groups.filter(group => group.source === active)
  // 文件类别下钻时的面包屑（工作区根 → 每一级目录），点上级即可退回。
  const crumbRows = active !== null ? crumbs.get(active) : undefined
  const choose = source => {
    setActive(source)
    const group = state.groups.find(item => item.source === source)
    if (group !== undefined && group.status === 'ready' && group.items.length > 0) onHover(source, 0)
  }

  return (
    <div ref={panelRef} style={S.panel} data-dsh-at-menu="">
      <div style={S.tabs} role="tablist" aria-label="候选类别">
        <button type="button" role="tab" aria-selected={active === null} style={S.tab(active === null)}
          onMouseDown={ev => { ev.preventDefault(); choose(null) }}>全部</button>
        {sources.map(source => (
          <button key={source} type="button" role="tab" aria-selected={active === source} style={S.tab(active === source)}
            onMouseDown={ev => { ev.preventDefault(); choose(source) }}>{source}</button>
        ))}
      </div>
      {crumbRows !== undefined && crumbRows.length > 0 && (
        <div style={S.crumbs} role="navigation" aria-label="目录导航">
          {crumbRows.map((crumb, index) => (
            <button key={`${crumb.label}:${index}`} type="button" style={S.crumb}
              disabled={crumb.current === true}
              onMouseDown={ev => { ev.preventDefault(); if (crumb.current !== true) onCrumb(active, index) }}>{crumb.label}</button>
          ))}
        </div>
      )}
      <div ref={listRef} className="dsh-at-scroll" style={S.viewport} role="listbox" aria-label="触发候选">
        {visible.map(group => (
          <div key={group.source}>
            {active === null && <div style={S.groupTitle}>{group.source}</div>}
            {group.status === 'ready' && group.items.length === 0 && active !== null
              ? <div style={S.pending}>这一类没有候选</div>
              : null}
            {group.status === 'pending' && group.items.length === 0 && active !== null
              ? <Skeleton />
              : null}
            {group.items.map((item, index) => {
              const isActive = state.highlight !== null
                && state.highlight.source === group.source && state.highlight.index === index
              return (
                <button
                  key={`${group.source}:${index}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-row={`${group.source}:${index}`}
                  style={S.row(isActive)}
                  onMouseDown={ev => { ev.preventDefault(); onPick(group.source, index) }}
                  onMouseMove={isActive ? undefined : () => { onHover(group.source, index) }}
                >
                  {typeof item.icon === 'string'
                    ? <span style={S.icon} aria-hidden><RowIcon kind={item.icon} /></span>
                    : null}
                  <span style={S.name}>{item.label ?? item.name}</span>
                  {item.label !== undefined && item.label.toLowerCase() !== item.name.toLowerCase()
                    ? <span style={S.alias}>{item.name}</span>
                    : null}
                  {item.description !== undefined ? <span style={S.description}>{item.description}</span> : null}
                  {item.drill === true
                    ? <span style={S.drill} role="button" aria-label="进入文件夹"
                        onMouseDown={ev => { ev.preventDefault(); ev.stopPropagation(); onPick(group.source, index, 'drill') }}>›</span>
                    : null}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 注册六个源 + 面板接管菜单外观。
 * @param ctx - 客户端根上下文。
 */
export function apply(ctx) {
  const sessions = ctx.sessions

  /** 文件候选共用的一次查询，按 kind 分流成两个源。 */
  async function listFiles(session, query, signal) {
    const result = await ctx.remote.fileReferences.list(session.sessionId, query, signal)
    if (!result.ok) return []
    return result.value
  }

  /** 会话候选按「自己和子代理」分流。 */
  async function listSessions(session, query, signal) {
    const result = await ctx.remote.sessionReferenceResolver.candidates(session.sessionId, query, signal)
    if (!result.ok) return []
    const listed = sessions.list.getSnapshot().byId
    const currentCwd = listed[session.sessionId]?.cwd
    return result.value.map(candidate => {
      const summary = listed[candidate.sessionId]
      const child = summary?.origin === 'subagent' && summary?.parentId === session.sessionId
      return {
        child,
        row: {
          name: candidate.label,
          ...(candidate.displayTitle === undefined ? {} : { label: candidate.displayTitle }),
          ...(summary?.cwd === undefined || summary.cwd === currentCwd ? {} : { description: summary.cwd }),
          icon: 'session',
          value: candidate.mention,
        },
      }
    })
  }

  // 每个源都带 codec：chip 的发送展开就是 ref 原样（官方的 codec 也是 ref => ref）。
  // 文件类另带 openReference，点 chip 时在侧栏打开文件。
  const source = (name, order, candidates, onPick, options = {}) => ({
    trigger: '@',
    name,
    order,
    candidates,
    onPick,
    codec: { clipboardText: ref => ref, serialize: ref => Promise.resolve(ref) },
    ...options,
  })

  /** 文件引用 chip 的 ref 还原成相对路径。 */
  function pathOfRef(ref) {
    const bare = ref.startsWith('@"') ? ref.slice(2, -1) : ref.startsWith('@') ? ref.slice(1) : ref
    return bare.endsWith('/') ? bare.slice(0, -1) : bare
  }

  /** 点文件 chip：在侧栏打开该文件（resource 地址与官方 fileAddressFor 同构）。 */
  function openReference(session, { ref, appearance }) {
    if (appearance !== 'file' && appearance !== 'folder') return false
    const path = pathOfRef(ref)
    if (path === '') return false
    ctx.sidebarRight.openResource(`dsh-resource://file/session/${session.sessionId}/${path}`)
    return true
  }

  const sources = [
    source('工作区文件', 10, async (session, { query, signal }) => {
      const files = await listFiles(session, query, signal)
      if (files.length === 0) {
        // 下钻进空目录时留一行占位：空组会让菜单自动关闭，用户会以为"被退出"了。
        const dir = query.endsWith('/') ? query.slice(0, -1) : undefined
        if (dir !== undefined) return [{ name: EMPTY_FOLDER, description: dir, icon: 'folder', value: dir }]
        return []
      }
      // 文件夹与文件同列一类；文件夹行走官方的下钻方式（Tab / 行尾箭头进入目录）。
      return files.map(file => file.kind === 'directory'
        ? {
          name: `${baseName(file.path)}/`,
          description: parentOf(file.path) === '' ? undefined : parentOf(file.path),
          icon: 'folder',
          value: file.path,
          drill: true,
        }
        : {
          name: baseName(file.path),
          description: parentOf(file.path) === '' ? undefined : parentOf(file.path),
          icon: 'file',
          value: fileMention(file.path, false),
        })
    }, ({ candidate, action }) => {
      if (candidate.name === EMPTY_FOLDER) {
        const ref = fileMention(candidate.value, true)
        return { insert: { source: '工作区文件', ref, label: `${baseName(candidate.value)}/`, appearance: 'folder', clipboardText: ref } }
      }
      if (candidate.value === ROOT_CRUMB) return { text: '@', continue: true }
      // 面包屑点上级：crumb 不带 drill 标记，但动作仍是 drill，落到该目录。
      if (action === 'drill' && candidate.drill !== true) {
        return { text: fileMention(candidate.value, true), continue: true }
      }
      if (candidate.drill === true) {
        // 下钻把草稿推进该目录、菜单继续列出内容；落定则引用该文件夹。
        if (action === 'drill') return { text: fileMention(candidate.value, true), continue: true }
        const ref = fileMention(candidate.value, true)
        return { insert: { source: '工作区文件', ref, label: candidate.name, appearance: 'folder', clipboardText: ref } }
      }
      // 落定即插引用 chip（appearance 决定图标；ref 原样作为模型文本）。
      return {
        insert: {
          source: '工作区文件',
          ref: candidate.value,
          label: candidate.name,
          appearance: 'file',
          clipboardText: candidate.value,
        },
      }
    }, { header: (_session, { query }) => folderCrumbs(query), openReference }),

    source('历史会话', 30, async (session, { query, signal }) => {
      const rows = await listSessions(session, query, signal)
      return rows.filter(row => !row.child).map(row => row.row)
    }, ({ candidate }) => ({
      insert: {
        source: '历史会话',
        ref: candidate.value,
        label: candidate.label ?? candidate.name,
        appearance: 'session',
        clipboardText: candidate.value,
      },
    })),

    source('子代理会话', 40, async (session, { query, signal }) => {
      const rows = await listSessions(session, query, signal)
      return rows.filter(row => row.child).map(row => row.row)
    }, ({ candidate }) => ({
      insert: {
        source: '子代理会话',
        ref: candidate.value,
        label: candidate.label ?? candidate.name,
        appearance: 'session',
        clipboardText: candidate.value,
      },
    })),
  ]

  // 隐藏内置菜单的视觉（数据与键盘仍由它处理），且只在 @ 菜单打开期间隐藏，
  // 这样 `/` 斜杠命令菜单保持内置外观。滚动条与骨架动画照内置菜单的观感补上。
  const style = document.createElement('style')
  style.dataset.dshAtMenu = ''
  style.textContent = [
    'body[data-dsh-at-open] [data-trigger-menu]{display:none!important}',
    '[data-dsh-at-menu] .dsh-at-scroll::-webkit-scrollbar{width:6px}',
    '[data-dsh-at-menu] .dsh-at-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.35));border-radius:3px;border:2px solid transparent;background-clip:padding-box}',
    '[data-dsh-at-menu] .dsh-at-scroll::-webkit-scrollbar-track{background:transparent;margin:12px 0}',
    '@keyframes dsh-at-skel{0%{opacity:1}40%{opacity:.6}80%,100%{opacity:1}}',
    '[data-dsh-at-menu] .dsh-at-skelbar{animation:dsh-at-skel 2s cubic-bezier(.36,0,.64,1) infinite}',
  ].join('\n')
  document.head.appendChild(style)

  ctx.slots.inject('conversation.input.overlay', () => ctx.slots.register({
    name: 'conversation.input.overlay',
    id: 'dsh-at-panel',
    order: 5,
    inject: (sessionId) => {
      const actx = sessions.scope(sessionId)
      if (actx === undefined) throw new Error(`dsh-at-menu: session "${String(sessionId)}" resolved no scope`)
      const controller = ctx.inputTriggers.sessionOf(actx)
      return {
        menu: controller.menu,
        headers: controller.headers,
        onPick: (sourceName, index, action) => { controller.pick(sourceName, index, action) },
        onCrumb: (sourceName, index) => { controller.pickCrumb(sourceName, index) },
        onHover: (sourceName, index) => { controller.hover(sourceName, index) },
        onDismiss: () => { controller.dismiss() },
      }
    },
  }, AtMenuPanel))

  ctx.effect(() => {
    const registry = ctx.inputTriggers
    const disposers = sources.map(item => registry.registerSource(item))
    return () => {
      for (const dispose of disposers.reverse()) dispose()
      style.remove()
    }
  }, 'dsh-at-menu: @ category sources')
}
