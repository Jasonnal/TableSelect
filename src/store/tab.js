import Cookie from "js-cookie"
export default {
    state: {
        isCollapse: false,
        tabList: [
            {
                path: "/",
                name: "home",
                label: "首页",
                icon: "s-home",
                url: "Home/Home",
            }
        ],  //菜单展开收起  
        menu: []
    },
    mutations: {
        //修改菜单展开
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        //更新面包屑
        selectMenu(state, val) {
            if (val.name !== 'home') {
                const index = state.tabList.findIndex(item => item.name === val.name)
                if (index === -1) {
                    state.tabList.push(val)
                }
            }
        },
        closeTag(state, item) {
            const index = state.tabList.findIndex(val => val.name === item.name)
            state.tabList.splice(index, 1)
        },
        setMenu(state, val) {
            state.menu = val
            localStorage.setItem('menu',JSON.stringify(val))
        }
    }

}