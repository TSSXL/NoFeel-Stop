<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/ChannelList' }">推广渠道</el-breadcrumb-item>
        <el-breadcrumb-item>渠道信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="规则名称：" prop="ActivityName">
          <el-input v-model="editForm.ActivityName" style="width:200px;" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="领取方式：" prop="ReceiveType">
          <el-select v-model="editForm.ReceiveType" placeholder="请选择领取方式">
            <el-option v-for="item in ReceiveTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select> 
        </el-form-item>-->
        <el-form-item label="是否启用：" prop="IsClose">
          <el-radio v-model="editForm.IsClose" label="0">是</el-radio>
          <el-radio v-model="editForm.IsClose" label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="活动时间：" prop="ActivityTime">
          <el-date-picker v-model="editForm.ActivityTime" value-format="yyyy-MM-dd" type="daterange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券：" prop="addValue">
          <div style="float:right;margin-right:20%;top:0px;cursor: pointer;">

          </div>
          <div class="addList">
            启用
            <input class="checkout" type="checkbox" v-model="editForm.addValue.Checked">
            <!-- <el-checkbox v-model="editForm.addValue.Checked"></el-checkbox> -->
            <el-autocomplete v-model="editForm.addValue.CouponNo" :fetch-suggestions="querySearch" placeholder="请检索选择" @select="handleSelect">
              <template slot-scope="{ item }">
                <div class="name" style="text-overflow: ellipsis; overflow: hidden;">{{ item.ActivityName }}</div>
                <span class="orderno" style="font-size: 12px; color: #ddd;">{{ item.CouponNo }}</span>
              </template>
            </el-autocomplete>
            <el-button @click="addDomain" type="primary" icon="el-icon-circle-plus" style="cursor: pointer;" plain>点击添加</el-button>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div class="addList" v-for="(item, index) in editForm.domains" :key="index">
            启用
            <input class="checkout" type="checkbox" v-model="item.Checked">
            <el-input v-model="item.ActivityName" style="width:200px;" disabled></el-input>
            <el-button round @click="handleSend(item.CouponNo)">立即发放</el-button>
            <!-- <el-button round type="text" @click="dialogTableVisible = true">明细</el-button> -->
            <!-- <el-button round type="text">明细</el-button>             -->
            <i v-if="quanNum>0" class="el-icon-remove" style="cursor: pointer;" @click.prevent="removeDomain(item)"></i>
          </div>
        </el-form-item>
        <el-dialog title="发放" :visible.sync="dialogSend" >
          <el-form :model="sendForm" :rules="sendRules"  ref="sendForm" label-width="110px" label-position="right">
             <el-form-item label="优惠券编号" prop="CouponNo">
                <el-input  v-model="sendForm.CouponNo" style="width:300px;" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="发放人手机号" prop="Phone">
              <el-input type="textarea" v-model="sendForm.Phone" style="width:300px;" auto-complete="off" placeholder="例：（1xxxxxx,1xxxxx,1xxxxxx）"></el-input>
            </el-form-item>
          <span style="margin-left:110px;">若用户过多可选择直接导入</span>
            
          <el-upload style="margin-left:110px;" :limit="1" class="upload-demo"
            :action="actionUser" :on-remove="handleRemoveUser" :on-success="handleExceedUser">
            <el-button size="small" type="primary">点击导入指定用户</el-button>
          </el-upload>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSend = false">取 消</el-button>
            <el-button type="primary" @click.native="sendSubmit">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="明细" :visible.sync="dialogTableVisible">
          <el-table :data="DetailData">
            <el-table-column property="date" label="日期" width="200"></el-table-column>
            <el-table-column label="姓名" width="200">
              <template slot-scope="scope">
                <el-popover ref="popover4" placement="right" width="500" trigger="click">
                  <el-table :data="DetailData">
                    <el-table-column property="date" label="日期" width="150"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                    <el-table-column property="address" label="地址" width="200"></el-table-column>
                  </el-table>
                  <span slot="reference" @click="detailClickName(scope.row.ParkID)">{{scope.row.name}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="订单">
              <template slot-scope="scope">
                <el-popover ref="popover4" placement="right" width="500" trigger="click">
                  <el-table :data="DetailData">
                    <el-table-column property="date" label="日期" width="150"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                    <el-table-column property="address" label="地址" width="200"></el-table-column>
                  </el-table>
                  <span slot="reference" @click="detailClickOrder(scope.row.ParkID)">{{scope.row.order}}</span>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
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
      actionUser: "",
      dialogImageUrl: "",
      dialogTableVisible: false, // 明细
      dialogSend: false, // 发放
      allCoupon: [], // 所以的优惠券列表
      restaurants: [],
      // 编辑表单
      editForm: {
        ActivityName: "", //名称
        ActivityTime: "", //时间 ,
        IsClose: "1", //  1为否
        state3: "",
        addValue: {},
        domains: [],
        // 是否点击选择了
        isCheck: false
      },
      // 发放表单
      sendForm: {
        Phone: "",
        CouponNo: "",
        ChannelID: ""
      },
      sendRules: {
        CouponNo: [
          {
            required: true,
            message: "请输入",
            trigger: "change"
          }
        ],
        Phone: [
          {
            required: true,
            message: "请输入发放人",
            trigger: "change"
          }
        ]
      },
      // 用户领取列表
      ReceiveTypeList: [
        {
          name: "用户领取",
          value: 0
        },
        {
          name: "指定用户领取",
          value: 1
        }
      ],
      timeout: null,
      // 券额度数量
      quanNum: 0,
      // 明细列表
      DetailData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          order: "订单1号"
        }
      ],
      // 验证规则
      rules: {
        ActivityName: [
          {
            required: true,
            message: "请输入规则名称",
            trigger: "change"
          }
        ],
        ReceiveType: [
          {
            required: true,
            message: "请选择领取方式",
            trigger: "blur"
          }
        ],
        ActivityTime: [
          {
            required: true,
            message: "请选择活动时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //新增 删除  券
    addDomain() {
      console.log(this.editForm.addValue);
      if (this.editForm.addValue.CouponNo == undefined) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择正确的优惠券"
        });
      } else {
        // 判断已选择的数组中是否包含即将选择的元素
        if (
          JSON.stringify(this.editForm.domains).indexOf(
            JSON.stringify(this.editForm.addValue.CouponNo)
          ) > 0
        ) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "请不要重新添加优惠券"
          });
        } else {
          this.quanNum++;
          this.editForm.domains.unshift(this.editForm.addValue);
          this.editForm.addValue = {};
        }
      }
    },
    removeDomain(item) {
      // item表示的是删除的哪一个具体的数据
      this.quanNum--;
      var index = this.editForm.domains.indexOf(item);
      if (index !== -1) {
        this.editForm.domains.splice(index, 1);
      }
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            var infoObj = Object.assign({}, this.editForm);
            var para = {};
            // 将token传入参数中
            para.Token = getCookie("token");
            para.StartTime = infoObj.ActivityTime[0];
            para.EndTime = infoObj.ActivityTime[1];
            para.IsClose = infoObj.IsClose == "1" ? false : true;
            para.ChannelID = infoObj.ChannelID;
            if (this.editForm.domains.length < 1) {
              para.CouponID = "-1";
            } else {
              var arr = [];
              for (let j = 0; j < this.editForm.domains.length; j++) {
                const itemele = this.editForm.domains[j];

                // true为1  false 为0
                var item =
                  itemele.CouponNo + "," + (itemele.Checked ? "1" : "0");
                arr.push(item);

                para.CouponID = arr.join("|");
              }
            }
            // 发保存请求
            this.$http
              .post("api/BackChannel/EditChannel", qs.stringify(para))
              .then(
                function(response) {
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$router.push({
                      path: "/ChannelList"
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
                    message: "错误：请检查网络0"
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
    /* 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //  所有检索数据
    loadAll() {
      this.$http
        .get("api/BackChannel/GetCouponList")
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.allCoupon = response.data.Result;
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
      // return [
      //   { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
      //   {
      //     value: "Hot honey 首尔炸鸡（仙霞路）",
      //     address: "上海市长宁区淞虹路661号"
      //   }
      // ];
    },
    querySearch(queryString, cb) {
      var restaurants = this.allCoupon;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.CouponNo.toLowerCase().indexOf(
            queryString.toLowerCase()
          ) === 0
        );
      };
    },
    // 检索后选择
    handleIconClick(ev) {
      console.log(ev);
    },
    handleSelect(item) {
      // this.editForm = item
      this.editForm.addValue.ActivityName = item.ActivityName;
      this.editForm.addValue.CouponNo = item.CouponNo;
      this.editForm.addValue.ID = item.ID;
      this.editForm.addValue.Checked = true;
    },
    // 立即发放
    handleSend(id) {
      this.dialogSend = true;
      this.sendForm.CouponNo = id;
    },
    sendSubmit() {
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            var para = Object.assign({}, this.sendForm);
            // 将token传入参数中
            para.Token = getCookie("token");
            // 发保存请求
            this.$http
              .post("api/BackChannel/ImmediateRelease", qs.stringify(para))
              .then(
                function(response) {
                  loading.close();
                  this.editLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["sendForm"].resetFields();
                    this.dialogSend = false;
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
                  loading.close();
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
    // 上传用户文件
    handleExceedUser(response, file, fileList) {
      this.sendForm.Phone = response.Result;
    },
    handleRemoveUser(file, fileList) {
      this.sendForm.Phone = "";
    },
    detailClickName(e) {},
    detailClickOrder(e) {}
  },
  beforeMount() {
    var channelInfo = JSON.parse(localStorage.getItem("ChannelInfo"));
    this.editForm.ActivityName = channelInfo.Name;
    this.editForm.IsClose = channelInfo.IsClose ? "0" : "1";
    this.editForm.ActivityTime = [channelInfo.StartTime, channelInfo.EndTime];
    this.editForm.ChannelID = channelInfo.ID;
    this.sendForm.ChannelID = channelInfo.ID;
    this.editForm.domains = channelInfo.CouponList;
    this.quanNum = this.editForm.domains.length;
    this.loadAll();
  },
  mounted() {
    this.$refs["editForm"].resetFields();
    this.allCoupon = this.loadAll();
    this.actionUser = mainurl + "/api/BackOperate/CoUserExport";
  }
};
</script>
<style scoped>
.is-controls-right {
  float: right;
  margin-right: 50%;
}

.addList {
  margin-bottom: 10px;
}

.searchPark {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.el-popover__reference {
  color: #409eff;
}
</style>
