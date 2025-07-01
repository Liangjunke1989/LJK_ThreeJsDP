<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElLoading } from 'element-plus'
import Card from "@/components/card/index.vue";
import useEcharts from "@/hooks/useEcharts";
import userEchartsData from "./hooks/useEchartsData";
import useThree from "@/hooks/useThree";

// 加载状态
const loading = ref(true)

// three相关
const {
  getModelParams,
  patrolStatus,
  showPatrol,
  firstPerson,
  isFirstPerson,
  showLine,
  switchShowLine,
  moveCamera,
  patrolPartyList,
  deviceList,
  showModel,
} = useThree("DP_BanGong");

// echarts格式
const {
  deviceOnlineData,
  deviceOnlineOption,
  numberOfAlarmsOption,
  distributeOption,
} = userEchartsData();

// 创建图表
useEcharts(deviceOnlineOption, "deviceOnline");
useEcharts(numberOfAlarmsOption, "numberOfAlarms");
useEcharts(distributeOption, "distribute");

// 视角列表数组
const visualAngleList = [
  {
    name: "半拱大棚",
    position: {x:-50, y: 15, z: -70},
    lookAt: {x: 0, y: 0, z: 0},
  },
  {
    name: "温室控制器",
    position: {x: 0, y: 0, z: 30},
    lookAt: {x: 0, y: 1.7, z: 120},
  },
  {
    name: "环境传感器",
    position: {x: 5, y: 2, z: 8},
    lookAt: {x: 1.68 , y:  1.59, z: 5.23},
  },
  {
    name: "卷膜电机",
    position: {x: -4, y: 1.5, z: 38},
    lookAt: {x: 2.89, y: 2.51, z: 36},
  },
  {
    name: "行程开关",
    position: {x: -10, y: 1.7, z: 25},
    lookAt: {x: -8.08, y: 1.02, z: 22.02},
  },
  {
    name: "卷帘电机",
    position: {x: -2, y: 4, z: 4},
    lookAt: {x: 2.55, y: 5.2, z: 0.6},
  }

];

// 初始化加载指示器
let loadingInstance: ReturnType<typeof ElLoading.service>

