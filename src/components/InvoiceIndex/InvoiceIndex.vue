<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>发票申请列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border="true">
      <!-- <el-table-column label="开票编号" prop="InvoiceNo"></el-table-column> -->
      <el-table-column label="发票类型" prop="InvoiceType">
        <template slot-scope="scope">
          <span v-if="scope.row.InvoiceType  === 0">纸质</span>
          <span v-else>电子</span>
        </template>
      </el-table-column>
      <el-table-column label="抬头类型" prop="HeaderType">
        <template slot-scope="scope">
          <span v-if="scope.row.HeaderType  === 0">个人</span>
          <span v-else>企业</span>
        </template>
      </el-table-column>
      <el-table-column label="抬头名称" prop="Header"></el-table-column>
      <el-table-column label="开票金额" prop="Price"></el-table-column>
      <el-table-column label="订单详情" prop="OrderList">
        <template slot-scope="scope">
          <el-popover ref="popover1" placement="right" width="700" trigger="click">
            <el-table :data="carList">
              <el-table-column width="200" property="OrderID" label="订单号"></el-table-column>
              <el-table-column width="100" property="ParkingName" label="停车场"></el-table-column>
              <el-table-column width="200" property="Time" label="停放时间"></el-table-column>
              <el-table-column width="100" property="LicensePlate" label="车牌号"></el-table-column>
              <el-table-column width="100" property="Price" label="金额"></el-table-column>
            </el-table>
            <span slot="reference" @click="carClick(scope.$index, scope.row)">点击查看</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="开票详情" prop>
        <template slot-scope="scope">
          <el-popover ref="popover2" placement="right" width="600" trigger="click">
            <el-table :data="cardList">
              <el-table-column width="100" property="HeaderType" label="抬头类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.HeaderType  === 0">个人</span>
                  <span v-else>企业</span>
                </template>
              </el-table-column>
              <el-table-column width="200" property="Header" label="抬头名称"></el-table-column>
              <el-table-column width="200" property="TaxNumber" label="纳税人识别号"></el-table-column>
              <el-table-column width="50" property="Type" label="发票内容">
                <template slot-scope="scope">
                  <span v-if="scope.row.Type  === 0">停车</span>
                  <span v-else>月卡</span>
                </template>
              </el-table-column>
              <el-table-column width="50" property="Price" label="开票金额"></el-table-column>
            </el-table>
            <span slot="reference" @click="cardClick(scope.$index, scope.row)">点击查看</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="收件人信息" prop>
        <template slot-scope="scope">
          <el-popover ref="popover3" placement="right" width="750" trigger="click">
            <el-table :data="CouponList">
              <el-table-column width="100" property="UserName" label="联系人"></el-table-column>
              <el-table-column width="150" property="UserPhone" label="电话"></el-table-column>
              <el-table-column width="250" property="Email" label="电子邮箱"></el-table-column>
              <el-table-column width="250" property="Address" label="详细地址"></el-table-column>
            </el-table>
            <span slot="reference" @click="couponClick(scope.$index, scope.row)">点击查看</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="Status">
        <template slot-scope="scope">
          <span v-if="scope.row.Status  === 0">提交中</span>
          <span v-else-if="scope.row.Status  === 1">成功</span>
          <span v-else-if="scope.row.Status  === 9">拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.Status === 0"
            size="mini"
            type="primary"
            plain
            icon="el-icon-success"
            @click="handleAgree(scope.$index, scope.row)"
          >通过</el-button>
          <el-button v-if="scope.row.Status === 0"
            size="mini"
            type="danger"
            plain
            icon="el-icon-warning"
            @click="handlerefuse(scope.$index, scope.row)"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dataObj.InvoiceType === 0?'纸质发票处理确认':'电子发票处理确认'" :visible.sync="dialogVisible" width="30%">
      <div style="width: 100%;">
        <div v-if="dataObj.InvoiceType === 0">
          <el-form
            :model="companyForm"
            label-width="80px"
            :rules="companyFormRules"
            ref="companyForm"
          >
            <el-form-item label="快递公司" prop="company">
              <el-input v-model="companyForm.company" :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="快递单号" prop="exNumber">
              <el-input v-model="companyForm.exNumber" :clearable="true"></el-input>
            </el-form-item>
          </el-form>
          <div class="footer_btn" style="text-align:right">
            <el-button size="mini" plain @click="dialogVisible = false">取消</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              :loading="loadingBtn"
              @click.native="AgreeBtn(0, dataObj)"
            >通过</el-button>
          </div>
        </div>
        <div v-else-if="dataObj.InvoiceType === 1">
          <!-- <p ref="tipText" style="text-align:center;margin-bottom:30px">确认处理吗？</p> -->
          <div class="footer_btn" style="text-align:right">
            <el-button size="mini" plain @click="dialogVisible = false">取消</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              :loading="loadingBtn"
              @click="AgreeBtn(1, dataObj)"
            >通过</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next,jumper"
        :page-count="pageCount"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      mainurl: "",
      // 搜索关键字
      filters: {
        keyword: ""
      },
      dialogVisible: false,
      loadingBtn: false,
      // popup数据数组
      carList: [],
      cardList: [],
      CouponList: [],
      dataObj: {},
      companyForm: {
        company: "",
        exNumber: ""
      },
      companyFormRules: {
        company: [
          { required: true, message: "请输入快递公司", trigger: "blur" }
        ],
        exNumber: [
          { required: true, message: "请输入快递单号", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    carClick(index, row) {
      var obj = Object.assign({}, row);
      this.carList = obj.OrderList;
    },
    cardClick(index, row) {
      var obj = Object.assign({}, row);
      this.cardList = [obj];
    },
    couponClick(index, row) {
      var obj = Object.assign({}, row);
      this.CouponList = [obj];
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
        .get("api/BackInvoice/Index", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    // 拒绝按钮
    handlerefuse(index, row) {
      this.$confirm("确认拒绝该申请吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackInvoice/CheckInvoiceFor", {
            params: {
              invoiceID: row.InvoiceID,
              status: 9,
              token: getCookie("token"),
              company: -1,
              exNumber: -1
            }
          })
          .then(
            function(response) {
              this.editLoading = false;
              var status = response.data.Status;
              if (status === 1) {
                this.getInfo();
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
      });
    },
    // 同意弹框
    handleAgree(index, row) {
      this.dialogVisible = true;
      this.dataObj = Object.assign({}, row);
      //  this.$refs["companyForm"].resetFields();
    },
    // 弹框内部确认按钮
    AgreeBtn(num, obj) {
      if (num === 0) {
        this.$refs.companyForm.validate(valid => {
          if (valid) {
            this.loadingBtn = true;
            this.$http
              .get("api/BackInvoice/CheckInvoiceFor", {
                params: {
                  invoiceID: obj.InvoiceID,
                  status: 1,
                  token: getCookie("token"),
                  company: this.companyForm.company,
                  exNumber: this.companyForm.exNumber
                }
              })
              .then(
                function(response) {
                  this.loadingBtn = false;
                  this.dialogVisible = false;
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
                  this.loadingBtn = false;
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$http
          .get("api/BackInvoice/CheckInvoiceFor", {
            params: {
              invoiceID: obj.InvoiceID,
              status: 1,
              token: getCookie("token"),
              company: -1,
              exNumber: -1
            }
          })
          .then(
            function(response) {
              this.loadingBtn = false;
              this.dialogVisible = false;
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

/* 弹出框 */

.el-dialog__body .el-form-item {
  width: 60%;
  margin-left: calc(50% - 30%);
}

#file {
  position: absolute;
  right: 0;
  top: 0;
  width: 70px;
  height: 40px;
  opacity: 0;
}
</style>
