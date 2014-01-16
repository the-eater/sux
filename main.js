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
        if (!options.input) {
            throw new Error("Missing input");
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
    if (this.options.input.readable) {
        this.options.input.pipe(this. in ());
    } else if (this.options.input.source && this.options.input.source.readable) {
        this.options.input.source.pipe(this. in ())
    }
    if (this.options.output.writable) {
        this.out().pipe(this.options.output)
    }
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

Sux.prototype.err = function() {
    if (this._exc)
        return this._exc.stderr;
    return null;
}

Sux.argMap = {
    'channels': '-c',
    'depth': '-b',
    'rate': '-r',
    'type': '-t',
    'bitrate': '-C',
    'int': '-e'
};

Sux.buildIOArguments = function(opt, source) {
    var args = [];
    Object.keys(Sux.argMap).forEach(function(name) {
        if (opt[name] && !(name == 'depth' && opt.type == 'mp3')) {
            args.push(Sux.argMap[name]);
            args.push(opt[name]);
        }
    });
    if (source || opt.source) args.push(source || ((opt.source && opt.source.readable) ? '-' : opt.source));
    return args;
}

Sux.prototype.buildArguments = function() {
    var opt = this.options;
    var args = typeof(opt.input) == 'object' && !opt.input.readable ? Sux.buildIOArguments(opt.input) : [opt.input.readable ? '-' : opt.input];
    args = args.concat(Sux.buildIOArguments(opt))
    args = args.concat(opt.rawArg || []);
    args.push(this.options.output.writable ? '-' : this.options.output);
    return args;
};

Sux.soxPath = process.platform == 'win32' ? __dirname + '\\win_libs\\sox.exe' : "sox";

module.exports = Sux;