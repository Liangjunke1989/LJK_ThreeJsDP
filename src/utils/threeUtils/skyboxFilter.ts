/**
 * 天空盒滤镜工具类
 * 用于创建和管理天空盒滤镜效果
 * 注意：此滤镜只影响天空盒的视觉效果，不会改变场景中的灯光和模型光照
 */

import * as THREE from 'three';
import { SkyboxFilterConfig } from '../configParser';

export class SkyboxFilter {
  private scene: THREE.Scene;
  private filterMesh: THREE.Mesh | null = null;
  private filterMaterial: THREE.ShaderMaterial | null = null;
  private config: SkyboxFilterConfig;
  private originalBackground: THREE.Texture | THREE.Color | THREE.CubeTexture | null = null;

  constructor(scene: THREE.Scene, config: SkyboxFilterConfig) {
    this.scene = scene;
    this.config = config;
    // 保存原始背景
    this.originalBackground = scene.background;
  }

  /**
   * 创建天空盒滤镜
   * 注意：此滤镜只影响天空盒的视觉效果，不会改变场景中的灯光
   */
  public createFilter(): void {
    if (!this.config.enabled) {
      this.removeFilter();
      return;
    }

    // 创建球体几何体作为滤镜容器
    const geometry = new THREE.SphereGeometry(1000, 32, 32);
    
    // 创建着色器材质 - 纯视觉效果，不影响光照
    this.filterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        filterColor: { value: new THREE.Color(this.config.color) },
        intensity: { value: this.config.intensity },
        opacity: { value: this.config.opacity },
        blendMode: { value: this.getBlendModeValue(this.config.blendMode) },
        // 添加背景纹理uniform
        backgroundTexture: { value: this.scene.background }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vViewDirection;
        varying vec2 vUv;
        
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          // 计算视线方向
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDirection = normalize(viewPosition.xyz);
          
          // 计算UV坐标用于背景纹理采样
          vUv = uv;
          
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 filterColor;
        uniform float intensity;
        uniform float opacity;
        uniform int blendMode;
        uniform samplerCube backgroundTexture;
        
        varying vec3 vWorldPosition;
        varying vec3 vViewDirection;
        varying vec2 vUv;
        
        void main() {
          // 计算基于世界位置的渐变效果
          vec3 worldPos = normalize(vWorldPosition);
          float gradient = (worldPos.y + 1.0) * 0.5;
          
          // 添加一些基于视线方向的微妙变化
          float viewFactor = abs(dot(worldPos, vViewDirection));
          
          // 应用滤镜颜色和强度
          vec3 filteredColor = mix(vec3(1.0), filterColor, intensity);
          
          // 根据混合模式计算最终颜色
          vec3 finalColor;
          if (blendMode == 0) {
            // multiply - 正片叠底，使天空变暗
            finalColor = filteredColor * gradient;
          } else if (blendMode == 1) {
            // screen - 滤色，使天空变亮
            finalColor = 1.0 - (1.0 - filteredColor) * (1.0 - gradient);
          } else if (blendMode == 2) {
            // overlay - 叠加，增强对比度
            finalColor = mix(
              2.0 * filteredColor * gradient,
              1.0 - 2.0 * (1.0 - filteredColor) * (1.0 - gradient),
              step(0.5, gradient)
            );
          } else {
            // normal - 正常混合
            finalColor = mix(vec3(1.0), filteredColor, gradient * intensity);
          }
          
          // 添加轻微的视线方向变化
          finalColor = mix(finalColor, finalColor * (0.9 + 0.1 * viewFactor), 0.1);
          
          // 确保完全不参与光照计算，只输出颜色
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      // 关键设置：确保不影响光照计算
      lights: false,
      // 禁用所有光照相关计算
      fog: false,
      // 设置为纯视觉效果材质
      blending: THREE.NormalBlending,
      // 确保不参与阴影计算
      shadowSide: undefined
    });

    // 创建滤镜网格
    this.filterMesh = new THREE.Mesh(geometry, this.filterMaterial);
    this.filterMesh.name = 'skyboxFilter';
    
    // 设置渲染顺序，确保在天空盒之后渲染，在模型之前渲染
    this.filterMesh.renderOrder = 1;
    
    // 禁用阴影相关设置
    this.filterMesh.castShadow = false;
    this.filterMesh.receiveShadow = false;
    
    // 设置用户数据，标记为滤镜对象
    this.filterMesh.userData = {
      isSkyboxFilter: true,
      affectsLighting: false,
      type: 'visualEffect'
    };
    
    // 添加到场景
    this.scene.add(this.filterMesh);
    
