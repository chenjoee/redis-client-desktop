<template>
  <el-menu>
    <el-submenu v-for="(item,index) in getRedisConnList" :index="''+index" :key="item.name">
      <template slot="title">
        <i class="icon"></i>
        <span slot="title">{{item.name}}</span>
      </template>
      <el-menu-item :index="index + '-' + index2" v-for="(index2) in dbindex" >
        db{{index2}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
        dbindex: [0,1,3,4,5,6,7,8,9,10,11,12,13,14,15]
    };
  },
  methods: {
    switchBucket(data) {
      this.$store.dispatch("SwitchBucket", data);
    },
    beforeDelete(data) {
      this.$confirm("此操作将永久删除该空间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("DeleteBucket", data)
            .then(() => {
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  computed: {
    ...mapGetters(["getRedisConnList"])
  },
  mounted() {
    this.$store.dispatch("GetBucket");
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.delete {
  position: absolute;
  right: 0;
  top: 12px;
  color: #f36d6e;
}
span {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  display: inline-block;
  width: 130px;
}
.icon {
  background: url("../assets/data.png") no-repeat;
  width: 18px;
  height: 18px;
  background-size: contain;
  display: inline-block;
  margin-right: 5px;
}
</style>
