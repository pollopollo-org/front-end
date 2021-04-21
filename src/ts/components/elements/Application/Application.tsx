import React from "react";
import ApplicationJSON from "src/assets/data/application.json"

import { colors } from "src/ts/config/colors";
import { ApplicationModel, ApplicationStatus, deleteApplication, initiateDonation, confirmReceival, updateStatus, fetchApplicationById, withdrawBytes } from "src/ts/models/ApplicationModel";

import { easings } from "src/ts/config/easings";
import { Button, Chevron } from "src/ts/components/utils";
import { UserTypes, fetchUser } from "src/ts/models/UserModel";
import { getSVG } from "src/assets/svg";
import { Dialog } from "src/ts/components/utils/Dialog";
import { fonts, routes } from "src/ts/config";
import { ReceiverModel } from "src/ts/models/ReceiverModel";
import { Store } from "src/ts/store/Store";
import { injectStore } from "src/ts/store/injectStore";
import { UserLightbox } from "src/ts/components/elements/UserLightbox/UserLightbox";
import { ProducerModel } from "src/ts/models/ProducerModel";
import { UserLink } from "src/ts/components/elements/UserLink/UserLink";
import { Thumbnail } from "src/ts/components/utils/Thumbnail";
import { ProductModel, fetchProductById } from "src/ts/models/ProductModel";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { Product } from "src/ts/components/elements/Product/Product";
import { Link } from "react-router-dom";

export type ApplicationProps = {
    /**
     * Determines if current user is owner of the application
     */
    isOwnApplication: boolean;
    /**
     * Contains a reference to the users role, is either producer, receiver or null
     */
    userType: UserTypes;
    /**
     * Specifies whether or not we are currently on the receiver who made the application's
     * profile page.
     */
    isOnReceiversPage: boolean;

    /**
     * Specifies if the currently rendered application is already associated with
     * a product (and hence a producer), which means we should only render a
     * subset of the normal functionality
     */
    isAssociatedApplication?: boolean;

    /**
     * Contains a reference to the applicaiton model that should be rendered
     */
    application: ApplicationModel;

    /**
     * Contains a reference to the root store
     */
    store: Store;

    /**
     * Whether the application should be displayed as a past donation for the receiver
     */
    pastDonation: boolean;

    /**
     * Whether to show the widthdraw button
     */
    showWithdrawButton?: boolean;

    /**
     * Optional callback to execute once an application gets deleted
     */
    onApplicationDeleted?(): void;

    /**
     * Optional callback to execute once bytes get withdrawn from application
     */
    onWithdrawBytes?(): void;

    /**
     * Optional callback to execute once an application is locked
     */
    onApplicationDonation?(): void;

    /**
     * Method that can optinally be executed once the application updates in order
     * to reflect this in the ui
     */
    confirmApplication?(newApplication: ApplicationModel): void;
}

export type ApplicationState = {
    /**
     * A boolean that tracks whether the application is expanded, and should
     */
    expanded: boolean;

    /**
     * Specifies whether the application should be rendered to be compatible with
     * smaller viewports
     */
    isSmall: boolean;
    /**
     * Specifies whether or not the receiver's profile should currently be
     * displayed in a lightbox
     */
    showReceiver: boolean;
    /**
     * Specifies whether or not the producer's profile should currently be
     * displayed in a lightbox
     */
    showProducer: boolean;
    /**
     * Specifies whether or not we're currently attempting to update an application
     */
    isPending?: boolean;
    /**
     * Specifies whether or not the confirmation dialog for deleting the should be displayed
     */
    showDialogDelete: boolean;
    /**
     * Specifies whether or not the confirmation dialog for donating to the application should be displayed
     */
    showDialogDonate: boolean;

    showObyteDonation: boolean;

    showPollopolloDonation: boolean;
    /**
     * Specifies whether or not the withdraw bytes dialog should be displayed
     */
     showDialogDonationChoice: boolean;
     /**
      * Specifies whether or not the withdraw bytes dialog should be displayed
      */
    showDialogWithdraw: boolean;
    /**
     * Specifies whether or not the locked dialog for donating to the application should be displayed
     */
    showDialogLockedDonate: boolean;
    /**
     * Specifies whether or not we should display a lightbox displaying the product
     * related to the application
     */
    showProduct: boolean;
    /**
     * Specifies the loaded receiver of the application (if any). Will first be
     * loaded if the user wishes to see information about the receiver
     */
    receiver?: ReceiverModel;
    /**
     * Specifies the loaded receiver of the application (if any). Will first be
     * loaded if the user wishes to see information about the receiver
     */
    producer?: ProducerModel;
    /**
     * Contains the product related to the application (if any). Will first be
     * loaded if the user wishes to see information about the product
     */
    product?: ProductModel;
    /**

     * Specifies whether or not the alert should be displayed
     * Used for telling the user that is is not yet possible
     * to confirm receival of a product
     */
    showDialogConfirmReceival: boolean;
};

