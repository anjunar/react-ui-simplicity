import React from "react";
import {createPortal} from "react-dom";

export function createWindow(window: React.ReactNode, open: boolean, viewport?: HTMLElement) {

    return (
        <>
            {
                open && createPortal(window, viewport || document.getElementById("viewport"))
            }
        </>
    )
}