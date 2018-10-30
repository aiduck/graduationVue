<template>
    <el-dialog
        title="请添加信息"
        :visible.sync = "visible"
        @close="handleCancel"
        :close-on-click-modal="false"
        width="700px"
        center>
        <el-form :inline="true" ref="form" :model="addForm" :rules="rules">
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
                            :disabled="value.disabled"
                            clearable
                            :placeholder="placeholderFilter(value.inputType, value.label)"
                            @change="handleSelectChange(addForm[key], value)"
                            @clear="handleClear(value)">
                                <el-option 
                                    v-for="item in valueLabelMap[key]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled">
                                </el-option>
                        </el-select>
                        <el-date-picker
                            v-if="value.inputType === 2"
                            v-model="addForm[key]"
                            align="right"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年"
                            clearable>
                        </el-date-picker>
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
    props: [
        "show",
        "rules",
        "tmpl",
        "valueLabelMap"
    ],
    data() {
        return {
            addForm: {
                
            },
            visible: this.show,
        }
    },
    watch: {
        show(val) {
            console.log("添加框可见状态改变", val);
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
        handleSelectChange() {
            console.log("下拉选择框内容改变change");
            this.$emit("inputChange", arguments[0], arguments[1]);
        },
        handleClear(res) {
            console.log("下拉选择框内容清除clear");
            this.$emit("inputClear", res.label);
        }
    }
}
</script>
<style scoped>
 .el-form-item__label {
    width: 4rem !important;
    display: inline-block !important;
  }
</style>

