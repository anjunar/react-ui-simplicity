import React, {useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import info from "./DrawerPage.json"
import {Drawer, HighLight, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity";
import Props from "../../../layout/content/Props";

export default function DrawerPage() {

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
        <div className={"drawer-page"}>
            <PageLayout>
                <Section text={"Drawer"}>
                    The Drawer component is a lightweight, reusable layout element designed to provide a dynamic, side-panel interface for web applications. It enables developers to create collapsible content containers that enhance user
                    experience through improved organization and space utilization. Key features include:
                    <br/>
                    <br/>
                    Built with accessibility and modularity in mind, the Drawer is designed to integrate smoothly into React projects, offering a foundation for creating responsive and intuitive UI layouts.
                    <br/>
                    <br/>
                    Drawer
                    <Features value={info.Drawer.features}/>
                    <br/>
                    <br/>
                    Drawer.Container
                    <Features value={info["Drawer.Container"].features}/>
                    <br/>
                    <br/>
                    Drawer.Content
                    <Features value={info["Drawer.Content"].features}/>
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
                    <h3>Drawer</h3>
                    <Props value={info.Drawer.props}/>
                    <h3>Drawer Content</h3>
                    <Props value={info["Drawer.Content"].props}/>
                    <h3> Drawer Container</h3>
                    <Props value={info["Drawer.Container"].props}/>
                </Section>
            </PageLayout>
        </div>
    )
}