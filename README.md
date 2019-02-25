# PolloPollo FrontEnd

## Introduction/Motivation

to be written.

## Build project

To build the PolloPollo frontend you should follow the process below.

1. Ensure that you have both NodeJS and Yarn/NPM available
2. Clone the project
3. Run the command `yarn install` in a terminal located at the project root
4. You can now use either of the two following commands to interact with the project:
   * `yarn run start` to start a development server, OR
   * `yarn run build` to create an optimized build that is suitable for production.


## Architecture of the project

### Static content

Static content that may be used before the JavaScript bundle loads should be
contained within the `public` folder.

This could be files such as .html-files, manifests and images.

### Components

to be written...

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
