/**
 * dsh-at-menu 宿主半边：无宿主行为。
 * 面板本体在浏览器半边（exports["./client"]），由 package.json 的 dsh.client 声明发现。
 */

/** Cordis 插件名。 */
export const name = 'dsh-at-menu'

/** 宿主插件体——本包只出界面。 */
export function apply() {}

/**
 * 需要的服务：一个都不需要。
 * 显式声明空数组，免得宿主侧「inject 声明完整」的检查把它当成没写 inject。
 */
export const inject = []
