const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Leaders = require('../models/leaders');
const cors = require('./cors');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId/feedback')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader.feedback);
        }
        else {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null) {
            leader.feedback.push(req.body);
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders/'
        + req.params.leaderId + '/feedback');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null) {
            for (var i = (leader.feedback.length -1); i >= 0; i--) {
                leader.feedback.id(leader.feedback[i]._id).remove();
            }
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

leaderRouter.route('/:leaderId/feedback/:feedbackId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.feedback.id(req.params.feedbackId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader.feedback.id(req.params.feedbackId));
        }
        else if (leader == null) {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Feedback ' + req.params.feedbackId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId
        + '/feedback/' + req.params.feedbackId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.feedback.id(req.params.feedbackId) != null) {
            if (req.body.rating) {
                leader.feedback.id(req.params.feedbackId).rating = req.body.rating;
            }
            if (req.body.feedback) {
                leader.feedback.id(req.params.feedbackId).feedback = req.body.feedback;                
            }
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else if (leader == null) {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Feedback ' + req.params.feedbackId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.feedback.id(req.params.feedbackId) != null) {
            leader.feedback.id(req.params.feedbackId).remove();
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else if (leader == null) {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Feedback ' + req.params.feedbackId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter;    