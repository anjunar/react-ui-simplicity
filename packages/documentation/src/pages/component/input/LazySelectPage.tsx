import React from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import {Form, HighLight, InputContainer, LazySelect, Pageable, useForm} from "react-ui-simplicity";
import Features from "../../../layout/content/Features";
import info from "./LazySelectPage.json"
import Props from "../../../layout/content/Props";

export default function LazySelectPage() {

    const form = useForm({
        material : null
    })

    const loader = new class extends Pageable.Loader {
        async onLoad(query: Pageable.Query, callback: Pageable.Callback) {

            const response = await fetch("./assets/materials.json")

            if (response.ok) {
                let table : any = await response.json();
                let splice = table.rows.slice(query.index, query.index + query.limit);
                callback(splice, table.size)
            }

        }
    }

    return (
        <div className={"lazy-select-page"}>
            <PageLayout>
                <Section text={"Lazy (multi) Select"}>
                    The LazySelect component is a highly customizable and performance-oriented dropdown select element designed
                    for React applications. It provides advanced features such as lazy loading, pagination, search filtering,
                    and multi-select capabilities, making it ideal for use cases involving large datasets.
                    <br/>
                    <br/>
                    The component dynamically loads options through a configurable loader function, reducing initial load
                    times and enhancing responsiveness. With built-in pagination controls, users can navigate through data
                    efficiently. The component supports both single and multi-select modes, with clear visual feedback for
                    selected items. Search functionality, powered by deferred execution, ensures smooth and efficient filtering of options.
                    <br/>
                    <br/>
                    LazySelect allows developers to customize the rendering of dropdown options using child components and
                    provides flexibility through utility functions for extracting IDs, names, and values from options. Additional
                    features include dynamic width adjustment, validation rules (e.g., minimum and maximum selection constraints),
                    and support for custom validators.
                    <br/>
                    <br/>
                    It integrates seamlessly within forms or as a standalone component, handling controlled and uncontrolled
                    states with ease. Accessibility is prioritized through intuitive keyboard and mouse event handling.
                    The component also includes mechanisms for error feedback, ensuring a robust and user-friendly experience
                    in diverse application scenarios.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <Form value={form}>
                        <InputContainer placeholder={"Material"}>
                            <LazySelect loader={loader} name={"material"} getId={(item) => item.name}>
                                <LazySelect.Option>
                                    {
                                        ({option}) => (
                                            <div>{option.name}</div>
                                        )
                                    }
                                </LazySelect.Option>
                            </LazySelect>
                        </InputContainer>
                    </Form>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import React from "react";
                            |import {Form, InputContainer, LazySelect, Pageable, useForm} from "react-ui-simplicity/index";
                            |
                            |export default function LazySelectPage() {
                            |
                            |    const form = useForm({
                            |        material : null
                            |    })
                            |
                            |    const loader = new class extends Pageable.Loader {
                            |        async onLoad(query: Pageable.Query, callback: Pageable.Callback) {
                            |
                            |            const response = await fetch("./assets/materials.json")
                            |
                            |            if (response.ok) {
                            |                let rows : any[] = await response.json();
                            |                let splice = rows.slice(query.index, query.index + query.limit);
                            |                callback(splice, rows.length)
                            |            }
                            |
                            |        }
                            |    }
                            |
                            |    return (
                            |            <Form value={form}>
                            |                <InputContainer placeholder={"Material"}>
                            |                    <LazySelect loader={loader} name={"material"} getId={(item) => item.name}>
                            |                        <LazySelect.Option>
                            |                            {
                            |                                ({option}) => (
                            |                                    <div>{option.name}</div>
                            |                                )
                            |                            }
                            |                        </LazySelect.Option>
                            |                    </LazySelect>
                            |                </InputContainer>
                            |            </Form>
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

