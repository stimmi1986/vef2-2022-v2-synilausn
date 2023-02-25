import express from 'express';
import { validationResult } from 'express-validator';
import { catchErrors } from '../lib/catch-errors.js';
import { countEvents, listEvent, listEvents, listRegistered, register } from '../lib/db.js';
import { paging, setPagenumber } from '../lib/utils.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware,
} from '../lib/validation.js';


export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const currentPage = setPagenumber(req.query.page);
  const limit = 10;
  const offset = (currentPage - 1) * limit;
  const events = await listEvents();

  const totalEvents = await countEvents();
  const eventsLength = events.length;
  const baseUrl = req.originalUrl.replace(/(\?|&)page=\d+/, '');
  const pagination = await paging({
    page: currentPage,
    limit,
    offset,
    totalEvents,
    eventsLength,
    baseUrl,
  });

  res.render('index', {
    title: 'Viðburðasíðan',
    admin: false,
    events,
    paging: {
      hasPrev: pagination.hasPrev,
      prevUrl: pagination.prevUrl,
      hasNext: pagination.hasNext,
      nextUrl: pagination.nextUrl,
    },
  });
}

async function eventRoute(req, res, next) {
  const { slug } = req.params;
  const event = await listEvent(slug);

  if (!event) {
    return next();
  }

  const registered = await listRegistered(event.id);
  
  return res.render('event', {
    title: `${event.name} — Viðburðasíðan`,
    event,
    registered,
    errors: [],
    data: {},
  });
}

async function eventRegisteredRoute(req, res) {
  const events = await listEvents();

  res.render('registered', {
    title: 'Viðburðasíðan',
    events,
  });
}

async function validationCheck(req, res, next) {
  const { name, comment } = req.body;

  // TODO tvítekning frá því að ofan
  const { slug } = req.params;
  const event = await listEvent(slug);
  const registered = await listRegistered(event.id);

  const data = {
    name,
    comment,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.render('event', {
      title: `${event.name} — Viðburðasíðan`,
      data,
      event,
      registered,
      errors: validation.errors,
    });
  }

  return next();
}

async function registerRoute(req, res) {
  const { name, comment } = req.body;
  const { slug } = req.params;
  const event = await listEvent(slug);

  const registered = await register({
    name,
    comment,
    event: event.id,
  });

  if (registered) {
    return res.redirect(`/${event.slug}`);
  }

  return res.render('error');
}

indexRouter.get('/', catchErrors(indexRoute));
indexRouter.get('/:slug', catchErrors(eventRoute));
indexRouter.post(
  '/:slug',
  registrationValidationMiddleware('comment'),
  xssSanitizationMiddleware('comment'),
  catchErrors(validationCheck),
  sanitizationMiddleware('comment'),
  catchErrors(registerRoute)
);
indexRouter.get('/:slug/thanks', catchErrors(eventRegisteredRoute));
