import React from "react";
import { getSVG } from "src/assets/svg";
import { colors } from "src/ts/config/colors";

import footerJson from "src/assets/data/footer.json";

/**
 * Footer to be placed at the bottom of all pages
 */
export class Footer extends React.PureComponent {
	/**
	 * Main render method, used to render Footer
	 */
	// tslint:disable-next-line max-func-body-length
	public render(): JSX.Element {
		return (
			<div>
				<footer>
					<div className="grid">
						{/* Contact information */}
						<div className="col">
							<div className="contactInfo">
								<h4 className="title">{footerJson.contacttitle}</h4>
								<h5>{footerJson.pressTitle}</h5>
								<p>
									<a href={`mailto:${footerJson.email}`}>{footerJson.email}</a>
								</p>
								<h5>{footerJson.community}</h5> 
								<p>
									<a href={footerJson.discordURL} target="_blank" rel="noreferrer">{footerJson.discord}</a>
								</p>
							</div>
						</div>
						{/* PolloPollo logo */}
						<div className="col">
							<div className="logo">
								<i>
									{ getSVG("logo", {fillColor: "white"}) }
								</i>
							</div>
						</div>
						{/* Contributors */}
						<div className="col">
							<div className="contributorsInfo">
							<h4 className="title">{footerJson.contributorstitle}</h4>
								<ul>
									<li>
										<a href="https://obyte.org/" target="_blank" rel="noreferrer">
											<i className="obyte">
												{ getSVG("obyte", {fillColor: "white"}) }
											</i>
										</a>
									</li>
									<li>
										<a href="https://www.scrumwise.com/" target="_blank" rel="noreferrer">
											<i className="scrumwise">
												{getSVG("scrumwise")}
											</i>
										</a>
									</li>
									<li>
										<a href="https://en.itu.dk/" target="_blank" rel="noreferrer">
											<i className="itu">
												{getSVG("itu")}
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
						background-color: ${ colors.primary };
						box-sizing: border-box;
						padding: 20px 60px;
						left: 0;
						bottom: 0;
						width: 100%;
					}

					h5 {
						font-size: 14px;
						color: ${ colors.white };
						margin: 0;
						
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
						width: 70px;
						height: 40px !important;
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

					h4 {
						color: ${ colors.white };
						font-size: 18px;
						margin-bottom: 15px;
					}

					p {
						margin: 7px 0 20px 0;
					}

					a {
						color: ${ colors.white };
						text-decoration: none;
					}

					a:hover {
						text-decoration: underline;
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
