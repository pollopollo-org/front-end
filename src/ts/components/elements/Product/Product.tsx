import React from "react";

import { colors } from "src/ts/config/colors";

import { easings } from "src/ts/config/easings";
import { ProductModel } from "src/ts/models/ProductModel";
import { Chevron, Button } from "src/ts/components/utils";
import { Thumbnail } from "src/ts/components/utils/Thumbnail";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { getSVG } from "src/assets/svg";
import { fonts, routes } from "src/ts/config";
import { Dropdown } from "src/ts/components/utils/Dropdown/Dropdown";
import { UserDescription } from "src/ts/components/elements/UserDescription/UserDescription";
import { UserTypes } from "src/ts/models/UserModel";
import { fetchUser } from "src/ts/utils/fetchUser";
import { ProducerModel } from "src/ts/models/ProducerModel";
import { Dialog } from "src/ts/components/utils/Dialog";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { alertApiError } from "src/ts/utils/alertApiError";
import { asyncTimeout } from "src/ts/utils";
import { apis } from "src/ts/config/apis";

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
}

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
     * Specifies if the edit dropdown should currently be shown when producer
     * views their own products.
     */
    showDropdown?: boolean;

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
        isPending: false
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
     * Will contain a reference to the user name wrapper, so that we can make
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
                <div className={`product-border ${!this.props.product.isActive ? "isInactive" : ""}`} ref={ this.borderRef }>
                    { this.renderProduct() }
                    { this.renderDescription() }
                </div>

                { this.renderProducerLightbox() }
                { this.renderImageLightbox() }
                { this.renderConfirmDialog() }

				<style jsx>{`

                    /** Draws a border around the product */
                    .product-border {
                        /** Allow usage of position: absolute within */
                        position: relative;

                        /** Setup dimensions of product */
                        margin: 10px;
                        width: calc(100% - 20px); /* Might be temp */

                        /** Setup internal dimensions */
                        padding: 10px;
                        box-sizing: border-box;

                        /** Render a faded border around the product */
                        border: 1px solid rgba(139,72,156, 0.15);
                        border-radius: 2px;

                        /** Setup fonts within */
                        color: ${ colors.black };

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
                            border-color: ${ colors.secondary };
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
                    { this.renderThumbnailSection() }
                    { this.renderContentSection() }
                </div>

                { this.props.userType === UserTypes.PRODUCER && 
                    this.renderProductEdit() }
                { this.props.userType === UserTypes.RECEIVER && 
                    this.renderApplyButton() }

                { this.renderDescriptionTeaser() }
                
                { this.renderChevron() }
                
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
                        margin: 7px 7px 5px 7px;
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

        return (
            <section className="section-thumbnail">
                <div className="thumbnail">
                    <Thumbnail src={this.props.product.thumbnail} callback={ this.openImageLightbox } />
                </div>
                <style jsx>{`

                    /** Thumbnail img in the .section-thumbnail */
                    .thumbnail {
                        height: 70px;
                        width: 70px;
                        margin-right: 25px;
                    }

                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that'll render the content section of the product
     */
    private renderContentSection = () => {
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
                        <span className={`price ${this.state.isSmall ? "isSmall" : ""} 
                                                ${isOwnProduct ? "isOwnProduct" : ""}`}
                        >
                            ${ product.price }
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
                            margin-right: 75px;

                            &.isSmall {
                                margin-right: 25px;
                            }
                        }
                    }
                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that renders the description teaser section of the
     * product
     */
    private renderDescriptionTeaser = () => {
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
     * Internal renderer that renders the description section of the product
     */
    private renderDescription = () => {
        const { product } = this.props;

        return (
            <div className="description" ref={this.descriptionRef}>
                <div className={`description-content ${ !product.isActive ? "isInactive" : "" }`}>
                    <h3>Product</h3>
                    <div className="description-product">
                        <p>{ product.title }</p>
                        <p className="price">(${ product.price })</p>
                    </div>
                    
                    <h3>Description</h3>
                    <p>
                        { product.description }
                    </p>

                    { this.renderProducerLink() }

                </div>

                <style jsx>{`
                    /** Shown when the collapsible is expanded */
                    .description {
                        /** Prepare expand-collapse functionality */
                        height: 0;
                        overflow: hidden;
                        transition: height ${ EXPAND_COLLAPSE_TRANSITION_DURATION }ms ${ easings.inOutQuart};

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
     * Render button link to producer profile info
     */

    private renderProducerLink() {
        if (this.props.isOnProducersPage) {
            return;
        }

        return(
                <button 
                    className="profile-link"
                    onClick={this.openProducerLightbox}
                >
                    <i className="user-icon">{getSVG("user2")}</i> 
                    Producer profile

                <style jsx>{`

                    /** Button to producers profile */
                    .profile-link {
                        /** Positioning the icon and button text horizontally */
                        display: flex;
                        flex-direction: row;

                        /** Colors and fonts */
                        background-color: transparent;
                        font-style: bold;
                        font-family: ${ fonts.text };

                        /** Size and border */
                        border: none;
                        border-radius: 5px;
                        padding: 10px;

                        /** Setup effects when hover */
                        transition: background-color 0.1s linear;
                        cursor: pointer;

                        /** 
                        * Positioning the button just outside the border of its
                        * parent, so it does not look as malplaced when not
                        * hovering
                        */
                        margin-left: -5px;

                    }

                    .profile-link:hover {
                        background-color: rgba(219,208,239,0.5);
                    }

                    /** User icon placed in button */
                    .profile-link i {
                        height: 17px;
                        width: 17px;

                        color: ${ colors.primary };

                        /** Some space between icon and button text */
                        margin-right: 5px;
                    }
                `}</style>
            </button>
        );
    }

    /**
     * Internal renderer that renders the chevron of the product
     */
    private renderChevron = () => {
        return (
            <i className={`chevron-wrapper ${this.state.isSmall ? "isSmall" : ""}`} onClick={this.toggleCollapsible} role="button">
                <Chevron size={ this.state.isSmall ? 15 : 20 } lineWidthRatio={0.5} inversed={this.state.expanded} vertical={true} />

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
                            color: ${ colors.secondary };
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
        return(
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <Button withThrobber={false} text={"Apply"} width={110} height={35} fontSize={12}/>

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

        return(
            <Dialog title={`Confirm ${ titleAction }`}
                    text={`Are you sure you want to ${ action } this product?`}
                    active={ this.state.showDialog } 
                    onClose={ this.closeConfirmationDialog } 
                    confirmAction= { this.updateProductActivation }
            />
        );
    }

    /**
     * Internal renderer that renders the edit functionality of the product
     */
    private renderProductEdit = () => {
        const { product, isOwnProduct, userType } = this.props;

        if(!isOwnProduct || userType === UserTypes.RECEIVER) {
            return;
        }

        return(
            <div className={`product-more ${this.state.isSmall ? "isSmall" : ""}`}>

                { !this.state.isSmall && (
                    <div className="edit-button-section">
                        <button className="edit-button" title="Edit"><i className="edit">{ getSVG("edit") }</i></button>
                        {  
                            product.isActive &&
                            <button onClick={ this.openConfirmationDialog } className="status-button" title="Deactivate">
                                <i className="status">{ getSVG("check-square") }</i>
                            </button>
                        }
                        {  
                            !product.isActive &&
                            <button onClick={ this.openConfirmationDialog } className="status-button"><i className="status" title="Activate">{ getSVG("square") }</i></button>
                        }
                    </div>
                )}

                { this.renderEditMenuMobile() }

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
                        font-family: ${ fonts.text };
                        padding: 2px 5px;
                        cursor: pointer;
                        color: rgba(57,57,57, 0.75);
                    }

                    /** Make icon slightly smaller to fit better */
                    .edit-button-section i {
                        transform: scale(0.75);
                    }

                    /** Indicate it is clickable */
                    .edit-button-section button:hover {
                        color: ${ colors.secondary };
                    }

                    /** Create a pale line between the icons to seperate them */
                    .edit-button-section .edit-button {
                        border-right: 1px solid ${ colors.pale };
                    }

                    /** Position the icons */
                    .product-more {
                        position: absolute;
                        right: 0;
                        top: 0;

                        &.isSmall {
                            top: 3px;
                        }
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
     * Rendering a dropdown menu on mobile size
     */
    protected renderEditMenuMobile() {
        if (!this.state.isSmall) {
            return;
        }

        return (
            <div 
                className={`show-more-icon ${ this.state.showDropdown ? "active" : "" }`}
                ref={ this.wrapperRef }
                onClick={ this.toggleDropdownState }
                role="button"
            >
                <i > 
                    {getSVG("more-vertical")}
                </i>
                { this.renderDropdown() }

                <style jsx>{`

                    /** Indicate the icon is clickable */
                    .show-more-icon {
                        color:  rgba(57,57,57, 0.75);
                        cursor: pointer;

                        &:hover {
                            color: ${ colors.secondary };
                        }
                    }
                `}</style>

            </div>
        )
    }

    
    /**
     * Renders the dropdown that'll become visible when the user clicks his own
     * profile name.
     */
    protected renderDropdown(): JSX.Element {
        return (
            <Dropdown
                active={ this.state.showDropdown }
                pointAt={ this.wrapperRef }
                onClose={ this.toggleDropdownState }
            >
                <div className="wrapper">
                    { this.renderInformation() }
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
     * Internal helper that renders all information related to the user
     */
    protected renderInformation(): JSX.Element {
        const { product } = this.props;

        return (
            <React.Fragment>
                <span className="link" onClick={this.toggleDropdownState} role="link">
                    <i className="edit">{ getSVG("edit") }</i>
                    <span>Edit</span>
                </span>
                <span onClick={ this.toggleDropdownState} role="button">

                        {   product.isActive &&
                            <div className="link" onClick={ this.openConfirmationDialog } role="button">
                                <i className="status">{ getSVG("check-square") }</i>
                                <span>Deactivate</span>
                            </div>
                            
                        }
                        {   !product.isActive && 
                            <div className="link" onClick={ this.openConfirmationDialog } role="button">
                                <i className="status">{ getSVG("square") }</i>
                                <span>Activate</span>
                            </div>
                        }
                </span>

                <style jsx>{`
                    button,
                    .link {
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
                        color: ${ colors.black };
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
                                stroke: ${ colors.black };
                            }
                        }

                        /** Apply highlight color on hover */
                        &:hover {
                            background-color: rgba(69, 50, 102, 0.1);
                            color: ${ colors.primary };

                            & i > :global(.svgIcon) > :global(svg) > :global(path) {
                                stroke: ${ colors.primary };
                            }
                        }
                    }

                    .link {
                        /**
                         * Override width on items in dropdown to ensure they take
                         * padding into account when achieving width of 100%
                         */
                        width: calc(100% - 40px);

                        & :global(> a) {
                            /** Align icon and text within icon properly */
                            display: flex;
                            align-items: center;

                            /** Override default colors */
                            color: ${ colors.black };
                            text-decoration: none;
                        }

                        & .edit {
                            height: 23px;
                            width: 23px;
                        }
                    }

                    @media (max-width: 768px) {
                        /** Force white colors, on mobile the background will be dark */
                        button,
                        .link :global(> a) {
                            color: ${ colors.whiteSmoke } !important;
                        }

                        i > :global(.svgIcon) > :global(svg) > :global(path) {
                            stroke: ${ colors.primary } !important;
                        }

                        i {
                            /** We slightly shrink icons as well to fit better */
                            transform: scale(0.75);
                        }
                    }
                `}</style>
            </React.Fragment>
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
            <Lightbox active={this.state.showProducer} onClose={this.closeProducerLightbox}>
                <UserDescription user={this.state.producer} isSelf={this.props.isOwnProduct}/>
                { !this.props.isOnProducersPage && (
                    <div>
                        <a
                            href={routes.viewProfile.path.replace(":userId", String(this.props.product.producerId))}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="chevron">
                                <Chevron />
                            </span>
                            <span className="text">Go to producer profile</span>
                        </a>
                    </div>                    
                )}

                <style jsx>{`
                    div {
                        /** Setup dimensions that match the userDescription */
                        padding: 0 50px 30px;
                        background-color: ${ colors.pale };
                    }    

                    a {
                        /** Setup font */
                        font-size: 14px;
                        color: ${ colors.black };
                        font-family: ${ fonts.text };
                        font-weight: 300;
                        text-decoration: none;

                        /** Ensure chevron and text is vertically aligned */
                        display: flex;
                        align-items: center;

                        &:hover {
                            text-decoration: underline;
                        }
                    }

                    .chevron {
                        /** Setup dimensions in which the chevron fits */
                        display: block;
                        position: relative;
                        width: 14px;
                        height: 10px;

                        /** Setup spacing between chevron and text */
                        margin-right: 5px;
                    }

                    .userDesc {
                        & :global(.information) {
                            width: 100%;
                            margin: 0;
                        }

                    }
                `}</style>
            </Lightbox>
        );
    }

    /**
     * Listener that'll open the producer lightbox once it has been executed
     */
    private openProducerLightbox = async () => {
        if (!this.state.producer) {
            const producerId = this.props.product.producerId;
            const producer = await fetchUser(String(producerId), this.props.store);


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
     * Mehtod that'll close the producer dropdown once it has been executed
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
            <Lightbox active={this.state.showImage} onClose={ this.closeImageLightbox }>
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
        await this.toggleAvailability();
        this.setState({ showDialog: false });
    }

    /**
     * Update availability and send it to the backend
     */
    private toggleAvailability = async () => {
        let { product } = this.props;

        if (this.state.isPending || !this.props.store.user) {
            return;
        }
        
        try {
            this.setState({ isPending: true });
            const startedAt = performance.now();
            const token = localStorage.getItem("userJWT");

            const result = await fetch(apis.products.put.path.replace("{productId}", String(product.id)), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: product.id,
                    userId: this.props.store.user.id,
                    available: !product.isActive, // Updating availability
                }),
            });

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

            if (result.ok) {
                if (this.props.updateProduct) {
                    const newProduct = new ProductModel({ ...this.props.product, isActive: !product.isActive });
                    this.props.updateProduct(newProduct);
                }
            } else {
                alertApiError(result.status, apis.products.post.errors, this.props.store);
            }
        } catch (err) {
            // Show error message
            this.props.store.currentErrorMessage = "Something went wrong while attempting to update your product, please try again later.";
        } finally {
            this.setState({ isPending: false });
        }
    }

    /**
     * Method that'll trigger the transition to expand/collapse the description
     * of the product
     */
    private toggleCollapsible = () => {
        const desc = this.descriptionRef.current;

        // If our ref isn't available or if we're currently transitioning, then
        // bail out
        if(!desc || this.isTransitioning) {
            return;
        }

        // Initialize the transition!
        this.setState({ expanded: !this.state.expanded });
        this.isTransitioning = true;

        // Start by locking the height of the content wrapper to the full
        // height of the content
        desc.style.height = `${desc.scrollHeight}px`;

        // Force a reflow before we're going to manage the transition
        desc.offsetHeight; // tslint:disable-line no-unused-expression

        if (this.state.expanded){
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

        if (this.state.isSmall) {
            this.setState({ showDropdown: false });
        }
    }

    /**
     * Listener that's triggered when the producer somehow prompts for the
     * dropdown to appear or disappear
     */
    protected toggleDropdownState = () => {
        this.setState({ showDropdown: !this.state.showDropdown });
    }
}

export const Product = injectStore((store) => ({ store }), UnwrappedProduct);