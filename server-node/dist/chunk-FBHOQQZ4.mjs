import {
  prisma
} from "./chunk-KWBR5HY2.mjs";
import {
  BadRequest
} from "./chunk-4FNMEGUP.mjs";

// src/routes/get-event-attendees.ts
import { number, z } from "zod";
async function getEventAttendees(app) {
  app.withTypeProvider().get("/events/:eventSlug/attendees", {
    schema: {
      summary: "Gets attendees registered from given URL slug",
      tags: ["events"],
      params: z.object({
        eventSlug: z.string()
      }),
      querystring: z.object({
        query: z.string().optional().nullish()
      }),
      response: {
        200: z.object({
          registeredAttendees: number().int().optional(),
          attendees: z.array(z.object({
            id: z.string().cuid(),
            name: z.string().min(4),
            email: z.string().email(),
            eventId: z.string().uuid(),
            registryDate: z.date(),
            checkIn: z.date().nullable()
          }))
        })
      }
    }
  }, async (request, reply) => {
    const { eventSlug } = request.params;
    const { query } = request.query;
    const getEventId = await prisma.event.findUnique({
      select: {
        id: true
      },
      where: {
        slug: eventSlug
      }
    });
    if (getEventId == null) {
      throw new BadRequest("No event conforms to the criteria given by the user agent.");
    }
    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        eventId: true,
        registryDate: true,
        checkIn: true
      },
      where: query ? {
        eventId: getEventId.id,
        name: {
          contains: query
        }
      } : {
        eventId: getEventId.id
      },
      orderBy: {
        registryDate: "asc"
      }
    });
    return reply.status(200).send({
      registeredAttendees: attendees.length,
      attendees: attendees.map((attendee) => {
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          eventId: attendee.eventId,
          registryDate: attendee.registryDate,
          checkIn: attendee.checkIn
        };
      })
    });
  });
}

export {
  getEventAttendees
};
