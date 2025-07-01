import * as THREE from "three";
import { Object3D, Object3DEventMap } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import TWEEN from "@tweenjs/tween.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

import {EffectComposer} from "postprocessing";
import {RenderPass} from 'postprocessing';
import {ShaderPass} from 'postprocessing';

interface WH {
  width: number;
  height: number;
}
export class Three3D {
  public readonly scene!: THREE.Scene; // 网格
  public readonly camera!: THREE.PerspectiveCamera; // 相机
  public controls!: any;
  private renderer!: THREE.WebGLRenderer; // WebGL渲染器
  private dome: HTMLElement | null;
  private wh: WH | undefined;
  private readonly modelGroup!: THREE.Group; // 模型组
  private readonly ActionsMixer!: Map<string, THREE.AnimationMixer[]>;
  private readonly clock!: THREE.Clock;
  private readonly id: string;
  labelRenderer: any;
  css3Renderer: any;
  private filterMaterial!: THREE.ShaderMaterial;
  constructor(id: string) {
    this.id = id;
    this.dome = document.querySelector(`#${id}`);
    if (!this.dome) return;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = "absolute";
    // 相对标签原位置位置偏移大小
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.left = "0px";
    labelRenderer.domElement.style.pointerEvents = "none";
    this.labelRenderer = labelRenderer;
    this.dome.appendChild(labelRenderer.domElement);

    // 创建一个CSS3渲染器CSS3DRenderer
    const css3Renderer = new CSS3DRenderer();
    css3Renderer.domElement.style.position = "absolute";
    css3Renderer.domElement.style.top = "0px";
    // css3Renderer.domElement.style.left = "0px";
    css3Renderer.domElement.style.pointerEvents = "none";
    this.css3Renderer = css3Renderer;
    this.dome.appendChild(css3Renderer.domElement);

    this.wh = {
      width: this.dome.clientWidth,
      height: this.dome.clientHeight,
    };

    this.scene = new THREE.Scene();
    // this.camera = new CreateCamera(this.wh.width, this.wh.height);
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.wh.width / this.wh.height,
      1,
      10000,
    );
    this.camera.position.set(0, 10, 150);
    this.clock = new THREE.Clock();
    // 创建模型组
    this.modelGroup = new THREE.Group();
    this.modelGroup.name = "modelGroup";
    this.scene.add(this.modelGroup);
    // 动画
    this.ActionsMixer = new Map<string, THREE.AnimationMixer[]>();

