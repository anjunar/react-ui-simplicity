import React from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import Features from "../../../layout/content/Features";
import info from "./UseMatchMediaHookPage.json"

export default function UseMatchMediaHookPage() {
    return (
        <div className={"use-match-media"}>
            <PageLayout>
                <Section text={"useMatchMedia"}>
                    The useMatchMedia custom React hook provides a declarative way to track and respond to changes in a media query's evaluation result. It leverages the window.matchMedia API to monitor the specified media query and updates the component state whenever the query's match status changes. This hook is particularly useful for building responsive applications where UI behavior or rendering needs to adapt based on screen size, orientation, or other media features.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
            </PageLayout>
        </div>
    )
}