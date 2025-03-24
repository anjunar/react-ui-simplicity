import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";

function RootProcessor({node}: RootNode.Attributes) {
    const [scrollTop, setScrollTop] = useState(0)

    const divRef = useRef<HTMLDivElement>(null);
    const {editorRef, contentEditableRef} = useContext(DomContext);

    const visibleBlocks = useMemo(() => {
        if (!editorRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) < editorRef.current.clientHeight && (height + child.domHeight * 2) >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, scrollTop, editorRef.current]);

    useEffect(() => {
        node.dom = divRef.current;
    }, [node]);

    useEffect(() => {
        const contentEditable = contentEditableRef.current;
        if (!contentEditable) return;

        const handleScroll = (event: WheelEvent) => {

            setScrollTop((prev) => {
                let minimum = prev + event.deltaY
                minimum = Math.max(0, minimum);
                let maximum = node.children.reduce((sum, child) => sum + child.domHeight, 0) - editorRef.current.clientHeight;
                return Math.min(minimum, maximum);
            });
        };

        contentEditable.addEventListener("wheel", handleScroll);
        return () => contentEditable.removeEventListener("wheel", handleScroll);
    }, [contentEditableRef.current, scrollTop]);

    return (
        <div ref={divRef} className="root">
            {visibleBlocks.map(childNode => (
                <ProcessorFactory key={childNode.id} node={childNode}/>
            ))}
        </div>
    );
}

namespace RootNode {
    export interface Attributes {
        node: RootNode;
    }
}

export default RootProcessor;
