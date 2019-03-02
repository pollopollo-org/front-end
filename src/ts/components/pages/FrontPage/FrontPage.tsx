import { observer } from "mobx-react";
import React from "react";

import { getSVG } from "src/assets/svg";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import { colors, fonts } from "src/ts/config";
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

                <h1>Recent applications</h1>
                <div className="list-of-applications">
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                    <Application application={this.props.store.application} />
                </div>

                <Chevron size={20} lineWidthRatio={0.5} inversed={true} vertical={true}/>

                <i>
                    { getSVG("scrumwise") }
                </i>

                <style jsx>{`
                    h1{
                        font-family: ${ fonts.heading };
                        font-weight: 500;
                        margin: 0;
                        line-height: 1;
                    }

                    i {
                        display: block;
                        width: 50px;
                        height: 50px;
                    }

                    .list-of-applications {
                        width: 50%;

                        max-height: 600px;
                        overflow-y: auto;

                        /** Apply custom scrollbar styling */
                        & ::-webkit-scrollbar {
                            width: 3px;
                        }

                        & ::-webkit-scrollbar-track {
                            background: rgba(56, 56, 56, 0.1);
                        }

                        & ::-webkit-scrollbar-thumb {
                            background: ${ colors.black };
                        }
                    }

                    :global(.application-border) {
                        margin-left: 20px !important;
                        margin: 10px;
                        width: calc(100% - 40px) !important;
                    }

                    :global(.list-of-applications > div:nth-child(even)) {
                        background: rgba(219,208,239, 0.1);
                    }

                    :global(.list-of-applications > div:nth-child(odd)) {
                        background: rgba(139,72,156, 0.06);
                    }
                `}</style>
            </div>
        );
    }
}

export const FrontPage = injectStore((store) => ({store}), UnwrappedFrontPage);
