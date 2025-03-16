import React, {useContext, useEffect, useRef} from "react"
import Toolbar from "./ui/Toolbar";
import Cursor from "./ui/Cursor";
import Inspector from "./ui/Inspector";
import ProcessorFactory from "../shared/blocks/shared/ProcessorFactory";
import CursorManager from "./manager/CursorManager";
import SelectionManager from "./manager/SelectionManager";
import InspectorManager from "./manager/InspectorManager";
import InputManager from "./manager/InputManager";
import {TextNode} from "../shared/core/TreeNode";
import {WysiwygContext} from "../shared/contexts/WysiwygState";
import {EditorContext} from "../shared/contexts/EditorState";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const {page, editorRef, onPage} = properties

    const {cursor : {currentCursor}} = useContext(WysiwygContext)

    const {ast} = useContext(EditorContext)

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const cursorRef = useRef<HTMLDivElement>(null)

    const contentEditableRef = useRef<HTMLDivElement>(null);

    const inspectorRef = useRef<HTMLDivElement>(null);

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
        <div style={{flex: 1, height : "50%", display : "flex", flexDirection : "column"}}>
            <Toolbar page={page} onPage={value => onPage(value)}/>
            <div ref={contentEditableRef} style={{position : "relative", height : "50%", overflow: "auto", flex : 1}}>
                <Cursor ref={cursorRef}/>
                <Inspector inspectorRef={inspectorRef}/>
                <ProcessorFactory node={ast.root}/>
                <InputManager inputRef={inputRef}/>
            </div>
            <CursorManager cursorRef={cursorRef} inputRef={inputRef} editorRef={editorRef} contentEditableRef={contentEditableRef} inspectorRef={inspectorRef}/>
            <SelectionManager/>
            <InspectorManager editorRef={editorRef} contentEditableRef={contentEditableRef} inputRef={inputRef} inspectorRef={inspectorRef}/>
        </div>
    )
}

namespace Wysiwyg {
    export interface Attributes {
        page : number
        onPage : (value : number) => void
        editorRef : React.RefObject<HTMLDivElement>
    }
}

export default Wysiwyg