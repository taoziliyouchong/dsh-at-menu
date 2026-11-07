# dsh-at-menu

[中文](README.md) | **English**

When the `@` reference menu opens, a row of category tabs appears on top of it: pick a tab to see only
that category instead of scrolling through one mixed list.

## Categories

Only the three kinds the DSH conversation UI already has data for are built in:

| Category | Source |
| --- | --- |
| Workspace files | The workspace file-reference API; files and folders share one category, and a folder row drills into the directory with the trailing arrow (or Tab), with breadcrumbs to go back up |
| Past sessions | Plain sessions from the session-reference candidates |
| Subagent sessions | The rows marked as subagents in the same candidate list |

Skills, plugins, saved prompts, sidebar references and so on are **not** built in: each plugin
registers its own source through
`ctx.inputTriggers.registerSource({ trigger: '@', name: 'name', candidates, onPick })`,
and the panel turns every registered source into a tab — `name` is the tab label.

## Install

```sh
dsh plugin --profile desktop add github:taoziliyouchong/dsh-at-menu
```

Once published to npm, this also works:

```sh
dsh plugin --profile desktop add dsh-at-menu
```

Restart DSH afterwards. Replace `desktop` with your own profile name if you use another one.

Requirements: DSH 0.2.1 or later, desktop app or `dsh web` (needs the @ menu of the conversation composer; verified on 0.2.2-rc.1).
Compatible with DSH 0.2.1-alpha.3 through 0.2.2-rc.1 (the highest version verified locally); later versions are untested.

## Works alongside the built-in @ menu

Keep the built-in `ui-reference` enabled; the two run together. It owns `source "reference"`, which
handles two things this plugin does not:

- file reference cards created by dropping files onto the composer (or the add-file button) are turned
  into text by it — without it, sending fails with
  `slash: no serializer for reference source "reference"`;
- the decoration and click-to-open on `@path` mentions in past messages.

This panel only takes over the look of the @ menu: the built-in's candidate group is not shown here,
and the keyboard highlight is pushed back to a visible category when it lands on it.

## How it works

- The panel mounts at the list slot `conversation.input.overlay`, the same seat as the built-in menu;
  an injected style hides the built-in menu only while the @ menu is open
  (`body[data-dsh-at-open] [data-trigger-menu]`), so the `/` slash menu keeps its native look.
- Data, keyboard handling (up/down, Enter, Esc) and insertion stay owned by the built-in controller;
  the panel only subscribes to its menu store and feeds pick / hover / dismiss back.
- Mentions go into the draft as plain text (`@path`, `@[title](dsh-session:…)`), and the existing
  text-parsing chain on the host side keeps working.
- No network access, nothing uploaded.

## Known limits

- With the built-in `ui-reference` enabled, its merged "files + sessions" group is not shown in this panel (the keyboard skips it too); use the built-in menu for that merged view.
- Tabs only show sources registered in `CATEGORY_SOURCES`; a plugin that registers a new source name
  needs that line in `src/entry.jsx` edited before its tab shows up.
- This plugin only changes the look and grouping of the @ menu; it does not change the insertion format.

## Development

```sh
npm install
npm run build:client    # regenerate lib/client.js from src/entry.jsx
npm run check:client    # verify the committed artifact matches the source
npm run check           # syntax
npm run smoke           # structure / bundle declaration / host / artifact / companion
```

`lib/client.js` is a build artifact committed to the repository: installing from GitHub does not run
a build, and without it the UI does not load. Keep `react` and `react/jsx-runtime` external (the DSH
client module table provides them); the `id` inside the `window.__ModuleLoader__.load({ id, factory })`
envelope must equal the package name.

Source layout:

- `src/entry.jsx` — the browser half (panel, tabs, source registration)
- `index.js` — the host half (no host behavior; exists so the plugin loader can load the package)

## Feedback

- Open an issue: https://github.com/taoziliyouchong/dsh-at-menu/issues
- Or reach me on QQ: **2171960697** (mention which plugin you installed when adding the contact).

Please include: DSH version, plugin version, the exact error text, and a screenshot.

## License

MIT
