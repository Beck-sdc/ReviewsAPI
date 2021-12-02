import http from 'k6/http';
import { sleep, check } from 'k6';


export const options = {
  vus: 10,
  duration: '15s',
};

export default function () {
  const url = 'http://localhost:3000/reviews';
  const payload = {
    '"product_id"': 1,
    '"rating"': 3,
    '"summary"': '"Some random text here"',
    '"body"': '"The body of this review"',
    '"recommend"': true,
    '"name"': '"Brett Roberts"',
    '"email"': '"myemail@gmail.com"',
    '"photos"': [],
    '"characteristics"': {}
  }

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post(url, payload, params);
  check(res, {
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
  })
  sleep(1);
}

// k6 run postReview.js