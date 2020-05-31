import * as React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Container } from '@material-ui/core';
import "../scss/about.scss";

const projectStructure = `├── .vscode "Editor settings for VSCode."
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
└── webpack.config.js    "Webpack configuration."`;

export const About: React.FunctionComponent<{}> = ({}): JSX.Element => (
  <section className="about">
    <Container maxWidth="md">
      <Paper className="about-paper" elevation={8}>
        <Typography variant="h2">About this project</Typography>
        <Typography variant="body1">
          This project is built for the Hacker Earth, StackHack Challenge, and with ❤️ by Gourab Nag
          <span style={{ display: "inline-block" }}>&lt;gourabnag12 at gmail dot com&gt;</span>.
        </Typography>
        <Typography variant="body1">
          This project uses a mix of various technologies, but namely,
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Node.JS" secondary="For the entirety of the backend." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Typescript" secondary="Used as an alternative to JS, since it has multiple advantages over it." />
          </ListItem>
          <ListItem>
            <ListItemText primary="React" secondary="As a framework for the frontend." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Express" secondary="On top of Node, as an web server." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Sqlite" secondary="As the database engine for data storage." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Mobx" secondary="In frontend, for state management." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Typeorm" secondary="Used in backend for the ORM layer in data handling." />
          </ListItem>
        </List>
        <Typography>
          To get you familarized with the project structure, here is a brief explanation,
        </Typography>
        <pre dangerouslySetInnerHTML={{ __html: projectStructure }}></pre>
      </Paper>
    </Container>
  </section>
)