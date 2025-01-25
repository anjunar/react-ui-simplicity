import React from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import info from "./ImagePage.json"
import {Form, HighLight, Image, useForm} from "react-ui-simplicity";
import Props from "../../../layout/content/Props";

export default function ImagePage() {

    const form = useForm({
        image : {}
    })

    return (
        <div className={"image-page"}>
            <PageLayout>
                <Section text={"Image"}>
                    The Image component is a React-based, interactive image upload and preview component designed to
                    enhance user experience in applications requiring image input. This component provides functionality
                    for uploading, cropping, and displaying images, making it suitable for forms, media management tools,
                    or custom UI workflows involving image handling.
                    <br/>
                    <br/>
                    The component integrates seamlessly with React forms using the useInput hook to manage its state.
                    It supports controlled and uncontrolled usage through the name and value props. Users can upload
                    an image, optionally crop it via the embedded ImageUpload modal, and view a live preview.
                    The preview image is displayed using a Base64 encoding generated from the uploaded file, ensuring
                    compatibility with modern browsers.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Example"}>
                    <Form value={form}>
                        <Image name={"image"} style={{width : "320px", height : "320px"}}/>
                    </Form>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                        |import React from "react";
                        |import {Form, Image, useForm} from "react-ui-simplicity/index";
                        |
                        |export default function ImagePage() {
                        |
                        |    const form = useForm({
                        |        image : {}
                        |    })
                        |
                        |    return (
                        |            <Form value={form}>
                        |                <Image name={"image"} style={{width : "320px", height : "320px"}}/>
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