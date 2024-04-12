import {
  prisma
} from "./chunk-KWBR5HY2.mjs";
import {
  BadRequest
} from "./chunk-4FNMEGUP.mjs";

// src/routes/get-event.ts
import { z } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get("/events/:eventSlug", {
    schema: {
      summary: "Gets event data from given URL slug",
      tags: ["events"],
      params: z.object({
        eventSlug: z.string()
      }),
      response: {
        200: z.object({
          event: z.object({
            id: z.string(),
            title: z.string(),
            details: z.string().nullable(),
            slug: z.string(),
            maximumAttendees: z.number().int().positive().nullable(),
            registeredAttendees: z.number().int()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { eventSlug } = request.params;
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        details: true,
        maximumAttendees: true,
        slug: true,
        _count: {
          select: { attendees: true }
        }
      },
      where: {
        slug: eventSlug
      }
    });
    if (event == null) {
      throw new BadRequest("No event conforms to the criteria given by the user agent.");
    }
    return reply.status(200).send({ event: {
      id: event.id,
      title: event.title,
      details: event.details,
      slug: event.slug,
      maximumAttendees: event.maximumAttendees,
      registeredAttendees: event._count.attendees
    } });
  });
}

export {
  getEvent
};
