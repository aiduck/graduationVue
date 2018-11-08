<template>
    <div class="wrap">
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 项目组</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 表格 -->
        <div class="container">
            <el-row>
                <el-col :span="8">
                    <div class="tagBlock">
                        <span v-if="!tagEmpty" style="font-weight: bold; color: #606266; font-size: 12px;">筛选条件</span>
                        <el-tag v-for="(value,key) in filter" :key='key' v-if="value !== ''" class="tag" >{{keyFormater(key)}}</el-tag>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="handle-box">
                        <el-button type="primary"  @click="handleAdd">添加</el-button>
                        <el-button type="primary"  @click="enterFilter">{{ isFilterIng ? '退出筛选' : '筛选'}}</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 筛选框 -->
            <filter-box
                :dialogVisible="showFilterBox"
                :tmpl="filterTmpl"
                :filter="filter"
                :valueLabelMap="valueLabelMap"
                :keyFormatMap="Object.assign({},keyFormatMap)"
                @sendFilter="receiveFilter"
                @inputChange="inputChange"
                @handleClear="inputClear"/>
            <!-- 添加框 -->
             <add-box :show="showInfoAdd"
                    :tmpl="infoAddTmpl"
                    :valueLabelMap="valueLabelMap"
                    :rules="infoAddRules"
                    @sendInfo="receiveInfo"
                    @inputChange="inputChange"
                    @handleClear="inputClear"/>
            <!-- 表格 -->
            <el-table 
                :data="tableData" 
                border
                style="width: 100%" 
                ref="multipleTable">
                <el-table-column type="expand">
                    <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item v-for="(value, key) in expandFormatMap" :key='key' :label="value" class="expandItem">
                        <span>{{ props.row[key] }}</span>
                        </el-form-item>
                    </el-form>
                    </template>
                </el-table-column>


                <el-table-column v-for="(value, key) in keyFormatMap"
                       :label="value"
                       :key='key'
                       :prop = "key"
                       :resizable="false">
                </el-table-column>

                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleMore(scope.$index, scope.row)">更多</el-button>
                        <el-button
                            size="small"
                            type="success"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
