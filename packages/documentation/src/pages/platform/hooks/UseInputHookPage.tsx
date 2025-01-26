import React, {useEffect, useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import info from "./UseInputHookPage.json"
import Features from "../../../layout/content/Features";
import {ActiveObject, Form, HighLight, useForm, useInput} from "react-ui-simplicity";

export function Input({name}) {

    let [model, state, setState] = useInput(name, undefined, false, "text");

    return <input type={"text"} value={state} style={{border : "1px solid var(--color-background-secondary)",}}
                  onChange={(event) => setState(event.target.value)}/>
}

export default function UseInputHookPage() {

    const [console, setConsole] = useState("")

    const form : ActiveObject & any = useForm({
        test : "A text"
    })

    useEffect(() => {
        form.$callbacks.push((property, value) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);

    return (
        <div className={"use-input-hook-page"}>
            <PageLayout>
                <Section text={"useInput"}>
                    The useInput hook is a custom React hook designed for managing the state and behavior of individual input fields in a form. It provides a seamless way to handle form field state while integrating with a broader form management context (FormContext).
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <Form value={form}>
                        <Input name={"test"}/>
                    </Form>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useEffect, useState} from "react";
                            |import {ActiveObject, Form, useForm, useInput} from "react-ui-simplicity";
                            |
                            |export function Input({name}) {
                            |
                            |    let [model, state, setState] = useInput(name, undefined, false, "text");
                            |
                            |    return <input type={"text"} value={state} 
                            |                  onChange={(event) => setState(event.target.value)}/>
                            |
                            |
                            |export default function UseInputHookPage() {
                            |
                            |    const [console, setConsole] = useState("")
                            | 
                            |    const form : ActiveObject & any = useForm({
                            |        test : "A text"
                            |    })
                            |
                            |    useEffect(() => {
                            |        form.$callbacks.push((property, value) => {
                            |            setConsole(\`[property:\${property}] [value:\${value}]\`)
                            |        })
                            |    }, []);
                            |
                            |    return (
                            |        <div className={"use-input-hook-page"}>
                            |            <Form value={form}>
                            |                <Input name={"test"}/>
                            |            </Form>
                            |            <p>Console: {console}</p>
                            |        </div>                            
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