import express from "express";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {engine} from "express-handlebars";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT;
const app = express();


import {default as DefaultRouter} from "./routes/prizes.router.js";


app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set("views","./views");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const swaggerOption = {
    swaggerDefinition: (swaggerJsdoc.Options = {
        info: {
            title: "Prizes project",
            description: "API documentation",
            contact: {
                name: "Maxime THEVENEAU"
            },
            servers: ["http://localhost:3000/"],
        },
    }),
    apis: ["server.js", "./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOption);

app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", DefaultRouter);
app.get("/",(req,res)=>{
    res.render("layouts/home.handlebars")
});

app.use("*",(req,res)=>{
    let error = {error:{message: "Go to \"/api-docs\" for swagger documentation of API"}};
    res.render("error404.handlebars",error)
});

app.listen(port, ()=>{
    console.log("Le serveur écoute sur port "+port)
});



