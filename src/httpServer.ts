import express, { Express, Request, Response, NextFunction } from "express";
import config from "./config/config.json";
import { connectDatabase } from "./database/Database";
import publicUsersRoute from "./endpoints/user/PublicUsersRoute";
import userRoute from "./endpoints/user/UserRoute";
import authenticationRoute from "./endpoints/authentication/AuthenticationRoute";
import degreeCourseRoute from "./endpoints/degreeCourse/DegreeCourseRoute";
import { ensureDefaultAdmin } from "./endpoints/user/UserService";

const app: Express = express();

app.use(express.json());

app.use((_req: Request, res: Response, next: NextFunction): void => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

// Reihenfolge wichtig: Routen vor dem 404-Handler
app.use("/api/publicUsers", publicUsersRoute);
app.use("/api/users", userRoute);
app.use("/api/authenticate", authenticationRoute);
app.use("/api/degreeCourses", degreeCourseRoute);

app.use((_req: Request, res: Response): void => {
    res.status(404).json({ Error: "Endpoint not existing" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof SyntaxError) {
        res.status(400).json({ Error: "Invalid JSON in request body" });
        return;
    }
    console.error(err);
    res.status(500).json({ Error: "Internal server error" });
});

async function start(): Promise<void> {
    await connectDatabase();
    await ensureDefaultAdmin();
    app.listen(config.server.port, (): void => {
        console.log(`Server is running on port ${config.server.port}`);
    });
}

start().catch((err: Error): void => {
    console.error("Failed to start server:", err.message);
});