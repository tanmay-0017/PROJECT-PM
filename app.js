import express from "express";
import cookieParser from "cookie-parser";
import partnerRouter from "./router/partnerRouter.js";
import customerRoutes from "./router/customerRoutes.js";
import channelRouter from "./router/channelRouter.js"
import cors from "cors";
import logger from "./Middlewares/logger.js";
import errorMiddleware from "./Middlewares/errorMiddleware.js";
import authRoutes from "./router/authRoutes.js";
import attendantRoutes from "./router/attendantRoutes.js";
import projectRoutes from "./router/projectRoutes.js";
import serviceRequest from "./router/serviceRequestRoutes.js";
import serviceRoutes from "./router/serviceRoutes.js";
import servicePersonRouter from "./router/servicePersonRouter.js";
import bodyParser from "body-parser";
import timeline from "./router/timesheet.routes.js";
import salesManagerRouter from "./router/salesManagerRouter.js";
import teamRouter from "./router/teamRouter.js";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(logger);
app.use(errorMiddleware);

app.use("/api/partners", partnerRouter);
app.use("/api/customers", customerRoutes);
app.use("/api/attendants", attendantRoutes);
app.use("/api/login", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/seviceRequest", serviceRequest);
app.use("/api/services", serviceRoutes);
app.use("/api/servicePerson", servicePersonRouter);
app.use("/api/timeSheet", timeline);
app.use('/api/channels', channelRouter);
app.use("/api/salesManager", salesManagerRouter);
app.use("/api/teams", teamRouter);


export { app };
