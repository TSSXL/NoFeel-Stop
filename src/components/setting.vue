<template>
<!-- 已经废弃 -->
  <div class="advertising">
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>广告位管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:80%;">
      <el-form
        :model="addForm"
        :inline="false"
        label-width="150px"
        class="demo-addForm demo-addForm1"
      >
        <el-form-item label="ICON" prop="Icon">
          <el-upload
            class="home-icon"
            v-model="addForm.Icon"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccessIcon"
          >
            <img v-if="imageIconUrl" :src="imageIconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-time-picker
            is-range
            v-model="value4"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="首页Banner" prop="BannerStr">
          <el-upload
            class="home-banner"
            v-model="addForm.BannerStr"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccessBanner"
          >
            <img v-if="imageBannerUrl" :src="imageBannerUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="启动页" prop="StartPageImage">
          <el-upload
            class="home-start"
            v-model="addForm.StartPageImage"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccessStart"
          >
            <img v-if="imageStartUrl" :src="imageStartUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="margin-top:5px;">
            <el-input placeholder="请输入对应跳转地址" v-model="addForm.StartUrl">
              <template slot="prepend">Http://</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="首页弹框" prop="HomeWindowImage">
          <el-upload
            class="home-dialog"
            v-model="addForm.HomeWindowImage"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccessDialog"
          >
            <img v-if="imageDialogUrl" :src="imageDialogUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="margin-top:5px;">
            <el-input placeholder="请输入对应跳转地址" v-model="addForm.HomeWindowUrl">
              <template slot="prepend">Http://</template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
      <el-form :model="addForm" label-width="150px" class="demo-addForm">
        <el-form-item label="引导页">
          <el-upload
            class="avatar-uploader"
            :limit="5"
            :action="action"
            :on-preview="handlePictureCardPreview"
            list-type="picture-card"
            :file-list="addForm.Image"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
          <span>最多上传5张</span><br>
          <el-time-picker
            is-range
            v-model="value4"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <el-form
        :model="addForm"
        :inline="true"
        label-width="150px"
        class="demo-addForm demo-addForm3"
      >
        <el-form-item label="钱包页Banner">
          <div class="wallet-box">
            <div class="wallet">
              <el-upload
                class="home-icon"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccessWallet1"
              >
                <img v-if="addForm.imageWalletImg1" :src="addForm.imageWalletImg1" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-top:5px;" v-if="walletInputArr[0]">
                <el-input
                  placeholder="请输入对应跳转地址"
                  v-model="addForm.imageWalletArr[0].imageWalletUrl"
                >
                  <template slot="prepend">Http://</template>
                </el-input>
              </div>
            </div>
            <div class="wallet">
              <el-upload
                class="home-icon"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccessWallet2"
              >
                <img v-if="addForm.imageWalletImg2" :src="addForm.imageWalletImg2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-top:5px;" v-if="walletInputArr[1]">
                <el-input
                  placeholder="请输入对应跳转地址"
                  v-model="addForm.imageWalletArr[1].imageWalletUrl"
                >
                  <template slot="prepend">Http://</template>
                </el-input>
              </div>
            </div>
            <div class="wallet">
              <el-upload
                class="home-icon"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccessWallet3"
              >
                <img v-if="addForm.imageWalletImg3" :src="addForm.imageWalletImg3" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-top:5px;" v-if="walletInputArr[2]">
                <el-input
                  placeholder="请输入对应跳转地址"
                  v-model="addForm.imageWalletArr[2].imageWalletUrl"
                >
                  <template slot="prepend">Http://</template>
                </el-input>
              </div>
            </div>
            <div class="wallet">
              <el-upload
                class="home-icon"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccessWallet4"
              >
                <img v-if="addForm.imageWalletImg4" :src="addForm.imageWalletImg4" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-top:5px;" v-if="walletInputArr[3]">
                <el-input
                  placeholder="请输入对应跳转地址"
                  v-model="addForm.imageWalletArr[3].imageWalletUrl"
                >
                  <template slot="prepend">Http://</template>
                </el-input>
              </div>
            </div>
            <div class="wallet">
              <el-upload
                class="home-icon"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccessWallet5"
              >
                <img v-if="addForm.imageWalletImg5" :src="addForm.imageWalletImg5" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-top:5px;" v-if="walletInputArr[4]">
                <el-input
                  placeholder="请输入对应跳转地址"
                  v-model="addForm.imageWalletArr[4].imageWalletUrl"
                >
                  <template slot="prepend">Http://</template>
                </el-input>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="padding-left:150px;display: block;">
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
import qs from "qs";

