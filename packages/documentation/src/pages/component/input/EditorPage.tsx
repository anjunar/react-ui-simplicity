import React, {useEffect, useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import {ActiveObject, MarkDown} from "react-ui-simplicity";
import {Form, useForm} from "react-ui-simplicity";
import {Editor, HighLight} from "react-ui-simplicity";
import info from "./EditorPage.json"
import Props from "../../../layout/content/Props";
import Features from "../../../layout/content/Features";

function EditorPage(properties : EditorPage.Attributes) {

    const [console, setConsole] = useState("")

    const form : ActiveObject & any = useForm({
        editor : {
            html : "Test<div>test2</div>",
            text : ""
        }
    })

    useEffect(() => {
        form.$callbacks.push((property : string[], value : any) => {
            setConsole(`[property:${property}] [value:${value.text}]`)
        })
    }, []);

    return (
        <div>
            <PageLayout>
                <Section text={"Editor"}>
                    <p>
                        The Editor component is a customizable and interactive rich-text editor built with React.
                        It enables users to create and edit formatted text within a content-editable area, complete
                        with tools for advanced text manipulation. The component features an intuitive toolbar for
                        quick formatting, tabbed navigation for accessing additional tools, and an inspector for
                        non-editable states. The editor supports integration with forms through a controlled input model,
                        enabling validation and state synchronization. Key features include dynamic content updates,
                        page-based editing modes, and a responsive design, making it suitable for diverse applications
                        requiring a rich text editing experience.
                    </p>
                    <br/>
                    <strong>Key Features:</strong>
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
{/*
                    <Form value={form}>
                    <Editor name={"editor"} style={{height: "500px"}}/>
                    </Form>
*/}
                    <br/>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useEffect, useState} from "react";
                            |import {ActiveObject, Form, useForm, Editor} from "react-ui-simplicity/index";
                            |
                            |function EditorPage() {
                            |
                            |    const [console, setConsole] = useState("")
                            |
                            |    const form : ActiveObject & any = useForm({
                            |        editor : {
                            |            html : "Test<div>test2</div>",
                            |            text : ""
                            |        }
                            |    })
                            |
                            |    useEffect(() => {
                            |        form.$callbacks.push((property : string[], value : any) => {
                            |            setConsole(\`[property:\${property}] [value:\${value.text}]\`)
                            |        })
                            |    }, []);
                            |
                            |    return (
                            |            <Form value={form}>
                            |                <Editor name={"editor"} style={{height : "500px"}}/>
                            |            </Form>
                            |    )        
                            |}
                        `.stripMargin()
                        }
                    </HighLight>
                </Section>
                <Section text={"API"}>
                    <Props value={info.props} />
                </Section>
            </PageLayout>
        </div>
    )
}

namespace EditorPage {
    export interface Attributes {

    }
}

export default EditorPage