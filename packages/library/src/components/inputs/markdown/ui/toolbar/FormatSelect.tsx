import React, {useContext, useEffect, useState} from "react"
import {MarkDownContext} from "../../MarkDown";

function FormatSelect(properties: FormatSelect.Attributes) {

    const {children, callback, command, className, style} = properties

    const [value, setValue] = useState("p")

    const [disabled, setDisabled] = useState(true)

    const {model, textAreaRef, cursor} = useContext(MarkDownContext)

    let textAreaElement = textAreaRef.current;

    useEffect(() => {

        if (textAreaElement?.value.charAt(textAreaElement.selectionStart - 1) === "\n") {
            setDisabled(false)
        } else {
            setDisabled(true)
        }

    }, [textAreaElement?.selectionStart]);

    useEffect(() => {

        if (! disabled) {

            let pre = textAreaElement.value.substring(0, textAreaElement.selectionStart);
            let post = textAreaElement.value.substring(textAreaElement.selectionStart);

            let heading = ""

            switch (value) {
                case "h1" : heading = "# "
                    break
                case "h2" : heading = "## "
                    break
                case "h3" : heading = "### "
                    break
                case "h4" : heading = "#### "
                    break
                case "h5" : heading = "##### "
                    break
                case "h6" : heading = "###### "
                    break
                default : heading = ""

            }

            textAreaElement.value = `${pre}${heading}${post}`

            const event = new Event('input', {bubbles: true, cancelable: true})

            textAreaElement.dispatchEvent(event);


        }

    }, [value]);

    return (
        <select disabled={disabled} value={value} className={className} style={style} onChange={event => setValue(event.target.value)}>
            {
                children
            }
        </select>
    )
}

namespace FormatSelect {
    export interface Attributes {
        children: React.ReactNode[]
        callback: any
        command: any
        className?: string
        style?: React.CSSProperties
    }
}

export default FormatSelect