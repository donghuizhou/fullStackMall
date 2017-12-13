<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">购物车</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" @click="sortGoods" class="price">
            Price 
            <svg class="icon icon-arrow-short" :class="{'sort-up': !sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="setPriceFilter('all')"><a href="javascript:void(0)" :class="{'cur': priceChecked === 'all'}">All</a></dd>
              <dd v-for="(item, index) in priceFilter" :key="item.startPrice" @click="setPriceFilter(index)">
                <a href="javascript:void(0)" :class="{'cur': priceChecked === index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item.productId">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/' + item.productImage" alt="">
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a @click="addCart(item.productId)" href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- loading -->
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20" class="load-more">
                <img src="/static/loading/loading-bubbles.svg" v-if="loading">
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @close="closePop"></div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">清闲登录，否则无法加入到购物车中</p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
        <router-link to="/cart" href="javascript:;" class="btn btn--m">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script type='text/ecmascript-6'>
// import './../assets/css/base.css'
// import './../assets/css/product.css'
import './../assets/css/custom.css'
import NavHeader from '@/components/navHeader'
import NavFooter from '@/components/navFooter'
import NavBread from '@/components/navBread'
import axios from 'axios'
import Modal from './../components/Modal.vue'

export default {
  name: '',
  data () {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '100.00'
        },
        {
          startPrice: '100.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '5000.00'
        }
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false,
      loading: false,
      mdShow: false,
      mdShowCart: false
    }
  },
  methods: {
    // 获取商品列表
    getGoodsList (flag) {
      this.loading = true
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      axios.get('/goods/list', {
        params: param
        }).then(res => {
          res = res.data
          if (res.code === 200) {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list)

              if (res.result.count === 0) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.goodsList = res.result.list
              this.busy = false
            }
          } else {
            this.goodsList = []
          }
          this.loading = false
        })
    },
    // 排序
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    // 分页
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    // 过滤框显示
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },
    // 关闭过滤框
    closePop () {
      this.filterBy = false
      this.overLayFlag = false
    },
    // 价格筛选
    setPriceFilter (index) {
      this.priceChecked = index
      this.page = 1
      this.getGoodsList()
      this.closePop()
    },
    // 加入购物车
    addCart (productId) {
      console.log(productId)
      axios.post('/goods/addCart', {
        productId: productId
      }).then(res => {
        if (res.data.code === 200) {
          this.mdShowCart = true
        } else {
          this.mdShow = true
        }
      })
    },
    // 获取modal组件的值
    closeModal (val) {
      this.mdShow = false
    }
  },
  mounted () {
    this.getGoodsList()
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  }
};
</script>

<style lang='stylus' scoped rel='stylesheet/stylus'>
.load-more 
  height 100px
  line-height 100px
  text-align center
.sort-up 
  transform: rotate(180deg)
  transition: all 0.3s ease-out
</style>