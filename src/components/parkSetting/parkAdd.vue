<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackParkList' }">停车场列表</el-breadcrumb-item>
        <el-breadcrumb-item>停车场添加</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="150px" class="demo-addForm">
        <el-form-item label="停车场地址" prop="Details">
          <BaiDuMap :mapmsg="locationMsg" ref="map"></BaiDuMap>
        </el-form-item>
        <el-form-item label="停车场编号" prop="Number">
          <el-input v-model="addForm.Number"></el-input>
        </el-form-item>
        <el-form-item label="停车场名" prop="Name">
          <el-input v-model="addForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="使用接口" prop="InterfaceType">
          <el-select v-model="addForm.InterfaceType" placeholder="请选择使用接口类型">
            <el-option v-for="item in TypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="预约车位" prop="AppointmentCount">
          <el-input v-model.number="addForm.AppointmentCount"></el-input>
        </el-form-item> -->
        <el-form-item label="总车位" prop="TotalCount">
          <el-input v-model.number="addForm.TotalCount"></el-input>
        </el-form-item>
        <el-form-item label="剩余车位" prop="ResidualCount">
          <el-input v-model.number="addForm.ResidualCount"></el-input>
        </el-form-item>
        <el-form-item label="预约金额" prop="ReservationPrice">
          <el-input v-model.number="addForm.ReservationPrice"></el-input>
        </el-form-item>
        <el-form-item label="收费标准" prop="StandardImage">
          <el-upload v-model="addForm.StandardImage" class="avatar-uploader" :limit="1" :action="action" :on-preview="handlePictureCardPreview"
            list-type="picture-card" :file-list="Images" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>最多上传1张，且图片宽高比为：9/16</span>
        </el-form-item>
        <el-form-item label="免费时长" prop="FreeHours">
          <el-input v-model.number="addForm.FreeHours"></el-input>
        </el-form-item>
        <el-form-item label="24小时封顶价格" prop="Capping">
          <el-input v-model.number="addForm.Capping "></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="IsRecommend">
          <el-switch v-model="addForm.IsRecommend"></el-switch>
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
import qs from "qs";
import BaiDuMap from "../BaiDuMap.vue"; //在页面中引入高德地图
export default {
  components: {
    BaiDuMap
  },
  data() {
    var checkResidualCount = (rule, value, callback) => {
      if (!value) {
        if (value == "0") {
          callback();
        } else {
          callback(new Error("剩余车位不能为空"));
        }
      } else {
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("必须为整数"));
        } else {
          if (value < 0) {
            callback(new Error("不能小于0"));
          } else {
            callback();
          }
        }
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
      }, 100);
      0.11;
    };
    var checkReservationPrice = (rule, value, callback) => {
      if (!value) {
        if (value == "0") {
          callback();
        } else {
          callback(new Error("预约金额不能为空"));
        }
      } else {
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("不能小于0"));
          } else {
            callback();
          }
        }
      }
      setTimeout(() => {
        // 是否为整数Number.isInteger
      }, 100);
      0.11;
    };
    var checkAppointmentCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("预约车位不能为0或空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("必须为整数"));
        } else {
          if (value <= 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkTotalCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("总车位不能为0或空"));
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else if (value % 1 !== 0) {
          callback(new Error("必须为整数"));
        } else {
          if (value <= 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    var checkFreeHours = (rule, value, callback) => {
      if (!value) {
        if (value == "0") {
          callback();
        } else {
          callback(new Error("不能为空"));
        }
      }
      setTimeout(() => {
        // 是否为数字
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value <= 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };

    return {
      action: "",
      Images: [],
      dialogImageUrl: "",
      dialogVisible: false,
      addForm: {
        Number: "", //停车场编号
        Name: "", //停车场名
        InterfaceType: 0,
        ResidualCount: "", //剩余车位
        // AppointmentCount: "", //预约车位
        TotalCount: "", //总车位
        Address: "", //地址
        ReservationPrice: "",
        Longitude: 0, //经纬度
        Latitude: 0,
        IsRecommend: false, //是否推荐
        StandardImage: "",
        FreeHours: "",
        Capping: ""
      },
      // 接口类型列表
      TypeList: [
        {
          name: "云行天下",
          value: 0
        },
        {
          name: "泊物云",
          value: 1
        },
        {
          name:"赛菲姆",
          value:2
        }
      ],
      // 地图经纬度  通用
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
      },
      rules: {
        Number: [
          {
            required: true,
            message: "请输入停车场编号",
            trigger: "blur"
          }
        ],
        Name: [
          {
            required: true,
            message: "请输入停车场名",
            trigger: "blur"
          }
        ],
        StandardImage: [
          {
            required: true,
            message: "请上传收费标准",
            trigger: "blur"
          }
        ],
        ResidualCount: [
          {
            validator: checkResidualCount
          }
        ],
        // AppointmentCount: [{
        //   validator: checkResidualCount
        // }],
        ReservationPrice: [
          {
            validator: checkReservationPrice
          }
        ],
        TotalCount: [
          {
            validator: checkTotalCount
          }
        ],
        FreeHours: [
          {
            validator: checkFreeHours
          }
        ],
        Capping: [
          {
            validator: checkFreeHours
          }
        ],
        IsRecommend: [
          {
            required: true,
            message: "是否推荐",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 添加提交
    submitForm(formName) {
      if (this.$refs.map.locationMsg.lnglat == "") {
        this.$message({
          message: "警告哦，请先地图选点获取经纬度地址",
          type: "warning"
        });
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              var para = Object.assign({}, this.addForm);
              // 将token传入参数中
              para.Token = getCookie("token");
              para.Address = this.$refs.map.locationMsg.address;
              para.Longitude = this.$refs.map.locationMsg.lnglat.split(",")[0];
              para.Latitude = this.$refs.map.locationMsg.lnglat.split(",")[1];
              // 发保存请求
              this.$http
                .post("api/BackPark/AddPark", qs.stringify(para))
                .then(
                  function(response) {
                    this.addLoading = false;
                    var status = response.data.Status;
                    if (status === 1) {
                      // 表单重置
                      this.$refs["addForm"].resetFields();
                      this.addFormVisible = false;
                      this.$router.push({
                        path: "/BackParkList"
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
                //请求error
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
      }
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
      this.addForm.StandardImage = "";
    },
    /*
        上传成功的回调函数
          handleAvatarSuccess(response, file, fileList) 
          respomse:请求回调，返回上传的图片地址
          file：该图片的参数信息
          fileList 返回当前所有的图片数组，
        */
    handleAvatarSuccess(response, file, fileList) {
      this.addForm.StandardImage = response.Result[0];
    },
    /*
            /*
              重置表单
              */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {},
  beforeMount() {
    this.action = mainurl + "/api/Photo/UpdateForImage?type=3";
  }
};
</script>
<style scoped>
#tangram-suggestion--TANGRAM__u-main {
  z-index: 4000 !important;
}
</style>