    this.filterMaterial = new THREE.ShaderMaterial({
      // ... 其他设置
      lights: false,  // 关键：不参与光照计算
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false
    });
  }
  // 光源添加须在渲染之前，因此这里手动调用
  init() {
    if (this.renderer) return this;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true, //渲染器透明
      antialias: true, //抗锯齿
      precision: "highp", //着色器开启高精度
      // logarithmicDepthBuffer: true, // 是否使用对数深度缓存
    });
    this.renderer!.setSize(this.wh!.width, this.wh!.height);
    this.renderer.render(this.scene, this.camera); //执行渲染操作
    this.dome!.appendChild(this.renderer.domElement);
    this.dome!.addEventListener("click", this.onMouseClick, false); //点击事件
    this.controls = new CreateControls(this.camera, this.dome);
    this.animate();
    this.resize();
    return this;
  }
  // 添加模型
  addModel(mesh: Object3D<Object3DEventMap>, actions?: THREE.AnimationMixer[]) {
    this.modelGroup.add(mesh);
    if (actions) this.addActionsMixer(mesh.name, actions);
    console.log(this.modelGroup);
  }
  // 添加光线
  addLight(mesh: any) {
    this.addScene(mesh);
  }

  

  // 添加到场景
  addScene(mesh: any) {
    this.scene.add(mesh);
    console.log(this.scene);
  }
  // 辅助坐标系
  axesHelper() {
    const AxesHelper = new THREE.AxesHelper(10000);
    AxesHelper.name = "辅助坐标系";
    this.addScene(AxesHelper);
  }
  // 背景
  background() {
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath("texture/sky/")
      .load([
        "sky.left.jpg",
        "sky.right.jpg",
        "sky.top.jpg",
        "sky.bottom.jpg",
        "sky.back.jpg",
        "sky.front.jpg",
      ]);
  }
  resize = () => {
    this.dome = document.querySelector(`#${this.id}`);
    if (!this.dome || !this.wh || !this.renderer) return;
    this.wh.width = this.dome.clientWidth; //宽度
    this.wh.height = this.dome.clientHeight; //高度
    this.camera!.updateProjectionMatrix();
    this.renderer!.setSize(this.wh.width, this.wh.height);
    this.labelRenderer.setSize(this.wh.width, this.wh.height);
    this.css3Renderer.setSize(this.wh.width, this.wh.height);
  };
  // 添加动画
  private addActionsMixer(key: string, actions: THREE.AnimationMixer[]) {
    this.ActionsMixer.set(key, actions);
  }
  private animate = () => {
    TWEEN.update();
    const dt = this.clock.getDelta();
    // 循环update动画才会更新
    this.ActionsMixer.forEach((actions) => {
      actions.forEach((action: { update: (arg0: number) => void }) => {
        action.update(dt);
      });
    });
    requestAnimationFrame(this.animate);
    this.controls.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    this.css3Renderer.render(this.scene, this.camera);
  };

  private effectComposer() {
    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));
  }

  // 鼠标点击事件处理
  private onMouseClick = (event: any) => {
    event.preventDefault();
    
    // 创建射线投射器
    const raycaster = new THREE.Raycaster();
    
    // 计算鼠标位置
    const mouse = new THREE.Vector2();
    mouse.x = (event.offsetX / this.wh!.width) * 2 - 1;
    mouse.y = -(event.offsetY / this.wh!.height) * 2 + 1;
    
    // 设置射线
    raycaster.setFromCamera(mouse, this.camera);
    
    // 获取所有可点击的对象（包括模型组中的对象）
    const objectsToCheck = [
      ...this.scene.children,
      ...this.modelGroup.children
    ];
    
    // 检测射线与对象的相交
    const intersects = raycaster.intersectObjects(objectsToCheck, true);
    
    if (intersects.length > 0) {
      const selected = intersects[0];
      const clickedObject = selected.object;
      
      // 获取物体的详细信息
      const objectInfo = this.getObjectInfo(clickedObject);
      
      // 在控制台中显示物体信息
      console.log('=== 点击的物体信息 ===');
      console.log('物体名称:', objectInfo.name);
      console.log('物体类型:', objectInfo.type);
      console.log('物体位置:', objectInfo.position);
      console.log('物体旋转:', objectInfo.rotation);
      console.log('物体缩放:', objectInfo.scale);
      console.log('是否可见:', objectInfo.visible);
      console.log('用户数据:', objectInfo.userData);
      console.log('点击位置:', {
        x: Math.floor(selected.point.x * 100) / 100,
        y: Math.floor(selected.point.y * 100) / 100,
        z: Math.floor(selected.point.z * 100) / 100
      });
      console.log('距离:', Math.floor(selected.distance * 100) / 100);
      console.log('=====================');
      
      // 如果是模型组中的对象，显示额外信息
      if (this.modelGroup.children.includes(clickedObject)) {
        console.log('📦 这是模型组中的对象');
      }
      
      // 如果是特定类型的对象，显示特殊信息
      if (clickedObject.name === '围栏') {
        console.log('🏗️ 这是围栏区域');
      } else if (clickedObject.name === 'modelGroup') {
        console.log('📁 这是模型组容器');
      } else if (clickedObject.name === 'skyboxFilter') {
        console.log('🌅 这是天空盒滤镜');
      }
      
    } else {
      console.log('❌ 没有点击到任何物体');
    }
  };

  // 获取物体的详细信息
  private getObjectInfo(object: THREE.Object3D) {
    return {
      name: object.name || '未命名',
      type: object.type || '未知类型',
      position: {
        x: Math.floor(object.position.x * 100) / 100,
        y: Math.floor(object.position.y * 100) / 100,
        z: Math.floor(object.position.z * 100) / 100
      },
      rotation: {
        x: Math.floor(object.rotation.x * 100) / 100,
        y: Math.floor(object.rotation.y * 100) / 100,
        z: Math.floor(object.rotation.z * 100) / 100
      },
      scale: {
        x: Math.floor(object.scale.x * 100) / 100,
        y: Math.floor(object.scale.y * 100) / 100,
        z: Math.floor(object.scale.z * 100) / 100
      },
      visible: object.visible,
      userData: object.userData || {}
    };
  }
}

