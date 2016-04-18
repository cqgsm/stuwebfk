var App = require("./lib/App"),
    app = new App(),
    middle01 = require('./show_middle/middle01'),
    middle02 = require('./show_middle/middle02');
app.use(middle01);
app.use(middle02);
app.listen(3000);

