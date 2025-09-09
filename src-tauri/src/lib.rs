



use clap::{Parser};
use serde::{Serialize, Deserialize};
use std::path::PathBuf;

mod commands;

#[derive(Debug, Parser, Serialize, Deserialize)]
#[command(version, about, long_about = None)]
pub struct Cli {
    /// Sets a custom config file
    #[arg(short, long, value_name = "FILE")]
    pub manifest: Option<PathBuf>,

    /// Turn debugging information on
    #[arg(short, long, action = clap::ArgAction::Count)]
    pub debug: u8
}


#[cfg(desktop)]
// use tauri::Manager;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init());

    // #[cfg(desktop)]
    // let builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
    //     if let Some(window) = app.get_webview_window("main") {
    //         let _ = window.unminimize();
    //         let _ = window.set_focus();
    //         let _ = window.show();
    //     }
    // }));
    
    builder
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_args
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
