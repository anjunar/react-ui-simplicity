import React, {useContext, useEffect, useState} from "react"

function FormatButton(properties: FormatButton.Attributes) {

    const {children, callback, command} = properties

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    return (
        <button disabled={disabled} className={`material-icons${active ? " active" : ""}`}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children: React.ReactNode
        callback: any
        command: any
    }
}

export default FormatButton