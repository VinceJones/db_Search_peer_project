var express = require('express');
var router = express.Router();
var assignments = require('../models/assignment');
var moment = require('moment');

/* GET /assignments listing. */
router.get('/', function(req, res, next) {
  assignments.find(function (err, assignments) {
    if (err) return next(err);
    res.json(assignments);
  });
});

/* POST /assignments */
router.post('/', function(req, res, next) {
  assignments.create(req.body, function (err, assignment) {
    if (err) return next(err);
    res.json(assignment);
  });
});

/* GET /assignments/id */
router.get('/search', function(req, res, next) {
    console.log("Search Happens");

    var someObject = {};
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    console.log("Name: "+req.query.name+" Start date: "+startDate+" End Date:"+endDate+" Direction: "+ req.query.sortOrder);

    if (startDate == undefined || endDate == undefined) {
        endDate = moment().startOf('day');
        startDate = moment(endDate).add(-1000, 'years');
    }

    if ( startDate == moment(endDate).add(-1000, 'years') ) {
        someObject.name = req.query.sortOrder;
    } else {
        someObject.date_completed= req.query.sortOrder;
    }

  assignments.find({name: new RegExp(req.query.name, 'i'), date_completed: {$gte: startDate, $lte: endDate}},
          null,
          {
            sort: someObject
          },
          function (err, assignment) {
              if (err) {
                  console.log("Error ",err);
                  return next(err);
              }
              res.json(assignment);
          });
});

/* PUT /assignments/:id */
router.put('/:id', function(req, res, next) {
  assignments.findByIdAndUpdate(req.params.id, req.body, function (err, assignment) {
    if (err) return next(err);
    res.json(assignment);
  });
});

/* DELETE /assignments/:id */
router.delete('/:id', function(req, res, next) {
  assignments.findByIdAndRemove(req.params.id, req.body, function (err, assignment) {
    if (err) return next(err);
    res.json(assignment);
  });
});

console.log('assignments route loaded');
module.exports = router;
