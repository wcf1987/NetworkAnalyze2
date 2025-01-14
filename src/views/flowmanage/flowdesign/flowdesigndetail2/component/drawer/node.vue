<template>
  <div class="workflow-drawer-node">

    <!-- 节点编辑 -->

    <el-scrollbar>
      <el-form :model="state.form" ref="extendFormRef" size="default" label-width="80px" :rules="state.baseRules"
               class="pt15 pr15 pb15 pl15">
        <el-form-item label="数据id" prop="id" v-if="false">
          <el-input v-model="state.node.id" placeholder="请输入数据id" clearable disabled></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-input v-model="state.proper.typeC" placeholder="请输入类型" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="left坐标" prop="x" v-if="false">
          <el-input v-model="state.node.x" placeholder="请输入left坐标" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="top坐标" prop="y" v-if="false">
          <el-input v-model="state.node.y" placeholder="请输入top坐标" clearable disabled></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="state.proper.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>

        <div class="customproper" v-if="state.showFlag['bezier']">


          <el-form-item label="前序节点">

            <el-cascader v-model="state.properForm.fieldvar" :options=state.fd :props="props2" clearable
                         collapse-tags @change="changeSourceInput" class="w100"/>

          </el-form-item>
          <el-form-item label="临时变量">

            <el-cascader v-model="state.properForm.globalvar" :options=state.gd :props="props2" clearable
                         collapse-tags @change="changeSourceInput" class="w100"/>

          </el-form-item>
          <el-form-item label="内置变量">
       <el-select v-model="state.properForm.buildPacNode" placeholder="请选择" clearable multiple @change="changeBuildPacNodeInput"

                       class="w100">
            <el-option
                v-for="item in buildPacNode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
       </el-select>
          </el-form-item>

          <el-form-item label="计算公式" prop="rulestr">

            <el-input
                :autosize="{ minRows: 2, maxRows: 10 }"
                type="textarea"
                placeholder="请输入转换公式"
                v-model="state.properForm.rulestr" autocomplete="off"/>
          </el-form-item>

        </div>

        <div class="customproper" v-if="state.showFlag['start']">
          <el-form-item label="接口类型">
            <el-select v-model="state.properForm.interfacetype" placeholder="请选择" clearable
                       :disabled="state.flowtype=='网络层透明传输'"
                       class="w100">
              <el-option label="网口" value="网口"></el-option>
              <el-option label="串口" value="串口"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="state.properForm.dataType" placeholder="请选择" clearable
                       :disabled="state.flowtype=='网络层透明传输'"

                       class="w100">
              <el-option
                  v-for="item in dataType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="源地址" prop="sourecenetworkID"
                        v-if="state.properForm.interfacetype=='网口'">
            <el-select v-model="state.properForm.sourecenetworkID" placeholder="请选择" clearable
                       v-on:change="onChangeStartSNIP"
                       class="w100">
              <el-option
                  v-for="item in NetworkOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="源地址" prop="sourecenetworkIP"
                        v-if="state.properForm.interfacetype=='网口' &&state.properForm.sourecenetworkID!=-2 &&state.properForm.sourecenetworkID!=''">
            <el-input v-model="state.properForm.sourecenetworkIP" placeholder="请输入源地址ip地址" clearable

            ></el-input>
          </el-form-item>
          <el-form-item label="源端口" prop="sourecenetworkPort"
                        v-if="state.properForm.interfacetype=='网口' &&state.properForm.sourecenetworkID!=-2 &&state.properForm.sourecenetworkID!=''"
          >
            <el-input v-model="state.properForm.sourecenetworkPort" placeholder="请输入源地址端口" clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="串口信息" prop="serialID" v-if="state.properForm.interfacetype=='串口'">
            <el-select v-model="state.properForm.serialID" placeholder="请选择" clearable class="w100"
                       v-on:change="onChangeStartSerialChoose">
              <el-option
                  v-for="item in SerialOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="串口号" prop="SerialNO"
                        v-if="state.properForm.interfacetype=='串口'">
            <el-input v-model="state.properForm.SerialNO" placeholder="请输入串口号" clearable
                      :readonly=" state.properForm.serialID!='-1'"></el-input>
          </el-form-item>
          <el-form-item label="波特率" prop="BAUD"
                        v-if="state.properForm.interfacetype=='串口' ">
            <el-input v-model="state.properForm.BAUD" placeholder="请输入波特率" clearable
                      :readonly=" state.properForm.serialID!='-1'"></el-input>
          </el-form-item>

          <el-form-item label="本地地址" prop="localnetworkID"
                        v-if="state.properForm.interfacetype=='网口'">
            <el-select v-model="state.properForm.localnetworkID" placeholder="请选择" clearable
                       class="w100" v-on:change="onChangeStartNetworkChoose">
              <el-option
                  v-for="item in NetworkLocalOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="本地地址" prop="IP"
                        v-if="state.properForm.interfacetype=='网口' &&state.properForm.localnetworkID!=null">
            <el-input v-model="state.properForm.IP" placeholder="请输入ip地址" clearable @change="checkIP"
            ></el-input>
          </el-form-item>
          <el-form-item label="本地端口" prop="Port"
                        v-if="state.properForm.interfacetype=='网口' "
                        :readonly=" state.properForm.localnetworkID!='-1'">
            <el-input v-model="state.properForm.Port" placeholder="请输入端口" clearable @change="checkPort"
            ></el-input>
          </el-form-item>

        </div>

        <div class="customproper" v-if="state.showFlag['end']">
          <el-form-item label="接口类型">
            <el-select v-model="state.properForm.interfacetype" placeholder="请选择" clearable
                       class="w100">
              <el-option label="网口" value="网口"></el-option>
              <el-option label="串口" value="串口"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目的串口" prop="type" v-if="state.properForm.interfacetype=='串口'">
            <el-select v-model="state.properForm.serialID" placeholder="请选择" clearable class="w100"
                       v-on:change="onChangeEndSerialChoose">
              <el-option
                  v-for="item in SerialOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="串口号" prop="type"
                        v-if="state.properForm.interfacetype=='串口'">
            <el-input v-model="state.properForm.SerialNO" placeholder="请输入串口号" clearable
                      :readonly=" state.properForm.serialID!='-1'"></el-input>
          </el-form-item>
          <el-form-item label="波特率" prop="type"
                        v-if="state.properForm.interfacetype=='串口' ">
            <el-input v-model="state.properForm.BAUD" placeholder="请输入波特率" clearable
                      :readonly=" state.properForm.serialID!='-1'"></el-input>
          </el-form-item>
          <el-form-item label="目的地址" prop="type" v-if="state.properForm.interfacetype=='网口'">
            <el-select v-model="state.properForm.localnetworkID" placeholder="请选择" clearable
                       v-on:change="onChangeEndNetworkChoose">
              <el-option
                  v-for="item in NetworkLocalOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-row v-for="(v, k) in state.properForm.IPlist" :key="k" class="max-width-row">
            <el-form-item label="目的IP" prop="type"
                          v-if="state.properForm.interfacetype=='网口'" style="margin-top: 10px"

            >
              <el-col :span="11">

                <el-input v-model="v.IP" placeholder="请输入ip地址" clearable style="font-size: 10px" @change="checkIP"
                ></el-input>
              </el-col>
              <el-col :span="1" class="text-center">
                <span style="display:block;text-align: center" class="text-gray-500">:</span>
              </el-col>
              <el-col :span="6">
                <el-input v-model="v.Port" placeholder="请输入端口" clearable style="font-size: 10px"
                          @change="checkPort"
                ></el-input>
              </el-col>
              <el-col :span="1"/>
              <el-col :span="2">
                <el-button type="success" size="small" circle @click="onAddEndIP">
                  <el-icon>
                    <ele-Plus/>
                  </el-icon>

                </el-button>
              </el-col>
              <el-col :span="1"/>
              <el-col :span="2">
                <el-button type="danger" size="small" circle @click="onDelEndIP(k)">
                  <el-icon>
                    <ele-Delete/>
                  </el-icon>

                </el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="消息封装" prop="messPackProperty" v-if="state.flowtype!='网络层透明传输'">
              <el-select v-model="v.messPackProperty" placeholder="请选择" clearable

                         class="w100">
                <el-option
                    v-for="item in messPackProperty"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="转发SOCK" prop="reForwardSocket" v-if="state.flowtype!='网络层透明传输'">
              <el-select v-model="v.reForwardSocket" placeholder="请选择" clearable

                         class="w100">
                <el-option
                    v-for="item in reForwardSocket"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="IP类型" prop="ipType" v-if="state.flowtype!='网络层透明传输' ">
              <el-select v-model="v.ipType" placeholder="请选择" clearable

                         class="w100">
                <el-option
                    v-for="item in ipType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <!--

