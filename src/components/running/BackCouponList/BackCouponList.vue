<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
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
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="productList" style="width: 100%" :border='true'>
      <!-- <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品图片:">
            <img v-for="(item,index) in scope.row.Image" :key="index" :src="mainurl+item" width="200" style="margin-left:20px;" />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column> -->
      <el-table-column label="活动名称" prop="ActivityName">
      </el-table-column>
      <el-table-column label="参与停车场" prop="ParkName">
        <template slot-scope="scope">
          <el-popover ref="popover1" placement="right" width="300" trigger="click">
            <el-table :data="parkList">
              <el-table-column width="300" property="parkname" label="停车场"></el-table-column>
            </el-table>
            <span slot="reference" @click="parkClick(scope.$index, scope.row)">点击查看</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" prop="Time">
      </el-table-column>
      <el-table-column label="券额度" prop="FullCut">
      </el-table-column>
      <el-table-column label="类型" prop="Days" :formatter="Days">
      </el-table-column>
      <el-table-column label="状态" prop="Status" sortable>
      </el-table-column>
      <!-- <el-table-column label="是否启用" prop="IsEnable">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.IsEnable" @change="handleOnline(scope.$index, scope.row)">是/否</el-checkbox>
        </template>
      </el-table-column> -->
      <el-table-column label="已领取总量" prop="ReceiveCount">
      </el-table-column>
      <el-table-column label="已使用总量" prop="UseCount">
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
          name: "停车券",
          value: 0
        },
        {
          name: "充值停车币",
          value: 1
        },
        {
          name: "充值月卡",
          value: 2
        },
        {
          name: "续费月卡",
          value: 3
        },
        {
          name: "余额充值",
          value: 4
        }
      ],
      // 状态数组
      statusList: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "未开始",
          value: 0
        },
        {
          name: "活动中",
          value: 1
        },
        {
          name: "已过期",
          value: 2
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
        .get("api/BackOperate/BackCouponList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
            Type: this.filters.Type,
            Status: this.filters.Status
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
    /*
          1、添加编辑时获取角色列表，渲染下拉菜单
          2、点击管理员列表的编辑，弹出模态框
          3、点击新增管理严，弹出模态框
          4、保存修改
          5、保存添加
        */
    handleEdit(index, row) {
      console.log(Object.assign({}, row));
      var obj = Object.assign({}, row);
      var urlId = obj.ID;
      this.$router.push("/BackCouponList/CouponEdit/id=" + urlId);
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
      this.$router.push("/BackCouponList/CouponAdd");
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
