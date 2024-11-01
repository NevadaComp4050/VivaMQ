import cors from 'cors';
import nocache from 'nocache';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import passport from 'passport';
import { createProxyMiddleware } from 'http-proxy-middleware';
import home from './home';
import environment from './lib/environment';
import expressJSDocSwaggerConfig from './config/express-jsdoc-swagger.config';
import appConfig from './config/app.config';
import errorHandler from '@/middlewares/error-handler';
import routes from '@/modules/index';
import prismaClient from '@/lib/prisma';
import { configurePassport } from '@/middlewares/passport-config';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.disableSettings();
    this.setRoutes();
    this.setErrorHandler();
    this.initializeDocs();
  }

  private setMiddlewares(): void {
    this.express.use(
      cors({
        origin: (origin, callback) => {
          console.log(`Incoming origin: ${origin}`);
          const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:8080',
            'https://app.vivamq.app',
            'https://vivamq.app',
            'https://www.app.vivamq.app/api-service',
            'https://www.app.vivamq.app/api',
          ];
          if (!origin) {
            // Allow requests with no origin (e.g., mobile apps, curl requests)
            callback(null, true);
          } else if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            console.error(`CORS error: Origin ${origin} not allowed`);
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
          'Authorization',
          'Content-Type',
          'Accept',
          'Origin',
          'X-Requested-With',
        ],
        credentials: true,
      })
    );

    this.express.use(morgan('dev'));
    this.express.use(nocache());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(helmet());
    this.express.use(express.static('public'));

    this.express.use(
      '/api-service',
      createProxyMiddleware({
        target: 'https://app.vivamq.app',
        changeOrigin: true,
        pathRewrite: { '^/api-service': '/api' },
        secure: true,
      })
    );

    configurePassport();
    this.express.use(passport.initialize());
  }

  private disableSettings(): void {
    this.express.disable('x-powered-by');
  }

  private setRoutes(): void {
    const {
      api: { version },
    } = appConfig;
    const { env } = environment;
    this.express.use('/', home);
    this.express.use(`/api/${version}/${env}`, routes);
  }

  private setErrorHandler(): void {
    this.express.use(errorHandler);
  }

  private initializeDocs(): void {
    expressJSDocSwagger(this.express)(expressJSDocSwaggerConfig);
  }

  public async connectPrisma(): Promise<void> {
    await prismaClient.$connect();
  }
}

export default App;
