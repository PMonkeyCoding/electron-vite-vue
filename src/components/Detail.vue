<script setup lang="ts">
import {  ref, reactive, onMounted, onUnmounted } from 'vue';
import { IpcEvents } from '../../electron/ipcEvents';
import useIpcRendererOn from "../hook/useIpcRendererOn";
import { Refresh, Plus, Finished, Upload, Download } from '@element-plus/icons-vue';
import { exportExcel } from './export/export' //'./export/exportExcel'
import { isFunction } from './export/utils'
// import { ElMessage } from 'element-plus'
import { ElMessage } from 'element-plus';
import LuckyExcel from "luckyexcel"

const currentLuckySheet = window?.luckysheet
const currentRecv = ref('')
// const props = defineProps(['msg'])
// onBeforeMount(() => {
//   msg.value = props.msg || ''
// })
const dialogVisible = ref(false)//弹窗是否可见
const openBtnAble = ref(true)//按钮是否可用
interface PortInfo {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
}

/**
 * 处理excel文件上传
 */
//点击导入模板文件
const importFile = (()=>{
  upload.open = true
  upload.title = "模板文件导入";
})
const ExportFile = ()=>{
  let data = currentLuckySheet?.toJson()
  exportExcel(currentLuckySheet.getluckysheetfile(),data.name)
}
/*** 导入模板文件 */
const upload = reactive({
  // 是否显示弹出层（
   open: false,
   // 弹出层标题
   title: "模板文件",
   // 是否禁用上传
   isUploading: false,
});
/**文件超限的提示 */
const handleExceed = () => {
   ElMessage.error('仅支持上传一份文件,请先删除已上传的文件')
}
/** 点击确认的二次校验 */
function submitFileForm() {
  //  data['rows'] = currentUpFileData
  if(tmpFile){
    isFunction(currentLuckySheet?.destroy) && currentLuckySheet?.destroy();
    currentLuckySheet.create({
      container: 'luckysheet',
      lang:'zh',
      data:tmpUpFileData.sheets,
      title:getFileName(tmpFile.name),
      name:getFileName(tmpFile.name),
      showinfobar: false,
      showstatisticBar: false,
      userInfo:'XR-TECH',
      hook: {
      cellMousedown:function(r,c,oldValue,newValue,isRefresh){
        console.log('r',r);
        console.log('c',c);
        console.log('oldValue',oldValue);
        console.log('newValue',newValue);
        
            row = c.r
            column = c.c
          }
        }
    })
    upload.open = false
  }else{
    ElMessage.error('文件解析出错，请重试')
  }
};
const getFileName = (name)=>{
  console.log('name',name);
  
  let suffixArray = name.split('.')
  return suffixArray['0'] || '未命名'
}
let tmpUpFileData;
let tmpFile;
/**选择的文件发生变化时 */
const handleChange = (uploadFile) => {
   // 读取表格数据
   tmpUpFileData = undefined
   tmpFile = undefined
    LuckyExcel.transformExcelToLucky(uploadFile.raw, (luckyJson, _)=>{
      console.log('luckyJson',luckyJson);
      
      if(luckyJson.sheets==null || luckyJson.sheets.length==0){
        ElMessage.error('数据解析错误，请重新上传')
          return;
      }else{
        tmpUpFileData = luckyJson
        tmpFile = uploadFile
      }
    });
}
// var sheetOption = {
//                 container: 'luckysheet', // 设定DOM容器的id
//                 // title:'test',
//                 lang:'zh',
//                 showtoolbar: true, // 是否显示工具栏
//                 showinfobar: false, // 是否显示顶部信息栏
//                 showstatisticBar: false, // 是否显示底部计数栏
//                 sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
//                 allowEdit: true, // 是否允许前台编辑
//                 enableAddRow: false, // 是否允许增加行
//                 enableAddCol: false, // 是否允许增加列
//                 sheetFormulaBar: false, // 是否显示公式栏
//                 enableAddBackTop: false, //返回头部按钮
//                //  data: exportJson.sheets, //表格内容
//                //  title: exportJson.info.name //表格标题
//               }
let row = 0;
let column = 0;
onMounted(() => {
  currentLuckySheet.create({
    container: 'luckysheet',
    showinfobar: false,
    showstatisticBar: false,
    lang:'zh',
    allowEdit: true, // 是否允许前台编辑
    userInfo:'XR-TECH',
    hook: {
      cellMousedown:function(r,c,oldValue,newValue,isRefresh){
        console.log('r',r);
        console.log('c',c);
        console.log('oldValue',oldValue);
        console.log('newValue',newValue);
        
            row = c.r
            column = c.c
          }
        }
  } );
})
//////////////////////////////////////////////文件上传处理完毕
/**
 * 0未打开 1打开中 2已打开 3已关闭 
 */
