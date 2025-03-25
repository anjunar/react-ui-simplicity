import React, {useContext, useEffect, useMemo, useRef} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";
import {useWheel} from "../../../../../hooks/UseWheelHook";

function RootProcessor({node}: RootNode.Attributes) {

    const divRef = useRef<HTMLDivElement>(null);
    const {contentEditableRef} = useContext(DomContext);

    const [scrollTop, setScrollTop] = useWheel(() => {
        return {
            ref : contentEditableRef,
            maximum : node.virtualHeight - contentEditableRef.current.offsetHeight
        }
    }, [contentEditableRef.current, node.children.length, node.virtualHeight])

    const offset = useMemo(() => {
        let height = 0;
        for (const child of node.children) {
            if (height + child.domHeight > scrollTop) break;
            height += child.domHeight;
        }
        return height;
    }, [node.children.length, scrollTop]);

    const visibleBlocks = useMemo(() => {
        if (!contentEditableRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) <= contentEditableRef.current.clientHeight && (height + child.domHeight) >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, scrollTop, contentEditableRef.current]);

    useEffect(() => {
        node.dom = divRef.current;
    }, [node]);

    useEffect(() => {
        const contentEditable = contentEditableRef.current;
        if (!contentEditable) return;

        const isAtBottom = (scrollTop + contentEditable.clientHeight) >= (node.domHeight - 150)

        if (isAtBottom) {
            let number = node.domHeight - contentEditable.clientHeight;
            contentEditable.scrollTop = number
            setScrollTop(number)
        }

    }, [node.children.length, node.domHeight]);

    return (
        <div ref={divRef} className="root">
            <div style={{height : offset}}></div>
            {visibleBlocks.map(childNode => (
                <ProcessorFactory key={childNode.id} node={childNode}/>
            ))}
            <div style={{height : node.virtualHeight - (contentEditableRef.current?.clientHeight || 0) - offset}}></div>
        </div>
    );
}

namespace RootNode {
    export interface Attributes {
        node: RootNode;
    }
}

export default RootProcessor;
