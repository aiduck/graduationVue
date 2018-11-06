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
                    :addSelectShow="addSelectShow"
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
                project_id: "项目ID",
                project_name: "项目名称",
                course_id: "课程ID",
                course_name: "课程名称",
                status: "项目状态"
            },
            expandFormatMap: {
                project_content: "项目内容",
                target: "项目目标",
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
                course_id: [],
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
                project_id: {
                    label: "项目ID",
                    inputType: 0 // 0 代表 input
                },
                project_name: {
                    label: "项目名称",
                    inputType: 0 // 0 代表 input
                },
                course_id: {
                    label: "课程ID",
                    inputType: 1
                },
                status: {
                    label: "状态",
                    inputType: 1 // 1 代表下拉框
                }
            },
            filter: {
                //搜索条件
                project_id: "", 
                project_name: "", 
                course_id: "", 
                status: "",
            },
            // 添加表格参数
            showInfoAdd: false,
            infoAddTmpl: {
                project_id: {
                    label: "项目ID",
                    inputType: 0 // 0 代表 input
                },
                project_name: {
                    label: "项目名称",
                    inputType: 0 // 0 代表 input
                },
                course_id: {
                    label: "课程ID",
                    inputType: 1 // 1 代表下拉框
                },
                course_name: {
                    label: "课程名称",
                    inputType: 0.1, // 0.1 表示只能看不能输入的input
                    disabled: true,
                },
                status: {
                    label: "状态",
                    inputType: 1 // 1 代表下拉框
                },
                project_content: {
                    label: "项目内容",
                    inputType: 4,
                    maxlength: 500
                },
                target: {
                    label: "项目目标",
                    inputType: 4,
                    maxlength: 100
                },
            },
            infoAddRules: {
                project_id: [
                    { required: true, message: "请输入项目ID", trigger: "blur" }
                ],
                project_name: [
                    { required: true, message: "请输入项目名称", trigger: "blur" }
                ],
                course_id: [
                    { required: true, message: "请输入课程ID", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "请选择项目状态", trigger: "blur" }
                ]
            },
            addSelectShow: '',
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
        this.initCourseInfo();
        this.initProject(this.pageSize,this.currentPage);
    },
    methods: {
        initProject(pageSize, currentPage, val) {
            let params = {
                pageSize: pageSize,
                currentPage: currentPage
            }
            axios
            .get('/api/projectInfo/queryLimitProject',{params})
            .then(res => {
                if(res.data.code === 200) {
                    let projectRes = res.data.data;
                    this.totalCount = projectRes.total;
                    this.tableData = projectRes.projectList || [];
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
        // 初始化课程id下拉框
        initCourseInfo() {
            axios
            .get('/api/courseInfo/queryAll')
            .then(res => {
                if(res.data.code === 200) {
                    if(res.data.data.courseList) {
                        res.data.data.courseList.map((item) => {
                            this.valueLabelMap.course_id.push({
                                value: item.course_id,
                                label: item.course_id,
                                disabled: item.status === '可用'?false:true
                            })
                        })
                    }
                    // this.valueLabelMap.course_id = res.data.data.courseList || []
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
                axios
                .post("/api/projectInfo/insterProject",addform)
                .then(res => {
                    if(res.data.code === 200) {
                        this.initProject(this.pageSize, this.currentPage)
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
            .post('/api/projectInfo/queryByFilter', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.tableData = res.data.data.projectList || [];
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
                    project_id: "", 
                    project_name: "", 
                    course_id: "", 
                    status: "",
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
            if(oldObj && newObj.label === '课程ID') {
                let params = {
                    course_id: oldObj
                };
                axios
                .post("/api/courseInfo/queryByIdForName",params)
                .then(res => {
                    if(res.data.code === 200) {
                       this.addSelectShow = res.data.data.course[0].course_name;
                    //    this.addSelectShow = {
                    //        value:res.data.data.course[0].course_name,
                    //        label:'course_id'
                    //    }
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
        inputClear(type) {},
        // 更多按钮
        handleMore(index, row) {
            this.$router.push(`/projectDetailInfo/${row.project_id}/ischeck`);
        },
        // 编辑按钮
        handleEdit(index, row) {
            this.$router.push(`/projectDetailInfo/${row.project_id}/isedit`);
        },
        // 禁用按钮
        handleDelete(index, row) {
            let status = row.status === '可用' ? '不可用' : '可用';
            let project_id = row.project_id;
            let params = {
                status: status,
                project_id: project_id
            }
            axios
            .post('/api/projectInfo/updateProjectStatus', params)
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


