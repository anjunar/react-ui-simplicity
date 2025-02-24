import "./List.css"
import React, {CSSProperties, useEffect, useLayoutEffect, useRef, useState} from "react"
import {AbstractNode} from "../AbstractNode";
import {ListData} from "./ListNode";

function List(properties: List.Attributes) {

    const {node, ref, style} = properties

    const [content, setContent] = useState("<ul><li><br/></li></ul>")

    function onChange(event: React.FocusEvent) {
        let target = event.target as HTMLDivElement;
        if (content !== target.innerHTML) {
            setContent(target.innerHTML)
        }
    }

    useEffect(() => {

        let ulElement = ref.current.querySelector("ul");
        let listData = new ListData();
        node.data = listData

        for (const child of ulElement.children) {
            if (child.textContent.trim()) {
                listData.items.push(child.textContent)
            }
        }


    }, [content]);

    useEffect(() => {

        if (node.data.items.length > 0) {
            let ulElement = document.createElement("ul")

            for (const item of node.data.items) {
                let liElement = document.createElement("li");
                liElement.textContent = item
                ulElement.appendChild(liElement)
            }

            setContent(ulElement.outerHTML)
        }

    }, [node]);

    useLayoutEffect(() => {
        ref.current.innerHTML = content
    }, []);


    return (
        <div className={"list"} ref={ref} contentEditable={true} onBlur={onChange} style={style}></div>
    )
}

namespace List {
    export interface Attributes {
        node : AbstractNode<ListData>
        ref : React.RefObject<HTMLDivElement>
        style? : CSSProperties
    }
}

export default List
