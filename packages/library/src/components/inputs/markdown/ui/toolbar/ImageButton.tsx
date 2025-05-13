import React, {useContext, useEffect, useRef, useState} from "react"
import {MarkDownContext} from "../../MarkDown";

function ImageButton(properties: ImageButton.Attributes) {

    const {children, title} = properties

    const inputRef = useRef<HTMLInputElement>(null);

    const [disabled, setDisabled] = useState(true)

    const {model, textAreaRef, cursor} = useContext(MarkDownContext)

    function onClick() {

        let input = inputRef.current;
        let textArea = textAreaRef.current;

        let selectionStart = textArea.selectionStart;
        let selectionEnd = textArea.selectionEnd

        input.addEventListener("change", (event) => {
            if (input.files) {
                let file = input.files[0]
                let reader = new FileReader()
                reader.onload = e => {
                    if (reader.result) {

                        model.store.files.push({
                            name: file.name,
                            type: file.type,
                            data: reader.result as string,
                            lastModified: file.lastModified
                        })

                        let pre = textArea.value.substring(0, selectionStart);
                        let post = textArea.value.substring(selectionEnd);

                        textArea.value = `${pre}![Picture](${file.name})${post}`

                        const event = new Event('input', {bubbles: true, cancelable: true})

                        textArea.dispatchEvent(event);

                    }
                }
                reader.readAsDataURL(file)
            }
        })

        input.click()
    }

    useEffect(() => {
        if (cursor !== null) {
            setDisabled(cursor.length > 0)
        }
    }, [cursor]);


    return (
        <div className={"image-button"}>
            <input ref={inputRef} type={"file"} style={{display: "none"}}/>
            <button disabled={disabled} title={title} className={"material-icons"} onClick={onClick}>{children}</button>
        </div>
    )
}

namespace ImageButton {
    export interface Attributes {
        children: React.ReactNode
        title : string
    }
}

export default ImageButton