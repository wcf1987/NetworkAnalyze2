<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="900px" :draggable="true">
      <div class="container">

        <div class="workflow-left" v-if="state.ruleForm.Optional=='自定义转换计算'">
          <el-scrollbar>
            <div
                ref="leftNavRefs"
                v-for="val in state.leftNavList"
                :key="val.id"
                :style="{ height: val.isOpen ? 'auto' : '50px', overflow: 'hidden' }"
                class="workflow-left-id"
            >
              <div class="workflow-left-title" @click="onTitleClick(val)">
                <span>{{ val.title }}</span>
                <SvgIcon :name="val.isOpen ? 'ele-ArrowDown' : 'ele-ArrowRight'"/>
              </div>

              <div class="workflow-left-item" v-for="(v, k) in val.children" :key="k"
                   :data-name="v.name" :data-icon="v.icon" :data-id="v.id"
                   draggable="true" @dragstart="onDragStart(v.name,$event)">
                <!--     @click="onFuncClick(v.name)" -->


                <div class="workflow-left-item-icon">
                  <SvgIcon :name="v.icon" class="workflow-icon-drag" :left=0
                           :size=16></SvgIcon>
                  <div class="font10 pl5 name">{{ v.name }}</div>
                </div>


              </div>

            </div>
          </el-scrollbar>
        </div>

        <div class="rightdiv" @drop="onDrop($event)" @dragover.prevent>
          <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
                   label-width="90px">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="转换名称" prop="TName">
                  <el-input v-model="state.ruleForm.TName" placeholder="请输入名称" clearable></el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="目的字段" prop="Name">
                  <el-input v-model="state.ruleForm.Name" placeholder="" clearable
                            readonly='true'></el-input>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="转换模式" prop="Optional">
                  <el-select v-model="state.ruleForm.Optional" placeholder="请选择" clearable
                             class="w100">
                    <el-option label="默认值" value="默认值"></el-option>
                    <el-option label="直接转换" value="直接转换"></el-option>

                    <el-option label="自定义转换计算" value="自定义转换计算"></el-option>

                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                      v-if="state.ruleForm.Optional=='默认值'">
                <el-form-item label="默认值" prop="Transrule">
                  <el-input v-model="state.ruleForm.Transrule" placeholder="" clearable></el-input>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                      v-if="state.ruleForm.Optional=='直接转换'">

                <el-form-item label="源字段" prop="SourceData">

                  <el-cascader v-model="state.ruleForm.SourceData" :options="sourceoptions"
                               :props="props21"
                               @change="changeSourceInput21"
                               clearable
                               style="width: 300px; " collapse-tags :disabled="true"/>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                      v-if="state.ruleForm.Optional=='系统函数'">

                <el-form-item label="源字段" prop="SourceData">

                  <el-cascader v-model="state.ruleForm.SourceData" :options="sourceoptions"
                               :props="props21"
                               @change="changeSourceInput21"
                               clearable
                               style="width: 300px; " collapse-tags/>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20"
                      v-if="state.ruleForm.Optional=='系统函数'">

                <el-form-item label="转换公式" prop="Transrule" clearable>
                  <el-input
                      :autosize="{ minRows: 2, maxRows: 10 }"
                      type="textarea"
                      placeholder="请输入转换公式"
                      v-model="state.ruleForm.Transrule" autocomplete="off"/>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                      v-if="state.ruleForm.Optional=='自定义转换计算'">

                <el-form-item label="源字段" prop="SourceData">

                  <el-cascader v-model="state.ruleForm.SourceData" :options="sourceoptions"
                               :props="props21"
                               @change="changeSourceInput21"
                               clearable
                               style="width: 300px; " collapse-tags :disabled="true"/>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20"
                      v-if="state.ruleForm.Optional=='自定义转换计算'">

                <el-form-item label="转换公式" prop="Transrule" clearable>
                  <el-input
                      :autosize="{ minRows: 2, maxRows: 10 }"
                      type="textarea"
                      placeholder="请输入转换公式"
                      v-model="state.ruleForm.Transrule" autocomplete="off"/>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="用户描述">
                  <el-input v-model="state.ruleForm.Describes" type="textarea" placeholder="请输入用户描述"
                            maxlength="150"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <span class="dialog-footer">
                            <el-button @click="onCancel" size="default">取 消</el-button>
                            <el-button type="primary" @click="onSubmit"
                                       size="default">{{ state.dialog.submitTxt }}</el-button>
                        </span>


        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemUserDialog">
