import { observer } from "mobx-react";
import React from "react";

import { Link, RouteComponentProps } from "react-router-dom";
import { routes } from "src/ts/config/routes";

import { getSVG } from "src/assets/svg";
import { UserModel, UserTypes, fetchUser } from "src/ts/models/UserModel";
import { injectStore } from "src/ts/store/injectStore";
import { isProducerUser, isReceiverUser } from "src/ts/utils/verifyUserModel";

import { UserDescription } from "src/ts/components/elements/UserDescription/UserDescription";
import userProfileJson from "src/assets/data/userProfile.json";
import { ApplicationModel, fetchApplicationByReceiver, ApplicationStatus } from "src/ts/models/ApplicationModel";
import { Store } from "src/ts/store/Store";
import { Application } from "src/ts/components/elements/Application/Application";
import { colors } from "src/ts/config";
import { ProductModel, fetchProductByProducer, ProductStatus } from "src/ts/models/ProductModel";
import { Product } from "src/ts/components/elements/Product/Product";
import { getUserType } from "src/ts/utils/getUserType";
import { Throbber } from "src/ts/components/utils";
import { Fade } from "src/ts/components/transitions/Fade";
import { asyncTimeout } from "src/ts/utils";
import { Dropdown } from "src/ts/components/utils/Dropdown/Dropdown";

export type UserProps = {
    /**
     * Contains a reference to the user model that should be rendered
     */
    store: Store;
} & RouteComponentProps;

export type UserState = {
    /**
     * Specifies the id of the currently rendered user
     */
    userId: number;

    /**
     * Specifies the user to be rendered
     */
    renderedUser?: UserModel;

    /**
     * Specifies whether the rendered user is the user themself, which means
     * we should render edit functionality etc.
     */
    isSelf: boolean;

    /**
     * Specifies whether the product should be rendered to be compatible with
     * smaller viewports
     */
    isSmall: boolean;

    /**
     * Specifies whether or not we're currently attempting to load products/applications
     */
    isPending?: boolean;

    /**
     * Specifies whether it should render active or inactive products
     */
    filterActiveProducts: boolean;

    /**
     * Specifies whether it should render open, pending or closed applications
     */
    filterApplications: ApplicationStatus;

    /**
     * Specifies if the filter dropdown should currently be shown when producer
     * views their own profile.
     */
    showDropdown?: boolean;

    /**
     * Contains an array of active products to be rendered if any
     */
    activeProducts?: ProductModel[];

    /**
     * Contains an array of inactive products to be rendered if any
     */
    inactiveProducts?: ProductModel[];

    /**
     * Contains an array of open applications to be rendered if any
     */
    openApplications?: ApplicationModel[];

    /**
     * Contains an array of open applications to be rendered if any
     */
    pendingApplications?: ApplicationModel[];

    /**
     * Contains an array of open applications to be rendered if any
     */
    completedApplications?: ApplicationModel[];

    /**
     * Contains an array of open applications to be rendered if any
     */
    unavailableApplications?: ApplicationModel[];

    /**
     * The initial load of applications, used to determine if we should load
     * pending or open applications initially.
     */
    initialLoad?: boolean;


}

const MOBILE_BREAKPOINT = 440;

/**
 * A page where the user can see their profile
 */
@observer
export class UnwrappedUserProfile extends React.Component<UserProps, UserState>{
    /**
     * Setup initial state
     */
    public state: UserState = {
        userId: this.props.store.user ? this.props.store.user.id : 0,
        isSelf: false,
        isSmall: false,
        renderedUser: this.props.store.user,
        filterActiveProducts: true,
        filterApplications: ApplicationStatus.PENDING,
        isPending: true,
        initialLoad: true
    }


    /**
     * Will contain a reference to the user name wrapper, so that we can make
     * the dropdown point towards it properly.
     */
    protected readonly wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

    /** 
     * Reference to the div tag with class name fefefe
     */
    private readonly borderRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Determine if we should render a different user than self
     * Determine the breakpoint we're currently in as soon as the component mounts,
     * and prepare for
     */
    public async componentDidMount(): Promise<void> {
        this.loadUser();

        this.determineBreakpoint();

        window.addEventListener("resize", this.determineBreakpoint);
        window.addEventListener("orientationchange", this.determineBreakpoint);
    }

