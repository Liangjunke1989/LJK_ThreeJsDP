# 场景配置文件说明

## 概述

`scene-config.xml` 是一个XML格式的配置文件，用于管理Three.js 3D场景的各种参数，包括相机位置、模型加载、标签、围栏和巡逻路径等。

## 配置文件结构

### 1. 相机配置 (camera)
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

### 2. 模型配置 (models)

#### 简化GLTF模型 (gltf-simply-models)
```xml
<gltf-simply-models>
    <model>
        <url>gltf/DP_BanGong01_Simply.glb</url>
        <type>gltf</type>
        <name>DP_A</name>
        <playAction></playAction>
        <position>
            <x>0</x>
            <y>0</y>
            <z>0</z>
        </position>
        <rotation>
            <x>0</x>
            <y>0</y>
            <z>0</z>
        </rotation>
        <scale>1</scale>
    </model>
</gltf-simply-models>
```

#### 完整GLTF模型 (gltf-models)
```xml
<gltf-models>
    <model>
        <url>gltf/office_1.gltf</url>
        <type>gltf</type>
        <name>test</name>
        <playAction></playAction>
        <position>
            <x>0</x>
            <y>0</y>
            <z>0</z>
        </position>
        <rotation>
            <x>0</x>
            <y>0</y>
            <z>0</z>
        </rotation>
    </model>
</gltf-models>
```

#### 巡逻人员模型 (patrol-models)
```xml
<patrol-models>
    <model>
        <id>0</id>
        <url>gltf/Soldier.glb</url>
        <type>gltf</type>
        <name>机器人0</name>
        <playAction>Run</playAction>
        <position>
            <x>0</x>
            <y>0</y>
            <z>0</z>
        </position>
        <rotation>
            <x>1</x>
            <y>3.14159</y>
            <z>0</z>
        </rotation>
        <scale>1</scale>
    </model>
</patrol-models>
```

### 3. 标签配置 (labels)
```xml
<labels>
    <label>
        <color>#3ac9b0</color>
        <name>半拱大棚标签</name>
        <value>半拱大棚</value>
        <position>
            <x>0</x>
            <y>5</y>
            <z>0</z>
        </position>
        <scale>1</scale>
    </label>
</labels>
```

### 4. 围栏配置 (fence)
```xml
<fence>
    <points>
        <point>
            <x>-26.69</x>
            <y>0.1</y>
            <z>14.62</z>
        </point>
        <!-- 更多点... -->
    </points>
    <color>rgb(51, 188, 176)</color>
</fence>
```

### 5. 巡逻路径配置 (patrol-paths)
```xml
<patrol-paths>
    <path name="path1">
        <points>
            <point>
                <x>-55.08</x>
                <y>0.1</y>
                <z>15.45</z>
            </point>
            <!-- 更多点... -->
        </points>
    </path>
</patrol-paths>
```

## 参数说明

### 相机参数
- `position`: 相机位置 (x, y, z)
- `lookAt`: 相机朝向目标点 (x, y, z)
- `monitor`: 相机监听配置
  - `enabled`: 是否启用监听 (true/false)
  - `interval`: 监听间隔，单位毫秒 (默认1000)
  - `logPosition`: 是否记录相机位置 (true/false)
  - `logLookAt`: 是否记录相机朝向 (true/false)

### 模型参数
- `url`: 模型文件路径
- `type`: 模型类型 (gltf/fbx)
- `name`: 模型名称
- `playAction`: 播放的动画名称
- `position`: 模型位置 (x, y, z)
- `rotation`: 模型旋转 (x, y, z，弧度制)
- `scale`: 模型缩放比例
- `id`: 模型ID（用于巡逻模型）
- `callback`: 回调函数名称

### 标签参数
- `color`: 标签颜色（十六进制）
- `name`: 标签名称
- `value`: 标签显示文本
- `position`: 标签位置 (x, y, z)
- `scale`: 标签缩放比例

### 围栏参数
- `points`: 围栏顶点坐标数组
- `color`: 围栏颜色

### 巡逻路径参数
- `name`: 路径名称
- `points`: 路径点坐标数组

## 使用方法

1. 修改 `scene-config.xml` 文件中的相应参数
2. 保存文件
3. 刷新页面，新的配置将自动生效

## 注意事项

1. 所有坐标值都使用浮点数
2. 旋转角度使用弧度制（π = 3.14159）
3. 模型文件路径相对于 `public` 目录
4. 如果配置文件加载失败，系统将使用默认配置
5. 修改配置文件后需要重新加载页面才能生效

## 错误处理

如果配置文件格式错误或加载失败，系统会：
1. 在控制台输出错误信息
2. 自动使用默认配置
3. 继续正常运行

## 扩展配置

如需添加新的配置项，请：
1. 在XML文件中添加相应的节点
2. 在 `ConfigParser` 类中添加解析逻辑
3. 在 `useThree.ts` 中添加相应的处理函数 