// 左侧菜单导航数据
import starticon from '/@/assets/svgicon/start.svg';
import targeticon from '/@/assets/svgicon/target.svg';
import pacparseicon from '/@/assets/svgicon/pacparse.svg';
import pacencapicon from '/@/assets/svgicon/pacencap.svg';
import messtraslateicon from '/@/assets/svgicon/messtraslate.svg';
import messheaderparseicon from '/@/assets/svgicon/messheaderparse.svg';
import messheaderencapicon from '/@/assets/svgicon/messheaderencap.svg';
import messbodyparseicon from '/@/assets/svgicon/messbodyparse.svg';
import messbodyencapicon from '/@/assets/svgicon/messbodyencap.svg';

import swichicon from '/@/assets/svgicon/swich.svg';
import spemarkicon from '/@/assets/svgicon/spemark.svg';
import timemarkicon from '/@/assets/svgicon/timemark.svg';
import timericon from '/@/assets/svgicon/timer.svg';
import statisticsicon from '/@/assets/svgicon/statistics.svg';
import calcicon from '/@/assets/svgicon/calc.svg';

export const leftNavList = [
    {
        title: '基础节点',
        icon: 'iconfont icon-shouye',
        isOpen: true,
        id: '1',
        children: [
            {
                icon: starticon,
                name: '开始节点',
                id: '11',
                type: 'start',
                descrip: '流程的第一个节点',

            },
            {
                icon: targeticon,
                name: '目的节点',
                id: '12',
                type: 'end',
                descrip: '流程的最终节点，可以有多个',

            },
            {
                icon: pacparseicon,
                name: '封装/应用头解析',
                type: 'pacparse',
                id: '13',
                descrip: '封装头或者应用头的解析',
            },
            {
                icon: pacencapicon,
                name: '封装/应用头添加',
                type: 'pacencap',
                id: '14',
                descrip: '封装或应用头的添加',

            }, {
                icon: messheaderparseicon,
                name: '消息头解析',
                type: 'messheaderparse',
                id: '15',
                descrip: '消息头按格式解析',

            },
            {
                icon: messheaderencapicon,
                name: '消息头添加',
                type: 'messheaderencap',
                id: '15',
                descrip: '设定消息头添加规则',
            },
            {
                icon: messbodyparseicon,
                name: '消息体解析',
                type: 'messbodyparse',
                id: '15',
                descrip: '消息体按规则解析',
            },
            {
                icon: messbodyencapicon,
                name: '消息体添加',
                type: 'messbodyencap',
                id: '15',
                descrip: '设定消息体添加规则',
            },
            {
                icon: messtraslateicon,
                name: '消息转化',
                type: 'messtraslate',
                id: '16',
                descrip: '按设定好规则转化消息体',
            },
            {
                icon: swichicon,
                name: '条件分支',
                type: 'swich',
                id: '17',
                descrip: '逻辑判断节点，可选择不同分支',
            },
        ],
    },
    {
        title: '全局变量',
        isOpen: true,

        icon: 'iconfont icon-caijian',
        id: '2',
        children: [
            {
                icon: spemarkicon,
                name: '特殊标记',
                id: '21',
                type: 'spemark',
                descrip: '全局变量，可做特殊标记',
            },
            {
                icon: timemarkicon,
                name: '时间标记',
                type: 'timemark',
                id: '22',
                descrip: '全局变量，时间戳',
            },

        ],
    },
    {
        title: '特殊节点',
        isOpen: true,

        icon: 'iconfont icon-shuju',
        id: '3',
        children: [
            {
                icon: timericon,
                name: '定时器',
                type: 'timer',
                id: '31',
				descrip: '定时器，用来计时',
            },
            {
                icon: statisticsicon,
                name: '数据统计',
                type: 'statistics',
                id: '32',
				descrip: '数据统计模块',
            },
            {
                icon: calcicon,
                name: '计算节点',
                type: 'calc',
                id: '33',
               descrip: '特定计算节点',
            },
        ],
    },
];
