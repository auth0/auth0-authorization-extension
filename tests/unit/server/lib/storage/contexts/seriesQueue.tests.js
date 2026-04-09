import { expect } from 'chai';
import seriesQueue from '../../../../../../server/lib/storage/contexts/seriesQueue';

// Wraps the queue's callback interface in a promise for easier assertions
function enqueue(queue, action) {
  return new Promise((resolve, reject) => {
    queue(action, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

describe('seriesQueue', () => {
  describe('callback-style tasks', () => {
    it('should execute a task and return the result', async () => {
      const queue = seriesQueue();
      const result = await enqueue(queue, (cb) => cb(null, 'hello'));
      expect(result).to.equal('hello');
    });

    it('should pass an error to the callback', async () => {
      const queue = seriesQueue();
      const error = new Error('fail');
      try {
        await enqueue(queue, (cb) => cb(error));
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('promise-returning tasks', () => {
    it('should execute a task and return the result', async () => {
      const queue = seriesQueue();
      const result = await enqueue(queue, () => Promise.resolve('hello'));
      expect(result).to.equal('hello');
    });

    it('should pass a rejection to the callback', async () => {
      const queue = seriesQueue();
      const error = new Error('fail');
      try {
        await enqueue(queue, () => Promise.reject(error));
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe('sequential execution', () => {
    it('should execute tasks in the order they were added', async () => {
      const queue = seriesQueue();
      const order = [];

      const t1 = enqueue(queue, () => new Promise((resolve) => setTimeout(() => {
        order.push(1);
        resolve();
      }, 20)));

      const t2 = enqueue(queue, () => {
        order.push(2);
        return Promise.resolve();
      });

      await Promise.all([ t1, t2 ]);
      expect(order).to.deep.equal([ 1, 2 ]);
    });

    it('should not start a task until the previous one has completed', async () => {
      const queue = seriesQueue();
      let firstComplete = false;
      let secondStartedEarly = false;

      const t1 = enqueue(queue, () => new Promise((resolve) => {
        setTimeout(() => {
          firstComplete = true;
          resolve();
        }, 20);
      }));

      const t2 = enqueue(queue, () => {
        secondStartedEarly = !firstComplete;
        return Promise.resolve();
      });

      await Promise.all([ t1, t2 ]);
      expect(secondStartedEarly).to.be.false;
    });

    it('should process multiple tasks in sequence', async () => {
      const queue = seriesQueue();
      const results = await Promise.all([
        enqueue(queue, (cb) => cb(null, 1)),
        enqueue(queue, (cb) => cb(null, 2)),
        enqueue(queue, (cb) => cb(null, 3))
      ]);
      expect(results).to.deep.equal([ 1, 2, 3 ]);
    });

    it('should continue processing queued tasks after a failure', async () => {
      const queue = seriesQueue();

      const failing = enqueue(queue, () => Promise.reject(new Error('fail')));
      const succeeding = enqueue(queue, (cb) => cb(null, 'ok'));

      await failing.catch(() => {});
      const result = await succeeding;
      expect(result).to.equal('ok');
    });
  });
});