-->
        </div>


        <div class="customproper" v-if="state.showFlag['pacparse']">
          <el-form-item label="头部选择">
            <el-select v-model="state.properForm.pacparseID" placeholder="请选择" clearable
                       @change="(val) => saveTempData(val, PackageOptions,'package')"
                       class="w100">
              <el-option
                  v-for="item in PackageOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="解析方法">
            <el-select v-model="state.properForm.parseMethod" placeholder="请选择" clearable
                       class="w100">
              <el-option
                  v-for="item in ParseOptions"
                  :key="item.ID"
                  :label="item.Label"
                  :value="item.Value"
              />
            </el-select>
          </el-form-item>

        </div>

        <div class="customproper" v-if="state.showFlag['pacencap']">
          <el-form-item label="头部选择">
            <el-select v-model="state.properForm.pacencapID" placeholder="请选择" clearable
                       @change="(val) => saveTempData(val, PackageOptions,'package')"
                       class="w100">
              <el-option
                  v-for="item in PackageOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="添加方法">
            <el-select v-model="state.properForm.encapMethod" placeholder="请选择" clearable
                       class="w100">
              <el-option
                  v-for="item in encapMethod"
                  :key="item.ID"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>

        </div>

        <div class="customproper" v-if="state.showFlag['messheaderparse']">
          <el-form-item label="消息头">
            <el-select v-model="state.properForm.messheaderparseID" placeholder="请选择" clearable
                       @change="(val) => saveTempData(val, MessHeaderOptions,'messheader')"
                       class="w100">
              <el-option
                  v-for="item in MessHeaderOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />


            </el-select>
          </el-form-item>
          <el-form-item label="解析方法" v-if="state.flowtype!='混合编排'">
            <el-select v-model="state.properForm.parseMethod" placeholder="请选择" clearable
                       class="w100">
              <el-option
                  v-for="item in parseMethod"
                  :key="item.ID"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>


        </div>
        <div class="customproper" v-if="state.showFlag['messheaderencap']">
          <el-form-item label="消息头">
            <el-select v-model="state.properForm.messheaderencapID" placeholder="请选择" clearable
                       class="w100" v-on:change="onChangeMessheaderEncapChoose">
              <el-option
                  v-for="item in MessHeaderOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />

            </el-select>
          </el-form-item>
          <el-form-item label="添加方法">
            <el-select v-model="state.properForm.encapMethod" placeholder="请选择" clearable
                       class="w100">
              <el-option
                  v-for="item in encapMethod"
                  :key="item.ID"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>

        </div>
        <div class="customproper" v-if="state.showFlag['messbodyparse']">
          <el-form-item label="消息体">
            <el-select v-model="state.properForm.messbodyparseID" placeholder="请选择" clearable
                       @change="(val) => saveTempData(val, MessBodyOptions,'messbody')"
                       class="w100">
              <el-option
                  v-for="item in MessBodyOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />

            </el-select>
          </el-form-item>


        </div>
        <div class="customproper" v-if="state.showFlag['messbodyencap']">
          <el-form-item label="消息体">
            <el-select v-model="state.properForm.messbodyencapID" placeholder="请选择" clearable
                       @change="(val) => saveTempData(val, MessBodyOptions,'messbody')"
                       class="w100">
              <el-option
                  v-for="item in MessBodyOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />

            </el-select>
          </el-form-item>


        </div>


        <div class="customproper" v-if="state.showFlag['messtraslate']">
          <el-form-item label="转换规则">
            <el-select v-model="state.properForm.transid" v-on:change="onChangeMessTranslateChoose"
                       placeholder="请选择" clearable class="w100">
              <el-option
                  v-for="item in MessTraslateOptions"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
              />
            </el-select>
          </el-form-item>


        </div>

        <div class="customproper" v-if="state.showFlag['spemark']">
          <el-form-item label="变量名">
            <el-input v-model="state.properForm.globalVarName" placeholder="请输入临时变量代码名称" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="属性">
            <el-select v-model="state.properForm.varType"
                       placeholder="请选择" clearable class="w100">
              <el-option
                  v-for="item in VarTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="源字段" prop="source">

            <el-cascader v-model="state.properForm.sourceData" :options=state.fd
                         :separator="'.'"
                         :props="props21"
                         @change="changeSourceInput21"
                         clearable
                         collapse-tags/>
          </el-form-item>

          <el-form-item label="计算公式" prop="rulestr" clearable>
            <el-input
                :autosize="{ minRows: 2, maxRows: 10 }"
                type="textarea"
                placeholder="请输入转换公式"
                v-model="state.properForm.globalVarRule" autocomplete="off"/>
          </el-form-item>


        </div>
        <div class="customproper" v-if="state.showFlag['timer']">

          <el-form-item label="定时时间">
            <el-col :span="17">
              <el-input v-model="state.properForm.timerTime" placeholder="请输入定时时间" clearable

              ></el-input>

            </el-col>
            <el-col :span="7">
              <span style="display:block;text-align: center" class="text-gray-500">秒</span>
            </el-col>
          </el-form-item>
          <el-form-item label="动作类型" prop="actionType">
            <el-select v-model="state.properForm.actionType" placeholder="请选择" clearable

                       class="w100">
              <el-option
                  v-for="item in actionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发送地址" prop="IP" v-if="state.properForm.actionType=='发送数据'">
            <el-input v-model="state.properForm.IP" placeholder="请输入ip地址" clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="发送端口" prop="Port" v-if="state.properForm.actionType=='发送数据'"
          >
            <el-input v-model="state.properForm.Port" placeholder="请输入端口" clearable
            ></el-input>
          </el-form-item>

        </div>
        <div class="customproper" v-if="state.showFlag['filter']">


          <el-form-item label="动作类型" prop="actionType">
            <el-select v-model="state.properForm.filterType" placeholder="请选择" clearable

                       class="w100">
              <el-option
                  v-for="item in filterType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="前序节点" prop="id">

            <el-cascader v-model="state.properForm.fieldvar" :options=state.fd :props="props21" clearable
                         collapse-tags @change="changeSourceInput22"/>

          </el-form-item>
          <el-form-item label="临时变量" prop="id">

            <el-cascader v-model="state.properForm.globalvar" :options=state.gd :props="props21" clearable
                         collapse-tags @change="changeSourceInput22"/>

          </el-form-item>

          <el-form-item label="判断公式" prop="name">

            <el-input
                :autosize="{ minRows: 2, maxRows: 10 }"
                type="textarea"
                placeholder="请输入判断公式"
                v-model="state.properForm.rulestr" autocomplete="off"/>
          </el-form-item>

        </div>
        <el-form-item class="btn">
          <el-button class="mb15" @click="state.tabsActive = '1'" v-if="false">
            <SvgIcon name="ele-DArrowLeft"/>
            上一步
          </el-button>

          <el-button class="mb15" @click="onExtendRefresh">
            <SvgIcon name="ele-RefreshRight"/>
            重置
          </el-button>

          <el-button type="primary" class="mb15" @click="onExtendEditMessTranslate"
                     :loading="state.loading.extend" v-if="state.showFlag['messtraslate']">
            <SvgIcon name="ele-EditPen"/>
            编辑模板
          </el-button>
          <el-button type="primary" class="mb15" @click="onExtendGlobalVar"
                     :loading="state.loading.extend" v-if="state.showFlag['spemark'] && false">
            <SvgIcon name="ele-EditPen"/>
            编辑变量
          </el-button>

          <el-button type="primary" class="mb15" @click="viewNess"
                     :loading="state.loading.extend"
                     v-if="state.showFlag['messbodyencap'] || state.showFlag['messbodyparse'] ||  state.showFlag['messheaderparse'] ">
            <SvgIcon name="ele-EditPen"/>
            查看信息
          </el-button>

          <el-button type="primary" class="mb15" @click="onExtendEditMessheader"
                     :loading="state.loading.extend" v-if="state.showFlag['messheaderencap']">
            <SvgIcon name="ele-EditPen"/>
            编辑消息
          </el-button>

          <el-button type="primary" class="mb15" @click="onExtendSubmit"
                     :loading="state.loading.extend">
            <SvgIcon name="ele-Check"/>
            保存
          </el-button>

        </el-form-item>
      </el-form>
    </el-scrollbar>


    <Translatedialog ref="translateDialogRef" @refresh="messTranslateModify"/>
    <Messdialog ref="messDialogRef" @refresh="onExtendSubmit()"/>
    <ViewDialog ref="viewDialogRef" @refresh="onExtendSubmit()"/>
    <GlobalEditdialog ref="globalEditDialogRef" @refresh="onExtendSubmit()"/>
  </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawerNode">
