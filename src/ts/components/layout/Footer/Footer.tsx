import React from "react";
import { colors } from "src/ts/config/colors";

export class Footer extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				
				<div className="phantom"></div>
				<footer className="footer">
					<div className="footerInfo">
						<p>pollopollo.org</p>
						<p>Stumpedal 3, 1.th</p>
						<p>2730, Herlev</p>
					</div>
				
				</footer>

				<style jsx>{`
					

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