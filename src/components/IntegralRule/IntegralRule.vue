<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>积分规则</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
          <!-- table 内容 -->
    <el-table :data="GetIntegralRule" style="width: 100%" :border='true'>
      <el-table-column label="规则名称" prop="Type" :formatter="Status" >
      </el-table-column>
      <el-table-column label="积分数值" prop="Score" >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button style="margin-bottom:10px;" size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
        <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="积分数值" prop="Score">
          <el-input v-model="editForm.Score" auto-complete="off"></el-input>
        </el-form-item>
        <p style="text-align:center;color:red;">积分为纯数字，大于0即为启用</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
    </el-main>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      GetIntegralRule: [],
      editForm: {
        Score: 0,
        ID: ""
      },
      editFormRules: {
        Score: [
          {
            required: true,
            message: "请输入",
            trigger: "change"
          }
        ]
      },
      editFormVisible: false
    };
  },
  methods: {
    GetRuleList() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("api/BackIntegral/GetIntegralRule", {
          params: {
            token: getCookie("token")
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.GetIntegralRule = response.data.Result;
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
    Status(row, status) {
      var status = row[status.property];
      switch (status) {
        case 0:
          return (status = "关注订阅号");
          break;
        case 1:
          return (status = "车牌绑定");
          break;
        case 2:
          return (status = "应用评价");
          break;
        case 3:
          return (status = "社交平台分享");
          break;
        case 4:
          return (status = "完成充值5元以上");
          break;
        case 5:
          return (status = "预约车位并成功");
          break;
        case 6:
          return (status = "绑定银行卡并完成一笔无感支付");
          break;
        case 7:
          return (status = "手机注册");
          break;
        case 8:
          return (status = "行驶证认证");
          break;
        case 9:
          return (status = "第三方绑定");
          break;
        default:
          return (status = "警告：异常规则");
          break;
      }
    },
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      this.editForm = obj;
      this.editFormVisible = true;
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            // 将token传入参数中
            var para = Object.assign({}, this.editForm);
            para.id = this.editForm.ID;
            para.score = this.editForm.Scroe;
            para.token = getCookie("token");
            // 发保存请求
            this.$http
              .get("api/BackIntegral/EditIntegral", {
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
                    this.GetRuleList();
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
    }
  },
  beforeMount() {},
  mounted() {
    this.GetRuleList();
  }
};
</script>
<style scoped>
</style>
