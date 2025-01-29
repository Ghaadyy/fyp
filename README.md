# Automated Testing Platform

![UI editor screen](/docs/assets/ui-editor.png)
![Run screen with live updates](/docs/assets/ui-editor.png)

## About the Project

This project presents a platform that enables users to create web tests using a _restricted natural language_ or a UI-based editor.

## Core Features

- Test metadata management
- UI or code-based editor
- View and replay previous runs
- View live test execution with real-time updates

## Getting Started

### Prerequisites

In order to setup the project, you will need a stable version of [Docker](https://docker.com) and [Docker Compose](https://docs.docker.com/compose).

We provide a `compose.yaml` file in order to run containers for each service in this project. **It is highly recommended you run the services using Docker.**

### Docker Installation

After installing Docker and Docker Compose, you can simply go ahead and run the following commands.

```bash
git clone https://github.com/Ghaadyy/fyp.git && cd fyp/
cd api
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialMigration && cd ..
docker compose up # Start the services
```

Now, you should have all the services running except the Selenium server which has to be hosted locally.

#### Setting up Selenium Grid

To excute the compiled scripts, download and install the latest [Selenium Grid server](https://github.com/SeleniumHQ/selenium/releases/) jar file _(4.28.1 is a working version)_.

> [!NOTE]
> Support for the `selenium/standalone-docker` and `selenium/standalone-chrome` is in development. For now, you can download the latest Selenium server release and run it locally.

Run the Selenium Grid server with the following command. For more information see the [official documentation](https://www.selenium.dev/documentation/grid/getting_started/).

```bash
java -jar selenium-server-x.x.x.jar standalone
```

### Manual Installation

> [!WARNING]
> It is highly recommended to run the project with Docker. See [Docker Installation](#docker-installation) for more information.

If you wish to setup the project manually, you could start by cloning the repository.

```bash
git clone https://github.com/Ghaadyy/fyp.git && cd fyp/
```

#### Setting up the client

```bash
cd client
npm install # install dependencies
npm run dev # serve the React application on port 5173
```

#### Setting up the web API

```bash
cd api
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialMigration && \
dotnet ef datbase update
dotnet build
```

> [!NOTE]
> In order to run the EF migration, you should have already installed PostrgeSQL and have the server up and running.

##### Setting up the compiler

Before running the API, please note the it is **required** to install `rnlc` compiler, since it is invoked by the API. Check out the [documentation](https://ghaadyy.github.io/restricted-nl/) for installation guidelines.

Download and install the latest release of the compiler. **Add it to the `PATH` environment variable to have global access as a CLI tool.**

#### Setting up Redis

Check th official [Redis documentation](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/) for the installation instructions.

Run the redis server using `redis-cli`.

### Running the API

Check [Setting up Selenium Grid](#setting-up-selenium-grid) to run the Selenium Grid server.

Finally, you can go ahead and run the following command.

```bash
dotnet run
```
