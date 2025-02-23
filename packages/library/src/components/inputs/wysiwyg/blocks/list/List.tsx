import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import {AbstractNode} from "../AbstractNode";
import {ListData} from "./ListNode";

function List(properties: List.Attributes) {

    const {node, ref} = properties

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
        <div ref={ref} contentEditable={true} onBlur={onChange}></div>
    )
}

namespace List {
    export interface Attributes {
        node : AbstractNode<ListData>
        ref : React.RefObject<HTMLDivElement>
    }
}

export default List
