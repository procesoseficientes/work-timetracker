"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const IndexRoutes_1 = require("./routes/IndexRoutes");
const UsersRoutes_1 = require("./routes/UsersRoutes");
const StatsRoutes_1 = require("./routes/StatsRoutes");
const ProjectsRoutes_1 = require("./routes/ProjectsRoutes");
const LoginRoutes_1 = require("./routes/LoginRoutes");
const OwnersRoutes_1 = require("./routes/OwnersRoutes");
const DetailRoutes_1 = require("./routes/DetailRoutes");
const TeamRoutes_1 = require("./routes/TeamRoutes");
const pg_1 = require("pg");
const TypesRoutes_1 = require("./routes/TypesRoutes");
const RolesRoutes_1 = require("./routes/RolesRoutes");
const app = express_1.default();
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
const pgClient = new pg_1.Client({
    connectionString: process.env.DATABASE_URL
});
pgClient.connect().catch((err) => {
    console.error(err);
});
app.use('/', IndexRoutes_1.IndexRoutes(pgClient));
app.use('/login', LoginRoutes_1.LoginRoutes(pgClient));
app.use('/users', UsersRoutes_1.UsersRoutes(pgClient));
app.use('/stats', StatsRoutes_1.StatsRoutes(pgClient));
app.use('/owners', OwnersRoutes_1.OwnersRoutes(pgClient));
app.use('/detail', DetailRoutes_1.DetailRoutes(pgClient));
app.use('/team', TeamRoutes_1.TeamRoutes(pgClient));
app.use('/projects', ProjectsRoutes_1.ProjectsRoutes(pgClient));
app.use('/types', TypesRoutes_1.TypesRoutes(pgClient));
app.use('/roles', RolesRoutes_1.RolesRoutes(pgClient));
// catch 404 and forward to error handler
app.use((_req, _res, next) => {
    next(http_errors_1.default(404));
});
// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', { message: err.message, status: err.status });
});
exports.default = app;
