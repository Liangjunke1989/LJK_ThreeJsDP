# LJK_ThreeJsDP - Three.js 3D场景项目

## 项目概述

这是一个基于 Three.js 的 3D 场景展示项目，支持通过 XML 配置文件动态管理场景参数，包括相机位置、模型加载、标签、围栏和巡逻路径等。

## 主要功能

- 🎮 3D 场景渲染和交互
- 📁 XML 配置文件管理
- 🎯 动态相机控制
- 🏗️ 模型加载和管理
- 🏷️ 标签系统
- 🚧 围栏和巡逻路径
- ⚙️ 实时配置修改

## 配置文件系统

### 配置文件位置
- 主配置文件：`public/config/scene-config.xml`
- 示例配置文件：`public/config/scene-config-example.xml`
- 配置说明文档：`public/config/README.md`

### 配置内容
1. **相机配置** - 初始位置和朝向
2. **模型配置** - GLTF/FBX 模型加载参数
3. **标签配置** - 场景中的信息标签
4. **围栏配置** - 安全区域边界
5. **巡逻路径配置** - 角色移动路径

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 修改配置
编辑 `public/config/scene-config.xml` 文件来调整场景参数：

```xml
<camera>
    <position>
        <x>0.72</x>
        <y>3.52</y>
        <z>60</z>
    </position>
    <lookAt>
        <x>0</x>
        <y>0</y>
        <z>0</z>
    </lookAt>
</camera>
```

### 4. 使用配置面板
在浏览器中打开应用，使用右上角的配置面板进行实时参数调整。

## 项目结构

```
LJK_ThreeJsDP/
├── public/
│   ├── config/                 # 配置文件目录
│   │   ├── scene-config.xml    # 主配置文件
│   │   ├── scene-config-example.xml  # 示例配置
│   │   └── README.md           # 配置说明
│   ├── gltf/                   # GLTF 模型文件
│   ├── fbx/                    # FBX 模型文件
│   └── texture/                # 纹理文件
├── src/
│   ├── hooks/
│   │   └── useThree.ts         # Three.js 主逻辑
│   ├── utils/
│   │   ├── configParser.ts     # XML 配置解析器
│   │   ├── configManager.ts    # 配置管理器
│   │   └── threeUtils/         # Three.js 工具类
│   └── components/
│       └── configPanel.vue     # 配置面板组件
└── README.md                   # 项目说明
```

## 配置系统架构

### 核心组件

1. **ConfigParser** (`src/utils/configParser.ts`)
   - XML 配置文件解析
   - 类型安全的配置接口
   - 错误处理和默认值

2. **ConfigManager** (`src/utils/configManager.ts`)
   - 动态配置管理
   - 实时参数修改
   - 配置导出和保存

3. **ConfigPanel** (`src/components/configPanel.vue`)
   - 可视化配置界面
   - 实时参数调整
   - 模型管理功能

### 使用示例

#### 基本配置加载
```typescript
import ConfigManager from '@/utils/configManager';

const configManager = ConfigManager.getInstance();
await configManager.loadConfig('/config/scene-config.xml');
```

#### 动态修改相机位置
```typescript
configManager.updateCameraPosition(10, 15, 80);
```

#### 添加新模型
```typescript
const newModel = {
  name: '新建筑',
  url: 'gltf/building.glb',
  type: 'gltf',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1
};

configManager.addModelConfig(newModel, 'gltfSimplyModels');
```

## 配置参数说明

### 相机参数
- `position`: 相机位置 (x, y, z)
- `lookAt`: 相机朝向目标点 (x, y, z)

### 模型参数
- `url`: 模型文件路径
- `type`: 模型类型 (gltf/fbx)
- `name`: 模型名称
- `position`: 模型位置
- `rotation`: 模型旋转 (弧度制)
- `scale`: 模型缩放比例
- `playAction`: 动画名称

### 标签参数
- `color`: 标签颜色 (十六进制)
- `name`: 标签名称
- `value`: 显示文本
- `position`: 标签位置
- `scale`: 标签缩放

## 开发指南

### 添加新的配置项

1. 在 XML 文件中添加新的节点
2. 在 `ConfigParser` 中添加解析逻辑
3. 在 `ConfigManager` 中添加管理方法
4. 在 `ConfigPanel` 中添加界面控件

### 扩展模型类型

1. 在 `ModelConfig` 接口中添加新属性
2. 更新 XML 解析逻辑
3. 在 `useThree.ts` 中添加加载逻辑

## 注意事项

1. 所有坐标值使用浮点数
2. 旋转角度使用弧度制 (π = 3.14159)
3. 模型文件路径相对于 `public` 目录
4. 配置文件修改后需要刷新页面生效
5. 配置加载失败时会使用默认配置

## 错误处理

- 配置文件格式错误：使用默认配置
- 模型文件不存在：跳过加载
- 网络请求失败：显示错误信息

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。


