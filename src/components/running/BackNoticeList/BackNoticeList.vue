<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>通知管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="productList" style="width: 100%" :border='true'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="通知简介:">
              <span>{{props.row.Brife}}</span>
            </el-form-item>
            <el-form-item label="跳转地址:">
              <span>{{props.row.Url}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="通知名称" prop="Title">
      </el-table-column>
      <el-table-column label="展示图" prop="Logo" >
        <template slot-scope="scope">
            <img :src="mainurl+scope.row.Logo" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button style="margin-bottom:10px;" size="mini"  type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
       layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      productList: [], //列表
      pageIndex: 1,
      pageSize: 5,
      pageCount: 1,
      mainurl: "",
      // 搜索关键字
      filters: {
        keyword: ""
      }
    };
  },
  methods: {
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
        .get("api/BackOperate/BackNoticeList", {
          params: {
            Token: getCookie("token"),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.filters.keyword == "" ? "-1" : this.filters.keyword
          }
        })
        .then(
          function(response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.productList = response.data.Result.list;
              this.pageCount = response.data.Result.page;
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
    //
    getUsers() {
      this.pageIndex = 1;
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    /*
        1、添加编辑
      */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      localStorage.setItem("noticeListInfo", JSON.stringify(obj));
      var urlId = obj.ID;
      this.$router.push("/BackNoticeList/NoticeEdit/id=" + urlId);
    },
    handleDelete(index, row) {
      var obj = Object.assign({}, row);
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$http
          .get("api/BackOperate/DelNotice", {
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
    handleAdd() {
      this.$router.push("/BackNoticeList/NoticeAdd");
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
</style>
