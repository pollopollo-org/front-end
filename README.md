# PolloPollo FrontEnd

## Introduction/Motivation

to be written.

## Build project

To build the PolloPollo frontend you should follow the process below.

1. Ensure that you have both NodeJS and Yarn/NPM available
   1. *(Optional)* If you'd like to be able to fix linting issues, then you need to have the following available globally:
        * TSLint
        * TypeScript
        * To get these, simply run the command `yarn global add tslint typescript`/`npm i -g tslint typescript`
2. Clone the project
3. Run the command `yarn install` in a terminal located at the project root
4. You can now use either of the two following commands to interact with the project:
   * `yarn run start` to start a development server, OR
   * `yarn run build` to create an optimized build that is suitable for production.
   * `yarn run lint` to lint the application and determine potential culprits that should be fixed before push.
     * `yarn run lintWindows` can be used on Windows in case `yarn run lint` fails
   * `yarn run fix` to attempt to automatically fix linting issues. *(This requires that you've completed step 1.1)*
     * `yarn run fixWindows` can be used on Windows in case `yarn run fix` fails

## Deployment of project

todo..

## Architecture of the project

### Static content

Static content that may be used before the JavaScript bundle loads should be
contained within the `public` folder.

This could be files such as .html-files, manifests and images.

### Components

Components within the application is split into three different folders, that
should contain components handling a specific responsibility.

The purpose of these folders are described in the sections below.

#### pages

The `pages` folder contains components that the router should be able to navigate to.

#### layout

The `layout` folder contains components that are reuseable on several pages. E.g.
a header or footer.

#### utils

The `utils` folder contains components that are reuseable on several layouts and pages.
E.g. Dropdowns, Chevrons or similar content.

### Models

Models are used to define the data model used to communicate with the backend.
These should be located under the path `src/ts/models`

### Stores

Stores are used to contain and manage all data required on the frontend, and they're
located inside the path `src/ts/stores`.
All models should be contained within the `Store`.

The `Store` *(and the models attached)* are accessible throughout the whole
application via the use of function called `injectStore()`.

### Config

All configurations should be located under the `src/ts/config` folder and exported
via the `index.ts` file located within.
Todo..
