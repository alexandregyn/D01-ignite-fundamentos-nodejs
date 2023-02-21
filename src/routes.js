
import { randomUUID } from 'node:crypto';
import { DataBase } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const dataBase = new DataBase();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = dataBase.select("tasks");
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
  
      dataBase.insert("tasks", task);
  
      res
        .writeHead(201)
        .end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const task = dataBase.select("tasks", { id })[0];

      dataBase.update("tasks", id, {
        ...task,
        title,
        description,
        updated_at: new Date()
      });
  
      res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const task = dataBase.select("tasks", { id })[0];

      dataBase.update("tasks", id, {
        ...task,
        completed_at: new Date()
      });
  
      res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      dataBase.delete("tasks", id);
      return res.writeHead(204).end();
    }
  }
]