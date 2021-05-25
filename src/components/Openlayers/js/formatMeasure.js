
import {
  getArea,
  getLength
} from 'ol/sphere.js'

export const formatLength = function (map, line) {
  // 获取投影坐标系
  var sourceProj = map.getView().getProjection()
  // ol/sphere里有getLength()和getArea()用来测量距离和区域面积，默认的投影坐标系是EPSG:3857, 其中有个options的参数，可以设置投影坐标系
  var length = getLength(line, { projection: sourceProj })
  // var length = getLength(line);
  var output
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) +
      ' ' + '公里'
  } else {
    output = (Math.round(length * 100) / 100) +
      ' ' + '米'
  }
  return output
}

export const formatArea = function (map, polygon) {
  // 获取投影坐标系
  var sourceProj = map.getView().getProjection()
  var area = getArea(polygon, { projection: sourceProj })
  // var area = getArea(polygon);
  // console.info(area)
  var output
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) +
    ' ' + '平方公里'
      // ' ' + 'km<sup>2</sup>'
  } else {
    output = (Math.round(area * 100) / 100) +
    ' ' + '平方米'
      // ' ' + 'm<sup>2</sup>'
  }
  return output
}

export const setToolStyle = (measureTooltipElement) => {
  measureTooltipElement.style.color = '#C3C5C9'
  measureTooltipElement.style.padding = '0 10px'
  measureTooltipElement.style.height = '25px'
  measureTooltipElement.style.lineHeight = '25px'
  measureTooltipElement.style.background = '#1A1A1B'
  measureTooltipElement.style.fontSize = '15px'
  measureTooltipElement.style.fontWeight = '400'
}
