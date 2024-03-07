<script setup lang="ts">
import { onBeforeMount, ref, reactive, onMounted } from 'vue';
import { IpcEvents } from '../../electron/ipcEvents';
import useIpcRendererOn from "../hook/useIpcRendererOn";
import { Refresh } from '@element-plus/icons-vue';
// import { ElMessage } from 'element-plus'
import { excelList } from "../config";

import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx'
import LuckyExcel from "luckyexcel"

// const props = defineProps(['msg'])
// onBeforeMount(() => {
//   msg.value = props.msg || ''
// })
const dialogVisible = ref(false)//弹窗是否可见
const btnDisable = ref(false)//按钮是否可用

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
  let data = window.luckysheet.toJson()
  console.log('看看ExportFile结果',data);
  
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
   let data = {}
  //  data['rows'] = currentUpFileData
  console.log('tmpFile',tmpFile);
  if(tmpFile){
    window.luckysheet.destroy();
    console.log('tmpUpFileData',tmpUpFileData);
    console.log('tmpFile',tmpFile);
    sheetOption.data = tmpUpFileData.sheets
    sheetOption.name = getFileName(tmpFile.name)
    console.log('sheetOption',sheetOption);
    window.luckysheet.create(sheetOption)
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
let currentUpFileData;
let tmpUpFileData;
let currentFile;
let tmpFile;
/**选择的文件发生变化时 */
const handleChange = (uploadFile) => {
   // 读取表格数据
   console.log('uploadFile',uploadFile)
   tmpUpFileData = undefined
   tmpFile = undefined
  //  fs.readFile(uploadFile, function(err, data) {
  //   if (err) throw err;
    LuckyExcel.transformExcelToLucky(uploadFile.raw, (luckyJson, _)=>{
      console.log('这里解析完了 转为luckysheet格式');
      console.log('luckyJson',luckyJson);
      if(luckyJson.sheets==null || luckyJson.sheets.length==0){
        ElMessage.error('数据解析错误，请重新上传')
          return;
      }else{
        tmpUpFileData = luckyJson
        tmpFile = uploadFile
      }
    });
  //  })
  //  LuckyExcel.transformExcelToLucky(uploadFile,
  //  (luckyJson,luckySheetFile)=>{
  //   console.log('这里解析完了 转为luckysheet格式');
    
  //   if(luckyJson.sheets==null || luckySheetFile.sheets.length==0){
  //     ElMessage.error('数据解析错误，请重新上传')
  //         return;
  //     }else{
  //       console.log('luckyJson',luckyJson);
  //       console.log('luckySheetFile',luckySheetFile);
  //       tmpUpFileData = luckyJson
  //       tmpFile = luckySheetFile
  //     }
  //  })
  //  analysisExcel(uploadFile.raw).then((tableJson) => {
  //   console.log();
    
  //   if (tableJson && tableJson.length > 0) {
  //     tmpFile = uploadFile
  //     tmpUpFileData = tableJson
  //   }else{
  //     ElMessage.error('数据解析错误，请重新上传')
  //   }
  // })
}
  // analysisExcel(uploadFile.raw).then((tableJson) => {
   //    if (tableJson && tableJson.length > 0) {
   //      console.log('tableJson',tableJson);
   //       //成功解析出数据
   //       //只取第一个sheet的数据
   //       let dataExcel = tableJson[0].sheet;
   //       // LuckyExcel.
   //       currentUpFileData = [];    //新数组
   //      //  dataExcel.map(item => {
   //      //     let obj = {
   //      //        id: item.id,
   //      //        name: item['名称'],
   //      //        level: item['等级'],
   //      //        judgeType: item['判断类型'],
   //      //        value: Number(item['阈值']),
   //      //        reason: item['可能原因'],
   //      //        method: item['处理方法'],
   //      //        remark: item['备注'],
   //      //        disable: item['是否暂停使用'],
   //      //     }
   //      //     currentUpFileData.push(obj);
   //      //  });
   //    }else{
   //      ElMessage.info('数据解析错误，请重新上传')
   //    }
   // });
  // };
//解析excel
function analysisExcel(file) {
   return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function (e) {
         const data = e.target.result;
         let dataJson = XLSX.read(data, {
            type: "binary",
         });
         const result = [];
         dataJson.SheetNames.forEach((sheetName) => {
            result.push({
               name: sheetName,
               data: XLSX.utils.sheet_to_json(dataJson.Sheets[sheetName]),
            });
         });
         resolve(result);
      };
      reader.readAsBinaryString(file);
   });
}
var sheetOption = {
                container: 'luckysheet', // 设定DOM容器的id
                // title:'test',
                lang:'zh',
                showtoolbar: true, // 是否显示工具栏
                showinfobar: false, // 是否显示顶部信息栏
                showstatisticBar: false, // 是否显示底部计数栏
                sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
                allowEdit: true, // 是否允许前台编辑
                enableAddRow: false, // 是否允许增加行
                enableAddCol: false, // 是否允许增加列
                sheetFormulaBar: false, // 是否显示公式栏
                enableAddBackTop: false, //返回头部按钮
               //  data: exportJson.sheets, //表格内容
               //  title: exportJson.info.name //表格标题
              }
