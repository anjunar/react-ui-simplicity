import "./Editor.css"
import React, {useRef, useState} from "react"
import Footer from "./shared/ui/Footer";
import WysiwygState from "./shared/contexts/WysiwygState";
import Markdown from "./markdown/Markdown";
import Wysiwyg from "./wysiwyg/Wysiwyg";
import MarkdownState from "./shared/contexts/MarkdownState";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const [page, setPage] = useState(0)

    const [markdown, setMarkdown] = useState(false)

    const editorRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={editorRef} className={"editor"} style={{position: "relative", ...style}}>
            {
                markdown ? (
                    <MarkdownState>
                        <Markdown page={page}/>
                    </MarkdownState>
                ) : (
                    <WysiwygState>
                        <Wysiwyg page={page} onPage={value => setPage(value)} editorRef={editorRef}/>
                    </WysiwygState>
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