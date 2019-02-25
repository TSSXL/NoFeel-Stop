<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>地推人员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="手机号" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="起止时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="起始时间" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filters.Type" placeholder="状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>          
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="outOrder()">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="编号" prop="Number">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="创建时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="状态" prop="Status" :formatter="Status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.Status == 0" type="info" @click="handleDel(scope.$index, scope.row)">通过</el-button>
          <el-button size="mini" v-else-if="scope.row.Status == 1" type="danger" @click="handleDel(scope.$index, scope.row)">踢除</el-button>
          <el-button size="mini" v-else-if="scope.row.Status == 2" type="warning" @click="handleDel(scope.$index, scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      orderList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      // 搜索关键字
      filters: {
        keyword: "",
        StTime: "2018-01-01",
        EndTime: "",
        Type: -1
      },
      // 状态数组
      typeList: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "待审核",
          value: 0
        },
        {
          name: "正常",
          value: 1
        },
        {
          name: "已踢除",
          value: 2
        }
      ]
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
      var EndTime = "";
      switch (this.filters.EndTime) {
        case "":
          EndTime = "-1";
          break;
        case null:
          EndTime = "-1";
          break;
        default:
          EndTime = this.filters.EndTime;
          break;
      }
      var StTime = "";
      switch (this.filters.StTime) {
        case "":
          StTime = "-1";
          break;
        case null:
          StTime = "-1";
          break;
        default:
          StTime = this.filters.StTime;
          break;
      }
      this.$http
        .get("api/BackEarth/GetPromoterList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
            type: this.filters.Type,
            stTime: StTime,
            endTime: EndTime
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.List;
              this.pageCount = response.data.Result.Page;
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
    //关键字搜索
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    getAllUsers() {
      this.filters = {
        keyword: "",
        StTime: "2018-01-01",
        EndTime: "",
        Type: -1
      };
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
        case -1:
          return (status = "全部");
          break;
        case 0:
          return (status = "待审核");
          break;
        case 1:
          return (status = "正常");
          break;
        case 2:
          return (status = "已踢除");
          break;
        default:
          return (status = "未知状态");
          break;
      }
    },
    // 导出
    outOrder() {
      this.$http
        .get("api/BackEarth/ExportPromoter")
        .then(
          function(response) {
            if (response.data.Status == 1) {
              var a = document.createElement("a");
              a.href = mainurl + response.data.Result;
              a.download = "地推用户导出表";
              a.click();
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
    },
    /*
          删除订单
        */
    handleDel(index, row) {
      var obj = Object.assign({}, row);
      this.$confirm("确认操作吗？", "提示", {}).then(() => {
        this.editLoading = true;
        this.$http
          .get("api/BackEarth/UpdateStatus", {
            params: {
              token: getCookie("token"),
              promoterid: obj.PromoterID
            }
          })
          .then(
            function(response) {
              this.editLoading = false;
              var status = response.data.Status;
              if (status == 1) {
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
  },
  mounted() {
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
/* 弹出框 */
.el-dialog__body .el-form-item {
  width: 60%;
  margin-left: calc(50% - 30%);
}
/* 选择公司 */
.el-select--medium {
  width: 100%;
}
.el-input--medium {
  width: 100%;
}
</style>