import {defineAsyncComponent, nextTick, onMounted, reactive, ref} from 'vue';
import {ElMessage} from 'element-plus';
import * as echarts from 'echarts';
import {addressApi} from "/@/api/sysmanage/address";
import {packageApi} from "/@/api/sysmanage/package";
import {messtranslateApi} from "/@/api/sysmanage/messtranslate";
import {messbodyApi} from "/@/api/sysmanage/messbody";
import {messheaderApi} from "/@/api/sysmanage/messheader";
import {messdetailApi} from "/@/api/sysmanage/messdetail";

import {
  DataType,
  MessPackProperty,
  ReForwardSocket,
  ActionType,
  VarType,
  FilterType,
  IPType,
    BuildPacNode,
  ParseMethod,
  EncapMethod, SystemAssign
} from '/@/utils/common';
import {optionListApi} from "/@/api/plugmanage/optionlist";

const Translatedialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/traslatedialog.vue'));
const translateDialogRef = ref();
const Messdialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/messdialog.vue'));
const messDialogRef = ref();
const ViewDialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/viewdialog.vue'));
const viewDialogRef = ref();
const GlobalEditdialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/globaleditdialog.vue'));
const globalEditDialogRef = ref();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['submit', 'close']);

// 定义变量内容
const nodeFormRef = ref();
const extendFormRef = ref();
const chartsMonitorRef = ref();
const dataType = ref(DataType);
const actionType = ref(ActionType);
const filterType = ref(FilterType);
const parseMethod = ref(ParseMethod);

