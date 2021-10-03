const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");

// region routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const productRoutes = require('./routes/product');
const deliveryInfoRoutes = require('./routes/deliveryInfo');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const initDataRoutes = require('./routes/initData.admin');
const sizeProductRoutes = require('./routes/sizeProduct');
const sizeRoutes = require('./routes/size');
const userRoutes = require('./routes/user');



env.config();

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.dpsol.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => {
        console.log("Database connected");
    });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", brandRoutes);
app.use("/api", productRoutes);
app.use("/api", deliveryInfoRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", initDataRoutes);
app.use("/api", sizeProductRoutes);
app.use("/api", sizeRoutes);
app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})