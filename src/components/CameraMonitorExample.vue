<template>
  <div class="camera-monitor-example">
    <h3>相机监听控制示例</h3>
    
    <div class="control-panel">
      <div class="control-group">
        <label>
          <input 
            v-model="monitorEnabled" 
            type="checkbox" 
            @change="toggleMonitor"
          />
          启用相机监听
        </label>
      </div>
      
      <div class="control-group" v-if="monitorEnabled">
        <label>监听间隔 (毫秒):</label>
        <input 
          v-model.number="monitorInterval" 
          type="number" 
          min="100" 
          step="100"
          @change="updateInterval"
        />
      </div>
      
      <div class="control-group" v-if="monitorEnabled">
        <label>监听内容:</label>
        <div class="checkbox-list">
          <label>
            <input 
              v-model="logPosition" 
              type="checkbox" 
              @change="updateLogSettings"
            />
            记录相机位置
          </label>
          <label>
            <input 
              v-model="logLookAt" 
              type="checkbox" 
              @change="updateLogSettings"
            />
            记录相机朝向
          </label>
        </div>
      </div>
      
      <div class="control-group">
        <button @click="saveToFile" class="btn">保存配置到文件</button>
        <button @click="loadFromFile" class="btn">从文件加载配置</button>
      </div>
    </div>
    
    <div class="status-panel">
      <h4>当前状态</h4>
      <p>监听状态: {{ monitorEnabled ? '启用' : '禁用' }}</p>
      <p v-if="monitorEnabled">监听间隔: {{ monitorInterval }}ms</p>
      <p v-if="monitorEnabled">记录位置: {{ logPosition ? '是' : '否' }}</p>
      <p v-if="monitorEnabled">记录朝向: {{ logLookAt ? '是' : '否' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConfigManager from '@/utils/configManager';

const configManager = ConfigManager.getInstance();

// 响应式数据
const monitorEnabled = ref(true);
const monitorInterval = ref(1000);
const logPosition = ref(true);
const logLookAt = ref(true);

// 方法
const toggleMonitor = () => {
  configManager.setCameraMonitorEnabled(monitorEnabled.value);
  console.log('相机监听状态已切换:', monitorEnabled.value);
};

const updateInterval = () => {
  configManager.setCameraMonitorInterval(monitorInterval.value);
  console.log('监听间隔已更新:', monitorInterval.value);
};

const updateLogSettings = () => {
  configManager.setCameraLogPosition(logPosition.value);
  configManager.setCameraLogLookAt(logLookAt.value);
  console.log('日志设置已更新:', { logPosition: logPosition.value, logLookAt: logLookAt.value });
};

const saveToFile = () => {
  configManager.saveConfigToFile('camera-monitor-config.xml');
};

const loadFromFile = async () => {
  try {
    await configManager.loadConfig('/config/scene-config.xml');
    const config = configManager.getCurrentConfig();
    if (config) {
      monitorEnabled.value = config.camera.monitor.enabled;
      monitorInterval.value = config.camera.monitor.interval;
      logPosition.value = config.camera.monitor.logPosition;
      logLookAt.value = config.camera.monitor.logLookAt;
      console.log('配置已从文件加载');
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
};

// 初始化
onMounted(async () => {
  try {
    await configManager.loadConfig('/config/scene-config.xml');
    const config = configManager.getCurrentConfig();
    if (config) {
      monitorEnabled.value = config.camera.monitor.enabled;
      monitorInterval.value = config.camera.monitor.interval;
      logPosition.value = config.camera.monitor.logPosition;
      logLookAt.value = config.camera.monitor.logLookAt;
    }
  } catch (error) {
    console.error('初始化配置失败:', error);
  }
});
</script>

<style scoped>
.camera-monitor-example {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.control-panel {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.control-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.btn {
  padding: 8px 16px;
  margin-right: 8px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #40a9ff;
}

.status-panel {
  background: #e6f7ff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #91d5ff;
}

.status-panel h4 {
  margin: 0 0 12px 0;
  color: #1890ff;
}

.status-panel p {
  margin: 4px 0;
  color: #333;
}
</style> 