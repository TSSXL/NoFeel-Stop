<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>停车订单</el-breadcrumb-item>
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
        <el-form-item label="订单状态">
          <el-select v-model="filters.Type" placeholder="订单状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filters.payType" placeholder="支付方式">
            <el-option v-for="item in payList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>
          <!-- <a :href="orderTable"> -->
          <el-button type="primary" @click="outOrder()">导出订单</el-button>
          <!-- </a>               -->
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="订单号" prop="OrderNo">
      </el-table-column>
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
      <el-table-column label="总金额（元）" prop="TotalPrice" width="80">
      </el-table-column>
      <el-table-column label="停车费用（元）" prop="ParkPrice" width="80">
      </el-table-column>
      <el-table-column label="优惠金额（元）" prop="Cut" width="80">
      </el-table-column>
      <el-table-column label="预约转存费（元）" prop="DumpPrice" width="80">
      </el-table-column>
      <el-table-column label="在线支付费（元）" prop="OnlinePrice" width="80">
      </el-table-column>
      <el-table-column label="订单状态" prop="Status" :formatter="Status">
      </el-table-column>
      <el-table-column label="支付方式" prop="PayType" :formatter="PayType">
      </el-table-column>
      <el-table-column label="支付渠道" prop="ClientType" :formatter="ClientType">
      </el-table-column>
      <el-table-column label="异常反馈" prop="IsError">
        <template slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="click" :content="scope.row.ErrorMsg" v-if="scope.row.IsError">
            <el-button slot="reference" size="mini" type="danger">异常</el-button>
            <!-- <el-button slot="reference" size="mini" v-else>正常</el-button> -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" v-if="scope.row.Status == 0 ||scope.row.Status == 3" @click="handleLeave(scope.$index, scope.row)">手动离场</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="手动离场" :visible.sync="dialogVisible">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="离场金额" prop="leavePrice">
          <el-input v-model="form.leavePrice" style="width: 30%;"></el-input>
        </el-form-item>
        <el-form-item label="离场时间" prop="leaveTime">
          <el-date-picker v-model="form.leaveTime" type="datetime" placeholder="选择日期时间" @change="getTime" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBtn('form')">确 定</el-button>
      </span>
    </el-dialog>
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
    var leaveP = (rule, value, callback) => {
      if (!value) {
        if (value == "0") {
          callback();
        } else {
          callback(new Error("金额不能为空"));
        }
      } else {
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("不能小于0"));
          } else {
            callback();
          }
        }
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
      }, 100);
      0.11;
    };
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
        Type: -1,
        payType: -2
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
      ],
      payList: [
        {
          name: "全部",
          value: -2
        },
        {
          name: "其他",
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
          name: "月卡",
          value: 3
        },
        {
          name: "平台帐户",
          value: 4
        },
        {
          name: "一网通",
          value: 5
        }
      ],
      dialogVisible: false, // 手动离场弹框

      form: {
        id: "",
        leaveTime: "", // 离场时间
        leavePrice: 0 //离场金额
      },
      rules: {
        leaveTime: [
          {
            // 注释掉type和trigger，是为了解决格式化时间日期的时候出现的bug
            // type: "date",
            required: true,
            message: "请选择时间"
            // trigger: "change"
          }
        ],
        leavePrice: [
          {
            validator: leaveP
          }
        ]
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
        .post(
          "api/BackOrder/BackParkOrderList",
          qs.stringify({
            Token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
            Status: this.filters.Type,
            PayType: this.filters.payType,
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
              a.download = "停车订单导出表";
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
        EndTime: "",
        Type: -1,
        payType: -2
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
          return (status = "已入场");
          break;
        case 1:
          return (status = "已出场");
          break;
        case 3:
          return (status = "已支付待出场");
          break;
        default:
          return (status = "未知状态");
          break;
      }
    },
    PayType(row, type) {
      var type = row[type.property];
      switch (type) {
        case -1:
          return (type = "其它");
          break;
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
          return (type = "月卡");
          break;
        case 4:
          return (type = "平台帐户");
          break;
        case 5:
          return (type = "一网通");
          break;
        case 6:
          return (type = "现金");
          break;
        default:
          return (type = "未知状态");
          break;
      }
    },
    ClientType(row, type) {
      var type = row[type.property];
      switch (type) {
        case 0:
          return (type = "APP");
          break;
        case 1:
          return (type = "线下");
          break;
        default:
          return (type = "未知渠道");
          break;
      }
    },
    /*
              删除
            */

    handleDel(index, row) {
      var obj = Object.assign({}, row);
      //判断是否填写完整  --true
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.editLoading = true;
        // 请求
        this.$http
          .get("api/BackOrder/DelParkOrder", {
            params: {
              Token: getCookie("token"),
              ID: obj.ID
            }
          })
          .then(
            function(response) {
              this.editLoading = false;
              var status = response.data.Status;
              console.log(status);
              if (status == 1) {
                this.getInfo();
              } else if (status == 40001) {
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
      });
    },
    // 手动离场弹框
    handleLeave(index, row) {
      var obj = Object.assign({}, row);
      this.form.id = obj.ID;
      this.dialogVisible = true;
    },
    getTime(val) {
      console.log(val);
      this.form.leaveTime = val; //这个sTime是在data中声明的，也就是v-model绑定的值
    },
    // 确定按钮
    submitBtn(formName) {
      // this.dialogVisible = false
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认离场吗？", "提示", {}).then(() => {
            this.addLoading = true;
            var para = Object.assign({}, this.form);
            console.log(para.leaveTime);
            // 发保存请求
            this.$http
              .get("api/BackOrder/ManualDeparture", {
                params: {
                  id: para.id,
                  outTime: para.leaveTime,
                  price: para.leavePrice,
                  token: getCookie("token")
                }
              })
              .then(
                function(response) {
                  this.addLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["form"].resetFields();
                    this.dialogVisible = false;
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
              //请求error
              .catch(
                function(error) {
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