onMounted(() => {
  window.luckysheet.create(sheetOption)
})
//////////////////////////////////////////////文件上传处理完毕
/**
 * 0未打开 1已打开 2打开失败 3已关闭 4关闭失败
 */
 const current_state = ref(0)
/**
 * 当前选择的端口
 */
const chosePort = ref(undefined)
/**
 * 当前获取到的端口列表
 */
const portList = ref([])
//用来监听渲染进程发送的信息
useIpcRendererOn(IpcEvents.PORT_RECV, async (_, data) => {
  console.log('recv', data)
})
const clickOpen = (() => {
  //打开串口
  if(!form.value.serialPort){
    ElMessage.error('请确认已获取串口')
    return
  }
  btnDisable.value = true
  window.ipcRenderer.invoke(IpcEvents.PORT_OPEN, JSON.stringify(form.value)).then((qwe)=>{
    console.log('heeee');
    
    chosePort.value = form.value.serialPort
    current_state.value = 3
    console.log('ipc',qwe);
    // portList.value = []
    // if(portList.value.length>0){
    //   form.serialPort = portList.value[0].productId
    // }
    btnDisable.value = false
  }).catch(()=>{
    chosePort.value = undefined
    current_state.value = 4
    ElMessage.error('端口打开失败，请重试')
    btnDisable.value = false
  })
})
const clickClose = (()=>{
  //关闭串口
  chosePort.value = undefined
  btnDisable.value = true
  window.ipcRenderer.invoke(IpcEvents.PORT_CLOSE, '').then((ports)=>{
    current_state.value = 3
    portList.value = []
    btnDisable.value = false
  }).catch(()=>{
    current_state.value = 4
    ElMessage.error('端口关闭失败，请重试')
    btnDisable.value = false
  })
})
const checkPort = ()=>{
  getPortList()
}
const getPortList = ()=>{
  //获取串口列表
  btnDisable.value = true
  window.ipcRenderer.invoke(IpcEvents.GET_PORTS_LIST, '').then((ports)=>{
    current_state.value = 1
    portList.value = JSON.parse(ports)
    if(portList.value.length>0){
      form.value.serialPort = portList.value[0].path
    }
    btnDisable.value = false
  }).catch(()=>{
    current_state.value = 2
    ElMessage.error('打开失败，请重试')
    btnDisable.value = false
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
            <el-select style="width:120px;" v-model="form.serialPort" placeholder="请选择串口" @click="checkPort()">
                <el-option v-for="(item, index) in portList" :key="index" :label="item.path"
                  :value="item.path"></el-option>
              </el-select>
            <el-button type="success" :icon="Refresh" circle @click="getPortList()" :disabled="btnDisable"/>
            <!-- <el-text class="align-right" v-model="current_state" type="primary">当前状态：{{current_state}}</el-text> -->
       
            <el-button type="primary" @click="clickOpen()" :disabled="btnDisable">打开</el-button>
            <el-button type="danger" @click="clickClose()" :disabled="btnDisable">关闭</el-button>
          <el-button type="warning">采集</el-button>
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
            <el-col :span=4 style="margin-left:10px" class="align-center"><el-button type="warning" :disabled="btnDisable">导出</el-button></el-col>
        </el-row> -->
        <el-button type="primary" @click="importFile">导入标准文件</el-button>
        <el-button type="primary" @click="ExportFile">导出文件</el-button>
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
