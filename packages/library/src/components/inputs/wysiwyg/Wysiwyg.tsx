import "./Wysiwyg.css"
import React, {useLayoutEffect, useRef, useState} from "react"
import Toolbar from "./toolbar/Toolbar";
import Footer from "./footer/Footer";
import {normalize, removeJunk, selectStartAndEnd} from "./commands/Commands";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [page, setPage] = useState(0)

    const contentEditable = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {

        contentEditable.current.addEventListener("input", (e : Event) => {
            let event = e as InputEvent
            if (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward") {
                normalize(contentEditable.current)
            }
        })

        document.addEventListener("selectionchange", (event) => {
            let selection = window.getSelection();

            if (! contentEditable.current.contains(selection.anchorNode)) {
                event.preventDefault()
            }
        })

        contentEditable.current.innerHTML = " <p><span><br/></span></p>"

    }, []);

    return (
        <div className={"wysiwyg"}>
            <Toolbar page={page} contentEditable={contentEditable}/>
            <div ref={contentEditable} contentEditable={true} style={{flex: 1, padding: "12px", whiteSpace: "pre"}}></div>
            <Footer page={page} onPage={(value) => setPage(value)}/>
        </div>

    )
}

namespace Wysiwyg {
    export interface Attributes {
    }

    export interface EventHolder {
        handled: boolean
        event: KeyboardEvent,
        trigger: () => void
    }
}

export default Wysiwyg