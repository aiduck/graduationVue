<template>
    <el-dialog
        title = "请填写筛选信息"
        :visible.sync="visible"
        @close="handleCancel"
        :close-on-click-modal="false"
        width="700px"
        center
        >
        <el-form :inline="true" ref="form" :model="filter">
            <el-row>
                <el-col :span="12" v-for="(value, key, index) in tmpl" :key="index">
                    <el-form-item :label="value.label" :prop="key">
                        <el-input
                            v-if="value.inputType === 0"
                            v-model="filter[key]"
                            :placeholder="placeholderFilter(value.inputType, value.label)">
                        </el-input>
                        <el-select
                            v-if="value.inputType === 1"
                            v-model="filter[key]"
                            :placeholder="placeholderFilter(value.inputType, value.label)" 
                            :disabled="value.disabled"
                            clearable
                            @change="handleSelectChange(filter[key], value)"
                            @clear="handleClear(value)">
                            <el-option v-for="item in valueLabelMap[key]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-if="value.inputType === 2"
                            v-model="filter[key]"
                            align="right"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年"
                            clearable>
                        </el-date-picker>
                        <el-autocomplete
                            class="inline-input"
                            v-if="value.inputType === 3"
                            v-model="filter[key]"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            @select="handleSelect"
                        ></el-autocomplete>
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
        "dialogVisible",
        "tmpl",
        "filter",
        "valueLabelMap",
        "keyFormatMap",
    ],
    data() {
        return {
            visible: this.dialogVisible,
        }
    },
    mounted() {
      this.restaurants = this.loadAll();
    },
    methods: {
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll() {
            return [
                { "value": "2015级"},
                { "value": "2016级"},
                { "value": "2017级"},
            ];
        },
        handleSelect(item) {
            console.log(item);
        },
        //拼接字符串
        placeholderFilter: function(type, label) {
            var str = "";
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
        handleCancel() {
            this.$emit("sendFilter");
            this.visible = false;
        },
        handleDetermine() {
            this.$emit("sendFilter", this.filter);
            this.visible = false;  
        },
        handleSelectChange() {
            console.log("下拉选择框内容改变change");
            this.$emit("inputChange", arguments[0], arguments[1]);
        },
        handleClear(res) {
            console.log("下拉选择框内容清除clear");
            this.$emit("inputClear", res.label);
        }
    },
    watch: {
        dialogVisible(val) {
            this.visible = val;
        }
    }
}
</script>

<style scoped>
.col {
  margin-bottom: 10px;
}
.filter-input,
.filter-select {
  width: 50%;
  margin-left: 2%;
  margin-top: 1%;
}
/* .el-dialog {
} */
.footer {
  display: block;
}
</style>
