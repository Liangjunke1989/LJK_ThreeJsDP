# 相机监听功能使用指南

## 概述

相机监听功能允许您通过XML配置文件控制相机位置的实时监控，包括开启/关闭监听、设置监听间隔、选择监听内容等。

## 配置文件设置

### XML配置结构

在 `public/config/scene-config.xml` 文件中，相机配置部分现在包含监听设置：

```xml
<camera>
    <!-- 初始相机位置 -->
    <position>
        <x>0.72</x>
        <y>3.52</y>
        <z>60</z>
    </position>
    <!-- 相机朝向目标点 -->
    <lookAt>
        <x>0</x>
        <y>0</y>
        <z>0</z>
    </lookAt>
    <!-- 相机监听配置 -->
    <monitor>
        <enabled>true</enabled>
        <interval>1000</interval>
        <logPosition>true</logPosition>
        <logLookAt>true</logLookAt>
    </monitor>
</camera>
```

### 监听参数说明

- `enabled`: 是否启用相机监听 (true/false)
- `interval`: 监听间隔，单位毫秒 (默认1000ms)
- `logPosition`: 是否记录相机位置 (true/false)
- `logLookAt`: 是否记录相机朝向 (true/false)

## 使用方法

### 1. 通过配置文件控制

直接修改 `public/config/scene-config.xml` 文件中的 `<monitor>` 部分：

```xml
<!-- 关闭监听 -->
<monitor>
    <enabled>false</enabled>
    <interval>1000</interval>
    <logPosition>false</logPosition>
    <logLookAt>false</logLookAt>
</monitor>

<!-- 开启监听，每500ms记录一次位置 -->
<monitor>
    <enabled>true</enabled>
    <interval>500</interval>
    <logPosition>true</logPosition>
    <logLookAt>false</logLookAt>
</monitor>
```

### 2. 通过代码控制

使用 `ConfigManager` API 动态控制监听：

```typescript
import ConfigManager from '@/utils/configManager';

const configManager = ConfigManager.getInstance();

// 开启监听
configManager.setCameraMonitorEnabled(true);

// 设置监听间隔为500ms
configManager.setCameraMonitorInterval(500);

// 只记录位置，不记录朝向
configManager.setCameraLogPosition(true);
configManager.setCameraLogLookAt(false);

// 关闭监听
configManager.setCameraMonitorEnabled(false);
```

### 3. 在 useThree 中使用

在 `useThree.ts` 中，监听功能已经集成到初始化流程中：

```typescript
// 根据配置自动设置监听
if (sceneConfig && sceneConfig.camera.monitor.enabled) {
  cameraMonitorInterval = setInterval(() => {
    if (sceneConfig?.camera.monitor.logPosition) {
      console.log("相机位置", threeTest.camera.position);
    }
    if (sceneConfig?.camera.monitor.logLookAt) {
      console.log("相机朝向", threeTest.camera.lookAt);
    }
  }, sceneConfig.camera.monitor.interval);
}
```

## 控制函数

### controlCameraMonitor

在 `useThree.ts` 中导出的 `controlCameraMonitor` 函数可以动态控制监听：

```typescript
// 开启监听，设置间隔为2000ms，只记录位置
controlCameraMonitor(true, 2000, true, false);

// 关闭监听
controlCameraMonitor(false);
```

## 实际应用场景

### 1. 调试相机移动

在开发过程中，可以开启监听来观察相机位置变化：

```xml
<monitor>
    <enabled>true</enabled>
    <interval>100</interval>
    <logPosition>true</logPosition>
    <logLookAt>true</logLookAt>
</monitor>
```

### 2. 性能优化

在生产环境中，可以关闭监听以提高性能：

```xml
<monitor>
    <enabled>false</enabled>
    <interval>1000</interval>
    <logPosition>false</logPosition>
    <logLookAt>false</logLookAt>
</monitor>
```

### 3. 选择性监听

只监听需要的信息：

```xml
<!-- 只监听位置变化 -->
<monitor>
    <enabled>true</enabled>
    <interval>1000</interval>
    <logPosition>true</logPosition>
    <logLookAt>false</logLookAt>
</monitor>

<!-- 只监听朝向变化 -->
<monitor>
    <enabled>true</enabled>
    <interval>1000</interval>
    <logPosition>false</logPosition>
    <logLookAt>true</logLookAt>
</monitor>
```

## 注意事项

1. **性能影响**: 监听间隔越小，对性能影响越大
2. **控制台输出**: 监听信息会输出到浏览器控制台
3. **内存管理**: 监听器会在组件卸载时自动清理
4. **配置持久化**: 修改配置后需要保存到文件才能持久化

## 错误处理

- 如果配置文件格式错误，会使用默认配置
- 如果监听器创建失败，会在控制台输出错误信息
- 监听器会自动处理清理，避免内存泄漏

## 扩展功能

可以通过修改 `ConfigParser` 和 `ConfigManager` 来添加更多监听选项：

- 监听相机旋转
- 监听相机缩放
- 监听用户交互事件
- 导出监听数据到文件

## 示例配置

### 开发环境配置
```xml
<monitor>
    <enabled>true</enabled>
    <interval>100</interval>
    <logPosition>true</logPosition>
    <logLookAt>true</logLookAt>
</monitor>
```

### 生产环境配置
```xml
<monitor>
    <enabled>false</enabled>
    <interval>1000</interval>
    <logPosition>false</logPosition>
    <logLookAt>false</logLookAt>
</monitor>
```

### 调试特定问题配置
```xml
<monitor>
    <enabled>true</enabled>
    <interval>500</interval>
    <logPosition>true</logPosition>
    <logLookAt>false</logLookAt>
</monitor>
``` 