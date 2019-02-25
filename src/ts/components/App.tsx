import React from "react";

import { getSVG } from 'src/assets/svg';
import { createStore } from '../store/createStore';
import { StoreProvider } from '../store/injectStore';

/**
 * Root component of the React application, which has the responsibility of setting
 * up stores, routing and creating all required contexts.
 */
export class App extends React.PureComponent {
	public async componentDidMount(): Promise<void> {
		// Wait for all required bundles and data to become available before
		// moving on to render the actual page
		const [store] = await Promise.all([
			createStore(),
		]);


	}

	/**
	 * Main render method, used to render the App
	 */
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

	protected renderProviders(): React.ReactNode {
		return (
			<StoreProvider>


			</StoreProvider>
		);
	}
}
