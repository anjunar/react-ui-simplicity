import "./Editor.css"
import React, {useContext, useEffect, useRef, useState} from "react"
import ProcessorFactory from "./processors/ProcessorFactory";
import Cursor from "./ui/Cursor";
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import Inspector from "./ui/Inspector";
import SelectionManager from "./manager/SelectionManager";
import InputManager from "./manager/InputManager";
import CursorManager from "./manager/CursorManager";
import InspectorManager from "./manager/InspectorManager";
import {EditorContext} from "./EditorState";
import {TextNode} from "./core/TreeNode";
import Markdown from "./markdown/Markdown";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const {ast, cursor : {currentCursor}} = useContext(EditorContext)

    const [page, setPage] = useState(0)

    const [markdown, setMarkdown] = useState(false)

    const editorRef = useRef<HTMLDivElement>(null)

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
        <div ref={editorRef} className={"editor"} style={{position: "relative", ...style}}>
            {
                markdown ? (
                    <Markdown/>
                ) : (
                    <div style={{flex: 1}}>
                        <Toolbar page={page} onPage={value => setPage(value)}/>
                        <div ref={contentEditableRef} style={{height : "100%", overflow: "auto"}}>
                            <Cursor ref={cursorRef}/>
                            <Inspector inspectorRef={inspectorRef}/>
                            <ProcessorFactory node={ast.root}/>
                        </div>
                        <CursorManager cursorRef={cursorRef} inputRef={inputRef} editorRef={editorRef} contentEditableRef={contentEditableRef} inspectorRef={inspectorRef}/>
                        <SelectionManager/>
                        <InspectorManager editorRef={editorRef} contentEditableRef={contentEditableRef} inputRef={inputRef} inspectorRef={inspectorRef}/>
                        <InputManager inputRef={inputRef}/>
                    </div>
                )
            }
            <Footer page={page} onPage={(value) => setPage(value)} onMarkDown={value => setMarkdown(value)}/>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        style?: React.CSSProperties,
    }
}

export default Editor