import express = require('express')
import {Express} from "express-serve-static-core";

import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors  from 'cors'
import { router as routes } from './routes/index';

export let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors({
  origin: '*',
  credentials: true,
  allowedHeaders: ['content-type', 'paywall-version', 'paywall-address', 'paywall-gateway', 'paywall-price', 'paywall-token', 'authorization'],
  exposedHeaders: ['paywall-version', 'paywall-address', 'paywall-gateway', 'paywall-price', 'paywall-token']
}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('v1/', routes);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  let err = new Error('Not Found');
  (err as any).status = 404;
  next(err);
});

if (app.get('env') === 'staging') {
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err.message)
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err.message)
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

