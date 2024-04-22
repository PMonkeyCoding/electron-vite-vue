//引入相关的事件名称
import { ipcMain } from 'electron'
import { IpcEvents  } from "./ipcEvents";
import { SerialPort  } from 'serialport';

const registerIPCEvent = async():Promise<void>=>{
  //ipc事件注册函数
  var serialPort : SerialPort
  console.log('registerIPCEvent')
  ipcMain.handle(IpcEvents.GET_PORTS_LIST,async (e,data)=>{
    console.log('hello',data);
    return await SerialPort.list().then((ports) => {
      return JSON.stringify(ports)
    }).catch(()=>{
      return []
    })
  })
	ipcMain.handle(IpcEvents.PORT_SEND,async (e, args) => {
    console.log('send  yyy',args)
    console.log('port',serialPort);
    if(serialPort == undefined){
      e.sender.send(IpcEvents.PORT_SHOW,'请先打开设备')
    }else{
      serialPort.write(args)
    }
  })
  ipcMain.handle(IpcEvents.PORT_CLOSE,async (e)=>{
    console.log('close port',serialPort)
    if(serialPort!=undefined){
    serialPort.close((err) => {
      if (err) {
        e.sender.send(IpcEvents.PORT_SHOW,'关闭串口时发生错误,'+err.message)
      } else {
        e.sender.send(IpcEvents.PORT_SHOW,'串口已关闭')
      }
    });
  }
  })
  // 打开某个串口
  ipcMain.handle(IpcEvents.PORT_OPEN, async (event, args) => {
    const portInfo = JSON.parse(args)
    console.log('serialPort',serialPort);
if(serialPort!=undefined){
    if(serialPort.isOpen){
      if(serialPort.path == portInfo.serialPort){
        event.sender.send(IpcEvents.PORT_SHOW,'串口已打开')
        return
      }
    }
    serialPort.close((err) => {
      serialPort = new SerialPort(
        {
            path: portInfo.serialPort,
            baudRate: portInfo.baudRate,
        })
        serialPort.open((err)=> {
          if (err) {
            event.sender.send(IpcEvents.PORT_SHOW,'打开串口时发生错误,'+err.message)
          } else {
            event.sender.send(IpcEvents.PORT_SHOW,'串口打开成功')
          }
        });
        serialPort.on('data',(data)=>{
          event.sender.send(IpcEvents.PORT_RECV,data.toString('utf-8'))
          console.log('get Data:', data.toString('utf-8'))
      })
    });
  }else{
    serialPort = new SerialPort(
      {
          path: portInfo.serialPort,
          baudRate: portInfo.baudRate,
      })
      serialPort.open((err)=> {
        if (err) {
          event.sender.send(IpcEvents.PORT_SHOW,'打开串口时发生错误,'+err.message)
        } else {
          event.sender.send(IpcEvents.PORT_SHOW,'串口打开成功')
        }
      });
      serialPort.on('data',(data)=>{
        event.sender.send(IpcEvents.PORT_RECV,data.toString('utf-8'))
        console.log('get Data:', data.toString('utf-8'))
    })
    }
})
}
export default {registerIPCEvent}
