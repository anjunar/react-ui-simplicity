import "./Tab.css"
import React, {useEffect, useState} from "react"

function Tab(properties: Tab.Attributes) {

    const {className, children, tab, selected, ...rest} = properties

    const [isSelected, setSelected] = useState(selected)

    useEffect(() => {
        if (tab) {
            tab.addListener((selected : any) => {
                setSelected(selected)
            })
        }
    }, [])

    return (
        <div
            onClick={() => tab?.onSelect()}
            className={
                (className ? className + " " : "") +
                "tab" +
                (isSelected ? " selected" : "")
            }
            {...rest}
        >
            {children}
        </div>
    )
}

namespace Tab {
    export interface Attributes {
        className? : string
        children : React.ReactNode
        tab? : any
        selected? : boolean
    }
}

export default Tab