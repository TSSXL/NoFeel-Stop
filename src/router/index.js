  import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// 路由页面导入
import login from '@/components/Login.vue'
import home from '@/components/Home.vue'
import error from '@/components/404.vue'  //404错误
// import manage from '@/components/manage/manage.vue'
var manage = resolve => require(['@/components/manage/manage.vue'], resolve)

var role = resolve => require(['@/components/role/role.vue'], resolve)
var roleLimit = resolve => require(['@/components/role/roleLimit.vue'], resolve)
var power = resolve => require(['../components/role/power.vue'], resolve)

// 停车场设置
// 地锁
var LockList = resolve => require(['../components/parkSetting/parkLock/LockList.vue'], resolve)//
var CameraList = resolve => require(['../components/parkSetting/parkCamera/CameraList.vue'], resolve)//
// 停车场
var BackParkList = resolve => require(['../components/parkSetting/BackParkList.vue'], resolve)//停车场列表
var parkEdit = resolve => require(['../components/parkSetting/parkEdit.vue'], resolve)//编辑
var parkAdd = resolve => require(['../components/parkSetting/parkAdd.vue'], resolve)//新增
// 订单管理
var BackAppointmentOrderList = resolve => require(['@/components/order/BackAppointmentOrderList.vue'], resolve)//预约订单
var BackParkOrderList = resolve => require(['@/components/order/BackParkOrderList.vue'], resolve)//停车订单
var BalanceOrder = resolve => require(['@/components/order/BalanceOrder.vue'], resolve)//余额订单
var CardOrder = resolve => require(['@/components/order/CardOrder.vue'], resolve)//月卡充值订单
var NoSenseOrder = resolve => require(['@/components/order/NoSenseOrder.vue'], resolve) // 无感支付
var Finance = resolve => require(['@/components/order/Finance.vue'], resolve) // 财务管理，订单查询
var Summary = resolve => require(['@/components/order/Summary.vue'], resolve) // 财务管理，财务汇总
var SummaryDetail = resolve => require(['@/components/order/SummaryDetail.vue'], resolve) // 财务管理，汇总详情

// 运行管理 
//优惠券管理
var BackCouponList = resolve => require(['../components/running/BackCouponList/BackCouponList.vue'], resolve)
// 优惠券编辑
var CouponEdit = resolve => require(['../components/running/BackCouponList/CouponEdit.vue'], resolve)
var CouponAdd = resolve => require(['../components/running/BackCouponList/CouponAdd.vue'], resolve)

//月卡管理
var BackMonthCardList = resolve => require(['../components/running/BackMonthCardList/BackMonthCardList.vue'], resolve)
// 月卡编辑
var MonthCardEdit = resolve => require(['../components/running/BackMonthCardList/MonthCardEdit.vue'], resolve)
var MonthCardAdd = resolve => require(['../components/running/BackMonthCardList/MonthCardAdd.vue'], resolve)

//通知管理
var BackNoticeList = resolve => require(['../components/running/BackNoticeList/BackNoticeList.vue'], resolve)
//通知编辑
var NoticeEdit = resolve => require(['../components/running/BackNoticeList/NoticeEdit.vue'], resolve)
var NoticeAdd = resolve => require(['../components/running/BackNoticeList/NoticeAdd.vue'], resolve)
// 用户管理
var BackUserList = resolve => require(['../components/user/BackUserList.vue'], resolve)  //用户管理
var BackChangeUserList = resolve => require(['../components/user/BackChangeUserList.vue'], resolve)  //换绑管理
var FeedBackList = resolve => require(['../components/user/FeedBackList.vue'], resolve)  //换绑管理
var CarCertificationList = resolve => require(['../components/user/CarCertificationList.vue'], resolve)  //换绑管理

// 渠道管理
var ChannelList = resolve => require(['../components/BackChannelList/ChannelList.vue'], resolve)
var ChannelListEdit = resolve => require(['../components/BackChannelList/ChannelListEdit.vue'], resolve)
var ChannelListAdd = resolve => require(['../components/BackChannelList/ChannelListAdd.vue'], resolve)
// 积分管理
var IntegralRule = resolve => require(['../components/IntegralRule/IntegralRule.vue'], resolve)

// 招行核对管理
var couponList = resolve => require(['../components/couponList/couponList.vue'], resolve)
var GetReceiveDetail = resolve => require(['../components/couponList/GetReceiveDetail.vue'], resolve)
var useDetail = resolve => require(['../components/couponList/useDetail.vue'], resolve)

