import React from "react";
import { Footer } from './layout/footer';

export class App extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				Hello World

				<Footer />
				<style jsx>{`
					div {
						height: 1000px;
					}
				`}</style>
			</div>
		);
	}
}
