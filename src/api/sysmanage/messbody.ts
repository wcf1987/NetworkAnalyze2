import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function messbodyApi() {

    return {

        getMessBodySearchListSize: (data: object) => {
            return request({
                url: '/messbody/searchSize',
                method: 'post',
                data,
            });
        },
        addMessBody: (data: object) => {
            return request({
                url: '/messbody/add',
                method: 'post',
                data,
            });
        },
		        updateMessBody: (data: object) => {
            return request({
                url: '/messbody/update',
                method: 'post',
                data,
            });
        },
        delMessBody: (data: object) => {
            return request({
                url: '/messbody/delete',
                method: 'post',
                data,
            });
        },
        searchMessBody: (data: object) => {
            return request({
                url: '/messbody/search',
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
