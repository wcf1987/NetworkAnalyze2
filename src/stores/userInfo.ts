import {defineStore} from 'pinia';
import {Session} from '/@/utils/storage';
import {userManageApi} from "/@/api/sysadmin/usermanage";
import {ElMessage} from "element-plus";
import Cookies from "js-cookie";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: (): UserInfosState => ({
        userInfos: {
            userName: '',
            photo: '',
            time: 0,
            roleSign: '',
            userNickname: '',
            menustr: '',
        },
    }),
    actions: {
        async setUserInfos(name,pass) {
            // 存储用户信息到浏览器缓存
            if (Session.get('userInfo')) {
                this.userInfos = Session.get('userInfo');
            } else {
                await this.getApiUserInfo(name,pass);
                const userInfos = Session.get('userInfo');
                this.userInfos = userInfos;
            }
        },
        // 模拟接口数据
        // https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
        async getApiUserInfo(name, pass) {


            // 模拟数据，请求接口时，记得删除多余代码及对应依赖的引入

            // 模拟数据
            await userManageApi().signIn(
                {
                    userName: name,
                    password: pass,

                }).then(res => {
                console.log(res);
                if (res.code == '200') {

                    //state.tableData.data = res.data;
                    // 用户信息模拟数据
                    let menus=JSON.parse(res.data.menustr);
                    console.log(menus);
                    for (let i=menus.length-1;i>=0;i--){
                        if(menus[i].path.indexOf('/',1)!=-1){
                            menus.splice(i,1);

                        }
                    }
                    console.log(menus);

                    const userInfos = {
                        userName: res.data.userName,
                        photo: 'face.png',
                        time: new Date().getTime(),
                        roleSign: res.data.roleSign,
                        userNickname: res.data.userNickname,
                        menustr:  menus,
                    };
                    Session.set('userInfo', userInfos);

                    return userInfos;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

            }).finally(() => {

            });


        },
    },
});
