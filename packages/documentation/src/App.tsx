import "./App.css"
import React, {useEffect, useState} from "react"
import {Drawer, Link, Router, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity";
import {init} from "./domain/Persistence";
import Header from "./layout/Header";

init()

function App(properties: App.Attributes) {

    const [open, setOpen] = useState(false)

    const mediaQuery = useMatchMedia("(max-width: 1440px)")

    const onLinkClick = () => {
        if (mediaQuery) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    useEffect(() => {
        setOpen(! mediaQuery)
    }, []);

    return (
        <div className={"app"}>
            <ToolBar>
                <div slot="left">
                    <button className="material-icons" onClick={() => setOpen(!open)}>
                        menu
                    </button>
                </div>
            </ToolBar>
            <Drawer.Container>
                <Drawer open={open}>
                    <div>
                        <Header>Content</Header>
                        <div style={{marginTop : "24px"}}>
                            <ul>
                                <li>
                                    <Link value={"/forms"}>
                                        <div className={"center-horizontal"}>
                                            <span>Forms</span>
                                        </div>
                                    </Link>
                                    <ul>
                                        <li>
                                            <Link value={"/forms/editor"}>
                                                <div className={"center-horizontal"}>
                                                    <span>Editor</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link value={"/forms/input"}>
                                                <div className={"center-horizontal"}>
                                                    <span>Input</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link value={"/forms/select"}>
                                                <div className={"center-horizontal"}>
                                                    <span>Select</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link value={"/forms/select/lazy"}>
                                                <div className={"center-horizontal"}>
                                                    <span>Lazy Select</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link value={"/forms/image"}>
                                                <div className={"center-horizontal"}>
                                                    <span>Image Upload</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link value={"/layout"}>
                                        <div className={"center-horizontal"}>
                                            <span>Layout</span>
                                        </div>
                                    </Link>
                                    <ul>
                                        <li>
                                            <Link value={"/layout/drawer"}>
                                                <div className={"center-horizontal"}>
                                                    <span>Drawer</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Drawer>
                <Drawer.Content onClick={onLinkClick}>
                    <Viewport>
                        <Router/>
                    </Viewport>
                </Drawer.Content>
            </Drawer.Container>
        </div>
    )
}

namespace App {
    export interface Attributes {
    }
}

export default App