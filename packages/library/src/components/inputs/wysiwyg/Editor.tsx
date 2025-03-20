import "./Editor.css"
import React, {useContext, useEffect, useRef, useState} from "react"
import Footer from "./ui/Footer";
import Inspector from "./ui/Inspector";
import Toolbar from "./ui/Toolbar";
import Cursor from "./ui/Cursor";
import ProcessorFactory from "./blocks/shared/ProcessorFactory";
import InputManager from "./manager/InputManager";
import CursorManager from "./manager/CursorManager";
import SelectionManager from "./manager/SelectionManager";
import InspectorManager from "./manager/InspectorManager";
import {EditorContext} from "./contexts/EditorState";
import {TextNode} from "./core/TreeNode";
import DomState, {DomContext} from "./contexts/DomState";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const [page, setPage] = useState(0)

    const {ast, cursor : {currentCursor}} = useContext(EditorContext)

    const {editorRef, contentEditableRef} = useContext(DomContext)

    useEffect(() => {
        function onPaste(event : ClipboardEvent) {
            event.preventDefault()

            let text = event.clipboardData.getData("text");

            let container = currentCursor.container;

            if (container instanceof TextNode) {
                let start = container.text.substring(0, currentCursor.offset);
                let end = container.text.substring(currentCursor.offset);

                container.text = start + text + end
            }

            ast.triggerAST()
        }

        document.addEventListener("paste", onPaste)

        return () => {
            document.removeEventListener("paste", onPaste)
        }
    }, [ast]);

    return (
        <div ref={editorRef} className={"editor"} style={{position: "relative", ...style}}>
                <Toolbar page={page} onPage={value => setPage(value)}/>
                <div ref={contentEditableRef} style={{position : "relative", height : "50%", overflow: "auto", flex : 1}}>
                    <Cursor />
                    <ProcessorFactory node={ast.root}/>
                    <Inspector/>
                    <InputManager/>
                </div>
                <CursorManager/>
                <SelectionManager/>
                <InspectorManager/>
                <Footer page={page} onPage={(value) => setPage(value)}/>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        style?: React.CSSProperties,
    }
}

export default Editor