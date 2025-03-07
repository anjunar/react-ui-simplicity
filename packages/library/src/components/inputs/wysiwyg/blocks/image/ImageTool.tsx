import React, {useContext, useEffect, useState} from "react"
import {ImageNode} from "./ImageNode";
import EditorContext from "../../EditorContext";

function ImageTool(properties: ImageTool.Attributes) {

    const {node} = properties

    const [width, setWidth] = useState(node.width)

    const [height, setHeight] = useState(node.height)

    const [aspectRatio, setAspectRatio] = useState(node.aspectRatio)

    let {ast: {triggerAST}} = useContext(EditorContext);

    function onWidthChange(event : React.ChangeEvent<HTMLInputElement>) {
        setWidth(event.target.valueAsNumber)
    }

    function onHeightChange(event : React.ChangeEvent<HTMLInputElement>) {
        setHeight(event.target.valueAsNumber)
    }

    function onSendClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()

        node.width = width
        node.height = height

        triggerAST()
    }

    useEffect(() => {
        let result = Math.round(height * aspectRatio * 100) / 100;
        if (result !== width) {
            setWidth(result)
        }

    }, [height]);

    useEffect(() => {
        let result = Math.round((width / aspectRatio) * 100) / 100;
        if (result !== height) {
            setHeight(result)
        }
    }, [width]);

    return (
        <div style={{display : "flex", flexDirection : "column"}}>
            <div>
                <input value={width} onChange={onWidthChange} type={"number"} placeholder={"Width"} style={{width : "50px"}} onClick={event => event.stopPropagation()}/>
                x
                <input value={height} onChange={onHeightChange} type={"number"} placeholder={"Height"}  style={{width : "50px"}} onClick={event => event.stopPropagation()}/>
            </div>
            <button onClick={onSendClick}>Ok</button>
        </div>
    )
}

namespace ImageTool {
    export interface Attributes {
        node : ImageNode
    }
}

export default ImageTool