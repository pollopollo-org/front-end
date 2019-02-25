import React from "react";
import { getSVG } from 'src/assets/svg';
import { RegisterForm } from './pages/RegisterForm/RegisterForm';


export class App extends React.PureComponent {
	public render(): JSX.Element {

		return (
			<div>
				<RegisterForm></RegisterForm>
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
