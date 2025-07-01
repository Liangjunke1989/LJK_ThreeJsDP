/**
 * 配置管理工具类
 * 提供动态修改和保存配置的功能
 */

import ConfigParser, { SceneConfig, CameraConfig, ModelConfig, CameraMonitorConfig, SkyboxFilterConfig } from './configParser';

export class ConfigManager {
  private static instance: ConfigManager;
  private configParser: ConfigParser;
  private currentConfig: SceneConfig | null = null;

  private constructor() {
    this.configParser = ConfigParser.getInstance();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 加载配置文件
   * @param configPath 配置文件路径
   */
  public async loadConfig(configPath: string): Promise<SceneConfig> {
    try {
      this.currentConfig = await this.configParser.loadConfig(configPath);
      return this.currentConfig;
    } catch (error) {
      console.error('配置加载失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前配置
   */
  public getCurrentConfig(): SceneConfig | null {
    return this.currentConfig;
  }

  /**
   * 更新相机配置
   * @param cameraConfig 新的相机配置
   */
  public updateCameraConfig(cameraConfig: CameraConfig): void {
    if (this.currentConfig) {
      this.currentConfig.camera = cameraConfig;
      console.log('相机配置已更新:', cameraConfig);
    }
  }

  /**
   * 更新相机位置
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   */
  public updateCameraPosition(x: number, y: number, z: number): void {
    if (this.currentConfig) {
      this.currentConfig.camera.position = { x, y, z };
      console.log('相机位置已更新:', { x, y, z });
    }
  }

  /**
   * 更新相机朝向
   * @param x X坐标
   * @param y Y坐标
   * @param z Z坐标
   */
  public updateCameraLookAt(x: number, y: number, z: number): void {
    if (this.currentConfig) {
      this.currentConfig.camera.lookAt = { x, y, z };
      console.log('相机朝向已更新:', { x, y, z });
    }
  }

  /**
   * 更新相机监听配置
   * @param monitorConfig 监听配置
   */
  public updateCameraMonitor(monitorConfig: CameraMonitorConfig): void {
    if (this.currentConfig) {
      this.currentConfig.camera.monitor = monitorConfig;
      console.log('相机监听配置已更新:', monitorConfig);
    }
  }

  /**
   * 开启/关闭相机监听
   * @param enabled 是否启用监听
   */
  public setCameraMonitorEnabled(enabled: boolean): void {
    if (this.currentConfig) {
      this.currentConfig.camera.monitor.enabled = enabled;
      console.log('相机监听状态已更新:', enabled);
    }
  }

  /**
   * 设置监听间隔
   * @param interval 监听间隔（毫秒）
   */
  public setCameraMonitorInterval(interval: number): void {
    if (this.currentConfig) {
      this.currentConfig.camera.monitor.interval = interval;
      console.log('相机监听间隔已更新:', interval);
    }
  }

  /**
   * 设置是否记录相机位置
   * @param logPosition 是否记录位置
   */
  public setCameraLogPosition(logPosition: boolean): void {
    if (this.currentConfig) {
      this.currentConfig.camera.monitor.logPosition = logPosition;
      console.log('相机位置记录状态已更新:', logPosition);
    }
  }

  /**
   * 设置是否记录相机朝向
   * @param logLookAt 是否记录朝向
   */
  public setCameraLogLookAt(logLookAt: boolean): void {
    if (this.currentConfig) {
      this.currentConfig.camera.monitor.logLookAt = logLookAt;
      console.log('相机朝向记录状态已更新:', logLookAt);
    }
  }

  /**
   * 更新天空盒滤镜配置
   * @param filterConfig 滤镜配置
   */
  public updateSkyboxFilter(filterConfig: SkyboxFilterConfig): void {
    if (this.currentConfig) {
      this.currentConfig.skyboxFilter = filterConfig;
      console.log('天空盒滤镜配置已更新:', filterConfig);
    }
  }

  /**
   * 开启/关闭天空盒滤镜
   * @param enabled 是否启用滤镜
   */
  public setSkyboxFilterEnabled(enabled: boolean): void {
    if (this.currentConfig) {
      this.currentConfig.skyboxFilter.enabled = enabled;
      console.log('天空盒滤镜状态已更新:', enabled);
    }
  }

  /**
   * 设置天空盒滤镜颜色
   * @param color 滤镜颜色（十六进制）
   */
  public setSkyboxFilterColor(color: string): void {
    if (this.currentConfig) {
      this.currentConfig.skyboxFilter.color = color;
      console.log('天空盒滤镜颜色已更新:', color);
    }
  }

  /**
   * 设置天空盒滤镜强度
   * @param intensity 滤镜强度 (0-1)
   */
  public setSkyboxFilterIntensity(intensity: number): void {
    if (this.currentConfig) {
      this.currentConfig.skyboxFilter.intensity = Math.max(0, Math.min(1, intensity));
      console.log('天空盒滤镜强度已更新:', intensity);
    }
  }

  /**
   * 设置天空盒滤镜透明度
   * @param opacity 滤镜透明度 (0-1)
   */
  public setSkyboxFilterOpacity(opacity: number): void {
    if (this.currentConfig) {
      this.currentConfig.skyboxFilter.opacity = Math.max(0, Math.min(1, opacity));
      console.log('天空盒滤镜透明度已更新:', opacity);
    }
  }

  /**
   * 设置天空盒滤镜混合模式
   * @param blendMode 混合模式
   */
  public setSkyboxFilterBlendMode(blendMode: string): void {
    if (this.currentConfig) {
      this.currentConfig.skyboxFilter.blendMode = blendMode;
      console.log('天空盒滤镜混合模式已更新:', blendMode);
    }
  }

  /**
   * 获取天空盒滤镜配置
   */
  public getSkyboxFilterConfig(): SkyboxFilterConfig | null {
    return this.currentConfig?.skyboxFilter || null;
  }

  /**
   * 添加模型配置
   * @param modelConfig 模型配置
   * @param type 模型类型 ('gltfSimplyModels' | 'gltfModels' | 'patrolModels')
   */
  public addModelConfig(modelConfig: ModelConfig, type: 'gltfSimplyModels' | 'gltfModels' | 'patrolModels'): void {
    if (this.currentConfig) {
      this.currentConfig.models[type].push(modelConfig);
      console.log(`已添加${type}模型:`, modelConfig.name);
    }
  }

  /**
   * 更新模型配置
   * @param modelName 模型名称
   * @param newConfig 新的模型配置
   * @param type 模型类型
   */
  public updateModelConfig(
    modelName: string, 
    newConfig: Partial<ModelConfig>, 
    type: 'gltfSimplyModels' | 'gltfModels' | 'patrolModels'
  ): void {
    if (this.currentConfig) {
      const modelIndex = this.currentConfig.models[type].findIndex(model => model.name === modelName);
      if (modelIndex !== -1) {
        this.currentConfig.models[type][modelIndex] = {
          ...this.currentConfig.models[type][modelIndex],
          ...newConfig
        };
        console.log(`已更新${type}模型:`, modelName);
      } else {
        console.warn(`未找到模型: ${modelName}`);
      }
    }
  }

  /**
   * 删除模型配置
   * @param modelName 模型名称
   * @param type 模型类型
   */
  public removeModelConfig(modelName: string, type: 'gltfSimplyModels' | 'gltfModels' | 'patrolModels'): void {
    if (this.currentConfig) {
      const modelIndex = this.currentConfig.models[type].findIndex(model => model.name === modelName);
      if (modelIndex !== -1) {
        this.currentConfig.models[type].splice(modelIndex, 1);
        console.log(`已删除${type}模型:`, modelName);
      } else {
        console.warn(`未找到模型: ${modelName}`);
      }
    }
  }

  /**
   * 获取模型配置
   * @param modelName 模型名称
   * @param type 模型类型
   */
  public getModelConfig(modelName: string, type: 'gltfSimplyModels' | 'gltfModels' | 'patrolModels'): ModelConfig | null {
    if (this.currentConfig) {
      return this.currentConfig.models[type].find(model => model.name === modelName) || null;
    }
    return null;
  }

  /**
   * 获取所有模型配置
   * @param type 模型类型
   */
  public getAllModelConfigs(type: 'gltfSimplyModels' | 'gltfModels' | 'patrolModels'): ModelConfig[] {
    if (this.currentConfig) {
      return [...this.currentConfig.models[type]];
    }
    return [];
  }

  /**
   * 导出配置为XML字符串
   */
  public exportConfigToXML(): string {
    if (!this.currentConfig) {
      throw new Error('没有可导出的配置');
    }

    return this.generateXML(this.currentConfig);
  }

  /**
   * 保存配置到文件
   * @param filename 文件名
   */
  public saveConfigToFile(filename: string = 'scene-config.xml'): void {
    if (!this.currentConfig) {
      console.error('没有可保存的配置');
      return;
    }

    const xmlContent = this.exportConfigToXML();
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('配置已保存到文件:', filename);
  }

  /**
   * 生成XML字符串
   */
  private generateXML(config: SceneConfig): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<scene-config>\n';
    
    // 相机配置
    xml += '    <camera>\n';
    xml += '        <position>\n';
    xml += `            <x>${config.camera.position.x}</x>\n`;
    xml += `            <y>${config.camera.position.y}</y>\n`;
    xml += `            <z>${config.camera.position.z}</z>\n`;
    xml += '        </position>\n';
    xml += '        <lookAt>\n';
    xml += `            <x>${config.camera.lookAt.x}</x>\n`;
    xml += `            <y>${config.camera.lookAt.y}</y>\n`;
    xml += `            <z>${config.camera.lookAt.z}</z>\n`;
    xml += '        </lookAt>\n';
    xml += '        <monitor>\n';
    xml += `            <enabled>${config.camera.monitor.enabled}</enabled>\n`;
    xml += `            <interval>${config.camera.monitor.interval}</interval>\n`;
    xml += `            <logPosition>${config.camera.monitor.logPosition}</logPosition>\n`;
    xml += `            <logLookAt>${config.camera.monitor.logLookAt}</logLookAt>\n`;
    xml += '        </monitor>\n';
    xml += '    </camera>\n';
    
    // 天空盒滤镜配置
    xml += '    <skybox-filter>\n';
    xml += `        <enabled>${config.skyboxFilter.enabled}</enabled>\n`;
    xml += `        <color>${config.skyboxFilter.color}</color>\n`;
    xml += `        <intensity>${config.skyboxFilter.intensity}</intensity>\n`;
    xml += `        <opacity>${config.skyboxFilter.opacity}</opacity>\n`;
    xml += `        <blendMode>${config.skyboxFilter.blendMode}</blendMode>\n`;
    xml += '    </skybox-filter>\n';
    
    // 模型配置
    xml += '    <models>\n';
    
    // 简化GLTF模型
    xml += '        <gltf-simply-models>\n';
    config.models.gltfSimplyModels.forEach(model => {
      xml += this.generateModelXML(model);
    });
    xml += '        </gltf-simply-models>\n';
    
    // 完整GLTF模型
    xml += '        <gltf-models>\n';
    config.models.gltfModels.forEach(model => {
      xml += this.generateModelXML(model);
    });
    xml += '        </gltf-models>\n';
    
    // 巡逻模型
    xml += '        <patrol-models>\n';
    config.models.patrolModels.forEach(model => {
      xml += this.generateModelXML(model);
    });
    xml += '        </patrol-models>\n';
    
    xml += '    </models>\n';
    
    // 标签配置
    xml += '    <labels>\n';
    config.labels.forEach(label => {
      xml += this.generateLabelXML(label);
    });
    xml += '    </labels>\n';
    
    // 围栏配置
    xml += '    <fence>\n';
    xml += `        <visible>${config.fence.visible}</visible>\n`;
    xml += '        <points>\n';
    config.fence.points.forEach(point => {
      xml += `            <point>\n`;
      xml += `                <x>${point.x}</x>\n`;
      xml += `                <y>${point.y}</y>\n`;
      xml += `                <z>${point.z}</z>\n`;
      xml += `            </point>\n`;
    });
    xml += '        </points>\n';
    xml += `        <color>${config.fence.color}</color>\n`;
    xml += '    </fence>\n';
    
    // 巡逻路径配置
    xml += '    <patrol-paths>\n';
    config.patrolPaths.forEach(path => {
      xml += `        <path name="${path.name}">\n`;
      xml += '            <points>\n';
      path.points.forEach(point => {
        xml += `                <point>\n`;
        xml += `                    <x>${point.x}</x>\n`;
        xml += `                    <y>${point.y}</y>\n`;
        xml += `                    <z>${point.z}</z>\n`;
        xml += `                </point>\n`;
      });
      xml += '            </points>\n';
      xml += '        </path>\n';
    });
    xml += '    </patrol-paths>\n';
    
    xml += '</scene-config>';
    return xml;
  }

  /**
   * 生成模型XML
   */
  private generateModelXML(model: ModelConfig): string {
    let xml = '            <model>\n';
    if (model.id !== undefined) {
      xml += `                <id>${model.id}</id>\n`;
    }
    xml += `                <url>${model.url}</url>\n`;
    xml += `                <type>${model.type}</type>\n`;
    xml += `                <name>${model.name}</name>\n`;
    xml += `                <playAction>${model.playAction}</playAction>\n`;
    xml += '                <position>\n';
    xml += `                    <x>${model.position.x}</x>\n`;
    xml += `                    <y>${model.position.y}</y>\n`;
    xml += `                    <z>${model.position.z}</z>\n`;
    xml += '                </position>\n';
    xml += '                <rotation>\n';
    xml += `                    <x>${model.rotation.x}</x>\n`;
    xml += `                    <y>${model.rotation.y}</y>\n`;
    xml += `                    <z>${model.rotation.z}</z>\n`;
    xml += '                </rotation>\n';
    if (model.scale !== undefined) {
      xml += `                <scale>${model.scale}</scale>\n`;
    }
    if (model.callback) {
      xml += `                <callback>${model.callback}</callback>\n`;
    }
    xml += '            </model>\n';
    return xml;
  }

  /**
   * 生成标签XML
   */
  private generateLabelXML(label: any): string {
    let xml = '        <label>\n';
    xml += `            <color>${label.color}</color>\n`;
    xml += `            <name>${label.name}</name>\n`;
    xml += `            <value>${label.value}</value>\n`;
    xml += '            <position>\n';
    xml += `                <x>${label.position.x}</x>\n`;
    xml += `                <y>${label.position.y}</y>\n`;
    xml += `                <z>${label.position.z}</z>\n`;
    xml += '            </position>\n';
    xml += `            <scale>${label.scale}</scale>\n`;
    xml += '        </label>\n';
    return xml;
  }

  /**
   * 设置围栏可见性
   * @param visible 是否可见
   */
  public setFenceVisible(visible: boolean): void {
    if (this.currentConfig) {
      this.currentConfig.fence.visible = visible;
      console.log('围栏可见性已更新:', visible);
    }
  }

  /**
   * 更新围栏颜色
   * @param color 围栏颜色
   */
  public setFenceColor(color: string): void {
    if (this.currentConfig) {
      this.currentConfig.fence.color = color;
      console.log('围栏颜色已更新:', color);
    }
  }

  /**
   * 更新围栏顶点
   * @param points 围栏顶点数组
   */
  public setFencePoints(points: Array<{x: number, y: number, z: number}>): void {
    if (this.currentConfig) {
      this.currentConfig.fence.points = points;
      console.log('围栏顶点已更新:', points);
    }
  }

  /**
   * 获取围栏配置
   */
  public getFenceConfig(): any {
    return this.currentConfig?.fence || null;
  }
}

export default ConfigManager; 