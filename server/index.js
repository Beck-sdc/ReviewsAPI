const express = require('express')
const app = express()
const port = 3000
const api = require('../database/models.js')

app.use(express.json());
app.use(express.urlencoded());

app.put('/reviews/:review_id/helpful', (req, res) => {
  api.updateHelpful(req.params.review_id, (err, response) => {
    if(err) {
      console.log(err)
      res.status(500)
    } else {
      res.status(201).send('Succesfully marked review as helpful')
    }
  })
})

app.put('/reviews/:review_id/report', (req, res) => {
  api.report(req.params.review_id, (err, response) => {
    if(err) {
      console.log(err)
      res.status(500)
    } else {
      res.status(201).send('Succesfully reported the review')
    }
  })
})

app.get('/reviews/meta/:product_id', (req, res) => {
  console.log('req.params: ', req.params)
  api.getMetadata(req.params.product_id, (err, meta) => {
    console.log('meta:', meta)
    if (err) { console.log (err); }
    var data = meta.rows[0];

    if (data.fit_id || data.fit_value) {
      var fit = {
        id: data.fit_id,
        value: data.fit_value
      }
    }
    if (data.size_id || data.size_value) {
      var size = {
        id: data.size_id,
        value: data.size_value
      }
    }
    if (data.width_id || data.width_value) {
      var width = {
        id: data.width_id,
        value: data.width_value
      }
    }
    if (data.quality_id || data.quality_value) {
      var quality = {
        id: data.quality_id,
        value: data.quality_value
      }
    }
    if (data.comfort_id || data.comfort_value) {
      var comfort = {
        id: data.comfort_id,
        value: data.comfort_value
      }
    }
    if (data.length_id || data.length_value) {
      var length = {
        id: data.length_id,
        value: data.length_value
      }
    }

    var polishedData = {
      product_id: data.id,
      ratings: {
        1: data.rating_1,
        2: data.rating_2,
        3: data.rating_3,
        4: data.rating_4,
        5: data.rating_5
      },
      recommended: {
        true: data.recommend_true,
        false: data.recommend_false
      },
      characteristics: {
        fit: fit || null,
        size: size || null,
        width: width || null,
        quality: quality || null,
        comfort: comfort || null,
        length: length || null
      }
    }

    res.status(200).json(polishedData);
  })
})

 app.get('/reviews/:product_id/:page?/:count?/:sort?', (req, res) => {
  api.getReviews(req.params.product_id, (err, reviews) => {
    if (err) { console.log (err); }

    var page = req.params.page || 1
    var count = req.params.count || 5
    var stagedReviews = {};
    var polishedData = {
      product: `${req.params.product_id}`,
      page: page,
      count: count,
      results: []
    }

    reviews.rows.forEach( element => {
      if (!element.reported) {
        var data = {
          review_id: element.review_id,
          rating: element.rating,
          summary: element.summary,
          recommend: element.recommend,
          response: element.response,
          body: element.body,
          date: element.date,
          reviewer_name: element.reviewer_name,
          helpfulness: element.helpfulness,
          photos: []
        }

        if (element.origin_id !== element.review_id) { // i.e. has no photos
          stagedReviews[element.review_id] = data
        } else if (element.origin_id === element.review_id && !stagedReviews[element.review_id]) { // has photos, is not already staged
          data.photos.push({ id: element.photo_id, url: element.url })
          stagedReviews[element.review_id] = data;
        } else if (element.origin_id === element.review_id && stagedReviews[element.review_id]) { // has photos, is already staged
          stagedReviews[element.review_id].photos.push({ id: element.photo_id, url: element.url })
        }
      }
    })

    for (key in stagedReviews) {
      polishedData.results.push(stagedReviews[key]);
    }

    console.log('stagedReviews: ', stagedReviews[5])
    res.status(200).send(polishedData);
  })
})

app.post('/reviews', (req, res) => {
  api.addReview(req.body, (err, response) => {
    if (err) { console.log(err); }

    api.getMetadata(req.body.product_id, (err, meta) => {
      if (err) { console.log(err); }

      data = meta.rows[0];
      chars = req.body.characteristics

      data[`rating_${req.body.rating}`]++
      data[`recommend_${req.body.recommend}`]++
      for (key in chars) {
        if (Number(key) === data['fit_id']) {
          var weight = data['fit_counter'];
          var newVal = data['fit_value'] * (weight-1) / weight + chars[key] / weight
          data['fit_value'] = newVal;
          weight++
        }
        if (Number(key) === data['size_id']) {
          var weight = data['size_counter'];
          var newVal = data['size_value'] * (weight-1) / weight + chars[key] / weight
          data['size_value'] = newVal;
          data['size_counter']++
        }
        if (Number(key) === data['width_id']) {
          var weight = data['width_counter'];
          var newVal = data['width_value'] * (weight-1) / weight + chars[key] / weight
          data['width_value'] = newVal;
          data['width_counter']++
        }
        if (Number(key) === data['quality_id']) {
          var weight = data['quality_counter'];
          var newVal = data['quality_value'] * (weight-1) / weight + chars[key] / weight
          data['quality_value'] = newVal;
          data['quality_counter']++
        }
        if (Number(key) === data['comfort_id']) {
          var weight = data['comfort_counter'];
          var newVal = data['comfort_value'] * (weight-1) / weight + chars[key] / weight
          data['comfort_value'] = newVal;
          data['comfort_counter']++
        }
        if (Number(key) === data['length_id']) {
          var weight = data['length_counter'];
          var newVal = data['length_value'] * (weight-1) / weight + chars[key] / weight
          data['length_value'] = newVal;
          data['length_counter']++
        }
      }

      var updatedMetadata = Object.keys(data).map(function (key) {
        return data[key];
     });

      api.updateMetadata(updatedMetadata, (err, response) => {
        if (err) { console.log(err); }

        var photos = req.body.photos;
        var promiseArray = [];
        for(var i = 0; i < photos.length; i++) {
          var query = api.addPhoto(req.body.review_id, req.body.product_id, photos[i], (err, response) => {
            if(err) { console.log(err) }
            return;
          })
          promiseArray.push(query)
        }

        Promise.all(promiseArray)
        .then( res.status(201).send(`Successfully added review.`))
        .catch( err => console.log(err))
      })
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})