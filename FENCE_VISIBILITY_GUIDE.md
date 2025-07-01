# 围栏显示隐藏功能使用指南

## 功能概述

本项目已成功集成了围栏显示隐藏功能，通过XML配置文件可以控制围栏的可见性，并提供了实时控制面板进行动态切换。

## 功能特性

### 1. XML配置控制
- **visible属性**: 在XML配置文件中添加`<visible>`标签控制围栏显示隐藏
- **动态加载**: 场景启动时自动读取配置文件中的围栏可见性设置
- **配置持久化**: 修改后的配置可以保存到XML文件中

### 2. 实时控制面板
- **开关控制**: 通过开关按钮实时切换围栏显示状态
- **颜色设置**: 支持修改围栏颜色和透明度
- **配置管理**: 提供保存、导出、重置配置功能
- **状态显示**: 实时显示围栏的当前状态信息

### 3. 编程接口
- **setFenceVisible()**: 通过代码控制围栏可见性
- **getFenceConfig()**: 获取当前围栏配置
- **配置管理器**: 提供完整的围栏配置管理功能

## XML配置格式

### 基本结构
```xml
<fence>
    <visible>true</visible>
    <points>
        <point>
            <x>-26.69</x>
            <y>0.1</y>
            <z>14.62</z>
        </point>
        <!-- 更多顶点... -->
    </points>
    <color>rgb(51, 188, 176)</color>
</fence>
```

### 配置说明
- **visible**: `true`显示围栏，`false`隐藏围栏
- **points**: 围栏的顶点坐标数组
- **color**: 围栏的颜色，支持RGB格式

## 使用方法

### 1. 通过XML配置文件
1. 编辑`public/config/scene-config.xml`文件
2. 找到`<fence>`节点
3. 修改`<visible>`标签的值：
   - `true`: 显示围栏
   - `false`: 隐藏围栏
4. 保存文件并重新加载场景

### 2. 通过控制面板
1. 启动项目：`npm run dev`
2. 点击"围栏显示隐藏演示"按钮
3. 使用右侧控制面板：
   - 切换"围栏可见性"开关
   - 修改围栏颜色
   - 保存或导出配置

### 3. 通过编程接口
```typescript
import useThree from '@/hooks/useThree';

const threeInstance = useThree('containerId');
const { setFenceVisible, getFenceConfig } = threeInstance;

// 隐藏围栏
setFenceVisible(false);

// 显示围栏
setFenceVisible(true);

// 获取围栏配置
const fenceConfig = getFenceConfig();
console.log('围栏配置:', fenceConfig);
```

## 技术实现

### 1. 配置解析
在`ConfigParser`类中添加了对`visible`属性的解析：
```typescript
export interface FenceConfig {
  visible: boolean;
  points: Array<{x: number, y: number, z: number}>;
  color: string;
}
```

### 2. 场景集成
在`useThree`中集成了围栏可见性控制：
```typescript
const addFenceFromConfig = (fenceConfig: any) => {
  const mesh = createFace(fenceConfig.points, fenceConfig.color);
  mesh.name = "围栏";
  
  // 根据配置设置围栏的可见性
  if (fenceConfig.visible !== undefined) {
    mesh.visible = fenceConfig.visible;
  }
  
  threeTest.addScene(mesh);
};
```

### 3. 动态控制
提供了实时控制围栏显示的函数：
```typescript
const setFenceVisible = (visible: boolean) => {
  if (sceneConfig) {
    sceneConfig.fence.visible = visible;
    const fenceObject = getModel("围栏", threeTest.scene);
    if (fenceObject) {
      fenceObject.visible = visible;
    }
  }
};
```

## 控制面板功能

### 1. 显示控制
- **开关按钮**: 一键切换围栏显示/隐藏
- **状态指示**: 实时显示当前可见性状态

### 2. 颜色设置
- **颜色选择器**: 支持RGB颜色选择
- **透明度调节**: 可以调整围栏透明度

### 3. 配置管理
- **保存配置**: 将当前设置保存到XML文件
- **导出配置**: 导出完整的XML配置内容
- **重置配置**: 恢复默认设置

### 4. 信息显示
- **顶点数量**: 显示围栏的顶点数量
- **当前颜色**: 显示围栏的当前颜色
- **可见状态**: 显示围栏的当前可见性

## 扩展功能

### 1. 多围栏支持
可以扩展支持多个围栏的独立控制：
```xml
<fences>
    <fence id="fence1">
        <visible>true</visible>
        <!-- 配置... -->
    </fence>
    <fence id="fence2">
        <visible>false</visible>
        <!-- 配置... -->
    </fence>
</fences>
```

### 2. 动画效果
可以添加围栏显示/隐藏的动画效果：
```typescript
// 淡入淡出效果
const animateFenceVisibility = (visible: boolean) => {
  const fenceObject = getModel("围栏", threeTest.scene);
  if (fenceObject && fenceObject.material) {
    new TWEEN.Tween(fenceObject.material)
      .to({ opacity: visible ? 1 : 0 }, 500)
      .start();
  }
};
```

### 3. 条件显示
可以根据场景状态自动控制围栏显示：
```typescript
// 根据相机距离自动显示/隐藏围栏
const autoControlFence = () => {
  const distance = camera.position.distanceTo(fencePosition);
  setFenceVisible(distance < 100);
};
```

## 注意事项

1. **性能考虑**: 围栏的显示/隐藏不会影响渲染性能，只是控制可见性
2. **配置同步**: 修改配置后需要重新加载场景或使用控制面板同步
3. **坐标系统**: 围栏顶点使用Three.js的世界坐标系
4. **兼容性**: 功能兼容所有现代浏览器

## 故障排除

### 1. 围栏不显示
- 检查XML配置文件中的`<visible>`标签是否为`true`
- 确认围栏顶点坐标是否正确
- 验证围栏对象是否成功创建

### 2. 控制面板无响应
- 检查控制台是否有错误信息
- 确认配置管理器是否正确初始化
- 验证事件监听器是否正常工作

### 3. 配置保存失败
- 检查文件权限
- 确认XML格式是否正确
- 验证配置对象是否完整

## 更新日志

- **v1.0.0**: 初始版本，支持基本的围栏显示隐藏功能
- **v1.1.0**: 添加了控制面板界面
- **v1.2.0**: 支持围栏颜色和透明度设置
- **v1.3.0**: 添加了配置保存和导出功能
- **v1.4.0**: 优化了实时控制性能 