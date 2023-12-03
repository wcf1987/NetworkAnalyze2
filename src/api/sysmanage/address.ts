import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function addressApi() {

    return {
        delNetworkIDS: (data: object) => {
            return request({
                url: '/networkinter/delids',
                method: 'post',
                data,
            });
        },
        getNetworkList: (data: object) => {
            return request({
                url: '/networkinter/list',
                method: 'post',
                data,
            });
        },
        getNetworkListSize: (data: object) => {
            return request({
                url: '/networkinter/alllistnum',
                method: 'post',
                data,
            });
        },
        getNetworkSearchListSize: (data: object) => {
            return request({
                url: '/networkinter/searchSize',
                method: 'post',
                data,
            });
        },
        addNetworkInter: (data: object) => {
            return request({
                url: '/networkinter/add',
                method: 'post',
                data,
            });
        },
		        updateNetworkInter: (data: object) => {
            return request({
                url: '/networkinter/update',
                method: 'post',
                data,
            });
        },
        delNetworkInter: (data: object) => {
            return request({
                url: '/networkinter/delete',
                method: 'post',
                data,
            });
        },
        searchNetworkInter: (data: object) => {
            return request({
                url: '/networkinter/search',
                method: 'post',
                data,
            });
        },


          deSerialIDS: (data: object) => {
            return request({
                url: '/serialinter/delids',
                method: 'post',
                data,
            });
        },
        getSerialSearchListSize: (data: object) => {
            return request({
                url: '/serialinter/searchSize',
                method: 'post',
                data,
            });
        },
        addSerialInter: (data: object) => {
            return request({
                url: '/serialinter/add',
                method: 'post',
                data,
            });
        },
		        updateSerialInter: (data: object) => {
            return request({
                url: '/serialinter/update',
                method: 'post',
                data,
            });
        },
        delSerialInter: (data: object) => {
            return request({
                url: '/serialinter/delete',
                method: 'post',
                data,
            });
        },
        searchSerialInter: (data: object) => {
            return request({
                url: '/serialinter/search',
                method: 'post',
                data,
            });
        },
    };
}