const EXPAND_COLLAPSE_TRANSITION_DURATION = 375;
const MOBILE_BREAKPOINT = 440;

/**
 * Application template to contain information about the donation
 * of a single application
 */
class UnwrappedApplication extends React.PureComponent<ApplicationProps, ApplicationState> {
    /**
     * State of the component
     */
    public state: ApplicationState = {
        expanded: false,
        isSmall: false,
        showDialogDelete: false,
        showDialogDonate: false,
        showObyteDonation: false,
        showPollopolloDonation: false,
        showDialogDonationChoice: false,
        showDialogWithdraw: false,
        showDialogLockedDonate: false,
        showReceiver: false,
        showDialogConfirmReceival: false,
        showProducer: false,
        showProduct: false,
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
     * Reference to the div tag with class name application-border
     */
    private readonly borderRef: React.RefObject<HTMLDivElement> = React.createRef();

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
    public componentDidUpdate(prevProps: ApplicationProps): void {
        if (this.props.application.applicationId !== prevProps.application.applicationId) {
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
     * Main render method, used to render Application
     */
    // tslint:disable-next-line: max-func-body-length
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <div className={"application"}>
                {this.renderApplicationId()}
                <div className={`application-border ${(this.props.application.status === ApplicationStatus.UNAVAILABLE || this.props.application.status === ApplicationStatus.COMPLETED || this.props.application.status === ApplicationStatus.WITHDRAWN || this.props.pastDonation) && !this.props.showWithdrawButton ? "isClosed" : ""}`} ref={this.borderRef}>

                    <div className={`application ${this.state.isSmall ? "isSmall" : ""}`}>
                        <div className="sections">
                            {this.renderUserSection()}
                            {this.renderContentSection()}
                        </div>

                        
                        {this.renderCornerInformation()}
                        {(this.props.isOwnApplication && this.props.isOnReceiversPage) && this.renderInteractWithOwnSection()}
                    
                        {this.state.isSmall && (
                            this.renderMotivationTeaser()
                        )}

                        {this.renderChevron()}
                    </div>
                    {this.renderMotivation()}
                </div>
                {this.renderReceiverLightbox()}
                {this.renderProducerLightbox()}
                {this.renderProductLightbox()}
                {this.renderConfirmDialogDeleteApplication()}
                {this.renderConfirmDialogDonateObyte()}
                {this.renderConfirmDialogDonatePolloPollo()}
                {this.renderDonationChoice()}
                {this.renderLockedDialogDonateApplication()}
                {this.renderConfirmDialogWithdrawFunds()}
                {this.renderConfirmDialogReceival()}
                </div>

                <style jsx>{`
                    .application {
                        /** Setup dimensions of application */
                        margin: 10px 0;
                        padding: 0;
                    }
                    /** Draws a border around the application */
                    .application-border {
                        /** Allow usage of position: absolute within */
                        position: relative;

                        margin: 0;

                        /** Setup internal dimensions */
                        
                        box-sizing: border-box;

                        /** Render a faded border around the application */
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

                            /** Position inside application, slightly shrunk inwards */
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
                         * applications in list
                         */
                        &:nth-child(even) {
                            background: rgba(219,208,239, 0.1);
                        }

                        &:nth-child(odd) {
                            background: rgba(139,72,156, 0.06);
                        }

                        /** Hover effect when inactive should be removed */
                        &.isClosed {
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
                    /** The application itself  */
                    .application {
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
                        margin: 0 0 0 10px;
                        display: flex;
                        flex-direction: row;

                        /** Position on top of hover pseudo element */
                        position: relative;
                        z-index: 2;
					}

                    @media (max-width: 768px) {
                        .application-border {
                            /*margin: 10px;*/
                        }
                    }
				`}</style>
            </React.Fragment>
        );
    }

    /**
     * Internal renderer that renders the user section of the application template
     */
    private renderUserSection = () => {
        const { application } = this.props;

        return (
            <section className={`section-user
                                    ${ this.props.isOnReceiversPage
                    ? ""
                    : "thumbnail-clickable"
                }`
            }
                onClick={this.openReceiverLightbox}
            >
                <div className="thumbnail">
                    <Thumbnail src={this.props.application.getThumbnail()} roundedCorners />
                </div>
                <img
                    className="flag"
                    title={application.country}
                    src={`${process.env.PUBLIC_URL}/flags/${application.countryCode.toLowerCase()}.svg`}
                    alt={application.country}
                />
                <div className="name">{this.nameEstimator()}</div>

                <style jsx>{`
                    /** Placing the thumbnail and users name */
                    .section-user {
                        /** Display name and text on top of each other */
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;

                        /** Fixed size to align the the elements */
                        min-width: 75px;
                        flex-shrink: 0;

                        /** Margin between this and the next section */
                        margin-right: 20px;

                        &.thumbnail-clickable {
                            cursor: pointer;

                            /** Indicate that it is clickable */
                            &:hover {
                                text-decoration: underline;
                            }
                        }
                    }

                    /** Thumbnail img in the .section-user */
                    .thumbnail {
                        height: 60px;
                        width: 60px;

                        /** Margin between this and the name element */
                        margin-bottom: 4px;
                    }

                    /** Flag showing the users country */
                    .flag {
                        position: absolute;
                        height: 20px;
                        width: 30px;

                        /** Positioning it on the top-right of the thumbnail */
                        top: 0;
                        left: 50px;
                    }

                    /** The name placed under the thumbnail in the .section-user */
                    .name {
                        font-size: 12px;
                    }
                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that'll render the content section of the application
     */
    private renderContentSection = () => {
        const { application } = this.props;

        return (
            <section className="section-content">
                <span
                    className={`product ${this.state.isSmall ? "isSmall" : ""} ${this.props.isAssociatedApplication ? "disabled" : "enabled"} ${application.status == ApplicationStatus.COMPLETED || application.status == ApplicationStatus.PENDING ? "completed" : ""}`}
                    title={application.productTitle}
                    onClick={this.showProduct}
                    role="button"
                >
                    {application.productTitle}
                </span>
                {!this.state.isSmall && (
                    this.renderMotivationTeaser()
                )}

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

                        

                        &.enabled {
                            cursor: pointer;
                        }

                        &.enabled:hover {
                            text-decoration: underline;
                        }

                        

                        &.completed {
                            max-width: calc(100% - 200px);
                        }

                        /** When mobile size, force product text to one line */
                        &.isSmall {
                            -webkit-line-clamp: 1;
                            max-width: 100%;
                        }

                        /**
                         * Enforce maximum dimensions to keep the product
                         * away from other content such as buttons
                         */
                        overflow: hidden;
                        max-height: calc(18px * 2 * 1.3 + 0.25em);

                    }
                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that renders the motivation teaser section of the
     * application
     */
    private renderMotivationTeaser = () => {
        const { application } = this.props;

        return (
            <span
                className={`motivation__teaser ${this.state.isSmall ? "isSmall" : ""}`}
                style={{
                    opacity: this.state.expanded ? 0 : 0.6,
                    userSelect: this.state.expanded ? "none" : "text",
                }}
            >
                {application.motivation}

                <style jsx>{`
                    .motivation__teaser {
                        /** Position the teaser on the bottom of the content section */
                        position: absolute;
                        bottom: 0;

                        /** Force motivation to remain on one line and crop on overflow */
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        max-width: calc(100% - 160px);

                        /** Setup font */
                        font-size: 12px;

                        /** Prepare transitions */
                        transition: opacity 0.15s linear;

                        /**
                        *   When mobile size, motivation teaser is positioned
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
     * Internal renderer that renders the motivation section of the application
     */
    private renderMotivation = () => {
        const { application } = this.props;
        
        const pendingOrCompleted =  application.status === ApplicationStatus.PENDING || application.status === ApplicationStatus.COMPLETED;

        return (
            <div className="description" ref={this.descriptionRef}>
                <div className={`description-content ${(application.status === ApplicationStatus.UNAVAILABLE || application.status === ApplicationStatus.COMPLETED || application.status === ApplicationStatus.WITHDRAWN) && !this.props.showWithdrawButton ? "isClosed" : ""}`}>
                    <h3>{ApplicationJSON.requestedProductText}</h3>
                    <p>
                        {application.productTitle}
                        {pendingOrCompleted && <>
                            : <i>${application.productPrice}</i> - (<i>{application.bytes}</i> {"  "} Bytes, {ApplicationJSON.exchangeText}<i> ${application.bytesInCurrentDollars}</i>)
                        </> }                       
                    </p>
                    {pendingOrCompleted && <>
                            <h3>{ApplicationJSON.contractSharedAddressText}</h3>
                            <p><a href={`https://explorer.obyte.org/#${application.contractSharedAddress}`} target="_blank" rel="noreferrer">
                                {application.contractSharedAddress}
                            </a></p>
                        </> }  
                    <h3>Created</h3>
                    <p>
                        {application.creationDate}
                    </p>
                    <h3>Motivation</h3>
                    <p className="multipleLines">
                        {application.motivation}
                    </p>
                </div>
                {!this.props.showWithdrawButton && this.renderProducerLink()}

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

                        &:first-of-type {
                            margin-top: 10px;
                        }
                    }

                    p {
                        margin: 4px 0 14px;
                    }

                    span {
                        margin: 4px 0 14px;
                    }

                    /** Preserve new lines in motivation */
                    .multipleLines {
                        white-space: pre-wrap;
                    }

                    /** Placement styling */
                    .description-content {
                        margin: 10px;
                        border-top: 1px solid ${colors.secondary};

                        /** When inactive, we want no definitive colors */
                        &.isClosed {
                            border-top: 1px solid ${colors.gray};
                        }
                    }
                `}</style>
            </div>
        );
    }


    /**
     * Render button link to receiver profile info
     */
    private renderProducerLink() {
        if (this.props.isOnReceiversPage || this.props.isAssociatedApplication) {
            return;
        }

        return (
            <div className="link">
                <UserLink
                    onClick={this.openProducerLightbox}
                    text={"Producer profile"} />
                <style jsx>{`
                    /**
                     * Positioning the button so it is alligned with other
                     * content upon hovering
                     */
                    .link :global(.profile-link) {
                        margin-left: 8px;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the chevron of the application
     */
    private renderChevron = () => {
        const chevronSize = this.state.isSmall ? 15 : 20;

        return (
            <i className={`chevron-wrapper ${this.state.isSmall ? "isSmall" : ""}`} onClick={this.toggleCollapsible} role="button">
                <Chevron size={chevronSize} lineWidthRatio={0.5} inversed={this.state.expanded} vertical={true} />

                <style jsx>{`
                    /** The wrapper around the chevron arrow */
                    .chevron-wrapper {
                        /** Position chevron properly */
                        position: absolute;

                        /** Placing the chevron so it lines up with the other elements */
                        bottom: 5px;
                        right: 10px;

                        /** Specify dimensions of chevron within */
                        display: block;
                        width: 30px;
                        height: 20px;

                        /** Indicate that chevron is clickable */
                        cursor: pointer;

                        /** Position on top of other content */
                        z-index: 10;

                        /** When mobile size, make chevron smaller */
                        &.isSmall {
                            height: 15px;
                            width: 21px;
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
     * Render information or button in upper right corner of application
     */
    private renderCornerInformation = () => {
        if (this.props.pastDonation) return this.renderPriceAndDate();

        if (this.props.userType === UserTypes.DONOR || UserTypes.UNDEFINED) return this.renderDonateButton();
        if (this.props.userType === UserTypes.PRODUCER && this.props.showWithdrawButton)  return this.renderWithdrawButton();
        if (this.props.userType === UserTypes.PRODUCER || this.props.userType === UserTypes.RECEIVER) return this.renderPrice();
        
        return;
    }

    /**
     * Internal renderer that renders the id of the application
     */
    private renderApplicationId = () => {
        const { application } = this.props;
        return (
            <div className={`id-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <span>#{application.applicationId}</span>
                <style jsx>{`
                    span {
                        font-size: 10px;
                        color: ${colors.primary};
                    }
                    .id-wrapper {
                        /** Position the donate button in the top right corner */
                        position: absolute;
                        right: 10px;
                        top: 1px;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the donate button of the application
     */
    private renderDonateButton = () => {
        const { application } = this.props;

        return (
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <Button onClick={this.openConfirmationDialogDonate} withThrobber={false} text={`Donate $${application.productPrice}`} width={110} height={35} fontSize={12} />

                <style jsx>{`
                    .button-wrapper {
                        /** Position the price in the top right corner */
                        position: absolute;
                        right: 10px;
                        top: 5px;
                        z-index: 10;

                        /** When mobile size, position price in the middle */
                        &.isSmall {
                            left: 105px;
                            top: 40px;
                            right: unset;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the donate button of the application
     */
    private renderWithdrawButton = () => {
        //const { application } = this.props;

        return (
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <Button onClick={this.openConfirmationDialogWithdraw} withThrobber={false} text={`Withdraw bytes`} width={110} height={35} fontSize={12} />

                <style jsx>{`
                    .button-wrapper {
                        /** Position the price in the top right corner */
                        position: absolute;
                        right: 10px;
                        top: 5px;
                        z-index: 10;

                        /** When mobile size, position price in the middle */
                        &.isSmall {
                            left: 105px;
                            top: 40px;
                            right: unset;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the price of the product requested
     */
    private renderPrice = () => {
        const { application } = this.props;

        if (application.status === ApplicationStatus.PENDING) {
            return;
        }

        return (
            <div className={`price-wrapper
                                ${this.state.isSmall ? "isSmall" : ""}
                                ${this.props.isOwnApplication && this.props.isOnReceiversPage && application.status === ApplicationStatus.OPEN ? "isOwn" : ""}`}>
                <span>${application.productPrice}</span>

                <style jsx>{`
                    .price-wrapper {
                        /** Position the price in the top right corner */
                        position: absolute;
                        right: 10px;
                        top: 5px;
                        z-index: 10;

                        /** When mobile size, position price in the middle */
                        &.isSmall {
                            left: 105px;
                            top: 40px;
                            right: unset;
                        }

                        /** Move left if own application to make room for delete button */
                        &.isOwn {
                            right: 50px;
                            &.isSmall {
                                top: 40px;
                            }
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the price of the product requested
     */
    private renderPriceAndDate = () => {
        const { application } = this.props;

        if (application.status !== ApplicationStatus.PENDING && application.status !== ApplicationStatus.COMPLETED) {
            return;
        }

        return (
            <div className={`price-wrapper
                                ${this.state.isSmall ? "isSmall" : ""}`}>
                <span>Received ${application.productPrice} {application.dateOfDonation}</span>

                <style jsx>{`
                    .price-wrapper {
                        /** Position the price in the top right corner */
                        position: absolute;
                        right: 10px;
                        top: 5px;
                        z-index: 10;

                        /** When mobile size, position price in the middle */
                        &.isSmall {
                            left: 105px;
                            top: 40px;
                            right: unset;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the confirm button of the application
     */
    private renderInteractWithOwnSection = () => {
        const { application } = this.props;
        return (
            <div>
                {application.status === ApplicationStatus.PENDING && this.renderConfirmButton()}
                {application.status === ApplicationStatus.OPEN && this.renderDeleteButton()}
            </div>
        );
    }

    /**
     * Internal renderer that renders the price of the product requested
     */
    private renderDeleteButton = () => {
        const { isOwnApplication, userType } = this.props;

        if (!isOwnApplication || userType !== UserTypes.RECEIVER) {
            return;
        }

        return (
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <button onClick={this.openConfirmationDialogDelete} className="delete-button" title="Delete">
                    <i>{getSVG("delete")}</i>
                </button>

                <style jsx>{`
                    .button-wrapper {
                        /** Position the price in the top right corner */
                        position: absolute;
                        right: 5px;
                        top: 0;
                        z-index: 10;

                        /** When mobile size, position price in the middle */
                        &.isSmall {
                            top: 0;
                            right: 0;
                        }
                    }

                    .button-wrapper button {
                        background-color: transparent;
                        border: none;
                        font-style: bold;
                        font-family: ${ fonts.text};
                        padding: 2px 5px;
                        cursor: pointer;
                        color: rgba(57,57,57, 0.75);
                    }

                    /** Make icon slightly smaller to fit better */
                    .button-wrapper i {
                        transform: scale(0.75);
                        display: block;
                        width: 24px;
                        height: 24px;
                    }

                    /** Indicate it is clickable */
                    .button-wrapper button:hover {
                        color: ${ colors.secondary};
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the confirm button of the application
     */
    private renderConfirmButton = () => {
        const { isOwnApplication, userType } = this.props;

        if (!isOwnApplication || userType !== UserTypes.RECEIVER) {
            return;
        }

        return (
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <Button withThrobber={false} text={ApplicationJSON.confirmReceivalButtonTitle} width={110} height={35} fontSize={12} onClick={this.openConfirmationDialogReceival} />

                <style jsx>{`
                    .button-wrapper {
                        /** Position the donate button in the top right corner */
                        position: absolute;
                        right: 9px;
                        top: 16px;
                        z-index: 10;

                        /** When mobile size, position button in the middle */
                        &.isSmall {
                            left: 100px;
                            top: 40px;
                            right: unset;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Dialog to confirm whether a receiver wants to delete an application
     */
    private renderConfirmDialogDeleteApplication() {
        return (
            <Dialog title={ApplicationJSON.confirmDeleteTitle}
                text={ApplicationJSON.confirmationDialogTextDelete}
                active={this.state.showDialogDelete}
                onClose={this.closeConfirmationDialogDelete}
                confirmAction={this.deleteApplication}
            />
        );
    }

    private renderConfirmDialogDonatePolloPollo() {
        const text = (<>USER FUNDS AND LOGIC HAS TO BE IMPLEMENTED</>);
        return (
            <Dialog title={ApplicationJSON.confirmDonateTitle}
                text={text}
                active={this.state.showPollopolloDonation}
                onClose={this.closeConfirmation}
                confirmAction={this.initiateDonation}
            />
        )
    }

    private renderConfirmDialogDonateObyte() {
        const text = (<>
            {ApplicationJSON.confirmationDialogTextDonate1}
            <br /><br />
            {ApplicationJSON.confirmationDialogTextDonate2}
            <br /><br />
            {ApplicationJSON.confirmationDialogTextDonate3}
        </>);
        return (
            <Dialog title={ApplicationJSON.confirmDonateTitle}
                text={text}
                active={this.state.showObyteDonation}
                onClose={this.closeConfirmation}
                confirmAction={this.initiateDonation}
            />
        )
    }

    /**
     * Dialog to confirm whether a donor wants to donate to an application
     */
    private renderDonationChoice() {

        const text = (<>{ApplicationJSON.DonationChoiceText}?</>);
        const isLoggedIn = (this.props.userType === UserTypes.DONOR)
        return (
        <Lightbox active={this.state.showDialogDonate} onClose={this.closeDonation}>

        <style jsx>{`
                .dialog {
                    margin: 10px 20px;
                    width: max-content;
                    max-width: 500px;
                    text-align: center;

                    @media (max-width: 600px) {
                        line-height: 1.3em;
                        max-width: calc(100% - 40px);
                        text-align: center;
                    }
                }

                p {
                    margin: 20px 0;
                    line-height: 1.4;
                }
                
                .dialog-buttons {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .dialog button {
                    padding: 7px;
                    margin: 5px;
                    width: 50%;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                }

                .btn-login {
                    width: 100%;
                }

                .dialog :global(.btn-obyte) {
                    background-color: CornflowerBlue;
                    margin-left: 20px;
                }

            `}</style>

            <div className="dialog">
                <h3>{ApplicationJSON.DonationChoiceTitle}</h3>
                <p>{text}</p>
                
                <div className="dialog-buttons">
                    {isLoggedIn ? (
                        <Button
                        onClick={this.pollopolloDonation}
                        className="pollopollo-donation"
                        isPending={false}
                        throbberSize={24}
                        width="50%"
                        withThrobber={true}
                        text="PolloPollo"
                    />) : (
                        <div className="btn-login">
                            <Link className="pollopollo-donation" to={routes.loginRedirect.path}>
                                <Button
                                    withThrobber={false}
                                    text="Login"
                                    width="100%"
                                    height={50}
                                    fontSize={16}
                                    isPending={false}/>
                            </Link>  
                        </div>
                        )}
                        <Button
                            className="obyte-donation btn-obyte"
                            withThrobber={false}
                            onClick={this.obyteDonation}
                            width="100%"
                            text="Obyte-wallet"
                        />
                </div>
            </div>
        </Lightbox>
        );
    }

    /**
     * Dialog to display application is currently locked
     */
    private renderLockedDialogDonateApplication() {
        const text = (<>
            {ApplicationJSON.lockedDialogTextDonate1}
            <br /><br />
            {ApplicationJSON.lockedDialogTextDonate2}
        </>);

        return (
            <Dialog title={ApplicationJSON.lockedDonateTitle}
                text={text}
                active={this.state.showDialogLockedDonate}
                onClose={this.closeLockedDialogDonate}
                confirmAction={this.closeLockedDialogDonate}
                confirmButtonText={ApplicationJSON.lockedOkButton}
            />
        );
    }

    /**
     * Dialog to confirm whether a producer wants to withdraw bytes
     */
    private renderConfirmDialogWithdrawFunds() {
        return (
            <Dialog title={ApplicationJSON.confirmWithdrawTitle}
                text={ApplicationJSON.confirmDialogWithdraw}
                active={this.state.showDialogWithdraw}
                onClose={this.closeConfirmationDialogWithdraw}
                confirmAction={this.withdrawBytesFromApplication}
            />
        );
    }

    /**
     * Confirmation dialog for confirming the receival of a product
     */
    private renderConfirmDialogReceival() {
        return (
            <Dialog title={ApplicationJSON.confirmReceivalTitle}
                text={ApplicationJSON.confirmationDialogTextReceival}
                active={this.state.showDialogConfirmReceival}
                onClose={this.closeConfirmationDialogReceival}
                confirmAction={this.confirmReceival}
            />
        );
    }

    /**
     * Internal renderer that will render the receiver lightbox which will be
     * displayed when desired
     */
    private renderReceiverLightbox = () => {
        if (!this.state.receiver) {
            return;
        }

        return (
            <UserLightbox
                showLightbox={this.state.showReceiver}
                onClose={this.closeReceiverLightbox}
                user={this.state.receiver}
                isOwn={this.props.isOwnApplication}
                isOnProfile={this.props.isOnReceiversPage}
                userId={this.props.application.receiverId}
                userType={"receiver"} />
        );
    }

    /**
     * Internal renderer that will render the producer lightbox which will be
     * displayed when desired
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
                isOwn={false}
                isOnProfile={this.props.isOnReceiversPage}
                userId={this.props.application.producerId}
                userType={"producer"} />
        );
    }

    /**
     * Listener that'll open the receiver lightbox once it has been executed
     */
    private openReceiverLightbox = async () => {
        if (this.props.isOnReceiversPage) {
            return;
        }

        if (!this.state.receiver) {
            const receiverId = this.props.application.receiverId;
            const receiver = await fetchUser(String(receiverId), this.props.store);


            // Only display producer if one exists with the given id
            if (receiver) {
                this.setState({ receiver, showReceiver: true });
            } else {
                this.props.store.currentErrorMessage = "Failed to fetch receiver related to application. Please try again later."
            }
        } else {
            this.setState({ showReceiver: true });
        }
    }

    /**
     * Mehtod that'll close the receiver lightbox once it has been executed
     */
    private closeReceiverLightbox = () => {
        this.setState({ showReceiver: false });
    }

    /**
     * Internal renderer that'll render the product associated with the application
     * in a lightbox
     */
    private renderProductLightbox = () => {
        if (!this.state.product) {
            return;
        }

        const isOwnProduct = this.props.store.user ? this.props.store.user.id === this.props.application.producerId : false;

        return (
            <Lightbox
                active={this.state.showProduct}
                onClose={this.hideProduct}
            >
                <div>
                    <Product
                        isOwnProduct={isOwnProduct}
                        userType={this.props.userType}
                        isOnProducersPage={false}
                        product={this.state.product}
                    />

                    <style jsx>{`
                        div {
                            /**
                             * Crop applications to maxmimum dimensions
                             */
                            width: calc(100vw - 60px);
                            max-width: 560px;
                            padding: 20px 20px 10px;
                        }
                    `}</style>
                </div>
            </Lightbox>
        );
    }

    /**
     * Callback that'll display the product lightbox once called
     */
    private showProduct = async () => {
        // Bail out if the applicaiton is already associated with a product
        if (this.props.isAssociatedApplication) {
            return;
        }

        if (!this.state.product) {
            const productId = this.props.application.productId;
            const product = await fetchProductById(productId, this.props.store);

            if (product) {
                this.setState({ product, showProduct: true });
            } else {
                this.props.store.currentErrorMessage = "Failed to fetch product related to application. Please try again later."
            }
        } else {
            this.setState({ showProduct: true });
        }
    }

    /**
     * Listener that'll open the producer lightbox once it has been executed
     */
    private openProducerLightbox = async () => {
        if (!this.state.producer) {
            const producerId = this.props.application.producerId;
            const producer = await fetchUser(String(producerId), this.props.store) as ProducerModel;


            // Only display producer if one exists with the given id
            if (producer) {
                this.setState({ producer, showProducer: true });
            } else {
                this.props.store.currentErrorMessage = "Failed to fetch producer related to application. Please try again later."
            }
        } else {
            this.setState({ showProducer: true });
        }
    }

    /**
     * Mehtod that'll close the producer lightbox once it has been executed
     */
    private closeProducerLightbox = () => {
        this.setState({ showProducer: false });
    }

    /**
     * Method that'll trigger the transition to expand/collapse the description
     * of the application
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
     * To make sure that longer names fit in the fixed size of the user section,
     * check name length and change if necissary.
     */
    private nameEstimator = () => {
        const name = this.props.application.receiverName;

        // If name meets the length requirements, return initial name
        let newName = name;

        if (name.length > 12) {
            newName = "";
            const nameList = name.split(" ");

            // Shorten the firstname to the first letter, and put it together
            // with the surname
            newName = `${nameList[0].charAt(0)}. ${nameList[nameList.length - 1]}`
        }

        return newName;
    }

    /**
     * Internal helper that determines whether the application should be rendered
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
     * Listener that'll open the confirmation dialog for deletion once it has been executed
     */
    private openConfirmationDialogDelete = () => {
        this.setState({ showDialogDelete: true });
    }

    private closeConfirmation = () => {
        this.setState({ showPollopolloDonation: false });
        this.setState({ showObyteDonation: false });
    }

    /**
     * Listener that'll close the dialog for deletion once it has been executed
     */
    private closeConfirmationDialogDelete = () => {
        this.setState({ showDialogDelete: false });
    }

    private pollopolloDonation = async () => {
        if(this.props.userType === UserTypes.DONOR) this.setState({ showPollopolloDonation: true });
    }

    private obyteDonation = async () => {
        // show DonationConfirmation
        this.setState({ showObyteDonation: true });  // rename showDialogDonate -> showDialogDonationConfirmation 
    }

    /**
     * Listener that'll open the confirmation dialog for donation once it has been executed.
     * And set the status of the application to Locked.
     */
    private openConfirmationDialogDonate = async () => {
        // fetch the application from server without using cache.
        let application = await fetchApplicationById(this.props.application.applicationId, this.props.store, false);
       
        // Display locked dialog box if the it has been locked in the meantime.
        if (application && application[0].status == ApplicationStatus.LOCKED) {
            this.closeConfirmationDialogDonate();
            this.openLockedDialogDonate();
        }

        if (this.state.showDialogDonationChoice === true) {
            this.setState({ showDialogDonationChoice: false });

            await updateStatus(this.props.application, 1, this.props.store);
            this.setState({ showDialogDonationChoice: true });
        }
        else {
            this.setState({ showDialogDonate: true });
        }

        // else {
        //     // Set status to 1 (Locked). and show the normal dialog box
        //     await updateStatus(this.props.application, 1, this.props.store);
    
        //     this.setState({ showDialogDonationChoice: true });
        // }
    }

    /**
     * Listener that'll close the dialog for donation once it has been executed
     */
    private closeConfirmationDialogDonate = () => {
        this.setState({ showDialogDonate: false });
    }

    /**
     * Listener that'll open the dialog once it has been executed
     */
    private openConfirmationDialogWithdraw = () => {
        this.setState({ showDialogWithdraw: true });
    }
    /**
     * Listener that'll close the dialog for withdrawing bytes
     */
    private closeConfirmationDialogWithdraw = () => {
        this.setState({ showDialogWithdraw: false });
    }

    private closeDonation = async () => {
        await updateStatus(this.props.application, 0, this.props.store);
        this.setState({ showDialogDonate: false });
    }

    /**
     * Listener that'll open the locked dialog for a donation
     */
    private openLockedDialogDonate = () => {
        this.setState({ showDialogLockedDonate: true });
    }

    /**
     * Listener that'll close the dialog for donation once it has been executed
     */
    private closeLockedDialogDonate = () => {
        this.setState({ showDialogLockedDonate: false });
    }

    /**
     * Listener that'll open the dialog once it has been executed
     */
    private openConfirmationDialogReceival = () => {
        this.setState({ showDialogConfirmReceival: true });
    }

    /**
     * Listener that'll close the dialog once it has been executed
     */
    private closeConfirmationDialogReceival = () => {
        this.setState({ showDialogConfirmReceival: false });
    }

    /**
     * Callback that'll hide the product lightbox once called
     */
    private hideProduct = () => {
        this.setState({ showProduct: false });
    }

    /**
     * Delete application on backend and remove from frontend?
     */
    private deleteApplication = async () => {
        await deleteApplication(this.props.application.applicationId, this.props.store, this.props.onApplicationDeleted);
    }

    /**
     * Initiate the donation and navigates the user to the Obyte wallet to interact with the contract and our chatbot
     * also closes the dialog
     */
    private initiateDonation = async () => {
        await updateStatus(this.props.application, 1, this.props.store);
        await initiateDonation(this.props.application.applicationId, this.props.onApplicationDonation);
    }

    /**
     * Confirms receival of product - something with the wallet?
     */
    private confirmReceival = async () => {
        if (this.state.isPending || !this.props.store.user) {
            return;
        }

        // Notify state that we've begun updating our product
        this.setState({ isPending: true });

        await confirmReceival(this.props.application, this.props.store, this.props.confirmApplication);
        this.setState({ showDialogConfirmReceival: false, isPending: false });
    }

    /**
     * Confirms withdrawal of bytes
     */
    private withdrawBytesFromApplication = async () => {
        if (this.state.isPending || !this.props.store.user) {
            return;
        }

        // Notify state that we've begun updating the applications
        this.setState({ isPending: true });

        await withdrawBytes(this.props.application, this.props.store, this.props.onWithdrawBytes);
        this.setState({ showDialogWithdraw: false, isPending: false });
    }
}

export const Application = injectStore((store) => ({ store }), UnwrappedApplication);