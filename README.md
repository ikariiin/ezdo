# EZDo
A task / To-Do management app built for the modern web.

## How to start using it
```
# Clone the repository
git clone https://github.com/SaitamaSama/ezdo-hackerearth
# Install dependencies
# Important note about this step:
# this application requires certain dependencies which uses node-gyp, so build-tools installation is recommended
npm i
# Build the app
npm run build
# Install the app
node index.js
# this will create a .env file which contains the database location and port
# edit this file to change these as required
# Run the app
npm start
```

## Project Structure Explainer
```
├── .vscode "Editor settings for VSCode."
├── dist "Output files after the build. Will not be included in Source Control."
├── src
│   ├── backend
│   │   ├── entities
│   │   │   ├──          "Data entities for typeorm."
│   │   ├── middlewares
│   │   │   ├──          "Middlewares for the express app to facilitate CORS and other utility tasks."
│   │   ├── routes
│   │   │   ├──          "Routers for the backend."
│   │   ├── index.ts     "Entry point for the backend application"
│   │   └── util.ts
│   ├── frontend
│   │   ├── modules
│   │   │   ├── <module> "Modules follow a structure like this:"
│   │   │   │   ├── components
│   │   │   │   │   └──  "TSX files"
│   │   │   │   └── scss
│   │   │   │       └──  "SCSS style files for each component"
│   │   │   ├── about
│   │   │       ├──      "Houses stuff for this very page."
│   │   │   ├── archive
│   │   │       ├──      "Houses components and styles for the archive page."
│   │   │   ├── auth
│   │   │       ├──      "Houses components and styles for the login / register pages."
│   │   │   ├── common
│   │   │       ├──      "Common components required all over the frontend."
│   │   │   ├── dashboard
│   │   │       ├──      "Houses the compnents and styles for the Dashboard page."
│   │   │   ├── root
│   │   │       ├──      "Handles mounting the required Higher Order Components."
│   │   │   ├── search
│   │   │       ├──      "Houses the compnents and styles for the Search page."
│   │   │   └── util
│   │   │       ├──      "Utility functions / components for the entire frontend."
│   │   ├── index.html
│   │   └── mounter.tsx  "Entry point for the frontend side of things."
│   ├── resources
│   │   ├──              "Resources for the project, such as backgrounds, and illustrations."
│   └── custom.d.ts
├── .gitignore           "General GIT Ignore file for node_modules and the related."
├── package.json         "NPM stuff."
├── todo.sqlite          "Database for the project."
├── tsconfig.json        "Typescript configuration."
└── webpack.config.js    "Webpack configuration."
```