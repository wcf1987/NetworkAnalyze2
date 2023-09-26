// 左侧菜单导航数据
export const leftNavList = [
	{
		title: '基础节点',
		icon: 'iconfont icon-shouye',
		isOpen: true,
		id: '1',
		children: [
			{
				icon: '/src/assets/svgicon/start.svg',
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
				icon: '/src/assets/svgicon/target.svg',
				name: '目的节点',
				id: '12',
				type:'end',
				form: [
					{
						type: 'input',
						label: '目的地址',
						prop: 'grade',
						placeholder: '请输入目的地址',
						required: false,
						disabled: false,
					},
					{
						type: 'input',
						label: '目的端口',
						prop: 'password',
						placeholder: '请输入目的端口',
						required: true,
						disabled: false,
					},
				],
			},
			{
				icon: '/src/assets/svgicon/pacparse.svg',
				name: '头部解析',
				type: 'pacparse',
				id: '13',
				form: [
					{
						type: 'input',
						label: '数据表',
						prop: 'dataSheet',
						placeholder: '请输入数据表',
						required: true,
						disabled: false,
					},
					{
						type: 'input',
						label: '字段配置',
						prop: 'field',
						placeholder: '请输入字段配置',
						required: true,
						disabled: false,
					},
				],
			},
			{
				icon: '/src/assets/svgicon/pacencap.svg',
				name: '头部添加',
				type: 'pacencap',
				id: '14',
				form: [
					{
						type: 'input',
						label: '发布模板',
						prop: 'publish',
						placeholder: '请输入发布模板',
						required: true,
						disabled: false,
					},
				],
			},
			{
				icon: '/src/assets/svgicon/messparse.svg',
				name: '消息解析',
				 type: 'messparse',
				id: '15',
				form: [
					{
						type: 'input',
						label: '内容模板',
						prop: 'content',
						placeholder: '请输入内容模板',
						required: true,
						disabled: false,
					},
				],
			},
			{
				icon: '/src/assets/svgicon/messtraslate.svg',
				name: '消息转化',
				type: 'messtraslate',
				id: '16',
				form: [
					{
						type: 'input',
						label: '活动名称6',
						prop: 'name16',
					},
				],
			},
			{
				icon: '/src/assets/svgicon/swich.svg',
				name: '条件分支',
				type: 'swich',
				id: '17',
				form: [
					{
						type: 'input',
						label: '活动名称6',
						prop: 'name16',
					},
				],
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
				icon: '/src/assets/svgicon/spemark.svg',
				name: '特殊标记',
				id: '21',
				 type: 'spemark',
				form: [
					{
						type: 'input',
						label: '活动名称7',
						prop: 'name21',
					},
				],
			},
			{
				icon: '/src/assets/svgicon/timemark.svg',
				name: '时间标记',
				 type: 'timemark',
				id: '22',
				form: [
					{
						type: 'input',
						label: '活动名称8',
						prop: 'name22',
					},
				],
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
				icon: '/src/assets/svgicon/timer.svg',
				name: '定时器',
				 type: 'timer',
				id: '31',
				form: [
					{
						type: 'input',
						label: '活动名称1',
						prop: 'name31',
					},
				],
			},
			{
				icon: '/src/assets/svgicon/statistics.svg',
				name: '数据统计',
				 type: 'statistics',
				id: '32',
				form: [
					{
						type: 'input',
						label: '活动名称2',
						prop: 'name32',
					},
				],
			},
			{
				icon: '/src/assets/svgicon/calc.svg',
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
