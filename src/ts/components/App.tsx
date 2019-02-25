import React from "react";
import { hot } from "react-hot-loader";

import { getSVG } from "src/assets/svg";
import { createStore } from "../store/createStore";
import { StoreProvider } from "../store/injectStore";
import { Store } from "../store/Store";

import { MainContainer } from "./layout/MainContainer";

type AppState = {
	/**
	 * Contains a reference to the root store, which should be inject into a
	 * provider as soon as it is available
	 */
	store?: Store;
}

/**
 * Root component of the React application, which has the responsibility of setting
 * up stores, routing and creating all required contexts.
 */
export class AppUnwrapped extends React.PureComponent<{}, AppState> {
	/**
	 * Setup initial state
	 */
	public state: AppState = {};

	public async componentDidMount(): Promise<void> {
		// Wait for all required bundles and data to become available before
		// moving on to render the actual page
		const [store] = await Promise.all([
			createStore(),
		]);

		// Now that we've imported all the things we required, broadcast that the
		// application is ready!
		this.setState({store}, () => {
			store.didMount = true;
		});
	}

	/**
	 * Main render method, used to render the App
	 */
	public render(): JSX.Element {
		return (
			<div>
				{ getSVG("logo", {fillHoverColor: "red", transitionDuration: 1000}) }

				{ this.state.store && this.renderProviders() }

				<style jsx>{`
					div {
						font-size: 50px;
					}
				`}</style>
			</div>
		);
	}

	/**
	 * Renderer that'll render all providers required by children throughout the
	 * application, once everything has been fully loaded.
	 */
	protected renderProviders(): React.ReactNode {
		return (
			<StoreProvider value={this.state.store}>
				<MainContainer />
			</StoreProvider>
		);
	}
}

// tslint:disable-next-line variable-name
export const App = hot(module)(AppUnwrapped);
