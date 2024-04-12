import {
  BadRequest,
  NotFound
} from "./chunk-4FNMEGUP.mjs";

// src/utils/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors
    });
  } else if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  } else if (error instanceof NotFound) {
    return reply.status(404).send({ message: error.message });
  }
  return reply.status(500).send({ message: error });
};

export {
  errorHandler
};
