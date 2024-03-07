import { onUnmounted } from 'vue'
 
//这儿要注意引入的ipc事件的地址，然后无脑粘贴
import { IpcEvents } from '../../electron/ipcEvents'
 
type IpcRendererListener = (event: any, ...args: any[]) => void
 
 
//用于监听主进程向渲染进行双向的通信
export default function useIpcRendererOn(
  channel: IpcEvents,
  listener: IpcRendererListener
): any {
  const ipc = window.ipcRenderer
 
  onUnmounted(() => {
    ipc.removeListener(channel, listener)
  })
 
  return window.ipcRenderer.on(channel, listener)
}