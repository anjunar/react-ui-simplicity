import React, {useEffect, useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import User from "../../../domain/control/User";
import {Button, FormSchemaFactory, HighLight, SchemaForm, useForm} from "react-ui-simplicity";
import info from "./UseFormHookPage.json"
import Features from "../../../layout/content/Features";

export default function UseFormHookPage({user}: { user: User }) {

    const [console, setConsole] = useState("")

    const form = useForm(user)

    useEffect(() => {
        form.$callbacks.push((property, value) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);


    return (
        <div className={"use-form-hook-page"}>
            <PageLayout>
                <Section text={"useForm"}>
                    The useForm hook is a custom React hook designed to enhance and manage the state of a form-like object. It takes a generic object (T) as input and wraps it with reactive capabilities using objectMembrane. The hook
                    initializes state with a reactive version of the input object and provides efficient updates through a debounced callback mechanism. This ensures that changes to the object trigger minimal re-renders, optimizing
                    performance while maintaining a seamless user experience. The useForm hook is particularly suited for handling complex or dynamic forms, enabling real-time updates and synchronization with the application's state.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <SchemaForm value={form}>
                        <FormSchemaFactory name={"name"}/>
                        <FormSchemaFactory name={"firstName"}/>
                        <FormSchemaFactory name={"lastName"}/>
                        <FormSchemaFactory name={"address"}/>
                        <FormSchemaFactory name={"emails"}/>
                        <Button type={"submit"}>Save</Button>
                    </SchemaForm>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useEffect, useState} from "react";
                            |import User from "../../../domain/control/User";
                            |import {Button, FormSchemaFactory, SchemaForm, useForm} from "react-ui-simplicity";
                            |
                            |export default function UseFormHookPage({user}: { user: User }) {
                            |
                            |    const [console, setConsole] = useState("")
                            |
                            |    const form = useForm(user)
                            |
                            |    useEffect(() => {
                            |        form.$callbacks.push((property, value) => {
                            |            setConsole(\`[property:\${property}] [value:\${value}]\`)
                            |        })
                            |    }, []);
                            | 
                            |    return (
                            |        <div className={"use-form-hook-page"}>
                            |            <SchemaForm value={form}>
                            |                <FormSchemaFactory name={"name"}/>
                            |                <FormSchemaFactory name={"firstName"}/>
                            |                <FormSchemaFactory name={"lastName"}/>
                            |                <FormSchemaFactory name={"address"}/>
                            |                <FormSchemaFactory name={"emails"}/>
                            |                <Button type={"submit"}>Save</Button>
                            |            </SchemaForm>
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