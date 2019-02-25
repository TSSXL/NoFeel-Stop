<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
        <!-- <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">导入</el-button>
          <input id="file" type="file" @change="FileIn()"/>
        </el-form-item>-->
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">导出用户表</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border="true">
      <el-table-column label="手机号" prop="Phone"></el-table-column>
      <el-table-column label="头像" prop="Image">
        <template slot-scope="scope">
          <img :src="scope.row.Image" width="60">
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
          <!-- 点击查看会员折扣方式 -->
          <!-- <el-popover ref="popover5" placement="right" width="400" trigger="click">
            <el-table :data="carList">
              <el-table-column width="200" property="Phone" label="折扣"></el-table-column>
              <el-table-column width="200" property="Sex" label="减免"></el-table-column>
            </el-table>
          </el-popover>
          <img v-if="scope.row.IsVip" src="../../../static/images/vip.png"  v-popover:popover5 @click="vipClick(scope.$index, scope.row)"/>-->
          <img v-if="scope.row.IsVip" src="../../../static/images/vip.png">
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="Sex" :formatter="Sex"></el-table-column>
      <el-table-column label="生日" prop="Birthday"></el-table-column>
      <el-table-column label="微信" prop="WxOpenID">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.WxOpenID" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="QQ" prop="QQOpenID">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.QQOpenID" disabled></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="积分" prop="Integration"></el-table-column>
      <el-table-column label="余额" prop="Balance"></el-table-column>
      <el-table-column label="我的车辆" prop="Car">
        <template slot-scope="scope">
          <el-popover ref="popover1" placement="right" width="400" trigger="click">
            <el-table :data="carList">
              <el-table-column width="200" property="LicensePlate" label="车牌"></el-table-column>
              <el-table-column width="200" property="IsAutomaticPayment" label="是否无感"></el-table-column>
            </el-table>
            <span
              slot="reference"
              @click="carClick(scope.$index, scope.row)"
            >{{ scope.row.Car.length>0?"点击查看":"无" }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="我的月卡" prop="Card">
        <template slot-scope="scope">
          <el-popover ref="popover2" placement="right" width="400" trigger="click">
            <el-table :data="cardList">
              <el-table-column width="200" property="CardName" label="月卡名"></el-table-column>
              <el-table-column width="200" property="data" label="有效期"></el-table-column>
            </el-table>
          </el-popover>
          <span
            slot="reference"
            @click="cardClick(scope.$index, scope.row)"
          >{{ scope.row.Card.length>0?"点击查看":"无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="我的优惠券" prop="Coupon">
        <template slot-scope="scope">
          <el-popover ref="popover3" placement="right" width="600" trigger="click">
            <el-table :data="CouponList">
              <el-table-column width="100" property="Coupon" label="券名"></el-table-column>
              <el-table-column width="150" property="full" label="满多少减多少"></el-table-column>
              <el-table-column width="250" property="data" label="有效期"></el-table-column>
              <el-table-column width="100" property="data" label="查看">
                <template slot-scope="scope">
                  <span @click="GetCouponDetail(scope.$index, scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
            <span
              slot="reference"
              @click="couponClick(scope.$index, scope.row)"
            >{{ scope.row.Coupon.length>0?"点击查看":"无" }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="我的行驶证" prop="Car">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-tickets"
            @click="lookDrive(scope.$index, scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.IsLock"
            type="primary"
            plain
            icon="el-icon-success"
            @click="handleEdit(scope.$index, scope.row)"
          >解除锁定</el-button>
          <el-button
            size="mini"
            v-else
            type="danger"
            plain
            icon="el-icon-warning"
            @click="handleEdit(scope.$index, scope.row)"
          >点击锁定</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="行驶证照片" :visible.sync="dialogVisible" width="30%">
      <div style="width: 100%;">
        <img style="width: 100%;" v-if="DrivingFaceImage != ''" :src="DrivingFaceImage" alt="行驶证反面">
        <span v-else>暂无行驶证正面图</span>
      </div>
      <div style="width: 100%;">
        <img style="width: 100%;" v-if="DrivingBackImage != ''" :src="DrivingBackImage" alt="行驶证反面">
        <span v-else>暂无行驶证反面图</span>
      </div>
    </el-dialog>
    <el-dialog title="优惠券信息" :visible.sync="dialogVisible1" width="35%">
      <div style="width: 100%;">
        <el-table :data="CouponListInfo">
          <el-table-column width="200" property="CreateTime" label="领取时间"></el-table-column>
          <el-table-column width="200" property="UseTime" label="使用时间">
            <template slot-scope="scope">
              <span>{{scope.row.UseTime?scope.row.UseTime:"暂未使用"}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" property="RelationOrderNo" label="关联订单号">
            <template slot-scope="scope">
              <span>{{scope.row.RelationOrderNo?scope.row.RelationOrderNo:"暂未使用"}}</span>
            </template>
          </el-table-column>
        </el-table>
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
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: ""
      },
      dialogVisible: false,
      dialogVisible1: false,
      DrivingBackImage: "",
      DrivingFaceImage: "",
      // 状态数组
      typeList: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "待发货",
          value: 1
        },
        {
          name: "待收货",
          value: 2
        }
      ],
      // 我的车辆数组
      carList: [],
      cardList: [],
      CouponList: [],
      CouponListInfo: []
    };
  },
  methods: {
    // 查看行驶证
    lookDrive(index, row) {
      this.dialogVisible = true;
      var obj = Object.assign({}, row);
      this.DrivingBackImage = obj.DrivingBackImage;
      this.DrivingFaceImage = obj.DrivingFaceImage;
    },
    carClick(index, row) {
      var obj = Object.assign({}, row);
      // obj.Car.forEach(element => {
      //   element.IsAutomaticPayment = element.IsAutomaticPayment ? "是" : "否";
      // });
      this.carList = obj.Car;
    },
    cardClick(index, row) {
      var obj = Object.assign({}, row);
      this.cardList = obj.Card;
      console.log(obj);
    },
    GetCouponDetail(index, row) {
      var obj = Object.assign({}, row);
      this.$http
        .get("api/BackUser/GetCouponDetail", {
          params: {
            couponid: obj.CouponID
          }
        })
        .then(
          function(response) {
            this.dialogVisible1 = true;
            var status = response.data.Status;
            if (status === 1) {
              this.CouponListInfo = [response.data.Result];
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
            loading.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    couponClick(index, row) {
      var obj = Object.assign({}, row);
      this.CouponList = obj.Coupon;
    },
    Sex(row, status) {
      var sex = row[status.property];
      switch (sex) {
        case 0:
          return (sex = "男");
          break;
        default:
          return (sex = "女");
          break;
      }
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
        .get("api/BackUser/BackUserList", {
          params: {
            Token: getCookie("token"),
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
              this.orderList = response.data.Result.list;
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    handleEdit(index, row) {
      //
      if (row.IsLock) {
        this.$confirm("确认解除锁定吗？", "提示", {}).then(() => {
          this.$http
            .get("api/BackUser/Islock", {
              params: {
                token: getCookie("token"),
                id: row.ID
              }
            })
            .then(
              function(response) {
                this.editLoading = false;
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
        });
      } else {
        this.$confirm("确认锁定该用户吗？", "提示", {}).then(() => {
          this.$http
            .get("api/BackUser/Islock", {
              params: {
                token: getCookie("token"),
                id: row.ID
              }
            })
            .then(
              function(response) {
                this.editLoading = false;
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
        });
      }
    },

    handleAdd() {
      this.$http
        .get("api/BackUser/UserExport")
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              console.log(response.data.Result);
              var a = document.createElement("a");
              a.href = mainurl + response.data.Result;
              a.download = "用户导出表";
              a.click();
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
