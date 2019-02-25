import React from "react";
import { Footer } from './layout/footer';
import { getSVG } from 'src/assets/svg';

export class App extends React.PureComponent {
	public render(): JSX.Element {

		return (
			<div>
				Hello World
				{ getSVG("logo", {fillHoverColor: "red", transitionDuration: 1000}) }

				<Footer />
				<style jsx>{`
					div {
						height: 1000px;
						font-size: 50px;
					}
				`}</style>
			</div>
		);
	}
}
