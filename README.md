# Chat for Devs - the open-source chat application for developers
Started by Gerard Rovira Sánchez
Continued by Radu Bompa

<p align="center">
  <a href="https://codeclimate.com/repos/588ce93fc323540054000f72/feed"><img src="https://codeclimate.com/repos/588ce93fc323540054000f72/badges/6af06015c038b1ef6f6c/gpa.svg" /></a>
</p>

## Getting started

### Docker (quickest)

It is taken for granted that you have both [Docker](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/).

```
docker-compose up
```
or

```
docker-compose run --service-ports web npm start
```

Other [execution](#execution) options.

### Node

Requirements:

- [Node.js](https://nodejs.org) (v6+) ([setup](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))
- [MongoDB](https://www.mongodb.com/) ([setup](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04))
- [Redis](https://redis.io) ([setup](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04))

```
npm install
```

Start MongoDB & Redis: *(skip this step if you have them running already)*

```
scripts/startdb.sh
```

Run the project (see [Execution](#execution) for alternative options):

```
npm start
```

## Execution

Default (production):

`npm start`

Production (backend only):

`npm run start-prod-backend`

Production (frontend only):

`npm run start-prod-frontend`

Development:

`npm run start-dev`

Development (backend only):

`npm run start-dev-backend`

Production (frontend only):

`npm run start-dev-frontend`

### Docker

When using Docker, npm commands can be passed by overriding the default web command:

```
docker-compose run --service-ports web npm start
```

#### Production

Production Docker Compose gathers the `latest` version from the Docker Hub.

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Configuration

The default configuration file resides in `config/default.js`.
You can create your own configuration files that extend it that suit your own needs
(configuration files are based on [config](https://github.com/lorenwest/node-config)).

To start, you should be creating a `config/production.js` or `config/development.js`, for
development or production respectively, that looks like the following:

```
module.exports = {
  passport: {
    github: {
      clientID: 'Github client ID',
      clientSecret: 'GitHub secret key',
      callbackURL: 'http://mydomain:3000/api/auth/github/callback',
    },
    google: {
      clientID: 'Google client ID',
      clientSecret: 'Google secret key',
      callbackURL: 'http://mydomain:3000/api/auth/google/callback',
    },
  },
}
```

## Development

### Folder structure

```
.
├── backend
├── config
├── data
|    ├── db-data
|    └── db-session
├── docs
├── frontend
├── public
├── scripts
├── webpack
├── .babelrc
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .package.json
├── .travis.yml
└── README.md
```
