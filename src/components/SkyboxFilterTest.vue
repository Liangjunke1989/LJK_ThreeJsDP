<template>
  <div class="skybox-filter-test">
    <div class="test-container">
      <div class="three-container" ref="threeContainer"></div>
      
      <div class="control-panel">
        <h3>天空盒滤镜测试</h3>
        <p class="description">
          测试天空盒滤镜是否影响模型光照效果
        </p>
        
        <div class="filter-controls">
          <h4>滤镜控制</h4>
          
          <div class="control-item">
            <label>
              <input 
                type="checkbox" 
                v-model="filterEnabled"
                @change="toggleFilter"
              />
              启用天空盒滤镜
            </label>
          </div>
          
          <div class="control-item" v-if="filterEnabled">
            <label>滤镜颜色:</label>
            <input 
              type="color" 
              v-model="filterColor"
              @change="updateFilterColor"
            />
          </div>
          
          <div class="control-item" v-if="filterEnabled">
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
          
          <div class="control-item" v-if="filterEnabled">
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
          
          <div class="control-item" v-if="filterEnabled">
            <label>混合模式:</label>
            <select v-model="filterBlendMode" @change="updateFilterBlendMode">
              <option value="normal">正常</option>
              <option value="multiply">正片叠底</option>
              <option value="screen">滤色</option>
              <option value="overlay">叠加</option>
            </select>
          </div>
        </div>
        
        <div class="light-controls">
          <h4>光照控制</h4>
          
          <div class="control-item">
            <label>环境光强度: {{ ambientIntensity }}</label>
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="0.1"
              v-model="ambientIntensity"
              @input="updateAmbientLight"
            />
          </div>
          
          <div class="control-item">
            <label>平行光强度: {{ directionalIntensity }}</label>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.1"
              v-model="directionalIntensity"
              @input="updateDirectionalLight"
            />
          </div>
        </div>
        
        <div class="test-info">
          <h4>测试说明</h4>
          <ul>
            <li>调整天空盒滤镜参数，观察是否影响模型的光照效果</li>
            <li>调整光照强度，确认模型的光照响应正常</li>
            <li>滤镜应该只影响天空盒的视觉效果，不影响模型光照</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useThree from '@/hooks/useThree';

// 响应式数据
const threeContainer = ref<HTMLElement>();
const filterEnabled = ref(false);
const filterColor = ref('#87CEEB');
const filterIntensity = ref(0.8);
const filterOpacity = ref(0.6);
const filterBlendMode = ref('multiply');
const ambientIntensity = ref(2);
const directionalIntensity = ref(8);

// Three.js 实例
let threeInstance: any = null;

// 初始化Three.js
onMounted(async () => {
  if (threeContainer.value) {
    threeInstance = useThree(threeContainer.value.id);
    
    // 等待Three.js初始化完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 获取当前滤镜配置
    const currentConfig = threeInstance.getSkyboxFilterConfig();
    if (currentConfig) {
      filterEnabled.value = currentConfig.enabled;
      filterColor.value = currentConfig.color;
      filterIntensity.value = currentConfig.intensity;
      filterOpacity.value = currentConfig.opacity;
      filterBlendMode.value = currentConfig.blendMode;
    }
  }
});

// 滤镜控制函数
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

// 光照控制函数
const updateAmbientLight = () => {
  if (threeInstance && threeInstance.threeTest) {
    // 查找环境光并更新强度
    const scene = threeInstance.threeTest.scene;
    scene.children.forEach((child: any) => {
      if (child.type === 'AmbientLight') {
        child.intensity = ambientIntensity.value;
      }
    });
  }
};

const updateDirectionalLight = () => {
  if (threeInstance && threeInstance.threeTest) {
    // 查找平行光并更新强度
    const scene = threeInstance.threeTest.scene;
    scene.children.forEach((child: any) => {
      if (child.type === 'DirectionalLight') {
        child.intensity = directionalIntensity.value;
      }
    });
  }
};

onBeforeUnmount(() => {
  // 清理资源
  if (threeInstance) {
    // 可以在这里添加清理逻辑
  }
});
</script>

<style scoped>
.skybox-filter-test {
  width: 100%;
  height: 100vh;
  display: flex;
  background: #1a1a1a;
  color: white;
}

.test-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.three-container {
  flex: 1;
  height: 100%;
  background: #000;
}

.control-panel {
  width: 350px;
  padding: 20px;
  background: #2a2a2a;
  border-left: 1px solid #444;
  overflow-y: auto;
}

.control-panel h3 {
  margin: 0 0 20px 0;
  color: #87CEEB;
  font-size: 18px;
}

.control-panel h4 {
  margin: 20px 0 10px 0;
  color: #fff;
  font-size: 14px;
}

.description {
  margin: 0 0 20px 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
}

.control-item {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-item label {
  font-size: 14px;
  color: #ddd;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.control-item input[type="color"] {
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-item input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #444;
  outline: none;
  cursor: pointer;
}

.control-item select {
  padding: 8px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #333;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.test-info {
  margin-top: 30px;
  padding: 15px;
  background: #333;
  border-radius: 6px;
  border-left: 3px solid #87CEEB;
}

.test-info h4 {
  margin: 0 0 10px 0;
  color: #87CEEB;
}

.test-info ul {
  margin: 0;
  padding-left: 20px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
}

.test-info li {
  margin: 5px 0;
}
</style> 