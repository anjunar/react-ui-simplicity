import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";

function RootProcessor({node}: RootNode.Attributes) {
    const [scrollTop, setScrollTop] = useState(0)

    const divRef = useRef<HTMLDivElement>(null);
    const {editorRef, contentEditableRef} = useContext(DomContext);

    const offset = useMemo(() => {
        let height = 0;
        for (const child of node.children) {
            if (height + child.domHeight > scrollTop) break;
            height += child.domHeight;
        }
        return height;
    }, [node.children.length, scrollTop]);

    const visibleBlocks = useMemo(() => {
        if (!editorRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) < editorRef.current.clientHeight && (height + child.domHeight) >= scrollTop
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
            event.preventDefault();

            setScrollTop(prev => {
                const maxScroll = node.domHeight - contentEditable.offsetHeight;
                const newScrollTop = Math.max(0, Math.min(prev + event.deltaY, maxScroll));

                contentEditable.scrollTop = newScrollTop;

                return newScrollTop;
            });
        };

        contentEditable.addEventListener("wheel", handleScroll);
        return () => contentEditable.removeEventListener("wheel", handleScroll);
    }, []);
    return (
        <div ref={divRef} className="root">
            <div style={{height : offset}}></div>
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
