import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const router = routes.find(route => {
    return route.method === method && route.path.test(url)
  });

  if (router) {
    const routeParams = req.url.match(router.path);
    const { ...params } = routeParams.groups;
    req.params = params;
    return router.handler(req, res);
  }

  return res.writeHead(404).end()
})

server.listen(3333)