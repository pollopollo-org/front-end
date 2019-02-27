import { observer } from "mobx-react";
import React from "react";

import { getSVG } from "src/assets/svg";
import { colors } from "src/ts/config/colors";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import { Application } from "../../elements/Application/Application";
import { Chevron } from "../../utils";

export type FrontPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

/**
 * Frontpage responsible for rendered the welcome page that the user should be
 * presented to when navigation to the root of the application.
 */
@observer
class UnwrappedFrontPage extends React.Component<FrontPageProps> {
    /**
     * Main render method, used to render Frontpage
     */
    public render() : JSX.Element{
        return(
            <div>
                <h1>Welcome to PolloPollo!</h1>
                <p>Welcome to the official PolloPollo website.</p>

                <h1>Recent applications</h1>
                <div className="list-of-applications">
                    <Application application={this.props.store.application} />
                </div>

                <Chevron size={20} lineWidthRatio={0.5} inversed={true} vertical={true}/>

                <i>
                    { getSVG("scrumwise") }
                </i>

                <style jsx>{`
                    h1{
                        color: ${ colors.secondaryColor };
                        margin: 0;
                        line-height: 1;
                    }

                    i {
                        display: block;
                        width: 50px;
                        height: 50px;
                    }
                    .list-of-application {
                        margin-left: auto;
                        margin-right: auto;
                    }
                `}</style>
            </div>
        );
    }
}

export const FrontPage = injectStore((store) => ({store}), UnwrappedFrontPage);
