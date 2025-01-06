import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "express-async-errors";
import { router } from "./routes";
import { setupSwagger } from "./docs/swaggerConfig";

const app = express();
app.use(express.json());
app.use(cors())

// Configurar a documentação do Swagger
setupSwagger(app);

app.use(router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error.",
    });
});

export { app };