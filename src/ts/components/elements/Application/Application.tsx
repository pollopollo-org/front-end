import React from "react";

import { colors } from "src/ts/config/colors";
import { ApplicationModel } from "src/ts/models/ApplicationModel";

import { easings } from "src/ts/config/easings";
import { Button, Chevron } from "../../utils";

export type ApplicationProps = {
    /**
     * Contains a reference to the applicaiton model that should be rendered
     */
    application: ApplicationModel;
}

export type ApplicationState = {
    /**
     * A boolean that tracks whether the application is expanded, and should
     */
    expanded: boolean;
};

/**
 * Application template to contain information about the donation
 * of a single application
 */
export class Application extends React.PureComponent<ApplicationProps, ApplicationState> {
    /**
     * State of the component
     */
    public state: ApplicationState = {
        expanded: true
    };

    /** Reference to the div tag with class name description */
    private readonly descriptionRef: React.RefObject<HTMLDivElement> = React.createRef();

    /** Reference to the div tag with class name application-border */
    private readonly borderRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Toggle if element is expanded
     */
    public toggleCollapsible = () => {
        this.setState( {expanded: !this.state.expanded} );

        const desc = this.descriptionRef.current;
        const border = this.borderRef.current;

        // Check if null
        if(!desc || !border ) {
            return;
        }

        if (!this.state.expanded){
            desc.style.maxHeight = null;
        } else {
            desc.style.maxHeight = desc.scrollHeight + "px";

            // The border should expand with both description size and its own
            // size
            border.style.maxHeight = desc.scrollHeight + border.offsetHeight + "px";
        }
    }

    /**
     * Main render method, used to render Application
     */
	public render(): JSX.Element {
        const { application } = this.props;

		return (
			<React.Fragment>
                <div className="application-border" ref={ this.borderRef }>
                    <div className="application">
                        <div className="sections">
                            <section className="section-user">
                                <img className="thumbnail" src={ require("src/assets/dummy/sif.PNG") } />
                                <div className="name">{ application.name }</div>
                            </section>

                            <section className="section-donate">
                                <div className="product" title={ application.product }>{ application.amount } { application.product }</div>
                                <Button text={ "Donate $" + application.price }   />
                            </section>
                        </div>

                        <i className="chevron-wrapper" onClick={this.toggleCollapsible}>
                            <Chevron size={20} lineWidthRatio={0.5} inversed={!this.state.expanded} vertical={true} />
                        </i>
                    </div>

                    <div className="description" ref={ this.descriptionRef }>
                        <div className="description-content">
                            <h3>Motivation</h3>
                            <p>
                                { application.motivation }
                            </p>
                        </div>
                    </div>
                </div>

				<style jsx>{`

                    /** Draws a border around the application */
                    .application-border {
                        /** Allow usage of position: absolute within */
                        position: relative;

                        /** Setup dimensions of application */
                        margin-left: 20px;
                        margin: 10px;
                        width: calc(100% - 40px); /* Might be temp */
                        height: 100%;
                        max-height: 100px;

                        /** Setup internal dimensions */
                        padding: 10px;
                        box-sizing: border-box;

                        /** Render a faded border around the application */
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

                            /** Position inside application, slightly shrunk inwards */
                            position: absolute;
                            left: 50%;
                            right: 50%;

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
                            transform: scale(1.005);
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
                         * applications in list
                         */
                        &:nth-child(even) {
                            background: rgba(219,208,239, 0.1);
                        }

                        &:nth-child(odd) {
                            background: rgba(139,72,156, 0.06);
                        }
                    }

                    .application {
                        position: relative;
                    }

                    /** Contans different sections to manage placement with flexbox */
					.sections {
                        margin: 0 0 0 10px;
                        display: flex;
                        flex-direction: row;

                        position: relative;
                        z-index: 2;
					}

                    /** Shown when the collapsible is expanded */
                    .description {
                        background-color: ${ colors.white };
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.375s ${ easings.inOutQuart };
                    }

                    /** Placement styling */
                    .description-content {
                        margin: 10px;
                        border-top: 1px solid ${colors.secondary};
                    }

                    /** Placing the thumbnail and users name */
                    .section-user {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        /** Margin between this and the next section */
                        margin-right: 30px;
                    }

                    /**  */
                    .section-donate {
                        font-size: 130%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 5px;
                    }

                    /**
                    *   Consist of product title, hidden when text overflows
                    *   the limits set by max-width
                    */
                    .product {
                        display: inline-block;
                        width: 100%;
                        white-space: nowrap;
                        overflow: hidden !important;
                        text-overflow: ellipsis;
                    }

                    /** Thumbnail img in the .section-user */
                    .thumbnail {
                        height: 60px;
                        width: 60px;
                        border-radius: 50%;

                        /** Margin between this and the name element */
                        margin-bottom: 4px;
                    }

                    /** The name placed under the thumbnail in the .section-user */
                    .name {
                        font-size: 75%;
                        white-space: nowrap;
                    }

                    /** The wrapper around the chevron arrow */
                    .chevron-wrapper {
                        position: absolute;
                        bottom: 0;
                        right: 0;

                        display: block;
                        width: 28px;
                        height: 20px;

                        cursor: pointer;
                        z-index: 10;
                    }

                    i:hover {
                        color: ${ colors.secondary }
                    }

				`}</style>
			</React.Fragment>
		);
	}
}
