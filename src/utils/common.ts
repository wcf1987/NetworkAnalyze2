// 导航数据
export const FieldType = [
    {id: 1, label: 'int8_t', length: 1,value:'int8_t'},
    {id: 2, label: 'int16_t', length: 2,value:'int16_t'},
    {id: 3, label: 'int32_t', length: 4,value:'int32_t'},
    {id: 4, label: 'int64_t', length: 8,value:'int64_t'},
    {id: 5, label: 'uint8_t', length: 1,value:'uint8_t'},
    {id: 6, label: 'uint16_t', length: 2,value:'uint16_t'},
    {id: 7, label: 'uint32_t', length: 4,value:'uint32_t'},
    {id: 8, label: 'uint64_t', length: 8,value:'uint64_t'},
    {id: 9, label: 'float', length: 4,value:'float'},
    {id: 10, label: 'double', length: 8,value:'double'},
    {id: 11, label: 'bit', length: 1,value:'bit'},

];
export const NetworkProtocol = [
    {id: 1, label: 'TCP', value: 'TCP'},
    {id: 2, label: 'UDP', value: 'UDP'},


];
export const FunctionType = [
    {id: '三角函数', label: '三角函数', value: '三角函数',children:[]},
    {id: '字符串计算', label: '字符串计算', value: '字符串计算',children:[]},
    {id: '日期计算', label: '日期计算', value: '日期计算',children:[]},
    {id: '类型转换', label: '类型转换', value: '类型转换',children:[]},
    {id: '列表函数', label: '列表函数', value: '列表函数',children:[]},
    {id: '字典函数', label: '字典函数', value: '字典函数',children:[]},
{id: '自定义函数', label: '自定义函数', value: '自定义函数',children:[]},


];
export const PackageHeader = [
    {id: 1, label: '应用头', value: '应用头'},
    {id: 2, label: '封装头', value: '封装头'},

];
export const MessHeader = [
    {id: 1, label: '固定长度', value: '固定长度'},
    {id: 2, label: 'S', value: 'S'},
     {id: 3, label: 'K', value: 'K'},
     {id: 4, label: 'Z', value: 'Z'},
    {id: 5, label: '应用层协议头', value: '应用层协议头'},

];
export const DataFlag = [
    {id: 1, label: '数据域（数据）', value: '数据域（数据）'},
    {id: 2, label: '数据域（数据组数量）', value: '数据域（数据组数量）'},
    {id: 3, label: '标识域（FPI）', value: '标识域（FPI）'},
    {id: 4, label: '标识域（FRI）', value: '标识域（FRI）'},
    {id: 5, label: '标识域（GPI）', value: '标识域（GPI）'},
    {id: 6, label: '标识域（GRI）', value: '标识域（GRI）'},


];
