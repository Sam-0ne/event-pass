import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
import createEvent from "./routes/create-event";
import registerAttendee from "./routes/register-attendee";
import getEvent from "./routes/get-event";
import getBadge from "./routes/get-badge";
import checkIn from "./routes/checkin";
import getEventAttendees from "./routes/get-event-attendees";

export const app = fastify();
app.register(fastifySwagger, {
    swagger:{
        consumes: ['application/json'],
        produces: ['application/json'],
        info:{
            title: 'event.pass',
            description: 'Back-end API specifications for event.pass application.',
            version: '1.0.0'
        },
    },
    transform: jsonSchemaTransform,
})


app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerAttendee);
app.register(getEvent);
app.register(getBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.get('/', () => {
    return "Server Online"
})

app.listen({port: 7777}).then(() => {
    console.log('HTTP server running....')

})
