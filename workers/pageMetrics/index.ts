import registerPromiseWorker from 'promise-worker/register';
import { metrics } from './metrics';

registerPromiseWorker(metrics);
