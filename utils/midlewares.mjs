// const loggingMidleware = (request, response, next) => {
//     console.log(`${request.method} - ${request.url}`)
//     next()
// }
// app.use(loggingMidleware)

import { request, response } from "express";

export const resolveIndexById = (array) => (request, response, next) => {
  const {
    params: { id },
  } = request;
  const findIndex = array.findIndex((item) => item.id === id);
  if (findIndex === -1) return response.sendStatus(400);
  request.findIndex = findIndex;
  next();
};

export const resolveItemById = (array) => (request, response, next) => {
  const {
    params: { id },
  } = request;
  const item = array.find((item) => item.id === id);
  if (!item) return response.sendStatus(400);
  request.item = item;
  next();
};

export const isAuth = (request, response, next) => {
  if(request.isAuthenticated()) return next()
  response.redirect('/login')
}