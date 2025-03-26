import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import OrderNode from "../shared/OrderNode";
import {findNearestTextRight} from "../../utils/ProcessorUtils";

function CodeTool(properties: CodeTool.Attributes) {

    const {node} = properties

    const {ast : {triggerAST}} = useContext(EditorContext)

    function onDelete() {
        node.remove()

        triggerAST()
    }

    return (
        <div>
            <button onClick={onDelete} className={"container"}><span className={"material-icons"}>delete</span>Delete Code</button>
            <hr style={{width: "100%"}}/>
            <OrderNode node={node}/>
        </div>
    )
}

namespace CodeTool {
    export interface Attributes {
        node : CodeNode
    }
}

export default CodeTool