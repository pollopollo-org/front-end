import React from "react";
import { FrontPage } from './pages/FrontPage/FrontPage';
import { getSVG } from 'src/assets/svg';


export class App extends React.PureComponent {
	public render(): JSX.Element {

		return (
			<div>
				Hello World
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
