<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="$route.path" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router 
            @select="handleSelect"   @open="handleOpen" @close="handleClose">
            <!-- 计算属性 动态渲染 -->
            <template v-for="item in items">
                <!-- subs存在说明有二级菜单 -->
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <!-- 一级表单item中的内容（icon+title）以及数字型的index（如果没有二级菜单,那么一级菜单就是一个路由跳转） -->
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <!-- subs的subs存在说明有三级菜单  -->
                        <template v-for="subItem in item.subs">
                            <!-- 二级表单（title+index）没有icon -->
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <!-- 三级表单（title+index）没有icon-->
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <!-- 没有三级菜单 -->
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <!-- 没有二级菜单 -->
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                itemList: [
                    {
                        icon: 'el-icon-setting',
                        index: '/dashboard',
                        title: '个人中心'
                    },
                ]
            }
        },
        // 计算属性
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
            items() {
                let list = [...this.itemList, ...this.$store.state.permission.menuList]
                return list
            }
        },
        methods: {
            // 没用到的回调函数（返回index值）
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
                
            },
            handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // console.log(key, keyPath);
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar {
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
