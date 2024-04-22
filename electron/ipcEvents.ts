//我们在这个中定义ipc的事件名称，翻遍后续的事件管理
export enum IpcEvents{
    PORT_OPEN="port_open",
    GET_PORTS_LIST="get_ports_list",
    PORT_SEND="port_send",
    PORT_RECV="port_recv",
    PORT_CLOSE="port_close",
    PORT_GET="port_get",
    PORT_SHOW="port_show"
  }