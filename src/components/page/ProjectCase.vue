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
            <!-- 表格 -->
            <el-table 
                :data="tableData" 
                border
                style="width: 100%" 
                ref="multipleTable">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column v-for="(value, key) in keyFormatMap"
                       :label="value"
                       :key='key'
                       :prop = "key"
                       :resizable="false">
                </el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleMore(scope.$index, scope.row)">更多</el-button>
                        <el-button
                            v-if="scope.row.isShowEditBtn"
                            size="small"
                            type="danger"
                            @click="handleEdit(scope.$index, scope.row)">取消收藏</el-button>
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
import { Store } from 'vuex';
import moment from 'moment';
export default {
    name: 'ProjectReport',
    components: { FilterBox },
    data() {
        return {
            tableData: [],  // 表格数据信息
            // 表格头部
            keyFormatMap: {
                // 格式化标签映射表   
                project_id: "项目ID",
                project_name: "项目名称",
                course_id: "课程ID",
                course_name: "课程名称",
                date: "收藏日期",  
                user_id: "教师ID"
            },
            expandFormatMap: {},
            hideMap: {
                id: "案例ID",
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
                project_id: [],
            },
            filterTmpl: {
                id: {
                    label: "收藏id",
                    inputType: 0 // 0 代表 input
                },
                date: {
                    label: "收藏日期",
                    inputType: 4 // 0 代表 时间选择器
                },
                project_id: {
                    label: "项目ID",
                    inputType: 0 // 0 代表 input
                },
                course_id: {
                    label: "课程ID",
                    inputType: 0 // 0 代表 input
                },
                user_id: {
                    label: "教师ID",
                    inputType: 0 // 0 代表 input
                }
            },
            filter: {
                //搜索条件
                id: "", 
                project_id: "",
                course_id: "",
                date: "",
                user_id: ""
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
        }

    },
    mounted() {
        this.initProjectCase(this.pageSize,this.currentPage);
    },
    methods: {
        // 初始化表格
        initProjectCase(pageSize, currentPage, val) {
            let params = {
                pageSize: pageSize,
                currentPage: currentPage
            }
            axios
            .get('/api/projectAchi/queryAllCase',{params})
            .then(res => {
                if(res.data.code === 200) {
                    let projectRes = res.data.data;
                    this.totalCount = projectRes.total;
                    this.tableData = projectRes.projectCaseList || [];
                    for(let i =0; i< this.tableData.length; i++) {

                        if(this.usertype !== '学生') {
                            if(this.tableData[i].user_id === this.$store.state.user.user_id) {
                           
                                this.tableData[i].isShowEditBtn = true;
                            } else {
                                
                                this.tableData[i].isShowEditBtn = false;
                            }
                        } else {
                            this.tableData[i].isShowEditBtn = false;
                        }
                    }
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

        // 搜索按钮相关函数
        enterFilter() {
            this.isFirstFilter = true;
            if(this.isFilterIng) {
                console.log('退出筛选');
                this.filter = util.resetObject(this.filter);
                this.initProjectCase(this.pageSize, this.currentPage);
            }
            else {
                console.log('进入筛选');
                this.showFilterBox = true;
            }
        },
        filterData(params) {
            axios
            .post('/api/projectAchi/queryCaseByFilter', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.tableData = res.data.data.caseList || [];
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
        receiveFilter(filterDate) {
            if (this.isFirstFilter && filterDate !== undefined) {
                let filter;
                if(filterDate.date) {
               
                    let date = moment(filterDate.date).format('YYYY-MM-DD');
                    delete filterDate.date;

                    filter = {
                        ...filterDate,
                        date: date
                    }
                } else {
                    filter = {
                        ...filterDate
                    }
                }

                this.filter = filter;
                let params = {
                    filter,
                    pageSize:this.pageSize,
                    currentPage:this.currentPage
                }
                this.filterData(params);
            } else if (this.isFirstFilter && filterDate === undefined) {
                let  filter = {
                    report_id: "",
                    report_date: "",
                    report_status: "",
                    project_id: "", 
                    user_id: "", 
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
        async inputChange(oldObj, newObj) {},
        inputClear(type) {},

        // 更多按钮
        handleMore(index, row) {
            this.$router.push(`/projecCaseDetail/${row.id}/ischeck`);
        },
        // 取消收藏按钮
        handleEdit(index, row) {
            let params = {
                project_id: row.project_id
            }
            axios
            .post('/api/projectAchi/queryDelIdByProID',params)
            .then(res => {
                if(res.data.code === 200) {
                    let  projectObj = {
                        project_id: row.project_id,
                    }
                    let params = {
                        delivery_id: res.data.data.delivery_id,
                        is_collect: '未收藏',
                        projectObj
                    }
                    axios
                    .post('/api/projectAchi/collectProjectCase',params)
                    .then(res => {
                        if(res.data.code === 200) {
                            this.initProjectCase(this.pageSize,this.currentPage);
                            this.$message({
                                type: 'success',
                                message: `修改成功`
                            });
                        }  else {
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
                }  else {
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
                this.initProjectCase(this.pageSize, currentPage,val);
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


