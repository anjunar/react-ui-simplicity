import React, {useEffect, useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import {ActiveObject, Button, Form, HighLight, Input, InputContainer, useForm} from "react-ui-simplicity";
import {LocalDate} from "@js-joda/core";
import properties from "./InputPage.json"
import Props from "../../../layout/content/Props";
import Features from "../../../layout/content/Features";

function InputPage() {

    const [console, setConsole] = useState("")

    const form : ActiveObject & any = useForm({
        text : "A Text",
        number : 42,
        date : LocalDate.now()
    })

    useEffect(() => {
        form.$callbacks.push((property : string[], value : any) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);

    return (
        <div>
            <PageLayout>
                <Section text={"Introduction"}>
                    <p>
                        The Input component is a highly customizable and reusable React component designed to handle
                        various input types and provide advanced features like validation, dynamic width adjustment,
                        and support for complex data types.
                    </p>
                    <br/>
                    <strong>Key Features:</strong>
                    <br/>
                    <br/>
                    <Features value={properties.features}/>
                    <br/>
                    <strong>Summary of Functionality:</strong>
                    <p>
                        The Input component is designed to be a flexible and powerful input element that not only captures
                        user input but also ensures that the input is validated, formatted, and dynamically styled. It can
                        handle complex data types, integrate with custom hooks for state management, and provide a seamless
                        user experience with features like dynamic width and auto-suggestions. It is particularly well-suited
                        for use in sophisticated form systems.
                    </p>
                </Section>
                <Section text={"Example"}>
                    <div>
                        <Form value={form}>
                            <InputContainer placeholder={"Text"}>
                                <Input name={"text"} type={"text"} minLength={3} maxLength={12}/>
                                <InputContainer.Error key={"minLength"}>
                                    {
                                        (value) => (<div>Minimum length of {value.min}</div>)
                                    }
                                </InputContainer.Error>
                                <InputContainer.Error key={"maxLength"}>
                                    {
                                        (value) => (<div>Maximum length of {value.max}</div>)
                                    }
                                </InputContainer.Error>
                            </InputContainer>
                            <InputContainer placeholder={"Number"}>
                                <Input name={"number"} type={"number"}/>
                            </InputContainer>
                            <InputContainer placeholder={"Date"}>
                                <Input name={"date"} type={"date"}/>
                            </InputContainer>
                            <Button name={"save"} type={"submit"}>Save</Button>
                        </Form>
                        <p>Console: {console}</p>
                    </div>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useEffect, useState} from "react";
                            |import {ActiveObject, Button, Form, Input, InputContainer, useForm} from "react-ui-simplicity/index";
                            |import {LocalDate} from "@js-joda/core";
                            |
                            |function InputPage() {
                            |
                            |    const [console, setConsole] = useState("")
                            | 
                            |    const form : ActiveObject & any = useForm({
                            |        text : "A Text",
                            |        number : 42,
                            |        date : LocalDate.now()
                            |    })
                            |
                            |    useEffect(() => {
                            |        form.$callbacks.push((property : string[], value : any) => {
                            |            setConsole(\`[property:\${property}] [value:\${value}]\`)
                            |        })
                            |    }, []);
                            |
                            |    return (
                            |            <Form value={form}>
                            |                <InputContainer placeholder={"Text"}>
                            |                    <Input name={"text"} type={"text"} minLength={3} maxLength={12}/>
                            |                    <InputContainer.Error key={"minLength"}>
                            |                        {
                            |                            (value) => (<div>Minimum length of {value.min}</div>)
                            |                        }
                            |                    </InputContainer.Error>
                            |                    <InputContainer.Error key={"maxLength"}>
                            |                        {
                            |                            (value) => (<div>Maximum length of {value.max}</div>)
                            |                        }
                            |                    </InputContainer.Error>
                            |                </InputContainer>
                            |                <InputContainer placeholder={"Number"}>
                            |                    <Input name={"number"} type={"number"}/>
                            |                </InputContainer>
                            |                <InputContainer placeholder={"Date"}>
                            |                    <Input name={"date"} type={"date"}/>
                            |                </InputContainer>
                            |                <Button name={"save"} type={"submit"}>Save</Button>
                            |            </Form>
                            |            <p>Console: {console}</p>
                            |    )
                            |}
                            `.stripMargin()
                        }
                    </HighLight>
                </Section>
                <Section text={"API"}>
                    <Props value={properties.props}/>
                </Section>
            </PageLayout>
        </div>
    )
}

namespace InputPage {
    export interface Attributes {

    }
}

export default InputPage