import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function builtNodeApi() {

    return {
                 delIDS: (data: object) => {
            return request({
                url: '/builtnode/delids',
                method: 'post',
                data,
            });
        },
        getSearchListSize: (data: object) => {
            return request({
                url: '/builtnode/searchSize',
                method: 'post',
                data,
            });
        },
        add: (data: object) => {
            return request({
                url: '/builtnode/add',
                method: 'post',
                data,
            });
        },
		        update: (data: object) => {
            return request({
                url: '/builtnode/update',
                method: 'post',
                data,
            });
        },
        del: (data: object) => {
            return request({
                url: '/builtnode/delete',
                method: 'post',
                data,
            });
        },
        search: (data: object) => {
            return request({
                url: '/builtnode/search',
                method: 'post',
                data,
            });
        },




    };
}
