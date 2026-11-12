/**
 * @ 菜单按官方分类显示：不改官方候选、不另造源，只把内置 @ 菜单的外观换成
 * 「顶部类别标签 + 按官方小节分区」的面板。
 *
 * 分类全部来自官方 `ui-reference` 源本身：它把候选按 `section` 分成
 * 「文件与文件夹 / 子智能体 / 对话」三段（文案在 ui-reference 的字典里），
 * 顺序也是官方顺序。本插件不注册任何 `@` 源，第三方源（如常用提示词）照常
 * 并列显示，小标题用它自己的源名。
 *
 * 数据、键盘（上下/回车/Esc）、插入行为、面包屑全由内置 controller 拥有：
 * 面板只订阅它的 menu / headers store，并回投 pick / hover / dismiss。
 * 删掉插件那一行即可回到内置菜单。
 *
 * 滚动位置按目录记：打开菜单时根目录回顶、进过的文件夹回原位；下钻与点面包屑
 * 返回各回各的位置，不再把上一层的偏移带进下一层。
 */
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/** 需要的客户端服务：@ 触发器（菜单数据与键盘都归它）、会话范围、槽。 */
export const inject = ['inputTriggers', 'sessions', 'slots']

/** 官方 reference 源的名字（它的候选按 section 分三段）。 */
const REFERENCE_SOURCE = 'reference'

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
    scrollbarGutter: 'stable',
  },
  sectionTitle: {
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

/** 插件清单路由。 */
const PLUGIN_ROUTES = ['/dsh-prompt-shelf/api/plugins']
/** 清单缓存：同一个菜单里每敲一个字都去问一次路由太吵。 */
let pluginFeed = { at: 0, items: [] }

/** 读已装插件清单：问插件的本机路由；取不到按空。 */
async function loadPluginItems() {
  const now = Date.now()
  if (now - pluginFeed.at < 2000) return pluginFeed.items
  let items = []
  for (const route of PLUGIN_ROUTES) {
    try {
      const url = new URL(route.replace(/^\/+/, ''), document.baseURI)
      const res = await fetch(url.pathname, { headers: { accept: 'application/json' } })
      if (!res.ok) continue
      const data = await res.json().catch(() => null)
      if (data && data.ok === true && Array.isArray(data.items)) { items = data.items; break }
    } catch {
      // 这个路由不通就试下一个
    }
  }
  pluginFeed = { at: now, items }
  return items
}

/**
 * 内置 @ 源「插件」：把已装插件列成一个分类，清单与常用提示词窗口里「插件」那一类同一份；
 * 选中把 `@插件名` 落到光标处。取不到清单时这一类为空。
 */
function createPluginSource() {
  return {
    trigger: '@',
    name: '插件',
    // 10：排在官方 reference 之后、常用提示词（20）之前，与窗口里的类别顺序一致。
    order: 10,
    async candidates(_session, req) {
      const keyword = String(req.query || '').trim().toLowerCase()
      return (await loadPluginItems())
        .filter((item) => item && typeof item.name === 'string' && item.name.trim() !== '')
        .filter((item) => !keyword || item.name.toLowerCase().includes(keyword))
        .slice(0, 40)
        .map((item) => ({
          name: item.name,
          description: item.kind === 'personal' ? '个人插件' : '插件',
          value: item.name,
        }))
    },
    onPick(pick) {
      const name = String(pick.candidate.value || '')
      return name ? { text: '@' + name } : undefined
    },
  }
}

/**
 * 把 controller 的 groups 摊平成「带原 source / 原 index 的行」，并算上每行的类别。
 * 类别取行自身的 section（官方 reference 给的就是「文件与文件夹 / 子智能体 / 对话」）；
 * 没有 section 的源（第三方扩展）用源名。
 * @param groups - controller 发布的菜单分组。
 * @returns { label, rows }：标签顺序 = 行里首次出现的顺序。
 */
function project(groups) {
  const rows = []
  for (const group of groups) {
    // 刷新中的组保留上一批候选（与内置菜单一致：pending 但有旧行就继续显示），
    // 别让一次重新查询把文件与会话整片清空。
    if (group.items.length === 0) continue
    for (let index = 0; index < group.items.length; index += 1) {
      const item = group.items[index]
      rows.push({
        source: group.source,
        index,
        item,
        label: item.section === undefined ? group.source : item.section,
      })
    }
  }
  const labels = []
  for (const row of rows) if (!labels.includes(row.label)) labels.push(row.label)
  return { rows, labels }
}

/**
 * 视口顶端往下第一行（按 data-row 解回 source / index），没有行时 null。
 * 恢复滚动位置后用它把高亮停到眼前那一行，免得回车选中看不见的候选。
 * @param list - 滚动视口。
 * @returns 行身份，或 null。
 */
function rowAtViewportTop(list) {
  const rows = list.querySelectorAll('[data-row]')
  if (rows.length === 0) return null
  const top = list.getBoundingClientRect().top
  let picked = rows[rows.length - 1]
  for (const el of rows) {
    if (el.getBoundingClientRect().top < top - 1) continue
    picked = el
    break
  }
  const key = picked.getAttribute('data-row')
  if (key === null) return null
  const split = key.lastIndexOf(':')
  const index = Number(key.slice(split + 1))
  return Number.isInteger(index) ? { source: key.slice(0, split), index } : null
}

/**
 * 菜单面板：顶部类别标签（鼠标点选），下面按类别分节列候选。
 * @param props - 槽注入的 menu / headers store 与回投函数。
 * @returns 面板；菜单关闭时 null。
 */
export function AtMenuPanel({ menu, headers, onPick, onCrumb, onHover, onDismiss }) {
  const state = useSyncExternalStore(fn => menu.subscribe(fn), () => menu.getSnapshot())
  const crumbs = useSyncExternalStore(fn => headers.subscribe(fn), () => headers.getSnapshot())
  const [active, setActive] = useState(null)
  const panelRef = useRef(null)
  const listRef = useRef(null)
  /** 每个目录上次停下的滚动位置：key 是 @ 后的目录路径（含末尾斜杠），根目录为 ''。 */
  const scrollMemory = useRef(new Map())
  /** 当前列表实际展示的目录 key（换目录时等恢复那一刻才更新）。 */
  const shownPath = useRef('')
  /** 待恢复的目录位置：菜单打开或换目录时挂上，等新候选到齐再落。 */
  const restore = useRef(null)
  const prevOpen = useRef(false)
  const prevPath = useRef('')

  // 菜单关掉时把类别筛选清回「全部」：上一次点过的类别不能带进下一次 @
  // （面板常驻在 overlay 槽里，状态不清就会一打 @ 就停在上次那一类）。
  useEffect(() => {
    if (!state.open) setActive(null)
  }, [state.open])

  const { rows, labels } = project(state.groups)
  const visible = active === null ? rows : rows.filter(row => row.label === active)

  // 键盘高亮跑到当前筛选看不到的行时，把它推回第一个可见行——否则回车会选中没看见的候选。
  useEffect(() => {
    if (!state.open) return
    const highlight = state.highlight
    if (highlight === null) return
    const shown = visible.some(row => row.source === highlight.source && row.index === highlight.index)
    if (shown) return
    const first = visible[0]
    if (first !== undefined) onHover(first.source, first.index)
  }, [state, active, visible])

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

  // 官方 reference 源要先 retain 会话、等初次历史打开再问宿主，到得比第三方源晚。
  const referenceGroup = state.groups.find(group => group.source === REFERENCE_SOURCE)
  // 只在「首次加载、还没有旧行」时用骨架占住列表：刷新期间旧行继续显示，不整片消失。
  const referencePending = referenceGroup !== undefined && referenceGroup.status === 'pending'
    && referenceGroup.items.length === 0
  // 这组被 controller 整组丢掉（这次查询失败）时留一句提示，别让「文件与会话」无声消失。
  const referenceGone = referenceGroup === undefined && state.groups.length > 0

  // 只有 @ 菜单由本面板接管；`/` 菜单保持内置外观。
  // 用 layout effect：面板挂上与前一刻画出内置菜单在同一帧内切换，避免闪一下。
  const ours = state.open && state.hit !== null && state.hit.trigger === '@'
  useLayoutEffect(() => {
    if (ours) document.body.setAttribute('data-dsh-at-open', '')
    else document.body.removeAttribute('data-dsh-at-open')
    return () => { document.body.removeAttribute('data-dsh-at-open') }
  }, [ours])

  // 列表所在的目录：@ 后路径截到最后一个斜杠（含），根目录为 ''。
  // 下钻与点面包屑返回都只改 query：菜单不关、列表沿用同一个滚动容器。不记位置的话，
  // 上一层滑到哪儿下一层就从哪儿开始（点进靠下的文件夹会直接落到最底下）。
  const pathKey = (() => {
    const hit = state.hit
    if (hit === null) return ''
    const query = hit.query
    const slash = query.lastIndexOf('/')
    return slash < 0 ? '' : query.slice(0, slash + 1)
  })()

  // 什么时候该定位：菜单刚打开（根目录回顶、进过的文件夹回原位），或菜单内换了目录
  // （下钻 / 点面包屑返回，回到该目录上次的位置；第一次进入从顶部开始）。
  useEffect(() => {
    if (!ours) {
      prevOpen.current = false
      prevPath.current = pathKey
      restore.current = null
      return
    }
    if (!prevOpen.current) {
      prevOpen.current = true
      prevPath.current = pathKey
      const saved = pathKey === '' ? 0 : scrollMemory.current.get(pathKey)
      restore.current = { key: pathKey, top: saved ?? 0 }
      return
    }
    if (prevPath.current !== pathKey) {
      prevPath.current = pathKey
      restore.current = { key: pathKey, top: scrollMemory.current.get(pathKey) ?? 0 }
    }
  }, [ours, pathKey])

  // 落位置。顺序排在「高亮滚进视野」之后：同一次提交里后写生效，旧高亮不会把列表拽走；
  // 落完把高亮停到视口第一行，回车选中的就是眼前这一行。
  useEffect(() => {
    const pending = restore.current
    if (!ours || pending === null) return
    // 新目录的候选没到齐时先不动，否则会按上一目录的行高算位置。
    if (referenceGroup !== undefined && referenceGroup.status === 'pending') return
    const list = listRef.current
    if (list === null || visible.length === 0) return
    restore.current = null
    shownPath.current = pending.key
    list.scrollTop = pending.top
    scrollMemory.current.set(pending.key, list.scrollTop)
    const row = rowAtViewportTop(list)
    if (row !== null) onHover(row.source, row.index)
  }, [ours, pathKey, referenceGroup, visible, onHover])

  if (!ours) return null

  // 面包屑只由 reference 源在下钻目录时发布。
  const crumbRows = crumbs.get(REFERENCE_SOURCE)
  const choose = (label) => {
    setActive(label)
    const first = label === null ? null : rows.find(row => row.label === label)
    if (first !== undefined && first !== null) onHover(first.source, first.index)
  }

  /** 分节渲染：全部模式下每段一个标题；选中某一类只列该类。 */
  const sections = []
  if (visible.length > 0) {
    for (const row of visible) {
      const last = sections[sections.length - 1]
      if (last !== undefined && last.label === row.label) last.rows.push(row)
      else sections.push({ label: row.label, rows: [row] })
    }
  }

  return (
    <div ref={panelRef} style={S.panel} data-dsh-at-menu="">
      {!referencePending && (
        <div style={S.tabs} role="tablist" aria-label="候选类别">
          <button type="button" role="tab" aria-selected={active === null} style={S.tab(active === null)}
            onMouseDown={ev => { ev.preventDefault(); choose(null) }}>全部</button>
          {labels.map(label => (
            <button key={label} type="button" role="tab" aria-selected={active === label} style={S.tab(active === label)}
              onMouseDown={ev => { ev.preventDefault(); choose(label) }}>{label}</button>
          ))}
        </div>
      )}
      {crumbRows !== undefined && crumbRows.length > 0 && (
        <div style={S.crumbs} role="navigation" aria-label="目录导航">
          {crumbRows.map((crumb, index) => (
            <button key={`${crumb.label}:${index}`} type="button" style={S.crumb}
              disabled={crumb.current === true}
              onMouseDown={ev => { ev.preventDefault(); if (crumb.current !== true) onCrumb(REFERENCE_SOURCE, index) }}>{crumb.label}</button>
          ))}
        </div>
      )}
      <div ref={listRef} className="dsh-at-scroll" style={S.viewport} role="listbox" aria-label="触发候选"
        onScroll={() => {
          // 随滚随记：换目录 / 关菜单时不必再赶在 DOM 卸载前取一次。
          const list = listRef.current
          if (list !== null) scrollMemory.current.set(shownPath.current, list.scrollTop)
        }}>
        {referencePending
          ? <><Skeleton /><Skeleton /><Skeleton /></>
          : sections.map(section => (
          <div key={section.label}>
            {active === null && <div style={S.sectionTitle}>{section.label}</div>}
            {section.rows.map(row => {
              const item = row.item
              const isActive = state.highlight !== null
                && state.highlight.source === row.source && state.highlight.index === row.index
              return (
                <button
                  key={`${row.source}:${row.index}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-row={`${row.source}:${row.index}`}
                  style={S.row(isActive)}
                  onMouseDown={ev => { ev.preventDefault(); onPick(row.source, row.index) }}
                  onMouseMove={isActive ? undefined : () => { onHover(row.source, row.index) }}
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
                        onMouseDown={ev => { ev.preventDefault(); ev.stopPropagation(); onPick(row.source, row.index, 'drill') }}>›</span>
                    : null}
                </button>
              )
            })}
          </div>
        ))}
        {!referencePending && visible.length === 0 && active !== null
          ? <div style={S.pending}>这一类没有候选</div>
          : null}
        {referenceGone && !referencePending
          ? <div style={S.pending}>文件与会话这次没加载出来——Esc 关掉重开一次 @ 会对它重试</div>
          : null}
      </div>
    </div>
  )
}

/**
 * 注册面板并接管 @ 菜单外观（不注册任何源——候选全部来自官方 reference 与其它插件）。
 * @param ctx - 客户端根上下文。
 */
export function apply(ctx) {
  const sessions = ctx.sessions

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

  ctx.effect(() => () => style.remove(), 'dsh-at-menu: styles')

  // 内置「插件」分类：清单取自常用提示词插件的本机路由（与窗口里「插件」那一类同一份），
  // 不依赖别的插件往 @ 里注册源；取不到清单时这一类自然为空。
  ctx.effect(() => {
    try {
      return ctx.inputTriggers.registerSource(createPluginSource())
    } catch (error) {
      console.warn('[dsh-at-menu] 插件分类注册失败（同名源已被占用）', error)
      return () => {}
    }
  }, 'dsh-at-menu: 插件 source')
}
