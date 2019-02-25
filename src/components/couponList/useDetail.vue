<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/couponList' }">招行优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>使用详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="不匹配车牌号" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="起止时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始时间" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="outOrder()">导出订单</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="订单编号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="停车场编号" prop="ParkNumber">
      </el-table-column>
      <el-table-column label="停车场名" prop="ParkName">
      </el-table-column>
      <el-table-column label="车牌号" prop="LicensePlate">
      </el-table-column>
      <!-- :formatter="Status" -->
      <el-table-column label="券类型" prop="Status">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="支付金额" prop="TotalPrice" width="80">
      </el-table-column>
      <el-table-column label="优惠金额（元）" prop="Cut" width="80">
      </el-table-column>
      <el-table-column label="支付时间" prop="CreateTime" >
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
        EndTime: ""
      }
    };
  },
  methods: {
    /*
             1、获取列表 渲染列表
             2、搜索关键字
             3、分页
          */
    getInfo(cid, sid) {
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
        .get("api/BackCMBC/GetUseDetail", {
          params: {
            channelID: cid,
            sysCouponID: sid,
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            sTime: StTime,
            eTime: EndTime,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.List;
              this.CutPrice = response.data.Result.CutPrice;
              this.GrantCount = response.data.Result.GrantCount;
              this.ReceiveCount = response.data.Result.ReceiveCount;
              this.UseCount = response.data.Result.UseCount;
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
      this.getInfo(this.ChannelID, this.SysCouponID);
    },
    // 导出订单
    outOrder() {
      this.$http
        .get("api/BackCMBC/ExportUseDetail", {
          params: {
            channelID: this.ChannelID,
            sysCouponID: this.SysCouponID,
            status: -1,
            token: getCookie("token")
          }
        })
        .then(
          function(response) {
            if (response.data.Status == 1) {
              var a = document.createElement("a");
              a.href = mainurl + response.data.Result;
              a.download = "使用详情导出表";
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
    getAllUsers() {
      this.filters = {
        keyword: "",
        StTime: "2018-01-01",
        EndTime: ""
      };
      this.pageIndex = 1;
      this.getInfo(this.ChannelID, this.SysCouponID);
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo(this.ChannelID, this.SysCouponID);
    }
    // Status(row, status) {
    //   var status = row[status.property];
    //   switch (status) {
    //     case 0:
    //       return (status = "已入场");
    //       break;
    //     case 1:
    //       return (status = "已出场");
    //       break;
    //     default:
    //       return (status = "已关闭");
    //       break;
    //   }
    // },
  },
  mounted() {
    var url = window.location.href;
    this.ChannelID = url.split("id2=")[1];
    this.SysCouponID = url.split("id1=")[1].split("/")[0];
    this.getInfo(this.ChannelID, this.SysCouponID);
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
