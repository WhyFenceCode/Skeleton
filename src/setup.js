import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';
import { getName } from '@tauri-apps/api/app';
import { appDataDir, dataDir  } from '@tauri-apps/api/path';
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

const container = document.querySelector(".container");

let homeButton = document.getElementById("home-button");
let homeArea = document.querySelector(".home-area");
let logButton = document.getElementById("log-button");
let logArea = document.querySelector(".log-area");

let areas = document.querySelectorAll(".main-area");
let areabuttons = document.querySelectorAll(".menu-icon");

async function maxWin(){
  const maximized = await appWindow.isMaximized();
  if (maximized) {
    await appWindow.unmaximize();
    container.style.borderRadius = "5px";
  }else{
    await appWindow.maximize();
    container.style.borderRadius = "0px";
  }
}

async function hideWin(){
  await appWindow.minimize();
}

async function closeWin(){
  await appWindow.close();
}

async function appLowerText(){
  const version = await getVersion();
  const appName = await getName();
  const appNameUpperCase = appName.toUpperCase();
  const vPoint = version.split('.')[0];
  const versionText = document.getElementById("version");
  versionText.innerHTML = `${appNameUpperCase} v${vPoint} | ${version} `;
}

document.getElementById("maximize").addEventListener("click", (ev) => {
  maxWin()
});

document.getElementById("hide").addEventListener("click", (ev) => {
  hideWin()
});

document.getElementById("close").addEventListener("click", (ev) => {
  closeWin()
});

document.addEventListener("DOMContentLoaded", (event) => {
  appLowerText();
  renderLog();
  mapAreaToButton();
  invoke('get_cpu_load').then((message) => console.log(message))
});

function mapAreaToButton(area, button){

  //Button Listners For Main Menu
  homeButton.addEventListener("click", (ev) => {
    areas.forEach(element => {
      element.classList.remove("main-area-selected");
      element.classList.add("main-area-unselected");
    });
    areabuttons.forEach(element => {
      element.classList.remove("menu-icon-selected");
    });
    homeArea.classList.add("main-area-selected");
    homeArea.classList.remove("main-area-unselected");
    homeButton.classList.add("menu-icon-selected");
  });

  logButton.addEventListener("click", (ev) => {
    areas.forEach(element => {
      element.classList.remove("main-area-selected");
      element.classList.add("main-area-unselected");
    });
    areabuttons.forEach(element => {
      element.classList.remove("menu-icon-selected");
    });
    logArea.classList.add("main-area-selected");
    logArea.classList.remove("main-area-unselected");
    logButton.classList.add("menu-icon-selected");
  });

}



// Log Renderer
function removeStringFromEnd(originalString, stringToRemove) {
  if (originalString.endsWith(stringToRemove)) {
     return originalString.slice(0, -stringToRemove.length);
  }
  return originalString;
}

function highlightPattern(text) {
  const pattern = /\[([^\[\]]*?\/[A-Z]{4,5})\]/g;
  return text.replace(pattern, function(match) {
     const uppercaseChars = match.match(/[A-Z]{4,5}/)[0];
     const className = uppercaseChars === 'ERROR' ? 'red-log-text' :  uppercaseChars === 'WARN' ? 'yellow-log-text' : 'green-log-text';
     return '<strong class="' + className + '">' + match + '</strong>';
  });
 }

async function splitIntoLines(path) {
  const contents = await readTextFile(path);
  const lines = contents.split('\n');
  return lines;
}

function createLiElements(parentElement, text) {
  const li = document.createElement('li');
  li.innerHTML = text;
  parentElement.appendChild(li);
 }

async function renderLog(){
  let appDataDirPath = await dataDir ();
  appDataDirPath = appDataDirPath + "\.minecraft\\logs\\latest.log";
  console.log(appDataDirPath);
  let lines = await splitIntoLines(appDataDirPath);
  lines.forEach(element => {
    let text = highlightPattern(element);
    createLiElements(document.querySelector(".log-renderer-list"), text);
  });
}