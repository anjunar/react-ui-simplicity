import React, {useState} from "react";
import Features from "../../../layout/content/Features";
import info from "./DialogPage.json"
import Section from "../../../layout/content/Section";
import {createPortal} from "react-dom";
import {Dialog, HighLight, Window} from "react-ui-simplicity";
import PageLayout from "../../../layout/content/PageLayout";
import Props from "../../../layout/content/Props";

export default function DialogPage() {

    const [open, setOpen] = useState(false)

    return (
        <div className={"dialog-page"}>
            <PageLayout>
                <Section text={"Dialog"}>
                    The Dialog component is a lightweight and customizable modal wrapper designed for React applications. It provides a flexible structure that allows developers to embed custom content within the modal, making it suitable
                    for various use cases like alerts, confirmations, or custom forms. The component supports the children prop for defining its content. Its minimalistic design ensures ease of use while allowing developers to style and
                    extend functionality as needed.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <div>
                        {
                            open && createPortal((
                                <Dialog>
                                    <Window style={{width: "320px", height: "200px"}} centered={true}>
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
                                </Dialog>
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
                            |import {Dialog, Window} from "react-ui-simplicity";
                            |
                            |export default function DialogPage() {
                            |
                            |    const [open, setOpen] = useState(false)
                            |
                            |    return (
                            |        <div>
                            |            {
                            |                open && createPortal((
                            |                    <Dialog>
                            |                        <Window style={{width: "320px", height: "200px"}} centered={true}>
                            |                            <Window.Header>
                            |                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                            |                                    <button type={"submit"} className={"material-icons"} onClick={() => setOpen(false)}>close</button>
                            |                                </div>
                            |                            </Window.Header>
                            |                            <Window.Content>
                            |                                <div className={"center"}>
                            |                                    Content
                            |                                </div>
                            |                            </Window.Content>
                            |                            <Window.Footer>
                            |                                <div style={{display: "flex", justifyContent: "flex-end"}}>
                            |                                    <button type={"submit"} onClick={() => setOpen(false)}>Ok</button>
                            |                                </div>
                            |                            </Window.Footer>
                            |                        </Window>
                            |                    </Dialog>
                            |                ), document.getElementById("viewport"))
                            |            }
                            |            <button onClick={() => setOpen(true)}>Click</button>
                            |        </div>
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