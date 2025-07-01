# 天空盒滤镜技术细节

## 概述

天空盒滤镜是一个纯视觉效果的3D场景氛围调节工具，专门设计为只影响天空盒的视觉效果，完全不影响场景中的模型和环境灯光。

## 核心技术原理

### 1. 渲染管线隔离

天空盒滤镜通过以下技术手段确保与光照系统完全隔离：

#### 材质设置
```typescript
this.filterMaterial = new THREE.ShaderMaterial({
  // 关键：禁用光照计算
  lights: false,
  
  // 禁用雾效计算
  fog: false,
  
  // 禁用阴影计算
  shadowSide: undefined,
  
  // 禁用深度写入和测试，避免与模型渲染冲突
  depthWrite: false,
  depthTest: false,
  
  // 使用透明材质
  transparent: true,
  
  // 使用背面渲染，确保正确的渲染面
  side: THREE.BackSide,
  
  // 使用正常混合模式
  blending: THREE.NormalBlending
});
```

#### 网格对象设置
```typescript
// 禁用阴影投射和接收
this.filterMesh.castShadow = false;
this.filterMesh.receiveShadow = false;

// 设置渲染顺序，确保在天空盒之后渲染
this.filterMesh.renderOrder = 1;

// 标记为纯视觉效果对象
this.filterMesh.userData = {
  isSkyboxFilter: true,
  affectsLighting: false,
  type: 'visualEffect'
};
```

### 2. 着色器设计

#### 顶点着色器
```glsl
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec2 vUv;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  
  // 计算视线方向
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDirection = normalize(viewPosition.xyz);
  
  // 计算UV坐标
  vUv = uv;
  
  gl_Position = projectionMatrix * viewPosition;
}
```

#### 片段着色器
```glsl
uniform vec3 filterColor;
uniform float intensity;
uniform float opacity;
uniform int blendMode;

varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
  // 计算基于世界位置的渐变效果
  vec3 worldPos = normalize(vWorldPosition);
  float gradient = (worldPos.y + 1.0) * 0.5;
  
  // 添加基于视线方向的微妙变化
  float viewFactor = abs(dot(worldPos, vViewDirection));
  
  // 应用滤镜颜色和强度
  vec3 filteredColor = mix(vec3(1.0), filterColor, intensity);
  
  // 根据混合模式计算最终颜色
  vec3 finalColor;
  if (blendMode == 0) {
    // multiply - 正片叠底
    finalColor = filteredColor * gradient;
  } else if (blendMode == 1) {
    // screen - 滤色
    finalColor = 1.0 - (1.0 - filteredColor) * (1.0 - gradient);
  } else if (blendMode == 2) {
    // overlay - 叠加
    finalColor = mix(
      2.0 * filteredColor * gradient,
      1.0 - 2.0 * (1.0 - filteredColor) * (1.0 - gradient),
      step(0.5, gradient)
    );
  } else {
    // normal - 正常混合
    finalColor = mix(vec3(1.0), filteredColor, gradient * intensity);
  }
  
  // 添加轻微的视线方向变化
  finalColor = mix(finalColor, finalColor * (0.9 + 0.1 * viewFactor), 0.1);
  
  // 关键：只输出颜色，不参与光照计算
  gl_FragColor = vec4(finalColor, opacity);
}
```

## 光照独立性保证

### 1. 材质层面隔离

- **`lights: false`**: 禁用材质的光照计算，确保着色器不会接收光照信息
- **`fog: false`**: 禁用雾效计算，避免与场景雾效冲突
- **`shadowSide: undefined`**: 确保不参与阴影计算

### 2. 渲染层面隔离

- **`depthWrite: false`**: 禁用深度写入，避免影响其他对象的深度测试
- **`depthTest: false`**: 禁用深度测试，确保滤镜始终渲染
- **`renderOrder: 1`**: 设置渲染顺序，确保在天空盒之后渲染

### 3. 几何体层面隔离

- **`castShadow: false`**: 禁用阴影投射
- **`receiveShadow: false`**: 禁用阴影接收
- **`side: THREE.BackSide`**: 使用背面渲染，确保正确的渲染面

## 性能优化

### 1. 几何体优化
- 使用球体几何体，分段数为32x32，平衡性能和效果
- 半径设置为1000，确保覆盖整个场景

### 2. 着色器优化
- 使用简化的着色器，减少计算开销
- 避免复杂的光照计算
- 使用高效的混合模式计算

### 3. 内存管理
- 及时销毁不需要的滤镜
- 重用材质和几何体
- 避免频繁创建和销毁

## 测试验证

### 1. 光照独立性测试
```typescript
// 检查滤镜是否影响光照
const filter = createSkyboxFilter(scene, config);
console.log(filter.isAffectingLighting()); // 应该返回 false

// 检查滤镜对象的用户数据
console.log(filterMesh.userData.affectsLighting); // 应该返回 false
```

### 2. 渲染顺序测试
```typescript
// 检查渲染顺序
console.log(filterMesh.renderOrder); // 应该返回 1

// 检查材质设置
console.log(filterMaterial.lights); // 应该返回 false
console.log(filterMaterial.depthWrite); // 应该返回 false
```

### 3. 实际效果测试
1. 开启滤镜，调整光照强度，确认模型光照不受影响
2. 调整滤镜参数，确认只影响天空盒视觉效果
3. 切换滤镜开启/关闭，确认模型光照保持不变

## 配置示例

### XML配置
```xml
<skybox-filter>
  <enabled>true</enabled>
  <color>#87CEEB</color>
  <intensity>0.8</intensity>
  <opacity>0.6</opacity>
  <blendMode>multiply</blendMode>
</skybox-filter>
```

### 代码配置
```typescript
const filterConfig = {
  enabled: true,
  color: '#87CEEB',
  intensity: 0.8,
  opacity: 0.6,
  blendMode: 'multiply'
};

const filter = createSkyboxFilter(scene, filterConfig);
filter.createFilter();
```

## 最佳实践

### 1. 使用建议
- 在需要改变场景氛围时使用
- 避免过于强烈的滤镜效果
- 根据场景主题选择合适的颜色

### 2. 性能考虑
- 在低端设备上降低强度
- 避免频繁切换滤镜
- 合理使用预设配置

### 3. 调试技巧
- 通过控制台查看滤镜对象的 `userData`
- 检查材质的光照设置
- 验证渲染顺序是否正确

## 总结

天空盒滤镜通过多层技术手段确保与光照系统完全隔离：

1. **材质层面**: 禁用所有光照相关计算
2. **渲染层面**: 使用特殊的深度和渲染设置
3. **几何体层面**: 禁用阴影和设置正确的渲染面
4. **着色器层面**: 只输出颜色，不参与光照计算

这确保了滤镜只影响天空盒的视觉效果，完全不会干扰模型和环境灯光的表现。 