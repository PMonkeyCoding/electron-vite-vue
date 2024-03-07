// /// <reference types="vite-plugin-electron/electron-env" />

// declare namespace NodeJS {
//   interface ProcessEnv {
//     VSCODE_DEBUG?: 'true'
//     DIST_ELECTRON: string
//     DIST: string
//     /** /dist/ or /public/ */
//     VITE_PUBLIC: string
//   }
// }

// declare module 'element-plus/dist/locale/zh-cn.mjs';
// // // Used in Renderer process, expose in `preload.ts`
// interface Window {
//   ipcRenderer: import('electron').IpcRenderer
// }

/// <reference types="vite-plugin-electron/electron-env" />

// declare namespace NodeJS {
//   interface ProcessEnv {
//     /**
//      * The built directory structure
//      *
//      * ```tree
//      * ├─┬─┬ dist
//      * │ │ └── index.html
//      * │ │
//      * │ ├─┬ dist-electron
//      * │ │ ├── main.js
//      * │ │ └── preload.js
//      * │
//      * ```
//      */
//     VSCODE_DEBUG?: 'true'
//     //     DIST_ELECTRON: string
//     //     DIST: string
//     //     /** /dist/ or /public/ */
//     //     VITE_PUBLIC: string
//     DIST: string
//     /** /dist/ or /public/ */
//     VITE_PUBLIC: string
//   }
// }

// // Used in Renderer process, expose in `preload.ts`
// interface Window {
//   ipcRenderer: import('electron').IpcRenderer
// }
