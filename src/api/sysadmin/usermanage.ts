import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function userManageApi() {

    return {
        signIn: (data: object) => {
            return request({
                url: '/user/signIn',
                method: 'post',
                data,
            });
        },
        signOut: (data: object) => {
            return request({
                url: '/user/signOut',
                method: 'post',
                data,
            });
        },
        getSearchListSize: (data: object) => {
            return request({
                url: '/user/searchSize',
                method: 'post',
                data,
            });
        },
        add: (data: object) => {
            return request({
                url: '/user/add',
                method: 'post',
                data,
            });
        },
        update: (data: object) => {
            return request({
                url: '/user/update',
                method: 'post',
                data,
            });
        },
        del: (data: object) => {
            return request({
                url: '/user/delete',
                method: 'post',
                data,
            });
        },
        search: (data: object) => {
            return request({
                url: '/user/search',
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
