import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { number } from "zod";
import { prisma } from "../lib/prisma";

export default async function checkIn(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/checkin', {
        schema: {
            params: z.object({
                attendeeId: z.coerce.number().int().positive()
            }),
            response: {
                200: z.object({
                    checked: z.object({
                        name: z.string().min(4),
                        email: z.string().email(),
                        eventTitle: z.string(),
                        checkInTime: z.string(),
                    })
                })
            },
        }
        
    }, async (request,reply) => {
        const {attendeeId} = request.params;

        const attendee = await prisma.attendee.findUnique({
            select:{
                checkIn: true,
                name: true,
                email: true,
                event: true,                           
            },
            where: {
                id: attendeeId
            }
        });

        if (!attendee) {
            const error = new Error(`Attendee with ID ${attendeeId} not found.`);
            (error as any).status = 404;
            throw error;
        }
        
        if (attendee?.checkIn !== null){
            const error = new Error(`Attendee already checked-in for this event at ${attendee?.checkIn}.`);
            (error as any).status = 409;
            throw error;
        }
        const checkInTime = new Date();

        await prisma.attendee.update({
            where: {
                id: attendeeId
            },
            data:{
                checkIn: checkInTime,
            }
        })
        
        return reply.status(200).send({
            checked: {
                name: attendee.name,
                email: attendee.email,
                eventTitle: attendee.event.title,
                checkInTime: checkInTime.toISOString(),
            },         
            
        })

    })
}