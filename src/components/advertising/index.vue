<template>
  <div class="advertising">
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="广告参数分类">
          <el-select v-model="filters.type" placeholder="分类状态">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="info" @click="getAllUsers()">重置</el-button>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="infoList" style="width: 100%" :border="true">
      <el-table-column label="分类名称" prop="Type" :formatter="IsLock"></el-table-column>
      <el-table-column label="图片" prop="Image">
        <template slot-scope="scope">
          <div v-if="scope.row.Image == '-1'"></div>
          <div v-else-if="scope.row.Image == ''"></div>
          <div v-else-if='scope.row.Image'>
            <p v-if="scope.row.Image.indexOf('|')>0">
              <img
              v-for="(l,i) in scope.row.Image.split('|')"
              :key="i"
              :src="mainurl+l"
              width="100"
            >
            </p>
            <p v-else>
            <img :src="mainurl+scope.row.Image" width="100">
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="StTime" :formatter="CreateTime"></el-table-column>
      <el-table-column label="结束时间" prop="EndTime" :formatter="CreateTime"></el-table-column>
      <el-table-column label="跳转链接" prop="Url">
        <template slot-scope="scope">
          <span>{{scope.row.Url?decodeURI(scope.row.Url)=== '-1'?'无':decodeURI(scope.row.Url):'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>-->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next,jumper"
        :page-count="pageCount"
      ></el-pagination>
    </div>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item label="图片类别">
          <el-select v-model="editForm.type" placeholder="请选择分类">
            <el-option
              v-for="item in typeList1"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传">
          <div v-if="editForm.type !== 1">
            <el-upload
              class="home-start"
              v-model="editForm.image"
              :action="action"
              :show-file-list="false"
              :on-success="handleAvatarSuccessStart"
            >
              <img v-if="imageStartUrl" :src="imageStartUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              :limit="5"
              :action="action"
              :on-preview="handlePictureCardPreview"
              list-type="picture-card"
              :file-list="editForm.imageArr"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
            <span>最多上传5张</span>
          </div>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-time-picker
            is-range
            v-model="editForm.timeArr"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item
          label="跳转链接"
          v-if="editForm.type == 0|| editForm.type == 2||editForm.type == 5 "
        >
          <el-input placeholder="请输入对应跳转地址" v-model="editForm.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" ref="addForm">
        <el-form-item label="图片类别">
          <el-select v-model="addForm.type" placeholder="请选择分类">
            <el-option
              v-for="item in typeList1"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传">
          <div v-if="addForm.type !== 1">
            <el-upload
              class="home-start"
              v-model="addForm.image"
              :action="action"
              :show-file-list="false"
              :on-success="handleAvatarSuccessStart"
            >
              <img v-if="imageStartUrl" :src="imageStartUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              :limit="5"
              :action="action"
              :on-preview="handlePictureCardPreview"
              list-type="picture-card"
              :file-list="addForm.imageArr"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
            <span>最多上传5张</span>
          </div>
        </el-form-item>
        <el-form-item label="时间范围">
          <!-- <el-time-picker
            is-range
            v-model="addForm.timeArr"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>-->
          <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
          <el-date-picker
            v-model="addForm.timeArr"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="跳转链接"
          v-if="addForm.type == 0|| addForm.type == 2||addForm.type == 4||addForm.type == 5 "
        >
          <el-input placeholder="请输入对应跳转地址" v-model="addForm.url">
            <template slot="prepend">Http://</template>
          </el-input>
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
import qs from "qs";
export default {
  data() {
    var myDate = new Date(); //获取系统当前时间
    var nowData =
      myDate.getFullYear() +
      "-" +
      (myDate.getMonth() + 1) +
      "-" +
      myDate.getDate() +
      " " +
      (myDate.getHours() + 1) +
      ":" +
      myDate.getMinutes();
    return {
      infoList: [], //管理员列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      mainurl: "",
      // 搜索关键字
      filters: {
        type: -1
      },
      // 状态数组
      typeList: [
        { name: "全部", value: -1 },
        { name: "启动页", value: 0 },
        { name: "引导页", value: 1 },
        { name: "钱包Banner", value: 2 },
        { name: "APP图标", value: 3 },
        { name: "首页活动图标", value: 4 },
        { name: "首页弹框", value: 5 },
        { name: "停车场图标", value: 6 }
      ],
      typeList1: [
        { name: "启动页", value: 0 },
        { name: "引导页", value: 1 },
        { name: "钱包Banner", value: 2 },
        { name: "APP图标", value: 3 },
        { name: "首页活动图标", value: 4 },
        { name: "首页弹框", value: 5 },
        { name: "停车场图标", value: 6 }
      ],
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,
      //编辑界面数据
      editForm: {
        type: 0,
        url: "2342432",
        timeArr: ["00:00:00", "23:59:59"],
        image: "",
        imageArr: []
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      //新增界面数据
      addForm: {
        type: 0,
        url: "",
        timeArr: [],
        image: "",
        imageArr: []
      },
      action: "",
      // 单张图图片预览url
      imageStartUrl: "",
      // 多图上传 预览图窗口开关
      dialogVisible: false,
      // 多图上传预览图url
      dialogImageUrl: "",
      // 多图上传图片地址 用于提交请求
      AddMoreImages: []
    };
  },
  beforeMount() {
    this.action = mainurl + "/api/Photo/UpdateForImage?type=1";
  },
  methods: {
    /*
        获取列表 渲染列表
      */
    getInfo() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .get("api/BackSys/GetSysSettings", {
          params: {
            type: this.filters.type,
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.infoList = response.data.Result.List;
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
    //关键字搜索
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    getAllUsers() {
      this.filters = {
        type: -1
      };
      this.getInfo();
    },
    CreateTime(row, time) {
      var date = row[time.property];
      return date.replace("T", " ").split(".")[0];
    },
    IsLock(row, lock) {
      var status = row[lock.property];
      switch (status) {
        case 0:
          return (status = "启动页");
          break;
        case 1:
          return (status = "引导页");
          break;
        case 2:
          return (status = "钱包页Banner");
          break;
        case 3:
          return (status = "APP图标");
          break;
        case 4:
          return (status = "首页活动图标");
          break;
        case 5:
          return (status = "首页弹窗");
          break;
        case 6:
          return (status = "首页停车场图标");
          break;
        default:
          return (status = "未知状态");
          break;
      }
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    /* */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      this.editFormVisible = true;
      this.editForm.type = obj.Type;
      this.editForm.url = obj.Url;
      this.editForm.timeArr = [
        obj.StTime.split("T")[1],
        obj.EndTime.split("T")[1]
      ];
      this.editForm.image = obj.Image;
      // 判断是否是引导页，需要设置默认预览图片，以及上传图片的数据
      if (obj.Type === 1) {
        this.AddMoreImages = obj.Image.split("|");
        var arr = [];
        obj.Image.split("|").forEach((element, index) => {
          var obj = {};
          obj.url = mainurl + element;
          arr.push(obj);
        });
        this.editForm.imageArr = arr;
      } else {
        this.imageStartUrl = mainurl + obj.Image;
      }
    },
    handleAdd() {
      this.addFormVisible = true;
      this.imageStartUrl = "";
      this.addForm = {
        type: 0,
        url: "",
        timeArr: [],
        image: "",
        imageArr: []
      };
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {});
        }
      });
    },
    addSubmit() {
      var time0 = new Date(this.addForm.timeArr[0]);
      var time1 = new Date(this.addForm.timeArr[1]);
      if (time0.getFullYear()) {
        var timeStr0 =
          time0.getFullYear() +
          "-" +
          (time0.getMonth() + 1) +
          "-" +
          time0.getDate() +
          " " +
          time0.getHours() +
          ":" +
          time0.getMinutes();
        var timeStr1 =
          time1.getFullYear() +
          "-" +
          (time1.getMonth() + 1) +
          "-" +
          time1.getDate() +
          " " +
          time1.getHours() +
          ":" +
          time1.getMinutes();
        this.$refs.addForm.validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              var para = Object.assign({}, this.addForm);
              para.Token = getCookie("token");
              this.addLoading = false;
              if (Number(para.type) === 1) {
                para.image = this.AddMoreImages.join("|");
              }
              console.log(para);
              this.$http
                .post(
                  "api/BackSys/SystemAdvertisingSettings",
                  qs.stringify({
                    Image: para.image,
                    Type: para.type,
                    Url: encodeURI(para.url),
                    StTime: timeStr0,
                    EndTime: timeStr1,
                    Token: para.Token
                  })
                )
                .then(
                  function(response) {
                    this.addLoading = false;
                    var status = response.data.Status;
                    if (status === 1) {
                      this.addFormVisible = false;
                      this.$message({
                        showClose: true,
                        type: "success",
                        message: response.data.Result
                      });
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
      } else {
        this.$message({
          showClose: true,
          type: "warning",
          message: '请设置时间'
        });
      }
    },
    handleAvatarSuccess(response, file, fileList) {
      this.AddMoreImages.push(response.Result[0]);
    },
    // 多图查看图片
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
        for (let index = 0; index < this.AddMoreImages.length; index++) {
          if (mainurl + this.AddMoreImages[index] == file1) {
            this.AddMoreImages.splice(index, 1);
          }
        }
      } else {
        for (let index = 0; index < this.AddMoreImages.length; index++) {
          if (this.AddMoreImages[index] == file.response.Result[0]) {
            this.AddMoreImages.splice(index, 1);
          }
        }
      }
    },
    // 单张图上传
    handleAvatarSuccessStart(response, file, fileList) {
      this.imageStartUrl = URL.createObjectURL(file.raw);
      this.addForm.image = response.Result[0];
    },
    // 删除列表
    handleDelete(index, row) {
      var obj = Object.assign({}, row);
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackSys/DelSettings", {
            params: {
              token: getCookie("token"),
              id: obj.ID
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
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
}
.avatar-uploader-icon,
.avatar {
  min-width: 148px;
  height: 148px;
  line-height: 148px;
}
</style>
