// 导航数据
export const filtering = [
    {
        title: '权限',
        isMore: false,
        isShowMore: false,
        id: 0,
        children: [
            {
                id: '01',
                label: '全部',
                active: true,
            },
            {
                id: '02',
                label: '普通用户',
                active: false,
            },
            {
                id: '03',
                label: '管理员',
                active: false,
            },
        ],
    },
    {
        title: '布局',
        isMore: false,
        isShowMore: false,
        id: 1,
        children: [
            {
                id: 11,
                label: '全部',
                active: true,
            },
            {
                id: 12,
                label: '默认',
                active: false,
            },
            {
                id: 13,
                label: '经典',
                active: false,
            },
            {
                id: 14,
                label: '横向',
                active: false,
            },
            {
                id: 15,
                label: '分栏',
                active: false,
            },
        ],
    },
    {
        title: '配置',
        isMore: false,
        isShowMore: false,
        id: 2,
        children: [
            {
                id: 21,
                label: '全部',
                active: true,
            },
            {
                id: 22,
                label: '开启 Breadcrumb',
                active: false,
            },
            {
                id: 23,
                label: '开启 Tags-View',
                active: false,
            },
            {
                id: 24,
                label: '固定 Header',
                active: false,
            },
            {
                id: 25,
                label: '侧边栏 Logo',
                active: false,
            },
            {
                id: 26,
                label: '开启折叠 NavMenu',
                active: false,
            },
            {
                id: 27,
                label: '开启一个 NavMenu 展开',
                active: false,
            },
            {
                id: 28,
                label: '登录用户头像',
                active: false,
            },
        ],
    },
];

// 列表数据
export const filterList = [
    {
        Name: '时间统计插件',
		Type:'统计类',
        describe: '通用流程设计方案测试',
        Version: '1.3.2',
        InputPar: 's1',
        OutputPar: 'o1',
        Plugfile: 'Cacl.func',
        isSetup: true,
        id: 1,
    },
    {
        Name: '计算节点插件',
		Type:'计算类',
        describe: '计算指定节点运算结果',
        Version: '2.0.1',
        InputPar: 's2',
        OutputPar: 'out3',
        Plugfile: 'cc.func',
        isSetup: true,
        id: 2,
    },
    {
        Name: '数据统计插件',
		Type:'统计类',
        describe: '统计指定数据',
        Version: '0.1.3',
        InputPar: 's3',
        OutputPar: 'o2',
        Plugfile: 'total.func',
        isSetup: false,
        id: 3,
    }
];
