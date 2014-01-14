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
		// output location: '-' is streaming to NodeJS
		output:'-',
		// input file (a file has higher priority then a stream)
		// input: './test.mp3',
		// if using a input stream define here what file type is streamed in
		input: {
			// input source, can be a file or - which will indicate we need to read from the stream
			source:'-',
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
// pipe in.wav into the input of SoX
fs.createReadStream('./in.wav').pipe(sux.in());
// returns output stream of SoX
sux.out().pipe(fs.createWriteStream('./out.wav'));