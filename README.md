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

Once this has completed successfully, you will be able to view a demo of the new website by navigating to http://localhost:8080/
The results widget can be viewed independently at http://localhost:8080/results
The API explorer is available at http://localhost:8080/explorer
An admin interface for the database is available at http://localhost:8081/

Individual components can be run and tested independently. To test the race results widget, after running `./deploy-local`:
```bash
cd sailraceresults
yarn start
```
This will open the widget in a new browser tab, and will automatically reload when you make changes.