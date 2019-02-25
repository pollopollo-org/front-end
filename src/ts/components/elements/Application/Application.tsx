import React from "react";

export class Application extends React.PureComponent {
	public render(): JSX.Element {

		return (
			<div>
				Hello Application

				<style jsx>{`
					div {
						font-size: 50px;
					}
				`}</style>
			</div>
		);
	}
}
