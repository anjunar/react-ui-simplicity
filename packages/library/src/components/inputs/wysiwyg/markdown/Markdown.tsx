import React, {useContext, useEffect, useRef, useState} from "react"
import {tokenizer} from "./parser/Tokenizer";
import {parseString} from "./parser/Parser";
import ProcessorFactory from "../shared/blocks/shared/ProcessorFactory";
import {RootNode} from "../shared/core/TreeNode";
import {EditorContext} from "../EditorState";
import {generate} from "./generator/Generator";

function Markdown(properties: Markdown.Attributes) {

    const {page} = properties

    const divRef = useRef<HTMLDivElement>(null);

    const {ast} = useContext(EditorContext)

    const [text, setText] = useState(generate(ast.root))

    useEffect(() => {
        ast.root = parseString(text)
        ast.triggerAST()
    }, [text]);

    return (
        <div style={{height : "100%"}} ref={divRef}>
            <textarea style={{width : "100%", height : "50%"}} value={text} onChange={event => setText(event.target.value)}/>
            <div style={{height : "50%"}}>
                <ProcessorFactory node={ast.root}/>
            </div>
        </div>
    )
}

namespace Markdown {
    export interface Attributes {
        page : number
    }
}

export default Markdown