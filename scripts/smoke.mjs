#!/usr/bin/env node
/**
 * 本机冒烟：不起应用、不发网络请求、不碰任何会话数据。
 *
 * 五关：
 *   1. 包结构      —— 要发布的文件都在（含已提交的 lib/client.js）
 *   2. 组合声明    —— dsh.bundle.patch 指向的文件在，里面的 insert id 等于包名
 *   3. 宿主半边    —— index.js 导出名等于包名，桩 ctx 跑 apply 不抛错
 *   4. 客户端产物  —— 外壳 id == 包名，且带上了源码里的座位与类别标记
 *   5. 伴随插件    —— invariant.js 登记的包名符合约定
 *
 * 用法：node scripts/smoke.mjs   （任一条失败退出码 1）
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const problems = []

const ok = (label, extra = '') => console.log('ok   ' + label + (extra ? '  ' + extra : ''))
const fail = (label, why) => {
  problems.push(label + ': ' + why)
  console.log('FAIL ' + label + '  ' + why)
}

/** 1. 包结构 */
const REQUIRED = [
  'index.js',
  'invariant.js',
  'cordis.patch.yml',
  'src/entry.jsx',
  'lib/client.js',
  'README.md',
  'README.en.md',
  'LICENSE',
  'scripts/smoke.mjs',
]
const missing = REQUIRED.filter((rel) => !existsSync(join(root, rel)))
if (missing.length > 0) fail('结构', '缺 ' + missing.join('、'))
else ok('结构', REQUIRED.length + ' 个必需文件齐全')

/** 2. 组合声明：dsh plugin add 靠这一条把包接进层栈 */
const patchRel = pkg.dsh && pkg.dsh.bundle && pkg.dsh.bundle.patch
if (!patchRel) fail('组合声明', 'package.json 没声明 dsh.bundle.patch')
else if (!existsSync(join(root, patchRel))) fail('组合声明', 'dsh.bundle.patch 指向的文件不存在：' + patchRel)
else {
  const patch = readFileSync(join(root, patchRel), 'utf8')
  if (!patch.includes('id: ' + pkg.name)) fail('组合声明', patchRel + ' 里没有 id: ' + pkg.name)
  else if (!patch.includes('name: ' + pkg.name)) fail('组合声明', patchRel + ' 里没有 name: ' + pkg.name)
  else ok('组合声明', 'dsh.bundle.patch → ' + patchRel + '（id 与 name 都是 ' + pkg.name + '）')
}
if (!pkg.dsh || !pkg.dsh.client || pkg.dsh.client.platform !== 'web') fail('组合声明', 'dsh.client.platform 不是 web')
if (!pkg.exports || pkg.exports['./client'] !== './lib/client.js') fail('组合声明', 'exports["./client"] 没指向 ./lib/client.js')
if (pkg.files && !pkg.files.includes('lib/client.js')) fail('组合声明', 'files 里没有 lib/client.js，装出来的包界面不会加载')

/** 3. 宿主半边：本包只管挂界面，apply 不该有副作用 */
const mod = await import(pathToFileURL(join(root, 'index.js')).href)
if (mod.name !== pkg.name) fail('宿主半边', 'index.js 导出的 name 是 ' + mod.name + '，不等于包名 ' + pkg.name)
else ok('宿主半边', 'name = ' + mod.name)
if (!Array.isArray(mod.inject)) fail('宿主半边', 'inject 不是数组')
try {
  mod.apply({})
} catch (error) {
  fail('宿主半边', 'apply 抛错：' + error.message)
}

/** 4. 客户端产物：外壳 id 必须等于包名，且源码里的关键标记要真的进产物 */
const client = readFileSync(join(root, 'lib', 'client.js'), 'utf8')
const idMatch = /^\s*id:\s*"([^"]+)"/m.exec(client)
if (!idMatch) fail('客户端产物', '外壳里找不到 id')
else if (idMatch[1] !== pkg.name) fail('客户端产物', '外壳 id 是 ' + idMatch[1] + '，应等于包名 ' + pkg.name)
else if (!client.includes('conversation.input.overlay')) fail('客户端产物', '产物里没有座位 conversation.input.overlay（源码改了但没重新构建）')
else if (!client.includes('registerSource')) fail('客户端产物', '产物里没有 registerSource（源码改了但没重新构建）')
else if (!client.includes('data-dsh-at-open')) fail('客户端产物', '产物里没有内置菜单隐藏标记 data-dsh-at-open')
else ok('客户端产物', 'id=' + pkg.name + '，' + Buffer.byteLength(client, 'utf8') + ' 字节')

/** 5. 伴随插件 */
const companion = await import(pathToFileURL(join(root, 'invariant.js')).href)
if (companion.name !== pkg.name + '-invariant') fail('伴随插件', '导出的 name 是 ' + companion.name + '，应为 ' + pkg.name + '-invariant')
else if (!Array.isArray(companion.inject) || !companion.inject.includes('invariants')) fail('伴随插件', 'inject 里没有 invariants')
else {
  const registered = []
  const invariantCtx = { invariants: { register: (name) => registered.push(name) } }
  await companion.apply(invariantCtx)
  if (registered[0] !== pkg.name) fail('伴随插件', '登记的包名是 ' + registered[0] + '，应为 ' + pkg.name)
  else ok('伴随插件', '登记 ' + pkg.name)
}

console.log('')
if (problems.length > 0) {
  console.error('冒烟失败 ' + problems.length + ' 项')
  process.exit(1)
}
console.log('冒烟通过')
