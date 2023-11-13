import {defineStore} from 'pinia';
import Cookies from 'js-cookie';
import {Session} from '/@/utils/storage';
import {userManageApi} from "/@/api/sysadmin/usermanage";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: () => ({
        userInfos: {
            userName: '',
            photo: '',
            time: 0,
            roleSign: '',
            authBtnList: [],
        },
    }),
    actions: {
        async setUserInfos(name, pass) {
            // 存储用户信息到浏览器缓存
            if (Session.get('userInfo')) {
                this.userInfos = Session.get('userInfo');
            } else {
                const userInfos = <UserInfos>await this.getApiUserInfo(name, pass);
                this.userInfos = Session.get('userInfo');
            }

        },
        // 模拟接口数据
        // https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
        async getApiUserInfo(name, pass) {


           await userManageApi().signIn(
                {
                    userName: name,
                    password: pass,

                })
                .then(res => {
                    console.log(res);
                    if (res.code == '200') {

                        state.data = res.data;
                        Cookies.set('userName', state.data.userName);
                        const userName = Cookies.get('userName');
                        // admin 按钮权限标识
                        let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
                        // 用户信息模拟数据
                        const userInfos = {
                            userName: userName,
                            userNickname: res.data.userNickname,
                            photo:
                                userName === 'admin'
                                    ? 'face.png'
                                    : 'face.png',
                            time: new Date().getTime(),
                            roleSign: res.data.roleSign,
                            authBtnList: adminAuthBtnList,
                        };
                        Session.set('userInfo', userInfos);

                    } else {
                        ElMessage.error(res.message);
                    }

                }).catch(err => {

            }).finally(() => {

            });


        },
    },
});
