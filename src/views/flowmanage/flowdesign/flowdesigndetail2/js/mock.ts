// 左侧菜单导航数据
import starticon from '/@/assets/svgicon/start.svg';
import targeticon from '/@/assets/svgicon/target.svg';
import pacparseicon from '/@/assets/svgicon/pacparse.svg';
import pacencapicon from '/@/assets/svgicon/pacencap.svg';
import messparseicon from '/@/assets/svgicon/messparse.svg';
import messtraslateicon from '/@/assets/svgicon/messtraslate.svg';
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
				type:'start',
				form: [
					{
						type: 'input',
						label: '源地址',
						prop: 'souraddr',
						placeholder: '请输入源地址',
						required: false,
						disabled: false,
					},
					{
						type: 'input',
						label: '源端口',
						prop: 'sourport',
						placeholder: '请输入源端口',
						required: false,
						disabled: false,

					},
					{
						type: 'select',
						label: '本机地址',
						prop: 'taraddr',
						placeholder: '请输入本机地址',
						required: true,
						disabled: false,
						options: [
							{
								value: '测试网口1',
								label: '测试网口1',
							},
							{
								value: '测试串口1',
								label: '测试串口1',
							},
						],
					},
					{
						type: 'select',
						label: '本机端口',
						prop: 'tarport',
						placeholder: '请输入本机端口',
						required: true,
						disabled: false,
						options: [
							{
								value: '测试端口1',
								label: '测试端口1',
							},
							{
								value: '测试端口1',
								label: '测试端口1',
							},
						],

					},

				],
			},
			{
				icon: targeticon,
				name: '目的节点',
				id: '12',
				type:'end',

			},
			{
				icon: pacparseicon,
				name: '头部解析',
				type: 'pacparse',
				id: '13',

			},
			{
				icon: pacencapicon,
				name: '头部添加',
				type: 'pacencap',
				id: '14',

			},
			{
				icon: messparseicon,
				name: '消息解析',
				 type: 'messparse',
				id: '15',

			},
			{
				icon: messtraslateicon,
				name: '消息转化',
				type: 'messtraslate',
				id: '16',

			},
			{
				icon: swichicon,
				name: '条件分支',
				type: 'swich',
				id: '17',

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

			},
			{
				icon: timemarkicon,
				name: '时间标记',
				 type: 'timemark',
				id: '22',

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

			},
			{
				icon: statisticsicon,
				name: '数据统计',
				 type: 'statistics',
				id: '32',

			},
			{
				icon: calcicon,
				name: '计算节点',
				 type: 'calc',
				id: '33',
				form: [
					{
						type: 'input',
						label: '活动名称3',
						prop: 'name33',
					},
				],
			},
		],
	},
];
