import {
  prisma
} from "./chunk-KWBR5HY2.mjs";
import {
  BadRequest,
  NotFound
} from "./chunk-4FNMEGUP.mjs";

// src/routes/checkin.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/checkin", {
    schema: {
      summary: "Checks-in attendee",
      tags: ["check-in"],
      params: z.object({
        attendeeId: z.coerce.number().int().positive()
      }),
      response: {
        200: z.object({
          checked: z.object({
            name: z.string().min(4),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInTime: z.string()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      select: {
        checkIn: true,
        name: true,
        email: true,
        event: true
      },
      where: {
        id: attendeeId
      }
    });
    if (!attendee) {
      throw new NotFound(`Attendee with ID ${attendeeId} not found.`);
    }
    if (attendee?.checkIn !== null) {
      throw new BadRequest(`Attendee already checked-in for this event at ${attendee?.checkIn}.`);
    }
    const checkInTime = /* @__PURE__ */ new Date();
    await prisma.attendee.update({
      where: {
        id: attendeeId
      },
      data: {
        checkIn: checkInTime
      }
    });
    return reply.status(200).send({
      checked: {
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInTime: checkInTime.toISOString()
      }
    });
  });
}

export {
  checkIn
};
