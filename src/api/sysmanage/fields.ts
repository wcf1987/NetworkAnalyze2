import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function fieldsApi() {

    return {

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


        getMessHeaderDetailSearchListSize: (data: object) => {
            return request({
                url: '/messheaderdetail/searchSize',
                method: 'post',
                data,
            });
        },
        addMessHeaderDetail: (data: object) => {
            return request({
                url: '/messheaderdetail/add',
                method: 'post',
                data,
            });
        },
        updateMessHeaderDetail: (data: object) => {
            return request({
                url: '/messheaderdetail/update',
                method: 'post',
                data,
            });
        },
        delMessHeaderDetail: (data: object) => {
            return request({
                url: '/messheaderdetail/delete',
                method: 'post',
                data,
            });
        },
        searchMessHeaderDetail: (data: object) => {
            return request({
                url: '/messheaderdetail/search',
                method: 'post',
                data,
            });
        },
    };
}
