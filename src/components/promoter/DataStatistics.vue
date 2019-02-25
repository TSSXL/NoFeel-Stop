<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="手机号" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="是否签约">
          <el-select v-model="filters.Type" placeholder="是否消费">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否消费">
          <el-select v-model="filters.Status" placeholder="是否消费">
            <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
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
    <el-table :data="productList" style="width: 100%" :border='true'>
      <el-table-column label="手机号" prop="ExtensionPhone">
      </el-table-column>
      <el-table-column label="被邀请人手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="被邀请人注册时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="被邀请人登录时间" prop="LoginTime">
      </el-table-column>
      <el-table-column label="被邀请人签约一网通" prop="IsSign">
      </el-table-column>
      <el-table-column label="签约时间" prop="SignTime">
      </el-table-column>
      <el-table-column label="被邀请人首笔消费" prop="IsConsumption">
      </el-table-column>
      <el-table-column label="首笔消费时间" prop="FisrtConsuptionTime">
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.IsDelete" style="margin-bottom:10px;" size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.IsDelete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
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
      pageSize: 10,
      pageCount: 1,
      mainurl: "",
      // 搜索关键字
      filters: {
        keyword: "",
        Type: -1,
        Status: -1
      },
      // 状态数组
      typeList: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "是",
          value: 1
        },
        {
          name: "否",
          value: 0
        }
      ],
      // 状态数组
      statusList: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "是",
          value: 1
        },
        {
          name: "否",
          value: 0
        }
      ],
      parkList: []
    };
  },
  methods: {
    parkClick(index, row) {
      var parkAllList = [];
      var obj = Object.assign({}, row).ParkName;
      var smallobj = [];
      obj.forEach(element => {
        smallobj = [
          {
            parkname: element
          }
        ];
        parkAllList = parkAllList.concat(smallobj);
      });
      this.parkList = parkAllList;
    },
    Days(row, status) {
      var status = row[status.property];
      switch (status) {
        case -1:
          return (status = "全部");
          break;
        case 0:
          return (status = "停车券");
          break;
        case 1:
          return (status = "充值停车币");
          break;
        case 2:
          return (status = "充值月卡");
          break;
        case 3:
          return (status = "续费月卡");
          break;
        default:
          return (status = "余额充值");
          break;
      }
    },
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
        .get("api/BackEarth/DataStatistics", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
            t: this.filters.Type,
            p: this.filters.Status
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.productList = response.data.Result.List;
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
    //
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    getAllUsers() {
      this.filters = {
        keyword: "",
        Type: -1,
        Status: -1
      };
      this.getInfo();
    },
    // 导出
    outOrder() {
      this.$http
        .get("api/BackEarth/ExportDataStatistics")
        .then(
          function(response) {
            if (response.data.Status == 1) {
              var a = document.createElement("a");
              a.href = mainurl + response.data.Result;
              a.download = "地推数据导出表";
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    }

    // handleDelete(index, row) {
    //   var obj = Object.assign({}, row);
    //   this.$confirm("确认删除吗？", "提示", {}).then(() => {
    //     this.$http
    //       .get("api/BackOperate/Delete", {
    //         params: {
    //           Token: getCookie("token"),
    //           ID: obj.ID
    //         }
    //       })
    //       .then(
    //         function(response) {
    //           var status = response.data.Status;
    //           if (status === 1) {
    //             this.getInfo();
    //           } else if (status === 40001) {
    //             this.$message({
    //               showClose: true,
    //               type: "warning",
    //               message: response.data.Result
    //             });
    //             setTimeout(() => {
    //               this.$router.push({
    //                 path: "/login"
    //               });
    //             }, 1500);
    //           }
    //         }.bind(this)
    //       )
    //       // 请求error
    //       .catch(
    //         function(error) {
    //           this.$notify.error({
    //             title: "错误",
    //             message: "错误：请检查网络"
    //           });
    //         }.bind(this)
    //       );
    //   });
    // },
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

#file {
  position: absolute;
  right: 0;
  top: 0;
  width: 70px;
  height: 40px;
  opacity: 0;
}
</style>
