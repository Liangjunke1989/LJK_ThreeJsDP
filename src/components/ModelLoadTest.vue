<template>
  <div class="model-load-test">
    <div class="test-header">
      <h2>模型加载测试</h2>
      <div class="test-controls">
        <button @click="loadFromConfig" class="btn btn-primary">从配置加载</button>
        <button @click="loadFromDefault" class="btn btn-secondary">从默认加载</button>
        <button @click="clearModels" class="btn btn-danger">清除模型</button>
      </div>
    </div>

    <div class="test-content">
      <!-- 3D场景容器 -->
      <div id="test-container" class="three-container"></div>

      <!-- 测试信息 -->
      <div class="test-info">
        <h3>测试信息</h3>
        <div class="info-item">
          <strong>配置文件状态:</strong>
          <span :class="configStatus">{{ configStatusText }}</span>
        </div>
        <div class="info-item">
          <strong>模型加载状态:</strong>
          <span :class="modelStatus">{{ modelStatusText }}</span>
        </div>
        <div class="info-item">
          <strong>场景中的模型:</strong>
          <ul>
            <li v-for="model in sceneModels" :key="model">{{ model }}</li>
          </ul>
        </div>
        <div class="info-item">
          <strong>控制台日志:</strong>
          <div class="log-container">
            <div v-for="(log, index) in consoleLogs" :key="index" class="log-item">
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import useThree from '@/hooks/useThree'

// 响应式数据
const threeInstance = ref<any>(null)
const configStatus = ref('loading')
const configStatusText = ref('加载中...')
const modelStatus = ref('idle')
const modelStatusText = ref('未开始')
const sceneModels = ref<string[]>([])
const consoleLogs = ref<string[]>([])

// 拦截控制台日志
const originalConsoleLog = console.log
const originalConsoleError = console.error

const addLog = (message: string, type: 'log' | 'error' = 'log') => {
  const timestamp = new Date().toLocaleTimeString()
  const logMessage = `[${timestamp}] ${message}`
  consoleLogs.value.push(logMessage)
  
  // 保持最多50条日志
  if (consoleLogs.value.length > 50) {
    consoleLogs.value.shift()
  }
}

// 重写控制台方法
console.log = (...args) => {
  originalConsoleLog(...args)
  addLog(args.join(' '), 'log')
}

console.error = (...args) => {
  originalConsoleError(...args)
  addLog(args.join(' '), 'error')
}

// 初始化3D场景
onMounted(async () => {
  try {
    // 初始化Three.js场景
    const three = useThree('test-container')
    threeInstance.value = three
    
    // 等待场景加载完成
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('模型加载测试组件已初始化')
    configStatus.value = 'success'
    configStatusText.value = '已加载'
    
  } catch (error) {
    console.error('初始化失败:', error)
    configStatus.value = 'error'
    configStatusText.value = '初始化失败'
  }
})

// 从配置加载模型
const loadFromConfig = async () => {
  if (!threeInstance.value) return
  
  modelStatus.value = 'loading'
  modelStatusText.value = '加载中...'
  
  try {
    console.log('开始从配置文件加载模型...')
    
    // 这里可以调用具体的加载方法
    // 由于useThree已经集成了配置加载，我们只需要检查结果
    
    // 等待一段时间让模型加载完成
    setTimeout(() => {
      updateSceneModels()
      modelStatus.value = 'success'
      modelStatusText.value = '加载完成'
    }, 3000)
    
  } catch (error) {
    console.error('从配置加载模型失败:', error)
    modelStatus.value = 'error'
    modelStatusText.value = '加载失败'
  }
}

// 从默认配置加载模型
const loadFromDefault = async () => {
  if (!threeInstance.value) return
  
  modelStatus.value = 'loading'
  modelStatusText.value = '加载中...'
  
  try {
    console.log('开始从默认配置加载模型...')
    
    // 这里可以调用默认的加载方法
    
    setTimeout(() => {
      updateSceneModels()
      modelStatus.value = 'success'
      modelStatusText.value = '加载完成'
    }, 3000)
    
  } catch (error) {
    console.error('从默认配置加载模型失败:', error)
    modelStatus.value = 'error'
    modelStatusText.value = '加载失败'
  }
}

// 清除模型
const clearModels = () => {
  if (!threeInstance.value) return
  
  try {
    console.log('清除场景中的模型...')
    
    // 清除模型组中的所有模型
    const modelGroup = threeInstance.value.threeTest.scene.getObjectByName('modelGroup')
    if (modelGroup) {
      while (modelGroup.children.length > 0) {
        modelGroup.remove(modelGroup.children[0])
      }
    }
    
    updateSceneModels()
    modelStatus.value = 'idle'
    modelStatusText.value = '已清除'
    
  } catch (error) {
    console.error('清除模型失败:', error)
  }
}

// 更新场景中的模型列表
const updateSceneModels = () => {
  if (!threeInstance.value) return
  
  try {
    const modelGroup = threeInstance.value.threeTest.scene.getObjectByName('modelGroup')
    if (modelGroup) {
      sceneModels.value = modelGroup.children.map((child: any) => child.name || '未命名模型')
    } else {
      sceneModels.value = []
    }
  } catch (error) {
    console.error('更新模型列表失败:', error)
    sceneModels.value = []
  }
}

// 清理资源
onBeforeUnmount(() => {
  // 恢复原始控制台方法
  console.log = originalConsoleLog
  console.error = originalConsoleError
  
  if (threeInstance.value) {
    console.log('清理Three.js资源')
  }
})
</script>

<style scoped>
.model-load-test {
  width: 100%;
  height: 100vh;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
}

.test-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.test-controls {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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

.btn-danger {
  background: #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background: #ff7875;
}

.test-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
}

.three-container {
  flex: 1;
  background: #000;
  border-radius: 8px;
  min-height: 400px;
}

.test-info {
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-info h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.info-item {
  margin-bottom: 16px;
}

.info-item strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
  font-size: 14px;
}

.info-item span {
  font-size: 14px;
}

.info-item ul {
  margin: 4px 0;
  padding-left: 20px;
}

.info-item li {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

.log-item {
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
  font-family: monospace;
  word-break: break-all;
}

/* 状态样式 */
.loading {
  color: #faad14;
}

.success {
  color: #52c41a;
}

.error {
  color: #ff4d4f;
}

.idle {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-content {
    flex-direction: column;
  }
  
  .test-info {
    width: 100%;
  }
  
  .test-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style> 