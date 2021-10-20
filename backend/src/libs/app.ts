import { App } from '@tinyhttp/app';
import { json } from 'milliparsec';
import type { Request, Response } from '@tinyhttp/app';

const app = new App();

app.use(json());

export { app };

export type { Request, Response };

export const server = () => {
  const _app = new App();
  _app.use(json());
  return _app;
};
