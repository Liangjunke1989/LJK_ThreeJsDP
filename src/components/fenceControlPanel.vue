<template>
  <div class="fence-control-panel">
    <div class="panel-header">
      <h3>围栏控制面板</h3>
    </div>
    
    <div class="panel-content">
      <div class="control-group">
        <h4>显示控制</h4>
        <div class="control-item">
          <label>围栏可见性:</label>
          <el-switch
            v-model="fenceConfig.visible"
            @change="updateFenceVisible"
            active-text="显示"
            inactive-text="隐藏"
          />
        </div>
      </div>

      <div class="control-group">
        <h4>颜色设置</h4>
        <div class="control-item">
          <label>围栏颜色:</label>
          <el-color-picker
            v-model="fenceConfig.color"
            @change="updateFenceColor"
            show-alpha
          />
        </div>
      </div>

      <div class="control-group">
        <h4>配置信息</h4>
        <div class="info-item">
          <span>顶点数量:</span>
          <span>{{ fenceConfig.points.length }}</span>
        </div>
        <div class="info-item">
          <span>当前颜色:</span>
          <span>{{ fenceConfig.color }}</span>
        </div>
        <div class="info-item">
          <span>可见状态:</span>
          <span :class="fenceConfig.visible ? 'status-visible' : 'status-hidden'">
            {{ fenceConfig.visible ? '显示' : '隐藏' }}
          </span>
        </div>
      </div>

      <div class="control-group">
        <h4>操作</h4>
        <div class="button-group">
          <el-button type="primary" @click="saveConfig">
            保存配置
          </el-button>
          <el-button type="success" @click="exportConfig">
            导出配置
          </el-button>
          <el-button type="warning" @click="resetConfig">
            重置配置
          </el-button>
        </div>
      </div>

      <div class="control-group">
        <h4>快速操作</h4>
        <div class="button-group">
          <el-button type="info" @click="toggleFence">
            {{ fenceConfig.visible ? '隐藏围栏' : '显示围栏' }}
          </el-button>
          <el-button type="primary" @click="setDefaultColor">
            默认颜色
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import ConfigManager from '@/utils/configManager';

const configManager = ConfigManager.getInstance();

// 围栏配置
const fenceConfig = reactive({
  visible: true,
  color: 'rgb(51, 188, 176)',
  points: [] as Array<{x: number, y: number, z: number}>
});

// 更新围栏可见性
const updateFenceVisible = (visible: boolean) => {
  configManager.setFenceVisible(visible);
  console.log('围栏可见性已更新:', visible);
};

// 更新围栏颜色
const updateFenceColor = (color: string) => {
  configManager.setFenceColor(color);
  console.log('围栏颜色已更新:', color);
};

// 保存配置
const saveConfig = () => {
  configManager.saveConfigToFile();
};

// 导出配置
const exportConfig = () => {
  try {
    const xmlContent = configManager.exportConfigToXML();
    console.log('导出的配置:', xmlContent);
  } catch (error) {
    console.error('导出配置失败:', error);
  }
};

// 重置配置
const resetConfig = () => {
  fenceConfig.visible = true;
  fenceConfig.color = 'rgb(51, 188, 176)';
  updateFenceVisible(true);
  updateFenceColor('rgb(51, 188, 176)');
  console.log('围栏配置已重置');
};

// 切换围栏显示
const toggleFence = () => {
  fenceConfig.visible = !fenceConfig.visible;
  updateFenceVisible(fenceConfig.visible);
};

// 设置默认颜色
const setDefaultColor = () => {
  fenceConfig.color = 'rgb(51, 188, 176)';
  updateFenceColor(fenceConfig.color);
};

// 初始化
onMounted(async () => {
  try {
    await configManager.loadConfig('/config/scene-config.xml');
    const config = configManager.getFenceConfig();
    if (config) {
      Object.assign(fenceConfig, config);
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
});
</script>

<style scoped>
.fence-control-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
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
  color: #333;
}

.panel-content {
  padding: 16px;
}

.control-group {
  margin-bottom: 20px;
}

.control-group h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.control-item label {
  font-size: 14px;
  color: #666;
  flex: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-item span:first-child {
  color: #666;
}

.info-item span:last-child {
  color: #333;
  font-weight: 500;
}

.status-visible {
  color: #67c23a;
  font-weight: 600;
}

.status-hidden {
  color: #f56c6c;
  font-weight: 600;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.button-group .el-button {
  width: 100%;
}
</style> 