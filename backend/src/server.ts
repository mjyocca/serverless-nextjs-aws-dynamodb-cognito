import 'tsconfig-paths/register';
import { server } from '@libs/app';
import { handlers } from '@functions/index';

const PORT = 5000;

const app = server();

handlers.forEach(({ path, handler }) => app.use(path, handler));

app.listen(PORT as number, () => {
  console.log(`listening on port:${PORT}, 🔥 http://localhost:${PORT} 🔥`);
});
