<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>推广渠道</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.Type" placeholder="类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.Status" placeholder="状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item> -->
        <!-- <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="productList" style="width: 100%" :border='true'>
      <el-table-column label="规则名称" prop="Name">
      </el-table-column>
      <!-- <el-table-column label="参与停车场" prop="ParkName">
        <template slot-scope="scope">
          <el-popover ref="popover1" placement="right" width="300" trigger="click">
            <el-table :data="parkList">
              <el-table-column width="300" property="parkname" label="停车场"></el-table-column>
            </el-table>
            <span slot="reference" @click="parkClick(scope.$index, scope.row)">点击查看</span>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column label="开始时间" prop="StartTime">
      </el-table-column>
      <el-table-column label="结束时间" prop="EndTime">
      </el-table-column>
      <!-- <el-table-column label="状态" prop="Type" sortable>
      </el-table-column> -->
      <el-table-column label="领取(未选中)/发放" prop="IsClose">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.IsClose" disabled>领取/发放</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.IsDelete" style="margin-bottom:10px;" size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.IsDelete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        keyword: ""
      },
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
        .get("api/BackChannel/GetChannelList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    /*
          1、添加编辑时获取角色列表，渲染下拉菜单
          2、点击管理员列表的编辑，弹出模态框
          3、点击新增管理严，弹出模态框
          4、保存修改
          5、保存添加
        */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      var urlId = obj.ID;
      localStorage.setItem("ChannelInfo", JSON.stringify(obj));
      this.$router.push("/ChannelList/ChannelListEdit/id=" + urlId);
    },
    handleDelete(index, row) {
      var obj = Object.assign({}, row);
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackOperate/Delete", {
            params: {
              Token: getCookie("token"),
              ID: obj.ID
            }
          })
          .then(
            function(response) {
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
    },
    handleAdd() {
      this.$router.push("/ChannelList/ChannelListAdd");
    },
    // 是否启用
    handleOnline(index, row) {
      var obj = Object.assign({}, row);
      this.$http
        .get("api/BackOperate/IsEnable", {
          params: {
            token: getCookie("token"),
            couponid: obj.ID
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.$message({
                showClose: true,
                type: "success",
                message: response.data.Result
              });
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