const encapMethod = ref(EncapMethod);
const messPackProperty = ref(MessPackProperty);
const reForwardSocket = ref(ReForwardSocket);
const systemAssign = ref(SystemAssign);
const ipType = ref(IPType);
const buildPacNode = ref(BuildPacNode);
const VarTypeOptions = ref(VarType);
const NetworkOptions = ref();
const ParseOptions = ref();
const NetworkLocalOptions = ref();
const SerialOptions = ref();
const PackageOptions = ref();
const MessHeaderOptions = ref();
const MessBodyOptions = ref();
const MessTraslateOptions = ref();
const state = reactive({
  node: {},
  lf: '',
  flowtype: '',

  baseRules: {},
  proper: {
    name: '',
    typeC: '',
  },
  form: {
    module: [],
  },
  showFlag: {
    start: "false",
  },
  properForm: {
    type: "",
    tempData: "",
    tempDataContent: "",
    Port: "",
  },
  tabsActive: '0',
  loading: {
    extend: false,
  },
});
const sourceoptions = ref();
const globaloptions = ref();
const fieldsoptions = ref();
const onLineTextChange = () => {
  const edgeModel = state.lf.getEdgeModelById(state.edge.id);
  edgeModel.updateText(state.proper.name);
  edgeModel.setProperties(state.properForm);
  emit('submit');
  setTimeout(() => {
    state.loading.extend = false;

    emit('close');
  }, 300);
};
const changeSourceInput = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''
  //for (i = 0; i < fo.length; i++) {
  //if(fo.l)
  //}
  if (fo.length > 0) {
    tempstr = fo[fo.length - 1].join('.') + '\n'
  }


  tempstr = tempstr.replaceAll(',', '.')
  state.properForm.rulestr = state.properForm.rulestr + tempstr;


}
//条件分支 中增加内置变量
const changeBuildPacNodeInput = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''
  //for (i = 0; i < fo.length; i++) {
  //if(fo.l)
  //}
  if (fo.length > 0) {
    tempstr = fo[fo.length - 1]
  }

  state.properForm.rulestr = state.properForm.rulestr + tempstr;


}
const props2 = {
  multiple: true,
  expandTrigger: 'hover',
  value: 'EName',
  label: 'Name'
};
const props21 = {
  multiple: true,
  expandTrigger: 'hover',
  value: 'EName',
  label: 'Name',
  emitPath: true
}
const saveTempData = (val, options, type) => {
  //console.log(val);
  //console.log(options);
  for (let valt of options) {
    if (valt.ID == val) {
      if (type == 'package') {
        state.properForm.tempData = valt;
        getPackageDetail(valt.ID);
      }
      if (type == 'messheader') {
        state.properForm.tempData = valt;
        getMessHeaderDetail(valt.ID);
      }
      if (type == 'messbody') {
        state.properForm.tempData = valt;
        getMessBodyDetail(valt.ID);
      }
    }
  }

}
const checkIP = (val) => {
  // ele.value = onlyNumOnePoint(val);
  if (/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(val) == false) {
    //callback(new Error("请输入正确的ip地址"));
    ElMessage.error("请输入正确的ip地址");
  } else {
    //callback();
  }
}
const checkPort = (val) => {
  // ele.value = onlyNumOnePoint(val);
  if (/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(val) == false) {
    //callback(new Error("请输入正确的ip地址"));
    ElMessage.error("请输入正确的端口号");
  } else {
    //callback();
  }
}

