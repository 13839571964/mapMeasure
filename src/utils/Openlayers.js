import { View, Map } from 'ol'
import { defaults } from 'ol/control'
import { fromLonLat } from 'ol/proj'

import { Tile } from 'ol/layer'
import { XYZ } from 'ol/source'
import FullScreen from 'ol/control/FullScreen'
const _defaultCenter = [120.004686, 30.297546]

export default class Openlayer {
  constructor (opts = {}) {
    this._optsOpenlayer = normalizeOpenlayerOptions(opts)
    this._map = null
    if (!this._map) this.init()
  }

  // init
  init () {
    this._map = new Map({
      ...this._optsOpenlayer,
      layers: process.env.VUE_APP_MAP_NAME === 'tianditu' ? [
        new Tile({
          source: new XYZ({
            url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=199ab58f2998947886ce67cabe5e0e20'
          })
        }),
        new Tile({
          source: new XYZ({
            url: 'https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=199ab58f2998947886ce67cabe5e0e20'
          })
        })
      ] : [
        new Tile({
          source: new XYZ({
            url:
              'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6'
          })
        }),
        new Tile({
          source: new XYZ({
            url:
              'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8'
          })
        })
      ]
    })
    this._map.addControl(new FullScreen())
    this.fullScreenClick()
  }
  fullScreenClick () {
    // 修改全屏和退出全屏时测距和测面工具栏的样式
    const domScreen = document.querySelector('.ol-full-screen.ol-control button')
    if (domScreen) {
      domScreen.addEventListener('click', function (e) {
        e.stopPropagation()
        if (domScreen.className === 'ol-full-screen-false') {
          // 进入全屏
          domScreen.style.right = '117px'
        } else if (domScreen.className === 'ol-full-screen-true') {
          // 退出全屏
          domScreen.style.right = '92px'
        }
      })
    }
  }
}

function normalizeOpenlayerOptions (opts) {
  const fmt = {
    target: opts.target,
    controls: opts.controls || defaults({ attribution: false, zoom: false, rotate: false }).extend([]),
    view: new View({
      ...(opts.center ? { center: fromLonLat(opts.center) } : { center: fromLonLat(_defaultCenter) }),
      zoom: opts.zoom || 12,
      maxZoom: opts.maxZoom || 18,
      minZoom: opts.minZoom || 8
    })
  }
  if (!fmt.target) {
    console.error(`[openlayer-component]: target 不能为空`)
  }
  return fmt
}
