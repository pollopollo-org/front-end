import React from "react";

import { colors } from "src/ts/config/colors";

import { easings } from "src/ts/config/easings";
import { ProductModel } from "src/ts/models/ProductModel";
import { Chevron, Button } from "src/ts/components/utils";
import { Thumbnail } from "src/ts/components/utils/Thumbnail";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { getSVG } from "src/assets/svg";
import { fonts } from "src/ts/config";
import { Dropdown } from "src/ts/components/utils/Dropdown/Dropdown";
import { UserDescription } from "src/ts/components/elements/UserDescription/UserDescription";
import { UserTypes } from "src/ts/models/UserModel";
import { fetchUser } from "src/ts/utils/fetchUser";
import { ProducerModel } from "src/ts/models/ProducerModel";

export type ProductProps = {

    /**
     * Contains a reference to the users role, is either producer or receiver
     */
    userType: UserTypes;

    /**
     * Contains a reference to the product model that should be rendered
     */
    product: ProductModel;
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
     * Specifies whether the product should be rendered to be compatible with
     * smaller viewports
     */
    isSmall: boolean;

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
export class Product extends React.PureComponent<ProductProps, ProductState> {
    /**
     * State of the component
     */
    public state: ProductState = {
        expanded: false,
        isSmall: false,
        showImage: false,
        showProducer: false,
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
     * Main render method, used to render Product
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

                    /** The product itself  */
                    .product {
                        position: relative;
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
			</React.Fragment>
		);
    }

    /**
     * Renders the primary information of the product when collapsed
     */
    private renderProduct() {
        return (
            <div className="product">
                <div className="sections">
                    { this.renderThumbnailSection() }
                    { this.renderContentSection() }
                </div>

                { this.props.userType === UserTypes.PRODUCER && 
                    this.renderProductEdit() }
                { this.props.userType === UserTypes.RECEIVER && 
                    this.renderApplyButton() }

                { this.state.isSmall && (
                    this.renderDescriptionTeaser()
                )}

                { this.renderChevron() }
                
                <style jsx>{`

                    /** The product itself  */
                    .product {
                        position: relative;
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
        const { product } = this.props;

        return (
            <section className="section-thumbnail">
                <div className="thumbnail">
                    <Thumbnail src={require("src/assets/dummy/product.jpg")} callback={ this.openImageLightbox } />
                </div>
                <img    
                    className="flag" 
                    title={product.country} 
                    src={`${process.env.PUBLIC_URL}/flags/${product.countryCode.toLowerCase()}.svg`} 
                    alt={product.country} 
                />

                <style jsx>{`

                    /** Thumbnail img in the .section-thumbnail */
                    .thumbnail {
                        height: 70px;
                        width: 70px;
                        margin-right: 30px;
                    }

                    /** Flag showing the users country */
                    .flag {
                        position: absolute;
                        height: 20px;
                        width: 30px;

                        /** Positioning it on the top-right of the thumbnail */
                        top: -5px;
                        left: 50px;

                        z-index: 2;
                    }
                `}</style>
            </section>
        );
    }

    /**
     * Internal renderer that'll render the content section of the product
     */
    private renderContentSection = () => {
        const { product } = this.props;

        return (
            <section className="section-content">
                <span className={`product ${this.state.isSmall ? "isSmall" : ""}`}> <span>{product.title}</span> <span className="price">- ${product.price}</span> </span>

                { !this.state.isSmall && (
                    this.renderDescriptionTeaser()
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


                        display: flex;
                        flex-direction: row;

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

                    .product .price {
                        font-style: italic;
                        font-size: 0.87em;
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
                            position: relative;
                            display: block;
                            max-width: calc(100% - 60px);

                            margin-top: 8px;
                            margin-left: 7px;
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
                <div className="description-content">
                    <h3>Product</h3>
                    <p>{product.title}</p>
                    <h3>Description</h3>
                    <p>
                        {product.description}
                    </p>
                    <button 
                        className="profile-link"
                        onClick={this.openProducerLightbox}
                    >
                        <i className="user-icon">{getSVG("user2")}</i> 
                        Producer profile
                    </button>
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
                    }

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
            </div>
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
                <Button text={`Apply`} />

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
     * Internal renderer that renders the edit functionality of the product
     * 
     * TODO: White inline comments
     */
    private renderProductEdit = () => {
        const { product } = this.props;

        return(
            <div className={`product-more ${this.state.isSmall ? "isSmall" : ""}`}>

                { !this.state.isSmall && (
                    <div className="edit-button-section">
                        <button className="edit-button"><i className="edit">{ getSVG("edit") }</i></button>
                        {  
                            product.isActive &&
                            <button className="status-button"><i className="status">{ getSVG("check-square") }</i></button>
                        }
                        {  
                            !product.isActive &&
                            <button className="status-button"><i className="status">{ getSVG("square") }</i></button>
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
                        top: -6px;
                        z-index: 12;
                    }

                    /** Default for all icons */
                    .product-more i {
                        display: block;

                        height: 24px;
                        width: 24px;
                        cursor: pointer;
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
                        cursor: pointer;

                        &:hover {
                            color: ${ colors.gray };
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
                            <div className="link">
                                <i className="status">{ getSVG("check-square") }</i>
                                <span>Deactivate</span>
                            </div>
                            
                        }
                        {   !product.isActive && 
                            <div className="link">
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
        return (
            <Lightbox active={this.state.showProducer} onClose={this.closeProducerLightbox}>
                <UserDescription user={this.state.producer} />
            </Lightbox>
        );
    }

    /**
     * Listener that'll open the producer lightbox once it has been executed
     */
    private openProducerLightbox = async () => {
        // TODO: Display throbber while loading!!!!!!!
        if (!this.state.producer) {
            const producerId = this.props.product.producerId;
            const producer = await fetchUser(String(producerId));

            // Only display producer if one exists with the given id
            if (producer) {
                this.setState({ producer, showProducer: true });
            } else {
                alert("Failed to fetch producer related to product. Please try again later.");
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
                <img src={require("src/assets/dummy/product.jpg")} alt="" role="presentation" />

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
