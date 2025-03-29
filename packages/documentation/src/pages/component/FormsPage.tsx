import React, {useEffect, useState} from "react";
import PageLayout from "../../layout/content/PageLayout";
import Section from "../../layout/content/Section";
import {ActiveObject, Button, Form, FormModel, HighLight, Input, InputContainer, SubForm, useForm, Window} from "react-ui-simplicity";
import {createPortal} from "react-dom";

function FormsPage() {

    const [open, setOpen] = useState(false)

    const [console, setConsole] = useState("")

    function onSubmit(name : string, form : FormModel) {
        setOpen(true)
    }

    const user : ActiveObject & any = useForm({
        name: "Neo",
        firstName: "Thomas",
        lastName: "Anderson",
        address: {
            street: "Unknown",
            number: "Unknown",
            city: "Los Angeles",
            country: "USA"
        }
    })

    useEffect(() => {
        user.$callbacks.push((property, value) => {
            setConsole(`[property:${property}] [value:${value}]`)
        })
    }, []);

    return (
        <div className={"forms-page"}>
        <PageLayout>
            {
                open && createPortal(
                    <Window centered={true} draggable={true}>
                        <Window.Header>
                            <div style={{textAlign : "right", backgroundColor : "var(--color-background-secondary)"}}>
                                <button className={"material-icons"} type={"button"} onClick={() => setOpen(false)}>close</button>
                            </div>
                        </Window.Header>
                        <Window.Content>
                            <div style={{padding : "24px"}}>
                                <div>
                                    <strong>User</strong>
                                    <section>
                                        <p>Name: {user.name}</p>
                                        <p>FirstName: {user.firstName}</p>
                                        <p>LastName: {user.lastName}</p>
                                    </section>
                                </div>
                                <br/>
                                <div>
                                    <strong>Address</strong>
                                    <address>
                                        <p>Street: {user.address.street}</p>
                                        <p>Number: {user.address.number}</p>
                                        <p>City: {user.address.city}</p>
                                        <p>Country: {user.address.country}</p>
                                    </address>
                                </div>
                            </div>
                        </Window.Content>
                    </Window>,
                document.getElementById("viewport"))
            }
            <Section text={"Introduction"}>
                <div>
                    <p>
                        This React JS UI framework has been designed to simplify the creation and management of complex forms,
                        including nested and dynamic form structures. A key feature of the framework is the use of React Context,
                        which provides a flexible and scalable way for components to communicate within a form. By registering
                        components in the parent form context, forms can be dynamically extended and managed without compromising data integrity.
                    </p>
                    <br/>
                    <p>
                        Another essential feature is the support for array forms, which enables the representation and handling of
                        repeatable form entries. This makes the framework particularly well-suited for use cases such as surveys,
                        product configurators, or any application requiring complex, dynamic input forms.
                    </p>
                    <br/>
                    <p>
                        This documentation provides an overview of the core concepts, use cases, and implementation details of the framework
                        to help developers get started and make the most out of its features.
                    </p>
                </div>
            </Section>
            <Section text={"Example"}>
                <div>
                    <div>
                        <Form value={user} style={{flex: 1}} onSubmit={onSubmit}>
                            <InputContainer placeholder={"Name"}>
                                <Input name={"name"} type={"text"}/>
                            </InputContainer>
                            <InputContainer placeholder={"First Name"}>
                                <Input name={"firstName"} type={"text"}/>
                            </InputContainer>
                            <InputContainer placeholder={"Last Name"}>
                                <Input name={"lastName"} type={"text"}/>
                            </InputContainer>
                            <SubForm name={"address"} style={{marginLeft: "48px"}}>
                                <InputContainer placeholder={"Street"}>
                                    <Input name={"street"} type={"text"}/>
                                </InputContainer>
                                <InputContainer placeholder={"Number"}>
                                    <Input name={"number"} type={"text"}/>
                                </InputContainer>
                                <InputContainer placeholder={"City"}>
                                    <Input name={"city"} type={"text"}/>
                                </InputContainer>
                                <InputContainer placeholder={"Country"}>
                                    <Input name={"country"} type={"text"}/>
                                </InputContainer>
                            </SubForm>
                            <Button name={"save"}>Save</Button>
                        </Form>
                        <p>Console: {console}</p>
                    </div>
                </div>
            </Section>
        </PageLayout>
        <PageLayout>
            <Section text={"HTML"}>
                <HighLight language={"xml"}>
                    {
                        `
                            |<Form value={user}>
                            |    <InputContainer placeholder={"Name"}>
                            |        <Input name={"name"} type={"text"}/>
                            |    </InputContainer>
                            |    <InputContainer placeholder={"First Name"}>
                            |        <Input name={"firstName"} type={"text"}/>
                            |    </InputContainer>
                            |    <InputContainer placeholder={"Last Name"}>
                            |        <Input name={"lastName"} type={"text"}/>
                            |    </InputContainer>
                            |    <SubForm name={"address"} style={{marginLeft : "48px"}}>
                            |        <InputContainer placeholder={"Street"}>
                            |            <Input name={"street"} type={"text"}/>
                            |        </InputContainer>
                            |        <InputContainer placeholder={"Number"}>
                            |            <Input name={"number"} type={"text"}/>
                            |        </InputContainer>
                            |        <InputContainer placeholder={"City"}>
                            |            <Input name={"city"} type={"text"}/>
                            |        </InputContainer>
                            |        <InputContainer placeholder={"Country"}>
                            |            <Input name={"country"} type={"text"}/>
                            |        </InputContainer>
                            |    </SubForm>
                            |</Form>
                            |<p>Console: {console}</p>
                        `.stripMargin()
                    }
                </HighLight>
            </Section>
            <Section text={"TypeScript"}>
                <HighLight language={"typescript"}>
                    {
                        `
                            |const [console, setConsole] = useState("")
                            |                       
                            |const user : ActiveObject & any = useForm({
                            |    name: "Neo",
                            |    firstName: "Thomas",
                            |    lastName: "Anderson",
                            |    address: {
                            |        street: "Unknown",
                            |        number: "Unknown",
                            |        city: "Los Angeles",
                            |        country: "USA"
                            |    }
                            |})
                            | 
                            |useEffect(() => {
                            |    form.$callbacks.push((property : string[], value : any) => {
                            |        setConsole(\`[property:\${property}] [value:\${value}]\`)
                            |    })
                            |}, []);
                        `.stripMargin()
                    }
                </HighLight>
            </Section>
        </PageLayout>
        </div>
    )
}

namespace FormsPage {
    export interface Attributes {

    }
}

export default FormsPage