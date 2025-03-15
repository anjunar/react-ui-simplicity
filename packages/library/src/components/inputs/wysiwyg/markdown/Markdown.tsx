import React, {useContext, useEffect, useRef} from "react"
import {parseString} from "./parser/Parser";
import ProcessorFactory from "../shared/blocks/shared/ProcessorFactory";
import {WysiwygContext} from "../shared/contexts/WysiwygState";
import Toolbar from "./ui/Toolbar";
import {findSelectedNodes, flattenAST} from "./selection/ASTSelection";
import {generate} from "./generator/Generator";
import {EditorContext} from "../shared/contexts/EditorState";
import {MarkdownContext} from "../shared/contexts/MarkdownState";
import SelectionManager from "./manager/SelectionManager";

function Markdown(properties: Markdown.Attributes) {

    const {page} = properties

    const divRef = useRef<HTMLDivElement>(null);

    const {ast} = useContext(EditorContext)

    const {markdown} = useContext(MarkdownContext)

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        markdown.currentMarkdown = generate(ast.root)
        markdown.triggerMarkdown()
    }, []);

    useEffect(() => {
        ast.root = parseString(markdown.currentMarkdown)
        ast.triggerAST()
    }, [markdown.currentMarkdown]);

    function onTextareaChange(event : React.ChangeEvent<HTMLTextAreaElement>) {
        markdown.currentMarkdown = event.target.value
        markdown.triggerMarkdown()
    }

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}} ref={divRef}>
            <Toolbar page={page} textarea={textareaRef}/>
            <textarea ref={textareaRef} style={{width: "100%", flex: 0.5}} value={markdown.currentMarkdown} onChange={onTextareaChange}/>
            <div style={{flex: 0.5}}>
                <ProcessorFactory node={ast.root}/>
            </div>
            <SelectionManager textareaRef={textareaRef}/>
        </div>
    )
}

namespace Markdown {
    export interface Attributes {
        page: number
    }
}

export default Markdown