onMounted(() => {
  // 开始加载
  loadingInstance = ElLoading.service({
    target: '#DP_BanGong',
    text: '大棚模型加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟加载完成（实际使用时替换为你的3D场景加载完成回调）
  setTimeout(() => {
    loadingInstance.close()
    loading.value = false
  }, 2000) // 2秒后关闭，实际应根据场景加载情况
})

// 切换视角
const changeView = (v: number) => {
  const {position, lookAt} = visualAngleList[v];
  moveCamera(position, lookAt);
};

// 设置定位
const location = (name: string) => {
  const model = getModelParams(name);
  if (!model) return;
  const {position} = model;
  moveCamera(
      {
        x: position.x,
        y: 50,
        z: position.z + 20,
      },
      position,
      1000,
  );
};

const locationPatrolParty = (v: any) => {
  const {name} = v;
  location(name);
};

const clickDevice = (v: any) => {
  const {name} = v;
  location(name);
};
</script>

<template>
  <div class="layout">
    <!-- <div class="head">
      <p data-text="智慧大棚数字孪生平台">智慧大棚数字孪生平台</p>
    </div> -->
<!--    <div class="centre">-->
<!--        <div class="three">-->
<!--          <div id="DP_BanGong" />-->
<!--        </div>-->
<!--    </div>-->
    <div class="centre">
      <div class="left box">
        <Card class="card-box">
          <template #title>
            <div class="title">数据统计</div>
          </template>
          <div class="device-online">
            <div id="deviceOnline" />
            <div class="device">
              <div>
                在线设备：<span>{{ deviceOnlineData.online }}</span>
              </div>
              <div>离线设备：{{ deviceOnlineData.downline }}</div>
            </div>
          </div>
        </Card>
        <Card class="card-box">
          <template #title>
            <div class="title">告警次数</div>
          </template>
          <div class="device-online">
            <div id="numberOfAlarms" />
          </div>
        </Card>

        <Card class="card-box">
          <template #title>
            <div class="title">告警分布</div>
          </template>
          <div class="device-online">
            <div id="distribute" />
          </div>
        </Card>
      </div>
      <div class="three" v-loading="loading" element-loading-text="大棚模型加载中"
        element-loading-background="rabg(0,0,0,0.7)"
        >   
        <div id="DP_BanGong" />
      </div>
      <div class="right box">
        <Card class="card-box">
          <template #title>
            <div class="title">巡逻人员</div>
          </template>
          <div class="list">
            <!-- <div id="distribute" /> -->
            <div class="people">
              <div
                  class="item"
                  @click="clickDevice(item)"
                  v-for="item in patrolPartyList"
                  :key="item.id"
              >
                <SvgIcon iconName="Place" />
                {{ item.name }}
              </div>
            </div>
          </div>
        </Card>
        <Card class="card-box">
          <template #title>
            <div class="title">设备列表</div>
          </template>
          <div class="list">
            <!-- <div id="distribute" /> -->
            <div class="people">
              <div
                  class="item"
                  @click="locationPatrolParty(item)"
                  v-for="item in deviceList"
                  :key="item.id"
              >
                <SvgIcon iconName="Place" />

                <span
                    :class="{
                    state: item.state === 0,
                  }"
                >
                  {{ item.name }}</span
                >
              </div>
            </div>
          </div>
        </Card>
        <Card class="card-box">
          <template #title>
            <div class="title">告警列表</div>
          </template>
          <div class="list">
            <div class="people">
              <div class="item" v-for="item in 20" :key="item">设备告警</div>
            </div>
          </div>
        </Card>
      </div>
    </div>


    <div class="control">
        <!--      <el-button type="primary" @click="showPatrol">-->
        <!--        {{ patrolStatus ? "点击继续巡逻" : "点击暂停巡逻" }}</el-button-->
        <!--      >-->
<!--        <el-button type="primary" @click="firstPerson">-->
<!--          {{ isFirstPerson ? "第三人称" : "第一人称" }}-->
<!--        </el-button-->
        <!--      <el-button type="primary" @click="switchShowLine">-->
        <!--        {{ showLine ? "隐藏轨迹" : "显示轨迹" }}</el-button-->
        <!--      >-->
        <el-dropdown @command="changeView">
          <el-button type="primary"> 视角切换</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  :command="i"
                  v-for="(item, i) in visualAngleList"
                  :key="i"
              >{{ item.name }}
              </el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
</template>
<style lang="scss" scoped>
.three {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;

  #DP_BanGong {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
}

.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    z-index: 9999999;
    font-size: clamp(18px, 2vw, 40px);

    p {
      position: relative;
      margin: auto;
      word-spacing: 0.2em;
      display: inline-block;
      white-space: nowrap;
      color: transparent;
      background-color: #17c2e5;
      background-clip: text;
      z-index: 2;
      font-weight: 900;
      font-family: myFirstFont;
    }

    p::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      background-image: linear-gradient(
              120deg,
              transparent 0%,
              transparent 2rem,
              white 2rem,
              transparent 4.15rem,
              transparent 15rem,
              rgba(255, 255, 255, 0.3) 40px,
              transparent 25rem,
              transparent 27rem,
              rgba(255, 255, 255, 0.6) 32rem,
              white 33rem,
              rgba(255, 255, 255, 0.3) 33.15rem,
              transparent 38rem,
              transparent 40rem,
              rgba(255, 255, 255, 0.3) 45rem,
              transparent 20rem,
              transparent 100%
      );

      background-clip: text;
      background-size: 150% 100%;
      background-repeat: no-repeat;
      animation: shine 5s infinite linear;
    }

    @keyframes shine {
      0% {
        background-position: 50% 0;
      }
      100% {
        background-position: -190% 0;
      }
    }

    &::after {
      display: flex;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 60px;
      background: url("image/head_bg.png") no-repeat;
      background-size: 100% 100%;
      opacity: 0.8;
      z-index: 0;
    }
  }

  .centre {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .box {
      position: relative;
      padding: 10px;
      width: 300px;
      z-index: 9999999;

      .card-box {
        margin-bottom: 20px;
      }
    }

    .right {
      display: none;
      .list {
        height: 200px;
        overflow-y: auto;

        .people {
          margin: 5px 10px;

          .item {
            height: 26px;
            line-height: 26px;
            border-bottom: 1px dashed #56bce7;

            span {
              margin-left: 5px;
            }

            .state {
              color: #ff123b;
            }
          }
        }
      }
    }

    .left {
        display: none;
      .device-online {
        // display: flex;
        align-items: center;

        .device {
          margin-top: 10px;
          margin-left: 10px;

          span {
            font-weight: 900;
            color: #3cadc9;
          }
        }
      }

      #deviceOnline {
        width: 100px;
        height: 100px;
      }

      #numberOfAlarms {
        width: 100%;
        height: 200px;
      }

      #distribute {
        width: 100%;
        height: 300px;
      }
    }
  }
}

.control {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);

  .el-dropdown {
    margin-left: 10px;
  }
}
</style>
