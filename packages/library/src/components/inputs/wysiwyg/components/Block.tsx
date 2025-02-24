import React, {useEffect, useMemo, useRef, useState} from "react"
import NodeFactory from "../blocks/NodeFactory";
import Providers from "./Providers";
import {AbstractNode} from "../blocks/AbstractNode";
import {useMatchMedia} from "../../../../hooks/UseMatchMedia";
import Actions from "./Actions";

function Block(properties: Block.Attributes) {

    const {node} = properties

    const ref = useRef<HTMLElement>(null);

    const [isFocused, setIsFocused] = useState(false);

    const [isMenuClicked, setIsMenuClicked] = useState(false)

    const [isMouseOver, setIsMouseOver] = useState(false)

    let matchMedia = useMatchMedia("(max-width: 600px)");

    useEffect(() => {
        const handleFocus = () => {
            let contentFocus = document.activeElement && ref.current?.contains(document.activeElement);

            setTimeout(() => {
                setIsFocused(contentFocus);
            }, 200)
        };

        document.addEventListener("focusin", handleFocus);
        document.addEventListener("focusout", handleFocus);

        return () => {
            document.removeEventListener("focusin", handleFocus);
            document.removeEventListener("focusout", handleFocus);
        };
    }, []);


    const menuButton = <div style={{display : "flex"}}>
        <Providers onProviderClick={() => setIsMenuClicked(false)} onClick={() => setIsMenuClicked(true)} node={node}>add</Providers>
        <Actions onProviderClick={() => setIsMenuClicked(false)} onClick={() => setIsMenuClicked(true)} node={node}>toc</Actions>
    </div>

    return (
        <div onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}>
            <div style={{display : ! matchMedia ? "flex" : "block", alignItems : "center"}}>
                {! matchMedia && (isMouseOver || (window.ontouchstart && isFocused) || isMenuClicked) ? menuButton : <div style={{width : 72}}></div>}
                <NodeFactory node={node} ref={ref}/>
                {matchMedia && (isMouseOver || (window.ontouchstart && isFocused) || isMenuClicked) ? menuButton : ""}
            </div>
        </div>
    )
}

namespace Block {
    export interface Attributes {
        node : AbstractNode<any>
    }
}

export default Block
