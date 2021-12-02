import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import http from 'k6/http';

export const options = {
  vus: 400,
  duration: '30s',
};

var myErrorCounter = new Counter("my_error_counter");

export default () => {
  const random = Math.floor(Math.random() * (112702 - 101432 + 1)) + 101432;
  const res = http.get(`http://localhost:3000/reviews/?product_id=${random}`);
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
  });
  if (res.status === 404) {
    myErrorCounter.add(1)
  };
  sleep(1.0);
};

// k6 run getReviews.js