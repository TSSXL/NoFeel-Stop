<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/BackParkList' }">停车场列表</el-breadcrumb-item>
      <el-breadcrumb-item>相机列表</el-breadcrumb-item>    
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true"  :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    
    <!--  -->
    <el-table :data="manageList" style="width: 100%" :border='true'>
      <el-table-column label="相机编号" prop="CameraSerialNO">
      </el-table-column>
      <el-table-column label="方向" prop="Type">
        <template slot-scope="scope">
          <span v-if="scope.row.Type===0">入口</span>
          <span v-else>出口</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
       layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
        <el-form-item label="编号" prop="cameraSerialNO">
          <el-input v-model="addForm.cameraSerialNO" auto-complete="off" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="方向（出入口）" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择方向">
            <el-option label="出口" value="1"></el-option>
            <el-option label="入口" value="0"></el-option>
          </el-select>
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
import md5 from "js-md5";

export default {
  data() {
    return {
      manageList: [], //管理员列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      // 搜索关键字
      filters: {
        keyword: ""
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        cameraSerialNO: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请输入方向",
            trigger: "change"
          }
        ]
      },
      //新增界面数据
      addForm: {
        cameraSerialNO: "",
        type: ""
      }
    };
  },
  methods: {
    /*
         1、获取管理员列表 渲染列表
         2、格式化时间
         3、格式化是否锁定
         4、分页
      */
    getInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("api/BackPark/GetCameraList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword,
            parkid: window.location.href.split("id=")[1]
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.manageList = response.data.Result.list;
              this.pageCount = response.data.Result.PageIndex;
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
            loading.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    CreateTime(row, time) {
      var date = row[time.property];
      return date.replace("T", " ").split(".")[0];
    },
    IsLock(row, lock) {
      var lock = row[lock.property];
      return lock ? "是" : "否";
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    handleAdd() {
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
            para.parkid = window.location.href.split("id=")[1];

            // 发保存请求
            this.$http
              .get("api/BackPark/AddCamera", {
                params: para
              })
              .then(
                function(response) {
                  this.addLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
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
      });
    },
    handleDelete(index, row) {
      var obj = Object.assign({}, row);
      console.log(obj);
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackPark/DelCamera", {
            params: {
              token: getCookie("token"),
              cameraid: obj.CameraID
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
    }
  },
  mounted() {
    this.getInfo();
    this.parkName = localStorage.getItem("parkName");
    this.Gateway = localStorage.getItem("Gateway");
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
</style>
