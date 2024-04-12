import {
  errorHandler
} from "./chunk-M5ZPGHDG.mjs";
import {
  checkIn
} from "./chunk-GIVCCTD6.mjs";
import {
  createEvent
} from "./chunk-HL664DWQ.mjs";
import "./chunk-T7ZX2WY3.mjs";
import {
  getBadge
} from "./chunk-QDTVO235.mjs";
import {
  getEventAttendees
} from "./chunk-MVZRLQYB.mjs";
import {
  getEvent
} from "./chunk-KNQE2FZT.mjs";
import {
  registerAttendee
} from "./chunk-HIKNUQQI.mjs";
import "./chunk-KWBR5HY2.mjs";
import "./chunk-4FNMEGUP.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "event.pass",
      description: "Back-end API specifications for event.pass application.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerAttendee);
app.register(getEvent);
app.register(getBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.get("/", () => {
  return "Server Online";
});
app.setErrorHandler(errorHandler);
app.listen({ port: 7777, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running....");
});
export {
  app
};
