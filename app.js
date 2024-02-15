require("dotenv").config();

//EXPRESS
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//DATABASE
const connectDB = require("./db/connect");

//ROUTERS
const userRouter = require("./routes/userRouter");
const acceptPayment = require("./routes/charges");

//NOTFOUND AND ERROR HANDLER MIDDLEWARES
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_TOKEN));

//SETUP ROUTERS
app.use("/api/vzy/v1/users", userRouter);
app.use("/api/vzy/v1", acceptPayment);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4242;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is live on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
