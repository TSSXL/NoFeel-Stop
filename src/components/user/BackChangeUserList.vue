<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>换绑管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="productList" style="width: 100%" :border='true'>
      <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="图片校验:">
            <img :src="mainurl+props.row.DrivingLicenseImage" width="500" style="margin-left:20px;" />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column label="用户手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="车牌号" prop="LicensePlate">
      </el-table-column>
      <el-table-column label="车主姓名" prop="OwnerName">
      </el-table-column>
      <el-table-column label="车辆识别号" prop="RecognitionNumber">
      </el-table-column>
      <el-table-column label="发动机号" prop="EngineNumber">
      </el-table-column>
      <el-table-column label="品牌型号" prop="BrandModel">
      </el-table-column>
      <el-table-column label="状态" prop="Status" :formatter="Status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="scope.row.Status == 0">
          <el-button size="mini" type="primary"  style="margin-bottom:6px;" plain icon="el-icon-success" @click="handleEdit(scope.$index, scope.row,true)">通过</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-warning" @click="handleEdit(scope.$index, scope.row,false)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
       layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";

export default {
  data() {
    return {
      productList: [], //列表
      pageIndex: 1,
      pageSize: 5,
      pageCount: 1,
      mainurl: "",
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: ""
      }
    };
  },
  methods: {
    /*
         1、获取列表 渲染列表
         2、搜索关键字
         3、分页
      */
    getInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("api/BackUser/ChangeCar", {
          params: {
            Token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.productList = response.data.Result.list;
              this.pageCount = response.data.Result.page;
            } else if (status === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
              setTimeout(() => {
                this.$router.push({
                  path: "/login"
                });
              }, 1500);
            }
          }.bind(this)
        )
        // 请求error
        .catch(
          function(error) {
            loading.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    //
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    Status(row, status) {
      var status = row[status.property];
      switch (status) {
        case 0:
          return (status = "申请中");
          break;
        case 1:
          return (status = "审核通过");
          break;
        case 2:
          return (status = "已拒绝");
          break;
        default:
          break;
      }
    },
    handleEdit(index, row, num) {
      if (num) {
        this.$confirm("确认通过吗？", "提示", {}).then(() => {
          this.$http
            .get("api/BackUser/CheckCar", {
              params: {
                Token: getCookie("token"),
                ID: row.ID,
                Type: 1
              }
            })
            .then(
              function(response) {
                this.editLoading = false;
                var status = response.data.Status;
                if (status === 1) {
                  this.getInfo();
                } else if (status === 40001) {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                  setTimeout(() => {
                    this.$router.push({
                      path: "/login"
                    });
                  }, 1500);
                } else {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                }
              }.bind(this)
            )
            // 请求error
            .catch(
              function(error) {
                this.$notify.error({
                  title: "错误",
                  message: "错误：请检查网络"
                });
              }.bind(this)
            );
        });
      } else {
        this.$confirm("确认驳回吗？", "提示", {}).then(() => {
          this.$http
            .get("api/BackUser/CheckCar", {
              params: {
                Token: getCookie("token"),
                ID: row.ID,
                Type: 0
              }
            })
            .then(
              function(response) {
                this.editLoading = false;
                var status = response.data.Status;
                if (status === 1) {
                  this.getInfo();
                } else if (status === 40001) {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                  setTimeout(() => {
                    this.$router.push({
                      path: "/login"
                    });
                  }, 1500);
                } else {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                }
              }.bind(this)
            )
            // 请求error
            .catch(
              function(error) {
                this.$notify.error({
                  title: "错误",
                  message: "错误：请检查网络"
                });
              }.bind(this)
            );
        });
      }
    }
  },
  mounted() {
    this.mainurl = mainurl;
    this.getInfo();
  }
};
</script>
<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}

.block {
  text-align: center;
  padding: 20px 0;
}
</style>
