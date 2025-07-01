<template>
  <div class="config-panel">
    <div class="panel-header">
      <h3>场景配置管理</h3>
      <div class="header-actions">
        <button @click="saveConfig" class="btn btn-primary">保存配置</button>
        <button @click="exportConfig" class="btn btn-secondary">导出配置</button>
      </div>
    </div>

    <div class="panel-content">
      <!-- 相机配置 -->
      <div class="config-section">
        <h4>相机配置</h4>
        <div class="config-group">
          <label>相机位置:</label>
          <div class="input-group">
            <input v-model.number="cameraConfig.position.x" type="number" step="0.1" placeholder="X" />
            <input v-model.number="cameraConfig.position.y" type="number" step="0.1" placeholder="Y" />
            <input v-model.number="cameraConfig.position.z" type="number" step="0.1" placeholder="Z" />
          </div>
          <button @click="updateCameraPosition" class="btn btn-small">更新位置</button>
        </div>
        
        <div class="config-group">
          <label>相机朝向:</label>
          <div class="input-group">
            <input v-model.number="cameraConfig.lookAt.x" type="number" step="0.1" placeholder="X" />
            <input v-model.number="cameraConfig.lookAt.y" type="number" step="0.1" placeholder="Y" />
            <input v-model.number="cameraConfig.lookAt.z" type="number" step="0.1" placeholder="Z" />
          </div>
          <button @click="updateCameraLookAt" class="btn btn-small">更新朝向</button>
        </div>

        <!-- 相机监听配置 -->
        <div class="config-group">
          <label>相机监听:</label>
          <div class="monitor-controls">
            <div class="monitor-switch">
              <input 
                v-model="cameraConfig.monitor.enabled" 
                type="checkbox" 
                id="monitor-enabled"
                @change="updateCameraMonitor"
              />
              <label for="monitor-enabled">启用监听</label>
            </div>
            
            <div class="monitor-settings" v-if="cameraConfig.monitor.enabled">
              <div class="setting-item">
                <label>监听间隔 (毫秒):</label>
                <input 
                  v-model.number="cameraConfig.monitor.interval" 
                  type="number" 
                  min="100" 
                  step="100"
                />
              </div>
              
              <div class="setting-item">
                <div class="checkbox-group">
                  <input 
                    v-model="cameraConfig.monitor.logPosition" 
                    type="checkbox" 
                    id="log-position"
                    @change="updateCameraMonitor"
                  />
                  <label for="log-position">记录位置</label>
                </div>
                
                <div class="checkbox-group">
                  <input 
                    v-model="cameraConfig.monitor.logLookAt" 
                    type="checkbox" 
                    id="log-lookat"
                    @change="updateCameraMonitor"
                  />
                  <label for="log-lookat">记录朝向</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 天空盒滤镜配置 -->
      <div class="config-section">
        <h4>天空盒滤镜配置</h4>
        <div class="config-group">
          <div class="monitor-switch">
            <input 
              v-model="skyboxFilterConfig.enabled" 
              type="checkbox" 
              id="filter-enabled"
              @change="updateSkyboxFilter"
            />
            <label for="filter-enabled">启用天空盒滤镜</label>
          </div>
        </div>

        <div v-if="skyboxFilterConfig.enabled" class="filter-settings">
          <div class="config-group">
            <label>滤镜颜色:</label>
            <input 
              v-model="skyboxFilterConfig.color" 
              type="color" 
              @change="updateSkyboxFilter"
            />
            <span class="color-value">{{ skyboxFilterConfig.color }}</span>
          </div>

          <div class="config-group">
            <label>强度: {{ skyboxFilterConfig.intensity.toFixed(2) }}</label>
            <input 
              v-model.number="skyboxFilterConfig.intensity" 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              @input="updateSkyboxFilter"
            />
          </div>

          <div class="config-group">
            <label>透明度: {{ skyboxFilterConfig.opacity.toFixed(2) }}</label>
            <input 
              v-model.number="skyboxFilterConfig.opacity" 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              @input="updateSkyboxFilter"
            />
          </div>

          <div class="config-group">
            <label>混合模式:</label>
            <select v-model="skyboxFilterConfig.blendMode" @change="updateSkyboxFilter">
              <option value="multiply">正片叠底</option>
              <option value="screen">滤色</option>
              <option value="overlay">叠加</option>
              <option value="normal">正常</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 模型配置 -->
      <div class="config-section">
        <h4>模型配置</h4>
        <div class="model-type-selector">
          <button 
            v-for="type in modelTypes" 
            :key="type.value"
            @click="selectedModelType = type.value"
            :class="['btn', selectedModelType === type.value ? 'btn-active' : 'btn-secondary']"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="model-list">
          <div 
            v-for="model in currentModelList" 
            :key="model.name"
            class="model-item"
          >
            <div class="model-header">
              <span class="model-name">{{ model.name }}</span>
              <div class="model-actions">
                <button @click="editModel(model)" class="btn btn-small">编辑</button>
                <button @click="removeModel(model.name)" class="btn btn-small btn-danger">删除</button>
              </div>
            </div>
            <div class="model-info">
              <span>类型: {{ model.type }}</span>
              <span>位置: ({{ model.position.x }}, {{ model.position.y }}, {{ model.position.z }})</span>
            </div>
          </div>
        </div>

        <button @click="showAddModelForm = true" class="btn btn-primary">添加模型</button>
      </div>

      <!-- 添加模型表单 -->
      <div v-if="showAddModelForm" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h4>添加模型</h4>
            <button @click="showAddModelForm = false" class="btn-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>模型名称:</label>
              <input v-model="newModel.name" type="text" placeholder="输入模型名称" />
            </div>
            <div class="form-group">
              <label>模型文件路径:</label>
              <input v-model="newModel.url" type="text" placeholder="gltf/model.glb" />
            </div>
            <div class="form-group">
              <label>模型类型:</label>
              <select v-model="newModel.type">
                <option value="gltf">GLTF</option>
                <option value="fbx">FBX</option>
              </select>
            </div>
            <div class="form-group">
              <label>位置:</label>
              <div class="input-group">
                <input v-model.number="newModel.position.x" type="number" step="0.1" placeholder="X" />
                <input v-model.number="newModel.position.y" type="number" step="0.1" placeholder="Y" />
                <input v-model.number="newModel.position.z" type="number" step="0.1" placeholder="Z" />
              </div>
            </div>
            <div class="form-group">
              <label>缩放:</label>
              <input v-model.number="newModel.scale" type="number" step="0.1" value="1" />
            </div>
          </div>
          <div class="modal-footer">
            <button @click="addModel" class="btn btn-primary">添加</button>
            <button @click="showAddModelForm = false" class="btn btn-secondary">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import ConfigManager from '@/utils/configManager';
