import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function packageApi() {

    return {
        getPackageList: (data: object) => {
            return request({
                url: '/package/list',
                method: 'post',
                data,
            });
        },
        getPackageListSize: (data: object) => {
            return request({
                url: '/package/alllistnum',
                method: 'post',
                data,
            });
        },
        getPackageSearchListSize: (data: object) => {
            return request({
                url: '/package/searchSize',
                method: 'post',
                data,
            });
        },
        addPackage: (data: object) => {
            return request({
                url: '/package/add',
                method: 'post',
                data,
            });
        },
		        updatePackage: (data: object) => {
            return request({
                url: '/package/update',
                method: 'post',
                data,
            });
        },
        delPackage: (data: object) => {
            return request({
                url: '/package/delete',
                method: 'post',
                data,
            });
        },
        searchPackage: (data: object) => {
            return request({
                url: '/package/search',
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
