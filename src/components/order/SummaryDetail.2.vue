<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Summary' }">财务汇总</el-breadcrumb-item>
      <el-breadcrumb-item>汇总详情</el-breadcrumb-item>
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
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="停车场" width="100">
        <template slot-scope="scope">
          <span>{{filters.ParkName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额（元）" prop="TotalPrice"  width="100">
      </el-table-column>
       <el-table-column label="收入类型" prop="Type" width="100">
      </el-table-column>
      <!-- <el-table-column label="列表" prop="List">
        <template slot-scope="scope">
        <el-table :data="scope.row.List" style="width: 100%" :border='true'>
        </el-table>
        </template>
      </el-table-column>     -->
      <!-- <el-table-column label="临时停车优惠（元）" prop="Price">
         <template slot-scope="scope">
           <span v-if="scope.row.Type == 1">{{scope1.row.CouponNumber}}</span>    
           {{scope.row.Type}}
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称" prop="CouponName">
      </el-table-column>
      <el-table-column label="优惠券号" prop="CouponNumber">
      </el-table-column> -->
      <el-table-column label="临时停车优惠（元）">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 1">{{scope1.row.List}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券名称">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 1">{{scope1.row.CouponName}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券号">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 1">{{scope1.row.CouponNumber}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="月卡续费优惠（元）">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 2">{{scope1.row.Price}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券名称">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 2">{{scope1.row.CouponName}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券号">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 2">{{scope1.row.CouponNumber}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="预约停车优惠（元）">
               <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 0">{{scope1.row.Price}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券名称">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 0">{{scope1.row.CouponName}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券号">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 0">{{scope1.row.CouponNumber}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="余额充值优惠（元）" >
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 3">{{scope1.row.Price}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券名称">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 3">{{scope1.row.CouponName}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券号">
              <template slot-scope="scope1">
                <span v-if="scope1.row.Type == 3">{{scope1.row.CouponNumber}}</span>    
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
      orderTable: "", //导出订单地址
      // 搜索关键字
      filters: {
        ParkName: "全平台",
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
        .get("api/BackFinance/CutDetail", {
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
              this.orderList = response.data.Result;
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
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
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
