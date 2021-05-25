<template>
  <div class="wrap">
    <div class="map-container-wrap">
      <OpenlayersMap />
    </div>
  </div>
</template>
<script>
import OpenlayersMap from '@/components/Openlayers'
export default {
  name: 'HelloWorld',
  components: {
    OpenlayersMap
  }
}
</script>

<style lang="less" scoped>
  .map-container-wrap{
    display: flex;
    flex-direction: column;
    height: 100vh;
    border-radius: 4px;
    background: #fff;
  }
</style>
