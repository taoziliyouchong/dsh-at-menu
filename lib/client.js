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
var inject = [
  "inputTriggers",
  "sessions",
  "slots",
  "remote",
  "remote.fileReferences",
  "remote.sessionReferenceResolver",
  "sidebarRight"
];
function baseName(path) {
  const slash = path.lastIndexOf("/");
  return slash < 0 ? path : path.slice(slash + 1);
}
function parentOf(path) {
  const slash = path.lastIndexOf("/");
  return slash < 0 ? "" : path.slice(0, slash);
}
function fileMention(path, directory) {
  const text = path.includes(" ") ? `@"${path}"` : `@${path}`;
  return directory && !text.endsWith("/") ? `${text}/` : text;
}
var CATEGORY_SOURCES = ["\u5DE5\u4F5C\u533A\u6587\u4EF6", "\u5386\u53F2\u4F1A\u8BDD", "\u5B50\u4EE3\u7406\u4F1A\u8BDD", "\u5E38\u7528\u63D0\u793A\u8BCD"];
var EMPTY_FOLDER = "\uFF08\u6B64\u6587\u4EF6\u5939\u4E3A\u7A7A\uFF09";
var ROOT_CRUMB = "__dsh_at_root__";
function folderCrumbs(query) {
  const path = query.endsWith("/") ? query.slice(0, -1) : query;
  if (path === "") return [];
  const parts = path.split("/").filter(Boolean);
  const crumbs = [{ label: "\u5DE5\u4F5C\u533A", value: ROOT_CRUMB }];
  let acc = "";
  for (const part of parts) {
    acc = acc === "" ? part : `${acc}/${part}`;
    crumbs.push({ label: `${part}/`, value: acc });
  }
  return crumbs.map((crumb, index) => index === crumbs.length - 1 ? { ...crumb, current: true } : crumb);
}
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
    // 与内置菜单同一层材质：菜单填充色 + 背景模糊，避免正文透过面板。
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
    // 滚动条常驻占位（内容不足时不出现、出现时也不挤动布局），
    // 避免"数据到了才出滚动条"造成的左右/上下抖动。
    scrollbarGutter: "stable"
  },
  groupTitle: {
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
function AtMenuPanel({ menu, headers, onPick, onCrumb, onHover, onDismiss }) {
  const state = (0, import_react.useSyncExternalStore)((fn) => menu.subscribe(fn), () => menu.getSnapshot());
  const crumbs = (0, import_react.useSyncExternalStore)((fn) => headers.subscribe(fn), () => headers.getSnapshot());
  const [active, setActive] = (0, import_react.useState)(null);
  const panelRef = (0, import_react.useRef)(null);
  const listRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!state.open) {
      if (active !== null) setActive(null);
      return;
    }
    const highlight = state.highlight;
    if (highlight !== null && active !== null && highlight.source !== active && CATEGORY_SOURCES.includes(highlight.source)) setActive(highlight.source);
  }, [state, active]);
  (0, import_react.useEffect)(() => {
    if (!state.open) return;
    const highlight = state.highlight;
    if (highlight === null || CATEGORY_SOURCES.includes(highlight.source)) return;
    const first = state.groups.find((group) => CATEGORY_SOURCES.includes(group.source) && group.status === "ready" && group.items.length > 0);
    if (first !== void 0) onHover(first.source, 0);
  }, [state]);
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
  const ours = state.open && state.hit !== null && state.hit.trigger === "@";
  (0, import_react.useLayoutEffect)(() => {
    if (ours) document.body.setAttribute("data-dsh-at-open", "");
    else document.body.removeAttribute("data-dsh-at-open");
    return () => {
      document.body.removeAttribute("data-dsh-at-open");
    };
  }, [ours]);
  if (!ours) return null;
  const groups = state.groups.filter((group) => CATEGORY_SOURCES.includes(group.source));
  const sources = groups.map((group) => group.source);
  const visible = active === null ? groups.filter((group) => !(group.status === "ready" && group.items.length === 0)) : groups.filter((group) => group.source === active);
  const crumbRows = active !== null ? crumbs.get(active) : void 0;
  const choose = (source) => {
    setActive(source);
    const group = state.groups.find((item) => item.source === source);
    if (group !== void 0 && group.status === "ready" && group.items.length > 0) onHover(source, 0);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: panelRef, style: S.panel, "data-dsh-at-menu": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: S.tabs, role: "tablist", "aria-label": "\u5019\u9009\u7C7B\u522B", children: [
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
      sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": active === source,
          style: S.tab(active === source),
          onMouseDown: (ev) => {
            ev.preventDefault();
            choose(source);
          },
          children: source
        },
        source
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
          if (crumb.current !== true) onCrumb(active, index);
        },
        children: crumb.label
      },
      `${crumb.label}:${index}`
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: listRef, className: "dsh-at-scroll", style: S.viewport, role: "listbox", "aria-label": "\u89E6\u53D1\u5019\u9009", children: visible.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      active === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.groupTitle, children: group.source }),
      group.status === "ready" && group.items.length === 0 && active !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: S.pending, children: "\u8FD9\u4E00\u7C7B\u6CA1\u6709\u5019\u9009" }) : null,
      group.status === "pending" && group.items.length === 0 && active !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {}) : null,
      group.items.map((item, index) => {
        const isActive = state.highlight !== null && state.highlight.source === group.source && state.highlight.index === index;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": isActive,
            "data-row": `${group.source}:${index}`,
            style: S.row(isActive),
            onMouseDown: (ev) => {
              ev.preventDefault();
              onPick(group.source, index);
            },
            onMouseMove: isActive ? void 0 : () => {
              onHover(group.source, index);
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
                    onPick(group.source, index, "drill");
                  },
                  children: "\u203A"
                }
              ) : null
            ]
          },
          `${group.source}:${index}`
        );
      })
    ] }, group.source)) })
  ] });
}
function apply(ctx) {
  const sessions = ctx.sessions;
  async function listFiles(session, query, signal) {
    const result = await ctx.remote.fileReferences.list(session.sessionId, query, signal);
    if (!result.ok) return [];
    return result.value;
  }
  async function listSessions(session, query, signal) {
    const result = await ctx.remote.sessionReferenceResolver.candidates(session.sessionId, query, signal);
    if (!result.ok) return [];
    const listed = sessions.list.getSnapshot().byId;
    const currentCwd = listed[session.sessionId]?.cwd;
    return result.value.map((candidate) => {
      const summary = listed[candidate.sessionId];
      const child = summary?.origin === "subagent" && summary?.parentId === session.sessionId;
      return {
        child,
        row: {
          name: candidate.label,
          ...candidate.displayTitle === void 0 ? {} : { label: candidate.displayTitle },
          ...summary?.cwd === void 0 || summary.cwd === currentCwd ? {} : { description: summary.cwd },
          icon: "session",
          value: candidate.mention
        }
      };
    });
  }
  const source = (name, order, candidates, onPick, options = {}) => ({
    trigger: "@",
    name,
    order,
    candidates,
    onPick,
    codec: { clipboardText: (ref) => ref, serialize: (ref) => Promise.resolve(ref) },
    ...options
  });
  function pathOfRef(ref) {
    const bare = ref.startsWith('@"') ? ref.slice(2, -1) : ref.startsWith("@") ? ref.slice(1) : ref;
    return bare.endsWith("/") ? bare.slice(0, -1) : bare;
  }
  function openReference(session, { ref, appearance }) {
    if (appearance !== "file" && appearance !== "folder") return false;
    const path = pathOfRef(ref);
    if (path === "") return false;
    ctx.sidebarRight.openResource(`dsh-resource://file/session/${session.sessionId}/${path}`);
    return true;
  }
  const sources = [
    source("\u5DE5\u4F5C\u533A\u6587\u4EF6", 10, async (session, { query, signal }) => {
      const files = await listFiles(session, query, signal);
      if (files.length === 0) {
        const dir = query.endsWith("/") ? query.slice(0, -1) : void 0;
        if (dir !== void 0) return [{ name: EMPTY_FOLDER, description: dir, icon: "folder", value: dir }];
        return [];
      }
      return files.map((file) => file.kind === "directory" ? {
        name: `${baseName(file.path)}/`,
        description: parentOf(file.path) === "" ? void 0 : parentOf(file.path),
        icon: "folder",
        value: file.path,
        drill: true
      } : {
        name: baseName(file.path),
        description: parentOf(file.path) === "" ? void 0 : parentOf(file.path),
        icon: "file",
        value: fileMention(file.path, false)
      });
    }, ({ candidate, action }) => {
      if (candidate.name === EMPTY_FOLDER) {
        const ref = fileMention(candidate.value, true);
        return { insert: { source: "\u5DE5\u4F5C\u533A\u6587\u4EF6", ref, label: `${baseName(candidate.value)}/`, appearance: "folder", clipboardText: ref } };
      }
      if (candidate.value === ROOT_CRUMB) return { text: "@", continue: true };
      if (action === "drill" && candidate.drill !== true) {
        return { text: fileMention(candidate.value, true), continue: true };
      }
      if (candidate.drill === true) {
        if (action === "drill") return { text: fileMention(candidate.value, true), continue: true };
        const ref = fileMention(candidate.value, true);
        return { insert: { source: "\u5DE5\u4F5C\u533A\u6587\u4EF6", ref, label: candidate.name, appearance: "folder", clipboardText: ref } };
      }
      return {
        insert: {
          source: "\u5DE5\u4F5C\u533A\u6587\u4EF6",
          ref: candidate.value,
          label: candidate.name,
          appearance: "file",
          clipboardText: candidate.value
        }
      };
    }, { header: (_session, { query }) => folderCrumbs(query), openReference }),
    source("\u5386\u53F2\u4F1A\u8BDD", 30, async (session, { query, signal }) => {
      const rows = await listSessions(session, query, signal);
      return rows.filter((row) => !row.child).map((row) => row.row);
    }, ({ candidate }) => ({
      insert: {
        source: "\u5386\u53F2\u4F1A\u8BDD",
        ref: candidate.value,
        label: candidate.label ?? candidate.name,
        appearance: "session",
        clipboardText: candidate.value
      }
    })),
    source("\u5B50\u4EE3\u7406\u4F1A\u8BDD", 40, async (session, { query, signal }) => {
      const rows = await listSessions(session, query, signal);
      return rows.filter((row) => row.child).map((row) => row.row);
    }, ({ candidate }) => ({
      insert: {
        source: "\u5B50\u4EE3\u7406\u4F1A\u8BDD",
        ref: candidate.value,
        label: candidate.label ?? candidate.name,
        appearance: "session",
        clipboardText: candidate.value
      }
    }))
  ];
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
  ctx.effect(() => {
    const registry = ctx.inputTriggers;
    const disposers = sources.map((item) => registry.registerSource(item));
    return () => {
      for (const dispose of disposers.reverse()) dispose();
      style.remove();
    };
  }, "dsh-at-menu: @ category sources");
}

		return module.exports;
	}
});
