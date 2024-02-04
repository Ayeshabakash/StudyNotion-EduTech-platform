const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");



const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");    //cors is mechanism by which a front-end client can make requests for resources to an external back-end server.
const {connectCloudinary} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;


// connect to database 
database.connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin : "https://study-notion-edu-tech-platform-6wsz.vercel.app",
        credentials:true
    })
)

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://study-notion-edu-tech-platform-6wsz.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/'
    })
)

// connect cloudinary 
connectCloudinary();

// routes 
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/payment" , paymentRoutes);
app.use("/api/v1" , contactRoutes);


//default route 
app.get("/" , (req , res) =>{
    return res.json({
        success : true,
        message : "Server Started  successfully"
    })
});

app.listen(PORT , () => {
    console.log(`Server is successfully started at port ${PORT}`);
})
