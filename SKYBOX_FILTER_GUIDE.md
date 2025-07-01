# 天空盒滤镜使用指南

## 概述

天空盒滤镜是一个纯视觉效果的3D场景氛围调节工具，可以通过改变天空的颜色、强度、透明度和混合模式来创建不同的视觉效果，从而改变整个3D场景的视觉氛围。**重要：此滤镜只影响天空盒的视觉效果，不会改变场景中的灯光和光照系统。**

## 功能特性

### 1. 基础控制
- **启用/禁用**: 通过开关控制滤镜的开启和关闭
- **颜色选择**: 支持任意颜色选择，包括透明度调节
- **强度调节**: 控制滤镜效果的强度 (0-1)
- **透明度**: 控制滤镜的透明度 (0-1)
- **混合模式**: 支持多种混合效果

### 2. 混合模式
- **正片叠底 (multiply)**: 使颜色变暗，适合夜晚或阴天效果
- **滤色 (screen)**: 使颜色变亮，适合阳光或明亮效果
- **叠加 (overlay)**: 增强对比度，适合戏剧性效果
- **正常 (normal)**: 简单的颜色混合

### 3. 预设滤镜
- **蓝天**: 清新的蓝天效果，适合白天场景
- **夕阳**: 温暖的橙红色调，适合黄昏场景
- **夜晚**: 深蓝色调，适合夜晚场景
- **雾霾**: 灰白色调，适合雾天效果
- **温暖**: 金黄色调，适合温暖氛围

## 配置文件

### XML配置结构
```xml
<skybox-filter>
    <enabled>true</enabled>
    <color>#87CEEB</color>
    <intensity>0.8</intensity>
    <opacity>0.6</opacity>
    <blendMode>multiply</blendMode>
</skybox-filter>
```

### 配置参数说明
- `enabled`: 是否启用天空盒滤镜 (true/false)
- `color`: 滤镜颜色，支持十六进制颜色值
- `intensity`: 滤镜强度，范围 0-1
- `opacity`: 滤镜透明度，范围 0-1
- `blendMode`: 混合模式 (multiply/screen/overlay/normal)

## 使用方法

### 1. 通过配置文件
在 `public/config/scene-config.xml` 中添加天空盒滤镜配置：

```xml
<skybox-filter>
    <enabled>true</enabled>
    <color>#FF6B35</color>
    <intensity>0.7</intensity>
    <opacity>0.5</opacity>
    <blendMode>overlay</blendMode>
</skybox-filter>
```

### 2. 通过代码控制
```typescript
import { createSkyboxFilter, SkyboxFilterPresets } from '@/utils/threeUtils/skyboxFilter'

// 创建滤镜
const filter = createSkyboxFilter(scene, {
    enabled: true,
    color: '#87CEEB',
    intensity: 0.8,
    opacity: 0.6,
    blendMode: 'multiply'
})

// 应用预设
filter.updateFilter(SkyboxFilterPresets.sunset)

// 动态调整
filter.setColor('#FF6B35')
filter.setIntensity(0.7)
filter.setOpacity(0.5)
filter.setBlendMode('overlay')
```

### 3. 通过控制面板
使用 `SkyboxFilterPanel` 组件进行可视化控制：

```vue
<template>
  <skybox-filter-panel :three-instance="threeInstance" />
</template>

<script setup>
import SkyboxFilterPanel from '@/components/skyboxFilterPanel.vue'
</script>
```

## 技术实现

### 着色器原理
天空盒滤镜使用自定义着色器实现，通过以下步骤：

1. **顶点着色器**: 计算世界坐标位置和视线方向
2. **片段着色器**: 
   - 基于世界位置计算渐变效果
   - 应用滤镜颜色和强度
   - 根据混合模式计算最终颜色
   - 添加基于视线方向的微妙变化
   - 应用透明度

### 光照独立性
- **纯视觉效果**: 滤镜使用 `lights: false` 设置，确保不参与光照计算
- **渲染顺序**: 设置 `renderOrder = 1`，确保在天空盒之后渲染
- **材质特性**: 使用 `depthWrite: false` 和 `depthTest: false`，避免深度冲突

