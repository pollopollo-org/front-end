import { observer } from "mobx-react";
import React from "react";

import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import { fonts, colors } from "src/ts/config";

import { Application } from "src/ts/components/elements/Application/Application";
import { UserTypes } from "src/ts/models/UserModel";
import { getUserType } from "src/ts/utils/getUserType";
import FrontPageJson from "src/assets/data/frontpage.json";
import { Throbber} from "src/ts/components/utils";
import { fetchOpenApplicationBatch, fetchCompletedApplicationBatch, ApplicationModel } from "src/ts/models/ApplicationModel";

export type FrontPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

type FrontPageState = {
    /**
     * The list of applications to display
     */
    applications?: ApplicationModel[];
    /**
     * The list of recent donations to display
     */
    donations?: ApplicationModel[];
    /**
     * Specifies whether or not we are currently attempting to access the backend
     */
    isPending?: boolean;
}

/**
 * Frontpage responsible for rendered the welcome page that the user should be
 * presented to when navigation to the root of the application.
 */
@observer
class UnwrappedFrontPage extends React.Component<FrontPageProps, FrontPageState> {
    /**
     * Setup initial state
     */
    public state: FrontPageState = {
        isPending: true,
        applications: [],
        donations: [],
    }
    
    /**
     * Fetch initial set of data as soon as the component mounts
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchData();
        this.setState({ isPending: false });
    }

    /**
     * Main render method, used to render Frontpage
     */
    public render(): JSX.Element {
        return (
            <div>
                <h1>Recent applications</h1>

                <div className="list-of-applications">
                    <p>
                        {FrontPageJson.applicationsText}<a href={FrontPageJson.linkURL} target="_blank" rel="noreferrer">{FrontPageJson.linkText}</a>.
                    </p>
                    {(this.state.isPending) &&
                            <i className="throbber-wrapper">
                                <Throbber size={64} relative={true} />
                            </i>
                        }
                    {this.state.applications ?
                        this.state.applications.map((application, index) => {
                            const onApplicationDonated = this.onApplicationDonated.bind(this, index);

                            return <Application
                                key={index}
                                isOwnApplication={false}
                                userType={getUserType(this.props.store.user, UserTypes.DONOR)}
                                isOnReceiversPage={false}
                                application={application}
                                // tslint:disable-next-line: react-this-binding-issue
                                onApplicationDonation={onApplicationDonated}
                                pastDonation={false}
                            />;
                        }) : {}}
                </div>

                <h1>Recent donations</h1>

                <div className="list-of-applications">
                    <p>
                        {FrontPageJson.donationsText}.
                    </p>
                    {(this.state.isPending) &&
                            <i className="throbber-wrapper">
                                <Throbber size={64} relative={true} />
                            </i>
                        }
                    {this.state.donations ?
                        this.state.donations.map((application, index) => {
                            return <Application
                                key={index}
                                isOwnApplication={false}
                                userType={getUserType(this.props.store.user, UserTypes.DONOR)}
                                isOnReceiversPage={false}
                                application={application}
                                pastDonation={true}
                            />;
                        }) : {}}
                </div>

                <style jsx>{`

                    h1{
                        /** Override defaults */
                        margin: 30px 0 15px 0;

                        /** Setup font */
                        font-family: ${ fonts.heading};
                        font-weight: 500;
                        line-height: 1;
                        margin-bottom: 5px;
                    }

                    .list-of-applications {
                        /** Temp dimensions of list */
                        width: 45%;
                        margin-bottom: 50px;

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
                        margin: 10px 0;
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

     /**
     * Internal helper that'll fetch the applications needed to render the current
     * page.
     */
    private fetchData = async () => {
        const responseApplications = await fetchOpenApplicationBatch(0, 4);
        const responseDonations = await fetchCompletedApplicationBatch(0, 4);

        if (!responseApplications) {
            this.setState({ applications: undefined });
            return;
        }

        if (!responseDonations) {
            this.setState({ donations: undefined });
            return;
        }

        this.setState({
            applications: responseApplications.applications,
            donations: responseDonations.applications,
        });
    }

    /**
     * Callback that should be executed once an application gets donated to in order
     * to ensure that the locked status also is reflected on the UI
     */
    private onApplicationDonated = (index: number) => {
        const newApplicationList = this.state.applications;

        if (newApplicationList) {
            newApplicationList.splice(index, 1);
            this.setState({ 
                applications: newApplicationList,
             });
        }
    }
}

export const FrontPage = injectStore((store) => ({ store }), UnwrappedFrontPage);
