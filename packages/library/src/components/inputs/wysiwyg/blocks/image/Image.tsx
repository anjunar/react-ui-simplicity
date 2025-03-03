import React, {CSSProperties, HTMLAttributes, useContext, useEffect, useRef, useState} from "react"
import {ImageData, ImageNode} from "./ImageNode";
import {WysiwygContext} from "../../context/WysiwygContext";

function Image(properties: Image.Attributes) {

    const {node, style} = properties

    const [image, setImage] = useState("")

    const {ast, providers, trigger} = useContext(WysiwygContext)

    const inputRef = useRef<HTMLInputElement>(null)

    const ref = useRef<HTMLImageElement>(null)

    const contentEditableRef = useRef<HTMLDivElement>(null);

    function onImageClick(event : React.MouseEvent) {

        let selection = window.getSelection();

        if (selection?.rangeCount) {
            let rangeAt = selection.getRangeAt(0);

            rangeAt.selectNode(event.target as HTMLElement)

            selection.removeAllRanges()
            selection.addRange(rangeAt)
        }
    }

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

                        trigger()
                    }
                })

                reader.readAsDataURL(file)
            }
        }
    }

    useEffect(() => {
        node.data = new ImageData(image)
    }, [image]);

    useEffect(() => {
        setImage(node.data.url)
    }, [node]);

    useEffect(() => {

        inputRef.current.click()

        if (ref.current) {
            ref.current.addEventListener("beforeinput", (event) => {
                event.preventDefault()
            })
        }

        let listener = () => {
            let selection = window.getSelection();
            node.selected = contentEditableRef.current.contains(selection.anchorNode)
            trigger()
        };

        document.addEventListener("selectionchange", listener)

        return () => {
            document.removeEventListener("selectionchange", listener)
        }
    }, []);

    useEffect(() => {
        node.dom = ref.current
    }, [ref.current]);

    return (
        <div style={style}>
            <input ref={inputRef} onChange={onLoad} type={"file"} style={{display : "none"}}/>
            <div tabIndex={0} ref={contentEditableRef} contentEditable={true} suppressContentEditableWarning={true}>
                {
                    image && (
                        <div style={{display : "flex", justifyContent : "center"}}>
                            <img ref={ref} onClick={onImageClick} src={image} style={{width : "100%", maxWidth : "360px"}}/>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

namespace Image {
    export interface Attributes {
        node : ImageNode
        style? : CSSProperties
    }
}

export default Image