<template>
    <div class="wrap">
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 项目日报信息</el-breadcrumb-item>
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
                        <el-button v-if="usertype === '学生' "type="primary"  @click="handleAdd">提交</el-button>
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
                            v-if="!(usertype === '学生' && scope.row.report_status === '已审核')"
                            size="small"
                            type="success"
                            @click="handleEdit(scope.$index, scope.row)">
                            {{usertype === '教师'? '评定' : '编辑' }}
                        </el-button>
                        <el-button
                            v-if="!(scope.row.report_status === '已审核')"
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
import axios from '../../utils/axiosHttp.js';
import util from '../../utils/utils.js';
import FilterBox from "../common/FilterBox";
import AddBox from '../common/AddBox'
import { Store } from 'vuex';
import moment from 'moment';
export default {
    name: 'ProjectReport',
    components: { FilterBox, AddBox },
    data() {
        return {
            tableData: [],  // 表格数据信息
            // 表格头部
            keyFormatMap: {
                // 格式化标签映射表   
                report_date: "提交日期",
                report_status: "审核状态",
                project_id: "项目id",
                user_id: "提交者",
            },
            expandFormatMap: {
                report_id: "日报id",
                report_time: "提交时间",  
                report_work: "工作内容",
                report_problem:"存在问题",
                report_plan: "工作计划",
                report_comment: "日报评语",
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
                project_id: [],
                user_id: '',
                report_status: [
                    {
                        value: "未审核",
                        label: "未审核"
                    },
                    {
                        value: "已审核",
                        label: "已审核"
                    }
                ],
            },
            filterTmpl: {
                report_id: {
                    label: "日报ID",
                    inputType: 0 // 0 代表 input
                },
                report_date: {
                    label: "提交日期",
                    inputType: 4 // 0 代表 时间选择器
                },
                report_status: {
                    label: "审核状态",
                    inputType: 1 // 1 代表 时间选择器
                },
                project_id: {
                    label: "项目ID",
                    inputType: 0 // 0 代表 input
                },
                user_id: {
                    label: "提交者ID",
                    inputType: 0.2 // 0 代表 input
                }
            },
            filter: {
                //搜索条件
                report_id: "",
                report_date: "",
                report_status: "",
                project_id: "", 
                user_id: "", 
            },
            // 添加表格参数
            showInfoAdd: false,
            infoAddTmpl: {
                user_id: {
                    label: "提交者ID",
                    inputType: 0.2 // 0 代表input 已经输入过的内容
                },
                project_id:{
                    label: "项目ID",
                    inputType: 1 // 1 代表下拉框
                },
                project_name:{
                    label: "项目名称",
                    inputType: 0.1,  // 0.1 表示只能看不能输入的input
                    disabled: true,
                    addSelectShow:''
                },
                report_work: {
                    label: "工作内容",
                    inputType: 4, // 0.1 表示只能看不能输入的input
                    maxlength: 500
                },
                report_problem: {
                    label: "存在问题",
                    inputType: 4,
                    maxlength: 300
                },
                report_plan: {
                    label: "工作计划",
                    inputType: 4,
                    maxlength: 300
                }
            },
            infoAddRules: {
                project_id: [
                    { required: true, message: "请输入项目ID", trigger: "blur" }
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
        },
        usertype() {
            return this.$store.state.user.usertype
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
        this.initProjectReport(this.pageSize,this.currentPage);
    },
    methods: {
        // 初始化表格
        initProjectReport(pageSize, currentPage, val) {
            let params = {
                user_id: this.$store.state.user.user_id,
                usertype: this.$store.state.user.usertype,
                pageSize: pageSize,
                currentPage: currentPage
            }
            axios
            .get('/api/projectReport/queryReport',{params})
            .then(res => {
                if(res.data.code === 200) {
                    let projectRes = res.data.data;
                    this.totalCount = projectRes.total;
                    this.tableData = projectRes.reportList || [];
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

        // 提交按钮：通过输入的用户ID，查询是否是当前登录的用户，以及她的参与的项目的情况
        handleAdd() {
            let params = {
                user_id: this.$store.state.user.user_id,
                username: this.$store.state.user.username
            }
            axios
            .post('/api/projectReport/checkUserIdAndRetPro', params)
            .then(res => {
                if(res.data.code === 200 && res.data.data !== []) {
                    this.valueLabelMap.project_id = [];
                    res.data.data.map((item) => {
                        this.valueLabelMap.project_id.push({
                            value: item.project_id,
                            label: item.project_id,
                        })
                    })
                    this.valueLabelMap.user_id = this.$store.state.user.user_id;
                    this.showInfoAdd = true;
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
                let params = {
                    ...addform,
                    report_date: moment().format('YYYY-MM-DD'),
                    report_time: moment().format('HH:mm:ss'),
                    report_status: '未审核',
                    report_comment: '',
                    user_id: this.valueLabelMap.user_id
                }
                axios
                .post('/api/projectReport/inster', params)
                .then(res => {
                    if(res.data.code === 200) {
                        this.initProjectReport(this.pageSize,this.currentPage)
                        this.$message({
                            message: `添加成功`,
                            type: 'success'
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
            // 如果不是管理员的用户，只能查找自己的日报信息
            if(this.$store.state.user.usertype !== '管理员') {
                this.valueLabelMap.user_id = this.$store.state.user.user_id;
                this.filter.user_id = this.$store.state.user.user_id;
            } else {
                delete this.filterTmpl.user_id
                this.filterTmpl = {
                    ...this.filterTmpl,
                    user_id: {
                        label: "提交者ID",
                        inputType: 0 // 0 代表 input
                    }
                }
            }
            this.isFirstFilter = true;
            if(this.isFilterIng) {
                console.log('退出筛选');
                this.filter = util.resetObject(this.filter);
                 this.initProject(this.pageSize, this.currentPage);
            }
            else {
                console.log('进入筛选');
                this.showFilterBox = true;
            }
        },
        filterData(params) {
            axios
            .post('/api/projectReport/queryByFilter', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.tableData = res.data.data.reportList || [];
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
            // 提交一个日报，下拉选中的响应事件
            if(oldObj && newObj.label === '项目ID') {
                let params = {
                    project_id: oldObj
                };
                axios
                .post("/api/projectInfo/queryByIdForName",params)
                .then(res => {
                    if(res.data.code === 200) {
                        this.infoAddTmpl.project_name.addSelectShow = res.data.data.project[0].project_name;
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
            this.$router.push(`/projectReportDetail/${row.report_id}/ischeck`);
        },
        // 编辑按钮
        handleEdit(index, row) {
            this.$router.push(`/projectReportDetail/${row.report_id}/isedit`);
        },
        // 删除按钮
        handleDelete(index, row) {
            let params = {
                report_id: row.report_id
            }
            axios
            .post('/api/projectReport/deleteReport',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.initProject(this.pageSize, currentPage);
                    this.$message({
                        message: `删除成功`,
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


