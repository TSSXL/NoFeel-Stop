<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>车主认证列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.type" placeholder="状态">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="orderList" style="width: 100%" :border="true">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="车牌号:">
              <span>{{props.row.LicensePlate}}</span>
            </el-form-item>
            <el-form-item label="车辆识别号:">
              <span>{{props.row.RecognitionNumber}}</span>
            </el-form-item>
            <el-form-item label="发动机型号:">
              <span>{{props.row.EngineNumber}}</span>
            </el-form-item>
            <el-form-item label="品牌型号:">
              <span>{{props.row.BrandModel}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="展示图" prop="Logo">
        <template slot-scope="scope">
          <img v-if="scope.row.Url" :src="mainurl+scope.row.Url" style="width:100%;cursor:pointer" alt="展示图"  @click="handleLook(scope.row.Url)">
        </template>
      </el-table-column>
      <el-table-column label="车主姓名" prop="OwnerName"></el-table-column>
      <el-table-column label="手机号" prop="Phone"></el-table-column>
      <!-- <el-table-column label="车牌号" prop="LicensePlate"></el-table-column>
      <el-table-column label="车辆识别号" prop="RecognitionNumber"></el-table-column>
      <el-table-column label="发动机型号" prop="EngineNumber"></el-table-column>
      <el-table-column label="品牌型号" prop="BrandModel"></el-table-column>-->
      <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
      <el-table-column label="状态" prop="Status" :formatter="IsNormal"></el-table-column>
      <el-table-column label="拒绝原因" prop="Reason"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.Status === 0"
            size="mini"
            type="primary"
            plain
            icon="el-icon-success"
            @click="handleAgree(scope.$index, scope.row)"
          >通过</el-button>
          <el-button
            v-if="scope.row.Status === 0"
            size="mini"
            type="danger"
            plain
            icon="el-icon-warning"
            @click="handlerefuse(scope.$index, scope.row)"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="电子发票处理确认" :visible.sync="dialogVisible" width="30%">
      <div style="width: 100%;">
        <el-form :model="reasonForm" label-width="80px" :rules="reasonFormRules" ref="reasonForm">
          <el-form-item label="拒绝原因" prop="reason">
            <el-input v-model="reasonForm.reason" :clearable="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer_btn" style="text-align:right">
          <el-button size="mini" plain @click="dialogVisible = false">取消</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            :loading="loadingBtn"
            @click.native="AgreeBtn(dataObj)"
          >拒绝</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogVisibleLook">
     <div class="preImg">
        <img :src="ImgUrl" alt="">
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
      mainurl:'',
      orderList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      loadingBtn: false,
      dialogVisible: false,
      dialogVisibleLook:false,
      dataObj: {},
      reasonForm: {
        reason: null
      },
      reasonFormRules: {
        reason: [{ required: true, message: "请输入拒绝原因", trigger: "blur" }]
      },
      // 搜索关键字
      filters: {
        keyword: "",
        type: -1
      },
      // 状态数组
      typeList: [
        {
          name: "全部",
          value: -1
        },
        {
          name: "已提交",
          value: 0
        },
        {
          name: "审核通过",
          value: 1
        },
        {
          name: "拒绝",
          value: 2
        }
      ],
      ImgUrl:''
    };
  },
  methods: {
    IsNormal(row, status) {
      var sex = row[status.property];
      switch (sex) {
        case 0:
          return (sex = "申请中");
          break;
        case 1:
          return (sex = "审核通过");
          break;
        case 2:
          return (sex = "已拒绝");
          break;
        default:
          return (sex = "未知状态");
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
        .get("api/BackUser/GetCarCertificationList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            status: this.filters.type,
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
    // 同意按钮
    handleAgree(index, row) {
      this.$confirm("确认同意该申请吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackUser/CheckCarCertification", {
            params: {
              id: row.ID,
              status: 1,
              token: getCookie("token"),
              reason: this.reasonForm.reason
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
    // 拒绝弹框
    handlerefuse(index, row) {
      this.dialogVisible = true;
      this.dataObj = Object.assign({}, row);
    },
    // 弹框内部确认按钮
    AgreeBtn(obj) {
      this.$refs.reasonForm.validate(valid => {
        if (valid) {
          this.loadingBtn = true;
          this.$http
            .get("api/BackUser/CheckCarCertification", {
              params: {
                id: this.dataObj.ID,
                status: 2,
                token: getCookie("token"),
                reason: this.reasonForm.reason
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
    },
    handleLook(url){
      this.dialogVisibleLook = true
      this.ImgUrl  = this.mainurl+url
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
.preImg{
  width: 100%;
}
.preImg img{
  width: 100%;
}
</style>
