import {onMounted, ref, onBeforeUnmount} from "vue";
import {Three3D} from "@/utils/threeUtils/three";
import {createAmbientLight} from "@/utils/threeUtils/lightThree";
import {createDirectionalLight} from "@/utils/threeUtils/lightThree";
import {
    loadGltf,
    loadLJKGltf,
    getModel,
    loadFbx,
    Patrol,
    createLine,
    getActions,
    playActiveAction,
    createFace,
    pointInThis,
    setGeometryStyle,
} from "@/utils/threeUtils/modelThree";
import {createLabel} from "@/utils/threeUtils/SpriteThree";
import DeviceSpriteDom from "@/utils/createDom/device";
import {circleShader} from "@/utils/threeUtils/shader";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";


let threeTest: Three3D;

const resize = () => {
    if (!threeTest) return;
    threeTest.resize();
};

const initThree = (id: string) => {
    threeTest = new Three3D(id).init();
    //初始化相机位置
    threeTest.camera.position.set(0.72, 3.52, 60);
    threeTest.controls.setCameraLookAt({
      x: 0,
      y: 0,
      z: 0,
    });
    // 添加一个监听器，每秒打印一次相机位置
    const interval = setInterval(() => {
      console.log("相机位置", threeTest.camera.position);
      console.log("相机朝向", threeTest.camera.lookAt);
    }, 1000);
    // 在组件卸载时清除定时器
    onBeforeUnmount(() => {
      clearInterval(interval);
    });
    //TEST
  
    // 辅助坐标
    //threeTest.axesHelper();
    threeTest.background(); //天空盒背景
    //添加平行光
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 18); // 颜色为白色，强度为1
    threeTest.addLight(createDirectionalLight("平行光",{intensity: 8, color: 0xffffff},{x: 15, y: 30, z:30}));
    threeTest.addLight(createDirectionalLight("平行光",{intensity: 2, color: 0xffffff},{x: -15, y: 30, z:-30}));
    threeTest.addScene(createAmbientLight("环境光", {intensity: 2, color: 0xffffff})); // 环境光
    // 创建一个地板
    const geometry = new THREE.CircleGeometry(500, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xbedaff});
    const circle = new THREE.Mesh(geometry, material);
    circle.rotateX(-Math.PI / 2);
    threeTest.addScene(circle);
    window.addEventListener("resize", resize);
    // 加载模型
    //addGltf(gltfModelList); // 场景
    // addGltf(patrolPartyList.value); // 人物
    //copyModel(); // 同一模型模型批量加载 =>设备

    threeTest.addEffectComposer();



    //测试加载模式
    addSimplyGltf(gltfSimplyModelList);
    // 加载标签
    addLabel();
    // 添加围栏
    //addFace();
};


// gltf模型数组
const gltfModelList = [

    {
        url: "gltf/office_1.gltf",
        type: "gltf",
        name: "test",
        playAction: "",
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
    },

];
const gltfSimplyModelList = [

    {
        url: "gltf/DP_BanGong01_Simply.glb",
        type: "gltf",
        name: "DP_A",
        playAction: "",
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
        scale: 1,
    },

];

const isLoading = ref(true);
// 加载场景模型
const actionsMap = new Map(); // 动画
const setModel = (model: any, animations: any, params: any) => {
    model.position.set(params.position.x, params.position.y, params.position.z);
    model.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z);
    if (params.scale) {
        model.scale.set(params.scale, params.scale, params.scale);
    }
    if (animations && animations.length > 0) {
        const {actions, mixerArray} = getActions(animations, model);
        threeTest.addModel(model, mixerArray);
        actionsMap.set(params.name, actions);
        if (params.playAction) {
            playActiveAction(actions, params.playAction, true, THREE.LoopRepeat);
        }
    } else {
        threeTest.addModel(model);
    }
    // 加载完后的回调函数，自定义加载完模型后的操作
    if (params.callback) {
        params.callback(threeTest);
    }
};
const addGltf = (modelList: any) => {
  modelList.forEach((gltfList: any) => {
    // 加载gltf模型
    if (gltfList.type === "gltf") {
      loadGltf(gltfList.url, gltfList.name).then((gltf) => {
        setModel(gltf.scene, gltf.animations, gltfList);
      });
    } else {
      // 加载fbx模型
      loadFbx(gltfList.url, gltfList.name).then((fbx) => {
        setModel(fbx, fbx.animations, gltfList);
        isLoading.value = false;
        console.log("LJK_模型fbx加载完成了！！" + fbx.name);
      });
    }
  });
}

