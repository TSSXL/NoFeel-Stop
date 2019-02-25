<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务订单查询</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="停车场">
          <el-input v-model="filters.ParkName" placeholder="停车场" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="filters.OrderNo" placeholder="订单号" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="促销出资方">
          <el-input v-model="filters.Contribution" placeholder="促销出资方" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="支付时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始时间" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="截止时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="订单来源">
          <el-select v-model="filters.OrderType" placeholder="订单来源">
            <el-option v-for="item in OrderType" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付渠道">
          <el-select v-model="filters.payType" placeholder="支付渠道">
            <el-option v-for="item in payList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>
          <!-- <a :href="orderTable"> -->
          <!-- <el-button type="primary" @click="outOrder()">导出订单</el-button> -->
          <!-- </a>               -->
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="订单号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="停车场" prop="ParkName">
      </el-table-column>
      <el-table-column label="订单来源" prop="OrderType"  :formatter="Status"  width="90">
      </el-table-column>
      <el-table-column label="订单总金额（元）" prop="TotalPrice" width="70">
      </el-table-column>
      <el-table-column label="优惠金额（元）" prop="Cut" width="70">
      </el-table-column>
      <el-table-column label="预约结余（元）" prop="DumpPrice" width="70">
      </el-table-column>
      <el-table-column label="实付金额（元）" prop="OnlinePrice" width="70">
      </el-table-column>
      <el-table-column label="支付时间" prop="PayTime">
      </el-table-column>
      <el-table-column label="支付渠道" prop="Type" :formatter="PayType">
      </el-table-column>
      <el-table-column label="优惠方式" prop="CutType">
      </el-table-column>
      <el-table-column label="用户券号" prop="UserCouponID">
      </el-table-column>
      <el-table-column label="促销名称" prop="ActivityName">
      </el-table-column>
      <el-table-column label="促销出资方" prop="Contribution" >
      </el-table-column>
       <!-- :formatter="ClientType" -->
      <el-table-column label="渠道流水号" prop="ChannelNumer">
      </el-table-column>
      <el-table-column label="退款金额" prop="RefundPrice">
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
      orderTable: "", //导出订单地址
      // 搜索关键字
      filters: {
        ParkName: "",
        OrderNo: "",
        Contribution: "",
        StTime: "2018-01-01",
        EndTime: "",
        OrderType: -1,
        payType: -1,
        ChannelNumer: -1 // 渠道流水号（暂时未用）
      },
      // 状态数组
      OrderType: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "预约",
          value: 0
        },
        {
          name: "临停",
          value: 1
        },
        {
          name: "月卡",
          value: 2
        },
        {
          name: "余额",
          value: 3
        }
      ],
      payList: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "支付宝",
          value: 0
        },
        {
          name: "微信",
          value: 1
        },
        {
          name: "银联",
          value: 2
        },
        {
          name: "余额",
          value: 3
        },
        {
          name: "一网通",
          value: 5
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
        .post(
          "api/BackFinance/GetOrderList",
          qs.stringify({
            Token: getCookie("token"),
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
            ParkName:
              this.filters.ParkName == "" ? "-1" : this.filters.ParkName,
            OrderNo: this.filters.OrderNo == "" ? "-1" : this.filters.OrderNo,
            Contribution:
              this.filters.Contribution == ""
                ? "-1"
                : this.filters.Contribution,
            OrderType: this.filters.OrderType,
            PayType: this.filters.payType,
            ChannelNumer: this.filters.ChannelNumer,
            stTime: StTime,
            endTime: EndTime
          })
        )
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
    // 导出订单
    outOrder() {
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
        .get("api/BackOrder/ExportOrderPark", {
          params: {
            startTime: StTime,
            endTime: EndTime,
            status: this.filters.Type
          }
        })
        .then(
          function(response) {
            if (response.data.Status == 1) {
              var a = document.createElement("a");
              a.href = mainurl + response.data.Result;
              a.download = "订单导出表";
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
        ParkName: "",
        OrderNo: "",
        Contribution: "",
        StTime: "2018-01-01",
        EndTime: "",
        OrderType: -1,
        payType: -1,
        ChannelNumer: -1 // 渠道流水号（暂时未用）
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
        case 0:
          return (status = "预约");
          break;
        case 1:
          return (status = "临停");
          break;
        case 3:
          return (status = "月卡");
          break;
        case 4:
          return (status = "余额");
          break;
        default:
          return (status = "未知状态");
          break;
      }
    },
    PayType(row, type) {
      var type = row[type.property];
      switch (type) {
        case 0:
          return (type = "支付宝");
          break;
        case 1:
          return (type = "微信");
          break;
        case 2:
          return (type = "银联");
          break;
        case 3:
          return (type = "余额");
          break;
        case 5:
          return (type = "一网通");
          break;
        default:
          return (type = "未知状态");
          break;
      }
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

/* .el-dialog__body .el-form-item {
    width: 60%;
    margin-left: calc(50% - 30%);
  } */

/* 选择公司 */

/* .el-select--medium {
    width: 100%;
  }

  .el-input--medium {
    width: 100%;
  } */
</style>
