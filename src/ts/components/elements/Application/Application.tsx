import React from "react";


import { colors } from "src/ts/config/colors";

import dummyApplication from "src/assets/dummy/dummyApplication.json";
import { easings } from "src/ts/config/easings";

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
export class Application extends React.PureComponent<{}, ApplicationState> {

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

		return (
			<div>
				
                <div className="application-border" ref={ this.borderRef }>
                    <div className="application" onClick={ () => { this.toggleCollapsible(); } }>
                        <div className="section-user">
                            <img className="thumbnail" src={ require("src/assets/dummy/sif.PNG") } />
                            <div className="name">{ dummyApplication.name }</div>
                        </div>
                        
                        <div className="section-product">
                            <div className="product">{ dummyApplication.amount } { dummyApplication.product }</div>
                        </div>
                        <div className="section-donate">
                            <div className="price">${ dummyApplication.price }</div>
                            <button className="donateButton">Donate</button>
                        </div>
                    </div>

                    <div className="description" ref={ this.descriptionRef }>
                        <div className="description-content">
                            <h3>Motivation</h3>
                            <p>
                                { dummyApplication.description }
                            </p>
                        </div>
                    </div>
                </div>
                

				<style jsx>{`

                    /** Draws a border around the application */
                    .application-border {
                        margin-left: 100px;

                        height: 100%;
                        max-height: 100px;
                        width: 400px;
                        padding: 10px;
                        border: 1px solid ${ colors.secondaryColor };
                        color: ${ colors.primaryColor };
                    }
                    
					.application {
                        margin: 0 10px;
                        display: flex;
                        flex-direction: row;
					}

                    .description {
                        background-color: ${ colors.white };
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.375s ${ easings.inOutQuart };
                    }

                    .description-content {
                        margin: 10px;
                        border-top: 1px solid ${colors.secondaryColor};
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
			</div>
		);
	}
}
