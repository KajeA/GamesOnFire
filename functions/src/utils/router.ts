import { Router, RouterOptions } from 'express';

export function createRouter(options: RouterOptions = {}): Router {
  return Router(options);
}
