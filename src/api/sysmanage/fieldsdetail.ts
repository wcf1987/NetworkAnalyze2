import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function fieldsdetailApi() {

    return {

        getFieldsDetailSearchListSize: (data: object) => {
            return request({
                url: '/fieldsdetail/searchSize',
                method: 'post',
                data,
            });
        },
        addFieldsDetail: (data: object) => {
            return request({
                url: '/fieldsdetail/add',
                method: 'post',
                data,
            });
        },
		        updateFieldsDetail: (data: object) => {
            return request({
                url: '/fieldsdetail/update',
                method: 'post',
                data,
            });
        },
        delFieldsDetail: (data: object) => {
            return request({
                url: '/fieldsdetail/delete',
                method: 'post',
                data,
            });
        },
        searchFieldsDetail: (data: object) => {
            return request({
                url: '/fieldsdetail/search',
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