export default {
  data() {
    return {
      // value4: [new Date(1,1), new Date(1,1)],
      value4: ['04:00', '04:03'],
      action: "",
      // 预览图片地址
      imageIconUrl: "",
      imageBannerUrl: "",
      imageStartUrl: "",
      imageDialogUrl: "",
      // 钱包列表预览图
      imageWalletUrlArr: ["", "", "", "", ""],
      walletInputArr: [false, false, false, false, false],
      // 引导提交数据数组
      Images: [],
      addForm: {
        Icon: "",
        BannerStr: "", // 首页banner单图
        StartPageImage: "", // 启动页图片
        StartUrl: "", // 启动页跳转地址
        HomeWindowImage: "",
        HomeWindowUrl: "", // 首页弹框图跳转地址
        BootStr: "", // 引导页 5张拼接
        Image: [], // 引导页图片预览显示数组 不用于提交
        imageWalletArr: [
          {
            imageWalletImg: "",
            imageWalletUrl: ""
          },
          {
            imageWalletImg: "",
            imageWalletUrl: ""
          },
          {
            imageWalletImg: "",
            imageWalletUrl: ""
          },
          {
            imageWalletImg: "",
            imageWalletUrl: ""
          },
          {
            imageWalletImg: "",
            imageWalletUrl: ""
          }
        ],
        imageWalletImg1: "",
        imageWalletImg2: "",
        imageWalletImg3: "",
        imageWalletImg4: "",
        imageWalletImg5: ""
      },
      // 钱包图集
      walletArr: [],
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  methods: {
    // 添加提交
    submitForm() {
      console.log(this.value4)
      //判断是否填写完整  --true
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.addLoading = true;
        var para = Object.assign({}, this.addForm);
        // 将token传入参数中
        para.Token = getCookie("token");
        var walletObjStrArr = [];
        para.imageWalletArr.forEach(element => {
          if (element.imageWalletImg === "") {
            return false;
          }
          walletObjStrArr.push(
            element.imageWalletImg + "," + element.imageWalletUrl
          );
        });
        para.BootStr = this.Images.join("|");
        // 处理钱包banner数据
        // para.Image = para.Image.join(",");
        // 发保存请求
        this.$http
          .post(
            "api/BackSys/SystemAdvertisingSettings",
            qs.stringify({
              Icon: para.Icon !== "" ? para.Icon : -1,
              StartPageImage:
                para.StartPageImage !== "" ? para.StartPageImage : -1,
              StartUrl: para.StartUrl !== "" ? para.StartUrl : -1,
              HomeWindowImage:
                para.HomeWindowImage !== "" ? para.HomeWindowImage : -1,
              HomeWindowUrl:
                para.HomeWindowUrl !== "" ? para.HomeWindowUrl : -1,
              BannerStr: para.BannerStr !== "" ? para.BannerStr : -1,
              BootStr: para.BootStr !== "" ? para.BootStr : -1,
              WalletStr:
                walletObjStrArr.join("|") !== ""
                  ? walletObjStrArr.join("|")
                  : "-1,-1",
              Token: para.Token
            })
          )
          .then(
            function(response) {
              this.addLoading = false;
              var status = response.data.Status;
              if (status === 1) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: response.data.Result
                });
                this.getImgInfo();
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
    // 获取信息
    getImgInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("api/BackSys/GetSysSettings", {
          params: {
            Token: getCookie("token")
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              // Icon
              this.addForm.Icon = response.data.Result.Icon;
              this.imageIconUrl = response.data.Result.Icon?mainurl + response.data.Result.Icon:null;
              // bannner
              this.addForm.BannerStr = response.data.Result.HomeBanner[0].Image;
              this.imageBannerUrl =
                response.data.Result.HomeBanner[0].Image?mainurl + response.data.Result.HomeBanner[0].Image:null;
              // start
              this.addForm.StartPageImage = response.data.Result.StartPageImage;
              this.addForm.StartUrl = response.data.Result.StartUrl;
              this.imageStartUrl =
                response.data.Result.StartPageImage?mainurl + response.data.Result.StartPageImage:null;
              // diolog
              this.addForm.HomeWindowImage =
                response.data.Result.HomeWindowImage;
              this.addForm.HomeWindowUrl = response.data.Result.HomeWindowUrl;
              this.imageDialogUrl =
                response.data.Result.HomeWindowImage?mainurl + response.data.Result.HomeWindowImage:null;
              // 引导页
              var arr = [];
              var arr0 = [];
              response.data.Result.BootList.forEach((element, index) => {
                if (element.Image != "-1") {
                  var obj = {};
                  obj.url = mainurl + element.Image;
                  arr.push(obj);
                  arr0.push(element.Image);
                }
              });
              this.addForm.Image = arr;
              this.Images = arr0;
              // 钱包页
              var arr1 = [];
              response.data.Result.WalleList.forEach((element, index) => {
                if (element.Image != "-1") {
                  this.addForm.imageWalletArr[index].imageWalletImg =
                    element.Image;
                  this.addForm.imageWalletArr[index].imageWalletUrl =
                    element.Url;
                  this.imageWalletUrlArr[index] = mainurl + element.Image;
                  this.walletInputArr[index] = true;
                  this.addForm["imageWalletImg" + (index + 1)] =
                    mainurl + element.Image;
                }
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
    // 查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /*
      移除图片 引导页图
      handleRemove(file, fileList)  移除的文件，（需要重新打印查看返回参数）
    */
    handleRemove(file, fileList) {
      var newArr = [];
      let file1 = file.url;
      // 判断filename是否存在 如果不存在说明是编辑的图，如果存在说明是新上传的图片，会有图片的信息
      if (!file.name) {
        for (let index = 0; index < this.Images.length; index++) {
          if (mainurl + this.Images[index] == file1) {
            this.Images.splice(index, 1);
          }
        }
      } else {
        for (let index = 0; index < this.Images.length; index++) {
          if (this.Images[index] == file.response.Result[0]) {
            this.Images.splice(index, 1);
          }
        }
      }
    },
    /*
        上传成功的回调函数
          handleAvatarSuccess(response, file, fileList) 
          respomse:请求回调，返回上传的图片地址
          file：该图片的参数信息
          fileList 返回当前所有的图片数组，
        */
    handleAvatarSuccess(response, file, fileList) {
      this.Images.push(response.Result[0]);
    },
    handleAvatarSuccessIcon(response, file, fileList) {
      this.imageIconUrl = URL.createObjectURL(file.raw);
      this.addForm.Icon = response.Result[0];
    },
    handleAvatarSuccessBanner(response, file, fileList) {
      this.imageBannerUrl = URL.createObjectURL(file.raw);
      this.addForm.BannerStr = response.Result[0];
    },
    handleAvatarSuccessStart(response, file, fileList) {
      this.imageStartUrl = URL.createObjectURL(file.raw);
      this.addForm.StartPageImage = response.Result[0];
    },
    handleAvatarSuccessDialog(response, file, fileList) {
      this.imageDialogUrl = URL.createObjectURL(file.raw);
      this.addForm.HomeWindowImage = response.Result[0];
    },
    // 钱包图集
    handleAvatarSuccessWallet1(response, file, fileList) {
      this.walletInputArr[0] = true;
      this.addForm.imageWalletImg1 = URL.createObjectURL(file.raw);
      // console.log(this.imageWalletUrlArr);
      this.addForm.imageWalletArr[0].imageWalletImg = response.Result[0]; //
      // this.walletArr = this.walletArr.concat([response.Result[0]])
      console.log(this.addForm.imageWalletArr[0]);
    },
    handleAvatarSuccessWallet2(response, file, fileList) {
      this.addForm.imageWalletImg2 = URL.createObjectURL(file.raw);
      this.addForm.imageWalletArr[1].imageWalletImg = response.Result[0];
      this.walletInputArr[1] = true;
    },
    handleAvatarSuccessWallet3(response, file, fileList) {
      this.addForm.imageWalletImg3 = URL.createObjectURL(file.raw);
      this.addForm.imageWalletArr[2].imageWalletImg = response.Result[0];
      this.walletInputArr[2] = true;
    },
    handleAvatarSuccessWallet4(response, file, fileList) {
      this.addForm.imageWalletImg4 = URL.createObjectURL(file.raw);
      this.addForm.imageWalletArr[3].imageWalletImg = response.Result[0];
      this.walletInputArr[3] = true;
    },
    handleAvatarSuccessWallet5(response, file, fileList) {
      this.addForm.imageWalletImg5 = URL.createObjectURL(file.raw);
      this.addForm.imageWalletArr[4].imageWalletImg = response.Result[0];
      this.walletInputArr[4] = true;
    }
  },
  beforeMount() {
    this.action = mainurl + "/api/Photo/UpdateForImage?type=1";
  },
  mounted() {
    this.getImgInfo();
  }
};
</script>
<style scoped>
/* 首页banner */
.home-banner .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.home-banner .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.wallet {
  display: inline-block;
  margin: 0 10px 20px 0;
}

.avatar-uploader-icon,
.avatar {
  /* width: 100px; */
  height: 100px;
  line-height: 100px;
}
</style>
