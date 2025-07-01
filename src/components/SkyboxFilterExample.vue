<template>
  <div class="skybox-filter-example">
    <div class="three-container" ref="threeContainer"></div>
    
    <div class="control-panel">
      <h3>天空盒滤镜测试</h3>
      
      <div class="control-group">
        <label>
          <input 
            type="checkbox" 
            v-model="filterEnabled"
            @change="toggleFilter"
          />
          启用天空盒滤镜
        </label>
      </div>
      
      <div class="control-group" v-if="filterEnabled">
        <label>滤镜颜色:</label>
        <input 
          type="color" 
          v-model="filterColor"
          @change="updateFilterColor"
        />
      </div>
      
      <div class="control-group" v-if="filterEnabled">
        <label>强度: {{ filterIntensity }}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          v-model="filterIntensity"
          @input="updateFilterIntensity"
        />
      </div>
      
      <div class="control-group" v-if="filterEnabled">
        <label>透明度: {{ filterOpacity }}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          v-model="filterOpacity"
          @input="updateFilterOpacity"
        />
      </div>
      
      <div class="control-group" v-if="filterEnabled">
        <label>混合模式:</label>
        <select v-model="filterBlendMode" @change="updateFilterBlendMode">
          <option value="normal">正常</option>
          <option value="multiply">正片叠底</option>
          <option value="screen">滤色</option>
          <option value="overlay">叠加</option>
        </select>
      </div>
      
      <div class="info">
        <p>测试说明：</p>
        <ul>
          <li>调整滤镜参数，观察是否影响模型光照</li>
          <li>滤镜应该只影响天空盒视觉效果</li>
          <li>模型的光照效果应该保持不变</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useThree from '@/hooks/useThree';

const threeContainer = ref<HTMLElement>();
const filterEnabled = ref(false);
const filterColor = ref('#87CEEB');
const filterIntensity = ref(0.8);
const filterOpacity = ref(0.6);
const filterBlendMode = ref('multiply');

let threeInstance: any = null;

onMounted(async () => {
  if (threeContainer.value) {
    threeContainer.value.id = 'skyboxFilterTest';
    threeInstance = useThree('skyboxFilterTest');
    
    // 等待初始化完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 获取当前配置
    const config = threeInstance.getSkyboxFilterConfig();
    if (config) {
      filterEnabled.value = config.enabled;
      filterColor.value = config.color;
      filterIntensity.value = config.intensity;
      filterOpacity.value = config.opacity;
      filterBlendMode.value = config.blendMode;
    }
  }
});

const toggleFilter = () => {
  if (threeInstance) {
    threeInstance.setSkyboxFilterEnabled(filterEnabled.value);
  }
};

const updateFilterColor = () => {
  if (threeInstance && filterEnabled.value) {
    threeInstance.setSkyboxFilterColor(filterColor.value);
  }
};

const updateFilterIntensity = () => {
  if (threeInstance && filterEnabled.value) {
    threeInstance.setSkyboxFilterIntensity(filterIntensity.value);
  }
};

const updateFilterOpacity = () => {
  if (threeInstance && filterEnabled.value) {
    threeInstance.setSkyboxFilterOpacity(filterOpacity.value);
  }
};

const updateFilterBlendMode = () => {
  if (threeInstance && filterEnabled.value) {
    threeInstance.setSkyboxFilterBlendMode(filterBlendMode.value);
  }
};
</script>

<style scoped>
.skybox-filter-example {
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

.control-panel {
  width: 300px;
  padding: 20px;
  background: #2a2a2a;
  border-left: 1px solid #444;
  overflow-y: auto;
}

.control-panel h3 {
  margin: 0 0 20px 0;
  color: #87CEEB;
}

.control-group {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-size: 14px;
  color: #ddd;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.control-group input[type="color"] {
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #444;
  outline: none;
  cursor: pointer;
}

.control-group select {
  padding: 8px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #333;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.info {
  margin-top: 30px;
  padding: 15px;
  background: #333;
  border-radius: 6px;
  border-left: 3px solid #87CEEB;
}

.info p {
  margin: 0 0 10px 0;
  color: #87CEEB;
  font-weight: bold;
}

.info ul {
  margin: 0;
  padding-left: 20px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
}

.info li {
  margin: 5px 0;
}
</style> 