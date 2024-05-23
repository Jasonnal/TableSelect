import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Main from '../views/Main.vue'
import RoomData from '../views/RoomData.vue'
import PageOne from '../views/PageOne.vue'
import PageTwo from '../views/PageTwo.vue'
import BookManage from '@/views/BookManage.vue'
import Query from '@/views/Query'
import ExamineManage from '@/views/ExamineManage'
import ApplyManage from '@/views/ApplyManage'
import Login from '@/views/Login'
import Cookies from 'js-cookie'
import Auth from '@/views/Auth'
import Register from '@/views/Register'
import NotFound from '@/views/NotFound'
import Person from "@/views/Person";
import Password from "@/views/Password";
import Notice from "@/views/Notice";
import News from "@/views/News";
import repairApply from "@/views/RepairApply";
import repairProcess from "@/views/RepairProcess";
import dataCount from "@/views/DataCount";
import RoomType from "@/views/RoomType";

Vue.use(VueRouter)
//1.创建路由
//2.路由与组件进行映射
const routes = [
    //主路由
    {
        path: '/',
        component: Main,
        redirect: '/home',
        children: [
            //子路由
            {path: '/home', name: "home", component: Home}, //首页
            {path: '/roomdata', name: "roomdata", component: RoomData},
            {path: '/roomtype', name: "roomtype", component: RoomType},
            {path: '/bookmanage', name: "bookmanage", component: BookManage},
            {path: '/examine', name: "examine", component: ExamineManage},
            {path: '/apply', name: "apply", component: ApplyManage},
            {path: '/user', name: "user", component: User},//y用户
            {path: '/pageone', name: "page1", component: PageOne},
            {path: '/pagetwo', name: "page2", component: PageTwo},
            {path: '/403', name: "auth", component: Auth},
            {path: '/person', name: "person", component: Person},
            {path: '/password', name: "password", component: Password},
            {path: '/notice', name: "notice", component: Notice},
            {path: '/news', name: "new", component: News},
            {path: '/repairApply', name: "repairApply", component: repairApply},
            {path: '/repairProcess', name: "repairProcess", component: repairProcess},
            {path: '/dataCount', name: "dataCount", component: dataCount},


        ]

    },
    {
        path: '/login',
        name: "login",
        component: Login,
    },
    {
        path: '/register',
        name: "register",
        component: Register,
    },
    {
        path: '*',
        name: "404",
        component: NotFound,
    },


]
// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
    routes,
    mode: 'history'
})
// router.beforeEach((to, from, next) => {
//     //to是到达的路由信息
//     //from是路由来自哪里
//     //next进行路由跳转
//     let adminPaths = ["/user", "/roomdata", "/examine"];
//     const publicRoutes = ['/login', '/register'];
//     let user = JSON.parse(localStorage.getItem('honey-user') || '{}')
//     let token = user.token
//     if (user.role !== "管理员" && adminPaths.includes(to.path)) {  //如果当前登录的是管理员才能跳转，让他到一个没有权限页面
//         next('/403')
//     } else {
//         next()
//     }
//
//
//
// })
// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
    const publicRoutes = ['/login', '/register']; // 公共页面，不需要登录就可以访问的页面
    const adminPaths = ["/user", "/roomdata", "/roomtype", "/examine", "/notice","/repairProcess", "/datacount"]; // 需要管理员权限的页面
    const user = JSON.parse(localStorage.getItem('honey-user') || '{}');
    const token = user.token;

    // 如果用户已登录，并且要访问的页面是登录或注册页面，则重定向到首页
    if (token && publicRoutes.includes(to.path)) {
        next('/');
        return;
    }
    // 如果用户未登录，并且要访问的页面不是公共页面，则重定向到登录页面
    if (!token && !publicRoutes.includes(to.path)) {
        next('/login');
        return;
    }

    // 如果用户不是管理员，并且要访问管理员权限页面，则重定向到403页面
    if (user.role !== "管理员" && adminPaths.includes(to.path)) {
        next('/403');
        return;
    }

    // 其他情况下允许访问
    next();
});
export default router