import "./Tabs.css"
import React, {CSSProperties, useState} from "react"
import {v4} from "uuid";

function Tabs(properties: Tabs.Attributes) {

    const {page, onPage, className, children, ...rest} = properties

    const [tabs, setTabs] = useState(() => {
        const tabModel = children.map(
            child =>
                new (class CustomTab extends Tab {
                    onSelect() {
                        for (const tab of tabModel) {
                            tab.fire(false)
                        }
                        this.selected = true
                        this.fire(this.selected)
                        onPage(tabModel.indexOf(this))
                    }
                })()
        )

        return children.map((child, index) => {
            return React.cloneElement(child, {
                // @ts-ignore
                selected: page === index,
                tab: tabModel[index],
                key: v4()
            })
        })
    })

    return (
        <div className={(className ? className + " " : "") + "tabs"} {...rest}>
            <div className="placeholder"></div>
            {tabs}
            <div className="placeholder"></div>
        </div>
    )
}

export abstract class Tab {

    listeners : any[] = []
    selected : boolean = false

    abstract onSelect() : void

    addListener(listener : any) {
        this.listeners.push(listener)
    }

    fire(selected : any) {
        for (const listener of this.listeners) {
            listener(selected)
        }
    }
}

namespace Tabs {
    export interface Attributes {
        page: number
        onPage?: any
        className?: string
        children: React.ReactElement[]
        style? : CSSProperties
    }
}

export default Tabs