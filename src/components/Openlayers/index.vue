<template>
  <div class="airspace-container">
    <div ref="map" id="mapContainer">
      <!-- 工具栏 -->
      <div class="tool-wrap">
        <div class="tools">
          <div class="item">
            <div ref="lengthMeasure" @click="lengthMeasure">
              <span class="text" :class="{ active: isLengthMeasuring }">静态测距</span>
            </div>
          </div>
          <div class="item">
            <div ref="areaMeasure" @click="areaMeasure">
              <span class="text" :class="{ active: isAreaMeasuring }">测面</span>
            </div>
          </div>
          <div class="item item_screen">
            <div style="display: flex; align-items: center; width: 50px">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 需要注意：
 * ** 该地图组件在使用的时候，包裹该组件的父元素高度不能使用flex:1等模糊高度
 * ** 但是可以使用具体的高度数值或者可以直接拿到高度的百分比数值，比如：100px或者100vh或者通过calc计算出来的高度值
 * 如果需要增加地图上的功能，请使用props接收参数来控制该功能是否生效
 */
import Openlayer from '@/utils/Openlayers'
import MapToolMixin from './js/mapTool.mixin' // 使用工具栏混入
import Vue from 'vue'
export default {
  name: 'Openlayers',
  mixins: [MapToolMixin],
  data () {
    return {
      loading: false // 控制加载动画显示隐藏
    }
  },
  mounted () {
    const _self = this
    // const popupEl = this.$refs['popup']
    const openlayer = new Openlayer({
      target: _self.$refs.map
    })
    Vue.prototype.$openlayer = openlayer // 全局注册对象
    // 所有图层加载完毕之后执行
    openlayer._map.once('rendercomplete', (event) => {
      // _self.initData()
      // _self.queryGridData()
      // _self.$openlayer.initOverlay(popupEl)
      // _self.$emit('created', this.$openlayer)
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/mapTool.less';
.airspace-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  #mapContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    .shadow {
      height: 100px;
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(180deg, rgba(17, 23, 19, 0) 0%, #131814 100%);
      border-radius: 0px 0px 4px 4px;
      z-index: 20;
      pointer-events: none;
    }
    .legend-container {
      position: absolute;
      bottom: 24px;
      right: 40px;
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      display: flex;
      align-items: center;
      pointer-events: none;
      z-index: 50;

      .legend-item {
        display: flex;
        align-items: center;
        margin-left: 20px;
        i {
          display: inline-block;
          width: 20px;
          height: 20px;
        }
        i.error {
          background: rgba(255, 103, 77, 0.5);
        }
        i.success {
          background: rgba(41, 222, 186, 0.5);
        }
        i.warning {
          background: rgba(237, 216, 80, 0.5);
        }

        span {
          padding: 0 10px;
        }
      }
    }
  }
}

</style>
