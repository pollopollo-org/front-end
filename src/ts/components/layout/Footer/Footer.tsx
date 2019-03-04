import React from "react";
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
				<footer className="footer">
					<div className="footerInfo">
						<p>{footer.url}</p>
						<p>{footer.street}</p>
						<p>{footer.zipcode}, {footer.city}</p>
					</div>

				</footer>

				<style jsx>{`


					.footer {
						background-color: ${ colors.primaryColor };
						padding: 20px 0;
						left: 0;
						bottom: 0;
						height: 100px;
						width: 100%;
					}

					.footerInfo {
						margin-left: 30px;
						font-size: 15px;
						color: white;
					}
				`}</style>
			</div>
		);
	}
}
