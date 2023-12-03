import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function messheaderApi() {

    return {
         delIDS: (data: object) => {
            return request({
                url: '/messheader/delids',
                method: 'post',
                data,
            });
        },
        getMessHeaderSearchListSize: (data: object) => {
            return request({
                url: '/messheader/searchSize',
                method: 'post',
                data,
            });
        },
        addMessHeader: (data: object) => {
            return request({
                url: '/messheader/add',
                method: 'post',
                data,
            });
        },
		        updateMessHeader: (data: object) => {
            return request({
                url: '/messheader/update',
                method: 'post',
                data,
            });
        },
        delMessHeader: (data: object) => {
            return request({
                url: '/messheader/delete',
                method: 'post',
                data,
            });
        },
        searchMessHeader: (data: object) => {
            return request({
                url: '/messheader/search',
                method: 'post',
                data,
            });
        },

                 delDetailIDS: (data: object) => {
            return request({
                url: '/messheaderdetail/delids',
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
