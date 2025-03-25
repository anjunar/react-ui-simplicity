import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";
import {useWheel} from "../../../../../hooks/UseWheelHook";

function RootProcessor({node}: RootNode.Attributes) {

    const divRef = useRef<HTMLDivElement>(null);
    const {editorRef, contentEditableRef} = useContext(DomContext);

    const scrollTop = useWheel(() => {
        return {
            ref : contentEditableRef,
            maximum : node.domHeight - contentEditableRef.current.offsetHeight
        }
    }, [contentEditableRef.current, node.children.length])

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
