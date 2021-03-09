import React from "react";

import { colors } from "src/ts/config/colors";
import ProductJSON from "src/assets/data/product.json"

import { easings } from "src/ts/config/easings";
import { ProductModel, toggleProductAvailability } from "src/ts/models/ProductModel";
import { Chevron, Button } from "src/ts/components/utils";
import { Thumbnail } from "src/ts/components/utils/Thumbnail";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { getSVG } from "src/assets/svg";
import { fonts, routes } from "src/ts/config";
import { UserTypes, fetchUser } from "src/ts/models/UserModel";
import { ProducerModel } from "src/ts/models/ProducerModel";
import { Dialog } from "src/ts/components/utils/Dialog";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { withRouter, RouteComponentProps } from "react-router";
import { UserLightbox } from "src/ts/components/elements/UserLightbox/UserLightbox";
import { UserLink } from "src/ts/components/elements/UserLink/UserLink";
import { AssociatedApplicationsLightbox } from "src/ts/components/elements/Product/AssociatedApplicationsLightbox";

export type ProductProps = {

    /**
     * Determines if current user is owner of the product
     */
    isOwnProduct: boolean;

    /**
     * Contains a reference to the users role, is either producer or receiver
     */
    userType: UserTypes;

    /**
     * Contains a reference to the product model that should be rendered
     */
    product: ProductModel;

    /**
     * Specifies whether or not we're currently on the producer who made the product's
     * page.
     */
    isOnProducersPage: boolean;

    /**
     * Contains a reference to the root store
     */
    store: Store;

    /**
     * Method that can optinally be executed once the prodcut updates in order
     * to reflect this in the ui
     */
    updateProduct?(newProduct: ProductModel): void;
} & RouteComponentProps;

export type ProductState = {
    /**
     * A boolean that tracks whether the product is expanded, and should
     */
    expanded: boolean;

    /**
     * Specifies whether or not the product image should be displayed within a
     * lightbox in full size
     */
    showImage: boolean;

    /**
     * Specifies whether or not the producer profile should currently be displayed
     * in a lightbox
     */
    showProducer: boolean;

    /**
     * Specifies whether or not the confirmation dialog should be displayed
     */
    showDialog: boolean;

    /**
     * Specifies whether or not the confirmation alert should be displayed
     */
    showAlert: boolean;

    /**
     * Specifies whether the product should be rendered to be compatible with
     * smaller viewports
     */
    isSmall: boolean;

    /**
     * Specifies whether or not we're currently attempting to update a product
     */
    isPending?: boolean;

    /**
     * Specifies the loaded producer of the product (if any). Will first be
     * loaded if the user wishes to see information about the producer
     */
    producer?: ProducerModel;

    /**
     * Specifies if we should currently be displaying the pending applications
     * associated with the product
     */
    showPendingApplications?: boolean;

    /**
     * Specifies if we should currently be displaying the open applications
     * associated with the product
     */
    showOpenApplications?: boolean;

    /**
     * Specifies if we should currently be displaying the completed applications
     * associated with the product
     */
    showCompletedApplications?: boolean;
};

const EXPAND_COLLAPSE_TRANSITION_DURATION = 375;
const MOBILE_BREAKPOINT = 440;

/**
 * Product template to contain information about a single product
 */
class UnwrappedProduct extends React.PureComponent<ProductProps, ProductState> {
    /**
     * State of the component
     */
    public state: ProductState = {
        expanded: false,
        isSmall: false,
        showImage: false,
        showProducer: false,
        showDialog: false,
        showAlert: false,
        isPending: false,
    };

    /**
     * Specfies whether we're currently running the expand/collapse transition
     */
    private isTransitioning: boolean = false;

    /**
     * Reference to the div tag with class name description
     */
    private readonly descriptionRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Reference to the div tag with class name product-border
     */
    private readonly borderRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Will contain a reference to the see-more, so that we can make
     * the dropdown point towards it properly.
     */
    protected readonly wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Determine the breakpoint we're currently in as soon as the component mounts,
     * and prepare for
     */
    public componentDidMount(): void {
        this.determineBreakpoint();

        window.addEventListener("resize", this.determineBreakpoint);
        window.addEventListener("orientationchange", this.determineBreakpoint);
    }

