import { FastifyInstance } from "fastify";
import { number, object, string, z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export default async function getEventAttendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', {
        schema: {
            params: z.object({
                eventId: z.string().uuid(),
            }),

            response:{
                200:z.object({
                    event: z.object({
                    id: z.string(),
                    title: z.string(),
                    details: z.string().nullable(),
                    slug: z.string(),
                    maximumAttendees: z.number().int().positive().nullable(),
                    attendees_list: z.array(z.object({
                        id: z.number().positive().int(),
                        name: z.string().min(4),
                        email: z.string().email(),
                        eventId: z.string().uuid(),
                        registryDate: z.date(),
                        checkIn: z.date().nullable(),
                    })),
                    })
                }),
            }

        }
    }, async (request, reply) => {
        const { eventId } = request.params;

        const event = await prisma.event.findUnique({
            select: {
                id: true,
                title: true,
                details:true,
                maximumAttendees: true,
                slug: true,
                attendees: true,
            },
        where: {
            id:eventId,
        }
        })

        if (event == null){
            const error = new Error("No event conforms to the criteria given by the user agent.");
            (error as any).status = 406;
            throw error; 
        }
        return reply.status(200).send({event:{
            id: event.id,
            title: event.title,
            details: event.details,
            slug: event.slug,
            maximumAttendees: event.maximumAttendees,
            attendees_list: event.attendees,
        }})


    })

}