import { Overlay } from 'ol'
import { transform } from 'ol/proj'
import Measure from './measure'

export default {
  data () {
    return {
      markerArr: [], // 位置搜索数组
      isWeatherView: false,
      isLengthMeasuring: false,
      isAreaMeasuring: false,
      isTrendLengthMeasuring: false,
      weatherData: '',
      weatherLoading: false,
      drawing: false, // 是否作画中
      PI: 3.14159265358979324,
      x_PI: (3.14159265358979324 * 3000.0) / 180.0,
      a: 6378245.0,
      ee: 0.00669342162296594323,
      pointArr: [], // 添加圆点图层的经纬度集合
      addPointLayer: [], // 添加圆点图层的图层集合
      selectPointId: null, // 选中点的id
      isMousePosition: false // 控制鼠标移动展示经纬度控件
    }
  },
  methods: {
    // 静态测距
    lengthMeasure () {
      Measure.clearDraw(this.$openlayer._map)
      Measure.deleteWeather(this.$openlayer._map)
      this.$openlayer._map.removeInteraction(this.draw)
      // Measure.deleteAllLayers(this.$openlayer._map)
      this.isLengthMeasuring = true
      this.isWeatherView = false
      this.isTrendLengthMeasuring = false
      this.isAreaMeasuring = false
      this.drawing = false
      Measure.measure(this.$openlayer._map, 'LineString', () => {
        this.isLengthMeasuring = false
      })
    },
    // 测面积
    areaMeasure () {
      Measure.clearDraw(this.$openlayer._map)
      Measure.deleteWeather(this.$openlayer._map)
      this.$openlayer._map.removeInteraction(this.draw)
      // Measure.deleteAllLayers(this.$openlayer._map)
      this.isAreaMeasuring = true
      this.isWeatherView = false
      this.isTrendLengthMeasuring = false
      this.isLengthMeasuring = false
      this.drawing = false
      Measure.measure(this.$openlayer._map, 'Polygon', () => {
        this.isAreaMeasuring = false
      })
    },
    // 1.2.2版本modify
    weatherViewAdd (midValue) {
      const weatherIcon = this.$refs['weather-move-icon']
      weatherIcon.onclick = (e) => {
        if (this.isWeatherView) {
            this.weatherData = []
            this.weatherLoading = true
            const coordinate = midValue
            const dealCoordinates = this.transform3857to4326(coordinate[0], coordinate[1])
            this.getSelectedWeather(dealCoordinates[0], dealCoordinates[1])
            const markerTool = new Overlay({
              element: this.$refs['weather-icon'],
              positioning: 'center-center',
              offset: [0, 0],
              stopEvent: false
            })
            this.$openlayer._map.addOverlay(markerTool)
            markerTool.setPosition(coordinate)
        }
      }
      weatherIcon.onmousedown = () => {
        this.mousedownUpIcon = 'touchDown'
      }
      weatherIcon.onmouseup = () => {
        this.mousedownUpIcon = 'normalMove'
      }
    },
    transform3857to4326 (lon, lat) {
      return transform([lon, lat], 'EPSG:3857', 'EPSG:4326')
    },
    gcj02towgs84 (lng, lat) {
      if (this.out_of_china(lng, lat)) {
        return [lng, lat]
      } else {
        var dlat = this.transformlat(lng - 105.0, lat - 35.0)
        var dlng = this.transformlng(lng - 105.0, lat - 35.0)
        var radlat = (lat / 180.0) * this.PI
        var magic = Math.sin(radlat)
        magic = 1 - this.ee * magic * magic
        var sqrtmagic = Math.sqrt(magic)
        dlat = (dlat * 180.0) / (((this.a * (1 - this.ee)) / (magic * sqrtmagic)) * this.PI)
        dlng = (dlng * 180.0) / ((this.a / sqrtmagic) * Math.cos(radlat) * this.PI)
        const mglat = lat + dlat
        const mglng = lng + dlng
        return [lng * 2 - mglng, lat * 2 - mglat]
      }
    },
    transformlat (lng, lat) {
      var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
      ret += ((20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0) / 3.0
      ret += ((20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin((lat / 3.0) * this.PI)) * 2.0) / 3.0
      ret += ((160.0 * Math.sin((lat / 12.0) * this.PI) + 320 * Math.sin((lat * this.PI) / 30.0)) * 2.0) / 3.0
      return ret
    },
    transformlng (lng, lat) {
      var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
      ret += ((20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0) / 3.0
      ret += ((20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin((lng / 3.0) * this.PI)) * 2.0) / 3.0
      ret += ((150.0 * Math.sin((lng / 12.0) * this.PI) + 300.0 * Math.sin((lng / 30.0) * this.PI)) * 2.0) / 3.0
      return ret
    },
    out_of_china (lng, lat) {
      return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
    },
    positionPoint (val) {
      this.$nextTick(() => {
        for (let i = 0; i < val.length; i++) {
          if (i === 0) {
            // 设置中心点为查到的地址
            this.$openlayer._map.getView().animate({
              // 只设置需要的属性即可
              center: this.transform4326to3857(...this.gcj02towgs84(val[i].location.lng, val[i].location.lat)), // 中心点
              zoom: 11,
              maxZoom: 18,
              minZoom: 8
              // 缩放级别
              // rotation: undefined, // 缩放完成view视图旋转弧度
              // duration: 1000 // 缩放持续时间
            })
          }
          const markerTool = new Overlay({
            element: this.$refs[`marker${i}`][0],
            offset: [-15, -15],
            positioning: 'center-center'
          })
          this.$openlayer._map.addOverlay(markerTool)
          markerTool.setPosition(this.transform4326to3857(120.20836720173094, 30.293519114064654))
          markerTool.setPosition(
            this.transform4326to3857(
              this.gcj02towgs84(val[i].location.lng, val[i].location.lat)[0],
              this.gcj02towgs84(val[i].location.lng, val[i].location.lat)[1]
            )
          )
        }
      })
    },
    clearToolsStatus () {
      Measure.clearDraw(this.$openlayer._map)
      Measure.deleteWeather(this.$openlayer._map)
      Measure.deleteAllLayers(this.$openlayer._map)
      Measure.clearToolTip(this.$openlayer._map)
      this.isAreaMeasuring = false
      this.isWeatherView = false
      this.isTrendLengthMeasuring = false
      this.isLengthMeasuring = false
      this.weatherData = ''
    },
    clearSelectLauer (val) {
      // 在其他操作的时候清除select图层，再其他操作结束继续可选select
      if (val) {
        if (this.toggleSelectClick) this.$openlayer._map.removeInteraction(this.toggleSelectClick)
        if (this.dragSelect) this.$openlayer._map.removeInteraction(this.dragSelect)
        this.hasSelectedArr = []
        this.leftExtend = false
        this.rightExtend = false
        this.panelExtend = false
        if (this.choosing) {
          this.choosing = false
          this.$openlayer._map.removeControl(this.pointOverlay[this.stepArr[this.step]].mousePositionControl)
          this.$openlayer._map.un('singleclick', this.pointOverlay[this.stepArr[this.step]].singleclickControl)
          this.pointOverlay[this.stepArr[this.step]].show = false
        }
      } else {
        this.toggleSelect()
        this.dragBoxSelect()
      }
    }
    /** ************************** 添加的工具栏 **********************************/
  }
}
