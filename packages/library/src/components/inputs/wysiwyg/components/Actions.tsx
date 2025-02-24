import React, {useContext, useEffect, useRef, useState} from "react"
import {AbstractNode} from "../blocks/AbstractNode";
import {createPortal} from "react-dom";
import Window from "../../../modal/window/Window";
import {Context} from "../context/Context";

function Actions(properties: Actions.Attributes) {

    const {children, node, onClick, onProviderClick} = properties

    const [open, setOpen] = useState(false)

    const buttonRef = useRef<HTMLButtonElement>(null);

    const {ast, providers, trigger} = useContext(Context)

    function onDeleteClick() {
        let index = ast.blocks.findIndex(element => element === node);

        ast.blocks.splice(index, 1)

        setOpen(false)

        if (onProviderClick) {
            onProviderClick()
        }

        trigger()
    }

    function onButtonClick(event : React.MouseEvent) {
        event.stopPropagation()
        setOpen(true)
        if (onClick) {
            onClick()
        }
    }

    useEffect(() => {
        document.addEventListener("click", () => {
            setOpen(false)

            if (onProviderClick) {
                onProviderClick()
            }

        })
    }, []);

    return (
        <div>
            {
                open && createPortal(
                    <Window style={{left: buttonRef.current.offsetLeft + 12, top: buttonRef.current.offsetTop + 32}} onClick={event => event.stopPropagation()}>
                        <Window.Content>
                            <div style={{padding: "5px"}}>
                                <button style={{display: "block", width : "100%"}} onClick={onDeleteClick}>
                                    <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                                        <div className={"material-icons"}>delete</div>
                                        <div>Delete</div>
                                    </div>
                                </button>
                            </div>
                        </Window.Content>
                    </Window>
                    , document.getElementById("viewport"))
            }
            <button ref={buttonRef} className={"material-icons"} onClick={onButtonClick}>{children}</button>
        </div>
    )
}

namespace Actions {
    export interface Attributes {
        children : string
        node : AbstractNode<any>
        onClick?: () => void
        onProviderClick?: () => void
    }
}

export default Actions