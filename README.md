# ScienceKit

ScienceKit combines a MongoDB-backed API and Socket.IO server with the original science storytelling app, modernized for iOS (WKWebView), Android, and browsers. Docker Compose runs the browser client, API and database together; native builds connect to the same API.

Requires Docker with Compose. Node.js 26 LTS (24+ remains supported) is used for setup scripts, local development, tests, and native builds.

```sh
git clone --recurse-submodules --branch codex/modernize-local-system https://github.com/ah-cog/sciencekit.git
cd sciencekit
npm run configure
npm start
```

Open http://localhost:8080. Create an account at http://localhost:3000/signup, then sign in through the client with `http://localhost:3000` as the server address. Passwords must be at least 8 characters and no more than 72 UTF-8 bytes.

The requested sibling layout also works: `repos/sciencekit`, `repos/sciencekit-server`, and `repos/sciencekit-ios`. Run `npm run configure` and `npm start` from `repos/sciencekit`; configuration discovers the sibling paths automatically and creates a random local session secret in an ignored `.env` file. Existing configuration is preserved.

```sh
npm run logs         # Stream all service logs
npm stop             # Stop services; retain data
npm start            # Rebuild changed code and start healthy services
```

Set `DOCKER_CONTEXT` in `.env` to use a specific local engine (for example, `orbstack`) without changing the global Docker context.

MongoDB is internal to Compose. The API and web client bind host ports 3000 and 8080 to loopback. Named volumes retain MongoDB, uploads and video thumbnails across restarts. Set `API_PORT` and `WEB_PORT` in `.env` for alternate host ports, then enter the corresponding API URL in the client. Avoid `docker compose down -v` unless you intend to delete local data.

## Development and validation

```sh
npm run setup        # Install locked dependencies in both component repos
npm run dev          # Run both components on the host (requires MongoDB)
npm test             # Containerized API integration suite
npm run test:browser # Browser workflow and canvas test; requires Chrome
```

`npm test` builds a dedicated test container with development dependencies and runs the integration suite against an isolated `sciencekit_test` database in Compose. It checks the actual API, MongoDB persistence, uploads, authentication, and Socket.IO delivery, then deletes that test database. `npm run test:host` runs the same suite against a host MongoDB server, using a unique database name by default.

## Native apps

Build outside Docker using Xcode for iOS, or Java 17, Gradle, Android SDK platform 36/build tools 36.0.0, and an Android emulator. From the client repository:

```sh
npm ci
npx cordova prepare
npm run ios
npm run android
```

The iOS simulator connects to `http://localhost:3000`; Android uses `http://10.0.2.2:3000`. Both share the containerized API and persistent database. For a physical device, publish the API on the LAN and enter the Mac's LAN URL.

See the component READMEs for configuration and API details. Local cleartext HTTP and permissive CORS are enabled for development. Use HTTPS and restricted origins for an internet deployment.