//  const current_state = ref(0)
/**
 * 当前选择的端口
 */
const chosePort = ref(undefined)
/**
 * 当前获取到的端口列表
 */
const portList = ref([])
/**复制数据 */
const copyData = (()=>{
  console.log('currentRecv',currentRecv);
  
  if(currentRecv==undefined ||currentRecv==null || currentRecv.value == null || currentRecv.value == undefined || currentRecv.value==''){
    ElMessage.error("请先采集数据");
    return
  }
  try {
    currentLuckySheet.setcellvalue(row,column,currentLuckySheet.flowdata(),currentRecv.value)
      currentLuckySheet.refresh()
        ElMessage.success("填入成功");
  } catch (error) {
    console.log('error',error);
    ElMessage.error("请先选择需填入数据的位置");
  }
})
/**点击采集按钮 */
const clickCollect = (data)=>{
  window.ipcRenderer.invoke(IpcEvents.PORT_SEND, data).then(()=>{
    // portList.value = []
  }).catch((error)=>{
    // ElMessage.error("采集失败");
  })
}
onUnmounted(()=>{
  // if(current_state.value == 2){
    //  clickClose()
  // }
})
let collectInterval
onUnmounted(() => {
  stopCollect()
})
const  stopCollect= (()=>{
  if(collectInterval!=null && collectInterval!=undefined){
    clearInterval(collectInterval)
  }
})
const  startCollect= (()=>{
  // collectInterval = setInterval(()=>{
  //   // clickCollect('[R]')
  //   console.log('采集数据');
  // }
  // ,1000)
})
//用来收消息展示
useIpcRendererOn(IpcEvents.PORT_SHOW, async (_, recv) => {
  if(recv == '串口已打开'){
      startCollect()
  }
  ElMessage.info(recv)
})
/**
 * 将文字写入剪切板 
 * @param {string} text
 * @returns {Promise} 返回promise对象
 */
 const copyText = (text) =>{
    // 在调用前 先访问是否存在 clipboard 对象
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text)
    } else {
        // 不存在使用 老版本API execCommand
        try {
            const t = document.createElement('textarea')
            t.nodeValue = text
            t.value = text
            document.body.appendChild(t)
            t.select()
            document.execCommand('copy');
            document.body.removeChild(t)
            return Promise.resolve()
        } catch (e) {
            console.log(e)
            return Promise.reject(e)
        }
    }
}
//用来监听渲染进程发送的信息
useIpcRendererOn(IpcEvents.PORT_RECV, async (_, recv) => {
  console.log('PORT_RECV 收到的数据recv：', recv)
  currentRecv.value = (parseInt(recv)/100).toFixed(2)
})
const clickOpen = (() => {
  console.log('form.value',form.value);
  
  if( form.value==undefined || form.value.serialPort == undefined || form.value.serialPort==null||form.value.serialPort==''){
    ElMessage.error('请先选择串口')
    return
  }

  openBtnAble.value = false
  // current_state.value = 1
  window.ipcRenderer.invoke(IpcEvents.PORT_OPEN, JSON.stringify(form.value)).then(()=>{
    chosePort.value = form.value.serialPort
  }).catch(()=>{
    chosePort.value = undefined
    ElMessage.error('端口打开失败，请重试')
    openBtnAble.value = true
  })
})
const clickClose = (()=>{
  //关闭串口
  chosePort.value = undefined
  openBtnAble.value = true
  window.ipcRenderer.invoke(IpcEvents.PORT_CLOSE, '').then((ports)=>{
    stopCollect()
    portList.value = []
  }).catch((e)=>{
    ElMessage.error('串口关闭失败，请重试')
    openBtnAble.value = false
  })
})
const getPortList = ()=>{
  //获取串口列表
  window.ipcRenderer.invoke(IpcEvents.GET_PORTS_LIST, '').then((ports)=>{
    portList.value = JSON.parse(ports)
    if(portList.value.length>0){
      form.value.serialPort = portList.value[0].path
    }
  }).catch(()=>{
    // current_state.value = 0
    ElMessage.error('获取串口失败，请重试')
  })
}

const form = ref({
  excel:'',
  serialPort: '',//serialPort
  baudRate:9600,
  // state:'未打开'
})

</script>

