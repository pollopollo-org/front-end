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
									{/* <a href={footerJson.discordURL} target="_blank" rel="noreferrer">{footerJson.discord}</a> */}
									<a href={footerJson.discordURL} target="_blank" rel="noreferrer">
										<div className="discord">
											<img
												className="discord_on"
												title="DiscordLogo" 
												src={`${process.env.PUBLIC_URL}/icons/discord_off_w.png`}
												alt="discord"
											/>
											<img
												className="discord_off"
												title="DiscordLogo" 
												src={`${process.env.PUBLIC_URL}/icons/discord_on.png`}
												alt="discord"
											/>
										</div>
									</a>
									<a href={footerJson.twitterURL} target="_blank" rel="noreferrer">
										<div className="twitter">										
											<img
												className="twitter_on"
												title="TwitterLogo" 
												src={`${process.env.PUBLIC_URL}/icons/twitter_off_w.png`}
												alt="twitter"
											/>
											<img
												className="twitter_off"
												title="TwitterLogo" 
												src={`${process.env.PUBLIC_URL}/icons/twitter_on.png`}
												alt="twitter"
											/>
										</div>
									</a>
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

					/* Make the container relative */
					.discord {
						position: relative;	
						margin:  0 auto;
						
					}

					.twitter {
						position: relative;
						margin: 0 auto;
						left: 40px;
					}

					.discord img {
						position: absolute;
						top:0;
						left:0;
						overflow: hidden;
						width: 36px;
						height: 36px;
					}

					.twitter img {
						position: absolute;
						top: 2;
						left: 0;
						overflow: hidden;
						width: 30px;
						height: 30px;
					}

					.discord .discord_on {
						z-index: 9999;
						transition: opacity .1s linear;
						cursor: pointer;
					}

					.twitter .twitter_on {
						z-index: 9999;
						transition: opacity .1s linear;
						cursor: pointer;
					}

					.discord:hover  > .discord_on {
						opacity: 0;
					}

					.twitter:hover > .twitter_on {
						opacity: 0;
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
