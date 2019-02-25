<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BackParkList' }">停车场列表</el-breadcrumb-item>
        <el-breadcrumb-item>停车场编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="停车场地址">
          <BaiDuMap :mapmsg="locationMsg" ref="map"></BaiDuMap>
        </el-form-item>
        <el-form-item label="停车场编号" prop="Number">
          <el-input v-model="editForm.Number"></el-input>
        </el-form-item>
        <el-form-item label="停车场名" prop="Name">
          <el-input v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="使用接口" prop="InterfaceType">
          <el-select v-model="editForm.InterfaceType" placeholder="请选择使用接口类型">
            <el-option v-for="item in TypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总车位" prop="TotalCount">
          <el-input v-model.number="editForm.TotalCount"></el-input>
        </el-form-item>
        <el-form-item label="剩余车位" prop="ResidualCount">
          <el-input v-model.number="editForm.ResidualCount"></el-input>
        </el-form-item>
        <el-form-item label="预约金额" prop="ReservationPrice">
          <el-input v-model.number="editForm.ReservationPrice"></el-input>
        </el-form-item>
                <el-form-item label="收费标准" prop="StandardImage">
          <el-upload v-model="editForm.StandardImage" class="avatar-uploader" :limit="1" :action="action" :on-preview="handlePictureCardPreview"
            list-type="picture-card" :file-list="Images" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>最多上传1张，且图片宽高比为：9/16</span>
        </el-form-item>
        <el-form-item label="免费时长" prop="FreeHours">
          <el-input v-model.number="editForm.FreeHours"></el-input>
        </el-form-item>
        <el-form-item label="24小时封顶价格" prop="Capping">
          <el-input v-model.number="editForm.Capping "></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="IsRecommend">
          <el-switch v-model="editForm.IsRecommend"></el-switch>
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
import BaiDuMap from "../BaiDuMap.vue"; //在页面中引入地图
// import bus from "../../utils/bus.js";
import qs from "qs";

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
          callback(new Error("不能为空"));
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
      editForm: {
        Number: "", //停车场编号
        Name: "", //停车场名
        InterfaceType: 0,
        ResidualCount: "", //剩余车位
        // AppointmentCount: "", //预约车位
        TotalCount: "", //总车位
        Address: "", //地址
        Longitude: 0, //经纬度
        ReservationPrice: 0,
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
        ResidualCount: [
          {
            validator: checkResidualCount
          }
        ],
        ReservationPrice: [
          {
            validator: checkReservationPrice
          }
        ],
        // AppointmentCount: [
        //   {
        //     validator: checkResidualCount
        //   }
        // ],
        TotalCount: [
          {
            validator: checkTotalCount
          }
        ],
        IsRecommend: [
          {
            required: true,
            message: "是否推荐",
            trigger: "change"
          }
        ]
      },
      // 地图经纬度  通用
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
      }
    };
  },
  methods: {
    // 修改提交
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
              this.editLoading = true;
              var para = Object.assign({}, this.editForm);
              // 将token传入参数中
              para.Token = getCookie("token");
              para.Address = this.$refs.map.locationMsg.address;
              para.Longitude = this.$refs.map.locationMsg.lnglat.split(",")[0];
              para.Latitude = this.$refs.map.locationMsg.lnglat.split(",")[1];
              // 发保存请求
              this.$http
                .post("api/BackPark/EditPark", qs.stringify(para))
                .then(
                  function(response) {
                    this.editLoading = false;
                    var status = response.data.Status;
                    if (status === 1) {
                      // 表单重置
                      this.$refs["editForm"].resetFields();
                      this.editFormVisible = false;
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
      }
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
      this.editForm.StandardImage = "";
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
      this.editForm.StandardImage = response.Result[0];
    },
    /*
      重置表单
      */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  beforeMount() {
    this.action = mainurl + "/api/Photo/UpdateForImage?type=3";
    var parkInfo = JSON.parse(localStorage.getItem("parkListInfo"));
    this.editForm = parkInfo;
    this.locationMsg.lnglat = parkInfo.Longitude + "," + parkInfo.Latitude;
    this.locationMsg.address = parkInfo.Address;

    // 编辑自动获取图片
    if (parkInfo.StandardImage == "") {
      this.Images = [];
    } else {
      var arr = [];
      var arr = [
        {
          url: mainurl + parkInfo.StandardImage
        }
      ];
      this.Images = arr;
    }
  }
};
</script>
<style scoped>
</style>
