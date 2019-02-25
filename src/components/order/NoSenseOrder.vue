<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>无感支付订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="订单号、车牌、停车场" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="出入时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="入场时间" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="出场时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="车牌号" prop="LicensePlate">
      </el-table-column>
      <el-table-column label="停车场名" prop="Name">
      </el-table-column>
      <el-table-column label="入场时间" prop="IntoTime">
      </el-table-column>
      <el-table-column label="出场时间" prop="OutTime">
      </el-table-column>
      <el-table-column label="用户名" prop="NickName">
      </el-table-column>
      <el-table-column label="支付金额（元）" prop="TotalPrice">
      </el-table-column>
      <el-table-column label="优惠金额（元）" prop="ParkPrice">
      </el-table-column>
      <el-table-column label="订单状态" prop="Status" :formatter="Status">
      </el-table-column>
      <el-table-column label="退款原因" prop="RefundReason">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" style="margin-bottom:6px;" plain icon="el-icon-tickets" @click="handleCheck(scope.$index, scope.row)">单笔对账</el-button>
          <el-button size="mini" v-if="scope.row.Status == 1" type="danger" @click="handleDel(scope.$index, scope.row)">退款</el-button>
          <!-- <el-button size="mini" v-else-if="scope.row.Status == 8" type="danger">退款失败</el-button>
          <el-button size="mini" v-else="scope.row.Status == 9" type="danger">退款成功</el-button>  -->
          <el-button size="mini" v-else type="danger" @click="lookMsg(scope.$index, scope.row)">查看报文</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <!--单笔对账-->
    <el-dialog title="单笔对账详情" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="150px" ref="editForm">
        <!-- <el-form-item label="处理结果返回码" prop="rspCode">
          <el-input v-model="editForm.rspCode" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="处理结果描述" prop="rspMsg">
          <el-input v-model="editForm.rspMsg" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="响应时间" prop="dateTime">
          <el-input v-model="editForm.dateTime" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="协议号" prop="agrNo">
          <el-input v-model="editForm.agrNo" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="交易金额" prop="amount">
          <el-input v-model="editForm.amount" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="银行账户日期" prop="settleDate">
          <el-input v-model="editForm.settleDate" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="原交易银行流水号" prop="origBankSerialNo">
          <el-input v-model="editForm.origBankSerialNo" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="原交易结果" prop="Name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="原交易处理结果描述" prop="origRspMsg">
          <el-input v-model="editForm.origRspMsg" auto-complete="off" readonly="true"></el-input>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div> -->
    </el-dialog>
    <!-- 退款 -->
    <el-dialog title="退款" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="退款理由" prop="reason">
          <el-input type="textarea" v-model="addForm.reason" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
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
          EndTime: "",
          Type: -1
        },
        //单笔对账是否显示
        editFormVisible: false,
        editLoading: false,

        //退款是否显示
        addFormVisible: false,
        addLoading: false,
        // 单笔对账
        editForm: {},
        // 退款
        addFormRules: {
          reason: [{
            required: true,
            message: "请输入退款理由",
            trigger: "blur"
          }]
        },
        //退款
        addForm: {
          reason: ""
        },

        // 银行报文
        bankText: "",
        // 退款id
        tuiID: ""
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
            "api/BackOrder/NoSenseOrder",
            qs.stringify({
              Token: getCookie("token"),
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
              Status: this.filters.Type,
              StartTime: StTime,
              EndTime: EndTime
            })
          )
          .then(
            function (response) {
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
            function (error) {
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
          case 1:
            return (status = "未退款");
            break;
          case 8:
            return (status = "退款失败");
            break;
          case 9:
            return (status = "退款成功");
            break;
          default:
            return (status = "订单异常");
            break;
        }
      },
      /*
            单笔对账和退款
          */
      handleCheck(index, row) {
        var obj = Object.assign({}, row);
        var urlId = obj.ID;
        const loading1 = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取详情
        this.$http
          .get("api/BackOrder/CheckTheBill", {
            params: {
              token: getCookie("token"),
              orderid: urlId
            }
          })
          .then(
            function (response) {
              loading1.close();
              this.editFormVisible = true;

              var status = response.data.Status;
              if (status === 1) {
                this.editForm = response.data.Result;
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
            function (error) {
              loading1.close();

              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      handleDel(index, row) {
        console.log(Object.assign({}, row));
        var obj = Object.assign({}, row);
        this.tuiID = obj.ID;
        this.addFormVisible = true;
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              var para = Object.assign({}, this.addForm);
              // 将token传入参数中
              para.token = getCookie("token");
              para.orderid = this.tuiID;
              console.log(para)
              // 发保存请求
              this.$http
                .get("api/BackOrder/Refund", {
                  params: para
                })
                .then(
                  function (response) {
                    this.addLoading = false;
                    var status = response.data.Status;
                    if (status === 1) {
                      // 表单重置
                      this.$refs["addForm"].resetFields();
                      this.addFormVisible = false;
                      this.getInfo();
                      this.$alert(response.data.Result, '银行报文');
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
                  function (error) {
                    this.$notify.error({
                      title: "错误",
                      message: "错误：请检查网络"
                    });
                  }.bind(this)
                );
            });
          }
        });
      },
      // 银行报文
      lookMsg(index, row) {
        var obj = Object.assign({}, row);
        // this.bankText = obj.Car;
        this.$http
          .get("api/BackOrder/GetRspMsg", {
            params: {
              orderid: obj.ID
            }
          })
          .then(
            function (response) {
              var status = response.data.Status;
              if (status === 1) {
                this.$alert(response.data.Result, '银行报文');
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
            function (error) {
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
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

  /* 选择公司 */

  .el-select--medium {
    width: 100%;
  }

  .el-input--medium {
    width: 100%;
  }

</style>
