import "./App.css"
import React, {useEffect, useState} from "react"
import {Drawer, Link, Page, Pages, Router, Tab, Tabs, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity";
import {init} from "./domain/Persistence";
import Header from "./layout/Header";

init()

function App(properties: App.Attributes) {

    const [open, setOpen] = useState(false)

    const mediaQuery = useMatchMedia("(max-width: 1440px)")

    const [page, setPage] = useState(0)

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
                        <Tabs page={page} onPage={(value) => setPage(value)} style={{height : "82px"}}>
                            <Tab><h3>Components</h3></Tab>
                            <Tab><h3>Platform</h3></Tab>
                        </Tabs>
                        <Pages page={page}>
                            <Page>
                                <div>
                                    <ul>
                                        <li>
                                            <Link value={"/forms"}>
                                                <div>
                                                    <span>Forms</span>
                                                </div>
                                            </Link>
                                            <ul>
                                                <li>
                                                    <Link value={"/forms/editor"}>
                                                        <div>
                                                            <span>Editor</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/forms/input"}>
                                                        <div>
                                                            <span>Input</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/forms/select"}>
                                                        <div>
                                                            <span>Select</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/forms/select/lazy"}>
                                                        <div>
                                                            <span>Lazy Select</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/forms/image"}>
                                                        <div>
                                                            <span>Image Upload</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link value={"/layout"}>
                                                <div>
                                                    <span>Layout</span>
                                                </div>
                                            </Link>
                                            <ul>
                                                <li>
                                                    <Link value={"/layout/drawer"}>
                                                        <div>
                                                            <span>Drawer</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/layout/tabs"}>
                                                        <div>
                                                            <span>Tabs</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/layout/pages"}>
                                                        <div>
                                                            <span>Pages</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/layout/toolbar"}>
                                                        <div>
                                                            <span>Toolbar</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Lists
                                            <ul>
                                                <li>
                                                    <Link value={"/lists/list"}>
                                                        <div>
                                                            <span>List</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/lists/table"}>
                                                        <div>
                                                            <span>Table</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Meta
                                            <ul>
                                                <li>
                                                    <Link value={"/meta/form"}>
                                                        <div>
                                                            <span>Form</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/meta/table"}>
                                                        <div>
                                                            <span>Table</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Modal
                                            <ul>
                                                <li>
                                                    <Link value={"/modal/dialog"}>
                                                        <div>
                                                            <span>Dialog</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/modal/window"}>
                                                        <div>
                                                            <span>Window</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Navigation
                                            <ul>
                                                <li>
                                                    <Link value={"/navigation/link"}>
                                                        <div>
                                                            <span>Link</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/navigation/router"}>
                                                        <div>
                                                            <span>Router</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </Page>
                            <Page>
                                <div>
                                    <ul>
                                        <li>
                                            Hooks
                                            <ul>
                                                <li>
                                                    <Link value={"/hooks/use-array"}>
                                                        <div>
                                                            <span>useArray</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/hooks/use-form"}>
                                                        <div>
                                                            <span>useForm</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link value={"/hooks/use-input"}>
                                                        <div>
                                                            <span>useInput</span>
                                                        </div>
                                                    </Link>
                                                </li>

                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </Page>
                        </Pages>

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