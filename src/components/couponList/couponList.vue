<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>招行优惠券</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        
        <el-form-item label="订单状态">
          <el-select v-model="filters.type" placeholder="订单状态">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <div style="padding:10px 0">
      已签约：{{NonCount}}
    </div>
    <el-table :data="orderList" style="width: 100%" :border='true'>
      <el-table-column label="券号" prop="CouponNo">
      </el-table-column>
      <el-table-column label="券名" prop="ActivityName">
      </el-table-column>
      <el-table-column label="促销类型" prop="Type" :formatter="Type">
      </el-table-column>
      <el-table-column label="发放数量" prop="ReceiveCount">
      </el-table-column>
      <el-table-column label="领取数量" prop="ReceiveCount">
      </el-table-column>
      <el-table-column label="使用数量" prop="UseCount">
      </el-table-column>
      <el-table-column label="启用状态" prop="IsNormal" :formatter="IsNormal">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-tickets" @click="handleLook(scope.$index, scope.row)">领取明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: [], //列表
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      NonCount:0,
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
          name: "停车券",
          value: 0
        },
        {
          name: "充值停车币",
          value: 1
        },
        {
          name: "充值月卡",
          value: 2
        },
        {
          name: "续费月卡",
          value: 3
        },
        {
          name: "余额充值",
          value: 4
        }
      ]
    };
  },
  methods: {
    Type(row, status) {
      var sex = row[status.property];
      switch (sex) {
        case -1:
          return (sex = "全部");
          break;
        case 0:
          return (sex = "停车券");
          break;
        case 1:
          return (sex = "充值停车币");
          break;
        case 2:
          return (sex = "充值月卡");
          break;
        case 3:
          return (sex = "续费月卡");
          break;
        case 4:
          return (sex = "余额充值");
          break;
        default:
          return (sex = "异常类型");
          break;
      }
    },
    IsNormal(row, status) {
      var sex = row[status.property];
      switch (sex) {
        case true:
          return (sex = "已启用");
          break;
        default:
          return (sex = "未启用");
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
        .get("api/BackCMBC/GetCouponList", {
          params: {
            token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            type: this.filters.type,
            Keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.orderList = response.data.Result.List;
              this.NonCount = response.data.Result.NonCount
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
    handleLook(index, row) {
        var obj = Object.assign({}, row);
        var SysCouponID = obj.SysCouponID;// 系统优惠券编号
        var ChannelID = obj.ChannelID; // 渠道编号
        this.$router.push("/couponList/receivedetail/id1=" + SysCouponID+"/id2="+ChannelID);
      },
  },
  mounted() {
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
</style>
