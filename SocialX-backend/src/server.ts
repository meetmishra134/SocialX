import dotenv from "dotenv";
import connectDatabase from "./config/database";
import app from "./app";

dotenv.config({
  path: "./.env",
});
const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello SocialX");
// });

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port  http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Failed To Connect MongoDB", error);
    process.exit(1);
  });
