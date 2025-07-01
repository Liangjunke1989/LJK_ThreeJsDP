# 鼠标点击功能使用指南

## 功能概述

本项目已成功集成了鼠标点击物体显示信息的功能。当用户点击3D场景中的任何物体时，系统会在浏览器控制台中显示该物体的详细信息。

## 功能特性

### 1. 完整的物体信息显示
- **物体名称**: 显示物体的名称或"未命名"
- **物体类型**: 显示物体的Three.js类型（如Mesh、Group等）
- **位置坐标**: 精确到小数点后2位的x、y、z坐标
- **旋转角度**: 物体的旋转角度（弧度制）
- **缩放比例**: 物体的缩放比例
- **可见性**: 物体是否可见
- **用户数据**: 物体上存储的自定义数据
- **点击位置**: 鼠标点击在物体上的精确位置
- **距离**: 点击位置到相机的距离

### 2. 智能物体识别
- 自动识别模型组中的对象
- 特殊物体类型提示（围栏、地板、天空盒滤镜等）
- 支持点击场景中的所有可交互物体

### 3. 控制台输出格式
```
=== 点击的物体信息 ===
物体名称: 围栏
物体类型: Mesh
物体位置: {x: 0, y: 0.1, z: 0}
物体旋转: {x: 1.57, y: 0, z: 0}
物体缩放: {x: 1, y: 1, z: 1}
是否可见: true
用户数据: {}
点击位置: {x: -20.5, y: 0.1, z: 22.5}
距离: 45.2
=====================
🏗️ 这是围栏区域
```

## 使用方法

### 1. 在主应用中测试
1. 启动项目：`npm run dev`
2. 打开浏览器访问应用
3. 点击"鼠标点击演示"按钮进入演示模式
4. 点击场景中的任何物体
5. 按F12打开开发者工具，查看Console标签页的输出

### 2. 可点击的物体类型
- **地板**: 蓝色圆形地面
- **围栏**: 青色区域（如果有配置）
- **3D模型**: 任何加载的GLTF/FBX模型
- **标签**: 场景中的文字标签
- **天空盒滤镜**: 如果启用了天空盒滤镜效果

### 3. 调试技巧
- 使用鼠标滚轮缩放场景，更容易点击小物体
- 按住鼠标左键旋转视角，找到合适的观察角度
- 控制台输出可以复制坐标信息用于其他用途

## 技术实现

### 1. 射线投射技术
使用Three.js的Raycaster进行精确的鼠标点击检测：
```typescript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = (event.offsetX / width) * 2 - 1;
mouse.y = -(event.offsetY / height) * 2 + 1;
raycaster.setFromCamera(mouse, camera);
```

### 2. 物体信息提取
自动提取物体的所有属性信息：
```typescript
const objectInfo = {
  name: object.name || '未命名',
  type: object.type || '未知类型',
  position: { x, y, z },
  rotation: { x, y, z },
  scale: { x, y, z },
  visible: object.visible,
  userData: object.userData || {}
};
```

### 3. 事件处理
在Three3D类中集成了鼠标点击事件监听：
```typescript
this.dome!.addEventListener("click", this.onMouseClick, false);
```

## 扩展功能

### 1. 自定义点击处理
可以在`onMouseClick`方法中添加自定义逻辑：
```typescript
// 根据物体名称执行不同操作
if (clickedObject.name === '特定物体') {
  // 执行特定操作
  console.log('点击了特定物体');
}
```

### 2. 视觉反馈
可以添加点击时的视觉反馈效果：
```typescript
// 高亮被点击的物体
clickedObject.material.emissive.setHex(0x444444);
setTimeout(() => {
  clickedObject.material.emissive.setHex(0x000000);
}, 200);
```

### 3. 数据导出
可以将点击信息导出到文件或发送到服务器：
```typescript
// 保存点击记录
const clickRecord = {
  timestamp: new Date().toISOString(),
  objectInfo: objectInfo,
  clickPosition: selected.point
};
```

## 注意事项

1. **性能考虑**: 射线检测会遍历场景中的所有物体，对于复杂场景可能需要优化
2. **坐标系统**: 所有坐标都使用Three.js的世界坐标系
3. **精度**: 坐标值保留2位小数，避免浮点数精度问题
4. **兼容性**: 功能兼容所有现代浏览器

## 故障排除

### 1. 点击无响应
- 检查控制台是否有错误信息
- 确认物体有几何体和材质
- 验证物体的visible属性为true

### 2. 坐标不准确
- 检查相机位置和朝向
- 确认鼠标事件坐标计算正确
- 验证射线投射设置

### 3. 信息显示不完整
- 检查物体是否有name属性
- 确认userData对象存在
- 验证物体类型识别正确

## 更新日志

- **v1.0.0**: 初始版本，支持基本的鼠标点击信息显示
- **v1.1.0**: 添加了特殊物体类型识别
- **v1.2.0**: 优化了控制台输出格式
- **v1.3.0**: 添加了距离计算和点击位置显示 