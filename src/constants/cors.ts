import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: ['https://pedidos-backend-bbln.vercel.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'credentials',
    'X-Requested-With',
    'Accept',
    'Origin',
    'cors',
    'cookie',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
  ],
  exposedHeaders: [
    'Authorization',
    'credentials',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Content-Type',
    'X-Requested-With',
    'Accept',
    'Origin',
    'cors',
  ],
};
