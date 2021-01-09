export function setColorValue(color: string) {
  let rgba: any = { r: 0, g: 0, b: 0, a: 1 }
  if (/#/.test(color)) {
    rgba = hex2rgb(color)
  } else if (/rgb/.test(color)) {
    rgba = rgb2rgba(color)
  } else if (typeof color === 'string') {
    rgba = rgb2rgba(`rgba(${color})`)
  } else if (Object.prototype.toString.call(color) === '[object Object]') {
    rgba = color
  }
  const { r, g, b, a } = rgba
  const { h, s, v } = rgb2hsv(rgba)
  return { r, g, b, a: a === undefined ? 1 : a, h, s, v }
}
export function createAlphaSquare(size: number) {
  const canvas = document.createElement('canvas')
  const ctx: any = canvas.getContext('2d')
  const doubleSize = size * 2
  canvas.width = doubleSize
  canvas.height = doubleSize

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, doubleSize, doubleSize)
  ctx.fillStyle = '#ccd5db'
  ctx.fillRect(0, 0, size, size)
  ctx.fillRect(size, size, size, size)

  return canvas
}
export function createLinearGradient(
  direction: any,
  ctx: any,
  width: any,
  height: any,
  color1: any,
  color2: any
) {
  // l horizontal p vertical
  const isL = direction === 'l'
  const gradient = ctx.createLinearGradient(
    0,
    0,
    isL ? width : 0,
    isL ? 0 : height
  )
  gradient.addColorStop(0.01, color1)
  gradient.addColorStop(0.99, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}
export function rgb2hex({ r, g, b }: any, toUpper: boolean) {
  const change = (val: any) => ('0' + Number(val).toString(16)).slice(-2)
  const color = `#${change(r)}${change(g)}${change(b)}`
  return toUpper ? color.toUpperCase() : color
}
export function hex2rgb(hex: any) {
  hex = hex.slice(1)
  const change = (val: any) => parseInt(val, 16) || 0 // Avoid NaN situations
  return {
    r: change(hex.slice(0, 2)),
    g: change(hex.slice(2, 4)),
    b: change(hex.slice(4, 6)),
  }
}
export function rgb2rgba(rgba: any) {
  if (typeof rgba === 'string') {
    rgba = (/rgba?\((.*?)\)/.exec(rgba) || ['', '0,0,0,1'])[1].split(',')
    return {
      r: Number(rgba[0]) || 0,
      g: Number(rgba[1]) || 0,
      b: Number(rgba[2]) || 0,
      a: Number(rgba[3] ? rgba[3] : 1), // Avoid the case of 0
    }
  } else {
    return rgba
  }
}
export function rgb2hsv({ r, g, b }: any) {
  r = r / 255
  g = g / 255
  b = b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (max === min) {
    h = 0
  } else if (max === r) {
    if (g >= b) {
      h = (60 * (g - b)) / delta
    } else {
      h = (60 * (g - b)) / delta + 360
    }
  } else if (max === g) {
    h = (60 * (b - r)) / delta + 120
  } else if (max === b) {
    h = (60 * (r - g)) / delta + 240
  }
  h = Math.floor(h)
  let s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2))
  let v = parseFloat(max.toFixed(2))
  return { h, s, v }
}
