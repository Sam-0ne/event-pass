import {
  generateSlug
} from "./chunk-T7ZX2WY3.mjs";
import {
  prisma
} from "./chunk-KWBR5HY2.mjs";
import {
  BadRequest
} from "./chunk-4FNMEGUP.mjs";

// src/routes/create-event.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post("/events", {
    schema: {
      summary: "Creates an event",
      tags: ["events"],
      body: z.object({
        title: z.coerce.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid()
        })
      }
    }
  }, async (request, reply) => {
    const data = request.body;
    const slug = generateSlug(data.title);
    const sameSlugEvent = await prisma.event.findUnique({
      where: {
        slug
      }
    });
    if (sameSlugEvent !== null) {
      throw new BadRequest("There is already another event with the same URL slug.");
    }
    const event = await prisma.event.create({
      data: {
        title: data.title,
        details: data.details,
        maximumAttendees: data.maximumAttendees,
        slug
      }
    });
    return reply.status(201).send({ eventId: event.id });
  });
}

export {
  createEvent
};
