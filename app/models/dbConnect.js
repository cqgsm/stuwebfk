'use strict';
var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1/life';
mongoose.connect(url);
exports.mongoose = mongoose;