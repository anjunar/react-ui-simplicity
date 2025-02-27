import "./List.css"
import React, {CSSProperties, useContext, useEffect, useLayoutEffect, useRef, useState} from "react"
import {AbstractNode} from "../shared/AbstractNode";
import {ListData} from "./ListNode";
import {Context} from "../../context/Context";

function List(properties: List.Attributes) {

    const {node, style} = properties

    const [content, setContent] = useState("<ul><li><p><span><br/></span></p></li></ul>")

    const ref = useRef<HTMLDivElement>(null);

    const {ast, providers, trigger} = useContext(Context)

    function onBlur(event: React.FocusEvent) {
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
        node.dom = ref.current

        let listener = () => {
            let selection = window.getSelection();
            node.selected = node.dom.contains(selection.anchorNode)
            trigger()
        };

        document.addEventListener("selectionchange", listener)

        return () => {
            document.removeEventListener("selectionchange", listener)
        }
    }, []);


    return (
        <div className={"list"} ref={ref} contentEditable={true} onBlur={onBlur} style={style}></div>
    )
}

namespace List {
    export interface Attributes {
        node : AbstractNode<ListData>
        style? : CSSProperties
    }
}

export default List
