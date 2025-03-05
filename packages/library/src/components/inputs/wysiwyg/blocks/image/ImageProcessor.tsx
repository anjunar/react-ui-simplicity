import React, {useContext, useEffect, useRef, useState} from "react"
import {ImageNode} from "./ImageNode";
import EditorContext from "../../EditorContext";
import {findNodeWithMaxDepth} from "../../core/TreeNodes";
import {ParagraphNode, TextNode} from "../../core/TreeNode";

function ImageProcessor(properties: ImageProcessor.Attributes) {

    const {node} = properties

    const [image, setImage] = useState(node.src)

    const [open, setOpen] = useState(false)

    const [width, setWidth] = useState(360)

    const [height, setHeight] = useState(360)

    const [aspectRatio, setAspectRatio] = useState(1)

    const [dimensions, setDimensions] = useState({
        width : 360,
        height : 360
    })

    let {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event} = useContext(EditorContext);

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

                        const image = new Image()
                        image.src = result
                        image.onload = () => {
                            let ratio = image.width / image.height;
                            setAspectRatio(ratio)
                            let height = width / ratio;
                            setHeight(height)

                            setDimensions({
                                width : 360,
                                height : height
                            })
                        }

                        setImage(result)

                        triggerAST()
                    }
                })

                reader.readAsDataURL(file)
            }
        }
    }

    function onWidthChange(event : React.ChangeEvent<HTMLInputElement>) {
        setWidth(event.target.valueAsNumber)
        triggerAST()
    }

    function onHeightChange(event : React.ChangeEvent<HTMLInputElement>) {
        setHeight(event.target.valueAsNumber)
        triggerAST()
    }

    function onSendClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()
        setDimensions({
            width : width,
            height : height
        })
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

    useEffect(() => {

        if (event.instance && node === currentCursor?.container && !event.handled) {

            switch (event.instance.type) {
                case "insertLineBreak" : {
                    let index = node.parentIndex;
                    let parent = node.parent;
                    let textNode = new TextNode();

                    currentCursor.container = textNode
                    currentCursor.offset = 0

                    parent.insertChild(index + 1, new ParagraphNode([textNode]));

                    event.handled = true

                } break
                case "deleteContentBackward" : {

                    let flattened = root.flatten;
                    let index = flattened.indexOf(node);
                    let slice = flattened.slice(0, index);
                    let textNode = slice.findLast(node => node instanceof TextNode);

                    currentCursor.container = textNode
                    currentCursor.offset = textNode.text.length;

                    node.remove()

                    event.handled = true

                } break
            }

            triggerCursor()
            triggerAST()
        }

    }, [event.instance]);

    return (
        <div ref={divRef} style={{display : "flex", justifyContent : "center", alignItems : "center", position : "relative"}}>
            {
                image && <img src={image} style={{maxWidth : dimensions.width, maxHeight : dimensions.height, width : "100%"}}/>
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
                        <input value={width} onChange={onWidthChange} type={"number"} placeholder={"Width"} style={{width : "50px"}} onClick={event => event.stopPropagation()}/>
                        <button className={"material-icons"} onClick={onSendClick}>send</button>
                        <input value={height} onChange={onHeightChange} type={"number"} placeholder={"Height"}  style={{width : "50px"}} onClick={event => event.stopPropagation()}/>
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
