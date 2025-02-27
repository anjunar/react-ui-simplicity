import React from "react"

function TextEditor(properties: TextEditor.Attributes) {

    const {} = properties

    return (
        <div contentEditable={true}></div>
    )
}

namespace TextEditor {
    export interface Attributes {

    }
}

export default TextEditor