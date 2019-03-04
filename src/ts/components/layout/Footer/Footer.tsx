import React from "react";
import { getSVG } from "src/assets/svg";
import { colors } from "src/ts/config/colors";

import footer from "src/assets/data/footer.json";

/**
 * Footer to be placed at the bottom of all pages
 */
export class Footer extends React.PureComponent {

	/**
	 * Main render method, used to render Footer
	 */
	public render(): JSX.Element {
		return (
			<div>
				<footer>
					<div className="grid">
						<div className="col">
							<div className="contactInfo">
								<p className="title">{footer.contacttitle}</p>
								<p>{footer.url}</p>
								<p>{footer.street}</p>
								<p>{footer.zipcode}, {footer.city}</p>
							</div>
						</div>
						<div className="col">
							<div className="logo">
								<i>
									{ getSVG("logo", {fillColor: "white"}) }
								</i>
							</div>
						</div>
						<div className="col">
							<div className="contributorsInfo">
							<p className="title">{footer.contributorstitle}</p>
								<ul>
									<li>
										<a href="https://en.itu.dk/" target="_blank">
											<i className="itu">
												{ getSVG("itu") }
											</i>
										</a>
									</li>
									<li>
										<a href="https://obyte.org/" target="_blank">
											<i className="obyte">
												{ getSVG("obyte", {fillColor: "white"}) }
											</i>
										</a>
									</li>
									<li>
										<a href="https://www.scrumwise.com/" target="_blank">
											<i className="scrumwise">
												{ getSVG("scrumwise") }
											</i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</footer>

				<style jsx>{`

					footer {
						background-color: ${ colors.primaryColor };
						box-sizing: border-box;
						padding: 20px 60px;
						left: 0;
						bottom: 0;
						/*height: 196px;*/
						width: 100%;
					}
					
					ul {
						padding: 0;
						list-style-type: none;
					}

					.grid {
						display: flex;
						margin: 0 auto;
					}

					.grid .col {
						flex: 1;
					}

					.contactInfo {
						font-size: 15px;
						color: ${colors.white};
					}

					.contributorsInfo {
						font-size: 15px;
						color: ${colors.white};
						text-align: right;
					}

					.contributorsInfo i {
						display: block;
						height: 25px;
						margin: 15px 0;
						margin-left: auto;
					}

					.obyte {
						width: 45px;
					}

					.itu {
						width: 159px;
					}

					.scrumwise {
						width: 130px;
					}

					.logo {
						display: flex;
    					align-items: center;
						height: 100%;
					}

					.logo i {
						margin: 0 auto;
						height: 100px;
					}

					.title {
						font-weight: 700;
					}

					p {
						margin: 15px 0;
					}
					
					@media only screen and (max-width: 666px) {
					/* For mobile phones: */
						.footer {
							height: 500px;
						}

						.grid {
    						flex-direction: column;
						}

						.contactInfo {
							text-align: center;
						}

						.contributorsInfo {
							text-align: center;
						}

						.contributorsInfo i {
							margin: 15px auto;
						}

						.logo {
							margin: 15px 0;
						}

					}
				`}</style>
			</div>
		);
	}
}
