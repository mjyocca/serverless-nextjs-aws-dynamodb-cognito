import "tsconfig-paths/register";
import { server } from "@libs/app";
import { handler as worldHandler } from "@functions/world/handler";
import { handler as helloHandler } from "@functions/hello/handler";

const PORT = 5000;

const app = server();
/* Function List */
app.use(`/hello`, helloHandler);
app.use(`/world`, worldHandler);

app.listen(PORT as number, () => {
	console.log(`listening on port:${PORT}, 🔥 http://localhost:${PORT} 🔥`);
});
