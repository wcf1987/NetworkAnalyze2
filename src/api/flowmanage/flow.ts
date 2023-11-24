import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function flowApi() {

    return {

        getFlowSearchListSize: (data: object) => {
            return request({
                url: '/flow/searchSize',
                method: 'post',
                data,
            });
        },
        addFlow: (data: object) => {
            return request({
                url: '/flow/add',
                method: 'post',
                data,
            });
        },
		        updateFlow: (data: object) => {
            return request({
                url: '/flow/update',
                method: 'post',
                data,
            });
        },
        		        updateFlowJson: (data: object) => {
            return request({
                url: '/flow/updatejson',
                method: 'post',
                data,
            });
        },
        delFlow: (data: object) => {
            return request({
                url: '/flow/delete',
                method: 'post',
                data,
            });
        },
        searchFlow: (data: object) => {
            return request({
                url: '/flow/search',
                method: 'post',
                data,
            });
        },
        copy: (data: object) => {
            return request({
                url: '/flow/copy',
                method: 'post',
                data,
            });
        },
        getFlowByID: (data: object) => {
            return request({
                    url: '/flow/getbyid',
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
