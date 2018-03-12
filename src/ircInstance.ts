'use strict';

export default class IrcInstance {
	public _server: string;
	public _port: number;
	public _channel: string;
	public _nick: string;

	constructor(server: string, port: number, channel: string, nick: string) {
		this._server = server;
		this._port = port;
		this._channel = channel;
		this._nick = nick;
	}
} 
