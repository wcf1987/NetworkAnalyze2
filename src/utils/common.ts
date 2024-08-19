// 导航数据
export const FieldType = [
    {id: 1, label: 'int8_t', length: 1, value: 'int8_t'},
    {id: 2, label: 'int16_t', length: 2, value: 'int16_t'},
    {id: 3, label: 'int32_t', length: 4, value: 'int32_t'},
    {id: 4, label: 'int64_t', length: 8, value: 'int64_t'},
    {id: 5, label: 'uint8_t', length: 1, value: 'uint8_t'},
    {id: 6, label: 'uint16_t', length: 2, value: 'uint16_t'},
    {id: 7, label: 'uint32_t', length: 4, value: 'uint32_t'},
    {id: 8, label: 'uint64_t', length: 8, value: 'uint64_t'},
    {id: 9, label: 'float', length: 4, value: 'float'},
    {id: 10, label: 'double', length: 8, value: 'double'},
    {id: 11, label: 'bit', length: 1, value: 'bit'},

];
export const NetworkProtocol = [
    {id: 1, label: 'TCP', value: 'TCP'},
    {id: 2, label: 'UDP', value: 'UDP'},


];
export const IPDevicePic = [
    {id: 1, src: '/src/assets/ipdevices/camera.png', text: '摄像头'},
    {id: 2, src: '/src/assets/ipdevices/dmjs.png', text: '卫星接收'},

    {id: 3, src: '/src/assets/ipdevices/dp.png', text: '火箭炮'},

    {id: 4, src: '/src/assets/ipdevices/firewall.png', text: '防火墙'},

    {id: 5, src: '/src/assets/ipdevices/fly1.png', text: '战斗机'},

    {id: 6, src: '/src/assets/ipdevices/fly2.png', text: '运输机'},

    {id: 7, src: '/src/assets/ipdevices/fwq.png', text: '服务器'},
    {id: 8, src: '/src/assets/ipdevices/home.png', text: '家庭接入'},

    {id: 9, src: '/src/assets/ipdevices/network.png', text: '网络中接'},

    {id: 10, src: '/src/assets/ipdevices/pc.png', text: '电脑'},

    {id: 11, src: '/src/assets/ipdevices/qst.png', text: '潜水艇'},

    {id: 12, src: '/src/assets/ipdevices/tank.png', text: '坦克'},

    {id: 13, src: '/src/assets/ipdevices/wrj.png', text: '无人机'},
    {id: 22, src: '/src/assets/ipdevices/weizhi.png', text: '未知设备'},
];

export const FunctionType = [
    {id: '三角函数', label: '三角函数', value: '三角函数', children: []},
    {id: '字符串计算', label: '字符串计算', value: '字符串计算', children: []},
    {id: '日期计算', label: '日期计算', value: '日期计算', children: []},
    {id: '类型转换', label: '类型转换', value: '类型转换', children: []},
    {id: '列表函数', label: '列表函数', value: '列表函数', children: []},
    {id: '字典函数', label: '字典函数', value: '字典函数', children: []},
    {id: '自定义函数', label: '自定义函数', value: '自定义函数', children: []},


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
export const DataType = [
    {id: 0, label: '通用数据', value: '通用数据'},
    {id: 1, label: '端机数据', value: '端机数据'},
    {id: 2, label: '47数据', value: '47数据'},


];
export const ActionType = [
    {id: 0, label: '发送数据', value: '发送数据'},
    {id: 1, label: '延缓执行', value: '延缓执行'},
    {id: 2, label: '其他1', value: '其他1'},


];
export const FilterType = [
    {id: 0, label: '通过', value: '通过'},
    {id: 1, label: '丢弃', value: '丢弃'},


];
export const ParseMethod = [
    {id: 0, label: '通用解析方法', value: '通用解析方法'},
    {id: 1, label: '解析MP封装', value: '解析MP封装'},
    {id: 2, label: '解析S消息头', value: '解析S消息头'},
    {id: 3, label: '解析K消息头', value: '解析K消息头'},

];
export const EncapMethod = [
    {id: 0, label: '通用增加方法', value: '通用增加方法'},
    {id: 1, label: '增加MP封装', value: '增加MP封装'},
    {id: 2, label: '增加S消息头', value: '增加S消息头'},
    {id: 3, label: '增加K消息头', value: '增加K消息头'},


];
export const MessPackProperty = [
    {id: 0, label: '无', value: '无'},
    {id: 1, label: '网管', value: '网管'},
    {id: 2, label: '端机', value: '端机'},
    {id: 3, label: '47001', value: '47001'},
    {id: 4, label: '运管', value: '运管'},

];
export const ReForwardSocket = [
    {id: 0, label: '新SOCKET', value: '新SOCKET'},
    {id: 1, label: '原有SOCKET', value: '原有SOCKET'},
    {id: 2, label: '默认地址的SOCKET', value: '默认地址的SOCKET'},
];
export const IPType=[
    {id: 0, label: '通用地址', value: '通用地址'},
    {id: 1, label: '网管', value: '网管'},

    {id: 2, label: '端机', value: '端机'},
];
export const VarType = [
    {id: 0, label: '消息标识', value: '消息标识'},
    {id: 1, label: '数据字段', value: '数据字段'},

];
export const SpecailNodeType = [
    {id: 0, label: '定时器节点', value: '定时器节点'},
    {id: 1, label: '数据统计节点', value: '数据统计节点'},
    {id: 2, label: '计算节点', value: '计算节点'},
    {id: 3, label: '延时器节点', value: '延时器节点'},
    {id: 4, label: '消息队列节点', value: '消息队列节点'},
    {id: 4, label: '过滤器节点', value: '过滤器节点'},
];