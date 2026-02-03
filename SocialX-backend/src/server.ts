import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import connectDatabase from "./config/database";
import app from "./app";

dotenv.config({
  path: "./.env",
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
export default cloudinary;
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
