// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use window_shadows::set_shadow;
use std::time::Duration;
use sysinfo::System;
use sysinfo::Components;
use sysinfo::Networks;

#[tauri::command(async)]
fn get_cpu_load() -> f32 {
  let mut sys = System::new_all();
  sys.refresh_all();
  sys.refresh_cpu();
  std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
  std::thread::sleep(Duration::from_millis(250));
  sys.refresh_cpu();
  let mut amount = 0.0;
  let mut count = 0;
  for cpu in sys.cpus() {
    amount += cpu.cpu_usage();
    count += 1;
  }
  amount = amount / count as f32;
  return amount.floor();
}

#[tauri::command(async)]
fn get_cpu_temp() -> f32 {
  let components = Components::new_with_refreshed_list();
  if components.is_empty() {
    return -10.0;
  } else {
    let mut amount = 0.0;
    let mut count = 0;
    for component in &components {
      amount += component.temperature();
      count += 1;
    }
    amount = amount / count as f32;
    return amount.floor();
  }
}

#[tauri::command(async)]
fn get_network_speed() -> f32 {
  let mut networks = Networks::new_with_refreshed_list();
  std::thread::sleep(Duration::from_millis(500));
  networks.refresh();
  let mut amount = 0.0;
  let mut count = 0;

  for (_interface_name, network) in &networks {
    amount += network.received() as f32;
    amount += network.transmitted() as f32;
    count += 2;
  }

  amount = amount / count as f32;
  amount = amount.floor();
  return amount;
}


fn main() {
  get_cpu_temp();
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(any(windows, target_os = "macos"))]
      {
        let window = app.get_window("main").unwrap();
        set_shadow(&window, true).unwrap();
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_cpu_load, get_cpu_temp, get_network_speed])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

