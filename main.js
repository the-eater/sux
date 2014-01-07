var spawn = require('child_process').spawn,
    events = require('events'),
    Sux = function(options) {
        this.options = {
            depth: 16,
            rate: 44100,
            channels: 2,
            type: 'wav',
            output: '-'
        }
        for (var key in options) {
            this.options[key] = options[key];
        }
        if (!options.input && !options.inputtype) {
            throw new Error("Missing input or inputtype");
        }
    };
Sux.prototype = Object.create(events.EventEmitter.prototype);

Sux.prototype.start = function() {
    var sux = this;
    this._exc = spawn(this.soxPath || Sux.soxPath, this.buildArguments());
    this._exc.on('error', function(err) {
        sux.emit('error', err);
    });
    this._exc.stderr.on('data', function(data) {
        var str = data.toString('utf-8');
        if (str.indexOf('sox WARN') == 0) {
            sux.emit('warning', str.substr(9));
        }
        if (str.indexOf('sox FAIL') == 0) {
            sux.emit('error', str.substr(9));
        }
    });
};

Sux.prototype. in = function() {
    if (this._exc)
        return this._exc.stdin;
    return null;
}

Sux.prototype.out = function() {
    if (this._exc)
        return this._exc.stdout;
    return null;
}

Sux.argMap = {
    'channels': '-c',
    'depth': '-b',
    'rate': '-r',
    'type': '-t'
};

Sux.prototype.buildArguments = function() {
    var opt = this.options;
    var args = opt.input ? [opt.input] : ['-t', opt.inputtype, '-'];
    Object.keys(Sux.argMap).forEach(function(name) {
        if (opt[name] && !(name == 'depth' && opt.type == 'mp3')) {
            args.push(Sux.argMap[name]);
            args.push(opt[name]);
        }
    })
    args = args.concat(opt.rawArg || []);
    args.push(this.options.output);
    return args;
};

Sux.soxPath = "sox";

module.exports = Sux;