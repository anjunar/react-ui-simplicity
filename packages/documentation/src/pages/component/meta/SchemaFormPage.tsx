import React, {useEffect, useState} from "react";
import info from "./SchemaFormPage.json"
import Section from "../../../layout/content/Section";
import {FormSchemaFactory, HighLight, mapForm, Page, Pages, SchemaForm, SchemaFormArray, SchemaSubForm, SubForm, Tab, Tabs, useForm} from "react-ui-simplicity";
import Features from "../../../layout/content/Features";
import User from "../../../domain/control/User";
import Props from "../../../layout/content/Props";
import PageLayout from "../../../layout/content/PageLayout";

export default function SchemaFormPage({user}: { user: User }) {

    const [page, setPage] = useState(0)

    const [console, setConsole] = useState("")

    let form = useForm(user);

    useEffect(() => {
        form.$callbacks.push((property, value) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);

    return (

        <div className={"schema-form-page"}>
            <PageLayout>
                <Section text={"Schema Form"}>
                    SchemaForm is a dynamic and extensible form management framework designed to streamline the creation and handling of complex, schema-driven forms in React applications. By leveraging a schema-based approach, SchemaForm
                    provides support for a variety of input types, including nested forms, form arrays, editors, images, and advanced selection inputs. It uses React Context to enable components within the form to dynamically register and
                    interact with the schema, ensuring flexibility and scalability.
                    <br/>
                    <br/>
                    The framework introduces components such as SchemaForm, SchemaSubForm, and SchemaFormArray to handle diverse form structures, including nested and array-based forms, with ease. It also incorporates validation mechanisms
                    through synchronous and asynchronous validators, enabling robust client-side and server-side error handling. Additionally, SchemaForm supports dynamic widget rendering, where input types are determined by the schema's
                    configuration, simplifying the integration of custom form components.
                    <br/>
                    <br/>
                    SchemaForm's modular architecture makes it a powerful tool for applications requiring dynamic, data-driven forms, such as administrative dashboards, content management systems, and data entry platforms. Its ability to
                    integrate seamlessly with existing React ecosystems and its support for schema-driven design patterns make it a versatile solution for modern web applications.
                    <br/>
                    <br/>
                    <Tabs page={page} onPage={(page) => setPage(page)}>
                        <Tab>Form</Tab>
                        <Tab>Sub Form</Tab>
                        <Tab>Array Form</Tab>
                        <Tab>Factory</Tab>
                    </Tabs>
                    <br/>
                    <Pages page={page}>
                        <Page>
                            <Features value={info.SchemaForm.features}/>
                        </Page>
                        <Page>
                            <Features value={info.SchemaSubForm.features}/>
                        </Page>
                        <Page>
                            <Features value={info.SchemaFormArray.features}/>
                        </Page>
                        <Page>
                            <Features value={info.SchemaFactory.features}/>
                        </Page>
                    </Pages>
                </Section>
                <Section text={"Example"}>
                    <SchemaForm value={form}>
                        <FormSchemaFactory name={"name"}/>
                        <FormSchemaFactory name={"firstName"}/>
                        <FormSchemaFactory name={"lastName"}/>
                        <FormSchemaFactory name={"address"}/>
                        <FormSchemaFactory name={"emails"}/>
                    </SchemaForm>
                    <p>Console: {console}</p>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React, {useEffect, useState} from "react";
                            |import {FormSchemaFactory, SchemaForm, useForm} from "react-ui-simplicity";
                            |import User from "../../../domain/control/User";
                            |
                            |export default function SchemaFormPage({user}: { user: User }) {
                            |
                            |    const [page, setPage] = useState(0)
                            |
                            |    const [console, setConsole] = useState("")
                            |
                            |    let form = useForm(user);
                            |
                            |    useEffect(() => {
                            |        form.$callbacks.push((property, value) => {
                            |            setConsole(\`[property:\${property}] [value:\${value}]\`)
                            |        })
                            |    }, []);
                            |
                            |    return (
                            |        <SchemaForm value={form}>
                            |            <FormSchemaFactory name={"name"}/>
                            |            <FormSchemaFactory name={"firstName"}/>
                            |            <FormSchemaFactory name={"lastName"}/>
                            |            <FormSchemaFactory name={"address"}/>
                            |            <FormSchemaFactory name={"emails"}/>
                            |        </SchemaForm>
                            |        <p>Console: {console}</p>
                            |    )
                            |}    
                            `.stripMargin()
                        }
                    </HighLight>
                </Section>
                <Section text={"API"}>
                    <Tabs page={page} onPage={(page) => setPage(page)}>
                        <Tab>
                            Form
                        </Tab>
                        <Tab>
                            Sub Form
                        </Tab>
                        <Tab>
                            Array Form
                        </Tab>
                        <Tab>
                            Factory
                        </Tab>
                    </Tabs>
                    <Pages page={page}>
                        <Page>
                            <Props value={info.SchemaForm.props}/>
                        </Page>
                        <Page>
                            <Props value={info.SchemaSubForm.props}/>
                        </Page>
                        <Page>
                            <Props value={info.SchemaFormArray.props}/>
                        </Page>
                        <Page>
                            <Props value={info.SchemaFactory.props}/>
                        </Page>
                    </Pages>
                </Section>
            </PageLayout>
        </div>
    )
}