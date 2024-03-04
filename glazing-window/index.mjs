"use strict";

import { app, BrowserWindow } from 'electron'
import { Composite, AccentState } from './glazing.mjs'

function createWindow() {
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        //无边框
        frame: false,
        //透明
        transparent: true
    })
    mainWindow.loadFile('loader.html')

    Composite(mainWindow, AccentState.ACCENT_ENABLE_BLURBEHIND)
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})