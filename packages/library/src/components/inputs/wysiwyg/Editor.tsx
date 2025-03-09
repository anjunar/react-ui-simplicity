import "./Editor.css"
import React, {useContext, useRef, useState} from "react"
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

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const {ast} = useContext(EditorContext)

    const [page, setPage] = useState(0)

    const editorRef = useRef<HTMLDivElement>(null)

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const cursorRef = useRef<HTMLDivElement>(null)

    const contentEditableRef = useRef<HTMLPreElement>(null);

    const inspectorRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={editorRef} className={"editor"} style={{position: "relative", ...style}}>
            <Toolbar page={page}/>
            <pre ref={contentEditableRef} style={{flex: 1, overflow: "auto"}}>
                <Cursor ref={cursorRef}/>
                <Inspector inspectorRef={inspectorRef}/>
                <ProcessorFactory node={ast.root}/>
            </pre>
            <CursorManager cursorRef={cursorRef} inputRef={inputRef} editorRef={editorRef} contentEditableRef={contentEditableRef} inspectorRef={inspectorRef}/>
            <SelectionManager/>
            <InspectorManager editorRef={editorRef} contentEditableRef={contentEditableRef} inputRef={inputRef} inspectorRef={inspectorRef}/>
            <InputManager inputRef={inputRef}/>
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