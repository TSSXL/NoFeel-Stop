<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>停车场列表</el-breadcrumb-item>
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
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">导入</el-button>
          <input id="file" type="file" @change="FileIn()" />
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="productList" style="width: 100%" :border='true'>
      <el-table-column label="停车场编号" prop="Number">
      </el-table-column>
      <el-table-column label="停车场名" prop="Name">
      </el-table-column>
      <el-table-column label="预约车位" prop="AppointmentCount" sortable>
      </el-table-column>
      <el-table-column label="剩余车位" prop="ResidualCount" sortable>
      </el-table-column>
      <el-table-column label="总车位" prop="TotalCount" sortable>
      </el-table-column>
      <el-table-column label="预约金额" prop="ReservationPrice" sortable>
      </el-table-column>
      <el-table-column label="是否推荐" prop="IsRecommend">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.IsRecommend" @change="handleRecommend(scope.$index, scope.row)">是/否</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="是否上线" prop="IsOnline">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.IsOnline" @change="handleOnline(scope.$index, scope.row)">是/否</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="优惠券" prop="Parking_Coupon">
        <template slot-scope="scope">
          <el-popover ref="popover4" placement="right" width="500" trigger="click">
            <el-table :data="gridData">
              <el-table-column width="200" property="c" label="日期"></el-table-column>
              <el-table-column width="100" property="a" label="名称"></el-table-column>
              <el-table-column width="100" property="b" label="优惠"></el-table-column>
              <el-table-column width="100" label="是否开放" prop="IsOpenCollection">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.IsOpenCollection" @change="handleOpen(scope.$index, scope.row)">是/否</el-checkbox>
                </template>
              </el-table-column>
              <!-- <el-table-column label="是否开放" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain icon="el-icon-question" @click="handleOpen(scope.$index, scope.row)">{{scope.row.a}}</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <span slot="reference" @click="detailClick(scope.row.ParkID)">{{ scope.row.Parking_Coupon>0?"查看优惠券":"无" }}</span>
          </el-popover>
          <!-- <span v-popover:popover4 @click="detailClick(scope.row.ParkID)">{{ scope.row.Parking_Coupon>0?"查看优惠券":"无" }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="接口类型" prop="InterfaceType">
        <template slot-scope="scope">
          <span v-if="scope.row.InterfaceType == 0">云行天下</span>
          <span v-else-if="scope.row.InterfaceType == 1">泊物云</span>
          <span v-else-if="scope.row.InterfaceType == 2">赛菲姆</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="地锁列表">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-tickets" @click="lockList(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-bottom:6px;" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="font-size: 16px;">
          <el-dropdown>
            <!-- <i class="el-icon-setting" style="color:#000;"></i> -->
            <el-button icon="el-icon-setting" size="mini">操作菜单</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" plain icon="el-icon-tickets" @click="lockList(scope.$index, scope.row)">查看地锁</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" plain icon="el-icon-tickets" @click="lockCamera(scope.$index, scope.row)">查看相机</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" style="margin-bottom:6px;" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </el-dropdown-item>
               <el-dropdown-item>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
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
import md5 from "js-md5";
import qs from "qs";
export default {
  data() {
    return {
      productList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      mainurl: "",
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: ""
      },
      // 优惠券数组
      gridData: [],
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        IsLock: false,
        Name: "",
        Role: "",
        RoleID: "",
        Password: ""
      },
      editFormRules: {
        Name: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        Name: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        IsLock: false,
        Name: "",
        RoleID: "",
        Password: ""
      }
    };
  },
  methods: {
    // 导入停车场
    FileIn() {
      const loadingDR = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var formdata = new FormData();
      formdata.append("file", $("#file")[0].files[0]); //获取文件法二
      this.$http
        .post(
          "api/BackPark/AddParkExcel",
          formdata
          // qs.stringify({
          //   params: formdata
          // })
          // ,
          // {
          //   headers: { "Content-Type": "application/octet-stream" }
          // } //添加请求头
        )
        .then(
          function(response) {
            loadingDR.close();
            var status = response.data.Status;
            if (status === 1) {
              this.getInfo();
              this.$message({
                showClose: true,
                type: "success",
                message: "导入成功"
              });
            } else if (status === -1) {
              this.$message({
                showClose: true,
                type: "warning",
                message: "请不要重复导入"
              });
            }
          }.bind(this)
        )
        // 请求error
        .catch(
          function(error) {
            loadingDR.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
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
        .get("api/BackPark/BackParkList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.productList = response.data.Result.list;
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
    // 点击查看优惠券
    detailClick(e) {
      console.log(e);
      this.$http
        .get("api/BackPark/CouponButton", {
          params: {
            token: getCookie("token"),
            ParkID: e
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.gridData = response.data.Result;
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
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    handleOpen(index, row) {
      var objID = Object.assign({}, row).ID;
      this.$http
        .get("api/BackPark/IsOpen", {
          params: {
            token: getCookie("token"),
            ID: objID
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
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
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    //
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    /*
                    1、添加编辑
                  */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      var urlId = obj.ParkID;
      localStorage.setItem("parkListInfo", JSON.stringify(obj));
      this.$router.push("/BackParkList/parkEdit/id=" + urlId);
    },
    handleDelete(index, row) {
      var obj = Object.assign({}, row);
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackPark/DelPark", {
            params: {
              Token: getCookie("token"),
              ParkID: obj.ParkID
            }
          })
          .then(
            function(response) {
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
    handleAdd() {
      this.$router.push("/BackParkList/parkAdd");
    },
    handleOnline(index, row) {
      var obj = Object.assign({}, row);
      this.$http
        .get("api/BackPark/ParkingOnline", {
          params: {
            Token: getCookie("token"),
            ParkID: obj.ParkID
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
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
    },
    handleRecommend(index, row) {
      var obj = Object.assign({}, row);
      this.$http
        .get("api/BackPark/IsRecommend", {
          params: {
            Token: getCookie("token"),
            ParkID: obj.ParkID
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
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
    },
    lockList(index, row) {
      // console.log(Object.assign({}, row));
      var obj = Object.assign({}, row);
      var urlId = obj.ParkID;
      localStorage.setItem("parkName", obj.Name);
      localStorage.setItem("Gateway", obj.Gateway);
      this.$router.push("/BackParkList/LockList/id=" + urlId);
    },
    lockCamera(index, row){
      var obj = Object.assign({}, row);
      var urlId = obj.ParkID;
      this.$router.push("/BackParkList/CameraList/id=" + urlId);
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

#file {
  position: absolute;
  right: 0;
  top: 0;
  width: 70px;
  height: 40px;
  opacity: 0;
}
</style>
