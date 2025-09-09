
use tauri::command;
use serde_json::{to_string};
use clap::{Parser};

use crate::Cli;
#[command]
pub fn get_args() -> String { 
    let cli = Cli::parse();

    return to_string(&cli).unwrap();
}