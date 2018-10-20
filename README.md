An overhaul of the Yeadon Sailing Club Results System & Website

Prerequisites:
* [Docker](https://docs.docker.com/install/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Node JS](https://nodejs.org/)
* [Yarn package manager](https://yarnpkg.com/en/docs/install)

Local installation and startup:
```bash
git clone https://github.com/MFAshby/ysc.com.git
cd ysc.com/deployment
./deploy-local.sh
```

Once this has completed successfully, you will be able to view a demo of the new website by navigating to http://localhost/
The API explorer is available at http://localhost/explorer
An admin interface for the database is available at http://localhost:8081/

The test site can be run in dev mode, which will pick up changes made in the source code of individual components:
```bash
cd ysc.com/deployment
./deploy-devmode.sh
```

Individual components can be run and tested independently. E.g. to run the race results component in dev mode:
```bash
cd ysc.com/deployment
./deploy-local.sh
cd ../sailraceresults
yarn start
```

The mobile app uses [Expo](https://expo.io/) & [React Native](https://facebook.github.io/react-native/)
To run the mobile on your app:
```bash
cd sailracetimerapp
yarn start
# Follow on screen instructions to run the app on your phone in development mode
``` 