import React from "react";


import { colors } from "src/ts/config/colors";

import dummyApplication from "../../../../assets/dummy/dummyApplication.json";

/**
 * Application template to contain information about the donation
 * of a single application
 */
export class Application extends React.PureComponent {

    /**
     * Main render method, used to render Application
     */
	public render(): JSX.Element {

		return (
			<div>
				
                <div className="application-border">
                    <div className="application">
                        <div className="section-thumbnail">
                            <img className="thumbnail" src={ require("src/assets/dummy/sif.PNG") } />
                            <div className="name">{ dummyApplication.name }</div>
                        </div>
                        
                        <div className="section">
                            <div className="product">{ dummyApplication.amount } { dummyApplication.product }</div>
                            <div className="country">{ dummyApplication.country }</div>
                        </div>

                        <div className="section">
                            <div className="price">{ dummyApplication.price }</div>
                            <button className="donateButton">Donate</button>
                        </div>
                        
                    </div>
                </div>
                

				<style jsx>{`
                    .application-border {
                        height: 100px;
                        width: 400px;
                        padding: 10px 10px 0px 10px;
                        border: 1px solid ${ colors.secondaryColor };
                    }

                    .application-border:hover {
                        border: 1px solid ${ colors.primaryColor };
                    }

					.application {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
					}

                    .section-thumbnail {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    .section {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    .thumbnail {
                        margin-bottom: 10px;
                        height: 60px;
                        width: 60px;
                        border-radius: 50%;
                    }

                    .price {
                        text-align: right;
                    }

				`}</style>
			</div>
		);
	}
}