const addSimplyGltf=(modelList: any) => {
    modelList.forEach((gltfList: any) => {
      // 加载gltf模型
      if (gltfList.type === "gltf") {
          loadLJKGltf(gltfList.url, gltfList.name).then((gltf) => {
          setModel(gltf.scene, gltf.animations, gltfList);
        });
      } else {
        // 加载fbx模型
        // loadFbx(gltfList.url, gltfList.name).then((fbx) => {
        //     setModel(fbx, fbx.animations, gltfList);
        //     isLoading.value = false;
        //     console.log("LJK_模型加载完成了！！" + fbx.name);
        // })
      }
    })
}



// 这里将Patrol放外面为了控制暂停和播放
  let p: Patrol;
  const inFace = ref(false);
  const isFirstPerson = ref(false);
  let time: string | number | NodeJS.Timeout | undefined;
  const personPatrol = (threeTest: Three3D) => {
    const array = [
      {x: -55.08, y: 0.1, z: 15.45},
      {x: -5.66, y: 0.1, z: 14.78},
      {x: -5.3, y: 0.1, z: -7.37},
      {x: 4.15, y: 0.1, z: -7.55},
      {x: 5.03, y: 0.1, z: 20.44},
      {x: 57.4, y: 0.1, z: 22.28},
      {x: 57.19, y: 0.1, z: 33.91},
      {x: -48.2, y: 0.1, z: 30.5},
      {x: -55.08, y: 0.1, z: 15.45},
    ];
    const lint = createLine(array, "线1");
    lint.visible = false;
    threeTest.addScene(lint);
    p = new Patrol(
        {
          three3D: threeTest,
          coordArray: array,
          meshName: "机器人1",
          isFirstPerson: isFirstPerson.value,
          factor: 1,
          rotation: {
            x: 0,
            y: (Math.PI / 180) * 180,
            z: 0,
          },
        },
        (done: any, value: any) => {
          if (done) {
            p.reset();
            p.run();
          } else {
            const flag = pointInThis(value, faceList);
            if (flag === inFace.value) return;
            inFace.value = flag;
            if (inFace.value) {
              setGeometryStyle("围栏", "rgb(255, 64, 95)", threeTest);

              ElMessage({
                message: "进入围栏,暂停五秒",
                type: "warning",
                offset: 64,
              });

              showPatrol();
              time = setTimeout(() => {
                showPatrol();
              }, 5000);
            } else {
              ElMessage({
                message: "离开围栏",
                type: "success",
                offset: 64,
              });
              setGeometryStyle("围栏", "rgb(51, 188, 176)", threeTest);
            }
          }
        },
    );
    p.run();
  };
  const patrolStatus = ref(false);
  const showPatrol = () => {
    clearTimeout(time);
    const actions = actionsMap.get("机器人1");
    if (!p.isStop) {
      playActiveAction(actions, "Run", false, THREE.LoopRepeat);
      playActiveAction(actions, "Idle", true, THREE.LoopRepeat);
      p.stop();
    } else {
      playActiveAction(actions, "Run", true, THREE.LoopRepeat);
      playActiveAction(actions, "Idle", false, THREE.LoopRepeat);
      p.run();
    }
    patrolStatus.value = p.isStop;
  };

  const personPatrol_2 = (threeTest: Three3D) => {
    // 巡逻路线点坐标
    const array = [
      {x: -75.96, y: 0.1, z: 47.16},
      {x: -21.6, y: 0.1, z: 48.44},
      {x: -9.39, y: 0.1, z: 48.27},
      {x: -6.52, y: 0.1, z: 28.42},
      {x: -4.78, y: 0.1, z: -14.94},
      {x: 4.9, y: 0.1, z: -15},
      {x: 5.21, y: 0.1, z: 17.41},
      {x: 6.42, y: 0.1, z: 42.17},
      {x: 18.94, y: 0.1, z: 47.78},
      {x: 69.62, y: 0.1, z: 48.31},
      {x: 69.22, y: 0.1, z: 58.25},
      {x: 33.06, y: 0.1, z: 59.59},
      {x: 13.88, y: 0.1, z: 59.29},
      {x: -45.34, y: 0.1, z: 57.61},
      {x: -71.48, y: 0.1, z: 56.75},
      {x: -75.96, y: 0.1, z: 47.16},
    ];
    const lint = createLine(array, "线2");
    lint.visible = false;
    threeTest.addScene(lint);
    // 使用着色器添加跟随
    const mesh = addShader();
    const fatherMesh = getModel("机器人0", threeTest.scene);
    fatherMesh?.add(mesh);
    const p = new Patrol(
        {
          three3D: threeTest,
          coordArray: array,
          meshName: "机器人0",
          isFirstPerson: false,
          factor: 1,
          rotation: {
            x: 0,
            y: (Math.PI / 180) * 180,
            z: 0,
          },
        },
        (done: boolean) => {
          if (done) {
            p.reset();
            p.run();
          }
        },
    );
    p.run();
  };
// 着色器
  const addShader = () => {
    const geometry = new THREE.CircleGeometry(2, 32);
    const material = circleShader();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };

