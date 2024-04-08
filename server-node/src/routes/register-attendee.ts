import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export default async function registerAttendee(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                email: z.string().email(),
            }),
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response:{
                201: z.object({
                    attendeeId:z.number(),
                })
            }
        }
    }, async (request, reply) => {
        const { eventId } = request.params
        const { name, email } = request.body

        const alreadyRegistered = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    email,
                    eventId
                }
            }
        });

        if (alreadyRegistered !== null) {
                
            const error = new Error("Attendee is already registered for this event.");
            (error as any).status = 409;
            throw error;
        }

        const [event, numberOfRegisteredAttendees] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId,
                }
            }),

            prisma.attendee.count({
                where: {
                    eventId,
                }
            })
        ])

       
        if (event?.maximumAttendees && numberOfRegisteredAttendees >= event?.maximumAttendees) {

            const error = new Error("This event has already reached its maximum attendance.");
            (error as any).status = 409;
            throw error;
        }

        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            },
        })
        return reply.status(201).send({ attendeeId: attendee.id})



    })
}