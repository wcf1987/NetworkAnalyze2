import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function messtranslateApi() {

    return {
         delIDS: (data: object) => {
            return request({
                url: '/messtranslate/delids',
                method: 'post',
                data,
            });
        },
        getMessTranslateSearchListSize: (data: object) => {
            return request({
                url: '/messtranslate/searchSize',
                method: 'post',
                data,
            });
        },
        addMessTranslate: (data: object) => {
            return request({
                url: '/messtranslate/add',
                method: 'post',
                data,
            });
        },
		        updateMessTranslate: (data: object) => {
            return request({
                url: '/messtranslate/update',
                method: 'post',
                data,
            });
        },
        delMessTranslate: (data: object) => {
            return request({
                url: '/messtranslate/delete',
                method: 'post',
                data,
            });
        },
        searchMessTranslate: (data: object) => {
            return request({
                url: '/messtranslate/search',
                method: 'post',
                data,
            });
        },

                 delDetailIDS: (data: object) => {
            return request({
                url: '/messtranslatedetail/delids',
                method: 'post',
                data,
            });
        },

        getMessTranslateDetailSearchListSize: (data: object) => {
            return request({
                url: '/messtranslatedetail/searchSize',
                method: 'post',
                data,
            });
        },
        addMessTranslateDetail: (data: object) => {
            return request({
                url: '/messtranslatedetail/add',
                method: 'post',
                data,
            });
        },
		        updateMessTranslateDetail: (data: object) => {
            return request({
                url: '/messtranslatedetail/update',
                method: 'post',
                data,
            });
        },
        delMessTranslateDetail: (data: object) => {
            return request({
                url: '/messtranslatedetail/delete',
                method: 'post',
                data,
            });
        },
        searchMessTranslateDetail: (data: object) => {
            return request({
                url: '/messtranslatedetail/search',
                method: 'post',
                data,
            });
        },
    };
}