// 引入xlsx
// var XLSX = require('xlsx');
import axios from '../../utils/axiosHttp.js';
import util from '../../utils/utils.js';
import FilterBox from "../common/FilterBox";
import AddBox from '../common/AddBox'
export default {
    name: 'userInfo',
    components: { FilterBox, AddBox },
    data() {
        return {
            tableData: [],  // 表格数据信息
            multipleSelection: [], // 删除信息
            // 表格头部
            keyFormatMap: {
                // 格式化标签映射表
                team_id: "项目组ID",
                team_name: "项目组名称",
                class_name: "教学班级名称",
                project_name: "项目名称",
                username:"负责人",
            },
            expandFormatMap: {
                class_id: "教学班级ID",
                user_id: "负责人ID",
                project_id: "教学班级ID"
            },
            hideMap: {},
            // 表格页码参数
            pageSize: 10, //每页大小
            currentPage: 1, //当前页
            start: 1, //查询的页码
            totalCount: 0, //返回的记录总数
            // 筛选表格参数
            isFirstFilter: true,
            tagEmpty: true, //筛选标签是否为空
            showFilterBox: false,
            valueLabelMap:{
                class_id: [],
                user_id: [],
                project_id: [],
            },
            filterTmpl: {
                team_id: {
                    label: "项目组ID",
                    inputType: 0 // 0 代表 input
                },
                team_name: {
                    label: "项目组名称",
                    inputType: 0 // 0 代表 input
                },
                class_id: {
                    label: "教学班级ID",
                    inputType: 1
                },
                user_id: {
                    label: "用户Id",
                    inputType: 1 // 1 代表下拉框
                },
                project_id: {
                    label: "筛选项目Id",
                    inputType: 1 // 1 代表下拉框
                }
            },
            filter: {
                //搜索条件
                team_id: "", 
                team_name: "", 
                class_id: "", 
                user_id: "",
                project_id: "",
            },
            // 添加表格参数
            showInfoAdd: false,
            infoAddTmpl: {
                team_id: {
                    label: "项目组ID",
                    inputType: 0 // 0 代表 input
                },
                team_name: {
                    label: "项目组名称",
                    inputType: 0 // 0 代表 input
                },
                class_id: {
                    label: "教学班级ID",
                    inputType: 1 // 1 代表下拉框
                },
                class_name: {
                    label: "教学班级名称",
                    inputType: 0.1, // 0.1 表示只能看不能输入的input
                    disabled: true,
                    addSelectShow:''
                },
                user_id: {
                    label: "学生ID",
                    inputType: 1, // 1 代表下拉框
                    disabled: true,
                },
                username: {
                    label: "学生名",
                    inputType: 0.1, // 0.1 表示只能看不能输入的input
                    disabled: true,
                    addSelectShow: ''
                },
                project_id: {
                    label: "项目ID",
                    inputType: 1, // 1 代表下拉框
                    disabled: true,
                },
                project_name: {
                    label: "项目名称",
                    inputType: 0.1, // 0.1 表示只能看不能输入的input
                    disabled: true,
                    addSelectShow:''
                },
            },
            infoAddRules: {
                team_id: [
                    { required: true, message: "请输入项目组ID", trigger: "blur" }
                ],
                team_name: [
                    { required: true, message: "请输入项目组名称", trigger: "blur" }
                ],
                class_id: [
                    { required: true, message: "请输入教学班级ID", trigger: "blur" }
                ],
                user_id: [
                    { required: true, message: "请选择用户ID", trigger: "blur" }
                ],
                project_id: [
                    { required: true, message: "请选择项目ID", trigger: "blur" }
                ]
            },
        }
    },
    created() {

    },
    computed: {
        // 是否显示退出筛选
        isFilterIng() {
            return !this.tagEmpty;
        }
    },
    watch: {
        // 控制‘筛选条件字样’是否显示
        filter: {
            handler: function(val) {
                this.tagEmpty = true;
                for (let item in val) {
                    // 如果filter中有一个内容则就在筛选
                    if (val[item] !== "") {
                        this.tagEmpty = false;
                        break;
                    }
                }
            },
            deep: true
        },

    },
    mounted() {
        this.imFile = document.getElementById('imFile');
        this.outFile = document.getElementById('downlink')
        this.initClassInfo();
        this.initProjectTeam(this.pageSize,this.currentPage);
    },
    methods: {
        initProjectTeam(pageSize, currentPage, val) {
            let params = {
                pageSize: pageSize,
                currentPage: currentPage
            }
            axios
            .get('/api/projectTeam/queryLimitTeam',{params})
            .then(res => {
                if(res.data.code === 200) {
                    let teamRes = res.data.data;
                    this.totalCount = teamRes.total;
                    this.tableData = teamRes.teamList || [];
                    this.currentPage = val || 1;
                }  else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        // 初始化教学班级id下拉框
        initClassInfo() {
            axios
            .get('/api/classInfo/queryAll')
            .then(res => {
                if(res.data.code === 200) {
                    if(res.data.data.classList) {
                        res.data.data.classList.map((item) => {
                            this.valueLabelMap.class_id.push({
                                value: item.class_id,
                                label: item.class_id,
                                disabled: item.status === '可用'?false:true
                            })
                        })
                    }
                    // console.log(this.valueLabelMap.class_id);
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        // 单个添加按钮
        handleAdd() {
            this.showInfoAdd = true;
        },
        receiveInfo(addform) {
            this.showInfoAdd = false;
            if (addform !== undefined) {
                // console.log(addform);
                axios
                .post("/api/projectTeam/insterProjectTeam",addform)
                .then(res => {
                    if(res.data.code === 200) {
                        this.initProjectTeam(this.pageSize, this.currentPage)
                        this.$message({
                            message: `添加成功`,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: `数据库操作失败错误代码${res.data.code}`
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            }
           
        },
        // 搜索按钮相关函数
        enterFilter() {
            this.isFirstFilter = true;
            if(this.isFilterIng) {
                console.log('退出筛选');
                this.filter = util.resetObject(this.filter);
                // 就是没有任何条件的所有信息
                 this.initProject(this.pageSize, this.currentPage);
            }
            else {
                console.log('进入筛选');
                this.showFilterBox = true;
            }
        },
        filterData(params) {
            axios
            .post('/api/projectTeam/queryByFilter', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.tableData = res.data.data.teamList || [];
                    this.totalCount = res.data.data.total;
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        receiveFilter(filter) {
            console.log(filter);
            if (this.isFirstFilter && filter !== undefined) {
                this.filter = filter;
                let params = {
                    filter,
                    pageSize:this.pageSize,
                    currentPage:this.currentPage
                }
                this.filterData(params);
            } else if (this.isFirstFilter && filter === undefined) {
                let  filter = {
                    team_id: "", 
                    team_name: "", 
                    class_id: "", 
                    user_id: "",
                    project_id: "",
                }
                this.filter = filter;
            }
            this.isFirstFilter = false;
            this.showFilterBox = false;
        },
        // 标签的key格式化器
        keyFormater(value) {
            if (!value) return "";
            value = value.toString();
            return Object.assign({}, this.keyFormatMap, this.expandFormatMap, this.hideMap)[value];
        },
        queryStuByClassID(params) {
            axios
            .post("/api/classInfo/queryStuByClassId",params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res);  
                    this.infoAddTmpl.user_id.disabled = false;
              
                    res.data.data.studentId.map((item) => {
                        this.valueLabelMap.user_id.push({
                            value: item.user_id,
                            label: item.user_id,
                        });
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        queryProByCourseID(params) {
            axios
            .post("/api/projectInfo/queryProByCourseID",params)
            .then(res => {
                if(res.data.code === 200) {
                    this.infoAddTmpl.project_id.disabled = false;
                    
                    res.data.data.projectIdList.map((item) => {
                        this.valueLabelMap.project_id.push({
                            value: item.project_id,
                            label: item.project_id,
                        });
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        queryByIDForName(url,params,type) {
            axios
            .post(url,params)
            .then(res => {
                if(res.data.code === 200) {
                    if(type === 'class') {
                         this.infoAddTmpl.class_name.addSelectShow = res.data.data.classes[0].class_name;
                        let params2 = {
                            course_id: res.data.data.classes[0].course_id
                        }
                        this.queryStuByClassID(params);
                        this.queryProByCourseID(params2);
                    } else if(type === 'student') {
                        this.infoAddTmpl.username.addSelectShow = res.data.data.user[0].username;
                    } else if(type === 'project') {
                        this.infoAddTmpl.project_name.addSelectShow = res.data.data.project[0].project_name;
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        async inputChange(oldObj, newObj) {
            if(newObj.label === '教学班级ID') {
                this.valueLabelMap.project_id = [];
                this.valueLabelMap.user_id = [];
            }
            if(oldObj && newObj.label === '教学班级ID') {
                let params = {
                    class_id: oldObj
                };
                let url = '/api/classInfo/queryByIdForName';
                this.queryByIDForName(url,params,'class');
            } else  if(oldObj && newObj.label === '学生ID') {
                let params = {
                    user_id: oldObj
                };
                let url = '/api/studentInfo/queryByIdForName';
                this.queryByIDForName(url,params,'student');
            } else  if(oldObj && newObj.label === '项目ID') {
                let params = {
                    project_id: oldObj
                };
                let url = '/api/projectInfo/queryByIdForName';
                this.queryByIDForName(url,params,'project');
            }
        },
        inputClear(type) {},
        // 更多按钮
        handleMore(index, row) {
            this.$router.push(`/projectTeamDetail/${row.team_id}/ischeck`);
        },
        // 编辑按钮
        handleEdit(index, row) {
            this.$router.push(`/projectTeamDetail/${row.team_id}/isedit`);
        },
        // 删除按钮
        handleDelete(index, row) {

            this.$confirm('删除团队的同时也将删除团队的成员信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    team_id: row.team_id
                }
                axios
                .post('/api/projectTeam/deleteTeam', params)
                .then(res => {
                    if(res.data.code === 200) {
                        this.initProjectTeam(this.pageSize,this.currentPage);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: `数据库操作失败错误代码${res.data.code}`
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 分页操作按钮
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let currentPage = val;
            if(this.tagEmpty) {
                this.initProject(this.pageSize, currentPage,val);
            } else {
                let params = {
                    filter: this.filter,
                    pageSize:this.pageSize,
                    currentPage: currentPage
                }
                this.filterData(params);
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
   
    }
}
</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
        text-align: right;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .tagBlock {
        display: inline-block;
    }
    .tag {
        margin: 5px;
    }
    .expandItem {
        padding-right: 40px;
    }
    .el-form-item__content span{
        color: royalblue;
        font-weight: 600;
    }
</style>