import { CameraConfig, ModelConfig, SkyboxFilterConfig } from '@/utils/configParser';

const configManager = ConfigManager.getInstance();

// 响应式数据
const cameraConfig = reactive<CameraConfig>({
  position: { x: 0.72, y: 3.52, z: 60 },
  lookAt: { x: 0, y: 0, z: 0 },
  monitor: {
    enabled: true,
    interval: 1000,
    logPosition: true,
    logLookAt: true
  }
});

const selectedModelType = ref<'gltfSimplyModels' | 'gltfModels' | 'patrolModels'>('gltfSimplyModels');
const showAddModelForm = ref(false);

const newModel = reactive<Partial<ModelConfig>>({
  name: '',
  url: '',
  type: 'gltf',
  playAction: '',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1
});

const skyboxFilterConfig = reactive<SkyboxFilterConfig>({
  enabled: false,
  color: '#87CEEB',
  intensity: 0.8,
  opacity: 0.6,
  blendMode: 'multiply'
});

// 模型类型选项
const modelTypes = [
  { label: '简化GLTF模型', value: 'gltfSimplyModels' },
  { label: '完整GLTF模型', value: 'gltfModels' },
  { label: '巡逻模型', value: 'patrolModels' }
];

// 计算属性
const currentModelList = computed(() => {
  return configManager.getAllModelConfigs(selectedModelType.value);
});

