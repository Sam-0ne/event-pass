import { FastifyInstance } from "fastify";
import { number, object, string, z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export default async function getEventAttendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', {
        schema: {
            summary: 'Gets attendees registered for given event',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            querystring : z.object({
                query: z.string().optional().nullish(),
            }),

            response:{
                200:z.object({
                    registeredAttendees: number().int().optional(),
                    attendees: z.array(z.object({
                        id: z.number().positive().int(),
                        name: z.string().min(4),
                        email: z.string().email(),
                        eventId: z.string().uuid(),
                        registryDate: z.date(),
                        checkIn: z.date().nullable(),
                    })),
                    
                }),
            }

        }
    }, async (request, reply) => {
        const { eventId } = request.params;
        const { query } = request.query;

        const attendees = await prisma.attendee.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                eventId:true,
                registryDate:true,
                checkIn: true,
            },
        where: query ? {
            eventId,
            name: {
                contains: query,
            }
        } : {
            eventId,
        },
        orderBy: {
            registryDate: 'asc'
        }
        })

        if (attendees == null){
            const error = new Error("No attendee conforms to the criteria given by the user agent.");
            (error as any).status = 406;
            throw error; 
        }
        return reply.status(200).send({registeredAttendees : attendees.length,
            attendees: attendees.map( attendee => {
                return {
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                    eventId:attendee.eventId,
                    registryDate:attendee.registryDate,
                    checkIn: attendee.checkIn,
                }
            })
        })

    })

}