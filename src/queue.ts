import BullQueue from 'bull';
import { QUEUE_HOST } from '@config';
import ResizerJob from './jobs/resizer.job';

export const ImageQueue = new BullQueue('image resize', QUEUE_HOST);

class Queue {
  public start() {
    ImageQueue.process(ResizerJob);
  }
}

export default Queue;
