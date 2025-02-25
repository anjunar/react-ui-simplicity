import React, {useContext} from "react"
import ToolButton from "../../components/ToolButton";
import {Context} from "../../context/Context";

function ParagraphTool(properties: ParagraphTool.Attributes) {

    const {} = properties

    const {ast, providers, trigger} = useContext(Context)

    const node = ast.blocks.find(node => node.selected)

    return (
        <div>
            <ToolButton editableContent={node.dom}
                        command={"bold"}
                        callback={css => css.fontWeight === "700"}>
                format_bold
            </ToolButton>
        </div>
    )
}

namespace ParagraphTool {
    export interface Attributes {

    }
}

export default ParagraphTool
