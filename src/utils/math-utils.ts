import { mat4, vec2, vec3 } from 'gl-matrix'

/**
 * 创建2D变换矩阵
 */
export function createTransformMatrix(
  position: vec2,
  rotation: number,
  scale: vec2
): mat4 {
  const matrix = mat4.create()
  
  // 应用变换顺序：平移 -> 旋转 -> 缩放
  mat4.translate(matrix, matrix, vec3.fromValues(position[0], position[1], 0))
  mat4.rotateZ(matrix, matrix, rotation)
  mat4.scale(matrix, matrix, vec3.fromValues(scale[0], scale[1], 1))
  
  return matrix
}

/**
 * 屏幕坐标转换为世界坐标
 */
export function screenToWorld(
  screenX: number,
  screenY: number,
  projectionMatrix: mat4,
  viewMatrix: mat4,
  canvasWidth: number,
  canvasHeight: number
): vec2 {
  // 将屏幕坐标归一化到[-1, 1]
  const x = (screenX / canvasWidth) * 2 - 1
  const y = -(screenY / canvasHeight) * 2 + 1
  
  // 计算视图投影矩阵的逆矩阵
  const viewProjMatrix = mat4.create()
  mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix)
  
  const invViewProjMatrix = mat4.create()
  mat4.invert(invViewProjMatrix, viewProjMatrix)
  
  // 变换到世界坐标
  const worldPos = vec4.create(x, y, 0, 1)
  vec4.transformMat4(worldPos, worldPos, invViewProjMatrix)
  
  return vec2.fromValues(worldPos[0], worldPos[1])
}

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}