import Vue from 'vue'
import Router from 'vue-router'
import i18n from '../language/index'
import {getUserInfo} from 'common/js/storage'

// 懒加载路由模块导入
const Login = () => import('components/login/login')
const CLogin = () => import('components/c-login/c-login')
const CMine = () => import('components/c-mine/c-mine')
const CDetail = () => import('components/c-detail/c-detail')
const CModifyPwd = () => import('components/c-modify-pwd/c-modify-pwd')
const CPurchase = () => import('components/c-purchase/c-purchase')
const CPurchaseRecord = () => import('components/c-purchase-record/c-purchase-record')
const CRedeemRecord = () => import('components/c-redeem-record/c-redeem-record')
const CSetting = () => import('components/c-setting/c-setting')
const Mine = () => import('components/mine/mine')
const Notice = () => import('components/notice/notice')
const NoticeItem = () => import('components/notice-item/notice-item')
const NoticeDetail = () => import('components/notice-detail/notice-detail')
const Purchase = () => import('components/purchase/purchase')
const ProductDetail = () => import('components/product-detail/product-detail')
const TransferApply = () => import('components/transfer-apply/transfer-apply')
const TransferRecord = () => import('components/transfer-record/transfer-record')
const PurchaseRecord = () => import('components/purchase-record/purchase-record')
const AddApply = () => import('components/add-apply/add-apply')
const EditApply = () => import('components/edit-apply/edit-apply')
const ModifyAdditional = () => import('components/modify-additional/modify-additional')
const RedeemRecord = () => import('components/redeem-record/redeem-record')
const Redeem = () => import('components/redeem/redeem')
const ProductPlan = () => import('components/product-plan/product-plan')
const ModifyPlan = () => import('components/modify-plan/modify-plan')
const Question = () => import('components/question/question')
const QuestionDetail = () => import('components/question-detail/question-detail')
const Setting = () => import('components/setting/setting')
const ModifyPwd = () => import('components/modify-pwd/modify-pwd')
const Management = () => import('components/management/management')
const PreviewContract = () => import('components/preview-contract/preview-contract')
const SignContract = () => import('components/sign-contract/sign-contract')
const Weixin = () => import('components/weixin/weixin')
const NoFound = () => import('components/no-found/no-found')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      meta: {
        requireAuth: true
      },
      component: Mine
    },
    {
      path: '/c-mine',
      meta: {
        requireAuth: true
      },
      component: CMine
    },
    {
      path: '/c-detail',
      meta: {
        requireAuth: true
      },
      component: CDetail
    },
    {
      path: '/c-modify-pwd',
      meta: {
        requireAuth: true
      },
      component: CModifyPwd
    },
    {
      path: '/c-purchase',
      meta: {
        requireAuth: true
      },
      component: CPurchase
    },
    {
      path: '/c-purchase-record',
      meta: {
        requireAuth: true
      },
      component: CPurchaseRecord
    },
    {
      path: '/c-redeem-record',
      meta: {
        requireAuth: true
      },
      component: CRedeemRecord
    },
    {
      path: '/c-setting',
      meta: {
        requireAuth: true
      },
      component: CSetting
    },
    {
      path: '/c-login',
      name: 'c-login',
      component: CLogin
    },
    {
      path: '/login/:lang',
      name: 'login',
      component: Login
    },
    {
      path: '/:lang',
      name: 'mine',
      meta: {
        requireAuth: true
      },
      component: Mine
    },
    {
      path: '/notice/:lang',
      name: 'notice',
      meta: {
        requireAuth: true
      },
      component: Notice
    },
    {
      path: '/notice-item/:id/:lang',
      meta: {
        requireAuth: true
      },
      component: NoticeItem
    },
    {
      path: '/notice-detail/:lang',
      name: 'noticeDetail',
      meta: {
        requireAuth: true
      },
      component: NoticeDetail
    },
    {
      path: '/purchase/:lang',
      name: 'purchase',
      meta: {
        requireAuth: true
      },
      component: Purchase
    },
    {
      path: '/product-detail/:lang',
      name: 'productDetail',
      meta: {
        requireAuth: true
      },
      component: ProductDetail
    },
    {
      path: '/transfer-apply/:lang',
      name: 'transferApply',
      meta: {
        requireAuth: true
      },
      component: TransferApply
    },
    {
      path: '/transfer-record/:lang',
      name: 'transferRecord',
      meta: {
        requireAuth: true
      },
      component: TransferRecord
    },
    {
      path: '/purchase-record/:lang',
      name: 'purchaseRecord',
      meta: {
        requireAuth: true
      },
      component: PurchaseRecord
    },
    {
      path: '/add-apply/:lang',
      name: 'addApply',
      meta: {
        requireAuth: true
      },
      component: AddApply
    },
    {
      path: '/edit-apply/:lang',
      name: 'editApply',
      meta: {
        requireAuth: true
      },
      component: EditApply
    },
    {
      path: '/modify-additional/:lang',
      name: 'modifyAdditional',
      meta: {
        requireAuth: true
      },
      component: ModifyAdditional
    },
    {
      path: '/redeem-record/:lang',
      name: 'redeemRecord',
      meta: {
        requireAuth: true
      },
      component: RedeemRecord
    },
    {
      path: '/redeem/:lang',
      name: 'redeem',
      meta: {
        requireAuth: true
      },
      component: Redeem
    },
    {
      path: '/product-plan/:lang',
      name: 'productPlan',
      meta: {
        requireAuth: true
      },
      component: ProductPlan
    },
    {
      path: '/modify-plan/:lang',
      name: 'modifyPlan',
      meta: {
        requireAuth: true
      },
      component: ModifyPlan
    },
    {
      path: '/question/:lang',
      name: 'question',
      meta: {
        requireAuth: true
      },
      component: Question
    },
    {
      path: '/question-detail/:lang',
      name: 'questionDetail',
      meta: {
        requireAuth: true
      },
      component: QuestionDetail
    },
    {
      path: '/setting/:lang',
      name: 'setting',
      meta: {
        requireAuth: true
      },
      component: Setting
    },
    {
      path: '/modify-pwd/:lang',
      name: 'modifyPwd',
      meta: {
        requireAuth: true
      },
      component: ModifyPwd
    },
    {
      path: '/management/:lang',
      name: 'management',
      meta: {
        requireAuth: true
      },
      component: Management
    },
    {
      path: '/preview-contract/:lang',
      meta: {
        requireAuth: true
      },
      component: PreviewContract
    },
    {
      path: '/sign-contract/:lang',
      meta: {
        requireAuth: true
      },
      component: SignContract
    },
    {
      path: '/weixin/:lang',
      name: 'weixin',
      component: Weixin
    },
    {
      path: '*',
      name: 'noFound',
      component: NoFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (getUserInfo().id) {
      next()
    } else {
      next({
        path: '/login/' + i18n.locale
      })
    }
  } else {
    next()
  }
})

export default router
