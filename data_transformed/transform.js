const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const ObjectsToCsv = require('objects-to-csv')

var meta = {};
var metaArray = [];
var count = 0;

fs.createReadStream(path.resolve(__dirname, 'reviews.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        if (meta[row.product_id]) {
            meta[row.product_id].ratings[row.rating]++;
            row.recommend === 'true' ? meta[row.product_id].recommend.true++ : meta[row.product_id].recommend.false++;
        } else {
            meta[row.product_id] = {
                product_id: row.product_id,
                ratings: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                },
                recommend: {
                    true: 0,
                    false: 0
                },
                characteristics: {}
            }
            meta[row.product_id].ratings[row.rating]++;
            row.recommend === 'true' ? meta[row.product_id].recommend.true++ : meta[row.product_id].recommend.false++;
        };
    })
    .on('end', () => {
        console.log('Parse through reviews is complete!')
        fs.createReadStream(path.resolve(__dirname, 'characteristics.csv'))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (meta[row.product_id]) {
                meta[row.product_id].characteristics[row.name] = {
                        id: row.id,
                        value: 'null',
                        counter: 1
                }
            }
        })
        .on('end', () => {
            console.log('Parse through characteristics is complete!')
            fs.createReadStream(path.resolve(__dirname, 'characteristic_reviews.csv'))
            .pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => {
                for (var i in meta) {
                    if (meta[i].characteristics) {
                        for (var j in meta[i].characteristics) {
                            if (meta[i].characteristics[j].id === row.characteristic_id) {
                                var previousValue = meta[i].characteristics[j].value;
                                var counter = meta[i].characteristics[j].counter;
                                if (counter === 1) {
                                    meta[i].characteristics[j].value = row.value;
                                    meta[i].characteristics[j].counter++;
                                } else if (counter > 1) {
                                    meta[i].characteristics[j].value = previousValue * ((counter - 1) / counter) + row.value * (1/counter);
                                    meta[i].characteristics[j].counter++;
                                }
                            }
                        }
                    }
                }
                count++
                console.log(`Parsed through ${count}/19,327,576 lines`)
            })
            .on('end', () => {
                console.log('Parse through characteristic_reviews is complete, now converting meta object to array!')
                for (key in meta) {
                    metaArray.push({
                        id: key,
                        rating_1: meta[key].ratings[1],
                        rating_2: meta[key].ratings[2],
                        rating_3: meta[key].ratings[3],
                        rating_4: meta[key].ratings[4],
                        rating_5: meta[key].ratings[5],
                        recommend_true: meta[key].recommend['true'],
                        recommend_false: meta[key].recommend['false'],
                        fit_id: meta[key].characteristics.Fit ? meta[key].characteristics.Fit.id : 'null',
                        fit_value: meta[key].characteristics.Fit ? meta[key].characteristics.Fit.value : 'null',
                        size_id: meta[key].characteristics.Size ? meta[key].characteristics.Size.id : 'null',
                        size_value: meta[key].characteristics.Size ? meta[key].characteristics.Size.value : 'null',
                        width_id: meta[key].characteristics.Width ? meta[key].characteristics.Width.id : 'null',
                        width_value: meta[key].characteristics.Width ? meta[key].characteristics.Width.value : 'null',
                        quality_id: meta[key].characteristics.Quality ? meta[key].characteristics.Quality.id : 'null',
                        quality_value: meta[key].characteristics.Quality ? meta[key].characteristics.Quality.value : 'null',
                        comfort_id: meta[key].characteristics.Comfort ? meta[key].characteristics.Comfort.id : 'null',
                        comfort_value: meta[key].characteristics.Comfort ? meta[key].characteristics.Comfort.value : 'null',
                        length_id: meta[key].characteristics.Length ? meta[key].characteristics.Length.id : 'null',
                        length_value: meta[key].characteristics.Length ? meta[key].characteristics.Length.value : 'null',
                    })
                }
                const csv = new ObjectsToCsv(metaArray);
                csv.toDisk('./data_transformed/products.csv')
                console.log('FINISHED!!!!!')
            });
        })
    });




