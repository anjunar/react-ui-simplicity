import React, {useEffect, useState} from "react"
import Tabs from "../../../layout/tabs/Tabs";
import Tab from "../../../layout/tabs/Tab";
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";
import NodeFactory from "./nodes/NodeFactory";
import {v4} from "uuid";

const elementsIdentity = new WeakMap<HTMLElement, string>

function getElementsIdentity(element: HTMLElement) {

    if (!element) {
        return null
    }

    let id = elementsIdentity.get(element);

    if (id) {
        return id
    } else {
        let id = v4()
        elementsIdentity.set(element, id)
        return id
    }
}

function Inspector(properties : Inspector.Attributes) {

    const {element, elements} = properties

    const [active, setActive] = useState(element)

    useEffect(() => {

        for (const element of elements) {
            element.classList.remove("editor-selected")
        }

        active.classList.add("editor-selected")
    }, [active]);

    return (
        <div style={{display : "flex", justifyContent : "center"}}>
            <NodeFactory element={active}/>
            <div>
                {
                    elements.map(element => (
                        <div onClick={() => setActive(element)} style={{color : active === element ? "var(--color-selected)" : ""}}>{element.localName}</div>
                    ))
                }
            </div>
            <NodeFactory element={active}/>
        </div>
    )
}

namespace Inspector {
    export interface Attributes {
        elements : HTMLElement[]
        element : HTMLElement
    }
}

export default Inspector