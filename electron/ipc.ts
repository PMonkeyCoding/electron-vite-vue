//引入相关的事件名称
import { ipcMain } from 'electron'
import { IpcEvents } from "./ipcEvents";
import { ByteLengthParser, SerialPort  } from 'serialport';
//ipc事件注册函数
let port : SerialPort
const registerIPCEvent = async():Promise<void>=>{
  console.log('registerIPCEvent')
  ipcMain.handle(IpcEvents.GET_PORTS_LIST,async (e,data)=>{
    console.log('hello',data);
    return await SerialPort.list().then((ports) => {
      return JSON.stringify(ports)
    }).catch(()=>{
      return []
    })
    // e.sender.send(IpcEvents.PORT_RECV,'hahahahaha recv')
  })
	ipcMain.handle(IpcEvents.PORT_SEND,async (e)=>{
    console.log('thank you')
    return 'thx'
  })
  // ipcMain.on(IpcEvents.PORT_RECV,async (e)=>{
  //   console.log('hello')
  // })
  ipcMain.on(IpcEvents.PORT_CLOSE,async (e)=>{
    console.log('hello')
    return await SerialPort.list().then((ports) => {
      console.log('ports',ports);
      
      return JSON.stringify(ports)
    }).catch(()=>{
      return []
    })
  })
  // 打开某个串口
  ipcMain.handle(IpcEvents.PORT_OPEN, async (event, args) => {
    const portInfo = JSON.parse(args)
    // console.log('args',args);
    
  port = new SerialPort(
      {
          path: portInfo.serialPort,
          baudRate: portInfo.baudRate,
          autoOpen:true
      },(err)=>{
        if(err){
          return true
        }else{
          return false; //打开成功
        }
      });
      // if(port){
      //   port.on('data',(data)=>{
      //     console.log('get Data:', data.toString('utf-8'))
      //   })
      //   return true
      // }else{
      //   return false
      // }
      port.on("open", (err) => { 
          if(err){
            console.log('open error') 
          }
          port.on('readable', function () {
            console.log(' readable Data:', port.read())
          })
          
          // Switches the port into "flowing mode"
          port.on('data', function (data) {
            console.log('Data:', data)
          })
          port.write('[0]')
          port.write(Buffer.from('[0]'))
          });
      // port.on('data',(data)=>{
      //   console.log('get Data:', data.toString('utf-8'))
      //   try {
      //     // 获取的data是一个Buffer
      //     // 1.将 Buffer 转换为字符串 dataString.toString('utf-8')
      //     let weight = data.toString('utf-8')
      //     // 2.将字符串分割转换成数组，取数组的第一个值.split('    ')[0]
      //     weight = weight.split('    ')[0]
      //     // 3.将取的值 去掉前后空格
      //     weight = weight.trim()
      //     // 4.最后转换成数字,获取到的数字就是重量
      //     weight = Number(weight)
      //     console.log('获取到数据：'+ weight);
      // } catch (err) {
      //   console.error(`
      //     获取报错：${err}
      //     获取到的Buffer: ${data}
      //     Buffer转换后的值：${data.toString('utf-8')}
      //   `);
      // }
      // })
      // setTimeout(() => {
      //   console.log('exe write');
        
      //   port.write('[0]')
      //   port.write(Buffer.from('[0]'))
      // }, 3000);
    //   port.on("open", () => { 
    //     console.log('open')
    //   });
    //     //     console.log('open');
    //     // });
    
    // })
      // ,
      // (err) => {
      //     console.log('open-serialport err', err);
      //     if (err) {
      //       console.log('1111');
            
      //       return 'error'
      //         // event.reply("open-serialport", {
      //         //     hasError: true,
      //         //     ...args,
      //         //     message: err,
      //         // });
      //     } else {
      //       console.log('2222222');
            
      //         // event.reply("open-serialport", args);
      //         // ports.push(serialport);
      //         return 'ok'
      //     }
      // }
});
  // 根据说明书数据量字节17一次传输 也可以通过其他方式截取
//   const parser = serialport.pipe(new ByteLengthParser({ length: 17 }));
  // parser.on("data", (data) => {
  //     // xxxxxxx 
  //     console.log('data',data);
  // });
  // serialport.on("open", () => { 
  //     console.log('open');
  // });
}
export default {registerIPCEvent}