// 加载人员模型
  const patrolPartyList = ref([
    {
      id: 0,
      url: "gltf/Soldier.glb",
      type: "gltf",
      name: "机器人0",
      playAction: "Run",
      position: {x: 0, y: 0, z: 0},
      rotation: {x: 1, y: (Math.PI / 180) * 180, z: 0},
      callback: personPatrol_2,
    },
    // {
    //   id: 1,
    //   url: "gltf/DP_3DModel.gltf",
    //   type: "gltf",
    //   name: "大棚01",
    //   playAction: "",
    //   position: { x: 3, y: 0, z: 0 },
    //   callback: personPatrol,
    //   rotation: { x: 0, y: (Math.PI / 180) * 270, z: 0 },
    //   scale: 0.1,
    // },
    {
      id: 2,
      url: "fbx/9999.fbx",
      type: "fbx",
      name: "大棚02",
      playAction: "",
      position: {x: 0, y: 0, z: 0},
      callback: personPatrol,
      scale: 0.01,
      rotation: {x: 0, y: 0, z: 0},
    },
  ]);

//#region 标签制作
// 标签数组
  const labelList = [
    // {
    //   color: "#3ac9b0",
    //   name: "电箱",
    //   value: "电箱",
    //   position: { x: 40, y: 5, z: 40 },
    //   scale: 1,
    // },
    {
      color: "#3ac9b0",
      name: "半拱大棚标签",
      value: "半拱大棚",
      position: {x: 0, y: 5, z: 0},
      scale: 1,
    },
    {
      color: "#3ac9b0",
      name: "温室控制器标签",
      value: "温室控制器",
      position: {x: 0, y: 2.5, z: 42},
      scale: 1,
    },
    {
      color: "#3ac9b0",
      name: "环境传感器标签",
      value: "环境传感器",
      position: {x: 1.68, y: 2, z: 5.32},
      scale: 1.5,
    }

  ];
  const addLabel = () => {
    labelList.forEach((label) => {
      const element = new DeviceSpriteDom(label.color, label.value).getElement();
      const box = createLabel({
        name: label.name,
        type: "CSS2DObject",
        element: element

      });
      box.scale.set(label.scale, label.scale, label.scale);
      box.position.set(label.position.x, label.position.y, label.position.z);
      threeTest.addScene(box);
    });
  };

// 围栏添加
  const faceList = [
    {x: -26.69, y: 0.1, z: 14.62},
    {x: -15.78, y: 0.1, z: 15.53},
    {x: -15.37, y: 0.1, z: 32.6},
    {x: -26.99, y: 0.1, z: 30.22},
    {x: -26.69, y: 0.1, z: 14.62},
  ];
  const addFace = () => {
    const mesh = createFace(faceList, "rgb(51, 188, 176)");
    mesh.name = "围栏";
    console.log("围栏顶点位置数据", mesh.geometry.attributes.position);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = 0.1;
    threeTest.addScene(mesh);
  };

  const firstPerson = () => {
    isFirstPerson.value = !isFirstPerson.value;
    p.switch(isFirstPerson.value);
    if (!isFirstPerson.value) {
      threeTest.camera.position.set(0, 10, 150);
      threeTest.controls.setCameraLookAt({
        x: 0,
        y: 0,
        z: 0,
      });
    }
  };

// 切换轨迹显示
  const showLine = ref(false);
  const switchShowLine = () => {
    showLine.value = !showLine.value;
    const line_1 = getModel("线1", threeTest.scene);
    const line_2 = getModel("线2", threeTest.scene);
    if (!line_1 || !line_2) return;
    line_1.visible = line_2.visible = showLine.value;
  };

  let cameraTween: any = null;
  const moveCamera = (
      position: any,
      lookAt: any,
      time: number | undefined = 3000,
  ) => {
    const camera = threeTest.camera;
    const controls = threeTest.controls;
    if (cameraTween) cameraTween.stop();
    cameraTween = new TWEEN.Tween(camera.position)
        .to(position, time)
        .onUpdate(function () {
          controls.setCameraLookAt(lookAt);
        })
        .start();
  };

  const showModel = (name: string, flag: boolean) => {
    const model = getModel(name, threeTest.scene);
    if (!model) return;
    model.visible = flag;
  };

  const getModelParams = (name: string) => {
    showModel("kk", false);
    return getModel(name, threeTest.scene);
  };

  export default function (id: string) {
    onMounted(() => {
      initThree(id);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", resize);
    });
    return {
      isLoading,
      threeTest,
      actionsMap,
      patrolStatus,
      isFirstPerson,
      showPatrol,
      firstPerson,
      showLine,
      switchShowLine,
      moveCamera,
      patrolPartyList,
      getModelParams,
      showModel,
    };
  }
