import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function messdetailApi() {

    return {
         delIDS: (data: object) => {
            return request({
                url: '/messdetail/delids',
                method: 'post',
                data,
            });
        },
        getMessDetailSearchListSize: (data: object) => {
            return request({
                url: '/messdetail/searchSize',
                method: 'post',
                data,
            });
        },
        addMessDetail: (data: object) => {
            return request({
                url: '/messdetail/add',
                method: 'post',
                data,
            });
        },
		        updateMessDetail: (data: object) => {
            return request({
                url: '/messdetail/update',
                method: 'post',
                data,
            });
        },
        delMessDetail: (data: object) => {
            return request({
                url: '/messdetail/delete',
                method: 'post',
                data,
            });
        },
        searchMessDetail: (data: object) => {
            return request({
                url: '/messdetail/search',
                method: 'post',
                data,
            });
        },
        searchMessDetailName: (data: object) => {
            return request({
                url: '/messdetail/searchName',
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
