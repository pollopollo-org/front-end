import React from "react";

import { colors } from "src/ts/config/colors";

import { easings } from "src/ts/config/easings";
import { ProductModel } from "src/ts/models/ProductModel";
import { Button, Chevron } from "src/ts/components/utils";

export type ProductProps = {
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
     * Specifies whether the product should be rendered to be compatible with
     * smaller viewports
     */
    isSmall: boolean;
};

const EXPAND_COLLAPSE_TRANSITION_DURATION = 375;
const MOBILE_BREAKPOINT = 440;

/**
 * Application template to contain information about the donation
 * of a single application
 */
export class Product extends React.PureComponent<ProductProps, ProductState> {
    /**
     * State of the component
     */
    public state: ProductState = {
        expanded: false,
        isSmall: false,
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
                <div className="product-border" ref={ this.borderRef }>
                    <div className="product">
                        <div className="sections">
                            { this.renderThumbnailSection() }
                            { this.renderContentSection() }
                        </div>

                        { this.renderDonateButton() }

                        { this.state.isSmall && (
                            this.renderMotivationTeaser()
                        )}

                        { this.renderChevron() }
                    </div>
                    { this.renderMotivation() }
                </div>

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
                    }

                    /** The product itself  */
                    .product {
                        position: relative;
                        overflow: hidden;
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
				`}</style>
			</React.Fragment>
		);
    }

    /**
     * Internal renderer that renders the user section of the product template
     */
    private renderThumbnailSection = () => {
        const { product } = this.props;

        return (
            <section className="section-thumbnail">
                <img 
                    className="thumbnail" 
                    src={require("src/assets/dummy/sif.PNG")} 
                    role="presentation" 
                    alt="" 
                />
                <img    
                    className="flag" 
                    title={product.country} 
                    src={`${process.env.PUBLIC_URL}/flags/${product.countryCode.toLowerCase()}.svg`} 
                    alt={product.country} 
                />

                <style jsx>{`

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
                        overflow: initial;
                        height: 20px;
                        width: 30px;

                        /** Positioning it on the top-right of the thumbnail */
                        top: -5px;
                        left: 45px;

                        z-index: 1;
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
                <span className={`product ${this.state.isSmall ? "isSmall" : ""}`}>{product.title}</span>

                { !this.state.isSmall && (
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
     * product
     */
    private renderMotivationTeaser = () => {
        const { product } = this.props;

        return (
            <span
                className={`motivation__teaser ${this.state.isSmall ? "isSmall" : ""}`}
                style={{
                    opacity: this.state.expanded ? 0 : 0.6,
                    userSelect: this.state.expanded ? "none" : "text",
                }}
            >
                {product.description}

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
                            position: relative;
                            display: block;
                            max-width: calc(100% - 60px);

                            margin-top: 8px;
                            margin-left: 12px;
                        }
                    }
                `}</style>
            </span>
        );
    }

    /**
     * Internal renderer that renders the motivation section of the product
     */
    private renderMotivation = () => {
        const { product } = this.props;

        return (
            <div className="description" ref={this.descriptionRef}>
                <div className="description-content">
                    <h3>Requested product</h3>
                    <p>{product.title}</p>
                    <h3>Motivation</h3>
                    <p>
                        {product.description}
                    </p>
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

                    /** Placement styling */
                    .description-content {
                        margin: 10px;
                        border-top: 1px solid ${colors.secondary};
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
            <i className={`chevron-wrapper ${this.state.isSmall ? "isSmall" : ""}`} onClick={this.toggleCollapsible} alt="" role="presentation">
                <Chevron size={ this.state.isSmall ? 15 : 20 } lineWidthRatio={0.5} inversed={this.state.expanded} vertical={true} />

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
                            color: ${ colors.secondary };
                        }
                    }
                `}</style>
            </i>
        );
    }

    /**
     * Internal renderer that renders the donate button of the product
     */
    private renderDonateButton = () => {
        const { product } = this.props;

        return(
            <div className={`button-wrapper ${this.state.isSmall ? "isSmall" : ""}`}>
                <Button text={`Donate $${product.price}`} />

                <style jsx>{`
                    .button-wrapper {
                        /** Position the donate button in the top right corner */
                        position: absolute;
                        right: 0;
                        top: 0;
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
    }
}
