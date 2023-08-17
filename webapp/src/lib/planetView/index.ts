import type { InitOptions } from './view'
import View from './view'

// init three.js planet view
export function initView(canvas: HTMLCanvasElement, options: InitOptions = {}): View {
  return new View(canvas, options)
}