import "./Editor.css"
import React, {useRef, useState} from "react"
import Footer from "./shared/ui/Footer";
import WysiwygState from "./shared/contexts/WysiwygState";
import Wysiwyg from "./wysiwyg/Wysiwyg";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const [page, setPage] = useState(0)

    const editorRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={editorRef} className={"editor"} style={{position : "relative", ...style}}>
            <WysiwygState>
                <Wysiwyg page={page} onPage={value => setPage(value)} editorRef={editorRef}/>
            </WysiwygState>
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