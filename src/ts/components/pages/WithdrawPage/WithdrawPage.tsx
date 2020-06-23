import React from "react";
import { Store } from "src/ts/store/Store";
import { ApplicationModel, fetchWithdrawableApplicationByProducer } from "src/ts/models/ApplicationModel";
import { injectStore } from "src/ts/store/injectStore";
import { Throbber } from "src/ts/components/utils/Throbber";
import { getUserType } from "src/ts/utils/getUserType";
import { UserTypes } from "src/ts/models/UserModel";
import { Application } from "src/ts/components/elements/Application/Application";

export type WithdrawPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

type WithdrawPageState = {
    /**
     * The id of the producer
     */
    userId: number;

    /**
     * Specifies whether or not we are currently attempting to access the backend
     */
    isPending?: boolean;

    /**
     * The list of applications to display
     */
    applications?: ApplicationModel[];  
}

/**
 * A page where a user can see a list of all active applications
 */
class UnwrappedWithdrawPage extends React.PureComponent<WithdrawPageProps, WithdrawPageState> {
    /**
     * Setup initial state
     */
    public state: WithdrawPageState = {
        userId: this.props.store.user ? this.props.store.user.id : -1,
        isPending: true,
        applications: []
    }

    /**
     * Fetch applications from with bytes can be withdrawn as soon as the component mounts
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchApplications();
        this.setState({ isPending: false });
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element {

        if (this.state.userId == -1) {
            return <h1>There's no user available to be rendered!</h1>;
        }

        return (
            <div className="page">
                <h1>Withdraw funds</h1>

                <div className="list-of-applications">
                    {(this.state.isPending) &&
                            <i className="throbber-wrapper">
                                <Throbber size={64} relative={true} />
                            </i>
                        }
                    {this.state.applications != undefined ?
                        this.state.applications.map((application, index) => {
                            //const onApplicationDonated = this.onApplicationDonated.bind(this, index);

                            return <Application
                                key={index}
                                isOwnApplication={false}
                                userType={getUserType(this.props.store.user, UserTypes.PRODUCER)}
                                isOnReceiversPage={false}
                                application={application}
                                // tslint:disable-next-line: react-this-binding-issue
                                //onApplicationDonation={onApplicationDonated}
                                pastDonation={false}
                                showWithdrawButton={true}
                            />;
                        }) : <h2><i>No applications to withdraw bytes from</i></h2>}
                </div>

                <style jsx>{`
                    .page{
                        width: 500px;
                        margin: auto;

                        @media (max-width: 550px) {
                            width: 100%;
                        }
                    }

                    h1 {
                        text-align: center;
                    }

                    .list-of-applications {
                        width: 500px; 
                        margin: 0;
                        /**
                         * When the viewport gets too small, force rendering
                         * of applications to fill 100%
                         */
                        @media (max-width: 550px) {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal helper that'll fetch the applications needed to render the current
     * page.
     */
    private fetchApplications = async () => {
        if (this.state.userId == -1) return;

        this.setState({isPending: true});

        const response = await fetchWithdrawableApplicationByProducer(this.state.userId, this.props.store);

        if (!response) {
            this.setState({ applications: undefined });
            return;
        }

        this.setState({
            applications: response,
        });

        this.setState({isPending: false});
    }
}

export const WithdrawPage = injectStore((store) => ({ store }), UnwrappedWithdrawPage);