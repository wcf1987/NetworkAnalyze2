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
		img: 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Fd00.paixin.com%2Fthumbs%2F1561359%2F40842211%2Fstaff_1024.jpg&thumburl=https%3A%2F%2Fimg2.baidu.com%2Fit%2Fu%3D2936915106%2C3439149730%26fm%3D253%26fmt%3Dauto%3Fw%3D800%26h%3D800',
		title: '流程编排设计方案1',
		evaluate: '通用流程设计方案测试',
		collection: (Math.random() * 100).toFixed(2),
		author: 'admin',

		id: 1,
	},
	{
		img: 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Fd00.paixin.com%2Fthumbs%2F1561359%2F40842211%2Fstaff_1024.jpg&thumburl=https%3A%2F%2Fimg2.baidu.com%2Fit%2Fu%3D2936915106%2C3439149730%26fm%3D253%26fmt%3Dauto%3Fw%3D800%26h%3D800',
		title: '全空域网络通信流程',
		evaluate: '专家测试2023',
		collection: (Math.random() * 100).toFixed(2),
		author: 'admin',

		id: 2,
	},
	{
		img: 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Fd00.paixin.com%2Fthumbs%2F1561359%2F40842211%2Fstaff_1024.jpg&thumburl=https%3A%2F%2Fimg2.baidu.com%2Fit%2Fu%3D2936915106%2C3439149730%26fm%3D253%26fmt%3Dauto%3Fw%3D800%26h%3D800',
		title: '超高速导弹通讯设计方案1',
		evaluate: '最终定型方案A',
		collection: (Math.random() * 100).toFixed(2),
		author: 'admin',

		id: 3,
	}
];
