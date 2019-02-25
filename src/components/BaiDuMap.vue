<template>
  <div class="box">

    <el-form :inline="true" :model="locationMsg" :rules="rules" ref="locationMsg" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="locationMsg.keyword" placeholder="地址模糊搜索" id="suggestId"></el-input>
      </el-form-item>
      <div id="l-map" style="height:350px;margin:20px 0;"></div>
      <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
      <el-form-item label="经纬度" prop="lnglat">
        <el-input v-model="locationMsg.lnglat" placeholder="鼠标左击获取经纬度" id="lnglat"></el-input>
      </el-form-item>
      <el-form-item label="所在地址" prop="address">
        <el-input v-model="locationMsg.address" placeholder="自动生成地址（可编辑）" id="address"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import bus from "../utils/bus.js"
export default {
  props: {
    mapmsg: {
      type: Object
    }
  },
  data() {
    return {
      // 百度地图经纬度
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
      },
      // 百度地图确定地址的规则
      rules: {
        lnglat: [
          {
            required: true,
            message: "请输入获取经纬度",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "根据经纬度自动生成",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 地图js
    // loadmap
    loadmap() {
      var _this = this;
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id);
      }

      var map = new BMap.Map("l-map");
      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
      // 获取原始定位点
      if (_this.locationMsg.lnglat == "") {
        // var myCity = new BMap.LocalCity();
        // myCity.get(myFun);
        // function myFun(result) {
        //   var cityName = result.name;
        //   map.setCenter(cityName);
        //   console.log(cityName);
        // }
        map.centerAndZoom("宁波", 9); // 初始化地图,设置城市和地图级别。
      } else {
        var point = new BMap.Point(
          _this.locationMsg.lnglat.split(",")[0],
          _this.locationMsg.lnglat.split(",")[1]
        );
        map.centerAndZoom(point, 9); // 初始化地图,设置城市和地图级别。
        // 给原定位点添加定位图标
        map.addOverlay(new BMap.Marker(point));
      }

      var geoc = new BMap.Geocoder();
      map.addEventListener("click", function(e) {
        var pt = e.point;
        _this.locationMsg.lnglat = pt.lng + "," + pt.lat;
        map.clearOverlays();
        map.addOverlay(new BMap.Marker(pt)); //添加标注
        geoc.getLocation(pt, function(rs) {
          var addComp = rs.address;
          if (addComp == "") {
            _this.locationMsg.address = "";
            _this.$message.error("无法获取当前位置信息");
          } else {
            _this.locationMsg.address = addComp;
          }
        });
      });
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          // console.log(local.getResults())
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 15);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    }
  },
  mounted() {
    this.locationMsg = this.mapmsg;
    this.loadmap(); //加载地图和相关组件
  }
};
</script>
<style>
.box {
  width: 100%;
  height: 100%;
}
</style>
