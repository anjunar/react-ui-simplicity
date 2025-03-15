import React, {useContext, useEffect, useRef} from "react"
import {parseString} from "./parser/Parser";
import ProcessorFactory from "../shared/blocks/shared/ProcessorFactory";
import {EditorContext} from "../EditorState";
import Toolbar from "./ui/Toolbar";
import {findSelectedNodes, flattenAST} from "./selection/ASTSelection";
import {generate} from "./generator/Generator";

function Markdown(properties: Markdown.Attributes) {

    const {page} = properties

    const divRef = useRef<HTMLDivElement>(null);

    const {ast, markdown} = useContext(EditorContext)

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

    function onSelect(event: React.SyntheticEvent<HTMLTextAreaElement>) {
        let textArea = event.target as HTMLTextAreaElement
        let nodeRanges = flattenAST(ast.root.children);
        let abstractNodes = findSelectedNodes(nodeRanges, textArea.selectionStart, textArea.selectionEnd);

        console.log(abstractNodes)
    }

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}} ref={divRef}>
            <Toolbar page={page} textarea={textareaRef}/>
            <textarea ref={textareaRef} onSelect={onSelect} style={{width: "100%", flex: 0.5}} value={markdown.currentMarkdown} onChange={onTextareaChange}/>
            <div style={{flex: 0.5}}>
                <ProcessorFactory node={ast.root}/>
            </div>
        </div>
    )
}

namespace Markdown {
    export interface Attributes {
        page: number
    }
}

export default Markdown