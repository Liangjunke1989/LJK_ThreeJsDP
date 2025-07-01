<template>
  <div class="skybox-filter-panel">
    <div class="panel-header">
      <h3>天空盒滤镜控制</h3>
      <el-switch
        v-model="filterEnabled"
        @change="handleFilterToggle"
        active-text="启用"
        inactive-text="禁用"
      />
    </div>

    <div v-if="filterEnabled" class="filter-controls">
      <!-- 颜色选择 -->
      <div class="control-item">
        <label>滤镜颜色:</label>
        <el-color-picker
          v-model="filterColor"
          @change="handleColorChange"
          show-alpha
        />
        <span class="color-value">{{ filterColor }}</span>
      </div>

      <!-- 强度控制 -->
      <div class="control-item">
        <label>强度: {{ filterIntensity.toFixed(2) }}</label>
        <el-slider
          v-model="filterIntensity"
          :min="0"
          :max="1"
          :step="0.01"
          @change="handleIntensityChange"
          show-input
        />
      </div>

      <!-- 透明度控制 -->
      <div class="control-item">
        <label>透明度: {{ filterOpacity.toFixed(2) }}</label>
        <el-slider
          v-model="filterOpacity"
          :min="0"
          :max="1"
          :step="0.01"
          @change="handleOpacityChange"
          show-input
        />
      </div>

      <!-- 混合模式选择 -->
      <div class="control-item">
        <label>混合模式:</label>
        <el-select
          v-model="filterBlendMode"
          @change="handleBlendModeChange"
          placeholder="选择混合模式"
        >
          <el-option label="正片叠底" value="multiply" />
          <el-option label="滤色" value="screen" />
          <el-option label="叠加" value="overlay" />
          <el-option label="正常" value="normal" />
        </el-select>
      </div>

      <!-- 预设滤镜 -->
      <div class="control-item">
        <label>预设滤镜:</label>
        <div class="preset-buttons">
          <el-button
            v-for="(preset, key) in filterPresets"
            :key="key"
            size="small"
            @click="applyPreset(key)"
          >
            {{ getPresetName(key) }}
          </el-button>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="control-item">
        <el-button type="warning" @click="resetFilter">重置滤镜</el-button>
      </div>
    </div>

    <!-- 滤镜信息显示 -->
    <div v-if="filterEnabled" class="filter-info">
      <h4>当前滤镜信息</h4>
      <div class="info-item">
        <span>颜色:</span>
        <div class="color-preview" :style="{ backgroundColor: filterColor }"></div>
      </div>
      <div class="info-item">
        <span>强度:</span>
        <span>{{ (filterIntensity * 100).toFixed(0) }}%</span>
      </div>
      <div class="info-item">
        <span>透明度:</span>
        <span>{{ (filterOpacity * 100).toFixed(0) }}%</span>
      </div>
      <div class="info-item">
        <span>混合模式:</span>
        <span>{{ getBlendModeName(filterBlendMode) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { SkyboxFilterPresets } from '@/utils/threeUtils/skyboxFilter'

// Props
interface Props {
  threeInstance?: any
}

const props = withDefaults(defineProps<Props>(), {
  threeInstance: undefined
})

// 响应式数据
const filterEnabled = ref(false)
const filterColor = ref('#87CEEB')
const filterIntensity = ref(0.8)
const filterOpacity = ref(0.6)
const filterBlendMode = ref('multiply')

// 预设滤镜
const filterPresets = SkyboxFilterPresets

// 初始化时获取当前配置
onMounted(() => {
  if (props.threeInstance) {
    const currentConfig = props.threeInstance.getSkyboxFilterConfig()
    if (currentConfig) {
      filterEnabled.value = currentConfig.enabled
      filterColor.value = currentConfig.color
      filterIntensity.value = currentConfig.intensity
      filterOpacity.value = currentConfig.opacity
      filterBlendMode.value = currentConfig.blendMode
    }
  }
})

// 事件处理函数
const handleFilterToggle = (enabled: boolean) => {
  if (props.threeInstance) {
    props.threeInstance.setSkyboxFilterEnabled(enabled)
  }
}

const handleColorChange = (color: string) => {
  if (props.threeInstance) {
    props.threeInstance.setSkyboxFilterColor(color)
  }
}

const handleIntensityChange = (intensity: number) => {
  if (props.threeInstance) {
    props.threeInstance.setSkyboxFilterIntensity(intensity)
  }
}

const handleOpacityChange = (opacity: number) => {
  if (props.threeInstance) {
    props.threeInstance.setSkyboxFilterOpacity(opacity)
  }
}

const handleBlendModeChange = (blendMode: string) => {
  if (props.threeInstance) {
    props.threeInstance.setSkyboxFilterBlendMode(blendMode)
  }
}

// 应用预设滤镜
const applyPreset = (presetKey: string) => {
  const preset = filterPresets[presetKey as keyof typeof filterPresets]
  if (preset && props.threeInstance) {
    filterEnabled.value = preset.enabled
    filterColor.value = preset.color
    filterIntensity.value = preset.intensity
    filterOpacity.value = preset.opacity
    filterBlendMode.value = preset.blendMode
    
    props.threeInstance.updateSkyboxFilter(preset)
  }
}

// 重置滤镜
const resetFilter = () => {
  filterEnabled.value = false
  filterColor.value = '#87CEEB'
  filterIntensity.value = 0.8
  filterOpacity.value = 0.6
  filterBlendMode.value = 'multiply'
  
  if (props.threeInstance) {
    props.threeInstance.updateSkyboxFilter({
      enabled: false,
      color: '#87CEEB',
      intensity: 0.8,
      opacity: 0.6,
      blendMode: 'multiply'
    })
  }
}

// 获取预设名称
const getPresetName = (key: string) => {
  const names: Record<string, string> = {
    blueSky: '蓝天',
    sunset: '夕阳',
    night: '夜晚',
    fog: '雾霾',
    warm: '温暖'
  }
  return names[key] || key
}

// 获取混合模式名称
const getBlendModeName = (blendMode: string) => {
  const names: Record<string, string> = {
    multiply: '正片叠底',
    screen: '滤色',
    overlay: '叠加',
    normal: '正常'
  }
  return names[blendMode] || blendMode
}
</script>

<style scoped>
.skybox-filter-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.filter-controls {
  margin-bottom: 16px;
}

.control-item {
  margin-bottom: 12px;
}

.control-item label {
  display: block;
  margin-bottom: 4px;
  color: #666;
  font-size: 14px;
}

.color-value {
  margin-left: 8px;
  font-family: monospace;
  color: #666;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-buttons .el-button {
  margin: 0;
}

.filter-info {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
}

.filter-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid #ddd;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skybox-filter-panel {
    min-width: 250px;
    padding: 12px;
  }
  
  .preset-buttons {
    flex-direction: column;
  }
  
  .preset-buttons .el-button {
    width: 100%;
  }
}
</style> 