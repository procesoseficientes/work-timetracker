# Watchman Timetracker
Timetrack your team's work

## Dependencies
- [PostgreSQL](https://www.postgresql.org/)
- [NodeJS 12.14+](https://nodejs.org/)
- [Typescript 3.9+](https://www.typescriptlang.org/)
- Git

## Local enviroment setup
### Clone repo
1. Run the following command and enter project directory
```bash
git clone https://github.com/procesoseficientes/work-timetracker.git
cd work-timetracker
```

### Database
1. Create a PostgreSQL Database and a `public` schema
2. Run the `database/creating.sql` query
3. Run the `database/starterdata.sql` query
4. Add an enviroment variable poiting to your DB, in PowerShell you can run the following command:
```powershell
$env:DATABASE_URL="postgres://postgres:admin@localhost:5432/timetracker-local"
```

### Server
1. Run the following command to download the project dependecies
```bash
npm i
```
2. Start with live reoload
```
npm run start:live
```

## Contributing
Please read the [contributing guidelines](CONTRIBUTING.md) before submiting a PR.

## Use and access
1. Dev enviroment is at [https://work-timetracker-dev.herokuapp.com/](https://work-timetracker-dev.herokuapp.com/)
2. Production enviroment is at [https://work-timetracker.herokuapp.com/](https://work-timetracker-dev.herokuapp.com/)