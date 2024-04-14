
export const rolemenu=[

                       {
                path: '/homepage',
                name: 'homepage',
                component: 'home/homepage',
                meta: {
                    title: 'message.router.homepage',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: true,
                    isIframe: false,
                    roles: ['admin','common'],
                    icon: 'iconfont icon-shouye',
                },
            },
            {

                path: '/sysmanage',
                name: 'sysmanage',
                component:'layout/routerView/parent',
                redirect: '/homepage',
                meta: {
                    title: 'message.router.sysmanage',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-xitongshezhi',
                },
                children: [


                    {
                        path: '/sysmanage/address',
                        name: 'address',
                        component: 'sysmanage/address/index',
                        meta: {
                            title: 'message.router.address',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-diqiu',
                        },

                        children: [
                            {
                                path: '/sysmanage/address/networkinterface',
                                name: 'networkinterface',
                                component: 'sysmanage/address/networkinterface/index',
                                meta: {
                                    title: 'message.router.networkinterface',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'iconfont icon-caidan',
                                },
                            },
                            {
                                path: '/sysmanage/address/serial',
                                name: 'serial',
                                component: 'sysmanage/address/serial/index',
                                meta: {
                                    title: 'message.router.serial',
                                    isLink: '',
                                    isHide: false,
                                    isKeepAlive: true,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'iconfont icon-zhongyingwenqiehuan',
                                },
                            },
                        ],
                    },
                    {
                        path: '/sysmanage/package',
                        name: 'package',
                        component: 'sysmanage/package/index',
                        meta: {
                            title: 'message.router.package',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon--chaifenhang',
                        },
                        children: [
                            {
                                path: '/sysmanage/package/packagedetail',
                                name: 'packagedetail',
                                component: 'sysmanage/package/packagedetail',
                                meta: {
                                    title: 'message.router.packagedetail',
                                    isLink: '',
                                    isHide: true,
                                    isKeepAlive: false,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'ele-Sunny',
                                },
                            },
                        ],

                    },
                    /*{
                        path: '/system/app',
                        name: 'app',
                        component: 'system/user/index',
                        meta: {
                            title: 'message.router.app',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-bolangnengshiyanchang',
                        },
                    },*/
                    {

                        path: '/sysmanage/messheader',
                        name: 'messheader',
                        component: 'sysmanage/messheader/index',
                        meta: {
                            title: 'message.router.messheader',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-shuxingtu',
                        },
                        children: [
                            {
                                path: '/sysmanage/messheader/messheaderdetail',
                                name: 'messheaderdetail',
                                component: 'sysmanage/messheader/messheaderdetail',
                                meta: {
                                    title: 'message.router.messheaderdetail',
                                    isLink: '',
                                    isHide: true,
                                    isKeepAlive: false,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'ele-Sunny',
                                },
                            },
                        ],
                    }, {
                        path: '/sysmanage/messbody',
                        name: 'messbody',
                        component: 'sysmanage/messbody/index',
                        meta: {
                            title: 'message.router.messbody',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-ziti',
                        },
                        children: [
                            {
                                path: '/sysmanage/messbody/messbodydetail',
                                name: 'messbodydetail',
                                component: 'sysmanage/messbody/messbodydetail',
                                meta: {
                                    title: 'message.router.messbodydetail',
                                    isLink: '',
                                    isHide: true,
                                    isKeepAlive: false,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'ele-Sunny',
                                },
                            },
                        ],
                    }, {
                        path: '/sysmanage/messtraslate',
                        name: 'messtraslate',
                        component: 'sysmanage/messtraslate/index',
                        meta: {
                            title: 'message.router.messtraslate',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-neiqianshujuchucun',
                        },
                        children: [
                            {
                                path: '/sysmanage/messtraslate/messtraslatedetail',
                                name: 'messtraslatedetail',
                                component: 'sysmanage/messtraslate/messtraslatedetail',
                                meta: {
                                    title: 'message.router.messtraslatedetail',
                                    isLink: '',
                                    isHide: true,
                                    isKeepAlive: false,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'iconfont icon-zujian',
                                },
                            },
                        ],
                    }
                    , {
                        path: '/sysmanage/fieldcollection',
                        name: 'fieldcollection',
                        component: 'sysmanage/fieldcollection/index',
                        meta: {
                            title: 'message.router.fieldcollection',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon--chaifenhang',
                        },
                        children: [{
                            path: '/sysmanage/fieldcollection/fieldsdetail',
                            name: 'fieldsdetail',
                             component: 'sysmanage/fieldcollection/detail',
                            meta: {
                                title: 'message.router.fieldsdetail',
                                isLink: '',
                                isHide: true,
                                isKeepAlive: false,
                                isAffix: false,
                                isIframe: false,
                                roles: ['admin', 'common'],
                                icon: 'iconfont icon-ico_shuju',
                            },

                        }],
                    }
                ]

            },
            {

                path: '/flowmanage',
                name: 'flowmanage',
                component:'layout/routerView/parent',
                redirect: '/homepage',
                meta: {
                    title: 'message.router.flowmanage',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-tupianyulan',
                },
                children: [


                    {
                        path: '/flowmanage/flowdesign',
                        name: 'flowdesign',
                        component: 'flowmanage/flowdesign/index',
                        meta: {
                            title: 'message.router.flowdesign',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-putong',
                        },
                        children: [

                            {
                                path: '/flowmanage/flowdesign/flowdesigndetail2',
                                name: 'flowdesigndetail2',
                                component: 'flowmanage/flowdesign/flowdesigndetail2/index',
                                meta: {
                                    title: 'message.router.flowdesigndetail2',
                                    isLink: '',
                                    isHide: true,
                                    isKeepAlive: false,
                                    isAffix: false,
                                    isIframe: false,
                                    roles: ['admin', 'common'],
                                    icon: 'ele-Sunny',
                                },
                            },
                        ],
                    },
                    {
                        path: '/flowmanage/globalvar',
                        name: 'globalvar',
                        component: 'flowmanage/globalvar/index',
                        meta: {
                            title: 'message.router.globalvar',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-diqiu1',
                        },
                    }, {
                        path: '/flowmanage/specialnode',
                        name: 'specialnode',
                        component: 'flowmanage/specialnode/index',
                        meta: {
                            title: 'message.router.specialnode',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-zujian',
                        },
                    }
                ]

            },
              {

                path: '/distribution',
                name: 'distribution',
                component:'layout/routerView/parent',
                redirect: '/homepage',
                meta: {
                    title: 'message.router.distribution',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Guide',
                },
                children: [


                    {
                        path: '/distribution/gateway',
                        name: 'gateway',
                        component: 'distribution/gateway/index',
                        meta: {
                            title: 'message.router.gateway',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'ele-Cpu',
                        },
                    },
                    {
                        path: '/distribution/flowdistribution',
                        name: 'flowdistribution',
                        component: 'distribution/flowdistribution/index',
                        meta: {
                            title: 'message.router.flowdistribution',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'ele-Connection',
                        },
                    }
                ]

            },
            {

                path: '/pluginmanage',
                name: 'pluginmanage',
                component:'layout/routerView/parent',
                redirect: '/system/menu',
                meta: {
                    title: 'message.router.pluginmanage',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-zidingyibuju',
                },
                children: [


                    {
                        path: '/pluginmanage/sysplug',
                        name: 'sysplug',
                        component: 'pluginmanage/sysplug/index',
                        meta: {
                            title: 'message.router.sysplug',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-fuwenbenkuang',
                        },
                    },
                    {
                        path: '/pluginmanage/funcplug',
                        name: 'funcplug',
                        component: 'pluginmanage/funcplug/index',
                        meta: {
                            title: 'message.router.funcplug',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-siweidaotu',
                        },
                    }
                ]

            },

            {

                path: '/systemadmin',
                name: 'systemadmin',
                component:'layout/routerView/parent',
                redirect: '/system/menu',
                meta: {
                    title: 'message.router.systemadmin',
                    isLink: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-gongju',
                },
                children: [


                    {
                        path: '/systemadmin/usermanage',
                        name: 'usermanage',
                        component: 'systemadmin/usermanage/index',
                        meta: {
                            title: 'message.router.usermanage',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-icon-',
                        },
                    },
                    {
                        path: '/systemadmin/rolemanage',
                        name: 'rolemanage',
                        component: 'systemadmin/rolemanage/index',
                        meta: {
                            title: 'message.router.rolemanage',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-shouye',
                        },
                    },
                    {
                        path: '/systemadmin/logmanage',
                        name: 'logmanage',
                        component: 'systemadmin/logmanage/index',
                        meta: {
                            title: 'message.router.logmanage',
                            isLink: '',
                            isHide: false,
                            isKeepAlive: true,
                            isAffix: false,
                            isIframe: false,
                            roles: ['admin', 'common'],
                            icon: 'iconfont icon-xuanzeqi',
                        },
                    }
                ]

            },

        ]

