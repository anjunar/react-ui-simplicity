import React from "react";
import PageLayout from "../../../layout/content/PageLayout";
import Section from "../../../layout/content/Section";
import info from "./RouterPage.json"
import Features from "../../../layout/content/Features";
import {HighLight} from "react-ui-simplicity"
import Props from "../../../layout/content/Props";

export default function RouterPage() {
    return (
        <div className={"router-page"}>
            <PageLayout>
                <Section text={"Router"}>
                    The Router component is a dynamic routing solution for React applications that enables flexible, client-side navigation. It matches the current URL against predefined routes, handling path parameters (e.g., /user/[id]) and query parameters. The component asynchronously loads the appropriate route's associated component, fetching any required data via loader functions. It also preserves scroll positions across route changes by caching and restoring them. The router supports programmatic navigation, allowing navigation to different URLs without reloading the page. Additionally, it utilizes the SystemContext to provide consistent state management and context propagation across the application. This architecture ensures a seamless, responsive, and efficient navigation experience for users.
                    <br/>
                    <br/>
                    <Features value={info.features}/>
                </Section>
                <Section text={"Source"}>
                    <HighLight language={"typescript"}>
                        {
                            `
                            |import ReactDOM from 'react-dom/client';
                            |import {System} from "react-ui-simplicity";
                            |import {Route} from "react-ui-simplicity";
                            |
                            |export const routes : Route[] = [
                            |    {
                            |        path : "/",
                            |        subRouter : true,
                            |        component : App,
                            |        children : [
                            |            {
                            |                path : "/",
                            |                component : HomePage
                            |            }
                            |    }
                            |]    
                            | 
                            |
                            |const root = ReactDOM.createRoot(document.getElementById('root'))
                            |root.render(<System routes={routes}/>);         
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