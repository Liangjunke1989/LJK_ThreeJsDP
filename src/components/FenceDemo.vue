<template>
  <div class="fence-demo">
    <div class="three-container" ref="threeContainer"></div>
    
    <div class="info-panel">
      <h3>围栏显示隐藏演示</h3>
      <p class="description">
        演示围栏的显示隐藏功能，通过XML配置文件控制
      </p>
      
      <div class="demo-info">
        <h4>功能特性</h4>
        <ul>
          <li>✅ 通过XML配置文件控制围栏显示隐藏</li>
          <li>✅ 实时切换围栏可见性</li>
          <li>✅ 动态修改围栏颜色</li>
          <li>✅ 配置自动保存和导出</li>
          <li>✅ 支持配置重置功能</li>
        </ul>
      </div>
      
      <div class="xml-config">
        <h4>XML配置示例</h4>
        <pre>
&lt;fence&gt;
    &lt;visible&gt;true&lt;/visible&gt;
    &lt;points&gt;
        &lt;point&gt;
            &lt;x&gt;-26.69&lt;/x&gt;
            &lt;y&gt;0.1&lt;/y&gt;
            &lt;z&gt;14.62&lt;/z&gt;
        &lt;/point&gt;
        ...
    &lt;/points&gt;
    &lt;color&gt;rgb(51, 188, 176)&lt;/color&gt;
&lt;/fence&gt;
        </pre>
      </div>
      
      <div class="usage-guide">
        <h4>使用方法</h4>
        <ol>
          <li>修改XML配置文件中的<code>&lt;visible&gt;</code>标签</li>
          <li>设置为<code>true</code>显示围栏，<code>false</code>隐藏围栏</li>
          <li>重新加载场景或使用控制面板实时切换</li>
          <li>配置会自动保存到XML文件中</li>
        </ol>
      </div>
      
      <div class="control-tips">
        <h4>控制提示</h4>
        <ul>
          <li>🖱️ 点击围栏区域查看物体信息</li>
          <li>🎛️ 使用控制面板实时切换显示状态</li>
          <li>🎨 可以修改围栏颜色和透明度</li>
          <li>💾 配置修改后记得保存</li>
        </ul>
      </div>
    </div>
    
    <!-- 围栏控制面板 -->
    <fenceControlPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useThree from '@/hooks/useThree';
import fenceControlPanel from '@/components/fenceControlPanel.vue';

const threeContainer = ref<HTMLElement>();

onMounted(async () => {
  if (threeContainer.value) {
    threeContainer.value.id = 'fenceDemo';
    const threeInstance = useThree('fenceDemo');
    
    // 等待初始化完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🏗️ 围栏演示已加载');
    console.log('💡 使用控制面板切换围栏显示状态');
  }
});
</script>

<style scoped>
.fence-demo {
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

.description {
  margin: 0 0 20px 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
}

.demo-info,
.xml-config,
.usage-guide,
.control-tips {
  margin-bottom: 25px;
  background: #333;
  border-radius: 6px;
  padding: 15px;
}

.demo-info {
  border-left: 3px solid #4CAF50;
}

.xml-config {
  border-left: 3px solid #2196F3;
}

.usage-guide {
  border-left: 3px solid #FF9800;
}

.control-tips {
  border-left: 3px solid #9C27B0;
}

.info-panel h4 {
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 14px;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
}

.info-panel ul,
.info-panel ol {
  margin: 0;
  padding-left: 20px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
}

.info-panel li {
  margin: 8px 0;
}

.xml-config pre {
  background: #1a1a1a;
  border-radius: 4px;
  padding: 10px;
  font-size: 11px;
  color: #00ff00;
  overflow-x: auto;
  margin: 0;
  font-family: 'Courier New', monospace;
}

.usage-guide code {
  background: #444;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #ffd700;
}
</style> 