import {nextTick, onMounted, reactive, ref} from 'vue';
import {messdetailApi} from "/@/api/sysmanage/messdetail";
import {ElMessage} from "element-plus";
import {messtranslateApi} from "/@/api/sysmanage/messtranslate";
import {functionplugManageApi} from "/@/api/plugmanage/functionplugmanage";
import {FunctionType} from '/@/utils/common';
import {leftNavList} from './js/mock';
import func from "/@/assets/svgicon/func.svg";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh', 'delConn']);
const sourceoptions = ref();
// 定义变量内容
const userDialogFormRef = ref();

const funcoptions = ref([
  {name: 'Calc()'},
  {name: 'Substr()'},
  {name: 'Splice()'},
  {name: 'Push()'},
  {name: 'Add()'},
  {name: 'Encode()'},
])
// 左侧导航-数据初始化
const initLeftNavList = () => {

  state.Type = '引用函数';
  //console.log(leftNavList)
  //console.log(state.Type);
  if (state.Type == '引用函数') {
    state.leftNavList = leftNavList;

  }

  functionplugManageApi().search(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          let convlist = state.leftNavList[0];

          convlist.children = new Array();
          for (let i = 0, k = 0; k < res.data.length; k++) {

            convlist.children[i] = {
              icon: func,
              name: res.data[k].Name,
              type: res.data[k].Type,
              id: res.data[k].ID,
              descrip: res.data[k].Describes,
            }
            i++
          }


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });


};
const getOptionData = () => {
  funcoptions.value = JSON.parse(JSON.stringify(FunctionType));
  // funcoptions.value=FunctionType.slice()
  console.log(funcoptions.value)
  functionplugManageApi().search(
      {


        pageNum: 1,
        pageSize: 1000,
        name: '',

      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {
          for (let k of res.data) {

            for (let i of funcoptions.value) {
              if (k['Type'] == i['label']) {
                i['children'].push({id: k['ID'], label: k['Name'], value: k['Name']})
              }
              //funcoptions.value = res.data
            }
          }
          console.log(funcoptions)
          //locOptions.value.push({ID:-1,Name:'最后'});
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}

// 左侧导航-菜单标题点击
const onTitleClick = (val: any) => {
  val.isOpen = !val.isOpen;
};

const onDragStart = (val, event) => {
  const data = val;
  event.dataTransfer.setData('funcData', data);
}
const onDrop = (event) => {
  const data = event.dataTransfer.getData('funcData');
  if (state.ruleForm.Transrule == null) {
    state.ruleForm.Transrule = '';
  }
  state.ruleForm.Transrule = state.ruleForm.Transrule + ' ' + data + '(params)';
}
// 左侧函数点击
const onFuncClick = (val: any) => {
  if (state.ruleForm.Transrule == null) {
    state.ruleForm.Transrule = '';
  }
  state.ruleForm.Transrule = state.ruleForm.Transrule + ' ' + val + '(params)';
};
const getMenuOptions = () => {

  messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: state.sourceid,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'body',
        nestid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          sourceoptions.value = res.data;
          //locOptions.value.push({ID:-1,Name:'最后'});
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const props1 = {
  multiple: false,
  expandTrigger: 'hover',
  value: 'EName',
  label: 'Name'
}
const props21 = {
  multiple: true,
  expandTrigger: 'hover',
  value: 'Name',
  label: 'Name'
}
const props22 = {
  expandTrigger: 'hover',
  emitPath: 'false',
  value: 'value',
  label: 'label'
}
const props32 = {
  multiple: true,
  emitPath: 'false',
  expandTrigger: 'hover',

  value: 'value',
  label: 'label'
}

const state = reactive({
  FlowName: '',
  ID: 0,
  type: '流程编排',
  original: '',
  leftNavList: [],


  ruleForm: {
    Name: '', // 账户名称
    TargetName: '',
    Type: '', // 用户昵称
    Optional: '',
    Transrule: '',
    SourceData: '',
    Funcrule: '',
    Describes: '', // 用户描述
  },
  baseRules: {
    TName: [{required: true, message: '请输入转换名称', trigger: 'blur'}],
    Optional: [{required: true, message: '请选择转换模式', trigger: 'change'}],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});
const changeSourceInput = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''
  for (i = 0; i < fo.length; i++) {
    tempstr = tempstr + fo[i]
  }
  state.value.ruleForm.Transrule = [tempstr];


}
const changeSourceInput12 = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''
  for (i = 0; i < fo.length; i++) {
    tempstr = tempstr + fo[i]
  }
  state.ruleForm.Transrule = tempstr;


}
const changeSourceInput21 = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''
  for (i = 0; i < fo.length; i++) {
    tempstr = tempstr + fo[i] + '\n'
  }
  state.ruleForm.Transrule = state.ruleForm.Funcrule + tempstr;


}
const changeSourceInput22 = (fo) => {
  console.log(fo)

  state.ruleForm.Transrule = fo[1];


}
const changeSourceInput32 = (fo) => {
  console.log(fo)
  let i = 0, tempstr = ''
  for (i = 0; i < fo.length; i++) {
    tempstr = tempstr + fo[i][1] + '\n'
  }
  state.ruleForm.Transrule = tempstr;


}
// 打开弹窗
const openDialog = (type: string, sourceid, row: RowUserType, original: string) => {
  state.original = original;
  state.targetid = row.ID;
  state.sourceid = sourceid;
  if (type === 'edit') {
    state.ruleForm = row;

    state.dialog.title = '修改';
    state.dialog.submitTxt = '修 改';
    console.log('修改');
  } else {
    state.dialog.title = '新增';
    state.dialog.submitTxt = '新 增';
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      userDialogFormRef.value.resetFields();
    });
  }
  state.dialog.isShowDialog = true;
  getMenuOptions();
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  console.log(state.original)
  if (state.original == 'addConn') {
    let conn={sourceId:state.sourceid, targetId:state.targetid};

     emit('delConn',conn);
  }
  closeDialog();
};
// 提交
const onSubmit = () => {
  userDialogFormRef.value.validate((valid) => {
    // console.log('123123');
    // 不通过校验
    if (!valid) {

      return ElMessage.error('请确保数据格式填写正确！');
    } else {
      state.ruleForm['SourceData'] = JSON.stringify(state.ruleForm.SourceData);
      state.ruleForm['Funcrule'] = JSON.stringify(state.ruleForm.Funcrule);

      messtranslateApi().updateMessTranslateDetail(
          state.ruleForm
      )
          .then(res => {
            //console.log(res);
            if (res.code == '200') {

              ElMessage.success("修改成功");
              closeDialog();
              emit('refresh');
            } else {
              ElMessage.error(res.message);
            }

          }).catch(err => {

      }).finally(() => {

      });
      // if (state.dialog.type === 'add') { }
    }
    ;
    // 初始化部门数据
  });
};
// 页面加载时
onMounted(() => {
  initLeftNavList();
  getOptionData();
});

