import React, {useContext} from "react"
import {Context} from "../../context/Context";
import {HeaderNode} from "./HeaderNode";

function HeaderTool(properties: HeaderTool.Attributes) {

    const {} = properties

    const headerFormat = ["h1", "h2", "h3", "h4", "h5", "h6"]

    const {providers, ast, trigger} = useContext(Context)

    function onFormatClick(format: string) {
        let block = ast.blocks.find(block => block.selected);

        if (block instanceof HeaderNode) {
            let data = block.data;
            data.level = format
        }

        trigger()
    }

    return (
        <div>
            {
                headerFormat.map(format => (
                    <button key={format} className={"material-icons"} onClick={() => onFormatClick(format)}>format_{format}</button>
                ))
            }

        </div>
    )
}

namespace HeaderTool {
    export interface Attributes {

    }
}

export default HeaderTool