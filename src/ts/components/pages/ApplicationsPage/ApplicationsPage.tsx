import React from "react";
import ApplicationsPageJson from "src/assets/data/applicationsPage.json"
import { SelectCountry } from "src/ts/components/utils/SelectCountry";
import { colors, fonts} from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Throbber, Button } from "src/ts/components/utils";
import { ApplicationModel } from "src/ts/models/ApplicationModel";
import { Application } from "src/ts/components/elements/Application/Application";
import { getUserType } from "src/ts/utils/getUserType";
import { UserTypes } from "src/ts/models/UserModel";
import { fetchApplicationBatch } from "src/ts/utils/fetchApplications";

export type ApplicationsPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

type ApplicationsPageState = {
    /**
     * The country the user wants to see applications from
     */
    filterCountry?: string;

    /**
     * The list of applications to display
     */
    applications?: ApplicationModel[];

    /**
     * Specifies the currently rendered page
     */
    currentPage: number;

    /**
     * Specifies the total amount of applications available on the page, which will
     * be used for pagination
     */
    totalApplications: number;

    /**
     * Specifies whether or not we are currently attempting to access the backend
     */
    isPending?: boolean;

    /**
     * Specifies whether or not we're fetching a new page of applications
     */
    isFetchingNext?: boolean;

    /**
     * Specifies whether or not we're fetching a previous page of applications
     */
    isFetchingPrevious?: boolean;
}

/**
 * Specifies the amount of applications to load on a single page
 */
const BATCH_SIZE = 20;

/**
 * A page where a user can see a list of all active applications
 */
class UnwrappedApplicationsPage extends React.PureComponent<ApplicationsPageProps, ApplicationsPageState> {
    /**
     * Setup initial state
     */
    public state: ApplicationsPageState = {
        currentPage: 0,
        totalApplications: 0,
        isPending: true,
        applications: [],
    }

