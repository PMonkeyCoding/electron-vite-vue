//引入相关的事件名称
import { ipcMain } from 'electron'
import { IpcEvents  } from "./ipcEvents";
import { SerialPort  } from 'serialport';

const registerIPCEvent = async():Promise<void>=>{
  //ipc事件注册函数
  var serialPort : SerialPort
  ipcMain.handle(IpcEvents.GET_PORTS_LIST,async (e,data)=>{
    return await SerialPort.list().then((ports) => {
      return JSON.stringify(ports)
    }).catch(()=>{
      return []
    })
  })
	ipcMain.handle(IpcEvents.PORT_SEND,async (e, args) => {
    if(serialPort == undefined){
      // e.sender.send(IpcEvents.PORT_SHOW,'请先打开设备')
    }else{
      serialPort.write(args)
    }
  })
  ipcMain.handle(IpcEvents.PORT_CLOSE,async (e)=>{
    if(serialPort!=undefined){
      serialPort.close((err) => {
          if (err) {
            if(err.message.includes('closing')){
              e.sender.send(IpcEvents.PORT_SHOW,'串口已关闭')
            }else{
                e.sender.send(IpcEvents.PORT_SHOW,'关闭串口时发生错误,'+err.message)
            }
        } else {
          e.sender.send(IpcEvents.PORT_SHOW,'串口已关闭')
        }
      });
    }
  })
  // 打开某个串口
  ipcMain.handle(IpcEvents.PORT_OPEN, async (event, args) => {
    const portInfo = JSON.parse(args)
    if(serialPort!=undefined){
      if(serialPort.isOpen){
        console.log('关闭来了');
        serialPort.close()
      }
    }
    serialPort = new SerialPort(
      {
          path: portInfo.serialPort,
          baudRate: portInfo.baudRate,
      })
      console.log('当前serialPort',serialPort);
      
      if(serialPort.isOpen){//当前串口已经有占用对象的串口打开
        event.sender.send(IpcEvents.PORT_SHOW,'串口已打开')
      }else{
        serialPort.open(
          (err)=> {
          if (err) {
            if(err.message.includes('opening')){
              event.sender.send(IpcEvents.PORT_SHOW,'串口已打开')
            }else{
                event.sender.send(IpcEvents.PORT_SHOW,'打开串口时发生错误,'+err.message)
            }
          } else {
            event.sender.send(IpcEvents.PORT_SHOW,'串口打开成功')
          }
        });
      }
      serialPort.on('data',(data)=>{
        console.log('监听 Data:', data.toString('utf-8'))
        event.sender.send(IpcEvents.PORT_RECV,data.toString('utf-8'))
    })
})
}
export default {registerIPCEvent}
