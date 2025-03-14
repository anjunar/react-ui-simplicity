import "./Editor.css"
import React, {useContext, useEffect, useRef, useState} from "react"
import ProcessorFactory from "./shared/blocks/shared/ProcessorFactory";
import Cursor from "./wysiwyg/ui/Cursor";
import Toolbar from "./wysiwyg/ui/Toolbar";
import Footer from "./shared/ui/Footer";
import Inspector from "./wysiwyg/ui/Inspector";
import SelectionManager from "./wysiwyg/manager/SelectionManager";
import InputManager from "./wysiwyg/manager/InputManager";
import CursorManager from "./wysiwyg/manager/CursorManager";
import InspectorManager from "./wysiwyg/manager/InspectorManager";
import {EditorContext} from "./EditorState";
import {TextNode} from "./shared/core/TreeNode";
import Markdown from "./markdown/Markdown";
import Wysiwyg from "./wysiwyg/Wysiwyg";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const [page, setPage] = useState(0)

    const [markdown, setMarkdown] = useState(false)

    const editorRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={editorRef} className={"editor"} style={{position: "relative", ...style}}>
            {
                markdown ? (
                    <Markdown page={page}/>
                ) : (
                    <Wysiwyg page={page} onPage={value => setPage(value)} editorRef={editorRef}/>
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