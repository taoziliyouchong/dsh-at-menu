window.__ModuleLoader__.load({
	id: "dsh-at-menu",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/entry.jsx
var entry_exports = {};
__export(entry_exports, {
  AtMenuPanel: () => AtMenuPanel,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(entry_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var inject = ["inputTriggers", "sessions", "slots"];
var REFERENCE_SOURCE = "reference";
var S = {
  panel: {
    position: "absolute",
    bottom: "calc(100% + 4px)",
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    maxHeight: 400,
    overflow: "hidden",
    padding: 4,
    border: "0.5px solid var(--dsw-alias-border-l1, rgba(127,127,127,.25))",
    borderRadius: 10,
    background: "var(--dsw-menu-surface-fill, Canvas)",
    backdropFilter: "var(--dsw-menu-backdrop-filter, blur(20px))",
    boxShadow: "var(--dsw-elevation-prominent, 0 8px 24px rgba(0,0,0,.18))",
    color: "var(--dsw-alias-label-primary, CanvasText)",
    fontSize: 13
  },
  tabs: {
    flex: "none",
    display: "flex",
    gap: 2,
    padding: "3px 3px 5px",
    marginBottom: 2,
    overflowX: "auto",
    borderBottom: "0.5px solid var(--dsw-alias-border-l1, rgba(127,127,127,.25))"
  },
  tab: (active) => ({
    flex: "0 0 auto",
    padding: "2px 8px",
    border: "none",
    borderRadius: 4,
    background: active ? "var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.16))" : "transparent",
    color: active ? "var(--dsw-alias-label-primary, CanvasText)" : "var(--dsw-alias-label-tertiary, GrayText)",
    fontFamily: "inherit",
    fontSize: 11,
    lineHeight: "16px",
    whiteSpace: "nowrap",
    cursor: "pointer"
  }),
  viewport: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    overflowY: "auto",
    scrollbarGutter: "stable"
  },
  sectionTitle: {
    padding: "6px 8px",
    fontSize: 11,
    lineHeight: "15px",
    color: "var(--dsw-alias-label-tertiary, GrayText)"
  },
  row: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    width: "100%",
    minHeight: 34,
    padding: "6px 8px",
    border: "none",
    borderRadius: 6,
    background: active ? "var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.16))" : "transparent",
    color: "inherit",
    font: "inherit",
    fontSize: 13,
    lineHeight: "20px",
    textAlign: "left",
    cursor: "pointer"
  }),
  name: { flex: "none", maxWidth: "40%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  alias: { flex: "none", maxWidth: "20%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--dsw-alias-label-tertiary, GrayText)", fontSize: 12, lineHeight: "18px" },
  description: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right", color: "var(--dsw-alias-label-tertiary, GrayText)", fontSize: 12, lineHeight: "18px" },
  icon: { flex: "none", display: "inline-flex", width: 14, height: 14, alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-menu-icon, GrayText)" },
  pending: { padding: "10px 8px", color: "var(--dsw-alias-label-tertiary, GrayText)", fontSize: 12 },
  skeletonRow: { display: "flex", alignItems: "center", boxSizing: "border-box", minHeight: 34, padding: "6px 8px" },
  skeletonBar: (width) => ({ height: 18, width, borderRadius: 4, background: "var(--dsw-alias-bg-skeleton, rgba(127,127,127,.18))" }),
  drill: { flex: "none", marginLeft: 4, color: "var(--dsw-alias-label-tertiary, GrayText)" },
  crumbs: { display: "flex", alignItems: "center", gap: 2, padding: "0 4px 4px", overflowX: "auto" },
  crumb: {
    border: "none",
    background: "transparent",
    color: "var(--dsw-alias-label-tertiary, GrayText)",
    fontFamily: "inherit",
    fontSize: 11,
    lineHeight: "16px",
    padding: "2px 5px",
    borderRadius: 4,
    cursor: "pointer"
  }
};
function RowIcon({ kind }) {
  const path = kind === "folder" ? "M1.8 4.2h3.4l1.2 1.3h5.8v6.1H1.8z" : kind === "session" ? "M2 3.6h10v6.1H6.6L4.2 11.7V9.7H2z" : "M4 1.9h4.4L10.9 4.4v7.7H4z";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: "14",
      height: "14",
      viewBox: "0 0 14 14",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.1",
      strokeLinejoin: "round",
      "aria-hidden": true,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: path }),
        kind === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8.4 1.9v2.5h2.5" }) : null
      ]
    }
  );
}
function Skeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "status", "aria-label": "\u6B63\u5728\u52A0\u8F7D", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.skeletonRow, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-at-skelbar", style: S.skeletonBar("42%") }) }) });
}
var PLUGIN_ROUTES = ["/dsh-prompt-shelf/api/plugins"];
var pluginFeed = { at: 0, items: [] };
async function loadPluginItems() {
  const now = Date.now();
  if (now - pluginFeed.at < 2e3) return pluginFeed.items;
  let items = [];
  for (const route of PLUGIN_ROUTES) {
    try {
      const url = new URL(route.replace(/^\/+/, ""), document.baseURI);
      const res = await fetch(url.pathname, { headers: { accept: "application/json" } });
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      if (data && data.ok === true && Array.isArray(data.items)) {
        items = data.items;
        break;
      }
    } catch {
    }
  }
  pluginFeed = { at: now, items };
  return items;
}
function createPluginSource() {
  return {
    trigger: "@",
    name: "\u63D2\u4EF6",
    // 10：排在官方 reference 之后、常用提示词（20）之前，与窗口里的类别顺序一致。
    order: 10,
    async candidates(_session, req) {
      const keyword = String(req.query || "").trim().toLowerCase();
      return (await loadPluginItems()).filter((item) => item && typeof item.name === "string" && item.name.trim() !== "").filter((item) => !keyword || item.name.toLowerCase().includes(keyword)).slice(0, 40).map((item) => ({
        name: item.name,
        description: item.kind === "personal" ? "\u4E2A\u4EBA\u63D2\u4EF6" : "\u63D2\u4EF6",
        value: item.name
      }));
    },
    onPick(pick) {
      const name = String(pick.candidate.value || "");
      return name ? { text: "@" + name } : void 0;
    }
  };
}
function project(groups) {
  const rows = [];
  for (const group of groups) {
    if (group.items.length === 0) continue;
    for (let index = 0; index < group.items.length; index += 1) {
      const item = group.items[index];
      rows.push({
        source: group.source,
        index,
        item,
        label: item.section === void 0 ? group.source : item.section
      });
    }
  }
  const labels = [];
  for (const row of rows) if (!labels.includes(row.label)) labels.push(row.label);
  return { rows, labels };
}
function rowAtViewportTop(list) {
  const rows = list.querySelectorAll("[data-row]");
  if (rows.length === 0) return null;
  const top = list.getBoundingClientRect().top;
  let picked = rows[rows.length - 1];
  for (const el of rows) {
    if (el.getBoundingClientRect().top < top - 1) continue;
    picked = el;
    break;
  }
  const key = picked.getAttribute("data-row");
  if (key === null) return null;
  const split = key.lastIndexOf(":");
  const index = Number(key.slice(split + 1));
  return Number.isInteger(index) ? { source: key.slice(0, split), index } : null;
}
function AtMenuPanel({ menu, headers, onPick, onCrumb, onHover, onDismiss }) {
  const state = (0, import_react.useSyncExternalStore)((fn) => menu.subscribe(fn), () => menu.getSnapshot());
  const crumbs = (0, import_react.useSyncExternalStore)((fn) => headers.subscribe(fn), () => headers.getSnapshot());
  const [active, setActive] = (0, import_react.useState)(null);
  const panelRef = (0, import_react.useRef)(null);
  const listRef = (0, import_react.useRef)(null);
  const scrollMemory = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const shownPath = (0, import_react.useRef)("");
  const restore = (0, import_react.useRef)(null);
  const prevOpen = (0, import_react.useRef)(false);
  const prevPath = (0, import_react.useRef)("");
  (0, import_react.useEffect)(() => {
    if (!state.open) setActive(null);
  }, [state.open]);
  const { rows, labels } = project(state.groups);
  const visible = active === null ? rows : rows.filter((row) => row.label === active);
  (0, import_react.useEffect)(() => {
    if (!state.open) return;
    const highlight = state.highlight;
    if (highlight === null) return;
    const shown = visible.some((row) => row.source === highlight.source && row.index === highlight.index);
    if (shown) return;
    const first = visible[0];
    if (first !== void 0) onHover(first.source, first.index);
  }, [state, active, visible]);
  (0, import_react.useEffect)(() => {
    if (!state.open) return;
    const onPointerDown = (ev) => {
      if (!(ev.target instanceof Node)) return;
      if (panelRef.current?.contains(ev.target)) return;
      const composerCard = panelRef.current?.closest("[data-composer-card]");
      if (composerCard?.contains(ev.target)) return;
      onDismiss();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [state.open, onDismiss]);
  (0, import_react.useEffect)(() => {
    const highlight = state.open ? state.highlight : null;
    if (highlight === null) return;
    listRef.current?.querySelector(`[data-row="${highlight.source}:${highlight.index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [state]);
  const referenceGroup = state.groups.find((group) => group.source === REFERENCE_SOURCE);
  const referencePending = referenceGroup !== void 0 && referenceGroup.status === "pending" && referenceGroup.items.length === 0;
  const referenceGone = referenceGroup === void 0 && state.groups.length > 0;
  const ours = state.open && state.hit !== null && state.hit.trigger === "@";
  (0, import_react.useLayoutEffect)(() => {
    if (ours) document.body.setAttribute("data-dsh-at-open", "");
    else document.body.removeAttribute("data-dsh-at-open");
    return () => {
      document.body.removeAttribute("data-dsh-at-open");
    };
  }, [ours]);
  const pathKey = (() => {
    const hit = state.hit;
    if (hit === null) return "";
    const query = hit.query;
    const slash = query.lastIndexOf("/");
    return slash < 0 ? "" : query.slice(0, slash + 1);
  })();
  (0, import_react.useEffect)(() => {
    if (!ours) {
      prevOpen.current = false;
      prevPath.current = pathKey;
      restore.current = null;
      return;
    }
    if (!prevOpen.current) {
      prevOpen.current = true;
      prevPath.current = pathKey;
      const saved = pathKey === "" ? 0 : scrollMemory.current.get(pathKey);
      restore.current = { key: pathKey, top: saved ?? 0 };
      return;
    }
    if (prevPath.current !== pathKey) {
      prevPath.current = pathKey;
      restore.current = { key: pathKey, top: scrollMemory.current.get(pathKey) ?? 0 };
    }
  }, [ours, pathKey]);
  (0, import_react.useEffect)(() => {
    const pending = restore.current;
    if (!ours || pending === null) return;
    if (referenceGroup !== void 0 && referenceGroup.status === "pending") return;
    const list = listRef.current;
    if (list === null || visible.length === 0) return;
    restore.current = null;
    shownPath.current = pending.key;
    list.scrollTop = pending.top;
    scrollMemory.current.set(pending.key, list.scrollTop);
    const row = rowAtViewportTop(list);
    if (row !== null) onHover(row.source, row.index);
  }, [ours, pathKey, referenceGroup, visible, onHover]);
  if (!ours) return null;
  const crumbRows = crumbs.get(REFERENCE_SOURCE);
  const choose = (label) => {
    setActive(label);
    const first = label === null ? null : rows.find((row) => row.label === label);
    if (first !== void 0 && first !== null) onHover(first.source, first.index);
  };
  const sections = [];
  if (visible.length > 0) {
    for (const row of visible) {
      const last = sections[sections.length - 1];
      if (last !== void 0 && last.label === row.label) last.rows.push(row);
      else sections.push({ label: row.label, rows: [row] });
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: panelRef, style: S.panel, "data-dsh-at-menu": "", children: [
    !referencePending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.tabs, role: "tablist", "aria-label": "\u5019\u9009\u7C7B\u522B", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": active === null,
          style: S.tab(active === null),
          onMouseDown: (ev) => {
            ev.preventDefault();
            choose(null);
          },
          children: "\u5168\u90E8"
        }
      ),
      labels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": active === label,
          style: S.tab(active === label),
          onMouseDown: (ev) => {
            ev.preventDefault();
            choose(label);
          },
          children: label
        },
        label
      ))
    ] }),
    crumbRows !== void 0 && crumbRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.crumbs, role: "navigation", "aria-label": "\u76EE\u5F55\u5BFC\u822A", children: crumbRows.map((crumb, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        style: S.crumb,
        disabled: crumb.current === true,
        onMouseDown: (ev) => {
          ev.preventDefault();
          if (crumb.current !== true) onCrumb(REFERENCE_SOURCE, index);
        },
        children: crumb.label
      },
      `${crumb.label}:${index}`
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        ref: listRef,
        className: "dsh-at-scroll",
        style: S.viewport,
        role: "listbox",
        "aria-label": "\u89E6\u53D1\u5019\u9009",
        onScroll: () => {
          const list = listRef.current;
          if (list !== null) scrollMemory.current.set(shownPath.current, list.scrollTop);
        },
        children: [
          referencePending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {})
          ] }) : sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            active === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.sectionTitle, children: section.label }),
            section.rows.map((row) => {
              const item = row.item;
              const isActive = state.highlight !== null && state.highlight.source === row.source && state.highlight.index === row.index;
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  type: "button",
                  role: "option",
                  "aria-selected": isActive,
                  "data-row": `${row.source}:${row.index}`,
                  style: S.row(isActive),
                  onMouseDown: (ev) => {
                    ev.preventDefault();
                    onPick(row.source, row.index);
                  },
                  onMouseMove: isActive ? void 0 : () => {
                    onHover(row.source, row.index);
                  },
                  children: [
                    typeof item.icon === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.icon, "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowIcon, { kind: item.icon }) }) : null,
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.name, children: item.label ?? item.name }),
                    item.label !== void 0 && item.label.toLowerCase() !== item.name.toLowerCase() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.alias, children: item.name }) : null,
                    item.description !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: S.description, children: item.description }) : null,
                    item.drill === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "span",
                      {
                        style: S.drill,
                        role: "button",
                        "aria-label": "\u8FDB\u5165\u6587\u4EF6\u5939",
                        onMouseDown: (ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          onPick(row.source, row.index, "drill");
                        },
                        children: "\u203A"
                      }
                    ) : null
                  ]
                },
                `${row.source}:${row.index}`
              );
            })
          ] }, section.label)),
          !referencePending && visible.length === 0 && active !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pending, children: "\u8FD9\u4E00\u7C7B\u6CA1\u6709\u5019\u9009" }) : null,
          referenceGone && !referencePending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pending, children: "\u6587\u4EF6\u4E0E\u4F1A\u8BDD\u8FD9\u6B21\u6CA1\u52A0\u8F7D\u51FA\u6765\u2014\u2014Esc \u5173\u6389\u91CD\u5F00\u4E00\u6B21 @ \u4F1A\u5BF9\u5B83\u91CD\u8BD5" }) : null
        ]
      }
    )
  ] });
}
function apply(ctx) {
  const sessions = ctx.sessions;
  const style = document.createElement("style");
  style.dataset.dshAtMenu = "";
  style.textContent = [
    "body[data-dsh-at-open] [data-trigger-menu]{display:none!important}",
    "[data-dsh-at-menu] .dsh-at-scroll::-webkit-scrollbar{width:6px}",
    "[data-dsh-at-menu] .dsh-at-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.35));border-radius:3px;border:2px solid transparent;background-clip:padding-box}",
    "[data-dsh-at-menu] .dsh-at-scroll::-webkit-scrollbar-track{background:transparent;margin:12px 0}",
    "@keyframes dsh-at-skel{0%{opacity:1}40%{opacity:.6}80%,100%{opacity:1}}",
    "[data-dsh-at-menu] .dsh-at-skelbar{animation:dsh-at-skel 2s cubic-bezier(.36,0,.64,1) infinite}"
  ].join("\n");
  document.head.appendChild(style);
  ctx.slots.inject("conversation.input.overlay", () => ctx.slots.register({
    name: "conversation.input.overlay",
    id: "dsh-at-panel",
    order: 5,
    inject: (sessionId) => {
      const actx = sessions.scope(sessionId);
      if (actx === void 0) throw new Error(`dsh-at-menu: session "${String(sessionId)}" resolved no scope`);
      const controller = ctx.inputTriggers.sessionOf(actx);
      return {
        menu: controller.menu,
        headers: controller.headers,
        onPick: (sourceName, index, action) => {
          controller.pick(sourceName, index, action);
        },
        onCrumb: (sourceName, index) => {
          controller.pickCrumb(sourceName, index);
        },
        onHover: (sourceName, index) => {
          controller.hover(sourceName, index);
        },
        onDismiss: () => {
          controller.dismiss();
        }
      };
    }
  }, AtMenuPanel));
  ctx.effect(() => () => style.remove(), "dsh-at-menu: styles");
  ctx.effect(() => {
    try {
      return ctx.inputTriggers.registerSource(createPluginSource());
    } catch (error) {
      console.warn("[dsh-at-menu] \u63D2\u4EF6\u5206\u7C7B\u6CE8\u518C\u5931\u8D25\uFF08\u540C\u540D\u6E90\u5DF2\u88AB\u5360\u7528\uFF09", error);
      return () => {
      };
    }
  }, "dsh-at-menu: \u63D2\u4EF6 source");
}

		return module.exports;
	}
});