// 地推
var GetPromoterList = resolve => require(['../components/promoter/GetPromoterList.vue'], resolve)
var DataStatistics = resolve => require(['../components/promoter/DataStatistics.vue'], resolve)

// 发票管理
var InvoiceIndex = resolve => require(['../components/InvoiceIndex/InvoiceIndex.vue'], resolve)

// 参数设置
var Setting = resolve => require(['../components/advertising/index.vue'], resolve)

// 懒加载方式，当路由被访问的时候才加载对应组件
Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '首页',
      component: home,
      children: [
        // 404
        { path: '/error', component: error, name: '404页' },
        // manage
        { path: '/manage', component: manage, name: '管理员管理', },
        // role
        { path: '/role', component: role, name: '角色管理' },
        { path: '/power', component: power, name: '权限管理' },
        { path: '/role/rolelimit/:id', component: roleLimit, name: '权限设置' },

        // 停车场设置
        { path: '/BackParkList', component: BackParkList, name: '停车场列表' },
        { path: '/BackParkList/parkEdit/:id', component: parkEdit, name: '停车场编辑' },
        { path: '/BackParkList/parkAdd', component: parkAdd, name: '停车场添加' },
        { path: '/BackParkList/LockList/:id', component: LockList, name: '地锁列表' },
        { path: '/BackParkList/CameraList/:id', component: CameraList, name: '相机列表' },
        // order
        { path: '/BackAppointmentOrderList', component: BackAppointmentOrderList, name: '预约订单' },
        { path: '/BackParkOrderList', component: BackParkOrderList, name: '停车订单' },
        { path: '/BalanceOrder', component: BalanceOrder, name: '余额订单' },
        { path: '/CardOrder', component: CardOrder, name: '月卡订单' },
        { path: '/NoSenseOrder', component: NoSenseOrder, name: '无感支付订单' },
        { path: '/finance', component: Finance, name: '财务订单查询' },
        { path: '/Summary', component: Summary, name: '财务汇总' },
        { path: '/SummaryDetail', component: SummaryDetail, name: '汇总详情' },
        //运营管理
        { path: '/BackCouponList', component: BackCouponList, name: '优惠券管理' },
        { path: '/BackCouponList/CouponEdit/:id', component: CouponEdit, name: '优惠券编辑' },
        { path: '/BackCouponList/CouponAdd', component: CouponAdd, name: '优惠券添加' },
        // 渠道管理
        { path: '/ChannelList', component: ChannelList, name: '渠道管理' },
        { path: '/ChannelList/ChannelListEdit/:id', component: ChannelListEdit, name: '渠道编辑' },
        { path: '/ChannelList/ChannelListAdd', component: ChannelListAdd, name: '渠道添加' },

        { path: '/BackMonthCardList', component: BackMonthCardList, name: '月卡管理' },
        { path: '/BackMonthCardList/MonthCardEdit/:id', component: MonthCardEdit, name: '月卡编辑' },
        { path: '/BackMonthCardList/MonthCardAdd', component: MonthCardAdd, name: '月卡添加' },

        { path: '/BackNoticeList', component: BackNoticeList, name: '通知管理' },
        // --------通知编辑
        { path: '/BackNoticeList/NoticeEdit/:id', component: NoticeEdit, name: '通知编辑' },
        { path: '/BackNoticeList/NoticeAdd', component: NoticeAdd, name: '通知添加' },
        // 用户管理
        { path: '/BackUserList', component: BackUserList, name: '用户列表' },
        { path: '/BackChangeUserList', component: BackChangeUserList, name: '换绑管理' },
        { path: '/FeedBackList', component: FeedBackList, name: '意见反馈' },
        { path: '/CarCertificationList', component: CarCertificationList, name: '车主认证列表' },
        // 积分管理
        { path: '/IntegralRule', component: IntegralRule, name: '积分规则' },
        // 招行核对管理
        { path: '/couponList', component: couponList, name: '招行优惠券' },
        { path: '/couponList/receivedetail/:id1/:id2', component: GetReceiveDetail, name: '领取明细' },
        { path: '/couponList/usedetail/:id1/:id2', component: useDetail, name: '使用详情' },

        // 地推管理
        { path: '/DataStatistics', component: DataStatistics, name: '地推数据统计' },
        { path: '/GetPromoterList', component: GetPromoterList, name: '地推人员管理' },

        // 发票管理
        { path: '/InvoiceIndex', component: InvoiceIndex, name: '发票管理' },
        // 广告参数设置
        { path: '/setting', component: Setting, name: '参数设置' }
      ]
    },
  ]
})