// 方法
const updateCameraPosition = () => {
  configManager.updateCameraPosition(
    cameraConfig.position.x,
    cameraConfig.position.y,
    cameraConfig.position.z
  );
};

const updateCameraLookAt = () => {
  configManager.updateCameraLookAt(
    cameraConfig.lookAt.x,
    cameraConfig.lookAt.y,
    cameraConfig.lookAt.z
  );
};

const updateCameraMonitor = () => {
  configManager.updateCameraMonitor(cameraConfig.monitor);
};

const updateSkyboxFilter = () => {
  configManager.updateSkyboxFilter(skyboxFilterConfig);
};

const editModel = (model: ModelConfig) => {
  // 这里可以实现编辑模型的逻辑
  console.log('编辑模型:', model);
};

const removeModel = (modelName: string) => {
  if (confirm(`确定要删除模型 "${modelName}" 吗？`)) {
    configManager.removeModelConfig(modelName, selectedModelType.value);
  }
};

const addModel = () => {
  if (!newModel.name || !newModel.url) {
    alert('请填写模型名称和文件路径');
    return;
  }

  const modelConfig: ModelConfig = {
    name: newModel.name!,
    url: newModel.url!,
    type: newModel.type!,
    playAction: newModel.playAction || '',
    position: newModel.position!,
    rotation: newModel.rotation!,
    scale: newModel.scale
  };

  configManager.addModelConfig(modelConfig, selectedModelType.value);
  
  // 重置表单
  Object.assign(newModel, {
    name: '',
    url: '',
    type: 'gltf',
    playAction: '',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1
  });
  
  showAddModelForm.value = false;
};

const saveConfig = () => {
  configManager.saveConfigToFile();
};

const exportConfig = () => {
  try {
    const xmlContent = configManager.exportConfigToXML();
    console.log('导出的配置:', xmlContent);
    // 这里可以将配置发送到服务器或进行其他操作
  } catch (error) {
    console.error('导出配置失败:', error);
  }
};

// 初始化
onMounted(async () => {
  try {
    await configManager.loadConfig('/config/scene-config.xml');
    const config = configManager.getCurrentConfig();
    if (config) {
      Object.assign(cameraConfig, config.camera);
      Object.assign(skyboxFilterConfig, config.skyboxFilter);
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
});
</script>

<style scoped>
.config-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  padding: 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.panel-content {
  padding: 16px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

.config-section {
  margin-bottom: 24px;
}

.config-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.config-group {
  margin-bottom: 12px;
}

.config-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.input-group {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.input-group input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.model-type-selector {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.model-list {
  margin-bottom: 12px;
}

.model-item {
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.model-name {
  font-weight: 500;
  font-size: 13px;
}

.model-actions {
  display: flex;
  gap: 4px;
}

.model-info {
  font-size: 11px;
  color: #666;
  display: flex;
  gap: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h4 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-active {
  background: #1890ff;
  color: white;
}

.btn-small {
  padding: 4px 8px;
  font-size: 11px;
}

.btn-danger {
  background: #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background: #ff7875;
}

.filter-settings {
  margin-top: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.filter-settings .config-group {
  margin-bottom: 16px;
}

.filter-settings input[type="color"] {
  width: 60px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-settings input[type="range"] {
  width: 100%;
  margin-top: 4px;
}

.filter-settings select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.color-value {
  margin-left: 8px;
  font-family: monospace;
  color: #666;
  font-size: 12px;
}
</style> 