<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务汇总</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="停车场">
          <el-input v-model="filters.ParkName" placeholder="停车场" prefix-icon="el-icon-search"></el-input>
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
    <el-table :data="orderList" style="width: 100%" :border='true' :span-method="arraySpanMethod">
      <el-table-column label="收入时间" prop="Time" width="200">
      </el-table-column>
      <!-- <el-table-column label="停车场" prop="ParkName">
      </el-table-column> -->
      <el-table-column label="停车场">
        <template slot-scope="scope">
              <span>{{tableParkName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收总金额（元）" prop="TotalPrice" width="70">
      </el-table-column>
      <el-table-column label="停车场总金额（元）" prop="OnlinePrice" width="70">
      </el-table-column>
      <!-- <el-table-column label="实收金额（元）" prop="OnlinePrice" width="70">
      </el-table-column> -->
      <el-table-column label="支付宝金额（元）" prop="AlPayPrice" width="70">
      </el-table-column>
      <el-table-column label="微信金额（元）" prop="WxPayPrice">
      </el-table-column>
      <el-table-column label="招行一网通金额（元）" prop="ZhPayPrice">
      </el-table-column>
      <el-table-column label="优惠金额（元）">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor: pointer;" @click="clickDetail(scope.$index, scope.row)">{{scope.row.CutPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额支付（元）" prop="BaPayPrice">
      </el-table-column>
      <el-table-column label="临时停车（元）" prop="LtParkPrice">
      </el-table-column>
      <el-table-column label="月卡续租（元）" prop="CardPrice">
      </el-table-column>
      <el-table-column label="预约停车（元）" prop="YyParkPrice">
      </el-table-column>
      <el-table-column label="余额充值" prop="BalanceRechargePrice" >
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div> -->
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
        ParkName: "全平台",
        StTime: "2018-01-01",
        EndTime: ""
      },
      tableParkName:""
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
        .get("api/BackFinance/Summary", {
          params: {
            token: getCookie("token"),
            parkname:
              this.filters.ParkName == "" ? "-1" : this.filters.ParkName,
            sttime: StTime,
            endtime: EndTime
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.List;
              this.tableParkName = this.filters.ParkName
              // this.pageCount = response.data.Result.Page;
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
        ParkName: "全平台",
        StTime: "2018-01-01",
        EndTime: ""
      };
      this.tableParkName = "全平台"
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    // 合并列
    /**
     * row：行
     * column：列
     * rowIndex：行号
     * columnIndex：列号
     * */

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (rowIndex % this.orderList.length === 0) {
          return {
            rowspan: this.orderList.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 查看汇总详情
    clickDetail(index, row) {
      var obj = Object.assign({}, row);
      var summary = {
        parkName: this.filters.parkName,
        Time: obj.Time
      };
      localStorage.setItem("sumInfo", JSON.stringify(summary));
      setTimeout(() => {
        window.location.href="#/SummaryDetail"
      }, 0);
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
