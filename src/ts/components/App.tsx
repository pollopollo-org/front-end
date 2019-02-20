import React from "react";

export class App extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				Hello World

				<style jsx>{`
					div {
						font-size: 50px;
					}
				`}</style>
			</div>
		);
	}
}
