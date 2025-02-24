import React, {CSSProperties, HTMLAttributes, useContext, useEffect, useRef, useState} from "react"
import {ImageData, ImageNode} from "./ImageNode";
import {Context} from "../../context/Context";

function Image(properties: Image.Attributes) {

    const {node, style} = properties

    const [image, setImage] = useState("")

    const {ast, providers, trigger} = useContext(Context)

    const inputRef = useRef<HTMLInputElement>(null)

    function onFocus() {
        node.selected = true

        trigger()
    }

    function onBlur() {
        setTimeout(() => {
            node.selected = false
            trigger()
        }, 200)
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

    }, []);

    return (
        <div tabIndex={0} style={style} onFocus={onFocus} onBlur={onBlur}>
            <div>
                <input ref={inputRef} onChange={onLoad} type={"file"} style={{visibility : "hidden"}}/>
                {
                    image && (<img src={image} style={{width : "100%"}}/>)
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