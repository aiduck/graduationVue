<template>
    <el-dialog
        title="请添加信息"
        :visible.sync = "show"
        @close="handleCancel"
        :close-on-click-modal="false"
        center>
        <el-form :inline="true" ref="form" :model="addForm" label-width="9rem" :rules="rules">
            <el-row>
                <el-col :span="12" v-for="(value, key, index) in tmpl" :key="index">
                    <el-form-item :label="value.label" :prop="key">
                        <el-input 
                            v-if="value.inputType === 0"
                            v-model="addForm[key]" 
                            :placeholder="placeholderFilter(value.inputType, value.label)">
                        </el-input>
                        <el-select
                            v-if="value.inputType === 1"
                            v-model="addForm[key]"
                            clearable
                            :placeholder="placeholderFilter(value.inputType, value.label)">
                                <el-option 
                                    v-for="item in valueLabelMap[key]"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value">
                                </el-option>
                        </el-select>
                    
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleDetermine">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: ["show","rules","tmpl","valueLabelMap"],
    data() {
        return {
            addForm: {},
            visible: this.show,
        }
    },
    watch: {
        show(val) {
            console.log("筛选框可见状态改变", val);
            this.visible = val;
        }
    },
    methods: {
        handleCancel() {
            this.$emit("sendInfo");
            this.visible = false;
            this.$refs.form.resetFields();
        },
        handleDetermine() {
            // 表单验证
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let _form = JSON.parse(JSON.stringify(this.addForm))
                    this.$emit("sendInfo", _form);
                    this.visible = false;
                    this.$refs.form.resetFields();
                } else {
                    console.log('验证内容不通过');
                    return false;
                }
            });
        },
        placeholderFilter: function(type, label) {
            var str = '';
            switch (type) {
            case 0:
                str = "请输入";
                break;
            case 1:
                str = "请选择";
                break;
            default:
            }
            str = str + label;
            return str;
        },
    }
}
</script>
<style scoped>
 .el-form-item__label {
    width: 4rem !important;
    display: inline-block !important;
  }
</style>

