import React from "react"
import {ParagraphNode} from "./ParagraphNode";
import OrderNode from "../shared/OrderNode";

function ParagraphTool(properties: ParagraphTool.Attributes) {

    const {node} = properties

    return (
        <div>
            <OrderNode node={node}/>
        </div>
    )
}

namespace ParagraphTool {
    export interface Attributes {
        node : ParagraphNode
    }
}

export default ParagraphTool