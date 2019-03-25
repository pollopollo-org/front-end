import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";

import { createStore } from "src/ts/store/createStore";
import { StoreProvider } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import { asyncTimeout } from "src/ts/utils";
import { CSS } from "src/ts/components/layout/CSS";
import { Header } from "src/ts/components/layout/Header/Header";
import { HeaderFade } from "src/ts/components/layout/Header/HeaderFade";
import { MainContainer } from "src/ts/components/layout/MainContainer";
import { InitialFade } from "src/ts/components/transitions/InitialFade";

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
export class App extends React.PureComponent<{}, AppState> {
	/**
	 * Setup initial state
	 */
	public state: AppState = {};

	/**
	 * really complicated async method
	 */
	public async componentDidMount(): Promise<void> {
		// Wait for all required bundles and data to become available before
		// moving on to render the actual page
		const [store] = await Promise.all([
			createStore(),
			asyncTimeout(300),
		]);

		this.onAppReady(store);
	}

	/**
	 * Main render method, used to render the App
	 */
	public render(): JSX.Element {
		return (
			<Router>
				<>
					<CSS />
					{ this.state.store && this.renderProviders() }
				</>
			</Router>
		);
	}

	/**
	 * Renderer that'll render all providers required by children throughout the
	 * application, once everything has been fully loaded.
	 */
	protected renderProviders(): React.ReactNode {
		return (
			<StoreProvider value={this.state.store}>
				<TransitionGroup component={null} appear={true}>
					{ this.renderHeader() }
					{ this.renderMainContainer() }
				</TransitionGroup>
			</StoreProvider>
		);
	}

	/**
	 * Renderer that'll render the header of the application wrapped within a
	 * transition which will be triggered once the application is ready
	 */
	protected renderHeader(): React.ReactNode {
		return (
			<HeaderFade key="header">
				<Header />
			</HeaderFade>
		);
	}

	/**
	 * Renderer that'll render the actual content of the application once data
	 * is ready
	 */
	protected renderMainContainer(): React.ReactNode {
		return (
			<InitialFade key="mainContainer">
				<MainContainer />
			</InitialFade>
		);
	}

	/**
	 * Internal method that should be executed once the application is ready
	 * to be rendered, in order to clean up pre-render UI.
	 */
	protected async onAppReady(store: Store): Promise<void> {
		const initialThrobber = document.querySelector(".initial-throbber");

		if (initialThrobber) {
			initialThrobber.classList.add("initial-throbber--exiting");
			document.body.style.background = "#fff";

			await asyncTimeout(100);
			this.setState({ store });


			await asyncTimeout(200);
			document.body.removeChild(initialThrobber);
		}
	}
}