<template>
  <div class="container">
    <el-container>
      <el-header class="container-header">
        <el-row class="align-center">
            <el-text>请选择串口：</el-text>
            <el-select style="width:120px;" v-model="form.serialPort" placeholder="请选择串口" @click="getPortList()">
                <el-option v-for="(item, index) in portList" :key="index" :label="item.path"
                  :value="item.path"></el-option>
              </el-select>
            <el-button type="success" :icon="Refresh" circle @click="getPortList()" :disabled="!openBtnAble"/>
            <!-- <el-text class="align-right" v-model="current_state" type="primary">当前状态：{{current_state}}</el-text> -->
       
            <el-button type="primary" @click="clickOpen()" :disabled="!openBtnAble">打开</el-button>
            <el-button type="danger" @click="clickClose()" :disabled="openBtnAble">关闭</el-button>
          <el-button type="warning"  @click="clickCollect('[R]')" :disabled="openBtnAble">采集</el-button>
          <el-text style="position: absolute;right:0px;" v-if="currentRecv != undefined && currentRecv!=''"   @click="copyData()">当前收到的数据：<span style="margin: 0px 8px 0px 1px; ">{{ currentRecv }} </span>
            <el-button type="success" :icon="Finished" >填入</el-button>
          </el-text>
           </el-row>
      </el-header>
      <el-main class="container-center">
        <!-- <el-row>
          <el-col :span=4 class="align-center">
          <el-text type="info" >维修记录表:&nbsp;</el-text></el-col>
          <el-col :span=10 style="width:300px">
            <el-select 
              v-model="form.excel" 
              placeholder="请选择维修记录表" 
              >
            <el-option v-for="(item, index) in excelList" :key="index" :label="item.value"
                  :value="item.key" style="font-size:12px"></el-option>
              </el-select>
            </el-col>
            <el-col :span=4 style="margin-left:10px" class="align-center"><el-button type="warning" :disabled="openBtnAble">导出</el-button></el-col>
        </el-row> -->
        <el-button type="primary" @click="importFile" :icon="Upload">导入标准文件</el-button>
        <el-button type="primary" @click="ExportFile" :icon="Download">导出文件</el-button>
        <div class="main-container" id="luckysheet" >
        </div>
        </el-main>
      </el-container>
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
         <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :disabled="upload.isUploading"
            :on-exceed="handleExceed" :on-change="handleChange" :auto-upload="false" drag>
            <!-- <ElIcon><UploadFilled /></ElIcon> -->
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将模板文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <span>仅允许导入xls、xlsx格式文件。</span>
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div>
               <el-button type="primary" @click="submitFileForm">确 定</el-button>
               <el-button @click="upload.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
  </div>
</template>

<style scoped >

.container {
  background-color: rgb(211, 230, 247);
  width: 100vw;
  height: 100vh;
  color: rgb(2, 41, 99);
}
.container-header{
  padding-top:12px;
  height:45px;
}
.align-right{
  display:flex;
  align-items:center;
  justify-content:end;
  /* width:100%; */
}
.align-center{
  display:flex;
  align-items:center;
}
.container-center {
  background-color: white;
  height: calc(100vh - 45px);
  border: 2vw solid rgb(211, 230, 247);
  /* border-top: 2vw; */
  border-radius: 3vw;
  /* box-shadow: var(--el-box-shadow-light); */
}
.main-container{
  margin-top:10px;
  height:calc(100% - 42px);
  /* margin:0px; */
  /* padding:0px; */
  background: rgb(115, 115, 196);
  /* position:absolute; */
  width:100%;
  /* left: 0px; */
  /* top: 0px; */
 /* display:flex;
  background-color: grey;
  justify-content:start;*/
}
.container-left {
  width: 30vw;
  height: 100vh;
  padding: 3vw 2vw;
}

.container-left-top {
  position: relative;
  padding: 12px 5px 0px 5px;
  /* width: 100%; */
  height: 41vh;
  border: 1px solid rgb(180, 184, 189);
  border-radius: 4px;
}

.container-left-top::after {
  content: '串口设置';
  position: absolute;
  left: 10px;
  top: -12px;
  width: 80px;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  background: rgb(211, 230, 247);
}
.left-bottom{
  margin-top: 88px;
  height: 30vh;
  /* width: 80px; */
}
.left-bottom::after {
  content: '线路状态';
}

.el-form-item{
  margin-top: 10px;
  margin-bottom: 12px;
  /* :v-deep(.el-form-item__label){
    color: red;
  } */
}
/* h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
} */
</style>
