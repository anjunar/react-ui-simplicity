import React, {useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import info from "./ToolbarPage.json"
import Features from "../../../layout/content/Features";
import {Drawer, HighLight, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity";
import Props from "../../../layout/content/Props";


export default function ToolbarPage() {

    const [open, setOpen] = useState(false)

    const mediaQuery = useMatchMedia("(max-width: 1440px)")

    const onLinkClick = () => {
        if (mediaQuery) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    return (
        <div className={"toolbar-page"}>
            <PageLayout>
                <Section text={"Toolbar"}>
                    The ToolBar component provides a structured layout for organizing user interface controls in a toolbar format. It uses a slot-based system to distribute child elements into three predefined regions: left, middle, and
                    right. This design enables developers to create intuitive and visually balanced toolbars with minimal effort.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <div style={{height : "500px"}}>
                        <ToolBar>
                            <div slot="left">
                                <button className="material-icons" onClick={() => setOpen(!open)}>
                                    menu
                                </button>
                            </div>
                        </ToolBar>
                        <Drawer.Container>
                            <Drawer.Container>
                                <Drawer open={open}>
                                    <div className={"center"}>
                                        Links
                                    </div>
                                </Drawer>
                                <Drawer.Content onClick={onLinkClick}>
                                    <Viewport>
                                        <div className={"center"}>
                                            Content
                                        </div>
                                    </Viewport>
                                </Drawer.Content>
                            </Drawer.Container>
                        </Drawer.Container>
                    </div>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useState} from "react";
                            |import {Drawer, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity/index";
                            |
                            |export default function LayoutPage() {
                            |
                            |    const [open, setOpen] = useState(false)
                            |
                            |    const mediaQuery = useMatchMedia("(max-width: 1440px)")
                            |
                            |    const onLinkClick = () => {
                            |        if (mediaQuery) {
                            |            setOpen(false)
                            |        } else {
                            |            setOpen(true)
                            |        }
                            |    }
                            |
                            |    return (
                            |            <div style={{height : "500px"}}>
                            |                <ToolBar>
                            |                    <div slot="left">
                            |                        <button className="material-icons" onClick={() => setOpen(!open)}>
                            |                            menu
                            |                        </button>
                            |                    </div>
                            |                    </ToolBar>
                            |                    <Drawer.Container>
                            |                        <Drawer open={open}>
                            |                            <div className={"center"}>
                            |                                Links
                            |                            </div>
                            |                        </Drawer>
                            |                        <Drawer.Content onClick={onLinkClick}>
                            |                            <Viewport>
                            |                                <div className={"center"}>
                            |                                    Content
                            |                                </div>
                            |                            </Viewport>
                            |                        </Drawer.Content>
                            |                    </Drawer.Container>
                            |                </div>
                            |    )
                            |}    
                            `.stripMargin()
                        }
                    </HighLight>
                </Section>
                <Section text={"API"}>
                    <Props value={info.props}/>
                </Section>
            </PageLayout>
        </div>
    )
}