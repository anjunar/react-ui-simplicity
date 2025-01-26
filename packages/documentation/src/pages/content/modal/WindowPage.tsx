import React, {useState} from "react";
import info from "./WindowPage.json"
import Section from "../../../layout/content/Section";
import {createPortal} from "react-dom";
import {HighLight, Window} from "react-ui-simplicity";
import Features from "../../../layout/content/Features";
import PageLayout from "../../../layout/content/PageLayout";
import Props from "../../../layout/content/Props";

export default function WindowPage() {

    const [open, setOpen] = useState(false)

    return (
        <div className={"window-page"}>
            <PageLayout>
                <Section text={"Window"}>
                    The Window component is a flexible and dynamic React-based UI element designed to simulate a desktop windowing experience. It offers core functionalities such as resizable, draggable, and maximized states, with optional
                    centering. This component integrates seamlessly with the SystemContext, registering itself dynamically and providing essential interaction capabilities.
                    <br/>
                    <br/>
                    The component's modular design supports custom content structures by allowing child components like Window.Header, Window.Content, and Window.Footer. These elements enable developers to create tailored window layouts.
                    Additionally, the component includes event handling for resizing and dragging using mouse events, ensuring smooth user interaction.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <div>
                        {
                            open && createPortal((
                                <Window style={{width: "320px", height: "200px"}} centered={true} resizable={true} draggable={true}>
                                    <Window.Header>
                                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                                            <button type={"submit"} className={"material-icons"} onClick={() => setOpen(false)}>close</button>
                                        </div>
                                    </Window.Header>
                                    <Window.Content>
                                        <div className={"center"}>
                                            Content
                                        </div>
                                    </Window.Content>
                                    <Window.Footer>
                                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                                            <button type={"submit"} onClick={() => setOpen(false)}>Ok</button>
                                        </div>
                                    </Window.Footer>
                                </Window>
                            ), document.getElementById("viewport"))
                        }
                        <button onClick={() => setOpen(true)}>Click</button>
                    </div>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                        |import React, {useState} from "react";
                        |import {createPortal} from "react-dom";
                        |import {Window} from "react-ui-simplicity";
                        |
                        |export default function WindowPage() {
                        |
                        |    const [open, setOpen] = useState(false)
                        |
                        |    return (
                        |        <div>
                        |            {
                        |                open && createPortal((
                        |                    <Window style={{width : "320px", height : "200px"}} centered={true} resizable={true} draggable={true}>
                        |                        <Window.Header>
                        |                            <div style={{display : "flex", justifyContent : "flex-end"}}>
                        |                                <button type={"submit"} className={"material-icons"} onClick={() => setOpen(false)}>close</button>
                        |                            </div>
                        |                        </Window.Header>
                        |                        <Window.Content>
                        |                            <div className={"center"}>
                        |                                Content
                        |                            </div>
                        |                        </Window.Content>
                        |                        <Window.Footer>
                        |                            <div style={{display : "flex", justifyContent : "flex-end"}}>
                        |                                <button type={"submit"} onClick={() => setOpen(false)}>Ok</button>
                        |                            </div>
                        |                        </Window.Footer>
                        |                    </Window>
                        |                ), document.getElementById("viewport"))
                        |            }
                        |            <button onClick={() => setOpen(true)}>Click</button>
                        |        </div>
                        |)
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