    /**
     * Cleanup on unmount
     */
    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.determineBreakpoint);
        window.removeEventListener("orientationchange", this.determineBreakpoint);
    }

    /**
     * When the component changes, determine if we should load a new user
     */
    public async componentDidUpdate(): Promise<void> {
        // tslint:disable-next-line completed-docs
        const readonlyUserId = (this.props.match.params as { userId: string }).userId;

        if (readonlyUserId && Number(readonlyUserId) !== this.state.userId) {
            this.loadUser();
        } else if (!readonlyUserId && this.props.store.user && this.props.store.user.id !== Number(this.state.userId)) {
            this.loadUser();
        }
    }

    /**
     * Main render method, used to render ProfilePage
     */
    // tslint:disable-next-line max-func-body-length
    public render(): JSX.Element {
        const { renderedUser: user } = this.state;

        if (!user) {
            return <h1>There's no user available to be rendered!</h1>;
        }

        return (
            <div className="page">
                <div className="wrapper">
                    <div className="profile__information">
                        <div className="header">
                            <h1>{userProfileJson.profile}</h1>
                            {this.state.isSelf && (
                                <Link className="link editProfile" to={routes.editProfile.path} title="Edit profile">
                                    <i>
                                        {getSVG("edit")}
                                    </i>
                                </Link>
                            )}
                        </div>
                        {/* Information box */}
                        <UserDescription user={user} isSelf={this.state.isSelf} />
                    </div>
                    {/* List of the user's products/applications */}
                    <div className="list">
                        {isProducerUser(user) && (
                            <>
                                <div className="list__header" ref={this.borderRef}>
                                    <h2>{this.state.isSelf ? userProfileJson.ownProducts : userProfileJson.othersProducts}</h2>
                                    {this.state.isSelf && (
                                        <div className="product-action-buttons">
                                            <Link className="link newProduct" to={routes.createProduct.path} title="Create new product">
                                                <i>
                                                    {getSVG("plus-square")}
                                                </i>
                                            </Link>

                                            {this.renderFilterDropdown()}
                                        </div>
                                    )}
                                </div>
                                {this.renderProducts()}
                            </>
                        )}
                        {isReceiverUser(user) && (
                            <>
                                <div className="list__header" ref={this.borderRef}>
                                    <h2>{this.state.isSelf ? userProfileJson.ownApplications : userProfileJson.othersApplications}</h2>
                                    {this.state.isSelf && this.renderFilterDropdown()}
                                </div>

                                {this.renderApplications()}

                                {!this.state.isSelf && 
                                    <>
                                    <h2 className="pastDonations">{userProfileJson.pastDonations}</h2>
                                    {this.renderPastDonations()}
                                    </>
                                }
                            </>
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .page {
                        margin-bottom: 15px;
                        padding: 0 10px;
                    }

                    .wrapper {
                        display: flex;
                        justify-content: space-evenly;
                    }

                    .profile__information {
                        position: sticky;
                        top: 0;
                        height: min-content;

                        & :global(.information) {
                            max-height: calc(100vh - 120px);
                            overflow: auto;
                        }
                    }

                    .product-action-buttons {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        justify-content: space-between;

                        width: 100%;
                    }

                    .application-action-buttons {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        width: 100%;
                    }

                    h1 {
                        margin-top: 30px;
                        display: inline-block;
                    }

                    h2 {
                        margin: 0;
                        flex-shrink: 0;
                    }

                    /* Link to edit profile page, centered under image */
                    :global(.link) {
                        color: ${colors.primary};
                        text-decoration: none;
                        display: inline-block;
                    }

                    :global(.editProfile) {
                        margin-top: 30px;
                        margin-left: 10px;

                        & i {
                            display: block;
                            width: 24px;
                            height: 24px;
                        }
                    }

                    :global(.newProduct > i) {
                        display: block;
                        width: 24px;
                        height: 24px;
                    }

                    :global(.link):hover {
                        color: ${colors.secondary};
                    }

                    .link i {
                        & :global(> span > svg) {
                            width: 24px;
                            margin-left: 5px;
                            /* Allign with h1 */
                            margin-bottom: -2px;
                        }
                    } 

                    /**
                     * List of user's products/applications,
                     * move down to align with information box
                     */
                    .list {
                        position: relative;
                        margin-top: 80px;
                        width: 50%;
                        min-height: 150px;
                        display: flex;
                        flex-direction: column;
                    }

                    .list__header {
                        display: flex;

                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                        & h2 {
                            margin-right: 10px;
                        }
                    }

                    .pastDonations {
                        margin-top: 30px;
                        margin-bottom: 15px;
                    }

                    /* Make more room for applications/products when the width is less than 820px */
                    @media only screen and (max-width: 820px) {
                        .profile_information {
                            max-width: 300px;
                        }
                    }

                    @media only screen and (max-width: 768px) {
                        .list__header, .pastDonations {
                            margin-left: 10px;
                        }
                    }

                    /* For mobile phones */
                    @media only screen and (max-width: 800px) {
                        .page {
                            width: 100%;
                            margin: auto;
                            padding: 0;
                        }

                        /* Make products/applications appear beneath information */
						.wrapper {
                            width: 100%;
    						flex-direction: column;
                            justify-content: center;
						}

                        .header {
                            text-align: center;
                        }

                        .list__header, .pastDonations {
                            padding-bottom: 15px;
                            border-bottom: 2px solid rgba(69,50,102, 0.6);
                        }

                        .list__header {
                            margin-top: 20px;
                        }

                        .profile__information {
                            position: static;
                            margin: 0 10px;

                            & :global(.information) {
                                max-height: unset;
                            }
                        }

                        /* Make the list wide enough to fill the  screen. */
                        .list {
                            width: calc(100% - 20px);
                            padding: 10px;
                            margin: 0;
                        }
					}
                `}</style>
            </div>
        )
    }

    /**
     * Simple helper that displays a throbber that can be rendered while products/
     * applications are loading
     */
    private renderListThrobber = () => {
        const throbberSize = 64;

        return (
            <i
                style={{
                    height: throbberSize,
                    width: throbberSize,
                }}
            >
                <Throbber size={throbberSize} relative={true} />

                <style jsx>{`
                    i {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                `}</style>
            </i>
        );
    }

    /**
     * Internal render method that'll render all products associated to a user
     */
    private renderProducts = () => {

        let products = null;
        if (this.state.filterActiveProducts) {
            products = this.state.activeProducts;
        } else {
            products = this.state.inactiveProducts;
        }

        return (
            <div className="list-wrapper">
                <Fade in={this.state.isPending} key="throbber">
                    {this.renderListThrobber()}
                </Fade>
                <Fade in={!this.state.isPending} key="products">
                    <div>
                        {products && products.map((product, index) => {
                            const isOnProducersPage = product.producerId === this.state.userId;
                            const isOwnProduct = this.props.store.user
                                ? this.props.store.user.id === product.producerId
                                : false;

                            const updateProduct = this.updateProduct.bind(this, index);

                            return (
                                <Product
                                    key={index}
                                    product={product}
                                    isOnProducersPage={isOnProducersPage}
                                    isOwnProduct={isOwnProduct}
                                    updateProduct={updateProduct}
                                    userType={getUserType(this.props.store.user, UserTypes.PRODUCER)}
                                />
                            );
                        })}
                    </div>
                </Fade>

                <style jsx>{`
                    .list-wrapper {
                        position: relative;
                        flex-grow: 1;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal render method that'll render the button that manage the 
     * dropdown for filtering
     */
    private renderFilterDropdown() {
        if (!this.state.isSelf) return;

        const { renderedUser: user } = this.state;

        if (!user) {
            return;
        }
        let currentFilter: string;

        if (isProducerUser(user)) {
            currentFilter = this.state.filterActiveProducts
                ? "Active products"
                : "Inactive products";
        } else {
            if (this.applicationStatusIsOpen(this.state.filterApplications)) {
                currentFilter = "Open applications";
            } else if (this.applicationStatusIsPending(this.state.filterApplications)) {
                currentFilter = "Pending applications";
            } else if (this.applicationStatusIsCompleted(this.state.filterApplications)) {
                currentFilter = "Completed applications";
            } else {
                currentFilter = "Unavailable applications";
            }
        }

        return (
            <div
                className={`filter-section ${this.state.showDropdown ? "active" : ""}`}
                onClick={this.toggleDropdownState}
                ref={this.wrapperRef}
                role="button"
            >
                {!this.state.isSmall &&
                    <>
                        <span className="show">Showing: </span>
                        <div className="show-filter">
                            {currentFilter}
                        </div>
                    </>
                }

                {this.state.isSmall &&
                    <i>
                        {getSVG("more-vertical")}
                    </i>
                }

                {this.renderDropdown()}

                <style jsx>{`
                    .filter-section {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }

                    .filter-section i {
                        transform: scale(1.10);

                        margin-right: 10px;

                        display: block;
                        width: 24px;
                        height: 24px;

                        cursor: pointer;

                        &:hover {
                            background-color: rgba(69, 50, 102, 0.1);
                            border-radius: 5px;
                        }
                    }

                    .show-filter {
                        margin-left: 5px;
                        padding: 7px;
                        cursor: pointer;

                        border: 1px solid ${ colors.primary};
                        width: 170px;

                        text-align: center;


                        /** Prepare hover transition */
                        transition:
                            background-color 0.1s linear,
                            color 0.1s linear;
                    }

                    .show-filter:hover {
                        background-color: rgba(69, 50, 102, 0.1);
                    }

                    span {
                        color: ${ colors.primary};
                    }

                    .show {
                        font-weight: bold;
                    }
                    
                `}</style>
            </div>
        );
    }

    /**
     * Internal render method to render the options of filtering 
     */
    private renderFilterButtons() {
        const { renderedUser: user } = this.state;

        if (!user) {
            return;
        }

        return (
            <div>
                {isProducerUser(user)
                    ? <div className="filter-buttons">
                        <button className="filter-active" onClick={this.filterActiveProducts}>
                            <i>{getSVG("check-square")}</i>
                            <span>Active products</span>
                        </button>
                        <button className="filter-inactive" onClick={this.filterInactiveProducts}>
                            <i>{getSVG("square")}</i>
                            <span>Inactive products</span>
                        </button>
                    </div>
                    : <div className="filter-buttons">
                        <button data-applicationstatus={ApplicationStatus.OPEN} onClick={this.filterApplications}>
                            <span>Open applications</span>
                        </button>
                        <button data-applicationstatus={ApplicationStatus.PENDING} onClick={this.filterApplications}>
                            <span>Pending applications</span>
                        </button>
                        <button data-applicationstatus={ApplicationStatus.COMPLETED} onClick={this.filterApplications}>
                            <span>Completed applications</span>
                        </button>
                        <button data-applicationstatus={ApplicationStatus.UNAVAILABLE} onClick={this.filterApplications}>
                            <span>Unavailable applications</span>
                        </button>
                    </div>
                }

                <style jsx>{`

                    .filter-buttons span {
                        align-self: center;
                        padding-left: 3px;
                    }

                    .filter-buttons i {
                        transform: scale(0.75);
                    }

                    .filter-buttons button {
                        /** Override defaults */
                        background: none;
                        -webkit-appearance: none;
                        border: none;
                        /** Center items within vertically */
                        display: flex;
                        align-items: center;

                        /** Allow button to fill the whole dropdown */
                        width: 100%;

                        /**
                         * Set up basic padding around the element (the 6px top
                         * padding is applied to take into account that the icon
                         * will push text further down, and we want the white-
                         * space to visually align with the text instead of the
                         * icon).
                         */
                        padding: 10px 20px;
                        margin: 0;

                        /**
                         * Indicate that items are clickable
                         */
                        cursor: pointer;

                        /** Prevent line-breaks within the label */
                        white-space: nowrap;

                        /** Set up text styling */
                        font-size: 12px;
                        color: ${ colors.black};
                        line-height: 1em;
                        text-decoration: none;

                        /** Prepare hover transition */
                        transition:
                            background-color 0.1s linear,
                            color 0.1s linear;

                        & i {
                            /** Set up icon sizing */
                            display: inline-block;
                            width: 22px;
                            height: 22px;

                            /** Apply margin between icon and text */
                            margin-right: 10px;

                            & > :global(.svgIcon) > :global(svg) > :global(path) {
                                /** Apply default font color */
                                stroke: ${ colors.black};
                            }
                        }

                        /** Apply highlight color on hover */
                        &:hover {
                            background-color: rgba(69, 50, 102, 0.1);
                            color: ${ colors.primary};

                            & i > :global(.svgIcon) > :global(svg) > :global(path) {
                                stroke: ${ colors.primary};
                            }
                        }
                    }

                `}</style>
            </div>
        );
    }

    /**
     * Renders the dropdown that'll become visible when the user clicks his own
     * profile name.
     */
    protected renderDropdown(): JSX.Element {
        return (
            <Dropdown
                active={this.state.showDropdown}
                pointAt={this.wrapperRef}
                onClose={this.toggleDropdownState}
            >
                <div className="wrapper">
                    {this.renderFilterButtons()}
                </div>

                <style jsx>{`
                    .wrapper {
                        /** Apply internal padding */
                        padding: 10px 0;

                        /**
                         * Enforce a minimum width on the userInfo making sure
                         * that it always renders nicely
                         */
                        min-width: 175px;

                        /** By default element isn't clickable */
                        cursor: default;
                    }
                `}</style>
            </Dropdown>
        );
    }

    /**
     * Internal helper that'll load all active products related to a user
     */
    private loadActiveProducts = async () => {
        if (!this.state.userId) {
            return;
        }

        this.setState({ isPending: true });
        const products = await fetchProductByProducer(
            this.state.userId,
            this.props.store,
            ProductStatus.ACTIVE
        );

        if (!products) {
            this.setState({ activeProducts: [] });
        } else {
            this.setState({ activeProducts: products });
        }

        this.setState({ isPending: false });
    }

    /**
     * Internal helper that'll load all inactive products related to a user
     */
    private loadInactiveProducts = async () => {
        if (!this.state.userId) {
            return;
        }

        this.setState({ isPending: true });
        const products = await fetchProductByProducer(
            this.state.userId,
            this.props.store,
            ProductStatus.INACTIVE
        );

        if (!products) {
            this.setState({ inactiveProducts: [] });
        } else {
            this.setState({ inactiveProducts: products });
        }

        this.setState({ isPending: false });
    }

    /**
     * Simple callback that should be executed once a product should be updated.
     * (e.g. when toggling the product on and off)
     */
    private updateProduct = (index: number, chosenProduct: ProductModel) => {

        const newActiveProductList = this.state.activeProducts;
        const newInactiveProductList = this.state.inactiveProducts;

        if (chosenProduct.isActive) {
            if (newInactiveProductList) {
                // If new product is active, then remove it from inactiveProducts list
                newInactiveProductList.splice(index, 1);
                this.setState({ inactiveProducts: newInactiveProductList });
            }
        } else {
            if (newActiveProductList) {
                // ...else remove it from the activeProduct list
                newActiveProductList.splice(index, 1);
                this.setState({ activeProducts: newActiveProductList });
            }
        }
    }

    /**
     * Simple callback that should be executed once an application should be updated.
     * (e.g. when confirming receival of a product)
     */
    private confirmApplication = (index: number, chosenApplication: ApplicationModel) => {

        const newPendingApplicationList = this.state.pendingApplications;

        if (chosenApplication.status === ApplicationStatus.COMPLETED) {
            if (newPendingApplicationList) {
                // If new product is active, then remove it from inactiveProducts list
                newPendingApplicationList.splice(index, 1);
                this.setState({ pendingApplications: newPendingApplicationList });
            }
        }
    }

    /**
     * Internal render method that'll render all applications associated to a user
     */
    private renderApplications = () => {
        let applications = null;
        if (this.applicationStatusIsOpen(this.state.filterApplications)) {
            applications = this.state.openApplications;
        } else if (this.applicationStatusIsPending(this.state.filterApplications)) {
            applications = this.state.pendingApplications;
        } else if (this.applicationStatusIsCompleted(this.state.filterApplications)) {
            applications = this.state.completedApplications;
        } else if (this.applicationStatusIsUnavailable(this.state.filterApplications)) {
            applications = this.state.unavailableApplications;
        }

        if (!applications || applications.length === 0) {
            return (
                <p><i>{userProfileJson.noApplications}</i>
                    <style jsx>{`
                        @media only screen and (max-width: 768px) {
                            p {
                                margin-left: 10px;
                            }
                        }
                    `}</style>
                </p>);
        }

        return (
            <div className="list-wrapper">
                <Fade in={this.state.isPending} unmountOnExit key="throbber">
                    {this.renderListThrobber()}
                </Fade>
                <Fade in={!this.state.isPending} key="applications">
                    <div>
                        {applications && applications.map((application, index) => {
                            const isOnReceiversPage = application.receiverId === this.state.userId;
                            const isOwnApplication = this.props.store.user
                                ? this.props.store.user.id === application.receiverId
                                : false;

                            const onApplicationDeleted = this.onApplicationDeleted.bind(this, index);
                            const confirm = this.confirmApplication.bind(this, index);

                            return (
                                <Application
                                    key={index}
                                    isOwnApplication={isOwnApplication}
                                    userType={getUserType(this.props.store.user, UserTypes.DONOR)}
                                    isOnReceiversPage={isOnReceiversPage}
                                    application={application}
                                    onApplicationDeleted={onApplicationDeleted}
                                    onApplicationDonation={onApplicationDeleted}
                                    confirmApplication={confirm}
                                    pastDonation={false}
                                />
                            );
                        })}
                    </div>
                </Fade>

                <style jsx>{`
                    .list-wrapper {
                        position: relative;
                        flex-grow: 1;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal render method that'll render a receivers past donations
     */
    private renderPastDonations = () => {
        let p = this.state.pendingApplications;
        let c = this.state.completedApplications;

        let applications = p ? (c ? p.concat(c) : p) : c;

        if (!applications || applications.length === 0) {
            return (
                <p><i>{userProfileJson.noPastDonations}</i>
                    <style jsx>{`
                        @media only screen and (max-width: 768px) {
                            p {
                                margin-left: 10px;
                            }
                        }
                    `}</style>
                </p>);
        }

        return (
            <div className="list-wrapper">
                <Fade in={this.state.isPending} unmountOnExit key="throbber">
                    {this.renderListThrobber()}
                </Fade>
                <Fade in={!this.state.isPending} key="applications">
                    <div>
                        {applications && applications.map((application, index) => {
                            return (
                                <Application
                                    key={index}
                                    isOwnApplication={false}
                                    userType={getUserType(this.props.store.user, UserTypes.DONOR)}
                                    isOnReceiversPage={true}
                                    application={application}
                                    pastDonation={true}
                                />
                            );
                        })}
                    </div>
                </Fade>

                <style jsx>{`
                    .list-wrapper {
                        position: relative;
                        flex-grow: 1;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal helper that'll load all applications with given status
     * related to the user
     */
    private loadApplications = async (status: ApplicationStatus) => {
        if (!this.state.userId) {
            return;
        }

        this.setState({ isPending: true });
        const applications = await fetchApplicationByReceiver(
            this.state.userId,
            this.props.store,
            status,
        );

        if (!applications || applications.length === 0 && this.state.initialLoad) {
            this.setState({ initialLoad: false, filterApplications: ApplicationStatus.OPEN }, () => {
                this.loadApplications(ApplicationStatus.OPEN);
            });
            return;
        }

        if (status === ApplicationStatus.OPEN) {
            this.setState({ openApplications: applications});
        } else if (status === ApplicationStatus.PENDING) {
            this.setState({ pendingApplications: applications });
        } else if (status === ApplicationStatus.COMPLETED) {
            this.setState({ completedApplications: applications });
        } else if (status === ApplicationStatus.UNAVAILABLE) {
            this.setState({ unavailableApplications: applications });
        }

        this.setState({ isPending: false, initialLoad: false });
    }

    /**
     * Callback that should be executed once an application gets deleted in order
     * to ensure that the deletion also is reflected on the UI
     */
    private onApplicationDeleted = (index: number) => {
        const newApplicationList = this.state.openApplications;

        if (newApplicationList) {
            newApplicationList.splice(index, 1);
            this.setState({ openApplications: newApplicationList });
        }
    }

    /**
     * Internal method that'll load the user to be rendered within the user profile
     */
    private loadUser = async () => {
        // tslint:disable-next-line completed-docs
        const readonlyUserId = (this.props.match.params as { userId: string }).userId;
        let user: UserModel | undefined;

        // If we have a match on the route, that means we should attempt to 
        // render the given user in readonly mode
        if (readonlyUserId) {
            user = await fetchUser(readonlyUserId, this.props.store);

            this.setState({
                userId: Number(readonlyUserId),
                isSelf: false,
                renderedUser: user,
            });
        } else {
            user = this.props.store.user;

            // ... however, if we doesn't match, then we should render our own
            // user
            this.setState({ isSelf: true, renderedUser: user, userId: user ? user.id : 0 });
        }

        await asyncTimeout(0);

        // Begin loading the desired additional data based on the user to display
        if (user && isReceiverUser(user)) {
            this.loadApplications(ApplicationStatus.OPEN);
            if (readonlyUserId) {
                this.loadApplications(ApplicationStatus.PENDING);
                this.loadApplications(ApplicationStatus.COMPLETED);
            }
        } else if (user && isProducerUser(user)) {
            this.loadActiveProducts();
        }
    }

    /**
     * Internal helper that'll filter active products
     */
    private filterActiveProducts = () => {
        this.setState({ filterActiveProducts: true });
        this.loadActiveProducts();
        this.toggleDropdownState();
    }

    /**
     * Internal helper that'll filter inactive products
     */
    private filterInactiveProducts = () => {
        this.setState({ filterActiveProducts: false });
        this.loadInactiveProducts();
        this.toggleDropdownState();
    }

    /**
     * Internal helper that'll filter active products
     */
    private filterApplications = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const dataStatus = evt.currentTarget.dataset.applicationstatus;
        let status: ApplicationStatus;

        if (dataStatus) {
            status = dataStatus as ApplicationStatus;
        } else {
            return;
        }


        this.setState({ filterApplications: status });
        this.loadApplications(status);
        this.toggleDropdownState();
    }

    /**
     * Listener that's triggered when the producer somehow prompts for the
     * dropdown to appear or disappear
     */
    protected toggleDropdownState = () => {
        this.setState({ showDropdown: !this.state.showDropdown });
    }

    /**
     * Internal helper that determines whether the product should be rendered
     * in a small breakpoint or not
     */
    private determineBreakpoint = () => {
        const root = this.borderRef.current;

        if (!root) {
            return;
        }

        this.setState({ isSmall: root.clientWidth < MOBILE_BREAKPOINT });
    }

    /**
     * Internal helpter that returns true if the given application status is open
     */
    private applicationStatusIsOpen = (status: ApplicationStatus) => {
        return status === ApplicationStatus.OPEN;
    }

    /**
     * Internal helpter that returns true if the given application status is pending
     */
    private applicationStatusIsPending = (status: ApplicationStatus) => {
        return status === ApplicationStatus.PENDING;
    }

    /**
     * Internal helpter that returns true if the given application status is completed
     */
    private applicationStatusIsCompleted = (status: ApplicationStatus) => {
        return status === ApplicationStatus.COMPLETED;
    }

    /**
     * Internal helpter that returns true if the given application status is unavailable
     */
    private applicationStatusIsUnavailable = (status: ApplicationStatus) => {
        return status === ApplicationStatus.UNAVAILABLE;
    }
}

export const UserProfile = injectStore((store) => ({ store }), UnwrappedUserProfile);
