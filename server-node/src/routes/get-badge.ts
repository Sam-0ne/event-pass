import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export default async function getBadge(app:FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
        schema: {
            summary: 'Gets badge for registered attendee',
            tags:['attendees'],
            params: z.object({
                attendeeId: z.coerce.number().int().positive()
            }),
            response: {
                200: z.object({
                    badge: z.object({
                        name: z.string().min(4),
                        email: z.string().email(),
                        eventTitle: z.string(),
                        checkInURL: z.string().url(),
                    })
                })
            },
        }
    }, async (request, reply) => {
        const {attendeeId} = request.params;

        const attendee = await prisma.attendee.findUnique({
            select:{
                name: true,
                email: true,
                event: {
                    select: {
                        title: true,
                    }
                },              
            },
            where: {
                id: attendeeId
            }
        });
        
        const baseUrl = `${request.protocol}://${request.hostname}`;

        const checkInURL = new URL(`/attendees/${attendeeId}/checkin`,baseUrl).href
       
        if (attendee === null) {
            const error = new Error("No registered attendee conforms to the criteria given by the user agent.");
            (error as any).status = 406;
            throw error;
        }

        return reply.status(200).send({
            badge:  {
                name: attendee.name,
                email: attendee.email,
                eventTitle: attendee.event.title,
                checkInURL: checkInURL.toString(),
            }                       
            
        })
    })

}