    /**
     * Ensure component is reset in case a new application is rendered in its
     * place
     */
    public componentDidUpdate(prevProps: ProductProps): void {
        if (this.props.product.id !== prevProps.product.id) {
            if (this.state.expanded) {
                this.setState({ expanded: false });

                const desc = this.descriptionRef.current;

                // If our ref isn't available or if we're currently transitioning, then
                // bail out
                if (!desc || this.isTransitioning) {
                    return;
                }

                desc.style.height = "0px";
            }
        }
    }

    /**
     * Cleanup on unmount
     */
    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.determineBreakpoint);
        window.removeEventListener("orientationchange", this.determineBreakpoint);
    }

    /**
     *   Product
     */
    public render(): JSX.Element {

        return (
            <React.Fragment>
                <div className={`product-border ${!this.props.product.isActive ? "isInactive" : ""}`} ref={this.borderRef}>
                    {this.renderProduct()}
                    {this.renderDescription()}
                </div>

                {this.renderProducerLightbox()}
                {this.renderImageLightbox()}
                {this.renderConfirmDialog()}

                <style jsx>{`

                    /** Draws a border around the product */
                    .product-border {
                        /** Allow usage of position: absolute within */
                        position: relative;

                        /** Setup dimensions of product */
                        margin-bottom: 10px;

                        /** Setup internal dimensions */
                        padding: 10px;
                        box-sizing: border-box;
                        width: 100%;

                        /** Render a faded border around the product */
                        border: 1px solid rgba(139,72,156, 0.15);
                        border-radius: 2px;

                        /** Setup fonts within */
                        color: ${ colors.black};

                        /** Prepare transitions */
                        transition: transform 0.1s linear, border-color 0.1s linear, box-shadow 0.1s linear;

                        /**
                         * The before pseudo element acts as a slightly darkened
                         * bg color that should be applied on hover via a custom
                         * transition
                         */
                        &::before {
                            content: "";

                            /** Position inside product, slightly shrunk inwards */
                            position: absolute;
                            left: 50%;
                            right: 50%;
                            bottom: 0;
                            top: 0;

                            /** Render desired hover bg color */
                            background-color: rgba(219,208,239, 0.15);

                            /** Hidden by default */
                            opacity: 0;
                            z-index: 0;

                            /** Prepare transitions */
                            transition:
                                opacity 0.1s linear,
                                left 0.1s ${ easings.inOutQuad},
                                right 0.1s ${easings.inOutQuad};
                        }

                        /** Setup hover styling */
                        &:hover {
                            box-shadow: 0 0 5px rgba(139,72,156, 0.15);
                            border-color: ${ colors.secondary};
                        }

                        /** On hover, slightly alter bg color via before element */
                        &:hover::before {
                            opacity: 1;
                            left: 0;
                            right: 0;
                        }

                        /*
                         * Apply a slightly different bg-color for even and odd
                         * products in list
                         */
                        &:nth-child(even) {
                            background: rgba(219,208,239, 0.1);
                        }

                        &:nth-child(odd) {
                            background: rgba(139,72,156, 0.06);
                        }

                        /** Hover effect when inactive should be removed */
                        &.isInactive {
                            opacity: 0.5;
                            background: rgba(167,167,167, 0.06);

                            &::before {
                                content: none;
                            }

                            &:hover {
                                box-shadow: none;
                                border: 1px solid rgba(139,72,156, 0.15);
                            }
                        }
                    }
				`}</style>
            </React.Fragment>
        );
    }

    /**
     * Renders the primary information of the product when collapsed
     */
    private renderProduct() {
        return (
            <div className={`product ${this.state.isSmall ? "isSmall" : ""}`}>
                <div className="sections">
                    {this.renderThumbnailSection()}
                    {this.renderContentSection()}

                </div>

                {this.props.userType === UserTypes.PRODUCER &&
                    this.renderProductEdit()}
                {(this.props.userType === UserTypes.RECEIVER && this.props.product.isActive) &&
                    this.renderApplyButton()}

                {this.renderAssociatedApplicationsStatusTeaser()}
                {this.renderDescriptionTeaser()}

                {this.renderChevron()}

                <style jsx>{`

                    /** The product itself  */
                    .product {
                        position: relative;
                        overflow: hidden;
                        width: 100%;

                        &.isSmall {
                            padding-bottom: 20px;
                        }
                    }

                    /** Contans different sections to manage placement with flexbox */
                    .sections {
                        /** Display sections alongside each other */
                        margin: 5px;
                        display: flex;
                        flex-direction: row;

                        /** Position on top of hover pseudo element */
                        position: relative;
                        z-index: 2;
                    }
                `}</style>

            </div>
        );
    }

    /**
     * Internal renderer that renders the user section of the product template
     */
    private renderThumbnailSection = () => {
        const { product } = this.props;

        return (
            <section className="section-thumbnail">
                <div className="thumbnail">
                    <Thumbnail src={this.props.product.thumbnail} callback={this.openImageLightbox} />
                </div>
                {product.location && <img
                    className="flag"
                    title={product.location}
                    src={`${process.env.PUBLIC_URL}/flags/${product.countryCode.toLowerCase()}.svg`}
                    alt={product.location}
                />}
                <style jsx>{`

                    /** Thumbnail img in the .section-thumbnail */
                    .thumbnail {
                        height: 70px;
                        width: 70px;
                        margin-right: 25px;
                    }

                    /** Flag showing the users country */
                    .flag {
                        position: absolute;
                        height: 20px;
                        width: 30px;

                        /** Positioning it on the top-right of the thumbnail */
                        top: -5px;
                        left: 55px;
                    }

                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that'll render the content section of the product
     */
    private renderContentSection = () => {
        const { product, userType, isOwnProduct } = this.props;

        return (
            <section className="section-content">
                <div className="product-wrapper">

                    <span
                        className={`product ${this.state.isSmall ? "isSmall" : ""}
                                            ${userType === UserTypes.RECEIVER ? "isReceiver" : ""}`}
                        title={product.title}
                    >
                        {product.title}
                    </span>

                    {
                        this.props.userType === UserTypes.PRODUCER &&
                        <span
                            className={`price ${this.state.isSmall ? "isSmall" : ""}
                                                ${isOwnProduct ? "isOwnProduct" : ""}`}
                        >
                            ${product.price}
                        </span>
                    }
                </div>

                <style jsx>{`
                    .section-content {
                        /* Allow the content section to fill as much as possible */
                        flex-grow: 1;
                        overflow: hidden;
                    }

                    /**
                    *   Consist of product title, hidden when text overflows
                    *   the limits set by max-width
                    */
                    .product {
                        /** Setup font */
                        font-size: 18px;
                        line-height: 1.3em;

                        /**
                         * Force product to be at max two lines
                         */
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        max-width: calc(100% - 150px);

                        /** When mobile size, force product text to one line */
                        &.isSmall {
                            max-width: 100%;

                            /**
                             * If user is a receiver, there should be a button
                             * below the product content, therefore, restrict
                             * content to be at only 1 line
                             */
                            &.isReceiver {
                                -webkit-line-clamp: 1;
                            }
                        }

                        /**
                         * Enforce maximum dimensions to keep the product
                         * away from other content such as buttons
                         */
                        overflow: hidden;
                        max-height: calc(18px * 2 * 1.3 + 0.25em);
                    }

                    /** Positions the product title and price horizontally */
                    .product-wrapper {
                        color: rgba(57,57,57, 0.9);

                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }

                    /** Displays the price of the product */
                    .price {
                        font-size: 1.3em;
                        margin-left: 10px;

                        /**
                         * Owner of product will see edit buttons, therefore
                         * position price a bit to the right
                         */
                        &.isOwnProduct {
                            margin-right: 37px;
                        }
                    }
                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that renders teaser information for associated
     * applications
     */
    private renderAssociatedApplicationsStatusTeaser() {
        const { product } = this.props;

        // If it is producers own product and is on own profile page, then show
        // open and pending products
        if (!this.props.isOwnProduct || !this.props.isOnProducersPage) {
            return;
        }
        
        return (
            <div
                className={`open-pending-section ${this.state.isSmall ? "isSmall" : ""}`}
                style={{
                    opacity: this.state.expanded ? 0 : 0.6,
                    userSelect: this.state.expanded ? "none" : "text",
                }}>
                    
                <span
                    role="button"
                    className={`open ${!!product.openApplications.length ? "active" : "inactive"}`}
                    onClick={this.showOpenApplicationsLightbox}
                >
                    <span className="amount">{product.openApplications.length}</span> open
                </span>
                <span
                    role="button"
                    className={`pending ${!!product.pendingApplications.length ? "active" : "inactive"}`}
                    onClick={this.showPendingApplicationsLightbox}
                >
                    <span className="amount">{product.pendingApplications.length}</span> pending
                </span>
                <span
                    role="button"
                    className={`completed ${!!product.completedApplications.length ? "active" : "inactive"}`}
                    onClick={this.showCompletedApplicationsLightbox}
                >
                    <span className="amount">{product.completedApplications.length}</span> completed
                </span>

                <AssociatedApplicationsLightbox
                    displayOpenApplications={this.state.showOpenApplications}
                    displayPendingApplications={this.state.showPendingApplications}
                    displayCompletedApplications={this.state.showCompletedApplications}
                    product={product}
                    onClose={this.closeAssociatedApplicationsLightbox}
                />

                <style jsx>{`

                    .open-pending-section {
                         /** Setup font */
                         font-size: 12px;

                        /** Prepare transitions */
                        transition: opacity 0.15s linear;

                        display: flex;
                        flex-direction: row;

                        margin-top: 5px;
                    }
   

                    .open-pending-section > span {
                        padding: 0 5px;
                        border: 1px solid transparent;
                        transition: border-color 0.1s linear;

                        &.active {
                            cursor: pointer;
                        }
                    }

                    .open-pending-section .open {
                        border-right: 1px solid ${ colors.pale};
                        border-radius: 2px 0 0 2px;

                        & .amount {
                            color: ${ colors.green};
                        }

                        &.active:hover {
                            background-color: rgba(219,208,239, 0.6);
                        }
                    }

                    .open-pending-section .pending {
                        border-right: 1px solid ${ colors.pale};
                        border-radius: 2px 0 0 2px;

                        & .amount {
                            color: ${ colors.yellow};
                        }

                        &.active:hover {
                            background-color: rgba(219,208,239, 0.6);
                        }
                    }

                    .open-pending-section .completed {
                        border-radius: 0 2px 2px 0;

                        & .amount {
                            color: ${ colors.tulip};
                        }

                        &.active:hover {
                            background-color: rgba(219,208,239, 0.6);
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the description teaser section of the
     * product
     */
    private renderDescriptionTeaser = () => {
        if (this.props.isOwnProduct && this.props.isOnProducersPage) {
            return;
        }

        const { product } = this.props;

        return (
            <span
                className={`description__teaser ${this.state.isSmall ? "isSmall" : ""}`}
                style={{
                    opacity: this.state.expanded ? 0 : 0.6,
                    userSelect: this.state.expanded ? "none" : "text",
                }}
            >
                {product.description}

                <style jsx>{`
                    .description__teaser {
                        /** Position the teaser on the bottom of the content section */
                        position: absolute;
                        bottom: 0;
                        margin-left: 100px;

                        /** Force description to remain on one line and crop on overflow */
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        max-width: calc(100% - 160px);

                        /** Setup font */
                        font-size: 12px;

                        /** Prepare transitions */
                        transition: opacity 0.15s linear;

                        /**
                        *   When mobile size, description teaser is positioned
                        *   at the bottom
                        */
                        &.isSmall {
                            max-width: calc(100% - 60px);
                            left: 5px;
                            margin: 0;
                        }
                    }
                `}</style>
            </span>
        );
    }

    /**
     * Internal renderer that renders product statistics
     */
    private renderStats = () => {
        const { product } = this.props;
        return (
            <div className="stats">
                <p><span className="semibold">{ProductJSON.lastTime}</span> {product.dateLastDonation ? product.dateLastDonation : "No donations yet"}</p>
                

                <p><span className="semibold">{ProductJSON.completedStats}</span></p>
                <ul>
                    <li>{ProductJSON.pastWeek} {product.completedDonationsPastWeek}</li>
                    <li>{ProductJSON.pastMonth} {product.completedDonationsPastMonth}</li>
                    <li>{ProductJSON.allTime} {product.completedDonationsAllTime}</li>
                </ul>
 
                <p><span className="semibold">{ProductJSON.pendingStats}</span></p>
                <ul>
                    <li>{ProductJSON.pastWeek} {product.pendingDonationsPastWeek}</li>
                    <li>{ProductJSON.pastMonth} {product.pendingDonationsPastMonth}</li>
                    <li>{ProductJSON.allTime} {product.pendingDonationsAllTime}</li>
                </ul>


                <style jsx>{`
                    p {
                        text-align: left;
                        margin: 4px 0 0 0;
                    }

                    ul {
                        font-weight: 300;
                        margin: 0;
                    }

                    .stats {
                        margin-bottom: 14px;
                    }

                    .semibold {
                        font-weight: 500; 
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the description section of the product
     */
    private renderDescription = () => {
        const { product } = this.props;

        const shouldRenderRank = this.props.isOwnProduct && !!product.rank;

        return (
            <div className="description" ref={this.descriptionRef}>
                <div className={`description-content ${!product.isActive ? "isInactive" : ""}`}>
                    <h3>{ProductJSON.product}</h3>
                    <div className="description-product">
                        <p>{product.title}</p>
                        <p className="price">(${product.price})</p>
                    </div>

                    <h3>{ProductJSON.stats}</h3>
                    {this.renderStats()}

                    <h3>{ProductJSON.desc}</h3>
                    <p className="multipleLines">
                        {product.description}
                    </p>

                    {this.renderAssociatedApplicationsStatus()}
                    {shouldRenderRank && <h3>Rank: {product.rank}</h3>}
                    {this.renderProducerLink()}
                </div>

                <style jsx>{`
                    /** Shown when the collapsible is expanded */
                    .description {
                        /** Prepare expand-collapse functionality */
                        height: 0;
                        overflow: hidden;

                        /** Position on top of before element */
                        position: relative;
                        z-index: 10;

                        /** Setup font */
                        font-size: 14px;
                        line-height: 1.5em;
                    }

                    h3 {
                        margin: 0;
                        text-align: left;

                        &:first-of-type {
                            margin-top: 10px;
                        }
                    }

                    p {
                        text-align: left;
                        margin: 4px 0 14px;
                    }

                    /** Preserve new lines in product description */
                    .multipleLines {
                        white-space: pre-wrap;
                    }

                    /** Placement styling of description content */
                    .description-content {
                        margin: 7px;
                        border-top: 1px solid ${colors.secondary};

                        /** When inactive, we want no definitive colors */
                        &.isInactive {
                            border-top: 1px solid ${colors.gray};
                        }
                    }

                    .description-product {
                        display: flex;
                        flex-direction: row;
                    }

                    .description-product .price {
                        margin-left: 7px;
                        font-style: italic;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders teaser information for associated
     * applications
     */
    private renderAssociatedApplicationsStatus() {
        const { product } = this.props;

        // If it is producers own product and is on own profile page, then show
        // open and pending products
        if (!this.props.isOwnProduct || !this.props.isOnProducersPage) {
            return;
        }

        return (
            <div className="associated-applications-section">
                <h3>Associated applications</h3>

                <div className="open-pending-buttons">
                    <span
                        role="button"
                        className={`open ${!!product.openApplications.length ? "active" : "inactive"}`}
                        onClick={this.showOpenApplicationsLightbox}
                    >
                        <span className="amount">{product.openApplications.length}</span> open
                    </span>
                    <span
                        role="button"
                        className={`pending ${!!product.pendingApplications.length ? "active" : "inactive"}`}
                        onClick={this.showPendingApplicationsLightbox}
                    >
                        <span className="amount">{product.pendingApplications.length}</span> pending
                    </span>
                    <span
                        role="button"
                        className={`completed ${!!product.completedApplications.length ? "active" : "inactive"}`}
                        onClick={this.showCompletedApplicationsLightbox}
                    >
                        <span className="amount">{product.completedApplications.length}</span> completed
                    </span>
                </div>

                <AssociatedApplicationsLightbox
                    displayOpenApplications={this.state.showOpenApplications}
                    displayPendingApplications={this.state.showPendingApplications}
                    displayCompletedApplications={this.state.showCompletedApplications}
                    product={product}
                    onClose={this.closeAssociatedApplicationsLightbox}
                />

                <style jsx>{`
                    .associated-applications-section {
                        margin-bottom: 10px;
                    }

                    .open-pending-buttons {
                        display: flex;
                        flex-direction: row;

                        font-family: ${ fonts.text};
                        font-weight: 300;

                        margin-top: 5px;
                    }

                    .open-pending-buttons > span {
                        padding: 0 5px;
                        border: 1px solid transparent;
                        transition: border-color 0.1s linear;

                        &.active {
                            cursor: pointer;
                        }
                    }

                    .open-pending-buttons .open {
                        border-right: 1px solid ${ colors.pale};
                        border-radius: 2px 0 0 2px;

                        & .amount {
                            color: ${ colors.green};
                        }

                        &.active:hover {
                            background-color: rgba(219,208,239, 0.6);
                        }
                    }

                    .open-pending-buttons .pending {
                        border-right: 1px solid ${ colors.pale};
                        border-radius: 2px 0 0 2px;

                        & .amount {
                            color: ${ colors.yellow};
                        }

                        &.active:hover {
                            background-color: rgba(219,208,239, 0.6);
                        }
                    }

                    .open-pending-buttons .completed {
                        border-radius: 0 2px 2px 0;

                        & .amount {
                            color: ${ colors.tulip};
                        }

                        &.active:hover {
                            background-color: rgba(219,208,239, 0.6);
                        }
                    }

                    h3 {
                        margin: 0;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Method to be triggered once a lightbox displaying all pending applicaitons
     * should be displayed
     */
    private showOpenApplicationsLightbox = () => {
        if (!this.props.product.openApplications.length) {
            return;
        }

        this.setState({ showOpenApplications: true });
    }

    /**
     * Method to be triggered once a lightbox displaying all pending applicaitons
     * should be displayed
     */
    private showPendingApplicationsLightbox = () => {
        if (!this.props.product.pendingApplications.length) {
            return;
        }

        this.setState({ showPendingApplications: true });
    }

    /**
     * Method to be triggered once a lightbox displaying all completed applicaitons
     * should be displayed
     */
    private showCompletedApplicationsLightbox = () => {
        if (!this.props.product.completedApplications.length) {
            return;
        }

        this.setState({ showCompletedApplications: true });
    }

    /**
     * Callback to be triggered once the associated applications lightbox should
     * be closed
     */
    private closeAssociatedApplicationsLightbox = () => {
        this.setState({ showOpenApplications: false, showPendingApplications: false, showCompletedApplications: false });
    }

    /**
     * Render button link to producer profile info
     */
    private renderProducerLink() {
        if (this.props.isOnProducersPage) {
            return;
        }

        return (
            <UserLink
                onClick={this.openProducerLightbox}
                text={"Producer profile"} />
        );
    }

    /**
     * Internal renderer that renders the chevron of the product
     */
    private renderChevron = () => {
        return (
            <i className={`chevron-wrapper ${this.state.isSmall ? "isSmall" : ""}`} onClick={this.toggleCollapsible} role="button">
                <Chevron size={this.state.isSmall ? 15 : 20} lineWidthRatio={0.5} inversed={this.state.expanded} vertical={true} />

                <style jsx>{`
                    /** The wrapper around the chevron arrow */
                    .chevron-wrapper {
                        /** Position chevron properly */
                        position: absolute;

                        /** Placing the chevron so it lines up with the other elements */
                        bottom: 0;
                        right: 8px;

                        /** Specify dimensions of chevron within */
                        display: block;
                        width: 30px;
                        height: 20px;

                        /** Setup color */
                        color: rgba(57,57,57, 0.75);

                        /** Indicate that chevron is clickable */
                        cursor: pointer;

                        /** Position on top of other content */
                        z-index: 10;

                        /** When mobile size, make chevron smaller */
                        &.isSmall {
                            height: 15px;
                            width: 21px;

                            /** Position Chevron a bit higher when mobile size */
                            bottom: 3px;
                        }

                        &:hover {
                            color: ${ colors.secondary};
                        }
                    }
                `}</style>
            </i>
        );
    }

    /**
     * Internal renderer that renders the apply button of the product
     */
    private renderApplyButton = () => {
        return (
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <Button withThrobber={false} text={"Apply"} width={110} height={35} fontSize={12} onClick={this.openCreateApplication} />

                <style jsx>{`
                    .button-wrapper {
                        /** Position the apply button in the top right corner */
                        position: absolute;
                        right: 5px;
                        top: 0;
                        z-index: 10;

                        /** When mobile size, position button in the middle */
                        &.isSmall {
                            left: 105px;
                            top: 35px;
                            right: unset;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Dialog to confirm whether producer would active or deactivate product
     */
    private renderConfirmDialog() {
        const titleAction = this.props.product.isActive ? "deactivation" : "activation";
        const action = this.props.product.isActive ? "deactivate" : "activate";
        const openWarning = (
            <>
                <br /><br />
                <b>
                    {this.props.product.openApplications.length} open application
                    {this.props.product.openApplications.length === 1 ? "" : "s"}
                </b> will be closed due to this action.
            </>
        );
        const pendingWarning = (
            <>
                <br /><br />
                <b>
                    {this.props.product.pendingApplications.length} pending application
                    {this.props.product.pendingApplications.length === 1 ? "" : "s"}
                </b> will remain after the product has been made inactive.
            </>
        );
        const text = <>
            Are you sure you want to {action} this product?
            {this.props.product.isActive && this.props.product.pendingApplications.length > 0 && pendingWarning}
            {this.props.product.isActive && this.props.product.openApplications.length > 0 && openWarning}
        </>

        return (
            <Dialog title={`Confirm ${titleAction}`}
                text={text}
                active={this.state.showDialog}
                onClose={this.closeConfirmationDialog}
                confirmAction={this.updateProductActivation}
            />
        );
    }

    /**
     * Updates the store and goes to createApplication page
     */
    private openCreateApplication = () => {
        this.props.store.product = this.props.product;
        this.props.history.push(routes.CreateApplication.path);
    }

    /**
     * Internal renderer that renders the edit functionality of the product
     */
    private renderProductEdit = () => {
        const { product, isOwnProduct, userType } = this.props;

        if (!isOwnProduct || userType === UserTypes.RECEIVER) {
            return;
        }

        return (
            <div className={`product-more ${this.state.isSmall ? "isSmall" : ""}`}>

                <div className="edit-button-section">
                    {
                        product.isActive &&
                        <button onClick={this.openConfirmationDialog} className="status-button" title="Deactivate">
                            <i className="status">{getSVG("check-square")}</i>
                        </button>
                    }
                    {
                        !product.isActive &&
                        <button onClick={this.openConfirmationDialog} className="status-button"><i className="status" title="Activate">{getSVG("square")}</i></button>
                    }
                </div>

                <style jsx>{`

                    /** Align icon buttons horizontially */
                    .edit-button-section {
                        display: flex;
                        flex-direction: row;
                    }

                    /**
                     * Button should not be visible and act as a wrapper for
                     * the icon
                     */
                    .edit-button-section button {
                        background-color: transparent;
                        border: none;
                        font-style: bold;
                        font-family: ${ fonts.text};
                        padding: 2px 5px;
                        cursor: pointer;
                        color: rgba(57,57,57, 0.75);

                        /** Create a pale line between the icons to seperate them */
                        border-left: 1px solid ${ colors.pale};
                    }

                    /** Make icon slightly smaller to fit better */
                    .edit-button-section i {
                        transform: scale(0.75);
                    }

                    /** Indicate it is clickable */
                    .edit-button-section button:hover {
                        color: ${ colors.secondary};
                    }

                    /** Position the icons */
                    .product-more {
                        position: absolute;
                        right: 0;
                        top: 0;

                        z-index: 12;
                    }

                    /** Default for all icons */
                    .product-more i {
                        /** React as expected */
                        display: block;

                        /** Icon size */
                        height: 24px;
                        width: 24px;
                    }

                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that'll render the producer lightbox which will be displayed
     * when desired
     */
    private renderProducerLightbox = () => {
        if (!this.state.producer) {
            return;
        }

        return (
            <UserLightbox
                showLightbox={this.state.showProducer}
                onClose={this.closeProducerLightbox}
                user={this.state.producer}
                isOwn={this.props.isOwnProduct}
                isOnProfile={this.props.isOnProducersPage}
                userId={this.props.product.producerId}
                userType={"producer"} />
        );
    }

    /**
     * Listener that'll open the producer lightbox once it has been executed
     */
    private openProducerLightbox = async () => {
        if (!this.state.producer) {
            const producerId = this.props.product.producerId;
            const producer = await fetchUser(String(producerId), this.props.store) as ProducerModel;

            // Only display producer if one exists with the given id
            if (producer) {
                this.setState({ producer, showProducer: true });
            } else {
                this.props.store.currentErrorMessage = "Failed to fetch producer related to product. Please try again later."
            }
        } else {
            this.setState({ showProducer: true });
        }
    }

    /**
     * Method that'll close the producer dropdown once it has been executed
     */
    private closeProducerLightbox = () => {
        this.setState({ showProducer: false });
    }

    /**
     * Internal renderer that'll render the image lightbox which will display
     * the product image in fullscreen.
     */
    private renderImageLightbox = () => {
        return (
            <Lightbox active={this.state.showImage} onClose={this.closeImageLightbox}>
                <img src={this.props.product.thumbnail} alt="" role="presentation" />

                <style jsx>{`
                    img {
                        /** Remove unwanted margin below image */
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
            </Lightbox>
        );
    }

    /**
     * Listener that'll open the image lightbox once it has been executed
     */
    private openImageLightbox = () => {
        this.setState({ showImage: true });
    }

    /**
     * Mehtod that'll close the image dropdown once it has been executed
     */
    private closeImageLightbox = () => {
        this.setState({ showImage: false });
    }

    /**
     * Listener that'll open the confirmation dialog once it has been executed
     */
    private openConfirmationDialog = () => {
        this.setState({ showDialog: true });
    }

    /**
     * Listener that'll close the dialog once it has been executed
     */
    private closeConfirmationDialog = () => {
        this.setState({ showDialog: false });
    }

    /**
     * Listener that updates the product
     */
    private updateProductActivation = async () => {
        if (this.state.isPending || !this.props.store.user) {
            return;
        }

        // Notify state that we've begun updating our product
        this.setState({ isPending: true });

        await toggleProductAvailability(this.props.product, this.props.store, this.props.updateProduct);
        this.setState({ showDialog: false, isPending: false });
    }

    /**
     * Method that'll trigger the transition to expand/collapse the description
     * of the product
     */
    private toggleCollapsible = () => {
        const desc = this.descriptionRef.current;

        // If our ref isn't available or if we're currently transitioning, then
        // bail out
        if (!desc || this.isTransitioning) {
            return;
        }

        // Initialize the transition!
        this.setState({ expanded: !this.state.expanded });
        this.isTransitioning = true;

        // Start by locking the height of the content wrapper to the full
        // height of the content
        desc.style.height = `${desc.scrollHeight}px`;
        desc.style.transition = `height ${EXPAND_COLLAPSE_TRANSITION_DURATION}ms ${easings.inOutQuart}`;

        // Force a reflow before we're going to manage the transition
        desc.offsetHeight; // tslint:disable-line no-unused-expression

        if (this.state.expanded) {
            // If we're collapsing, then run transition after back to 0px
            // height
            desc.style.height = "0px";
        } else {
            // ... Otherwise reset height to "auto" once the transition has
            // ended to allow responsively adjusting to size changes
            setTimeout(() => {
                desc.style.height = "auto";
            }, EXPAND_COLLAPSE_TRANSITION_DURATION);
        }

        // Once the transition is complety, specify that we're ready for a new transition
        setTimeout(() => {
            this.isTransitioning = false;
            desc.style.transition = "";
        }, EXPAND_COLLAPSE_TRANSITION_DURATION);
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
}

export const Product = withRouter(injectStore((store) => ({ store }), UnwrappedProduct));
