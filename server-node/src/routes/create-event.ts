import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { string } from 'zod';
import generateSlug from "../utils/slug-generator";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest, Conflict } from "./_errors";

export default async function createEvent(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                summary: 'Creates an event',
                tags: ['events'],
                body: z.object({
                    title: z.coerce.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),                    
                }),
                response: {
                    201: z.object({
                        eventId:z.string().uuid(), slug:string()
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
                
                throw new BadRequest("There is already another event with the same URL slug.");
                
            }

            const event = await prisma.event.create({
                data: {
                    title: data.title,
                    details: data.details,
                    maximumAttendees: data.maximumAttendees,
                    slug: slug,
                },
            })
            return reply.status(201).send({eventId: event.id, slug: event.slug })
        })
}