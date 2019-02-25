import React from "react";

export class Footer extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				
				<footer className="footer">
					<div className="footerInfo">
						<p>pollopollo.org</p>
						<p>Address:</p>
						<p>Stumpedal 3, 1.th</p>
						<p>2730, Herlev</p>
					</div>
				
				</footer>

				<style jsx>{`
					.footer {
						width: 100%;
						height: 100px;
						background-color: lightgray;
					}

					.footerInfo {
						margin: 20px;
					}
				`}</style>
			</div>
		);
	}
}