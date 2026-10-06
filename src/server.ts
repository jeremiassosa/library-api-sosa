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
app.use("/docs", docsRouter);
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

// const users: {
//     [x: string]: any; email: any; passwordHash: any; 
// }[] = []; // a modo de ejemplo, guardamos en memoria
//     app.use(express.json());
//     // Registro: guarda el usuario con la contraseña hasheada
//     app.post("/register", async (req, res) => {
//     const { email, password } = req.body;
//     const passwordHash = await bcrypt.hash(password, 10);
//     users.push({ email, passwordHash });
//     res.status(201).json({ message: "Usuario creado" });
// });

// // Login: valida credenciales y entrega un token
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const user = users.find((u) => u.email === email);
//     if (!user) return res.status(400).json({ message: "Credenciales inválidas" });
//     const passwordOk = await bcrypt.compare(password, user.passwordHash);
//     if (!passwordOk) return res.status(400).json({ message: "Credenciales inválidas" });
//         const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//         });
//     res.json({ token });
// });

// // Middleware de autenticación
// function authenticateToken(req: { headers: { authorization: any; }; user: any; }, res: { sendStatus: (arg0: number) => any; }, next: () => void) {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];
//     if (!token) return res.sendStatus(401);
//     jwt.verify(token, process.env.JWT_SECRET, (err: any, payload: any) => {
//     if (err) return res.sendStatus(403);
//     req.user = payload;
//     next();
// });
// }

// // Middleware de autorización por rol
// function authorizeRole(role: string) {
//     return (req: { user: { role: any; }; }, res: { sendStatus: (arg0: number) => any; }, next: () => void) => {
//     if (req.user.role !== role) return res.sendStatus(403);
//     next();
// };
// }

// // Ruta protegida: solo admins
// app.get("/admin/dashboard", authenticateToken, authorizeRole("admin"), (req, res) => {
//     res.json({ message: "Bienvenido al panel de admin" });
// });
// app.listen(3000, () => {
//     console.log("Servidor escuchando en http://localhost:3000");
// });
