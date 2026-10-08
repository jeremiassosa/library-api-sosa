import "dotenv/config";
import express, { Request, Response } from "express";
import { sequelize } from "./db/connection.js";
import docsRouter from "./docs.js";
import { routerBooks } from "./routes/books.routes.js";
import { routerUsers } from "./routes/user.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json()); // permite leer JSON del body en POST / PUT / PATCH

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Ruta de prueba: si esto responde, el servidor está levantado.
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Library API running",
        docs: "http://localhost:" + PORT + "/docs",
    });
});

// Documentación interactiva del contrato (docs/openapi.yaml). Ya hecho.
// 👇 Acá vas a montar tus routers:
// app.use("/authors", authorsRoutes);
app.use("/books", routerBooks);
// app.use("/loans", loansRoutes);
app.use("/users", routerUsers);

// Ya hecho. Si un pedido falla con un error que nadie atrapó (por ejemplo, un error
// de la base), lo mostramos en la terminal en vez de apagar el servidor.
process.on("unhandledRejection", (error) => {
    console.error("Unhandled error:", error);
});

async function start() {
    await sequelize.authenticate(); // falla si Postgres no está prendido, si la base `library` no existe o si la contraseña de src/db/connection.ts está mal
    app.listen(PORT, () => {
        console.log("Server listening on http://localhost:" + PORT);
        console.log("Docs available at http://localhost:" + PORT + "/docs");
    });
}

start().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
