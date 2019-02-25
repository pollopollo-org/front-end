import React from "react";
import { getSVG } from 'src/assets/svg';
import { Application } from './elements/Application/Application';

export class App extends React.PureComponent {
	public render(): JSX.Element {

		return (
			<div>
				Hello World

				<Application/>

				{ getSVG("logo", {fillHoverColor: "red", transitionDuration: 1000}) }

				<style jsx>{`
					div {
						font-size: 50px;
					}
				`}</style>
			</div>
		);
	}
}
