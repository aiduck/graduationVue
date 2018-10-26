<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 基础信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips base-tip">
                当前选择班级：{{msg}}
            </div>
            <el-row class="box" type="flex" justify="space-between">
                <el-col :span="8" class="box-item">
                    <el-row type="flex" justify="space-between" class="item-info">
                        <el-col :span="4" class="item-title">学院</el-col>
                        <el-col :span="20" class="item-add">
                            <!-- 导入 -->
                            <input type="file" @change="importFile(this)" id="imFile" style="display: none"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                            <!-- 导出 -->
                            <!-- <a id="downlink"></a> -->
                            <el-tooltip effect="dark" content="格式（学院+学院状态）" placement="top">
                                <el-button plain type="success" @click="uploadFile('college')" >导入</el-button>
                            </el-tooltip>
                            <!-- <el-button plain type="info" @click="downloadFile(college)" >导出</el-button> -->
                            <el-button plain type="primary" @click="handleAdd('college')">添加</el-button>
                        </el-col>
                    </el-row>
                    <transition-group tag="div" id="college" class="item-ul">
                        <div v-if="college.length <= 0" :key="-1">数据为空</div>
                        <div v-else v-for="(item,index) in college" class="list" :key="index" @click="handleItemClick(item, 'college')">
                            {{item.college_id}}
                            <el-button v-if="item.status == '可用'" plain type="danger" class="list-del" @click="handleUsed('college','不可用', item,$event)">禁用</el-button>
                            <el-button v-else plain type="primary" class="list-del" @click="handleUsed('college','可用',item,$event)">启用</el-button>
                        </div>
                    </transition-group>
                </el-col>
                <el-col :span="8" class="box-item">
                    <el-row type="flex" justify="space-between" class="item-info">
                        <el-col :span="4" class="item-title">专业</el-col>
                        <el-col :span="20" class="item-add">
                            <el-tooltip effect="dark" content="格式（学院+专业+专业状态）" placement="top">
                                <el-button plain type="success" @click="uploadFile('major')" >导入</el-button>
                            </el-tooltip>
                            <!-- <el-button plain type="info"  @click="downloadFile(major)" >导出</el-button> -->
                            <el-button  plain type="primary"@click="handleAdd('major')" >添加</el-button>
                        </el-col>
                    </el-row>
                    <transition-group tag="div" id="doing" class="item-ul">
                        <div v-if="major.length <= 0" :key="-1">数据为空</div>
                        <div v-else v-for="(item,index) in major" class="list" :key="index" @click="handleItemClick(item, 'major')">
                            {{item.major_id}}
                            <el-button v-if="item.status == '可用'" plain type="danger" class="list-del" @click="handleUsed('major','不可用', item,$event)">禁用</el-button>
                            <el-button v-else plain type="primary" class="list-del" @click="handleUsed('major','可用', item,$event)">启用</el-button>
                        </div>
                    </transition-group>
                </el-col>
                <el-col :span="8" class="box-item">
                    <el-row type="flex" justify="space-between" class="item-info">
                        <el-col :span="4" class="item-title">班级</el-col>
                        <el-col :span="20" class="item-add">
                            <el-tooltip effect="dark" content="格式（专业+班级）" placement="top">
                                <el-button plain type="success" @click="uploadFile('adclass')" >导入</el-button>
                            </el-tooltip>
                            <!-- <el-button plain type="info"  @click="downloadFile(adclass)" >导出</el-button> -->
                            <el-button  plain type="primary" @click="handleAdd('adclass')">添加</el-button>
                        </el-col>
                    </el-row>
                    <transition-group tag="div" id="done" class="item-ul">
                        <div v-if="adclass.length <= 0" :key="-1">数据为空</div>
                        <div v-else v-for="(item,index) in adclass" class="list" :key="index">
                            {{item.aclass_id}}
                            <el-button plain type="danger" class="list-del" @click="handleDel(item, index)">删除</el-button>
                        </div>
                    </transition-group>
                </el-col>      
            </el-row>

            <!-- 添加组件 -->
            <el-dialog 
                title="添加信息" 
                :visible.sync="dialogFormVisible"
                :close-on-click-modal="false">
                <el-form :model="form">
                    <el-form-item label="添加学院" :label-width="formLabelWidth">
                        <el-input v-if="this.addModel === 'college'" v-model="form.college" autocomplete="off"></el-input>
                        <el-select v-else v-model="form.college" placeholder="请选择学院" @change="handleSelect('college')">
                            <el-option
                                v-for="item in college"
                                :key="item.college_id"
                                :label="item.college_id"
                                :value="item.college_id"
                                :disabled="item.status === '不可用'">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  v-if="this.addModel !== 'college'" label="添加专业" :label-width="formLabelWidth">
                        <el-input v-if="this.addModel === 'major'" v-model="form.major" autocomplete="off" :disabled="majorSelect"></el-input>
                        <el-select v-else v-model="form.major" placeholder="请选择专业" :disabled="majorSelect" @change="handleSelect('major')">
                            <el-option
                                v-for="item in selectMajorList"
                                :key="item.major_id"
                                :label="item.major_id"
                                :value="item.major_id"
                                :disabled="item.status === '不可用'">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="this.addModel === 'adclass'" label="添加班级" :label-width="formLabelWidth">
                        <el-input v-model="form.adclass" autocomplete="off" :disabled="adclassSelect"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleAffirm" :disabled="isLastInput">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    // 引入xlsx
    var XLSX = require('xlsx');
    import axios from '../../utils/axiosHttp.js';
    export default {
        name: 'baseinfo',
        data() {
            return {
                msg: '',
                isExitEmpty: false,
                college: [], // 学院信息
                major: [],   // 专业信息
                selectMajorList: [], // 下拉框中的专业信息
                adclass:[],  // 班级信息
                fullscreenLoading: false, // 加载进度条
                imFile: '', // 导入文件el
                excelData: [],  // 下载信息（去除）
                // 上传按钮
                isCollegeUpload: false,
                isMajorUpload: false,
                isAdclassUpload: false,
                // 添加按钮
                dialogFormVisible: false,
                form: {
                    college: '',
                    major: '',
                    adclass: '',
                },
                formLabelWidth: '120px',
                addModel: 'college',
                isLastInput: true,
                // 添加对话框中的下拉框
                majorSelect: true,
                adclassSelect: true,
            }
        },
        watch: {
            // 确认添加按钮是否可以显示
            form: {
                handler: function(val) {
                   if(this.addModel === 'college') {
                       this.isLastInput = val.college !== '' ? false : true;
                   } else if(this.addModel === 'major') {
                       this.isLastInput = val.major !== '' ? false : true;
                   } else if(this.addModel === 'adclass') {
                       this.isLastInput = val.adclass !== '' ? false : true;
                   }
                },
                deep: true
            }
        },
        mounted() {
            this.imFile = document.getElementById('imFile')
            // this.outFile = document.getElementById('downlink')
            this.initCollege(null,'init');
            // console.log(this.$router.currentRoute.fullPath);
        },
        methods: {
            // 点击item的选中事件
            handleItemClick(item, type) {
                if(type === 'major') {
                    this.initAdclass(item);
                } else if(type === 'college') {
                    this.initMajor(item);
                }
            },
            // 改变专业状态接口（提前要请求接口，在判断是否可以改变这个专业的状态
            updateMajorStatue(data) {    
                let majorObj = {
                    item: data.item
                }
                axios
                .post('/api/basicInfo/queryBefupSta',majorObj)
                .then(res => {
                    if(res.data.code === 200 && res.data.data === '可用' ){
                        this.updateStatue(data);
                    } else {
                        this.$message({
                            message: `检查该专业属于的学院的状态`,
                            type: 'error'
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            },
            // 改变学院状态接口
            updateStatue(data) {
                axios
                .post('/api/basicInfo/updateStatus',data)
                .then(res => {
                    if(res.data.code === 200){
                        if(data.type === 'major') {
                            this.initMajor(data.item,'statusBtn');
                        } else if(data.type === 'college') {
                            this.initCollege(data.item);
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            },
            // 禁用启用按钮（不用前端改变，是为了msg的内容的更新
            handleUsed(type, status, item,event) {
                // 阻止父元素到div的点击事件的启动
                event.stopPropagation();
                let data = {
                    type: type,
                    status: status,
                    item: item
                }
                if(type === 'major') {
                    this.updateMajorStatue(data);
                } else if(type === 'college') {
                    this.updateStatue(data);
                }
            },
            // 删除按钮
            handleDel(item, index) {
                let data = {
                    adclassObj: item
                }
                axios
                .post('/api/basicInfo/delAdClass',data)
                .then(res => {
                    if(res.data.code === 200){
                        // 前端删除
                        this.adclass.splice(index, 1);
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            },
            // mysql中获取数据初始化信息接口
            initCollege(item,from) {
                axios
                .get('/api/basicInfo/queryCollege')
                .then(res => {
                    if(res.data.code === 200){
                        this.college = res.data.data;
                        if(res.data.data.length > 0) {
                            if(this.college[0] !== undefined && from === 'init') {
                                this.initMajor(this.college[0], 'init');
                            } else {
                                this.initMajor(item);
                            }
                        } else {
                            this.college = [];
                            this.major = [];
                            this.adclass = [];
                            // this.$message({
                            //     message: `学院查询数据为空`,
                            //     type: 'warning'
                            // });
                        }
                        
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
            initMajor(college, from) {
                let collegeId = {
                    collegeId: college.college_id
                };
                axios
                .post('/api/basicInfo/queryMajor',collegeId)
                .then(res => {
                    if(res.data.code === 200){
                        if(res.data.data.length > 0) {
                            // console.log(res.data.data);
                            // 是否是下拉框中要更新信息
                            if(from === 'select') {
                                this.selectMajorList = res.data.data;
                            } else if(from === 'init'){
                                this.major = res.data.data;
                            } else if(from === 'statusBtn') {
                                this.major = res.data.data;
                                this.initAdclass(college);
                            } else {
                                this.major = res.data.data;
                                this.initAdclass(this.major[0]);
                            }
                            // 是否调用班级信息的接口
                            if(this.major[0] !== undefined && from === 'init') {
                                this.initAdclass(this.major[0], 'init');
                            }
                        } else {
                            this.major = [];
                            this.adclass = [];
                            // this.$message({
                            //     message: `专业查询数据为空`,
                            //     type: 'warning'
                            // });
                        } 
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
            initAdclass(major, from) {
                let majorId = {
                    majorId: major.major_id
                };
                axios
                .post('/api/basicInfo/queryAdClass',majorId)
                .then(res => {
                    if(res.data.code === 200){
                        if(res.data.data.length > 0) {
                            if(from === 'init') {
                                this.adclass = res.data.data;
                                this.initMsg(0,0,0);
                            } else {
                                this.adclass = res.data.data;
                                this.infoMsg(major.college_id,major.major_id,0);
                            } 
                        } else {
                            this.adclass = [];
                            // this.$message({
                            //     message: `班级查询数据为空`,
                            //     type: 'warning'
                            // });
                        }
                        
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            },
            initMsg(collegeIndex, majorIndex,adclassIndex) {
                this.msg = `${this.college[collegeIndex].college_id}|${this.major[majorIndex].major_id}|${this.adclass[adclassIndex].aclass_id}`
            },
            infoMsg(college, major,adclassIndex) {
                this.msg = `${college}|${major}|${this.adclass[adclassIndex].aclass_id}`
            },
            // 导入
            uploadFile(type) {
                if(type === 'college') {
                    this.isCollegeUpload = true;
                    this.isMajorUpload = false;
                    this.isAdclassUpload = false;
                } else if(type === 'major') {
                    this.isCollegeUpload = false;
                    this.isMajorUpload = true;
                    this.isAdclassUpload = false;
                } else if(type === 'adclass') {
                    this.isCollegeUpload = false;
                    this.isMajorUpload = false;
                    this.isAdclassUpload = true;
                }
                this.imFile.click()
            },
            // 导出（去除）
            downloadFile(excelData){
                // 表格标题
                let data = [{
                    academy: '学院',
                    academy_status: '学院状态'
                }]
                data = data.concat(excelData)
                // 文件名
                this.downloadExl(data, '学院名单')
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
            insertCollege(data) {
                axios
                .post("/api/basicInfo/insertCollege",data)
                .then(res => {
                    if (res.data.code == 200) {
                        let collegeData = res.data.data;
                        // 导入信息之后，都进行一次初始化
                        this.initCollege(null,'init');
                       if(collegeData.warningCount !== 0) {
                            // 这边就是外键的约束，如果存在错误就是插入的专业对应的学院信息不存在
                            this.$message({
                                message: `有${collegeData.warningCount}条数据错误，请检查是否存在学院信息错误`,
                                type: 'warning'
                            });
                        } else if(collegeData.warningCount === 0) {
                            this.$message({
                                message: `成功插入${collegeData.affectedRows}条信息`,
                                type: 'success'
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                });
            },
            insertMajor(data) {
                axios
                .post("/api/basicInfo/insertMajor",data)
                .then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        let majorData = res.data.data;
                        // 导入信息之后，都进行一次初始化
                        this.initCollege(null,'init');
                        if(majorData.warningCount !== 0) {
                            // 这边就是外键的约束，如果存在错误就是插入的专业对应的学院信息不存在
                            this.$message({
                                message: `有${majorData.warningCount}条数据错误，请检查是否存在学院信息错误`,
                                type: 'warning'
                            });
                        } else if(majorData.warningCount === 0) {
                            this.$message({
                                message: `成功插入${majorData.affectedRows}条信息`,
                                type: 'success'
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                });
            },
            insertAdclass(data) {
                axios
                .post("/api/basicInfo/insertAdclass",data)
                .then(res => {
                    if (res.data.code == 200) {
                        let adclassData = res.data.data;
                        // 导入信息之后，都进行一次初始化
                        this.initCollege(null,'init');
                       if(adclassData.warningCount !== 0) {
                            // 这边就是外键的约束，如果存在错误就是插入的班级对应的专业信息不存在
                            this.$message({
                                message: `有${adclassData.warningCount}条数据错误，请检查是否存在专业信息错误`,
                                type: 'warning'
                            });
                        } else if(adclassData.warningCount === 0) {
                            this.$message({
                                message: `成功插入${adclassData.affectedRows}条信息`,
                                type: 'success'
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                });
            },
            dealFile(data) {   // excel导入数据存入mysql
                var dataCollege = [];
                var dataMajor = [];
                var dataAdclass = [];
                // 处理导入的数据内容
                if(this.isCollegeUpload) {
                    data.map((item, index) => {
                        if(item.学院 === undefined) {
                            this.isExitEmpty = true
                        } else {
                            dataCollege.push({
                                college_id: item.学院,
                                status: item.学院状态
                            });
                        }
                    });
                }else if(this.isMajorUpload) {
                    data.map((item, index) => {
                        if(item.专业 === undefined || item.学院 === undefined) {
                            this.isExitEmpty = true
                        } else {
                            dataMajor.push({
                                major_id: item.专业,
                                college_id: item.学院,
                                status: item.专业状态
                            });
                        }
                       
                    });
                }else  if(this.isAdclassUpload) {
                    data.map((item, index) => {
                        if(item.专业 === undefined || item.班级 === undefined) {
                            this.isExitEmpty = true
                        } else {
                            dataAdclass.push({
                                aclass_id: item.班级,
                                major_id: item.专业,
                            });
                        }
                    });
                }
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
                        if(this.isCollegeUpload) {
                            this.insertCollege(dataCollege);
                        } else if(this.isMajorUpload){
                            this.insertMajor(dataMajor);
                        } else if(this.isAdclassUpload) {
                            this.insertAdclass(dataAdclass);
                        }
                    }
                }
            },
            // 导出用到的函数（去除）
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
            // 添加按钮(弹出dialog对话框)
            handleAdd(type) {
                // 初始化信息
                this.majorSelect = true;
                this.adclassSelect = true;
                this.form =  {
                    college: '',
                    major: '',
                    adclass: '',
                };
                this.dialogFormVisible = true;
                this.addModel = type;
            },
            // 处理下拉框
            handleSelect(type) {
                if(type === 'college' && this.form.college !== undefined) {
                    let collegeObj = {
                        college_id: this.form.college,
                        status: '可用'
                    }
                    // 更新下拉框中的专业信息，而不更新三个列表框的信息
                    this.initMajor(collegeObj,'select');
                    // 需要改
                    this.majorSelect = false;
                } else if(type === 'major' && this.form.major !== undefined) {
                    this.adclassSelect = false;
                }
            },
            // 添加接口
            addBaseInfo(data) {
                axios
                .post('/api/basicInfo/addBasicInfo',data)
                .then(res => {
                    if(res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            },
            // 确认添加，链接后端mysql数据信息
            handleAffirm(){
                if(this.addModel === 'college') {
                    let data = {
                        type: 'college',
                        item: {
                            college_id: this.form.college
                        }
                    }
                    this.addBaseInfo(data);
                } else if(this.addModel === 'major') {
                    let data = {
                        type: 'major',
                        item: {
                            major_id: this.form.major,
                            college_id: this.form.college,
                        }
                    }
                    this.addBaseInfo(data);
                } else if(this.addModel === 'adclass') {
                     let data = {
                        type: 'adclass',
                        item: {
                            major_id: this.form.major,
                            aclass_id: this.form.adclass
                        }
                    }
                    this.addBaseInfo(data);
                }
            },
            // 取消添加，dialog对话框消失
            handleCancel() {
                this.dialogFormVisible = false;
            }
        },

       
    }

</script>

<style scoped>
    .base-tip {
        position: relative;
    }
    .box {
        display: flex;
        user-select: none;
        width: 100%;
    }
    .box-item {
        flex: 1;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .box-item:last-child {
        margin-right: 0;
    }
    .item-title {
        position: relative;
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-info {
        height: 40px;
    }
    .item-add {
        margin-right: 10px;
        line-height: 40px;
        text-align: right; 
    }
    .item-ul {
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar {
        width: 0;
    }
    .item-error {
        text-align: center;
        font-size: 600;
        padding: 30px 0;
    }
    .list {
        position: relative;
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .list-del {
        position: absolute;
        margin-right: 10px;
        right: 0;
        top: 8px;
        padding: 5px 7px;
    }
    .list:hover {
        border: 1px solid #20a0ff;
    }
    .title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .upload {
        padding-bottom: 10px;
    }
</style>
