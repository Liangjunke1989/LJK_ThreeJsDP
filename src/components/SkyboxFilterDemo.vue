<template>
  <div class="skybox-filter-demo">
    <div class="three-container" ref="threeContainer"></div>
    
    <div class="control-panel">
      <h3>天空盒滤镜演示</h3>
      <p class="description">
        演示天空盒滤镜如何只影响天空盒视觉效果，不影响模型和环境灯光
      </p>
      
      <div class="filter-section">
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
          <span class="color-value">{{ filterColor }}</span>
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
      
      <div class="light-section">
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
      
      <div class="preset-section">
        <h4>预设滤镜</h4>
        <div class="preset-buttons">
          <button 
            v-for="(preset, key) in filterPresets" 
            :key="key"
            @click="applyPreset(key)"
            class="preset-btn"
          >
            {{ getPresetName(key) }}
          </button>
        </div>
      </div>
      
      <div class="info-section">
        <h4>技术说明</h4>
        <ul>
          <li>✅ 滤镜只影响天空盒视觉效果</li>
          <li>✅ 不影响模型的光照效果</li>
          <li>✅ 不影响环境灯光强度</li>
          <li>✅ 支持实时调整参数</li>
          <li>✅ 使用纯视觉效果着色器</li>
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
const ambientIntensity = ref(2);
const directionalIntensity = ref(8);

let threeInstance: any = null;

// 预设滤镜配置
const filterPresets = {
  blueSky: {
    enabled: true,
    color: '#87CEEB',
    intensity: 0.8,
    opacity: 0.6,
    blendMode: 'multiply'
  },
  sunset: {
    enabled: true,
    color: '#FF6B35',
    intensity: 0.7,
    opacity: 0.5,
    blendMode: 'overlay'
  },
  night: {
    enabled: true,
    color: '#1E3A8A',
    intensity: 0.9,
    opacity: 0.8,
    blendMode: 'multiply'
  },
  fog: {
    enabled: true,
    color: '#D3D3D3',
    intensity: 0.6,
    opacity: 0.4,
    blendMode: 'screen'
  },
  warm: {
    enabled: true,
    color: '#FFD700',
    intensity: 0.5,
    opacity: 0.3,
    blendMode: 'overlay'
  }
};

onMounted(async () => {
  if (threeContainer.value) {
    threeContainer.value.id = 'skyboxFilterDemo';
    threeInstance = useThree('skyboxFilterDemo');
    
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
    const scene = threeInstance.threeTest.scene;
    scene.children.forEach((child: any) => {
      if (child.type === 'DirectionalLight') {
        child.intensity = directionalIntensity.value;
      }
    });
  }
};

// 应用预设
const applyPreset = (presetKey: string) => {
  const preset = filterPresets[presetKey as keyof typeof filterPresets];
  if (preset && threeInstance) {
    filterEnabled.value = preset.enabled;
    filterColor.value = preset.color;
    filterIntensity.value = preset.intensity;
    filterOpacity.value = preset.opacity;
    filterBlendMode.value = preset.blendMode;
    
    threeInstance.updateSkyboxFilter(preset);
  }
};

// 获取预设名称
const getPresetName = (key: string) => {
  const names: Record<string, string> = {
    blueSky: '蓝天',
    sunset: '夕阳',
    night: '夜晚',
    fog: '雾霾',
    warm: '温暖'
  };
  return names[key] || key;
};
</script>

<style scoped>
.skybox-filter-demo {
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
  width: 350px;
  padding: 20px;
  background: #2a2a2a;
  border-left: 1px solid #444;
  overflow-y: auto;
}

.control-panel h3 {
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

.filter-section,
.light-section,
.preset-section,
.info-section {
  margin-bottom: 25px;
}

.control-panel h4 {
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 14px;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
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

.color-value {
  font-family: monospace;
  color: #87CEEB;
  font-size: 12px;
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

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  padding: 8px 12px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #333;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #444;
  border-color: #87CEEB;
}

.info-section {
  background: #333;
  border-radius: 6px;
  padding: 15px;
  border-left: 3px solid #87CEEB;
}

.info-section h4 {
  margin: 0 0 10px 0;
  color: #87CEEB;
  border: none;
  padding: 0;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
}

.info-section li {
  margin: 5px 0;
}
</style> 