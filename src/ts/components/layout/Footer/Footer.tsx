import React from "react";
import { colors } from "src/ts/config/colors";

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
				
				<div className="phantom-footer"></div>
				<footer className="footer">
					<div className="footerInfo">
						<p>pollopollo.org</p>
						<p>Stumpedal 3, 1.th</p>
						<p>2730, Herlev</p>
					</div>
				
				</footer>

				<style jsx>{`
					
					.phantom-footer {
						height: 100px;
						width: 100%;
					}
					.footer {
						background-color: ${ colors.primaryColor };
						padding: 20px;
						position: fixed;
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