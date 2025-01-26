import React, {useState} from "react";
import {Drawer, HighLight, ToolBar, useMatchMedia, Viewport} from "react-ui-simplicity";
import PageLayout from "../../layout/content/PageLayout";
import Section from "../../layout/content/Section";

export default function LayoutPage() {

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
        <div>
            <PageLayout>
                <Section text={"Layout"}>
                    This ReactJS UI library provides a flexible and modular set of layout components designed to streamline the development of responsive, interactive user interfaces. The core layout components include Drawer, Pages,
                    Scroll, Tabs, Toolbar, and Viewport, each serving a distinct purpose to enhance the user experience.
                    <br/>
                    <br/>
                    Together, these components facilitate the creation of modern, responsive layouts that are easy to use and integrate into any web application. The modular nature of the components ensures that they can be combined in
                    flexible ways to meet diverse design requirements.
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
            </PageLayout>
        </div>
    )
}