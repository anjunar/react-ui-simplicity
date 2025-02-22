import "./Wysiwyg.css"
import React, {useLayoutEffect, useMemo, useRef, useState} from "react"
import Toolbar from "./toolbar/Toolbar";
import Footer from "./footer/Footer";
import {normalize, removeJunk, selectStartAndEnd} from "./commands/Commands";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [page, setPage] = useState(0)

    const memo = useMemo<{range : Range}>(() => {
        return {
            range : null
        }
    }, []);

    const contentEditable = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {

        let inputHandler = (e : Event) => {
            let event = e as InputEvent
            if (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward") {
                normalize(contentEditable.current)
            }
        };

        let selectionChangeHandler = (event) => {
            let selection = window.getSelection();

/*
            if (selection?.rangeCount) {
                let range = selection.getRangeAt(0)
                if (! contentEditable.current.contains(range.commonAncestorContainer)) {
                    selection.removeAllRanges()
                }
            }
*/

            if (selection.isCollapsed) {
                normalize(contentEditable.current)
            } else {

            }
        };

        let contextMenuHandler = (event) => {
            let selection = window.getSelection();

            if (selection?.rangeCount && ! selection.isCollapsed) {
                event.preventDefault()
            }
        };

/*
        let paragraphElement = document.createElement("p");
        let spanElement = document.createElement("span");
        spanElement.appendChild(document.createElement("br"))
        paragraphElement.appendChild(spanElement)
        contentEditable.current.appendChild(paragraphElement)
*/

        contentEditable.current.addEventListener("input", inputHandler)
        contentEditable.current.addEventListener("contextmenu", contextMenuHandler);
        document.addEventListener("selectionchange", selectionChangeHandler)

        return () => {
            contentEditable.current.removeEventListener("input", inputHandler)
            contentEditable.current.removeEventListener("contextmenu", contextMenuHandler);
            document.removeEventListener("selectionchange", selectionChangeHandler)
        }
    }, []);

    useLayoutEffect(() => {

        if (memo.range) {
            selectStartAndEnd(memo.range.startContainer, memo.range.endContainer, memo.range.startOffset, memo.range.endOffset)
        }


    }, [page]);

    function onPage(value : number) {

        let selection = window.getSelection();
        if (selection?.rangeCount) {
            memo.range = selection.getRangeAt(0)
        }

        setPage(value)
    }

    return (
        <div className={"wysiwyg"}>
            <Toolbar page={page} contentEditable={contentEditable}/>
            <div ref={contentEditable} contentEditable={true} style={{flex: 1, padding: "12px", whiteSpace: "pre"}}></div>
            <Footer page={page} onPage={onPage}/>
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