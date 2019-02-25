<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackNoticeList' }">通知管理</el-breadcrumb-item>
        <el-breadcrumb-item>通知添加</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="150px" class="demo-addForm">
        <el-form-item label="通知名称" prop="Title">
          <el-input v-model="addForm.Title"></el-input>
        </el-form-item>
        <el-form-item label="展示图" prop="logo">
          <el-upload v-model="addForm.logo" class="avatar-uploader" :limit="1" :action="action" :on-preview="handlePictureCardPreview"
            list-type="picture-card" :file-list="Images" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>最多上传1张，且图片宽高比为：1/1</span>
        </el-form-item>
        <el-form-item label="通知简介" prop="Brife">
          <el-input type="textarea" v-model="addForm.Brife"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="Url">
          <el-input v-model="addForm.Url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('addForm')">立即添加</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        action: "",
        addForm: {
          Title: "", //名称
          logo: "", //图片
          Url: "", //地址
          Brife: "", //简介
        },
        Images: [],
        dialogVisible: false,
        dialogImageUrl: "",
        rules: {
          Title: [{
            required: true,
            message: "请输入通知名称",
            trigger: "blur"
          }],
          logo: [{
            // type: "array",
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }],
          Brife: [{
            required: true,
            message: "请输入简介",
            trigger: "blur"
          }],
          Url: [{
            required: true,
            message: "请输入地址",
            trigger: "blur"
          }]
        },
      };
    },
    methods: {
      // 添加提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              var para = Object.assign({}, this.addForm);
              // 将token传入参数中
              para.Token = getCookie("token");
              // para.Image = para.Image.join(",");
              // 发保存请求
              this.$http
                .get("api/BackOperate/AddNotice", {
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
                  function (error) {
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
          handleRemove(file, fileList)  移除的文件，（需要重新打印查看返回参数）
        */
      handleRemove(file, fileList) {
        // var newArr = [];
        // for (let index = 0; index < fileList.length; index++) {
        //   var element = [fileList[index].response.Result[0]];
        //   newArr = newArr.concat(element);
        // }
        // this.addForm.Image = newArr;
        this.addForm.logo = "";
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
        // this.addForm.Image = this.addForm.Image.concat(arrImg);
        this.addForm.logo = response.Result[0]
      },
      /*
        重置表单
        */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    beforeMount() {
      this.action = mainurl + "/api/Photo/UpdateForImage?type=1"
    },
    mounted() {}
  };

</script>
<style scoped>


</style>
