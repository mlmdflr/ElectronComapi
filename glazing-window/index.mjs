// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron'
import koffi from 'koffi'

const user32 = koffi.load("user32.dll");
const DWORD = koffi.alias('DWORD', 'uint32_t');
const HANDLE = koffi.pointer('HANDLE', koffi.opaque());
const HWND = koffi.alias('HWND', HANDLE);

const INT = koffi.types.int;
koffi.alias('BOOL', 'bool');

koffi.struct('AccentPolicy', {
    AccentState: INT,
    AccentFlags: INT,
    GradientColor: INT,
    AnimationId: INT,
});

koffi.struct('WINCOMPATTRDATA', {
    Attribute: INT,
    Data: 'AccentPolicy',
    SizeOfData: INT,
});


const SetWindowCompositionAttribute = user32.func('__stdcall', 'SetWindowCompositionAttribute', 'BOOL', ['void *', 'WINCOMPATTRDATA *'])

const typeSizes = {
    "undefined": () => 0,
    "boolean": () => 4,
    "number": () => 8,
    "string": item => 2 * item.length,
    "object": item => !item ? 0 : Object
        .keys(item)
        .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
};

const sizeOf = value => typeSizes[typeof value](value);


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        skipTaskbar: true,
        transparent: true,
        resizable: false
    })
    const devtools = new BrowserWindow()
    mainWindow.loadFile('loader.html')
    mainWindow.webContents.setDevToolsWebContents(devtools.webContents)
    mainWindow.webContents.openDevTools({ mode: 'detach' })


    const handle = mainWindow.getNativeWindowHandle();
    const refAccentPolicy = {
        AccentState: 4,
        GradientColor: (34 << 0) | (34 << 8) | (34 << 16) | (0 << 24),
    }
    SetWindowCompositionAttribute(handle.readInt32LE(), {
        Attribute: 19,
        Data: refAccentPolicy,
        SizeOfData: sizeOf(refAccentPolicy),
    })
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