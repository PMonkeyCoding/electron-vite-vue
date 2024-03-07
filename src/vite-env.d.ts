/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    VSCODE_DEBUG?: 'true'
    //     DIST_ELECTRON: string
    //     DIST: string
    //     /** /dist/ or /public/ */
    //     VITE_PUBLIC: string
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// interface Window {
//   luckysheet:any
// }
declare module 'luckyexcel'

// Used in Renderer process, expose in `preload.ts`
declare interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
