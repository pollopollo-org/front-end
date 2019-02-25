import React from "react";

export class Footer extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				
				<footer className="footer">
					<div className="footerInfo">
						<p>pollopollo.org</p>
						<p>Stumpedal 3, 1.th</p>
						<p>2730, Herlev</p>
					</div>
				
				</footer>

				<style jsx>{`
					.footer {
						background-color: black;
						border-top:	1px solid #E7E7E7;
						padding: 20px;
						position: fixed;
						left: 0;
						bottom: 0;
						height: 100px;
						width: 100%;
					}

					.footerInfo {
						margin-left: 20px;
						color: white;
					}
				`}</style>
			</div>
		);
	}
}