import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from 'zod';
import generateSlug from "../utils/slug-generator";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export default async function createEvent(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                summary: 'Creates an event',
                tags: ['events'],
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),                    
                }),
                response: {
                    201: z.object({
                        eventId:z.string().uuid(),
                    })
                }
            }
        }, async (request, reply) => {
            const data = request.body;
            const slug = generateSlug(data.title);

            const sameSlugEvent = await prisma.event.findUnique({
                where: {
                    slug,
                }
            });

            if (sameSlugEvent !== null) {
                
                const error = new Error("There is already another event with the same slug.");
                (error as any).status = 409;
                throw error;
            }

            const event = await prisma.event.create({
                data: {
                    title: data.title,
                    details: data.details,
                    maximumAttendees: data.maximumAttendees,
                    slug: slug,
                },
            })
            return reply.status(201).send({eventId: event.id})
        })
}