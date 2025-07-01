<template>
  <div v-if="show" class="waterdrop-loader">
    <div class="outloading">
      <div class="fade-inloading">
        <div class="containerloading">
          <div class="oneloading commonloading"></div>
          <div class="twoloading commonloading"></div>
          <div class="threeloading commonloading"></div>
          <div class="fourloading commonloading"></div>
          <div class="fiveloading commonloading"></div>
          <div class="sixloading commonloading"></div>
          <div class="sevenloading commonloading"></div>
          <div class="eightloading commonloading"></div>
        </div>
        <div class="barloading">
          <div class="progressloading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  data() {
    return {
      show: false
    }
  },
  methods: {
    // 显示加载动画
    showLoading() {
      this.show = true
    },
    // 隐藏加载动画
    hideLoading() {
      this.show = false
    },
    // 自动隐藏（带延迟）
    autoHide(delay = 3000) {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, delay)
    }
  }
}
</script>

<style scoped>
.waterdrop-loader {
  background-color: #161B29 !important;
  margin: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.containerloading {
  width: 40vw;
  height: 40vw;
  position: relative;
  margin: auto;
  overflow: hidden;
}

.commonloading {
  height: 5vw;
  width: 2vw;
  margin: auto;
  position: absolute;
  background-color: transparent;
  border-radius: 0vw 10vw 0vw 10vw;
  box-shadow: inset 0vw 0vw 0vw .1vw #E645D0, 0vw 0vw 1.5vw 0vw #E645D0;
}

.oneloading {
  transform: rotate(45deg);
  left: 0;
  right: 0;
  top: 0;
  bottom: 7.5vw;
}

.twoloading {
  transform: rotate(90deg);
  left: 5.5vw;
  right: 0;
  top: 0;
  bottom: 5.5vw;
}

.threeloading {
  transform: rotate(135deg);
  left: 7.5vw;
  right: 0;
  top: 0;
  bottom: 0;
}

.fourloading {
  transform: rotate(180deg);
  left: 5.5vw;
  right: 0;
  top: 5.5vw;
  bottom: 0;
}

.fiveloading {
  transform: rotate(225deg);
  left: 0;
  right: 0;
  top: 7.5vw;
  bottom: 0;
}

.sixloading {
  transform: rotate(270deg);
  left: 0;
  right: 5.5vw;
  top: 5.5vw;
  bottom: 0;
}

.sevenloading {
  transform: rotate(315deg);
  left: 0;
  right: 7.5vw;
  top: 0;
  bottom: 0;
}

.eightloading {
  transform: rotate(360deg);
  left: 0;
  right: 5.5vw;
  top: 0;
  bottom: 5.5vw;
}

.barloading {
  width: 12vw;
  height: .25vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 16vw;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #E645D0;
}

.progressloading {
  width: 12vw;
  height: .5vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #17E1E6;
}

.oneloading {
  animation: oneloading 1s ease infinite;
}

@keyframes oneloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.twoloading {
  animation: twoloading 1s .125s ease infinite;
}

@keyframes twoloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.threeloading {
  animation: threeloading 1s .25s ease infinite;
}

@keyframes threeloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.fourloading {
  animation: fourloading 1s .375s ease infinite;
}

@keyframes fourloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.fiveloading {
  animation: fiveloading 1s .5s ease infinite;
}

@keyframes fiveloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.sixloading {
  animation: sixloading 1s .625s ease infinite;
}

@keyframes sixloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.sevenloading {
  animation: sevenloading 1s .750s ease infinite;
}

@keyframes sevenloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.eightloading {
  animation: eightloading 1s .875s ease infinite;
}

@keyframes eightloading {
  0%, 100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #17E1E6, 0vw 0vw 1.5vw 0vw #17E1E6;
  }
}

.containerloading {
  animation: containerloading 5s linear infinite;
}

@keyframes containerloading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.progressloading {
  animation: progressloading 15s ease;
}

@keyframes progressloading {
  0% {
    left: -24vw;
  }
  10% {
    left: -20vw;
  }
  30% {
    left: -16vw;
  }
  50% {
    left: -12vw;
  }
  65% {
    left: -10vw;
  }
  80% {
    left: -4vw;
  }
  100% {
    left: 0;
  }
}

.fade-inloading {
  animation: fade-inloading 2s ease;
}

@keyframes fade-inloading {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.outloading {
  animation: outloading 5s 15s ease;
}

@keyframes outloading {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>