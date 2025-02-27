import React, {useContext, useEffect, useState} from "react"
import {Context} from "../../context/Context";

function ImageTool(properties: ImageTool.Attributes) {

    const {} = properties

    const {providers, ast, trigger} = useContext(Context)

    const [width, setWidth] = useState(() => {
        let block = ast.blocks.find(block => block.selected);
        return block.dom.style.maxWidth
    })

    useEffect(() => {
        let block = ast.blocks.find(block => block.selected);

        block.dom.style.maxWidth = width
    }, [width]);

    return (
        <div style={{lineHeight : "28px", verticalAlign : "middle"}}>
            <button onClick={() => setWidth("180px")}>180 px</button>
            <button onClick={() => setWidth("360px")}>360 px</button>
            <button onClick={() => setWidth("720px")}>720 px</button>
        </div>
    )
}

namespace ImageTool {
    export interface Attributes {

    }
}

export default ImageTool