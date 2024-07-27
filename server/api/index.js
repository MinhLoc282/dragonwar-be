import Express from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { CORS_OPTIONS } from '../config';
import errorHandler from './errorHandler';
import routeV1 from './v1';

const app = new Express();
// Note: All request handle use CORS must be write bellow CORS settings
app.use(cors(CORS_OPTIONS));
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use('/v1', routeV1);
app.use(errorHandler);

export default app;
