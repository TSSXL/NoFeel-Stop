<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>余额订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="订单号、手机号" prefix-icon="el-icon-search"></el-input>
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
        <!-- <el-form-item label="订单状态">
          <el-select v-model="filters.Type" placeholder="订单状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
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
      <!-- <el-table-column label="车牌号" prop="LicensePlate">
      </el-table-column>
      <el-table-column label="停车场名" prop="Name">
      </el-table-column> -->
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="创建时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="充值时间" prop="PayTime">
      </el-table-column>
      <!-- <el-table-column label="包月数" prop="NickName">
      </el-table-column> -->
      <el-table-column label="总费用" prop="TotalPrice" width="80">
      </el-table-column>
      <el-table-column label="优惠金额" prop="Cut" width="80">
      </el-table-column>
      <el-table-column label="支付费" prop="OnlinePrice" width="80">
      </el-table-column>
      <el-table-column label="支付方式" prop="PayType" :formatter="Status">
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
          name: "已入场",
          value: 0
        },
        {
          name: "已出场",
          value: 1
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
          "api/BackOrder/BackBalanceOrderList",
          qs.stringify({
            Token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
            // Status: this.filters.Type,
            StartTime: StTime,
            EndTime: EndTime
          })
        )
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.result;
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
    //关键字搜索
    getUsers() {
      this.pageIndex = 1;
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
        case 0:
          return (status = "支付宝");
          break;
        case 1:
          return (status = "微信");
          break;
        case 2:
          return (status = "银联");
          break;
        case 3:
          return (status = "股权积分");
          break;
        case 4:
          return (status = "一网通");
          break;
        case 5:
          return (status = "一网通");
          break;
        default:
          return (status = "未知支付方式");
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
