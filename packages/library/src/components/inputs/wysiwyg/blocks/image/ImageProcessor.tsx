import React, {useContext, useEffect, useRef, useState} from "react"
import {ImageNode} from "./ImageNode";
import EditorContext from "../../EditorContext";
import {findNodeWithMaxDepth} from "../../core/TreeNodes";

function ImageProcessor(properties: ImageProcessor.Attributes) {

    const {node} = properties

    const [image, setImage] = useState(node.src)

    const [open, setOpen] = useState(false)

    let {ast: {triggerAST}, cursor: {currentCursor, triggerCursor}} = useContext(EditorContext);

    const divRef = useRef(null);

    const inputRef = useRef(null);

    const onLoad = (event: any) => {
        let input = event.target
        let files = input.files
        if (files) {
            let file = files[0]

            if (file) {
                let reader = new FileReader()

                reader.addEventListener("load", () => {
                    if (reader.result) {
                        let result = reader.result as string

                        setImage(result)

                        triggerAST()
                    }
                })

                reader.readAsDataURL(file)
            }
        }
    }

    useEffect(() => {
        let cursor = findNodeWithMaxDepth(node, (node) => node === currentCursor.container, 2);

        if (cursor) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [currentCursor?.container]);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    useEffect(() => {
        inputRef.current.click()
    }, []);

    return (
        <div ref={divRef} style={{display : "flex", justifyContent : "center", alignItems : "center", position : "relative"}}>
            {
                image && <img src={image} style={{maxWidth : "360px", width : "100%"}}/>
            }
            <input ref={inputRef} onChange={onLoad} type={"file"} style={{display : "none"}}/>
            {
                open && (
                    <div style={{
                        position: "absolute",
                        left: "50%",
                        transform : "translateX(-50%)",
                        bottom : "12px",
                        backgroundColor : "var(--color-background-primary)",
                        boxShadow : "3px 3px 10px 3px #1a1a1a",
                        display : "flex",
                        alignItems : "center"
                    }}>
                        <input type={"number"} placeholder={"Width"} style={{width : "50px"}} onClick={event => event.stopPropagation()}/>
                        <button className={"material-icons"}>add</button>
                        <button className={"material-icons"}>delete</button>
                        <input type={"text"} placeholder={"Height"}  style={{width : "50px"}} onClick={event => event.stopPropagation()}/>
                    </div>
                )
            }
        </div>
    )
}

namespace ImageProcessor {
    export interface Attributes {
        node : ImageNode
    }
}

export default ImageProcessor
