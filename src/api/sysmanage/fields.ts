import request from '/@/utils/request';
import requestfile from '/@/utils/requestfile';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function fieldsApi() {

    return {
 delIDS: (data: object) => {
            return request({
                url: '/fields/delids',
                method: 'post',
                data,
            });
        },
        getFieldsSearchListSize: (data: object) => {
            return request({
                url: '/fields/searchSize',
                method: 'post',
                data,
            });
        },
        addFields: (data: object) => {
            return request({
                url: '/fields/add',
                method: 'post',
                data,
            });
        },
        updateFields: (data: object) => {
            return request({
                url: '/fields/update',
                method: 'post',
                data,
            });
        },
        delFields: (data: object) => {
            return request({
                url: '/fields/delete',
                method: 'post',
                data,
            });
        },
        searchFields: (data: object) => {
            return request({
                url: '/fields/search',
                method: 'post',
                data,
            });
        },
        getFieldsByID: (data: object) => {
            return request({
                url: '/fields/getByID',
                method: 'post',
                data,
            });
        },

        uploadfile: (data: object) => {
            return requestfile({
                url: '/fields/uploadfile',
                method: 'post',
                data




            });
        },
                uploadfileall: (data: object) => {
            return requestfile({
                url: '/fields/uploadfileall',
                method: 'post',
                data




            });
        },
        analysefile: (data: object) => {
            return requestfile({
                url: '/fields/analysefile',
                method: 'post',
                data




            });
        },


        downloadExcel: (data: object) => {
            return request({
                url: '/fields/getByID',
                method: 'post',
                data,
            });
        },





    };
}
