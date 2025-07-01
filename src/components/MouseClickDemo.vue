<template>
  <div class="mouse-click-demo">
    <div class="three-container" ref="threeContainer"></div>
    
    <div class="info-panel">
      <h3>鼠标点击演示</h3>
      <p class="description">
        点击场景中的任何物体，查看控制台输出的物体信息
      </p>
      
      <div class="instructions">
        <h4>使用说明</h4>
        <ul>
          <li>🖱️ 点击场景中的任何物体</li>
          <li>📋 查看浏览器控制台的输出信息</li>
          <li>🔍 可以点击模型、地板、围栏等物体</li>
          <li>📊 会显示物体的名称、位置、旋转等信息</li>
        </ul>
      </div>
      
      <div class="object-types">
        <h4>可点击的物体类型</h4>
        <ul>
          <li>🏗️ 围栏区域 (青色面)</li>
          <li>🔵 地板 (蓝色圆形)</li>
          <li>📦 3D模型 (如果有加载)</li>
          <li>🌅 天空盒滤镜 (如果启用)</li>
          <li>📁 模型组容器</li>
        </ul>
      </div>
      
      <div class="console-info">
        <h4>控制台输出信息</h4>
        <ul>
          <li>物体名称和类型</li>
          <li>位置坐标 (x, y, z)</li>
          <li>旋转角度 (x, y, z)</li>
          <li>缩放比例 (x, y, z)</li>
          <li>可见性状态</li>
          <li>用户自定义数据</li>
          <li>点击位置坐标</li>
          <li>距离相机的距离</li>
        </ul>
      </div>
      
      <div class="tips">
        <h4>调试技巧</h4>
        <ul>
          <li>按 F12 打开开发者工具</li>
          <li>切换到 Console 标签页</li>
          <li>点击物体后查看控制台输出</li>
          <li>可以复制坐标信息用于其他用途</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useThree from '@/hooks/useThree';

const threeContainer = ref<HTMLElement>();

onMounted(async () => {
  if (threeContainer.value) {
    threeContainer.value.id = 'mouseClickDemo';
    const threeInstance = useThree('mouseClickDemo');
    
    // 等待初始化完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🎯 鼠标点击演示已加载');
    console.log('💡 点击场景中的任何物体查看详细信息');
  }
});
</script>

<style scoped>
.mouse-click-demo {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #1a1a1a;
  color: white;
}

.three-container {
  flex: 1;
  height: 100%;
  background: #000;
}

.info-panel {
  width: 350px;
  padding: 20px;
  background: #2a2a2a;
  border-left: 1px solid #444;
  overflow-y: auto;
}

.info-panel h3 {
  margin: 0 0 10px 0;
  color: #87CEEB;
  font-size: 18px;
}

.description {
  margin: 0 0 20px 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
}

.instructions,
.object-types,
.console-info,
.tips {
  margin-bottom: 25px;
}

.info-panel h4 {
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 14px;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
}

.info-panel ul {
  margin: 0;
  padding-left: 20px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
}

.info-panel li {
  margin: 8px 0;
}

.instructions {
  background: #333;
  border-radius: 6px;
  padding: 15px;
  border-left: 3px solid #4CAF50;
}

.object-types {
  background: #333;
  border-radius: 6px;
  padding: 15px;
  border-left: 3px solid #FF9800;
}

.console-info {
  background: #333;
  border-radius: 6px;
  padding: 15px;
  border-left: 3px solid #2196F3;
}

.tips {
  background: #333;
  border-radius: 6px;
  padding: 15px;
  border-left: 3px solid #9C27B0;
}
</style> 