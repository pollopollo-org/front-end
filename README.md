# PolloPollo FrontEnd

## Build project

To build the PolloPollo frontend you should follow the process below, or run `SetupFrontendEnv.sh` on a Linux system.

1. Ensure that you have both NodeJS and Yarn/NPM available
   1. *(Optional)* If you'd like to be able to fix linting issues, then you need to have the following available globally:
        * TSLint
        * TypeScript
        * To get these, simply run the command `yarn global add tslint typescript`/`npm i -g tslint typescript`
2. Clone the project
3. Run the command `yarn install` in a terminal located at the project root
4.
    1. Make a copy of `.env.development.template` called `.env.development` and fill in the details.
    2. To specify which backend to connect to, add the URL to your running backend, for example:
    ```
    REACT_APP_BACKEND_URL=http://localhost:5000/api
    ```
    3. To specify which Obyte protocol to use, change the `REACT_APP_OBYTE_PROTOCOL` to either ```obyte``` for a normal wallet or ```obyte-tn``` for a TestNet wallet.
    3. To specify which pairing code is used for the chatbot, change the `REACT_APP_OBYTE_PAIRING_CODE` to the specified paring code, for example `<paring_code>@obyte.org/bb-test`
    4. To specify the address of the Autonomous Agent, specify `REACT_APP_AAADDRESS`. The address to the AA can be found in the sqlite database in the chat-bot.

5. You can now use either of the following commands to interact with the project:
   * `yarn run start` to start a development server, OR
   * `yarn run build` to create an optimized build that is suitable for production.
   * `yarn run documentation` to extract comprehensive documentation from the front-end projects
   * `yarn run lint` to lint the application and determine potential culprits that should be fixed before push.
     * `yarn run lintWindows` can be used on Windows in case `yarn run lint` fails
   * `yarn run fix` to attempt to automatically fix linting issues. *(This requires that you've completed step 1.1)*
     * `yarn run fixWindows` can be used on Windows in case `yarn run fix` fails

## Deployment of project

To deploy the project, you need to specify the production backend endpoint in a file called `.env.production`. Do this by making a copy of `.env.production.template` and call it `.env.production` and add the appropriate value, for example:

```
REACT_APP_BACKEND_URL=https://api.pollopollo.org/api
REACT_APP_OBYTE_PROTOCOL=obyte
REACT_APP_OBYTE_PAIRING_CODE=pairingCode
```

Then run the command `yarn run build` in order to create a production build. Afterwards, the `build` folder should be uploaded to the server and make sure nginx is running.

## Architecture of the project

The architecture of the project is described in the subsection below.

### Static content

Static content that may be used before the JavaScript bundle loads should be
contained within the `public` folder.

This could be files such as .html-files, manifests and images.

### Components

Components within the application is split into three different folders, that
should contain components handling a specific responsibility.

The purpose of these folders are described in the sections below.

#### [pages](src/ts/components/pages)

The `pages` folder contains components that the router should be able to navigate to.

#### [layout](src/ts/components/layout)

The `layout` folder contains components that are reuseable on several pages. E.g.
a header or footer.

#### [utils](src/ts/components/utils)

The `utils` folder contains components that are reuseable on several layouts and pages.
E.g. Dropdowns, Chevrons or similar content.

### [Models](src/ts/models)

Models are used to define the data model used to communicate with the backend.
These should be located under the path `src/ts/models`

### [Stores](src/ts/store)

Stores are used to contain and manage all data required on the frontend. All models should be contained within the `Store`.

The `Store` *(and the models attached)* are accessible throughout the whole
application via the use of function called `injectStore()`.

### [Config](src/ts/config)

All configurations should be located under the `src/ts/config` folder and exported
via the `index.ts` file located within.
