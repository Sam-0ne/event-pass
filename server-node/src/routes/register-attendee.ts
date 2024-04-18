import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest} from "./_errors";

export default async function registerAttendee(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventSlug/attendees', {
        schema: {
            summary: 'Create an attendee for given event URL slug link',
            tags: ['attendees'],
            body: z.object({
                name: z.string().min(4),
                email: z.string().email(),
            }),
            params: z.object({
                eventSlug: z.string(),
            }),
            response:{
                201: z.object({
                    attendeeId:z.string().cuid(),
                })
            }
        }
    }, async (request, reply) => {
        const { eventSlug } = request.params;
        const { name, email } = request.body;

        const getEventId = await prisma.event.findUnique({
            select: {
                id: true,                
            },
            where: {
                slug: eventSlug,
            }
        })

        if (getEventId == null){
            throw new BadRequest("No attendee conforms to the criteria given by the user agent.");             
        }

        const alreadyRegistered = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    email: email,
                    eventId: getEventId.id,
                }
            }
        });

        if (alreadyRegistered !== null) {
                
            throw new BadRequest("Attendee is already registered for this event.");            
        }

        const [event, numberOfRegisteredAttendees] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: getEventId.id,
                }
            }),

            prisma.attendee.count({
                where: {
                    eventId: getEventId.id,
                }
            })
        ])

       
        if (event?.maximumAttendees && numberOfRegisteredAttendees >= event?.maximumAttendees) {

            throw new BadRequest("This event has already reached its maximum attendance.");
        }

        const attendee = await prisma.attendee.create({
            data: {
                name: name,
                email: email,
                eventId: getEventId.id,
            },
        })
        return reply.status(201).send({ attendeeId: attendee.id})



    })
}