// 暴露变量
defineExpose({
  openDialog,
});
</script>
<style scoped lang="scss">
.container {
  display: flex; /* 设定为flex布局 */

  .workflow-left {
    width: 320px;
    height: 100%;
    border-right: 1px solid var(--el-border-color-light, #ebeef5);

    :deep(.el-collapse-item__content) {
      padding-bottom: 0;
    }

    .workflow-left-title {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      border-top: 1px solid var(--el-border-color-light, #ebeef5);
      color: var(--el-text-color-primary);
      cursor: default;

      span {
        flex: 1;
      }
    }

    .workflow-left-item {
      display: inline-block;
      width: calc(50% - 15px);
      position: relative;
      cursor: move;
      margin: 0 0 10px 10px;
      user-select: none;

      .workflow-left-item-icon {
        height: 35px;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        padding: 5px 10px;
        border: 1px dashed transparent;
        background: var(--next-bg-color);
        border-radius: 3px;

        i,
        .name {
          color: var(--el-text-color-secondary);
          transition: all 0.3s ease;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }


        &:hover {
          transition: all 0.3s ease;
          border: 1px dashed var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          border-radius: 5px;

          i,
          .name {
            transition: all 0.3s ease;
            color: var(--el-color-primary);
          }
        }
      }
    }

    & .workflow-left-id:first-of-type {
      .workflow-left-title {
        border-top: none;
      }
    }
  }

  .rightdiv {
    width: 650px;
  }
}
</style>