# 天空盒滤镜光照隔离改进

## 问题描述

在之前的天空盒滤镜实现中，滤镜效果可能会影响场景中模型的光照效果，导致模型的光照表现不自然。

## 解决方案

通过以下技术手段确保天空盒滤镜只影响天空盒的视觉效果，不影响模型的光照：

### 1. 材质设置优化

在 `skyboxFilter.ts` 中，对滤镜材质进行了以下关键设置：

```typescript
this.filterMaterial = new THREE.ShaderMaterial({
  // 关键设置：确保不影响光照计算
  lights: false,
  // 禁用所有光照相关计算
  fog: false,
  // 设置为纯视觉效果材质
  blending: THREE.NormalBlending,
  // 确保不参与阴影计算
  shadowSide: undefined,
  // 禁用深度写入和测试
  depthWrite: false,
  depthTest: false,
  // 设置为透明材质
  transparent: true,
  // 使用背面渲染
  side: THREE.BackSide
});
```

### 2. 网格对象设置

对滤镜网格对象进行了特殊标记：

```typescript
// 禁用阴影相关设置
this.filterMesh.castShadow = false;
this.filterMesh.receiveShadow = false;

// 设置用户数据，标记为滤镜对象
this.filterMesh.userData = {
  isSkyboxFilter: true,
  affectsLighting: false
};
```

### 3. 渲染顺序控制

确保滤镜在正确的时机渲染：

```typescript
// 设置渲染顺序，确保在天空盒之后渲染，在模型之前渲染
this.filterMesh.renderOrder = 1;
```

### 4. 着色器优化

在片段着色器中，确保滤镜只影响颜色输出，不参与光照计算：

```glsl
// 应用滤镜颜色和强度
vec3 filteredColor = mix(vec3(1.0), filterColor, intensity);

// 根据混合模式计算最终颜色
vec3 finalColor;
// ... 混合模式计算 ...

// 只输出颜色，不参与光照计算
gl_FragColor = vec4(finalColor, opacity);
```

## 技术特点

### 1. 光照隔离
- 使用 `lights: false` 禁用材质的光照计算
- 设置 `shadowSide: undefined` 避免参与阴影计算
- 通过 `userData` 标记对象类型，便于识别和管理

### 2. 渲染优化
- 使用 `depthWrite: false` 和 `depthTest: false` 避免深度冲突
- 设置 `side: THREE.BackSide` 确保正确的渲染面
- 控制渲染顺序，避免与模型渲染冲突

### 3. 性能优化
- 滤镜材质使用简化的着色器，减少计算开销
- 避免不必要的光照和阴影计算
- 使用透明混合，支持实时调整

## 使用效果

### 改进前
- 滤镜可能影响模型的光照效果
- 模型在滤镜开启时可能出现不自然的光照
- 光照强度调整可能被滤镜干扰

### 改进后
- 滤镜只影响天空盒的视觉效果
- 模型的光照效果完全独立，不受滤镜影响
- 可以独立调整滤镜参数和光照参数
- 支持实时切换滤镜，不影响模型表现

## 测试验证

创建了专门的测试组件 `SkyboxFilterExample.vue` 来验证改进效果：

1. **滤镜控制测试**：调整滤镜参数，观察是否影响模型光照
2. **光照独立测试**：调整光照强度，确认模型光照响应正常
3. **实时切换测试**：开启/关闭滤镜，验证模型光照保持不变

## 配置示例

在 XML 配置文件中，天空盒滤镜配置如下：

```xml
<skyboxFilter>
  <enabled>true</enabled>
  <color>#87CEEB</color>
  <intensity>0.8</intensity>
  <opacity>0.6</opacity>
  <blendMode>multiply</blendMode>
</skyboxFilter>
```

## 注意事项

1. **性能考虑**：滤镜会增加渲染开销，建议在需要时启用
2. **兼容性**：确保Three.js版本支持相关材质属性
3. **调试**：可以通过控制台查看滤镜对象的 `userData` 进行调试

## 总结

通过以上技术改进，天空盒滤镜现在完全独立于模型光照系统，只影响天空盒的视觉效果，不会干扰模型的光照表现。这确保了场景中模型的光照效果始终自然和准确，同时提供了丰富的天空盒滤镜效果。 