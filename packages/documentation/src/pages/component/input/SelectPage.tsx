import "./SelectPage.json"
import React, {useEffect, useState} from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import info from "./SelectPage.json"
import {ActiveObject, Form, HighLight, Select, useForm} from "react-ui-simplicity";
import Option = Select.Option;
import Props from "../../../layout/content/Props";

function SelectPage() {

    const [console, setConsole] = useState("")

    const form : ActiveObject & any = useForm({
        select : "bmw"
    })

    useEffect(() => {
        form.$callbacks.push((property : string[], value : any) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);


    return (
        <div className={"select-page"}>
            <PageLayout>
                <Section text={"Select"}>
                    The Select component is a versatile and fully customizable dropdown input field designed to integrate seamlessly
                    with form management systems. It supports both controlled and uncontrolled input modes, providing flexibility for
                    various use cases. The component incorporates a robust validation mechanism through the Model system, enabling
                    real-time error handling and dynamic validation rules via custom validators. With features like dynamic width
                    adjustment, custom value conversion, and responsive state-based styling, it offers enhanced user interaction and
                    visual feedback. Additionally, the Select component supports a standalone mode for independent usage outside of
                    a form context and includes callback support for both value changes and model updates. Its ability to render
                    child option elements dynamically, combined with accessibility and disabling options, makes it a powerful
                    solution for managing dropdown inputs in modern web applications.

                    <br/>

                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <Form value={form}>
                        <Select name={"select"}>
                            <Option value={"bmw"}>
                                BMW
                            </Option>
                            <Option value={"mercedes"}>
                                Mercedes
                            </Option>
                            <Option value={"audi"}>
                                Audi
                            </Option>
                        </Select>
                    </Form>
                    <br/>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                        `
                        |import React, {useEffect, useState} from "react";
                        |import {ActiveObject, Form, HighLight, Select, useForm} from "react-ui-simplicity/index";
                        |import Option = Select.Option;
                        |
                        |function SelectPage() {
                        |
                        |   const [console, setConsole] = useState("")
                        | 
                        |   const form : ActiveObject & any = useForm({
                        |       select : "bmw"
                        |   })
                        | 
                        |   useEffect(() => {
                        |       form.$callbacks.push((property : string[], value : any) => {
                        |           setConsole(\`[property:\${property}] [value:\${value}]\`)
                        |       })
                        |   }, []);
                        |  
                        |   return (
                        |            <Form value={form}>
                        |                <Select name={"select"}>
                        |                    <Option value={"bmw"}>
                        |                        BMW
                        |                    </Option>
                        |                    <Option value={"mercedes"}>
                        |                       Mercedes
                        |                    </Option>
                        |                    <Option value={"audi"}>
                        |                       Audi
                        |                    </Option>
                        |               </Select>
                        |           </Form>
                        |           <br/>
                        |           <p>Console: {console}</p>   
                        |   )
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

namespace SelectPage {
    export interface Attributes {

    }
}

export default SelectPage