import React from "react";

import { colors } from "src/ts/config/colors";
import { ApplicationModel } from "src/ts/models/ApplicationModel";

import { easings } from "src/ts/config/easings";
import { Button } from "../../utils";

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
			<React.Fragment>

                <div className="application-border" ref={ this.borderRef }>
                    <div className="application" onClick={ () => { this.toggleCollapsible(); } }>
                        <div className="section-user">
                            <img className="thumbnail" src={require("src/assets/dummy/sif.PNG")} />
                            <div className="name">{ application.name }</div>
                        </div>

                        <div className="section-product">
                            <div className="product">{ application.amount } { application.product }</div>
                        </div>
                        <div className="section-donate">
                            <div className="price">${ application.price }</div>
                            <Button text={ "Donate" } />
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
                        position: relative;

                        /** temp margin */
                        margin-left: 100px;

                        height: 100%;
                        max-height: 100px;
                        width: 400px;
                        padding: 10px;
                        border: 1px solid rgba(139,72,156, 0.15);
                        border-radius: 2px;
                        color: ${ colors.primary };
                        box-sizing: border-box;

                        transition: transform 0.1s linear, border-color 0.1s linear, box-shadow 0.1s linear;

                        &::before {
                            content: "";

                            position: absolute;
                            top: 0%;
                            bottom: 0%;
                            left: 50%;
                            right: 50%;

                            background-color: rgba(219,208,239, 0.15);

                            opacity: 0;
                            z-index: 0;

                            transition: opacity 0.1s linear, left 0.1s ${ easings.inOutQuad}, right 0.1s ${easings.inOutQuad},top 0.1s ${easings.inOutQuad}, bottom 0.1s ${easings.inOutQuart };
                        }

                        &:hover {
                            transform: scale(1.005);
                            box-shadow: 0 0 5px rgba(139,72,156, 0.15);
                            border-color: ${ colors.secondary };
                        }

                        &:hover::before {
                            opacity: 1;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            top: 0;
                        }
                    }

					.application {
                        margin: 0 10px;
                        display: flex;
                        flex-direction: row;

                        position: relative;
                        z-index: 2;
					}

                    .description {
                        background-color: ${ colors.white };
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.375s ${ easings.inOutQuart };
                    }

                    .description-content {
                        margin: 10px;
                        border-top: 1px solid ${colors.secondary};
                    }

                    .description-content p {
                        padding-top: 10px;
                    }

                    .section-user {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        margin-right: 20px;
                    }

                    .section-product {
                        font-size: 130%;
                        padding: 5px;
                    }

                    .section-donate {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        margin-left: auto;
                    }

                    .thumbnail {
                        margin-bottom: 10px;
                        height: 60px;
                        width: 60px;
                        border-radius: 50%;
                    }

                    .name {
                        font-size: 75%;
                    }

                    .price {
                        text-align: right;
                        font-size: 140%;
                    }

				`}</style>
			</React.Fragment>
		);
	}
}
