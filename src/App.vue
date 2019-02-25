<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@import "../static/css/common.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
.el-container {
  width: 100%;
  height: calc(100% - 60px);
}
.el-main {
  padding: 50px 20px 15px !important;
}
.crumb {
  height: 36px;
  line-height: 36px !important;
}
/* 
弹框的层级大于百度编辑器内置弹框
解决：设置百度编辑器成绩大于2000就可以。
*/

#edui_fixedlayer {
  z-index: 8000 !important;
}
.edui-dialog {
  z-index: 9999 !important;
}
/* 面包屑 */
.el-breadcrumb__separator {
  width: 3px;
  color: #555555;
  background-color: #555555;
}
/* 列表点击查看弹框边框 */

#el-popover-2199 {
  border: 2px solid #3f3f3f !important;
}
.el-popover {
  max-height: 400px !important;
  overflow: scroll !important;
}

/* 无感支付 退款提示 */
.el-message-box__message p {
  word-break: break-all;
}

.el-autocomplete-suggestion li {
  line-height: 16px !important;
  padding: 7px 20px;
}

/* //  推广渠道 选中*/
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.sunDetail table tr:hover{
  background-color: #F5F7FA;
}
.sunDetail table td {
  border: 1px solid #ebeef5;
  padding: 12px;
  font-size: 15px;
  text-align: center;
}
/* 侧边菜单高度设置 */
.el-menu-item, .el-submenu__title{
  height: 48px;
  line-height: 48px;
}
</style>
