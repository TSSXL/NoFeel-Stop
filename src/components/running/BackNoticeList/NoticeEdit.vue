<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackNoticeList' }">通知管理</el-breadcrumb-item>
        <el-breadcrumb-item>通知编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="通知名称" prop="Title">
          <el-input v-model="editForm.Title"></el-input>
        </el-form-item>
        <el-form-item label="展示图" prop="Logo">
          <el-upload v-model="editForm.Logo" class="avatar-uploader" :limit="1" :action="action" :on-preview="handlePictureCardPreview"
            list-type="picture-card" :file-list="Images" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>最多上传1张，且图片宽高比为：1/1</span>
        </el-form-item>
        <el-form-item label="通知简介" prop="Brife">
          <el-input type="textarea" v-model="editForm.Brife"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="Url">
          <el-input type="textarea" v-model="editForm.Url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即修改</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
export default {
  data() {
    var checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("价格不能为空"));
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkStock = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("库存不能为空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("库存必须为整数"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      action: "",
      editForm: {
        Title: "", //名称
        Logo: [], //图片
        Url: "", //地址
        Brife: "", //简介
        ID: ""
      },
      Images: [],
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        Title: [
          {
            required: true,
            message: "请输入通知名称",
            trigger: "blur"
          }
        ],
        logo: [
          {
            // type: "array",
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }
        ],
        Brife: [
          {
            required: true,
            message: "请输入简介",
            trigger: "blur"
          }
        ],
        Url: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 修改提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            console.log(para);
            // 发保存请求
            this.$http
              .get("api/BackOperate/EditNotice", {
                params: {
                  ID: para.ID,
                  Title: para.Title,
                  Brife: para.Brife,
                  logo: para.Logo,
                  Url: para.Url,
                  Token: getCookie("token")
                }
              })
              .then(
                function(response) {
                  this.editLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.$router.push({
                      path: "/BackNoticeList"
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /*
       移除图片 
        handleRemove(file, fileList)  移除的文件，剩下的图片数组（带有域名，需要去掉）
      */
    handleRemove(file, fileList) {
      // var newArr = [];
      // for (let index = 0; index < fileList.length; index++) {
      //   var element = [fileList[index].url.split(".com")[1]];
      //   newArr = newArr.concat(element);
      // }
      // this.editForm.Image = newArr;
      this.editForm.logo = "";
      this.Image = [];
    },
    /*
      上传成功的回调函数
        handleAvatarSuccess(response, file, fileList) 
        respomse:请求回调，返回上传的图片地址
        file：该图片的参数信息
        fileList 返回当前所有的图片数组，
      */
    handleAvatarSuccess(response, file, fileList) {
      // var arrImg = [];
      // arrImg = arrImg.concat(response.Result[0]);
      // this.editForm.Image = this.editForm.Image.concat(arrImg);
      this.editForm.Logo = response.Result[0];
    },
    /*
      点击打开图文详情框
      
      */

    clickOpenDetail(detail) {
      this.openDetails = true;
      this.defaultMsg = decodeURIComponent(detail);
    },
    addSubmit() {
      var content = this.$refs.ueditor.getUEContent();
      this.editForm.Details = encodeURIComponent(content);
      this.openDetails = false;
      console.log(this.editForm);
    },
    /*
      重置表单
      */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  beforeMount() {
    this.action = mainurl + "/api/Photo/UpdateForImage?type=1";
  },
  mounted() {
    var noticeInfo = JSON.parse(localStorage.getItem("noticeListInfo"));
    this.editForm = noticeInfo;
    var arr = [];
    var arr = [
      {
        url: mainurl + noticeInfo.Logo
      }
    ];
    this.Images = arr;
  }
};
</script>
<style scoped>

</style>