// 射线
class Raycaster {
  protected readonly event: any;
  protected readonly camera: THREE.PerspectiveCamera;
  constructor(event: any, camera: THREE.PerspectiveCamera) {
    this.event = event;
    this.camera = camera;
  }
  init() {
    const raycaster = new THREE.Raycaster(
      this.camera.position,
      this.normalize(),
    );
    raycaster.camera = this.camera;
    return raycaster;
  }
  protected normalize = () => {
    const vector = new THREE.Vector3(
      (this.event.offsetX / window.innerWidth) * 2 - 1,
      -(this.event.offsetY / window.innerHeight) * 2 + 1,
      0.5,
    ); //三维坐标对象
    vector.unproject(this.camera);
    return vector.sub(this.camera.position).normalize();
  };
}

interface Controls {
  enableZoom?: boolean; // 启用或禁用摄像机的缩放。==>true
  zoomSpeed?: number; // 摄像机缩放的速度 ==>0.5
  enableDamping?: boolean; //启用阻尼   ==> true
  maxDistance?: number; // 相机向外移动多少 ==> 1000
  minDistance?: number; // 相机向内移动多少  ==> 30
  rotateSpeed?: number; // 旋转的速度  ==> 0.5
  maxPolarAngle?: number; // 垂直旋转的角度的上限，范围是0到Math.PI  ==> Math.PI / 2
  maxAzimuthAngle?: number; // 水平旋转的角度的上限，范围是-Math.PI到Math.PI（或Infinity无限制）  ==> Math.PI / 4,
  minAzimuthAngle?: number; // 水平旋转的角度的下限，范围是-Math.PI到Math.PI（或-Infinity无限制）  ==> -Math.PI / 4,
}
// 轨道控制器
class CreateControls {
  public readonly controls: any;
  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLElement | null,
    params?: Controls,
  ) {
    const controls = new OrbitControls(camera, domElement);
    const {
      enableZoom = true,
      zoomSpeed = 0.5,
      enableDamping = true,
      maxDistance = 1000,
      minDistance = 0,
      rotateSpeed = 0.5,
      maxPolarAngle = Math.PI / 2,
    } = params || {};
    controls.enableZoom = enableZoom; // 启用或禁用摄像机的缩放。
    controls.zoomSpeed = zoomSpeed; // 摄像机缩放的速度
    controls.enableDamping = enableDamping; //启用阻尼
    controls.maxDistance = maxDistance; // 相机向外移动多少
    controls.minDistance = minDistance; // 相机向内移动多少
    controls.rotateSpeed = rotateSpeed; //旋转的速度
    controls.maxPolarAngle = maxPolarAngle; //垂直旋转的角度的上限，范围是0到Math.PI
    controls.screenSpacePanning = false;
    this.controls = controls;
  }
  setCameraLookAt(position: Vector3) {
    this.controls.target.set(position.x, position.y, position.z);
    this.controls.update();
  }
}

type Vector3 = {
  x: number;
  y: number;
  z: number;
};
