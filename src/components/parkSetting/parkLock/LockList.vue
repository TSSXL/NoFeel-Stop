<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/BackParkList' }">停车场列表</el-breadcrumb-item>
      <el-breadcrumb-item>地锁列表</el-breadcrumb-item>    
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true">
        <el-form-item :label="parkName+'网关'">
          <el-input v-model="Gateway" placeholder="停车场网关" :disabled="isDisabled" style="width:500px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit(isDisabled)">{{isDisabled?"修改":"保存"}}</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    
    <!--  -->
    <el-table :data="manageList" style="width: 100%" :border='true'>
      <el-table-column label="地锁编号" prop="LockNo">
      </el-table-column>
      <el-table-column label="使用车辆" prop="LicensePlate">
      </el-table-column>
      <el-table-column label="是否被使用" prop="IsUse">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.IsUse" @change="handleRecommend(scope.$index, scope.row)" disabled>是/否</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="地锁编号" prop="LockNo">
          <el-input v-model="editForm.LockNo" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="地锁编号" prop="LockNo">
          <el-input v-model="addForm.LockNo" auto-complete="off"></el-input>
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
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        LockNo: "",
        ID: ""
      },
      editFormRules: {
        LockNo: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur"
          }
        ]
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        LockNo: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        LockNo: ""
      },
      // 停车场名称
      parkName: "",
      Gateway: "", // 网关
      // 是否禁止修改
      isDisabled: true
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
        .get("api/BackPark/ParkLock", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            ParkID: window.location.href.split("id=")[1]
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
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      this.editFormVisible = true;
      this.editForm = obj;
    },
    handleAdd() {
      this.addFormVisible = true;
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            // 发保存请求
            this.$http
              .get("api/BackPark/Edit", {
                params: para
              })
              .then(
                function(response) {
                  this.editLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
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
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            var para = Object.assign({}, this.addForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            para.ParkID = window.location.href.split("id=")[1];

            // 发保存请求
            this.$http
              .get("api/BackPark/AddParkLock", {
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
          .get("api/BackPark/DelLock", {
            params: {
              Token: getCookie("token"),
              ID: obj.ID
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
    // 修改网关开关
    edit(e) {
      // this.isDisabled = !this.isDisabled;
      // 是否禁用
      if (e) {
        // 是禁用，为true，点击为修改为false，
        this.isDisabled = false;
      } else {
        // 此时不是禁用，为false，点击为保存修改网关，
        if (this.Gateway) {
          // 发保存请求
          this.$http
            .get("api/BackPark/UpdateGateway", {
              params: {
                parkid: window.location.href.split("id=")[1],
                gateway: this.Gateway,
                token: getCookie("token")
              }
            })
            .then(
              function(response) {
                var status = response.data.Status;
                this.isDisabled = true;
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
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "请输入网关"
          });
        }
      }
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
