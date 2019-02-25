import React from "react";

import { colors } from "src/ts/config/colors";

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
                            <div className="thumbnail" />
                            <div className="name">Christina S</div>
                        </div>
                        
                        <div className="section">
                            <div className="product">5 chickens</div>
                            <div className="country">China</div>
                        </div>

                        <div className="section">
                            <div className="price">$10</div>
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
                        transition: 0.3s;
                    }

                    .application-border:hover {
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                    }

					.application {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        font-size: 25px;
					}

                    .section-thumbnail {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        font-size: 18px;
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
                        background-color: #555;
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
