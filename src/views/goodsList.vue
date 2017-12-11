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
            <svg class="icon icon-arrow-short">
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
                      <a @click="addCart(item.produceId)" href="javascript:;" class="btn btn--m">加入购物车</a>
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
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
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
      loading: false
    }
  },
  methods: {
    getGoodsList (flag) {
      this.loading = true
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      axios.get('/goods', {
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
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },
    closePop () {
      this.filterBy = false
      this.overLayFlag = false
    },
    setPriceFilter (index) {
      this.priceChecked = index
      this.page = 1
      this.getGoodsList()
      this.closePop()
    },
    addCart (productId) {
      axios.post('/goods/addCart', {
        productId
      }).then(res => {
        if (res.data.code === 200) {
          console.log()
        }
      })
    }
  },
  mounted () {
    this.getGoodsList()
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  }
};
</script>

<style lang='stylus' scoped rel='stylesheet/stylus'>
.load-more 
  height 100px
  line-height 100px
  text-align center
</style>