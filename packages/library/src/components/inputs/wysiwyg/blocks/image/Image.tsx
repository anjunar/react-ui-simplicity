import React, {HTMLAttributes, useContext, useEffect, useRef, useState} from "react"
import {ImageData, ImageNode} from "./ImageNode";
import {Context} from "../../context/Context";

function Image(properties: Image.Attributes) {

    const {node, ref, ...rest} = properties

    const [image, setImage] = useState("")

    const context = useContext(Context)

    const inputRef = useRef<HTMLInputElement>(null)

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

                        context.trigger()
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
        <div {...rest} ref={ref} tabIndex={0}>
            <input ref={inputRef} onChange={onLoad} type={"file"} style={{visibility : "hidden"}}/>
            {
                image && (<img src={image} style={{width : "100%"}}/>)
            }
        </div>
    )
}

namespace Image {
    export interface Attributes {
        node : ImageNode
        ref : React.RefObject<HTMLDivElement>
    }
}

export default Image