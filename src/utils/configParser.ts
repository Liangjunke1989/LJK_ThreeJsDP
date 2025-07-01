/**
 * XML配置解析工具类
 * 用于解析场景配置文件
 */

export interface CameraMonitorConfig {
  enabled: boolean;
  interval: number;
  logPosition: boolean;
  logLookAt: boolean;
}

export interface CameraConfig {
  position: {
    x: number;
    y: number;
    z: number;
  };
  lookAt: {
    x: number;
    y: number;
    z: number;
  };
  monitor: CameraMonitorConfig;
}

export interface SkyboxFilterConfig {
  enabled: boolean;
  color: string;
  intensity: number;
  opacity: number;
  blendMode: string;
}

export interface ModelConfig {
  url: string;
  type: string;
  name: string;
  playAction: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale?: number;
  id?: number;
  callback?: string;
}

export interface LabelConfig {
  color: string;
  name: string;
  value: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
}

export interface FenceConfig {
  visible: boolean;
  points: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  color: string;
}

export interface PatrolPathConfig {
  name: string;
  points: Array<{
    x: number;
    y: number;
    z: number;
  }>;
}

export interface SceneConfig {
  camera: CameraConfig;
  skyboxFilter: SkyboxFilterConfig;
  models: {
    gltfSimplyModels: ModelConfig[];
    gltfModels: ModelConfig[];
    patrolModels: ModelConfig[];
  };
  labels: LabelConfig[];
  fence: FenceConfig;
  patrolPaths: PatrolPathConfig[];
}

export class ConfigParser {
  private static instance: ConfigParser;
  private config: SceneConfig | null = null;

  private constructor() {}

  public static getInstance(): ConfigParser {
    if (!ConfigParser.instance) {
      ConfigParser.instance = new ConfigParser();
    }
    return ConfigParser.instance;
  }

  /**
   * 解析XML配置文件
   * @param xmlString XML字符串
   * @returns 解析后的配置对象
   */
  public parseXML(xmlString: string): SceneConfig {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const config: SceneConfig = {
      camera: this.parseCamera(xmlDoc),
      skyboxFilter: this.parseSkyboxFilter(xmlDoc),
      models: this.parseModels(xmlDoc),
      labels: this.parseLabels(xmlDoc),
      fence: this.parseFence(xmlDoc),
      patrolPaths: this.parsePatrolPaths(xmlDoc)
    };

    this.config = config;
    return config;
  }

  /**
   * 从文件加载配置
   * @param configPath 配置文件路径
   * @returns Promise<SceneConfig>
   */
  public async loadConfig(configPath: string): Promise<SceneConfig> {
    try {
      const response = await fetch(configPath);
      const xmlString = await response.text();
      return this.parseXML(xmlString);
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw error;
    }
  }

  /**
   * 获取已解析的配置
   * @returns SceneConfig | null
   */
  public getConfig(): SceneConfig | null {
    return this.config;
  }

  private parseCamera(xmlDoc: Document): CameraConfig {
    const cameraElement = xmlDoc.querySelector('camera');
    if (!cameraElement) {
      throw new Error('未找到相机配置');
    }

    const positionElement = cameraElement.querySelector('position');
    const lookAtElement = cameraElement.querySelector('lookAt');
    const monitorElement = cameraElement.querySelector('monitor');

    return {
      position: {
        x: parseFloat(positionElement?.querySelector('x')?.textContent || '0'),
        y: parseFloat(positionElement?.querySelector('y')?.textContent || '0'),
        z: parseFloat(positionElement?.querySelector('z')?.textContent || '0')
      },
      lookAt: {
        x: parseFloat(lookAtElement?.querySelector('x')?.textContent || '0'),
        y: parseFloat(lookAtElement?.querySelector('y')?.textContent || '0'),
        z: parseFloat(lookAtElement?.querySelector('z')?.textContent || '0')
      },
      monitor: {
        enabled: monitorElement?.querySelector('enabled')?.textContent === 'true',
        interval: parseInt(monitorElement?.querySelector('interval')?.textContent || '1000'),
        logPosition: monitorElement?.querySelector('logPosition')?.textContent === 'true',
        logLookAt: monitorElement?.querySelector('logLookAt')?.textContent === 'true'
      }
    };
  }

  private parseSkyboxFilter(xmlDoc: Document): SkyboxFilterConfig {
    const filterElement = xmlDoc.querySelector('skybox-filter');
    if (!filterElement) {
      // 返回默认配置
      return {
        enabled: false,
        color: '#87CEEB',
        intensity: 0.8,
        opacity: 0.6,
        blendMode: 'multiply'
      };
    }

    return {
      enabled: filterElement.querySelector('enabled')?.textContent === 'true',
      color: filterElement.querySelector('color')?.textContent || '#87CEEB',
      intensity: parseFloat(filterElement.querySelector('intensity')?.textContent || '0.8'),
      opacity: parseFloat(filterElement.querySelector('opacity')?.textContent || '0.6'),
      blendMode: filterElement.querySelector('blendMode')?.textContent || 'multiply'
    };
  }

