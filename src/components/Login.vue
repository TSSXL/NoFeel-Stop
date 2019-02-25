<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <div class="form_img">
        <img src="../../static/images/login_logo.jpg" alt="">
      </div>
    </transition>
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <div>
          <div class="manage_tip">
            <p>SPS后台管理系统</p>
          </div>
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
            </el-form-item>
          </el-form>
        </div>

      </section>
    </transition>
  </div>
</template>

<script>
import md5 from "js-md5";
import qs from "qs";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submitForm(formName) {
      var tt = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.$http
            .post(
              "api/Admin/Login",
              qs.stringify({
                Name: this.loginForm.username,
                Password: md5(this.loginForm.password)
              })
            )
            .then(
              function(response) {
                var status = response.data.Status;
                if (status === 1) {
                  setCookie("token", response.data.Result);
                  setCookie("username", this.loginForm.username);
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "登陆成功"
                  });
                  setTimeout(() => {
                    this.$router.push({
                      path: "/"
                    });
                  }, 1000);
                } else {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                }
              }.bind(this)
            )
            .catch(
              function(error) {
                this.$notify.error({
                  title: "错误",
                  message: "错误：请检查网络"
                });
              }.bind(this)
            );
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入用户名和密码",
            offset: 100
          });
          return false;
        }
      });
    }
  },
  watch: {
    adminInfo: function(newValue) {}
  }
};
</script>

<style scoped>
@import "../../static/css/mixin.css";
.login_page {
  background-image: url("../../static/images/bj.jpg");
  background-size: 100% 100%;
  height: 100%;
  text-align: center;
}
.el-button--primary {
  color: #fff;
  background-color: #C7161C;
  border-color: #C7161C;
}
.manage_tip {
  /* position: absolute; */
  width: 100%;
  /* top: -100px; */
  left: 0;
}

.manage_tip p {
  font-size: 34px;
  padding: 20px 0;
}

.form_img {
  position: absolute;
  left: calc(50% - 400px);
  top: calc(50% - 135px);
  width: 280px;
  border-radius: 5px;
  text-align: center;
}

.form_contianer {
  position: absolute;
  left: calc(50% - 0px);
  top: calc(50% - 210px);
  /* .wh(320px, 210px);
  .ctp(320px, 210px); */
  width: 320px;
  /* height: 210px; */
  padding: 30px;
  /* box-sizing: border-box; */
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
}

.submit_btn {
  width: 100%;
  font-size: 16px;
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}

.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
