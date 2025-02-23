import React, {useEffect, useRef, useState} from "react"
import NodeFactory from "../blocks/NodeFactory";
import MenuButton from "./MenuButton";
import {AbstractNode} from "../blocks/AbstractNode";

function Block(properties: Block.Attributes) {

    const {node} = properties

    const ref = useRef<HTMLElement>(null);

    const [isFocused, setIsFocused] = useState(false);

    const [isMenuClicked, setIsMenuClicked] = useState(false)

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


    return (
        <div>
            <NodeFactory node={node} ref={ref}/>
            {(isFocused || isMenuClicked) && <MenuButton onProviderClick={() => setIsMenuClicked(false)} onClick={() => setIsMenuClicked(true)} node={node}>add</MenuButton>}
        </div>
    )
}

namespace Block {
    export interface Attributes {
        node : AbstractNode<any>
    }
}

export default Block
