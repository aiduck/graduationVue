<template>
    <div class="wrap">
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 班级基本信息</el-breadcrumb-item>
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
                        <el-button type="warning"  @click="handleDelAll">批量删除</el-button>
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
                ref="multipleTable" 
                @selection-change="handleSelectionChange">

                <!-- <el-table-column type="expand">
                    <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item v-for="(value, key) in expandFormatMap" :key='key' :label="value" class="expandItem">
                        <span>{{ props.row[key] }}</span>
                        </el-form-item>
                    </el-form>
                    </template>
                </el-table-column> -->

                <el-table-column type="selection" width="35"></el-table-column>

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
                            @click="handleDelete(scope.$index, scope.row)">{{ scope.row.status == '可用' ? '禁用' : '启用'}}</el-button>
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
                class_id: "班级ID",
                class_name: "班级名称",
                course_id: "课程ID",
                user_id: "教师ID",
                status: "课程状态"
            },
            expandFormatMap: {
                // 格式化额外信息映射表
            },
            hideMap: {
                // year:"学年",
                // term:"学期",
                // hours: "学时",
                // grade: "年级",
                // college_id: "学院",
                // major_id: "专业",
                // ratio_usual:"平时成绩",
                // ratio_project:"期末成绩"     
            },
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
                status: [
                    {
                        value: "可用",
                        label: "可用"
                    },
                    {
                        value: "不可用",
                        label: "不可用"
                    }
                ],
            },
            filterTmpl: {
                class_id: {
                    label: "班级ID",
                    inputType: 0 // 0 代表 input
                },
                class_name: {
                    label: "班级名称",
                    inputType: 0 // 0 代表 input
                },
                course_id: {
                    label: "课程ID",
                    inputType: 0
                },
                user_id: {
                    label: "教师ID",
                    inputType: 0
                },
                status: {
                    label: "状态",
                    inputType: 1 // 1 代表下拉框
                }
            },
            filter: {
                //搜索条件
                class_id: "",
                class_name: "",
                course_id: "",
                user_id: "",
                status: ""
            },
            // 添加表格参数
            showInfoAdd: false,
            infoAddTmpl: {
                class_id: {
                    label: "班级ID",
                    inputType: 0 // 0 代表 input
                },
                class_name: {
                    label: "班级名称",
                    inputType: 0, // 0 代表 input
                },
                course_id: {
                    label: "课程ID",
                    inputType: 0,
                },
                user_id: {
                    label: "教师ID",
                    inputType: 0,
                },
                status: {
                    label: "状态",
                    inputType: 1 // 1 代表下拉框
                }
            },
            infoAddRules: {
                class_id: [
                    { required: true, message: "请输入班级ID", trigger: "blur" }
                ],
                class_name: [
                    { required: true, message: "请输入班级名称", trigger: "blur" }
                ],
                course_id: [
                    { required: true, message: "请输入课程ID", trigger: "blur" }
                ],
                user_id: [
                    { required: true, message: "请输入教师ID", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "请输入状态", trigger: "blur" }
                ]
            }
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
        this.initClassInfo(this.pageSize, this.currentPage);
    },
    methods: {
        // 初始化信息
        initClassInfo(pageSize, currentPage,val) {
            let params = {
                pageSize: pageSize,
                currentPage: currentPage,
            }
            axios
            .get('/api/classInfo/queryLimitClass',{params})
            .then(res => {
                if(res.data.code === 200){
                    let classRes = res.data.data;
                    this.totalCount = classRes.total;
                    this.tableData = classRes.classList || [];
                    this.currentPage = val || 1;
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
        // 批量删除按钮
        handleDelAll() {
            if(this.multipleSelection.length > 0) {
                this.$confirm('此操作将永久删除这些用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let classIdList = [];
                    this.multipleSelection.map((item, index) => {
                        // console.log(item);
                        classIdList.push(item.class_id);
                    })
                    let params = {
                        classIdList: classIdList
                    }
                    // console.log(params);
                    axios
                    .post('api/classInfo/daleteClassList', params)
                    .then(res => {
                        if(res.data.code === 200) {
                            this.initClassInfo(this.pageSize, this.currentPage);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
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
                            type: 'error',
                            message: '删除失败！'
                        }); 
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        // 单个添加按钮
        handleAdd() {
            this.showInfoAdd = true;
        },
        insertClass(addform) {
            axios
            .post("/api/classInfo/insterClass",addform)
            .then(res => {
                if(res.data.code === 200) {
                    this.initClassInfo(this.pageSize, this.currentPage)
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
        },
        receiveInfo(addform) {
            this.showInfoAdd = false;
            if (addform !== undefined) {
                let paramsCoures = {
                    course_id:addform.course_id
                };
                let paramsUser = {
                    user_id:addform.user_id
                };
                axios
                .post("/api/teacherInfo/queryByIdForName",paramsUser)
                .then(resuser => {
                    if(resuser.data.code === 200) {
                        axios
                        .post("/api/courseInfo/queryByIdForName",paramsCoures)
                        .then(resCourse => {
                            if(resCourse.data.code === 200) {
                                // console.log(resuser.data.data.user[0].username)
                                let username = resuser.data.data.user[0].username;
                                let course_name = resCourse.data.data.course[0].course_name;
                                // console.log(resCourse.data.data.course[0].course_name);
                                if(username !== undefined && course_name !== undefined) {
                                    this.$alert(`请确认你输入的教师ID是否为${addform.user_id}:${username}
                                    课程ID是否为${addform.course_id}:${course_name}`, '内容确认', {
                                        confirmButtonText: '确定',
                                        callback: action => {
                                           this.insertClass(addform);
                                        }
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: '输入的教师ID或者课程ID内容不存在'
                                    });
                                }
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: `数据库操作失败错误代码${resCourse.data.code}`
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
                    } else {
                        this.$message({
                            type: 'warning',
                            message: `数据库操作失败错误代码${resuser.data.code}`
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
                 this.initClassInfo(this.pageSize, this.currentPage);
            }
            else {
                console.log('进入筛选');
                this.showFilterBox = true;
            }
        },
        filterData(params) {
            axios
            .post('/api/classInfo/queryByFilter', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.tableData = res.data.data.courseList || [];
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
            // console.log(filter);
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
                    course_id: "", 
                    course_name: "", 
                    year: "", 
                    term: "", 
                    college_id: "", 
                    major_id: "", 
                    status: "", 
                    grade: "", // 年级
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
        async inputChange(oldObj, newObj) {
            // 筛选框中下拉框handleSelectChange改变
            // console.log(oldObj,newObj);
            // 筛选框中下拉框handleSelectChange改变
            // console.log(oldObj,newObj);
            const value = arguments[0];
            const type = arguments[1].label;
            this.valueLabelMap.major_id = [];
            this.valueLabelMap.aclass_id = [];
            switch (type) {
                case "学院":
                    this.initMajor(value);
                    this.filterTmpl.major_id.disabled = false;
                    this.infoAddTmpl.major_id.disabled = false;
                    break;
            }
        },
        inputClear(type) {
            // 筛选框中下拉框handleClear清除
            // console.log(type);
            if (type == "学院") {
                this.filterTmpl.major_id.disabled = true;
                this.infoAddTmpl.major_id.disabled = true;
            }
        },
        // 批量删除按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 更多按钮
        handleMore(index, row) {
            this.$router.push(`/classInfo/${row.class_id}/ischeck`);
        },
        // 编辑按钮
        handleEdit(index, row) {
            this.$router.push(`/classInfo/${row.class_id}/isedit`);
        },
        // 禁用按钮
        handleDelete(index, row) {
            let status = row.status === '可用' ? '不可用' : '可用';
            let class_id = row.class_id;
            let params = {
                status: status,
                class_id: class_id
            }
            axios
            .post('/api/classInfo/updateClassStatus', params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res)
                    // 前端修改用户状态
                    this.tableData[index].status = row.status === '可用' ? '不可用' : '可用';
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

        },
        // 分页操作按钮
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let currentPage = val;
            if(this.tagEmpty) {
                this.initClassInfo(this.pageSize, currentPage,val);
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


