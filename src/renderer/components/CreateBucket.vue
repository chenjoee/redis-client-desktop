<template>
    <section class="CrateBucket">
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
                        prop="connName"
                        :rules="{ required: true, message: '例：localhost', trigger: 'blur' }"
                >
                    <el-input
                            v-model="form.connName"
                            placeholder="redis连接名 例如：localhost"
                    ></el-input>
                </el-form-item>

                <el-form-item
                        label="地址"
                        prop="connIP"
                        :rules="{ required: true, message: '例：127.0.0.1', trigger: 'blur' }"
                >
                    <el-input
                            v-model="form.connIP"
                            placeholder="redis IP"
                    ></el-input>
                </el-form-item>

                <el-form-item
                        label="端口"
                        prop="connPort"
                        :rules="{ required: true, message: '例：6379', trigger: 'blur' }"
                >
                    <el-input
                            v-model="form.connPort"
                            placeholder="redis IP"
                    ></el-input>
                </el-form-item>

                <el-form-item
                        label="密码"
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
    import { mapGetters } from "vuex";
    import {redisTool} from "@/utils/redistool";
    export default {
        data() {
            return {
                dialogVisible: false,
                form: {
                    connName: "localhost",
                    connIP: "127.0.0.1",
                    connPort: 6379,
                    password: ""
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        // this.$store.dispatch("connRedis", {
                        //         name: this.form.connName,
                        //         host: this.form.connIP,
                        //         port: this.form.connPort,
                        //         pwd: this.form.password
                        //     })
                        //新建redis连接, 放入store
                        debugger
                        let rdscl = this.getRedisConnList
                        for ( let item in rdscl) {
                            if (this.form.connName == rdscl[item].name) {
                                this.$message.error("连接名" + this.form.connName + "已存在")
                                return false;
                            }
                        }
                        let params = {
                            name: this.form.connName,
                            host: this.form.connIP,
                            port: this.form.connPort,
                            password: this.form.password
                        }

                        let r = redisTool.start(params);
                        if (r && r != "error") {
                            params.client = r;
                            rdscl.push(params);
                        }
                        this.cancel("createBucket");

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cancel(formName) {
                debugger
                this.resetForm(formName);
                this.dialogVisible = false;
            }
        },
        computed: {
            ...mapGetters(["getRedisConnList"])
        },
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

