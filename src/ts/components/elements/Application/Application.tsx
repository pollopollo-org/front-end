import React from "react";

export class Application extends React.PureComponent {
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
                        height: 120px;
                        width: 400px;
                        padding: 10px 10px 0px 10px;
                        border: 1px solid lightgray;
                        transition: 0.3s;
                    }

                    .application-border:hover {
                        background-color: lightgray;
                    }

					.application {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        font-size: 30px;
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
                        height: 75px;
                        width: 75px;
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
