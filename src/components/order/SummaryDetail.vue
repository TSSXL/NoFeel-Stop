<template>
  <div class="sunDetail">
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Summary' }">财务汇总</el-breadcrumb-item>
      <el-breadcrumb-item>汇总详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
    </el-col>
    <!-- table 内容 -->
    <table id="aaa">
    <thead>
      <tr>
      <th class="el-table_1_column_1 is-leaf">停车场</th>
      <th class="el-table_1_column_2 is-leaf">收入时间</th>
      <th class="el-table_1_column_3 is-leaf">预约停车优惠（元）</th>
      <th class="el-table_1_column_4 is-leaf">优惠券名称</th>
      <th class="el-table_1_column_5 is-leaf">优惠券号码</th>
      <th class="el-table_1_column_6 is-leaf">临时停车优惠（元）</th>
      <th class="el-table_1_column_7 is-leaf">优惠券名称</th>
      <th class="el-table_1_column_8 is-leaf">优惠券号码</th>
      <th class="el-table_1_column_9 is-leaf">月卡续费优惠（元）</th>
      <th class="el-table_1_column_10 is-leaf">优惠券名称</th>
      <th class="el-table_1_column_11 is-leaf">优惠券号码</th>
      <th class="el-table_1_column_12 is-leaf">余额充值优惠（元）</th>
      <th class="el-table_1_column_13 is-leaf">优惠券名称</th>
      <th class="el-table_1_column_14 is-leaf">优惠券号码</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
    <tr>
      <td>总计</td>
      <td>--</td>
      <td>{{num0}}</td>
      <td>--</td>
      <td>--</td>
      <td>{{num1}}</td>
      <td>--</td>
      <td>--</td>
      <td>{{num2}}</td>
      <td>--</td>
      <td>--</td>
      <td>{{num3}}</td>
      <td>--</td>
      <td>--</td>
    </tr>
  </table>
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
      // 合计
      num0: '--',
      num1: '--',
      num2: '--',
      num3: '--'
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
            console.log(response  )
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result;
              // this.pageCount = response.data.Result.Page;
              var li = "";
              var lia0 = "";
              var lia1 = "";
              var lia2 = "";
              var lia3 = "";

              for (let i = 0; i < response.data.Result.length; i++) {
                const element = response.data.Result[i];
                if (element.Type == 0) {
                  this.num0 = element.TotalPrice;
                } else if (element.Type == 1) {
                  this.num1 = element.TotalPrice;
                } else if (element.Type == 2) {
                  this.num2 = element.TotalPrice;
                } else if (element.Type == 3) {
                  this.num3 = element.TotalPrice;
                }
                for (let index = 0; index < element.List.length; index++) {
                  const liArr = element.List[index];
                  if (element.Type == 0) {
                    lia0 = `
                     <td>${liArr.Price}</td>
                     <td>${liArr.CouponName}</td>
                     <td>${liArr.CouponNumber}</td>
                     `;
                    lia1 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia2 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia3 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                  } else if (element.Type == 1) {
                    lia1 = `
                     <td>${liArr.Price}</td>
                     <td>${liArr.CouponName}</td>
                     <td>${liArr.CouponNumber}</td>
                     `;
                    lia0 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia2 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia3 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                  } else if (element.Type == 2) {
                    lia2 = `
                     <td>${liArr.Price}</td>
                     <td>${liArr.CouponName}</td>
                     <td>${liArr.CouponNumber}</td>
                     `;
                    lia0 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia1 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia3 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                  } else {
                    lia3 = `
                     <td>${liArr.Price}</td>
                     <td>${liArr.CouponName}</td>
                     <td>${liArr.CouponNumber}</td>
                     `;
                    lia0 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia2 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                    lia1 = `
                     <td>--</td>
                     <td>--</td>
                     <td>--</td>
                     `;
                  }

                  li += `
                   <tr>
                     <td>${this.filters.ParkName}</td>
                     <td>${this.filters.StTime}~${this.filters.EndTime}</td>
                     ${lia0}
                     ${lia1}
                     ${lia2}
                     ${lia3}
                   </tr>
                   `;
                  $("tbody").html(li);
                  this.table_rowspan("#aaa", 1);
                  this.table_rowspan("#aaa", 2);
                }
              }
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

    table_rowspan(table_id, table_colnum) {
      if (table_colnum == "even") {
        table_colnum = "2n";
      } else if (table_colnum == "odd") {
        table_colnum = "2n+1";
      } else {
        table_colnum = "" + table_colnum;
      }
      var cols = [];
      var all_row_num = $(table_id + " tr td:nth-child(1)").length;
      var all_col_num = $(table_id + " tr:nth-child(1)").children().length;
      if (table_colnum.indexOf("n") == -1) {
        cols[0] = table_colnum;
      } else {
        var n = 0;
        var a = table_colnum.substring(0, table_colnum.indexOf("n"));
        var b = table_colnum.substring(table_colnum.indexOf("n") + 1);
        a = a ? parseInt(a) : 1;
        b = b ? parseInt(b) : 0;
        while (a * n + b <= all_col_num) {
          cols[n] = a * n + b;
          n++;
        }
      }
      var table_minrow = arguments[2] ? arguments[2] : 0;
      var table_maxrow = arguments[3] ? arguments[3] : all_row_num + 1;
      var table_firsttd = "";
      var table_currenttd = "";
      var table_SpanNum = 0;
      for (var j = 0; j < cols.length; j++) {
        $(table_id + " tr td:nth-child(" + cols[j] + ")")
          .slice(table_minrow, table_maxrow)
          .each(function(i) {
            var table_col_obj = $(this);
            if (table_col_obj.html() != " ") {
              if (i == 0) {
                table_firsttd = $(this);
                table_SpanNum = 1;
              } else {
                table_currenttd = $(this);
                if (table_firsttd.text() == table_currenttd.text()) {
                  table_SpanNum++;
                  table_currenttd.hide(); //remove();
                  table_firsttd.attr("rowSpan", table_SpanNum);
                } else {
                  table_firsttd = $(this);
                  table_SpanNum = 1;
                }
              }
            }
          });
      }
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

table {
  border-collapse: collapse;
  border: 1px solid #ebeef5;
  color: #909399;
  max-height: 300px;
}
th {
  padding: 12px;
  border: 1px solid #ebeef5 !important;
  font-size: 15px;
}
td {
  border: 1px solid #ebeef5 !important;
}
</style>
