import React from "react";

export class App extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				Hello World

				<style jsx>{`
					div {
						font-size: 1000px;
					}
				`}</style>
			</div>
		);
	}
}
