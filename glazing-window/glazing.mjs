"use strict";

import { BrowserWindow } from "electron";
import koffi from "koffi";
import { platform } from "node:os";

const INT = koffi.types.int;
const UINT = koffi.types.uint;
const Long = koffi.types.long;

const AccentPolicy = koffi.struct({
    AccentState: INT,
    AccentFlags: UINT,
    GradientColor: UINT,
    AnimationId: Long,
});

const PAccentPolicy = koffi.pointer(AccentPolicy)

const WindowCompositionAttributeData = koffi.struct({
    Attrib: INT,
    pvData: PAccentPolicy,
    cbData: UINT,
});

const PWindowCompositionAttributeData = koffi.pointer(WindowCompositionAttributeData)

const lib = koffi.load('user32.dll');

export const AccentState = {
    ACCENT_DISABLED: 0,
    ACCENT_ENABLE_GRADIENT: 1,
    ACCENT_ENABLE_TRANSPARENTGRADIENT: 2,
    ACCENT_ENABLE_BLURBEHIND: 3,
    ACCENT_ENABLE_ACRYLICBLURBEHIND: 4,
    ACCENT_INVALID_STATE: 5,
}

/**
 * @param {BrowserWindow} window 
 * @param {number} accentState
 */
export const Composite = (window, accentState) => {
    if (platform() !== "win32") {
        throw "Operating System not supported";
    }

    const accent = {
        AccentState: accentState,
        AccentFlags: 0,
        GradientColor: (34 << 0) | (34 << 8) | (34 << 16) | (0 << 24),
        AnimationId: 0,
    };

    const windowcompositon = {
        Attrib: 19,
        pvData: koffi.as(accent, PAccentPolicy),
        cbData: koffi.sizeof(AccentPolicy)
    }

    const setWindowCompositionAttribute = lib.func("__stdcall", "SetWindowCompositionAttribute", INT, [INT, PWindowCompositionAttributeData])
    setWindowCompositionAttribute(
        window.getNativeWindowHandle().readInt32LE(),
        koffi.as(windowcompositon, PWindowCompositionAttributeData)
    );
}