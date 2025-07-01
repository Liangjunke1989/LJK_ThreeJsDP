<template>
  <div class="camera-monitor-panel">
    <div class="panel-header">
      <h3>相机监听控制</h3>
    </div>

    <div class="panel-content">
      <!-- 相机监听配置 -->
      <div class="config-section">
        <h4>监听设置</h4>
        
        <div class="config-group">
          <div class="monitor-switch">
            <input 
              v-model="monitorConfig.enabled" 
              type="checkbox" 
              id="monitor-enabled"
              @change="updateMonitor"
            />
            <label for="monitor-enabled">启用相机监听</label>
          </div>
        </div>
        
        <div class="config-group" v-if="monitorConfig.enabled">
          <label>监听间隔 (毫秒):</label>
          <input 
            v-model.number="monitorConfig.interval" 
            type="number" 
            min="100" 
            step="100"
            @change="updateMonitor"
          />
        </div>
        
        <div class="config-group" v-if="monitorConfig.enabled">
          <label>监听内容:</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input 
                v-model="monitorConfig.logPosition" 
                type="checkbox" 
                id="log-position"
                @change="updateMonitor"
              />
              <label for="log-position">记录相机位置</label>
            </div>
            
            <div class="checkbox-item">
              <input 
                v-model="monitorConfig.logLookAt" 
                type="checkbox" 
                id="log-lookat"
                @change="updateMonitor"
              />
              <label for="log-lookat">记录相机朝向</label>
            </div>
          </div>
        </div>

        <div class="config-group">
          <button @click="saveConfig" class="btn btn-primary">保存配置</button>
          <button @click="exportConfig" class="btn btn-secondary">导出配置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import ConfigManager from '@/utils/configManager';
import { CameraMonitorConfig } from '@/utils/configParser';

const configManager = ConfigManager.getInstance();

// 响应式数据
const monitorConfig = reactive<CameraMonitorConfig>({
  enabled: true,
  interval: 1000,
  logPosition: true,
  logLookAt: true
});

// 方法
const updateMonitor = () => {
  configManager.updateCameraMonitor(monitorConfig);
  console.log('相机监听配置已更新:', monitorConfig);
};

const saveConfig = () => {
  configManager.saveConfigToFile();
};

const exportConfig = () => {
  try {
    const xmlContent = configManager.exportConfigToXML();
    console.log('导出的配置:', xmlContent);
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
      Object.assign(monitorConfig, config.camera.monitor);
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
});
</script>

<style scoped>
.camera-monitor-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
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
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.panel-content {
  padding: 16px;
}

.config-section {
  margin-bottom: 16px;
}

.config-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.config-group {
  margin-bottom: 16px;
}

.config-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.monitor-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monitor-switch input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.monitor-switch label {
  margin: 0;
  font-size: 13px;
  color: #333;
}

.config-group input[type="number"] {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-item input[type="checkbox"] {
  width: 14px;
  height: 14px;
}

.checkbox-item label {
  margin: 0;
  font-size: 12px;
  color: #333;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
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
</style> 