  private parseModels(xmlDoc: Document) {
    const modelsElement = xmlDoc.querySelector('models');
    if (!modelsElement) {
      throw new Error('未找到模型配置');
    }

    return {
      gltfSimplyModels: this.parseModelList(modelsElement.querySelector('gltf-simply-models')),
      gltfModels: this.parseModelList(modelsElement.querySelector('gltf-models')),
      patrolModels: this.parseModelList(modelsElement.querySelector('patrol-models'))
    };
  }

  private parseModelList(container: Element | null): ModelConfig[] {
    if (!container) return [];

    const models: ModelConfig[] = [];
    const modelElements = container.querySelectorAll('model');

    modelElements.forEach(modelElement => {
      const model: ModelConfig = {
        url: modelElement.querySelector('url')?.textContent || '',
        type: modelElement.querySelector('type')?.textContent || '',
        name: modelElement.querySelector('name')?.textContent || '',
        playAction: modelElement.querySelector('playAction')?.textContent || '',
        position: this.parsePosition(modelElement.querySelector('position')),
        rotation: this.parsePosition(modelElement.querySelector('rotation')),
        scale: parseFloat(modelElement.querySelector('scale')?.textContent || '1'),
        id: parseInt(modelElement.querySelector('id')?.textContent || '0'),
        callback: modelElement.querySelector('callback')?.textContent || undefined
      };
      models.push(model);
    });

    return models;
  }

  private parseLabels(xmlDoc: Document): LabelConfig[] {
    const labelsElement = xmlDoc.querySelector('labels');
    if (!labelsElement) return [];

    const labels: LabelConfig[] = [];
    const labelElements = labelsElement.querySelectorAll('label');

    labelElements.forEach(labelElement => {
      const label: LabelConfig = {
        color: labelElement.querySelector('color')?.textContent || '#3ac9b0',
        name: labelElement.querySelector('name')?.textContent || '',
        value: labelElement.querySelector('value')?.textContent || '',
        position: this.parsePosition(labelElement.querySelector('position')),
        scale: parseFloat(labelElement.querySelector('scale')?.textContent || '1')
      };
      labels.push(label);
    });

    return labels;
  }

  private parseFence(xmlDoc: Document): FenceConfig {
    const fenceElement = xmlDoc.querySelector('fence');
    if (!fenceElement) {
      throw new Error('未找到围栏配置');
    }

    const points: Array<{x: number, y: number, z: number}> = [];
    const pointElements = fenceElement.querySelectorAll('points point');

    pointElements.forEach(pointElement => {
      points.push({
        x: parseFloat(pointElement.querySelector('x')?.textContent || '0'),
        y: parseFloat(pointElement.querySelector('y')?.textContent || '0'),
        z: parseFloat(pointElement.querySelector('z')?.textContent || '0')
      });
    });

    return {
      visible: fenceElement.querySelector('visible')?.textContent === 'true',
      points,
      color: fenceElement.querySelector('color')?.textContent || 'rgb(51, 188, 176)'
    };
  }

  private parsePatrolPaths(xmlDoc: Document): PatrolPathConfig[] {
    const pathsElement = xmlDoc.querySelector('patrol-paths');
    if (!pathsElement) return [];

    const paths: PatrolPathConfig[] = [];
    const pathElements = pathsElement.querySelectorAll('path');

    pathElements.forEach(pathElement => {
      const name = pathElement.getAttribute('name') || '';
      const points: Array<{x: number, y: number, z: number}> = [];
      const pointElements = pathElement.querySelectorAll('points point');

      pointElements.forEach(pointElement => {
        points.push({
          x: parseFloat(pointElement.querySelector('x')?.textContent || '0'),
          y: parseFloat(pointElement.querySelector('y')?.textContent || '0'),
          z: parseFloat(pointElement.querySelector('z')?.textContent || '0')
        });
      });

      paths.push({ name, points });
    });

    return paths;
  }

  private parsePosition(element: Element | null): {x: number, y: number, z: number} {
    if (!element) return { x: 0, y: 0, z: 0 };

    return {
      x: parseFloat(element.querySelector('x')?.textContent || '0'),
      y: parseFloat(element.querySelector('y')?.textContent || '0'),
      z: parseFloat(element.querySelector('z')?.textContent || '0')
    };
  }
}

export default ConfigParser; 