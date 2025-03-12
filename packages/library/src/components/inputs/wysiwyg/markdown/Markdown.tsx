import React, {useContext, useEffect, useState} from "react"
import {tokenizer} from "./parser/Tokenizer";
import {parseString} from "./parser/Parser";
import ProcessorFactory from "../processors/ProcessorFactory";
import {RootNode} from "../core/TreeNode";
import {EditorContext} from "../EditorState";
import {generate} from "./generator/Generator";

function Markdown(properties: Markdown.Attributes) {

    const {} = properties

    const {ast} = useContext(EditorContext)

    const [text, setText] = useState(generate(ast.root))

    useEffect(() => {
        ast.root = parseString(text)
        ast.triggerAST()
    }, [text]);

    return (
        <div style={{height : "100%"}}>
            <textarea style={{width : "100%", height : "50%"}} value={text} onChange={event => setText(event.target.value)}/>
            <div style={{height : "50%"}}>
                <ProcessorFactory node={ast.root}/>
            </div>
        </div>
    )
}

namespace Markdown {
    export interface Attributes {

    }
}

export default Markdown