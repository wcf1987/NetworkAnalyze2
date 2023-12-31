import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function flowdistributionApi() {

    return {
                 delIDS: (data: object) => {
            return request({
                url: '/flowdistribution/delids',
                method: 'post',
                data,
            });
        },
        getFlowDistributionSearchListSize: (data: object) => {
            return request({
                url: '/flowdistribution/searchSize',
                method: 'post',
                data,
            });
        },
        addFlowDistribution: (data: object) => {
            return request({
                url: '/flowdistribution/add',
                method: 'post',
                data,
            });
        },
        updateFlowDistribution: (data: object) => {
            return request({
                url: '/flowdistribution/update',
                method: 'post',
                data,
            });
        },
        delFlowDistribution: (data: object) => {
            return request({
                url: '/flowdistribution/delete',
                method: 'post',
                data,
            });
        },
        searchFlowDistribution: (data: object) => {
            return request({
                url: '/flowdistribution/search',
                method: 'post',
                data,
            });
        },

        dispatch: (data: object) => {
            return request({
                url: '/flowdistribution/dispatch',
                method: 'post',
                data,
            });
        },

    };
}
