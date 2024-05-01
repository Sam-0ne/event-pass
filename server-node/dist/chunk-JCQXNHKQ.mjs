import {
  prisma
} from "./chunk-KWBR5HY2.mjs";
import {
  BadRequest
} from "./chunk-4FNMEGUP.mjs";

// src/routes/get-badge.ts
import { z } from "zod";
async function getBadge(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/badge", {
    schema: {
      summary: "Gets badge for registered attendee",
      tags: ["attendees"],
      params: z.object({
        attendeeId: z.string().cuid()
      }),
      response: {
        200: z.object({
          badge: z.object({
            name: z.string().min(4),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInURL: z.string().url()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      select: {
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        id: attendeeId
      }
    });
    const baseUrl = `${request.protocol}://${request.hostname}`;
    const checkInURL = new URL(`/attendees/${attendeeId}/checkin`, baseUrl).href;
    if (attendee === null) {
      throw new BadRequest("No registered attendee conforms to the criteria given by the user agent.");
    }
    return reply.status(200).send({
      badge: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInURL: checkInURL.toString()
      }
    });
  });
}

export {
  getBadge
};
