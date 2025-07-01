<template>
  <div class="mouse-click-test">
    <div class="three-container" ref="threeContainer"></div>
    
    <div class="info-panel">
      <h3>鼠标点击测试</h3>
      <p>点击场景中的物体，查看控制台输出</p>
      
      <div class="test-info">
        <h4>测试说明</h4>
        <ul>
          <li>点击地板（蓝色圆形）</li>
          <li>点击围栏（青色区域）</li>
          <li>点击任何3D模型</li>
          <li>查看浏览器控制台输出</li>
        </ul>
      </div>
      
      <div class="console-output">
        <h4>控制台输出示例</h4>
        <pre>
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
        </pre>
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
    threeContainer.value.id = 'mouseClickTest';
    const threeInstance = useThree('mouseClickTest');
    
    // 等待初始化完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🎯 鼠标点击测试已加载');
    console.log('💡 点击场景中的任何物体查看详细信息');
  }
});
</script>

<style scoped>
.mouse-click-test {
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
  width: 400px;
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

.info-panel p {
  margin: 0 0 20px 0;
  color: #ccc;
  font-size: 14px;
}

.test-info,
.console-output {
  margin-bottom: 25px;
  background: #333;
  border-radius: 6px;
  padding: 15px;
}

.test-info {
  border-left: 3px solid #4CAF50;
}

.console-output {
  border-left: 3px solid #2196F3;
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

.console-output pre {
  background: #1a1a1a;
  border-radius: 4px;
  padding: 10px;
  font-size: 11px;
  color: #00ff00;
  overflow-x: auto;
  margin: 0;
  font-family: 'Courier New', monospace;
}
</style> 