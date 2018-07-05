'use strict';

export default class IrcInstance {
	public _server: string;
	public _port: number;
	public _channel: string;
	public _nick: string;

	constructor(server: string, port: string, channel: string, nick: string) {
		this._server = server;
		this._port = +port;
		this._channel = channel;
		this._nick = nick;
	}

	setServer(server: string) {
		this._server = server;
	}

	setPort(port: string) {
		this._port = +port;
	}

	setChannel(channel: string) {
		this._channel = channel;
	}

	setNick(nick: string) {
		this._nick = nick;
	}
} 
