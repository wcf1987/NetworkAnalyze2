import request from '/@/utils/request';
import requestfile from "/@/utils/requestfile";

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function fieldsdetailApi() {

    return {
         delIDS: (data: object) => {
            return request({
                url: '/fieldsdetail/delids',
                method: 'post',
                data,
            });
        },
        statistics: (data: object) => {
            return request({
                url: '/fieldsdetail/statistics',
                method: 'post',
                data,
            });
        },
                statisticsSize: (data: object) => {
            return request({
                url: '/fieldsdetail/statisticsSize',
                method: 'post',
                data,
            });
        },
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

        uploadfile: (data: object) => {
            return requestfile({
                url: '/fieldsdetail/uploadfile',
                method: 'post',
                data


            });
        },


    };
}
