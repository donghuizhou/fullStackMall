<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <slot name="bread"></slot>
      </nav>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  export default {
    name: '',
    data () {
      return {
      }
    },
    methods: {
    },
    mounted () {
    }
  }
</script>

<style lang='stylus' scoped rel='stylesheet/stylus'>
</style>