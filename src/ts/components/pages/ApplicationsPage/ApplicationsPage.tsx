import React from "react";
import ApplicationsPageJson from "src/assets/data/applicationsPage.json"
import { Selecter } from "src/ts/components/utils/Selecter";
import { CountryFilter } from "src/ts/components/utils/CountryFilter";
import { colors, fonts } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Throbber, Button } from "src/ts/components/utils";
import { ApplicationModel, fetchFilteredApplicationBatch, fetchApplicationCountries, fetchApplicationCities } from "src/ts/models/ApplicationModel";
import { Application } from "src/ts/components/elements/Application/Application";
import { getUserType } from "src/ts/utils/getUserType";
import { UserTypes } from "src/ts/models/UserModel";

export type ApplicationsPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

type ApplicationsPageState = {
    /**
     * List of cities in which applications are open
     */
    filterCountries?: string[];

    /**
     * The country the user wants to see applications from
     */
    filterCountry?: string;

    /**
     * List of cities within given country in which applications are open
     */
    filterCities?: string[];

    /**
     * The city the user wants to see applications from
     */
    filterCity?: string;

    /**
     * The sorting the user wants
     */
    sortBy: string;

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

    /**
     * Specifies whether filters should be showing
     */
    showFilters: boolean;
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
        showFilters: false,
        sortBy: "Newest",
    }

    /**
     * Fetch initial set of data as soon as the component mounts
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchApplications(this.state.currentPage);
        await this.fetchCountries();
        this.setState({ isPending: false });
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element {
        return (
            <div className="page">
                {this.renderIntroduction()}
                {this.state.applications && this.state.applications.length !== 0 && this.renderFilterSection()}
                {(this.state.isPending)
                    ? <i className="throbber-wrapper">
                            <Throbber size={64} relative={true} />
                    </i>
                    : <>
                        {this.state.applications && this.state.applications.length != 0
                            ? <>
                                <div className={`flex ${this.state.isPending ? "pending" : ""}`}>
                                    <div className="applicationsListLeft">
                                        {this.renderListOfApplications(true)}
                                    </div>
                                    <div className="applicationsListRight">
                                        {this.renderListOfApplications(false)}
                                    </div>
                                </div>
                                {this.renderNavigation()}
                            </>
                            :<h2><i>{ApplicationsPageJson.noApplicationsAvailable}</i></h2>
                        }
                    </>
                }

                {/*
                {(this.state.isPending) &&
                            <i className="throbber-wrapper">
                                <Throbber size={64} relative={true} />
                            </i>
                        }
                {!this.state.isPending && this.state.applications && this.state.applications.length != 0
                    && <><div className="flex">
                        
                        <div className="applicationsListLeft">
                            {this.renderListOfApplications(true)}
                        </div>
                        <div className="applicationsListRight">
                            {this.renderListOfApplications(false)}
                        </div>
                        </div>
                        {this.renderNavigation()}
                        </>
                     }
                {!this.state.isPending&& this.state.applications && this.state.applications.length == 0 && <h2><i>{ApplicationsPageJson.noApplicationsAvailable}</i></h2>}
                */}
                
                <style jsx>{`
                    h2 {
                        margin: 50px 0;
                        text-align: center;
                        margin-bottom: 20px;
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

                        &.isPending {
                            display: none;
                        }
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
                            padding: 0;
                            margin: 0 auto 20px auto;
                        }
                    }

                    /**
                     * When the viewport gets too small, make products
                     * appear in one column
                     */
                    @media (max-width: 950px) {
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
                    const onApplicationDonated = this.onApplicationDonated.bind(this, index);

                    return (
                        <Application
                            key={index}
                            application={application}
                            userType={getUserType(this.props.store.user, UserTypes.DONOR)}
                            isOnReceiversPage={false}
                            isOwnApplication={false}
                            // tslint:disable-next-line: react-this-binding-issue
                            onApplicationDonation={onApplicationDonated}
                            pastDonation={false}
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

                    h1 {
                        margin: 30px 0 15px 0;
                    }     

                    @media (max-width: 550px) {
                        .introduction, h1 {
                            margin-left: 10px;
                            margin-right: 10px;
                        }
                    }
                `}</style>
            </React.Fragment>
        );
    }

    /**
     * Internal renderer that'll render a list of filters to be used to filter
     * applications.
     */
    private renderFilterSection(): React.ReactNode {
        return (
            <div className="filter_section">
                <div className="sort">
                    <Selecter elements={["Price low", "Price high","Newest", "Oldest"]} defaultText="Sort by" onChange={this.newSortingSelected} current={this.state.sortBy} isDisabled={false} preText={"Sort by:"} />
                </div>
                <div className="right">
                {this.state.filterCountry !== undefined && (
                    <span
                        className="removeFilter"
                        role="button"
                        aria-label="Remove filter"
                        onClick={this.removeFilter}
                    >
                        {ApplicationsPageJson.RemoveFilter}
                    </span>)}
                <Button
                    className = "filter_button"
                    withThrobber={false}
                    text={"Filter"}
                    width={110}
                    height={43}
                    fontSize={16}
                    isPending={false}
                    onClick={this.toggleFilters} 
                    withChevron={true}
                    showChevronInversed={this.state.showFilters}
                    />
                

                {this.state.showFilters && <div className="filters">
                    <div className="countryFilter">
                        <CountryFilter countries={this.state.filterCountries} onChange={this.newCountrySelected} current={this.state.filterCountry} />
                    </div>
                    <div className="cityFilter">
                        <Selecter elements={this.state.filterCities} defaultText="Select city" allText="All cities" onChange={this.newCitySelected} current={this.state.filterCity} isDisabled={this.state.filterCountry === undefined} />
                    </div>
                </div>}
                </div>
                <style jsx>{`
                    .filter_section {
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        /*text-align: right;*/
                    }

                    .right {
                        text-align: right;
                    }

                    .sort {
                        text-align: left;
                        margin: 0;
                    }

                    .removeFilter {
                        margin-right: 10px;
                        font-weight: 300;
                        color: ${colors.secondary}; 
                    }

                    .removeFilter:hover {
                        color:${colors.tulip};
                        cursor: pointer;                        
                    }  

                    .filters {
                        display: flex;
                    }

                    .cityFilter {
                        margin-left: 15px;
                        margin-top: 20px;
                    }

                    @media (max-width: 800px) {
                        .countryFilter, .cityFilter, .sort {
                            & :global(select) {
                                width: 250px;
                            }
                        }
                        .filters {
                            flex-direction: column;
                        }

                        .cityFilter {
                            margin-top: 10px;
                        }
                    }

                    @media (max-width: 550px) {
                        .filter_section {
                            flex-direction: column;
                            margin: 0 10px;
                        }

                        .countryFilter, .cityFilter, .sort {
                            width: 100%;
                            padding: 0;
                            & :global(select) {
                                width: 100%;
                                max-width: 100%;
                            }
                        }

                        .sort {
                            margin: 0 0 20px 0;
                        }

                        .countryFilter {
                            margin-bottom: 10px;
                        }

                        .cityFilter {
                            margin: 0;
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
                        font-family: ${ fonts.text};
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
                    onClick={onClick} />

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
    private fetchApplications = async (pageIndex: number) => {
        this.setState({isPending: true});

        let response = null;

        if (this.state.filterCountry && this.state.filterCity) {
            response = await fetchFilteredApplicationBatch(this.props.store, pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE, this.state.filterCountry, this.state.filterCity);
        } else if (this.state.filterCountry) {
            response = await fetchFilteredApplicationBatch(this.props.store, pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE, this.state.filterCountry);
        } else {
            response = await fetchFilteredApplicationBatch(this.props.store, pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE);
        }
        
        if (!response) {
            this.setState({ applications: undefined });
            return;
        }

        this.setState({
            applications: response.applications,
            totalApplications: response.count,
        });
        this.sortApplications(this.state.sortBy);
        this.setState({isPending: false});
    }

    /**
     * Internal helper that'll fetch the countries in which applications are open
     */
    private fetchCountries = async () => {
        const responseCountries = await fetchApplicationCountries(this.props.store);
        if (!responseCountries) {
            this.setState({ filterCountries: undefined });
            return;
        }
        this.setState({
            filterCountries: responseCountries,
        });
    }

    /**
     * Callback that should be executed once an application gets donated to in order
     * to ensure that the locked status also is reflected on the UI
     */
    private onApplicationDonated = (index: number) => {
        const newApplicationList = this.state.applications;
        const totalApplications = this.state.totalApplications;
        if (newApplicationList) {
            newApplicationList.splice(index, 1);
            this.setState({ 
                applications: newApplicationList,
                totalApplications: totalApplications - 1
             });
        }
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

        await this.fetchApplications(this.state.currentPage + 1);
        this.setState({ currentPage: this.state.currentPage + 1, isFetchingNext: false });
        window.scrollTo(0, 0);
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

        await this.fetchApplications(this.state.currentPage - 1);
        this.setState({ currentPage: this.state.currentPage - 1, isFetchingPrevious: false });
        window.scrollTo(0, 0);
    }

    /**
     * Internal helper that returns the current amount of available pages based
     * on the total count of products
     */
    private getAmountOfPages = () => {
        return Math.ceil(this.state.totalApplications / BATCH_SIZE);
    }

    /**
     * Removes filters and shows all applications
     */
    private removeFilter = () => {
        this.setState({ 
            filterCountry: undefined,
            filterCity: undefined,
        }, () => this.fetchApplications(this.state.currentPage));
    }

    /**
     * Toggle whether filters are showed or not
     */
    private toggleFilters = () => {
        this.setState({showFilters: !this.state.showFilters});
    }

    /**
     * Is passed down to CountryFilter and allows us to extract its value
     */
    private newCountrySelected = (newCountry: string) => {
        if (newCountry === "ALL") {
            this.setState({
                filterCountry: undefined,
                filterCity: undefined
            }, () => this.fetchApplications(this.state.currentPage));
        } else {
            this.setState({
                filterCountry: newCountry,
                filterCity: undefined
            }, () => this.fetchApplications(this.state.currentPage));
            this.fetchCities(newCountry);
        }
    }

    /**
     * Is passed down to CountryFilter and allows us to extract its value
     */
    private newSortingSelected = (sorting: string) => {
        this.setState({
            sortBy: sorting,
        }, () => this.sortApplications(sorting));
    }

    /**
     * Sort applications by something
     */
    private sortApplications = (sorting: string) => {
        if (sorting === "Price low") {
            this.sortApplicationsPriceLow();
        } else if (sorting === "Price high") {
            this.sortApplicationsPriceHigh();
        } else if (sorting === "Newest") {
            this.sortApplicationsDateNew();
        } else if (sorting === "Oldest") {
            this.sortApplicationsDateOld();
        }
    }

    /**
     * Sort applications by price, low to high
     */
    private sortApplicationsPriceLow = () => {
        if (!this.state.applications) {
            return;
        }
        let sorted = this.state.applications.sort((a,b) => {
            if (a.productPrice < b.productPrice) { return -1; }
            if (a.productPrice > b.productPrice) { return 1; }
            return 0;
        });

        this.setState({applications: sorted});
        this.forceUpdate();
    }

    /**
     * Sort applications by price, high to low
     */
    private sortApplicationsPriceHigh = () => {
        if (!this.state.applications) {
            return;
        }
        let sorted = this.state.applications.sort((a,b) => {
            if (a.productPrice > b.productPrice) { return -1; }
            if (a.productPrice < b.productPrice) { return 1; }
            return 0;
        });
        this.setState({applications: sorted});
        this.forceUpdate();
    }

    /**
     * Sort applications by date, new to old
     */
    private sortApplicationsDateNew = () => {
        if (!this.state.applications) {
            return;
        }
        let sorted = this.state.applications.sort((a,b) => {
            if (a.creationDate > b.creationDate) { return -1; }
            if (a.creationDate < b.creationDate) { return 1; }
            return 0;
        });
        this.setState({applications: sorted});
        this.forceUpdate();
    }

    /**
     * Sort applications by date, old to new
     */
    private sortApplicationsDateOld = () => {
        if (!this.state.applications) {
            return;
        }
        let sorted = this.state.applications.sort((a,b) => {
            if (a.creationDate < b.creationDate) { return -1; }
            if (a.creationDate > b.creationDate) { return 1; }
            return 0;
        });
        this.setState({applications: sorted});
        this.forceUpdate();
    }

    /**
     * Internal helper that'll fetch the cities
     */
    private fetchCities = async (country: string) => {
        const response = await fetchApplicationCities(country, this.props.store);
        if (!response) {
            this.setState({ filterCities: undefined });
            return;
        }
        this.setState({
            filterCities: response,
        });
    }

    /**
     * Is passed down to Selecter and allows us to extract its value
     */
    private newCitySelected = (newCity: string) => {
        if (newCity === "ALL") {
            this.setState({filterCity: undefined}, () => this.fetchApplications(this.state.currentPage));
        } else {
            this.setState({ filterCity: newCity}, () => this.fetchApplications(this.state.currentPage));
        }
    }
}

export const ApplicationsPage = injectStore((store) => ({ store }), UnwrappedApplicationsPage);