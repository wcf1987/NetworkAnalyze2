import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function roleManageApi() {

    return {

        getSearchListSize: (data: object) => {
            return request({
                url: '/role/searchSize',
                method: 'post',
                data,
            });
        },
        add: (data: object) => {
            return request({
                url: '/role/add',
                method: 'post',
                data,
            });
        },
		        update: (data: object) => {
            return request({
                url: '/role/update',
                method: 'post',
                data,
            });
        },
        del: (data: object) => {
            return request({
                url: '/role/delete',
                method: 'post',
                data,
            });
        },
        search: (data: object) => {
            return request({
                url: '/role/search',
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
