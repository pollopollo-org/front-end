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
    public toggleCollapsible() {
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
			<div>

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
                            <section className="section-chevron">
                                <i onClick={ () => { this.toggleCollapsible(); } }>
                                    <Chevron size={20} lineWidthRatio={0.5} inversed={!this.state.expanded} vertical={true} />
                                </i>
                            </section>
                        </div>
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

                        /** temp margin */
                        margin-top: 20px;
                        margin-left: 100px;

                        height: 100%;
                        width: 100%;
                        max-height: 100px;
                        max-width: 400px;
                        padding: 10px;
                        border: 1px solid ${ colors.secondaryColor };
                        color: ${ colors.primaryColor };
                    }
                    
                    /** Contans different sections to manage placement with flexbox */
					.sections {
                        margin: 0 10px;
                        display: flex;
                        flex-direction: row;
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
                        border-top: 1px solid ${colors.secondaryColor};
                    }

                    /** Placing the thumbnail and users name */
                    .section-user {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        /** Margin between this and the next section */
                        margin-right: 30px;
                    }

                    /** Placement of the chevron in the right-bottom corner */
                    .section-chevron {
                        margin: auto 15px 5px auto;
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
                        max-width: 250px;
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
                        margin-bottom: 10px;
                    }
                    
                    /** The name placed under the thumbnail in the .section-user */
                    .name {
                        font-size: 75%;
                    }

                    /** The wrapper around the chevron arrow */
                    i {
                        display: block; 
                        width: 28px;
                        height: 20px;

                        /** Needs to relative, because the Chevrons position is 
                        *   absolute
                        */
                        position: relative;
                        cursor: pointer;
                    }

                    i:hover {
                        color: ${ colors.secondaryColor }
                    }

				`}</style>
			</div>
		);
	}
}
