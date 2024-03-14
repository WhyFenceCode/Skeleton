import { invoke } from '@tauri-apps/api/tauri';

const progressBarCPU = document.querySelector(".circular-progress-cpu");
const progressBarTEMP = document.querySelector(".circular-progress-temp");
const progressBarNET = document.querySelector(".circular-progress-net");

mapCPUDATA(50.0);
mapCPUTEMP(50.0);
mapNET(50.0);

async function getCPUDATA() {
  invoke('get_cpu_load')
    .then((message) => mapCPUDATA(message))
    .then(() => getCPUDATA());
}

async function getCPUDTemp() {
  invoke('get_cpu_temp')
    .then((message) => mapCPUTEMP(message))
    .then(() => getCPUDTemp());
}

async function getNET() {
  invoke('get_network_speed')
    .then((message) => mapNET(message))
    .then(() => getNET());
}

async function mapCPUDATA(value) {
    let progressColor = progressBarCPU.getAttribute("data-progress-color");
    const progressValue = progressBarCPU.querySelector(".percentage-cpu");
    const innerCircle = progressBarCPU.querySelector(".inner-circle-cpu");
    progressValue.textContent = `${value}%`;
    progressValue.style.color = `${progressColor}`;
    innerCircle.style.backgroundColor = `${progressBarCPU.getAttribute(
        "data-inner-circle-color"
      )}`;
      progressBarCPU.style.background = `conic-gradient(${progressColor} ${
        value * 3.6
      }deg,${progressBarCPU.getAttribute("data-bg-color")} 0deg)`;
}

async function mapCPUTEMP(value) {
  let progressColor = progressBarTEMP.getAttribute("data-progress-color");
  const progressValue = progressBarTEMP.querySelector(".percentage-temp");
  const innerCircle = progressBarTEMP.querySelector(".inner-circle-temp");
  if (value < 0.0) {
    progressValue.textContent = `No Support`;
  }else{
    progressValue.textContent = `${value}c`;    
  }
  progressValue.style.color = `${progressColor}`;
  innerCircle.style.backgroundColor = `${progressBarTEMP.getAttribute(
      "data-inner-circle-color"
    )}`;
    progressBarTEMP.style.background = `conic-gradient(${progressColor} ${
      value * 3.6
    }deg,${progressBarTEMP.getAttribute("data-bg-color")} 0deg)`;
}

async function mapNET(value) {
  let progressColor = progressBarNET.getAttribute("data-progress-color");
  const progressValue = progressBarNET.querySelector(".percentage-net");
  const innerCircle = progressBarNET.querySelector(".inner-circle-net");
  if (value < 0.0) {
    progressValue.textContent = `No Support`;
  }else{
    value = value / 1000;
    value = value * 2;
    progressValue.textContent = `${value.toFixed(2)}kb/s`;    
  }
  progressValue.style.color = `${progressColor}`;
  innerCircle.style.backgroundColor = `${progressBarNET.getAttribute(
      "data-inner-circle-color"
    )}`;
    progressBarNET.style.background = `conic-gradient(${progressColor} ${
      value * 3.6
    }deg,${progressBarNET.getAttribute("data-bg-color")} 0deg)`;
}

getCPUDATA();
getCPUDTemp();
getNET();