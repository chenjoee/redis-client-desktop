<template>
    <section>
        <h4 class="title">Redis连接
            <i
                    class="el-icon-plus add"
                    @click="dialogVisible = true"
            ></i>
        </h4>
        <el-dialog
                title="Redis连接"
                :visible.sync="dialogVisible"
                width="40%"
        >
            <el-form
                    ref="createBucket"
                    :model="form"
                    size="small"
            >

                <el-form-item
                        label="连接名"
                        prop="name"
                        :rules="{ required: true, message: '例：localhost', trigger: 'blur' }"
                >
                    <el-input
                            v-model="form.connName"
                            placeholder="redis连接名 例如：localhost"
                    ></el-input>
                </el-form-item>

                <el-form-item
                        label="地址"
                        prop="name"
                        :rules="{ required: true, message: '例：127.0.0.1:3306', trigger: 'blur' }"
                >
                    <el-input
                            v-model="form.connAddr"
                            placeholder="redis地址 IP:Port"
                    ></el-input>
                </el-form-item>

                <el-form-item
                        label="密码"
                        prop="password"
                        :rules="{ required: true, message: '例：12345678', trigger: 'blur' }"
                >
                    <el-input
                            v-model="form.password"
                            placeholder="redis密码，可以为空"
                    ></el-input>
                </el-form-item>


                <!--<el-form-item-->
                <!--label="密码"-->
                <!--prop="region"-->
                <!--:rules="{ required: true, message: '存储区域为空', trigger: 'blur' }"-->
                <!--&gt;-->
                <!--<el-select-->
                <!--v-model="form.region"-->
                <!--placeholder="请选择存储区域"-->
                <!--style="width: 100%"-->
                <!--&gt;-->
                <!--<el-option-->
                <!--:label="value"-->
                <!--:value="key"-->
                <!--v-for="(value, key) in regionList"-->
                <!--:key="key"-->
                <!--&gt;</el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
            </el-form>
            <span
                    slot="footer"
                    class="dialog-footer"
            >
        <el-button
                size="mini"
                @click="cancel('createBucket')"
        >取 消</el-button>
        <el-button
                size="mini"
                type="primary"
                @click="submitForm('createBucket')"
        >确 定</el-button>
      </span>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                form: {
                    connName: "",
                    connAddr: "",
                    password: ""
                },
                regionList: {
                    z0: "华东",
                    z1: "华北",
                    z2: "华南",
                    na0: "北美",
                    as0: "东南亚"
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$store
                            .dispatch("CreateBucket", {
                                name: this.form.name,
                                region: this.form.region
                            })
                            .then(it => {
                                if (it.status === 200) {
                                    this.$message.success("添加成功");
                                    this.cancel("createBucket");
                                }
                            })
                            .catch(() => {
                                this.$message.error("添加失败");
                            });
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancel(formName) {
                this.resetForm(formName);
                this.dialogVisible = false;
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .title {
        font-weight: normal;
        font-size: 12px;
        padding: 10px;
        color: #909399;
        overflow: hidden;
        .add {
            float: right;
            background: #409eff;
            border-radius: 100%;
            padding: 2px;
            color: #fff;
            cursor: pointer;
        }
    }
</style>
