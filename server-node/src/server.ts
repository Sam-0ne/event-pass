import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import createEvent from "./routes/create-event";
import registerAttendee from "./routes/register-attendee";
import getEvent from "./routes/get-event";
import getBadge from "./routes/get-badge";
import checkIn from "./routes/checkin";
import getEventAttendees from "./routes/get-event-attendees";

const app = fastify();

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