    /**
     * Fetch initial set of data as soon as the component mounts
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchData(this.state.currentPage);
        this.setState({ isPending: false });
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        return (
            <div className="page">
                {this.renderIntroduction()}

                {this.state.applications
                    ? <div className="flex">
                        { (this.state.isPending) && 
                            <i className="throbber-wrapper">
                                <Throbber size={64} relative={true} />
                            </i>
                        }
                        <div className="applicationsListLeft">
                            {this.renderListOfApplications(true)}
                        </div>
                        <div className="applicationsListRight">
                            {this.renderListOfApplications(false)}
                        </div>
                    </div>
                    : <h2><i>{ApplicationsPageJson.noApplicationsAvailable}</i></h2>}
                
                { this.renderNavigation() }
                
                <style jsx>{`
                    h2 {
                        margin: 50px 0;
                        text-align: center;
                    }

                    .flex {
                        display: flex;
                        flex-direction: row;

                        /** 
                         * Ensure throbber positions itself properly, even in
                         * the case where no products are available yet 
                         */
                        position: relative;
                        min-height: 200px;
                    }

                    .applicationsListLeft, 
                    .applicationsListRight {
                        display: flex;
                        flex-direction: column;
                        flex-wrap: wrap;
                        width: 100%;                     
                    }

                    .applicationsListLeft {
                        margin-right: 20px;
                    }

                    .throbber-wrapper {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);

                        width: 64px;
                        height: 64px;
                    }

                    .application :global(.product-border) {
                        margin: 0; 
                        margin-bottom: 20px;
                        width: 100%;
                    }

                    @media (max-width: 1200px) {
                        .page {
                            padding: 0 10px;
                            margin: 0 auto;
                        }
                    }

                    /**
                     * When the viewport gets too small, make products
                     * appear in one column
                     */
                    @media (max-width: 950px) {
                        .page {
                            margin: 0 auto;
                        }

                        .flex {
                            flex-direction: column;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders a list of either even or uneven indexed
     * products
     */
    private renderListOfApplications(renderEvenApplications: boolean): React.ReactNode {
        if (!this.state.applications) {
            return;
        }

        const evenOrUneven = renderEvenApplications ? 0 : 1;

        return (
            this.state.applications.map((application, index) => {
                if (index % 2 === evenOrUneven) {
                    return (
                        <Application 
                            key={index}
                            application={application}
                            userType={getUserType(this.props.store.user, UserTypes.PRODUCER)}
                            isOnProducersPage={false}
                            isOwnApplication={false}
                        />
                    );
                }
                return;
            })
        );
    }

    /**
     * Internal renderer that renders the introduction of the applications page
     */
    private renderIntroduction(): React.ReactNode {
        return (
            <React.Fragment>
                <h1>{ApplicationsPageJson.title}</h1>
                <p className="introduction">{ApplicationsPageJson.text}</p>

                <style jsx>{`
                    .introduction {
                        line-height: 1.4;
                    }     
                `}</style>
            </React.Fragment>
        );
    }

    /**
     * Internal renderer that'll render a list of filters to be used to filter
     * available applications.
     */
    // @ts-ignore
    private renderFilters(): React.ReactNode {
        return (
            <div>
                <span><b>{ApplicationsPageJson.Filter}</b></span>
                <span className="countryFilter">
                    <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.filterCountry} />
                </span>
                {this.state.filterCountry !== undefined && (
                    <span 
                        className="removeFilter" 
                        role="button" 
                        aria-label="Remove filter" 
                        onClick={this.removeFilter}
                    >
                        {ApplicationsPageJson.RemoveFilter}
                    </span>
                )}

                <style jsx>{`
                    /** Filter function */
                    .countryFilter {
                        margin-left: 10px;
                    }

                    .removeFilter {
                        margin-left: 10px;
                        font-weight: 300;
                        color: ${colors.secondary}; 
                    }

                    .removeFilter:hover {
                        color:${colors.tulip};
                        cursor: pointer;                        
                    }  

                    @media (max-width: 666px) {
                        .countryFilter {
                            & :global(select) {
                                width: 200px;
                            }
                        }
                    }                  
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that will render a pagination navigator in the bottom
     * of the applications list that can be used to navigate applications.
     */
    private renderNavigation(): React.ReactNode {
        // If we only have one page of navigation available to us, then do not
        // bother render pagination navigation.
        if (this.getAmountOfPages() <= 1) {
            return;
        }

        const isFirstPage = this.state.currentPage === 0;
        const isLastPage = this.state.currentPage === this.getAmountOfPages() - 1;

        return (
            <div className="pageNavigation">
                <span className="left">
                    {!isFirstPage && this.renderButton(ApplicationsPageJson.PreviousPage, !!this.state.isFetchingPrevious, this.goToPreviousPage)}
                </span>
                <span className="info">{ApplicationsPageJson.Page} {this.state.currentPage + 1} {ApplicationsPageJson.Of} {this.getAmountOfPages()}</span>
                <span className="right">
                    {!isLastPage && this.renderButton(ApplicationsPageJson.NextPage, !!this.state.isFetchingNext, this.goToNextPage)}
                </span>

                <style jsx>{`
                    /** Show number of pages, current page number and buttons
                     * for navigating to next or previous page
                     */
                    .pageNavigation {
                        position: relative;
                        margin-bottom: 20px;
                        height: 63px;
                    }

                    .pageNavigation .right {
                        position: absolute;
                        right: 0;
                        top: 0;
                    }

                    .pageNavigation .info {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-family: ${ fonts.text };
                        font-weight: 300;
                    }               
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders a button
     */
    private renderButton = (text: string, isLoading: boolean, onClick: () => void) => {
        return (
            <div className="button">
                <Button 
                    withThrobber={true} 
                    text={text}
                    width={170}
                    height={43}
                    fontSize={16}
                    isPending={isLoading}
                    throbberSize={30}
                    onClick={onClick}/>

                <style jsx>{`
                    /** Style button to match the rest of the project */
                    .button {
                        margin: 10px 0;
                        position: relative;
                        display: block;
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        .button :global(button) {
                            font-size: 14px;
                            width: 90px;
                            height: 35px;
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
    private fetchData = async (pageIndex: number) => {
        const response = await fetchApplicationBatch(pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE, this.props.store);

        if (!response) {
            this.setState({ applications: undefined });
            return;
        }

        this.setState({
            applications: response.applications,
            totalApplications: response.count,
        });
    }

    /**
     * Internal helper that when called will navigate the user to the next page
     */
    private goToNextPage = async () => {
        const isLastPage = this.state.currentPage === this.getAmountOfPages() - 1;

        if (isLastPage) {
            return;
        }

        this.setState({ isFetchingNext: true });

        await this.fetchData(this.state.currentPage + 1);
        this.setState({ currentPage: this.state.currentPage + 1, isFetchingNext: false });
    }

    /**
     * Internal helper that when called will navigate the user to the prev page
     */
    private goToPreviousPage = async () => {
        const isFirstPage = this.state.currentPage === 0;

        if (isFirstPage) {
            return;
        }

        this.setState({ isFetchingPrevious: true });

        await this.fetchData(this.state.currentPage - 1);
        this.setState({ currentPage: this.state.currentPage - 1, isFetchingPrevious: false });
    }

    /**
     * Internal helper that returns the current amount of available pages based
     * on the total count of products
     */
    private getAmountOfPages = () => {
        return Math.ceil(this.state.totalApplications / BATCH_SIZE);
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private removeFilter = () => {
        this.setState({filterCountry: undefined});
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry:string) => {
        this.setState({filterCountry: newCountry,});
    }
}

export const ApplicationsPage = injectStore((store) => ({ store }), UnwrappedApplicationsPage);