### 核心代码
```glsl
// 顶点着色器
varying vec3 vWorldPosition;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// 片段着色器
uniform vec3 filterColor;
uniform float intensity;
uniform float opacity;
uniform int blendMode;

varying vec3 vWorldPosition;

void main() {
    vec3 worldPos = normalize(vWorldPosition);
    float gradient = (worldPos.y + 1.0) * 0.5;
    
    vec3 filteredColor = mix(vec3(1.0), filterColor, intensity);
    
    vec3 finalColor;
    if (blendMode == 0) {
        // multiply
        finalColor = filteredColor * gradient;
    } else if (blendMode == 1) {
        // screen
        finalColor = 1.0 - (1.0 - filteredColor) * (1.0 - gradient);
    } else if (blendMode == 2) {
        // overlay
        finalColor = mix(
            2.0 * filteredColor * gradient,
            1.0 - 2.0 * (1.0 - filteredColor) * (1.0 - gradient),
            step(0.5, gradient)
        );
    } else {
        // normal
        finalColor = mix(vec3(1.0), filteredColor, gradient * intensity);
    }
    
    gl_FragColor = vec4(finalColor, opacity);
}
```

## 性能优化

### 1. 几何体优化
- 使用球体几何体作为滤镜容器
- 合理的分段数 (32x32)
- 适当的半径大小 (1000)

### 2. 材质优化
- 使用 `BackSide` 渲染
- 禁用深度写入和深度测试
- 启用透明度

### 3. 内存管理
- 及时销毁不需要的滤镜
- 重用材质和几何体
- 避免频繁创建和销毁

## 最佳实践

### 1. 颜色选择
- 选择与场景主题相符的颜色
- 考虑时间和天气因素
- 避免过于强烈的颜色

### 2. 强度调节
- 白天场景：0.3-0.7
- 夜晚场景：0.7-1.0
- 特殊效果：0.1-0.3

### 3. 混合模式选择
- 白天：normal 或 screen
- 夜晚：multiply
- 特殊效果：overlay

### 4. 性能考虑
- 在低端设备上降低强度
- 避免频繁切换滤镜
- 合理使用预设

## 故障排除

### 常见问题

1. **滤镜不显示**
   - 检查是否启用了滤镜
   - 确认强度不为0
   - 检查透明度设置

2. **性能问题**
   - 降低几何体分段数
   - 减少滤镜强度
   - 检查其他渲染对象

3. **颜色异常**
   - 检查颜色值格式
   - 确认混合模式设置
   - 验证强度范围

### 调试技巧
```typescript
// 获取当前配置
const config = filter.getConfig()
console.log('当前滤镜配置:', config)

// 检查滤镜状态
console.log('滤镜是否启用:', filter.config.enabled)
console.log('滤镜颜色:', filter.config.color)
```

## 扩展开发

### 添加新的混合模式
1. 在着色器中添加新的混合逻辑
2. 更新 `getBlendModeValue` 方法
3. 在控制面板中添加选项

### 添加新的预设
```typescript
export const SkyboxFilterPresets = {
  // 现有预设...
  
  // 新预设
  custom: {
    enabled: true,
    color: '#YOUR_COLOR',
    intensity: 0.8,
    opacity: 0.6,
    blendMode: 'multiply'
  }
}
```

### 自定义着色器
可以修改着色器代码来实现更复杂的效果，如：
- 基于时间的动态变化
- 噪声纹理
- 多层滤镜叠加

## 总结

天空盒滤镜是一个强大而灵活的工具，可以显著提升3D场景的视觉效果。通过合理使用颜色、强度、透明度和混合模式，可以创建出各种不同的氛围效果，从而增强用户体验。

记住要根据具体需求选择合适的参数，并注意性能优化。通过配置文件、代码控制或可视化面板，可以灵活地管理和调整滤镜效果。 