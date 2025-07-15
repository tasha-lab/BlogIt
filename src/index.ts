import express from "express";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
  })
);

const port = process.env.port || 3000;
app.get("/", async (_req, res) => {
  res.send("<h1>Welcome to my api</h1>");
});
app.use("/api/auth", userRouter);
app.use("/api/blogs", postRouter);

app.listen(port, () => {
  console.log(`App is up and running in ${port}`);
});
