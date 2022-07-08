import app from "./app.js";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(chalk.bold.cyan("\n Server is running on PORT " + PORT + "\n"));
});
