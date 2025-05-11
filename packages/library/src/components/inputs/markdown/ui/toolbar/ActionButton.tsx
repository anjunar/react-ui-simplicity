import React, {useContext, useEffect, useState} from "react"

function ActionButton(properties: ActionButton.Attributes) {

    const {children, command} = properties

    const [disabled, setDisabled] = useState(false)

    return (
        <button disabled={disabled} className={"material-icons"}>{children}</button>
    )
}

namespace ActionButton {
    export interface Attributes {
        children: React.ReactNode
        command : any
    }
}

export default ActionButton