import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function gatewayApi() {

    return {
        delIDS: (data: object) => {
            return request({
                url: '/gateway/delids',
                method: 'post',
                data,
            });
        },
        getGatewaySearchListSize: (data: object) => {
            return request({
                url: '/gateway/searchSize',
                method: 'post',
                data,
            });
        },
        addGateway: (data: object) => {
            return request({
                url: '/gateway/add',
                method: 'post',
                data,
            });
        },
        addGatewayDistribute: (data: object) => {
            return request({
                url: '/gateway/adddis',
                method: 'post',
                data,
            });
        },
        searchGatewayDistribute: (data: object) => {
            return request({
                url: '/gateway/searchdis',
                method: 'post',
                data,
            });
        },

            searchGatewayDistributeall: (data: object) => {
            return request({
                url: '/gateway/searchdisall',
                method: 'post',
                data,
            });
        },
        updateGateway: (data: object) => {
            return request({
                url: '/gateway/update',
                method: 'post',
                data,
            });
        },
        delGateway: (data: object) => {
            return request({
                url: '/gateway/delete',
                method: 'post',
                data,
            });
        },
        delGatewayDistribute: (data: object) => {
            return request({
                url: '/gateway/deletedis',
                method: 'post',
                data,
            });
        },
        searchGateway: (data: object) => {
            return request({
                url: '/gateway/search',
                method: 'post',
                data,
            });
        },


        getPackageDetailSearchListSize: (data: object) => {
            return request({
                url: '/packagedetail/searchSize',
                method: 'post',
                data,
            });
        },
        addPackageDetail: (data: object) => {
            return request({
                url: '/packagedetail/add',
                method: 'post',
                data,
            });
        },
        updatePackageDetail: (data: object) => {
            return request({
                url: '/packagedetail/update',
                method: 'post',
                data,
            });
        },
        delPackageDetail: (data: object) => {
            return request({
                url: '/packagedetail/delete',
                method: 'post',
                data,
            });
        },
        searchPackageDetail: (data: object) => {
            return request({
                url: '/packagedetail/search',
                method: 'post',
                data,
            });
        },
    };
}
