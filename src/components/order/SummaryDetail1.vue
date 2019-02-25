<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Summary' }">财务汇总</el-breadcrumb-item>
      <el-breadcrumb-item>汇总详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true' :span-method="arraySpanMethod"  max-height="650">
      <el-table-column label="停车场" width="100">
        <template slot-scope="scope">
          <span>{{filters.ParkName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入时间" width="200">
        <template slot-scope="scope">
          <span>{{filters.StTime}}~{{filters.EndTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠类型" width="100"  prop="Type"  :formatter="Status">
      </el-table-column>
      <el-table-column label="列表" prop="List">
        <template slot-scope="scope">
        <el-table :data="scope.row.List" style="width: 100%" :border='true' show-summary>
            <el-table-column label="#序号#" type="index" width="150">
            </el-table-column>
            <el-table-column label="优惠金额（元）" prop="Price" sortable>
              <!-- <template slot-scope="scope1">
                <span>{{scope1.row.Price}}</span>    
              </template> -->
            </el-table-column>
            <el-table-column label="优惠券名称">
              <template slot-scope="scope1">
                <span>{{scope1.row.CouponName}}</span>    
              </template>
            </el-table-column>
            <el-table-column label="优惠券号">
              <template slot-scope="scope1">
                <span>{{scope1.row.CouponNumber}}</span>    
              </template>
            </el-table-column>
        </el-table>
        </template>
      </el-table-column>    
    </el-table>
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
    },
    Status(row, status) {
      var status = row[status.property];
      switch (status) {
        case -1:
          return (status = "预约停车优惠");
          break;
        case 1:
          return (status = "临时停车优惠");
          break;
        case 2:
          return (status = "月卡续费优惠");
          break;
        case 3:
          return (status = "余额充值优惠");
          break;
        default:
          return (status = "未知方式优惠");
          break;
      }
    },
    // 合并列
    /**
     * row：行
     * column：列
     * rowIndex：行号
     * columnIndex：列号
     * */

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
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
      } else if (columnIndex === 1) {
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
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      console.log(param);
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] += " 元";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    }
  },
  mounted() {
    this.filters.parkname = JSON.parse(
      localStorage.getItem("sumInfo")
    ).parkName;
    this.filters.StTime = JSON.parse(
      localStorage.getItem("sumInfo")
    ).Time.split("-")[0];
    this.filters.EndTime = JSON.parse(
      localStorage.getItem("sumInfo")
    ).Time.split("-")[1];
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