    console.log('天空盒滤镜已创建，仅影响天空盒视觉效果，不影响场景光照');
  }

  /**
   * 更新滤镜配置
   * @param config 新的滤镜配置
   */
  public updateFilter(config: SkyboxFilterConfig): void {
    this.config = config;
    
    if (config.enabled) {
      if (this.filterMaterial) {
        // 更新现有材质
        this.filterMaterial.uniforms.filterColor.value.set(config.color);
        this.filterMaterial.uniforms.intensity.value = config.intensity;
        this.filterMaterial.uniforms.opacity.value = config.opacity;
        this.filterMaterial.uniforms.blendMode.value = this.getBlendModeValue(config.blendMode);
      } else {
        // 创建新的滤镜
        this.createFilter();
      }
    } else {
      this.removeFilter();
    }
  }

  /**
   * 移除滤镜
   */
  public removeFilter(): void {
    if (this.filterMesh) {
      this.scene.remove(this.filterMesh);
      this.filterMesh.geometry.dispose();
      if (this.filterMaterial) {
        this.filterMaterial.dispose();
      }
      this.filterMesh = null;
      this.filterMaterial = null;
    }
  }

  /**
   * 设置滤镜颜色
   * @param color 颜色值（十六进制字符串）
   */
  public setColor(color: string): void {
    if (this.filterMaterial) {
      this.filterMaterial.uniforms.filterColor.value.set(color);
    }
    this.config.color = color;
  }

  /**
   * 设置滤镜强度
   * @param intensity 强度值 (0-1)
   */
  public setIntensity(intensity: number): void {
    if (this.filterMaterial) {
      this.filterMaterial.uniforms.intensity.value = Math.max(0, Math.min(1, intensity));
    }
    this.config.intensity = intensity;
  }

  /**
   * 设置滤镜透明度
   * @param opacity 透明度值 (0-1)
   */
  public setOpacity(opacity: number): void {
    if (this.filterMaterial) {
      this.filterMaterial.uniforms.opacity.value = Math.max(0, Math.min(1, opacity));
    }
    this.config.opacity = opacity;
  }

  /**
   * 设置混合模式
   * @param blendMode 混合模式
   */
  public setBlendMode(blendMode: string): void {
    if (this.filterMaterial) {
      this.filterMaterial.uniforms.blendMode.value = this.getBlendModeValue(blendMode);
    }
    this.config.blendMode = blendMode;
  }

  /**
   * 获取混合模式数值
   * @param blendMode 混合模式字符串
   * @returns 混合模式数值
   */
  private getBlendModeValue(blendMode: string): number {
    switch (blendMode.toLowerCase()) {
      case 'multiply':
        return 0;
      case 'screen':
        return 1;
      case 'overlay':
        return 2;
      case 'normal':
      default:
        return 3;
    }
  }

  /**
   * 获取当前配置
   * @returns 当前滤镜配置
   */
  public getConfig(): SkyboxFilterConfig {
    return { ...this.config };
  }

  /**
   * 销毁滤镜，清理资源
   */
  public dispose(): void {
    this.removeFilter();
  }

  /**
   * 检查滤镜是否影响光照
   * @returns 是否影响光照
   */
  public isAffectingLighting(): boolean {
    return false; // 天空盒滤镜永远不会影响光照
  }
}

/**
 * 创建天空盒滤镜实例
 * @param scene Three.js场景
 * @param config 滤镜配置
 * @returns 天空盒滤镜实例
 */
export function createSkyboxFilter(scene: THREE.Scene, config: SkyboxFilterConfig): SkyboxFilter {
  return new SkyboxFilter(scene, config);
}

/**
 * 预设的天空盒滤镜配置
 */
export const SkyboxFilterPresets = {
  // 蓝天滤镜
  blueSky: {
    enabled: true,
    color: '#87CEEB',
    intensity: 0.8,
    opacity: 0.6,
    blendMode: 'multiply'
  },
  
  // 夕阳滤镜
  sunset: {
    enabled: true,
    color: '#FF6B35',
    intensity: 0.7,
    opacity: 0.5,
    blendMode: 'overlay'
  },
  
  // 夜晚滤镜
  night: {
    enabled: true,
    color: '#1E3A8A',
    intensity: 0.9,
    opacity: 0.8,
    blendMode: 'multiply'
  },
  
  // 雾霾滤镜
  fog: {
    enabled: true,
    color: '#D3D3D3',
    intensity: 0.6,
    opacity: 0.4,
    blendMode: 'screen'
  },
  
  // 温暖滤镜
  warm: {
    enabled: true,
    color: '#FFD700',
    intensity: 0.5,
    opacity: 0.3,
    blendMode: 'overlay'
  }
}; 