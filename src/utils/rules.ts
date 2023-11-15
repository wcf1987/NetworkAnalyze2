
// 类似金钱,首位不为0,最多2位小数
import {verifyCodeName, verifyIPAddress} from "/@/utils/toolsValidate";

export function checkNumPot2(rule, value, callback) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!value) {
    return callback(new Error('请填写数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请填写数字,最多2位小数'))
  } else {
    callback()
  }
}

// 身份证
export function checkIdNum(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    return callback(new Error('证件号码不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('证件号码不正确'))
  } else {
    callback()
  }
}
// 变量名
export function checkCodeName(rule, value, callback) {
  if (!verifyCodeName(value)) {
    return callback(new Error('请填写合法的引用名（字母开头，允许2-10位，允许字母数字下划线）'))
  } else{
       callback()

  }
}
// 整数
export function checkInterNum(rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  if (!value) {
    return callback(new Error('请填写整数'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入整数'))
  } else {
    callback()
  }
}
// 端口
export function checkPort(rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  if (!value) {
    return callback(new Error('请填写整数'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入整数'))
  } else { if(parseInt(value)<=65535){
       callback()
  }else{
      callback(new Error('端口为数字1-65535'))
  }

  }
}
// IP
export function checkIP(rule, value, callback) {

  if (!verifyIPAddress(value)) {
    return callback(new Error('请填写合法的IP格式'))
  } else{
       callback()

  }
}
    // 手机号码自定义验证规则
export function  telValidator (rule, value, callback) {
	  if (!value) {
	    callback(new Error("请输入手机号"));
	  } else if (!/^1[3456789]\d{9}$/.test(value)) {
	    callback(new Error("手机号格式不正确"));
	  } else {
	    callback();
	  }
	};

export default {
telValidator,checkInterNum,checkIdNum,checkPort
}