const changeSourceInput21 = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''

  if (fo.length > 0) {
    tempstr = fo[fo.length - 1].join('.') + '\n'
  }


  tempstr = tempstr.replaceAll(',', '.');
  if (state.properForm.globalVarRule == null) {
    state.properForm.globalVarRule = ''
  }
  state.properForm.globalVarRule = state.properForm.globalVarRule + tempstr;


}
const changeSourceInput22 = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''

  if (fo.length > 0) {
    tempstr = fo[fo.length - 1].join('.') + '\n'
  }


  tempstr = tempstr.replaceAll(',', '.');
  if (state.properForm.rulestr == null) {
    state.properForm.rulestr = ''
  }
  state.properForm.rulestr = state.properForm.rulestr + tempstr;


}
// 获取父组件数据
const getParentData = async (data, lf, flowtype) => {

  clearFlag();

  state.tabsActive = '1';
  state.node = data;
  state.flowtype = flowtype;
  if (data.text == null) {
    state.proper.name = '';
  } else {
    state.proper.name = data.text.value;
  }

  state.properForm = data.properties;

  state.lf = lf;
  state.showFlag[state.node["type"]] = true;

  //console.log(data)
  if (data.type == 'bezier') {
    state.proper.typeC = '分支条件';
    if (state.properForm.rulestr == null || state.properForm.rulestr == '') {
      state.properForm.rulestr = ''
    }
    state.edge = data
    const sourenode = state.lf.getNodeModelById(data.sourceNodeId)
    state.node = sourenode;
    await getSourceData();
  }
  if (data.type == 'first') {
    state.proper.typeC = '开始节点';


  }

  if (data.type == 'dest') {
    state.proper.typeC = '结束节点';


  }
  if (data.type == 'start') {
    state.proper.typeC = '源消息节点';
    console.log('start');
    if (state.properForm.dataType == null || state.properForm.dataType == '') {
      state.properForm.dataType = '通用数据'
    }
    if (state.flowtype == '网络层透明传输') {
      state.properForm.interfacetype = '网口'
    }
    if (state.properForm.interfacetype == null || state.properForm.interfacetype == '' || state.properForm.interfacetype == '无') {
      state.properForm.interfacetype = '网口'
    }


  }
  if (data.type == 'end') {
    state.proper.typeC = '目的消息节点';
    if (state.properForm.interfacetype == null || state.properForm.interfacetype == '' || state.properForm.interfacetype == '无') {
      state.properForm.interfacetype = '网口'
    }


  }


  if (data.type == 'messtraslate') {
    state.proper.typeC = '消息转换';

    await getSourceData();

  }
  if (data.type == 'pacencap') {
    state.proper.typeC = '封装/应用头添加';
    if (state.properForm.encapMethod == null || state.properForm.encapMethod == '') {
      state.properForm.encapMethod = '通用增加方法';
    }


  }
  if (data.type == 'pacparse') {
    state.proper.typeC = '封装/应用头解析';
    if (state.properForm.parseMethod == null || state.properForm.parseMethod == '') {
      state.properForm.parseMethod = '通用解析方法';
    }

  }
  if (data.type == 'messheaderparse') {
    state.proper.typeC = '消息头解析';
    if (state.properForm.parseMethod == null || state.properForm.parseMethod == '') {
      state.properForm.parseMethod = '通用解析方法';
    }

  }
  if (data.type == 'messheaderencap') {
    state.proper.typeC = '消息头添加';
    if (state.properForm.encapMethod == null || state.properForm.encapMethod == '') {
      state.properForm.encapMethod = '通用增加方法';
    }

    await getSourceData();

  }
  if (data.type == 'messbodyparse') {
    state.proper.typeC = '消息体解析';


  }
  if (data.type == 'messbodyencap') {
    state.proper.typeC = '消息体添加';


  }
  if (data.type == 'spemark') {
    state.proper.typeC = '临时变量';
    await getSourceData();

  }
  if (data.type == 'pacNum') {
    state.proper.typeC = '数据包个数统计';
  }
  if (data.type == 'pacSize') {
    state.proper.typeC = '数据包大小统计';
  }
  if (data.type == 'statistics') {
    state.proper.typeC = '数据统计';
  }
  if (data.type == 'timer') {
    state.proper.typeC = '定时器';
  }
  if (data.type == 'delayed') {
    state.proper.typeC = '延时器';
  }
  if (data.type == 'messque') {
    state.proper.typeC = '消息队列';
  }
  if (data.type == 'filter') {
    state.proper.typeC = '过滤器';


    await getSourceData();

    if (state.properForm.filterType == null || state.properForm.filterType == '') {
      state.properForm.filterType = '通过'
    }
  }
  if (data.type == 'calc') {
    state.proper.typeC = '计算节点';
  }
  if (data.type == 'timemark') {
    state.proper.typeC = '时间标记';
  }

  if (data.type == 'conver') {
    state.proper.typeC = '内置转换节点';


  }
  if (data.type == 'inpac') {
    state.proper.typeC = '内置封装';


  }
  if (data.type == 'swich') {
    state.proper.typeC = '分支选择';

    await getSourceData();

  }


  // initChartsMonitor();
};
const getFdGdData = async (node, lf) => {
  state.lf = lf
  state.node = node
  await getSourceData();

  return {fd: state.fd, gd: state.gd}
}
const getOptionList = () => {
  optionListApi().search(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: "",
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          ParseOptions.value = res.data;
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const getNetwork = () => {
  addressApi().searchNetworkInter(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          NetworkOptions.value = res.data;


          NetworkOptions.value.unshift({ID: '-2', Name: '无'});

          NetworkLocalOptions.value = res.data;
          NetworkLocalOptions.value.push({ID: '-1', Name: '手动输入'});
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const getSerial = () => {
  addressApi().searchSerialInter(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          SerialOptions.value = res.data;
          SerialOptions.value.push({ID: '-1', Name: '手动输入'});

        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const getPackage = () => {
  packageApi().searchPackage(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          PackageOptions.value = res.data;


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const getPackageDetail = (pid) => {
  packageApi().searchPackageDetail(
      {
        uid: 1,
        pid: pid,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.properForm.tempDataContent = res.data;
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const getMessHeaderDetail = (pid) => {
  messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: pid,
        pageNum: 1,
        pageSize: 10000,
        name: '',
        ttype: 'header',
        nestid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.properForm.tempDataContent = res.data;
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const getMessBodyDetail = (pid) => {
  messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: pid,
        pageNum: 1,
        pageSize: 10000,
        name: '',
        ttype: 'body',
        nestid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.properForm.tempDataContent = res.data;
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const getMessHeader = () => {
  messheaderApi().searchMessHeader(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          MessHeaderOptions.value = res.data;


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const getMessBody = () => {
  messbodyApi().searchMessBody(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          MessBodyOptions.value = res.data;


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const getMessTraslate = () => {
  messtranslateApi().searchMessTranslate(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          MessTraslateOptions.value = res.data;


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const getMessTraslateDetail = (pid, transid, ttype) => {
  messtranslateApi().searchMessTranslateDetail(
      {
        uid: 1,
        pid: pid,
        transid: transid,
        pageNum: 1,
        pageSize: 10000,
        name: '',
        ttype: ttype
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].SourceData = JSON.parse(res.data[i].SourceData)
            res.data[i].Funcrule = JSON.parse(res.data[i].Funcrule)
          }
          state.properForm.messtranslatedata = res.data;

        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
  //const data = [];

}

function isDictionaryEmpty(dict) {
  return Object.entries(dict).length === 0;
}

function addlist(list, item) {
  let flag = 0
  for (let i of list) {
    if (i.type == item.type && i.name == item.name) {
      flag = 1
    }
  }
  if (flag == 0) {
    list.push(item)
  }
}

const getSubListFromIncoming = (node, lf, list) => {
  let waitinglist = [];
  let checkedNodes = [];
  let dataidlist = [];
  waitinglist.push(node)
  //console.log(list);
  while (waitinglist.length > 0) {
    let nodetemp = waitinglist.pop()
    checkedNodes.push(nodetemp.id)
    //console.log(nodetemp);
    if (nodetemp.type == 'pacparse' || nodetemp.type == 'pacencap') {
      if (!isDictionaryEmpty(nodetemp.properties) && typeof nodetemp.properties.nodeData != 'undefined' && !isDictionaryEmpty(nodetemp.properties.nodeData)) {
        addlist(dataidlist, {'type': 'package', 'name': nodetemp.properties.nodeData.Name})
      }
    }
    if (nodetemp.type == 'messheaderparse') {
      if (!isDictionaryEmpty(nodetemp.properties) && typeof nodetemp.properties.nodeData != 'undefined' && !isDictionaryEmpty(nodetemp.properties.nodeData)) {
        addlist(dataidlist, {'type': 'messheader', 'name': nodetemp.properties.nodeData.Name})
      }
    }
    if (nodetemp.type == 'messheaderencap') {
      if (!isDictionaryEmpty(nodetemp.properties) && nodetemp.properties.messheaderName != '') {
        addlist(dataidlist, {'type': 'messheader', 'name': nodetemp.properties.messheaderName})
      }
    }
    if (nodetemp.type == 'messbodyparse' || nodetemp.type == 'messbodyencap') {
      if (!isDictionaryEmpty(nodetemp.properties) && typeof nodetemp.properties.nodeData != 'undefined' && !isDictionaryEmpty(nodetemp.properties.nodeData)) {
        addlist(dataidlist, {'type': 'messbody', 'name': nodetemp.properties.nodeData.Name})
      }
    }


    let nodearrays = Array.from(lf.getNodeIncomingNode(nodetemp.id));
    if (nodearrays.length > 0) {
      //console.log(nodearrays)
      for (let k of nodearrays) {
        if (checkedNodes.indexOf(k.id) != -1) {
          continue
        } else {
          waitinglist.push(k)
        }
      }
    }
  }
  let newlist = []
  for (let i of list) {
    for (let k of dataidlist) {
      if (i.Name == k.name && i.type == k.type) {
        newlist.push(i)
      }
    }
  }
  return newlist
}
const getGlobalListFromIncoming = (node, lf, list) => {
  let waitinglist = [];
  let checkedNodes = [];
  let dataidlist = [];
  waitinglist.push(node)
  //console.log(list);
  while (waitinglist.length > 0) {
    let nodetemp = waitinglist.pop()
    checkedNodes.push(nodetemp.id)
    //console.log(nodetemp);

    if (nodetemp.type == 'spemark') {
      if (!isDictionaryEmpty(nodetemp.properties) && !isDictionaryEmpty(nodetemp.properties.globalVarName)) {
        addlist(dataidlist, {'type': 'spemark', 'name': nodetemp.properties.globalVarName})
      }
    }


    let nodearrays = Array.from(lf.getNodeIncomingNode(nodetemp.id));
    if (nodearrays.length > 0) {
      //console.log(nodearrays)
      for (let k of nodearrays) {
        if (checkedNodes.indexOf(k.id) != -1) {
          continue
        } else {
          waitinglist.push(k)
        }
      }
    }
  }
  let newlist = []
  for (let i of list) {
    for (let k of dataidlist) {
      if (i.Name == k.name) {
        newlist.push(i)
      }
    }
  }
  return newlist
}
const getSourceData = async () => {
  //sourceoptions.value = [];
  await getNodeSourceData();


  //sourceoptions.value = fieldsoptions.value.concat(globaloptions.value);
  let graph = state.lf.getGraphData();

  let nodes = graph.nodes;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].type == 'swich') {

      let fdlist = getSubListFromIncoming(nodes[i], state.lf, fieldsoptions.value);
      let gdlist = getGlobalListFromIncoming(nodes[i], state.lf, globaloptions.value);
      state.lf.setProperties(nodes[i].id, {fd: fdlist, gd: gdlist});
    }

  }

  let fdlist = getSubListFromIncoming(state.node, state.lf, fieldsoptions.value);
  let gdlist = getGlobalListFromIncoming(state.node, state.lf, globaloptions.value);
  state.fd = fdlist
  gdlist = gdlist.concat(SystemAssign);
  state.gd = gdlist;
  console.log(gdlist);

  // emitter.emit('Fn', {fd:fieldsoptions.value,gd:globaloptions.value});

}


const getNodeSourceData = async () => {
  fieldsoptions.value = [];
  let graph = state.lf.getGraphData();
  let packagelist = [];
  let messheaderlist = [];
  let messbodylist = [];
  let globalvarlist = [];
  let nodes = graph.nodes;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].type == 'start') {

    }
    if (nodes[i].type == 'pacparse') {
      if (nodes[i].properties.pacparseID != null && nodes[i].properties.pacparseID != -1) {
        packagelist.push(nodes[i].properties.pacparseID);
      }
    }
    if (nodes[i].type == 'pacencap') {
      if (nodes[i].properties.pacencapID != null && nodes[i].properties.pacencapID != -1) {
        packagelist.push(nodes[i].properties.pacencapID);
      }
    }

    if (nodes[i].type == 'messheaderparse') {
      if (nodes[i].properties.messheaderparseID != null && nodes[i].properties.messheaderparseID != -1) {
        messheaderlist.push(nodes[i].properties.messheaderparseID);
      }
    }
    if (nodes[i].type == 'messheaderencap') {
      if (nodes[i].properties.messheaderencapID != null && nodes[i].properties.messheaderencapID != -1) {
        messheaderlist.push(nodes[i].properties.messheaderencapID);
      }
    }


    if (nodes[i].type == 'messbodyparse') {
      if (nodes[i].properties.messbodyparseID != null && nodes[i].properties.messbodyparseID != -1) {
        messbodylist.push(nodes[i].properties.messbodyparseID);
      }
    }
    if (nodes[i].type == 'messbodyencap') {
      if (nodes[i].properties.messbodyencapID != null && nodes[i].properties.messbodyencapID != -1) {
        messbodylist.push(nodes[i].properties.messbodyencapID);
      }
    }
    if (nodes[i].type == 'spemark') {
      if (nodes[i].properties.globalVarName != null && nodes[i].properties.globalVarName != '' && nodes[i].properties.globalVarName != state.properForm.globalVarName) {
        globalvarlist.push({
          EName: nodes[i].properties.globalVarName,
          Name: nodes[i].properties.globalVarName
        });
      }
    }


  }
  packagelist = Array.from(new Set(packagelist));
  messheaderlist = Array.from(new Set(messheaderlist));
  messbodylist = Array.from(new Set(messbodylist));
  globalvarlist = Array.from(new Set(globalvarlist));
  let lista, listb;
  lista = packagelist;
  listb = PackageOptions.value;
  for (let i = 0; i < lista.length; i++) {
    for (let k = 0; k < listb.length; k++) {
      if (lista[i] == listb[k].ID) {
        await getPackageDetailOptions(listb[k].Name, listb[k].Name, lista[i]);

      }
    }
  }

  lista = messheaderlist;
  listb = MessHeaderOptions.value;
  for (let i = 0; i < lista.length; i++) {
    for (let k = 0; k < listb.length; k++) {
      if (lista[i] == listb[k].ID) {
        await getMessHeaderDetailOptions(listb[k].Name, listb[k].Name, lista[i]);

      }
    }
  }

  lista = messbodylist;
  listb = MessBodyOptions.value;
  for (let i = 0; i < lista.length; i++) {
    for (let k = 0; k < listb.length; k++) {
      if (lista[i] == listb[k].ID) {
        await getMessBodyDetailOptions(listb[k].Name, listb[k].Name, lista[i]);

      }
    }
  }
  globaloptions.value = []
  globaloptions.value = globalvarlist;

}
const getPackageDetailOptions = async (ename, name, pid) => {
  //console.log(ename, pid);
  await packageApi().searchPackageDetail(
      {
        uid: 1,
        pid: pid,
        pageNum: 1,
        pageSize: 10000,
        name: '',

      })
      .then(res => {
        // console.log(res);
        if (res.code == '200') {
          fieldsoptions.value.push(
              {
                EName: ename,
                Name: name,
                type: 'package',
                children: res.data,
              }
          )
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];
}
const getMessHeaderDetailOptions = async (ename, name, pid) => {
  //console.log(ename, pid);
  await messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: pid,
        pageNum: 1,
        pageSize: 10000,
        name: '',
        ttype: 'header',
        nestid: 0,
      })
      .then(res => {
        //
        if (res.code == '200') {
          fieldsoptions.value.push(
              {
                EName: ename,
                Name: name,
                type: 'messheader',
                children: res.data,
              }
          )
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];
}
const getMessBodyDetailOptions = async (ename, name, pid) => {
  // console.log(ename, pid);
  await messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: pid,
        pageNum: 1,
        pageSize: 10000,
        name: '',
        ttype: 'body',
        nestid: 0,
      })
      .then(res => {
        // console.log(res);
        if (res.code == '200') {
          fieldsoptions.value.push(
              {
                EName: ename,
                Name: name,
                type: 'messbody',
                children: res.data,
              }
          )
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];
}
const getGlobalVarOptions = (list) => {


  return {
    EName: 'globalVar',
    Name: '临时变量',
    type: 'spemark',
    children: list
  }


}


const clearFlag = () => {
  state.showFlag.bezier = false;
  state.showFlag.start = false;
  state.showFlag.end = false;
  state.showFlag.pacparse = false;
  state.showFlag.pacencap = false;
  state.showFlag.messheaderparse = false;
  state.showFlag.messheaderencap = false;
  state.showFlag.messbodyparse = false;
  state.showFlag.messbodyencap = false;
  state.showFlag.messtraslate = false;
  state.showFlag.swich = false;
  state.showFlag.spemark = false;
  state.showFlag.timemark = false;
  state.showFlag.timer = false;
  state.showFlag.statistics = false;
  state.showFlag.calc = false;
  state.showFlag.delayed = false;
  state.showFlag.inpac = false;
  state.showFlag.filter = false;
  state.properForm.tempData = '';
  state.properForm.tempDataContent = '';
  state.properForm.converName = '';
  state.edge = '';

}

// 节点编辑-保存
const onNodeSubmit = () => {
  nodeFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const nodeModel = state.lf.getNodeModelById(state.node.id);
      nodeModel.updateText(state.proper.name);

      emit('submit');
      //emit('close');
    } else {
      return false;
    }
  });
};

// 开始节点中-网口类-本地地址菜单菜单联动
const onChangeStartNetworkChoose = (value: any) => {
  console.log(state.properForm.localnetworkID);
  if (state.properForm.localnetworkID == '-1') {
    state.properForm.IP = "";
    state.properForm.Port = "";
  } else {

    for (let i = 0; i < NetworkLocalOptions.value.length; i++) {
      if (NetworkLocalOptions.value[i].ID == state.properForm.localnetworkID) {
        state.properForm.IP = NetworkLocalOptions.value[i].IP;
        state.properForm.Port = NetworkLocalOptions.value[i].Port;
      }
    }

  }


};
//开始节点，源地址选择联动
const onChangeStartSNIP = (value: any) => {
  //console.log(state.properForm.localnetworkID);
  if (state.properForm.sourecenetworkID == '-1') {
    state.properForm.sourecenetworkIP = "";

  } else {
    for (let i = 0; i < NetworkOptions.value.length; i++) {
      if (NetworkOptions.value[i].ID == state.properForm.sourecenetworkID) {
        state.properForm.sourecenetworkIP = NetworkOptions.value[i].IP;
        state.properForm.sourecenetworkPort = NetworkOptions.value[i].Port;
      }
    }

  }


};
// 目的节点中-网口类-目的地址菜单菜单联动
const onChangeEndNetworkChoose = (value: any) => {
  if (state.properForm.localnetworkID == '-1') {
    state.properForm.IPlist = [{
      IP: '',
      Port: '',
      messPackProperty: '无',
      reForwardSocket: '新SOCKET',
      ipType: '通用地址'
    }];
  } else {

    for (let i = 0; i < NetworkLocalOptions.value.length; i++) {
      if (NetworkLocalOptions.value[i].ID == state.properForm.localnetworkID) {

        state.properForm.IPlist = [{
          IP: NetworkLocalOptions.value[i].IP,
          Port: NetworkLocalOptions.value[i].Port,
          messPackProperty: '无',
          reForwardSocket: '新SOCKET',
          ipType: '通用地址'
        }];
      }
    }


  }


};

// 开始节点中-串口类-本地地址菜单菜单联动
const onChangeStartSerialChoose = (value: any) => {
  if (state.properForm.serialID == '-1') {
    state.properForm.BAUD = "";
    state.properForm.SerialNO = "0";

  } else {
    let i = 0;
    for (; i < SerialOptions.value.length; i++) {
      if (SerialOptions.value[i].ID == state.properForm.serialID) {
        state.properForm.BAUD = SerialOptions.value[i].BAUD;
        state.properForm.SerialNO = SerialOptions.value[i].SerialNO;
      }
    }

  }


};
const onChangeEndSerialChoose = (value: any) => {
  if (state.properForm.serialID == '-1') {
    state.properForm.BAUD = "";
    state.properForm.SerialNO = "0";

  } else {
    let i = 0;
    for (; i < SerialOptions.value.length; i++) {
      if (SerialOptions.value[i].ID == state.properForm.serialID) {
        state.properForm.BAUD = SerialOptions.value[i].BAUD;
        state.properForm.SerialNO = SerialOptions.value[i].SerialNO;
      }
    }

  }


};
// 扩展表单-重置
const onExtendRefresh = () => {
  extendFormRef.value.resetFields();
  state.proper.name = '';
  state.properForm.interfacetype = '';
  state.properForm.dataType = '通用数据';
  state.properForm.sourecenetworkID = '';
  state.properForm.sourecenetworkIP = '';
  state.properForm.sourecenetworkPort = '';
  state.properForm.serialID = '';
  state.properForm.SerialNO = '';
  state.properForm.BAUD = '';
  state.properForm.localnetworkID = '';
  state.properForm.IP = '';
  state.properForm.Port = '';
  state.properForm.pacparseID = '';
  state.properForm.pacencapID = '';
  state.properForm.messheaderparseID = '';
  state.properForm.messbodyparseID = '';
  state.properForm.messbodyencapID = '';
  state.properForm.messheaderencapID = '';
  state.properForm.transid = '';
  state.properForm.globalVarName = '';
  state.properForm.sourceData = '';
  state.properForm.converName = '';

};
const onChangeMessTranslateChoose = () => {
  let targetid = 0;
  for (let i = 0; i < MessTraslateOptions.value.length; i++) {
    if (MessTraslateOptions.value[i].ID == state.properForm.transid) {
      targetid = MessTraslateOptions.value[i].targetID;

    }
  }

  for (let i of MessBodyOptions.value) {
    if (i.ID == targetid) {
      state.properForm.messbodyID = i.ID;
      state.properForm.messbodyName = i.Name;
      state.properForm.messbodyEName = i.EName;
      state.properForm.messbodyType = i.Type;
    }
  }
  getMessTraslateDetail(targetid, state.properForm.transid, 'body');
}
const onExtendEditMessTranslate = () => {
  translateDialogRef.value.openDialog(state.node.id, state.properForm.messtranslatedata, state.fd, state.gd);

};
const onChangeMessheaderEncapChoose = () => {
  for (let i of MessHeaderOptions.value) {
    if (i.ID == state.properForm.messheaderencapID) {
      state.properForm.messheaderName = i.Name;
      state.properForm.messheaderEName = i.EName;
      state.properForm.messheaderType = i.Type;
    }
  }
  getMessTraslateDetail(state.properForm.messheaderencapID, -1, 'header');
}
const onExtendEditMessheader = () => {
  //messDialogRef.value.openDialog('header', state.properForm.messheaderencapID);
  console.log(fieldsoptions.value);
  translateDialogRef.value.openDialog(state.node.id, state.properForm.messtranslatedata, state.fd, state.gd);
  // translateDialogRef.value.openDialog(state.node.id, state.properForm.messtranslatedata);

};
const viewNess = () => {
  if (state.showFlag['messheaderparse']) {
    viewDialogRef.value.openDialog('header', state.properForm.messheaderparseID);
  }
  if (state.showFlag['messbodyencap']) {
    viewDialogRef.value.openDialog('body', state.properForm.messbodyencapID);
  }
  if (state.showFlag['messbodyparse']) {
    viewDialogRef.value.openDialog('body', state.properForm.messbodyparseID);
  }

};
const onAddEndIP = () => {
  state.properForm.IPlist.push({
    IP: '',
    Port: '0',
    messPackProperty: '无',
    reForwardSocket: '新SOCKET',
    ipType: '通用地址'
  });
};
const onDelEndIP = (k: number) => {
  state.properForm.IPlist.splice(k, 1);
};
const onExtendGlobalVar = () => {
  globalEditDialogRef.value.openDialog('add', state.properForm.messheaderparseID);
};
const messTranslateModify = (data) => {
  state.properForm.messtranslatedata = data;
  onExtendSubmit();
}
// 扩展表单-保存
const onExtendSubmit = () => {
  extendFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading.extend = true;
      if (state.tabsActive == '0') {
        ElMessage.error("请选择节点后再保存");
        state.loading.extend = false;
        return;
      }
      if (state.edge != '') {
        onLineTextChange();
        return;
      }
      const nodeModel = state.lf.getNodeModelById(state.node.id);
      if (state.properForm.tempData != '') {
        state.properForm.nodeData = state.properForm.tempData;
        state.properForm.nodeDataContent = state.properForm.tempDataContent;
        delete state.properForm.tempDataContent;
        delete state.properForm.tempData;
      }
      if (state.node.type == 'conver') {
        state.properForm.converName = state.proper.name;
      }
      if (state.node.type == 'inpac') {
        state.properForm.inpacName = state.proper.name;
      }
      nodeModel.updateText(state.proper.name);
      nodeModel.setProperties(state.properForm);

      emit('submit');
      setTimeout(() => {
        state.loading.extend = false;

        emit('close');
      }, 300);
    } else {
      return false;
    }
  });
};
// 图表可视化-初始化
const initChartsMonitor = () => {
  const myChart = echarts.init(chartsMonitorRef.value);
  const numsOne = [];
  const numsTwo = [];
  for (let i = 0; i < 7; i++) {
    numsOne.push(`${Math.floor(Math.random() * 52 + 10)}:${Math.floor(Math.random() * 52 + 1)}`);
    numsTwo.push(Math.floor(Math.random() * 52 + 1));
  }
  const option = {
    grid: {
      top: 50,
      right: 30,
      bottom: 30,
      left: 50,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: numsOne,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        itemStyle: {
          color: '#289df5',
          borderColor: '#289df5',
          areaStyle: {
            type: 'default',
            opacity: 0.1,
          },
        },
        data: numsTwo,
        type: 'line',
        areaStyle: {},
      },
    ],
  };
  myChart.setOption(option);
  nextTick(() => {
    myChart.resize();
  });
};

// 暴露变量
defineExpose({
  getParentData, getFdGdData
});
onMounted(async () => {

  getNetwork();
  getSerial();
  getPackage();
  getMessHeader();
  getMessBody();
  getMessTraslate();
  getOptionList();
});
</script>

<style scoped lang="scss">
.customproper {
  padding-bottom: 20px;
}

:deep(.el-form-item__label) {
  margin-left: -10px;
}

//解决按钮过多延长至第二排问题
.btn {
  display: flex;
  justify-content: center;

  :deep() {
    .el-form-item__content {
      margin-left: 30px !important;
    }
  }
}

:deep(.max-width-row) {
  // max-width: 310px; /* 你想要的最大宽度 */
  width: 320px;
  margin: 0 auto;

  /* 水平居中 */
}

.workflow-drawer-node {
  :deep() {
    .el-tabs {
      box-shadow: unset;
      border: unset;

      .el-tabs__nav {
        display: flex;
        width: 100%;

        .el-tabs__item {
          flex: 1;
          padding: unset;
          text-align: center;

          &:first-of-type.is-active {
            border-left-color: transparent;
          }

          &:last-of-type.is-active {
            border-right-color: transparent;
          }
        }
      }


    }
  }
}
</style>
