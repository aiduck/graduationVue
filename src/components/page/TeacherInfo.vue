<template>
    <div class="wrap">
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 教师基本信息</el-breadcrumb-item>
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
                    <!-- 导入 -->
                    <input type="file" @change="importFile(this)" id="imFile" style="display: none"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    <!-- 导出 -->
                    <a id="downlink"></a> 
                    <div class="handle-box">
                        <el-button type="warning"  @click="handleDelAll">批量删除</el-button>
                        <el-button type="success"  @click="uploadFile">导入</el-button>
                        <el-button type="success"  @click="downloadFile" >导出</el-button>
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
                    :tmpl = "infoAddTmpl"
                    :valueLabelMap = "valueLabelMap"
                    :rules = "infoAddRules"
                    @sendInfo = "receiveInfo"
            ></add-box>
            <!-- 表格 -->
            <el-table 
                :data="tableData" 
                border
                style="width: 100%" 
                ref="multipleTable" 
                @selection-change="handleSelectionChange">

                <el-table-column type="expand">
                    <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item v-for="(value, key) in expandFormatMap" :key='key' :label="value" v-if="props.row[key] !== 'undefined'" class="expandItem">
                            <span>{{ props.row[key] }}</span>
                        </el-form-item>
                    </el-form>
                    </template>
                </el-table-column>

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
var XLSX = require('xlsx');
import axios from '../../utils/axiosHttp.js';
import util from '../../utils/utils.js';
import FilterBox from "../common/FilterBox";
import AddBox from '../common/AddBox'
export default {
    name: 'userInfo',
    components: { FilterBox, AddBox },
    data() {
        return {
            fullscreenLoading: false, // 加载进度条
            isExitEmpty: false,
            imFile: '', // 导入文件el
            excelData: [],  // 下载信息
            tableData: [],  // 表格数据信息
            multipleSelection: [], // 删除信息
            // 表格头部
            keyFormatMap: {
                // 格式化标签映射表
                username: "用户姓名",
                telno: "联系方式",
                address: "详细地址",
                status: "用户状态"
            },
            expandFormatMap: {
                // 格式化额外信息映射表
                // user_type_name: "用户类别",  
                email: "邮箱",
                sex: '性别',
                job_title: '职称',
                education: '学历'
            },
            hideMap: {
                user_id: "用户名"
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
                sex: [
                    {
                        value: "男",
                        label: "男"
                    },
                    {
                        value: "女",
                        label: "女"
                    }
                ]
            },
            filterTmpl: {
                user_id: {
                    label: "用户名",
                    inputType: 0 // 0 代表 input
                },
                username: {
                    label: "用户姓名",
                    inputType: 0 // 0 代表 input
                },
                status: {
                    label: "用户状态",
                    inputType: 1 // 1 代表下拉框
                },
                sex: {
                    label: "性别",
                    inputType: 1 // 1 代表下拉框
                }
            },
            filter: {
                //搜索条件
                user_id: "", // 用户名
                username: "", //用户姓名
                status: "", //用户状态
                sex: "", // 用户性别
            },
            // 添加表格参数
            showInfoAdd: false,
            infoAddTmpl: {
                user_id: {
                    label: "用户名",
                    inputType: 0 // 0 代表 input
                },
                username: {
                    label: "用户姓名",
                    inputType: 0 // 0 代表 input
                },
                email: {
                    label: "邮箱",
                    inputType: 0 // 0 代表 input
                },
                telno: {
                    label: "电话",
                    inputType: 0 // 0 代表 input
                },
                address: {
                    label: "地址",
                    inputType: 0 // 0 代表 input
                },
                status: {
                    label: "用户状态",
                    inputType: 1 // 1 代表下拉框
                },
                sex: {
                    label:'性别',
                    inputType: 1 // 1 代表下拉框
                },
                job_title: {
                    label:'职称',
                    inputType: 0 // 0 代表 input
                },
                education: {
                    label:'学历',
                    inputType: 0 // 0 代表 input
                }
            },
            infoAddRules: {
                user_id: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                username: [
                    { required: true, message: "请输入用户姓名", trigger: "blur" }
                ],
                // user_type_name: [
                //     { required: true, message: "请选择用户类型", trigger: "blur"}
                // ],
                status: [
                    { required: true, message: "请选择用户状态", trigger: "blur" }
                ],
                sex: [
                    { required: true, message: "请选择用户性别", trigger: "blur" }
                ],
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
        }
    },
    mounted() {
        this.imFile = document.getElementById('imFile');
        this.outFile = document.getElementById('downlink')
        this.initUserInfo(this.pageSize, this.currentPage);
    },
    methods: {
        // 初始化用户信息
        initUserInfo(pageSize, currentPage,val) {
            let params = {
                pageSize: pageSize,
                currentPage: currentPage
            }
            axios
            .get('/api/teacherInfo/queryLimitUser',{params})
            .then(res => {
                if(res.data.code === 200){
                    let userRes = res.data.data;
                    this.totalCount = userRes.total;
                    this.tableData = userRes.userList || [];
                    this.currentPage = val || 1;
                }   else {
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
                    let userIdList = [];
                    this.multipleSelection.map((item, index) => {
                        userIdList.push(item.user_id);
                    })
                    let params = {
                        userList: userIdList
                    }
                    axios
                    .post('api/teacherInfo/daleteUserList', params)
                    .then(res => {
                        if(res.data.code === 200) {
                            this.initUserInfo(this.pageSize, this.currentPage);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
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
        // 导入
        uploadFile() {
            this.imFile.click()
        },
        // 导入用到的函数
        importFile() {
            this.fullscreenLoading = true;
            let obj = this.imFile;
            if (!obj.files) {
                this.fullscreenLoading = false
                return
            }
            var f = obj.files[0];
            var reader = new FileReader();
            let $t = this
            reader.onload = function (e) {
                var data = e.target.result  
                if ($t.rABS) {
                    $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
                        type: 'base64'
                    });
                } else {
                    $t.wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
                $t.analyzeData(json);
                $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
            }
            if (this.rABS) {
                reader.readAsArrayBuffer(f)
            } else {
                reader.readAsBinaryString(f)
            }
        },
        fixdata(data) {  // 文件流转BinaryString
            var o = ''
            var l = 0
            var w = 10240
            for (; l < data.byteLength / w; ++l) {
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
            }
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
            return o
        },
        analyzeData(data) {  // 此处可以解析导入数据
            return data
        },
        // 批量导入用户信息接口
        insertUserInfo(data) {
            axios
            .post("/api/teacherInfo/insertUserList",data)
            .then(res => {
                if (res.data.code == 200) {
                    this.initUserInfo(this.pageSize, this.currentPage);
                    this.$message({
                        message: `成功插入信息`,
                        type: 'success'
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
            });
        },
        dealFile(data) {   // excel导入数据存入mysql
            // 处理导入的数据内容
            var insertData = [];
            data.map((item, index) => {
                if(item.用户名 === undefined || item.用户姓名 === undefined) {
                    this.isExitEmpty = true;
                } else {
                    let tableItem = {
                    user_id: item.用户名,
                    username: item.用户姓名,
                    password: item.密码,
                    email: item.邮箱,
                    telno: item.电话,
                    address: item.地址,
                    // user_type_name: '教师',
                    status: item.用户状态,
                    sex: item.性别,
                    job_title: item.职称,
                    education: item.学历
                    }
                    insertData.push(tableItem);
                }
            });
            // 初始化imFile的value值
            // 初始化进度为false
            this.imFile.value = ''
            this.fullscreenLoading = false
            if (data.length <= 0) {
                this.errorDialog = true
                this.errorMsg = '请导入正确信息'
            } else {
                //最后就是将数据存入后端
                if(this.isExitEmpty) {
                    this.$alert('导入的信息有存在空值的情况，请检查excel表格', 'excel空值', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.isExitEmpty = false;
                        }
                    });
                } else {
                    this.insertUserInfo(insertData);
                }
            }
        },
        // 导出
        downloadFile(){
            // tagEmpty = true 表示没有筛选那么导出数据所有内容
            // 反之则导出筛选之后的内容
            if(this.tagEmpty) {
                axios
                .get('/api/teacherInfo/queryUser')
                .then(res => {
                    if(res.data.code === 200){
                        this.excelData = res.data.data.userList || [];
                        // 表格标题
                        let data = [{
                            address: '地址',
                            email: '邮箱',
                            status: '用户状态',
                            telno: '联系方式',
                            user_id: '用户名',
                            user_type_name: '用户类型',
                            username: '用户姓名',
                            sex: '性别',
                            job_title: '职称',
                            education: '学历'
                        }]
                        data = data.concat(this.excelData)
                        // 文件名
                        this.downloadExl(data, '教师名单')
                    }   else {
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
            } else {
                let params = {
                    filter: this.filter
                }
                axios
                .post('/api/teacherInfo/queryAllFilter',params)
                .then(res => {
                    if(res.data.code === 200){
                        this.excelData = res.data.data.allList || [];
                        // 表格标题
                        let data = [{
                            address: '地址',
                            email: '邮箱',
                            status: '用户状态',
                            telno: '联系方式',
                            user_id: '用户名',
                            user_type_name: '用户类型',
                            username: '用户姓名',
                            sex: '性别',
                            job_title: '职称',
                            education: '学历'
                        }]
                        data = data.concat(this.excelData)
                        // 文件名
                        this.downloadExl(data, '教师名单')
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
        // 导出用到的函数
        downloadExl(json, downName, type) {  // 导出到excel
            let keyMap = [] // 获取键
            for (let k in json[0]) {
                keyMap.push(k)
            }
            let tmpdata = [] // 用来保存转换好的json
            json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                v: v[k],
                position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
            }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
                tmpdata[v.position] = {
                v: v.v
                }
            })
            let outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
            let tmpWB = {
                SheetNames: ['mySheet'], // 保存的表标题
                Sheets: {
                'mySheet': Object.assign({},
                    tmpdata, // 内容
                    {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
                    })
                }
            }
            let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
                {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
            ))], {
                type: ''
            })  // 创建二进制对象写入转换好的字节流
            var href = URL.createObjectURL(tmpDown)  // 创建对象超链接
            this.outFile.download = downName + '.xlsx'  // 下载名称
            this.outFile.href = href  // 绑定a标签
            this.outFile.click()  // 模拟点击实现下载
            setTimeout(function () {  // 延时释放
                URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
            }, 100)
        },
        getCharCol(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
            let s = ''
            let m = 0
            while (n > 0) {
                m = n % 26 + 1
                s = String.fromCharCode(m + 64) + s
                n = (n - m) / 26
            }
            return s
        },
        s2ab: function (s) { // 字符串转字符流
            var buf = new ArrayBuffer(s.length)
            var view = new Uint8Array(buf)
            for (var i = 0; i !== s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xFF
            }
            return buf
        },
        // 单个添加按钮
        handleAdd() {
            this.showInfoAdd = true;
        },
        receiveInfo(addform) {
            this.showInfoAdd = false;
            if (addform !== undefined) {
                axios
                .post('/api/teacherInfo/insertUserList', addform)
                .then(res => {
                    // console.log(res);
                    if(res.data.code === 200) {
                        this.$message({
                            message: `添加成功`,
                            type: 'success'
                        });
                        this.initUserInfo(this.pageSize, this.currentPage)
                    }   else {
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
                 this.initUserInfo(this.pageSize, this.currentPage);
            }
            else {
                console.log('进入筛选');
                this.showFilterBox = true;
            }
        },
        filterData(params) {
            axios
            .post('/api/teacherInfo/queryByFilter', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.tableData = res.data.data.userList || [];
                    this.totalCount = res.data.data.total;
                }   else {
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
                    //搜索条件
                    user_id: "", // 用户名
                    username: "", //用户姓名
                    status: "", //用户状态
                    sex: "", // 用户性别
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
            console.log(oldObj,newObj);
        },
        inputClear(type) {
            // 筛选框中下拉框handleClear清除
            console.log(type);
        },
        // 批量删除按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 更多按钮
        handleMore(index, row) {
            this.$router.push(`/teacherInfo/${row.user_id}/ischeck`);
        },
        // 编辑按钮
        handleEdit(index, row) {
            this.$router.push(`/teacherInfo/${row.user_id}/isedit`);
        },
        // 禁用按钮
        handleDelete(index, row) {
            let status = row.status === '可用' ? '不可用' : '可用';
            let user_id = row.user_id;
            let params = {
                status: status,
                user_id: user_id
            }
            axios
            .post('/api/userInfo/updateStatus', params)
            .then(res => {
                if(res.data.code === 200) {
                    // 前端修改用户状态
                    this.tableData[index].status = row.status === '可用' ? '不可用' : '可用';
                }   else {
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
                this.initUserInfo(this.pageSize, currentPage,val);
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


