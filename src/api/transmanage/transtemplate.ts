import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function transtemplateApi() {

    return {

        getFlowSearchListSize: (data: object) => {
            return request({
                url: '/transtemplate/searchSize',
                method: 'post',
                data,
            });
        },
        addFlow: (data: object) => {
            return request({
                url: '/transtemplate/add',
                method: 'post',
                data,
            });
        },
        updateFlow: (data: object) => {
            return request({
                url: '/transtemplate/update',
                method: 'post',
                data,
            });
        },
        updateFlowJson: (data: object) => {
            return request({
                url: '/transtemplate/updatejson',
                method: 'post',
                data,
            });
        },
        applyFlow: (data: object) => {
            return request({
                url: '/transtemplate/applyflow',
                method: 'post',
                data,
            });
        },
        delFlow: (data: object) => {
            return request({
                url: '/transtemplate/delete',
                method: 'post',
                data,
            });
        },
        searchFlow: (data: object) => {
            return request({
                url: '/transtemplate/search',
                method: 'post',
                data,
            });
        },
        copy: (data: object) => {
            return request({
                url: '/transtemplate/copy',
                method: 'post',
                data,
            });
        },
        getFlowByID: (data: object) => {
            return request({
                    url: '/transtemplate/getbyid',
                method: 'post',
                data,
            });
        },



    };
}
