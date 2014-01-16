sux
===

A wrapper around SoX

What is SoX?
=====

[SoX is the Swiss Army knife of sound processing programs.](http://sox.sourceforge.net/)


And what is sux?
=====

sux is a NodeJS wrapper around SoX with support for streams

Installation
======

```
npm i sux
```

Usage
====

```javascript

var Sux = require('sux'),
	fs  = require('fs'),
	sux = new Sux({
		// ouput bitdepth
		depth:16,
		// output samplerate
		rate: 44100,
		// amount of output channels
		channels: 2,
		// output file type
		type:'wav',
		// output needs to be a file path or a stream
		output:fs.createWriteStream('./out.wav'),
		// input file (a file has higher priority then a stream)
		// input: './test.mp3',
		// if using a input stream define here what file type is streamed in
		input: {
			// input source, can be a file or a stream
			source: fs.createReadStream('./in.wav'),
			// input type
			type:'wav',
			// amount of input channels
			channels:1,
			// sample rate
			rate:22050
		}
	});
// starts SoX with given options
sux.start();

```

# API


## `Sux`


### `.soxPath`

path to sox.
default:
 Windows: suxDir + '/win_libs/sox.exe'
 Other: 'sox'

### `.argMap`

arguments map, translates 'type' to '-t' etc.

## `new Sux(opt)`

Sux constructor
```
opt = {  
	type: file type f.x. "mp3"
	rate:samplerate  
	channels:amount of channels  
	depth: bitdepth  
	int: signedness (needs to be "signed" or "unsigned", for RAW),  
	bitrate: bitrate (for MP3's)  
	output: filename, '-' or stream
	input: {  
		type: file type f.x. "mp3"  
		rate:samplerate  
		channels:amount of channels  
		depth: bitdepth  
		int: signedness (needs to be "signed" or "unsigned", for RAW),  
		bitrate: bitrate (for MP3's)  
		source:filename, '-' or stream  
	},filename or '-'
}  
```

### `.start()`

starts the sox process and opens the streams (if there are any)

### `.out()`

sox output stream

### `.in()`

sox input stream

### `.err()`

sox error stream

### `.soxPath`

path to sox

### Events

#### error

emits when sox outputs an error

#### warning

emits when sox outputs a warning
