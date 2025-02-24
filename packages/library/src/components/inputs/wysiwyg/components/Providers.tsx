import React, {CSSProperties, useContext, useEffect, useRef, useState} from "react"
import {createPortal} from "react-dom";
import Window from "../../../modal/window/Window";
import {Context} from "../context/Context";
import {AbstractNode} from "../blocks/AbstractNode";
import {AbstractProvider} from "../blocks/AbstractProvider";

function Providers(properties: MenuButton.Attributes) {

    const {children, onClick, onProviderClick, node, style} = properties

    const [open, setOpen] = useState(false)

    const buttonRef = useRef<HTMLButtonElement>(null);

    const {ast, providers, trigger} = useContext(Context)

    function onButtonClickHandler(event: React.MouseEvent) {
        event.stopPropagation()
        setOpen(true)
        if (onClick) {
            onClick()
        }
    }

    function onProviderClickHandler(event: React.MouseEvent, provider: AbstractProvider<any, any>) {
        event.stopPropagation()

        setOpen(false)

        let index = ast.blocks.findIndex(element => element === node);

        let nodeInstance = new provider.factory();

        if (node.isEmpty) {
            ast.blocks.splice(index, 1, nodeInstance)
        } else {
            ast.blocks.splice(index + 1, 0, nodeInstance)
        }

        if (onProviderClick) {
            onProviderClick()
        }

        trigger()
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
        <div className={"menu-button"} style={style}>
            {
                open && createPortal(
                    <Window style={{left: buttonRef.current.offsetLeft + 12, top: buttonRef.current.offsetTop + 32}} onClick={event => event.stopPropagation()}>
                        <Window.Content>
                            <div style={{padding: "5px"}}>
                                {
                                    providers.map(provider => (
                                        <button key={provider.title} style={{display: "block", width: "100%"}} onClick={(event) => onProviderClickHandler(event, provider)}>
                                            <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                                                <div className={"material-icons"}>{provider.icon}</div>
                                                <div>{provider.title}</div>
                                            </div>
                                        </button>
                                    ))
                                }
                            </div>
                        </Window.Content>
                    </Window>
                    , document.getElementById("viewport"))
            }
            <button ref={buttonRef} className={"material-icons"} onClick={onButtonClickHandler}>{children}</button>
        </div>
    )
}

namespace MenuButton {
    export interface Attributes {
        children: string
        node: AbstractNode<any>
        onClick?: () => void
        onProviderClick?: () => void
        style?: CSSProperties
    }
}

export default Providers