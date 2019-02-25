import React from "react";
import { FrontPage } from './pages/FrontPage/FrontPage';



export class App extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>
				
				<FrontPage/>

				<style jsx>{`
					div {
						font-size: 50px;
					}
				`}</style>
			</div>
		);
	}
}
