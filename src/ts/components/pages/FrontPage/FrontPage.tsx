import { observer } from "mobx-react";
import React from "react";

import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import { fonts, colors } from "src/ts/config";

import { Application } from "src/ts/components/elements/Application/Application";
import { UserTypes } from "src/ts/models/UserModel";
import { getUserType } from "src/ts/utils/getUserType";
import FrontPageJson from "src/assets/data/frontpage.json";

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
    public render(): JSX.Element {
        return (
            <div>
                <h1>Recent applications</h1>

                <div className="list-of-applications">
                    <p>
                        {FrontPageJson.text}<a href={FrontPageJson.linkURL} target="_blank" rel="noreferrer">{FrontPageJson.linkText}</a>.
                    </p>

                    {this.props.store.mainpageApplications.map((application, index) => {
                        return <Application
                            key={index}
                            isOwnApplication={false}
                            userType={getUserType(this.props.store.user, UserTypes.DONOR)}
                            isOnReceiversPage={false}
                            application={application}
                        />;
                    })}
                </div>

                <style jsx>{`

                    h1{
                        /** Override defaults */
                        margin: 30px 0 15px 0;

                        /** Setup font */
                        font-family: ${ fonts.heading};
                        font-weight: 500;
                        line-height: 1;
                        margin-bottom: 10px;
                    }

                    .list-of-applications {
                        /** Temp dimensions of list */
                        width: 50%;
                        margin-bottom: 10px;

                        /**
                         * When the viewport gets too small, force rendering
                         * of applications to fill 100%
                         */
                        @media (max-width: 768px) {
                            width: 100%;
                            height: 100%;
                            margin: 0 auto 30px;
                        }
                    }

                    p {
                        line-height: 1.4;
                    }

                    a {
                        color: ${colors.primary};
                        text-decoration: underline;
                    }

                    a:hover {
                        color: ${colors.secondary};
                    }

                `}</style>
            </div>
        );
    }
}

export const FrontPage = injectStore((store) => ({ store }), UnwrappedFrontPage);
