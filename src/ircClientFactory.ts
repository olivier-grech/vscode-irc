// Provides an IRC client for the given IRC instance, assuring that not two
// clients are created for a given instance

'use strict';

import * as irc from 'irc';
import IrcInstance from './ircInstance';

export default class IrcClientFactory {
    // The list of already existing clients
    private _clients: irc.Client[];
 
    constructor () {
        this._clients = [];
    }
 
    public getClientFromInstance(ircInstance: IrcInstance) {
        // Check if a clients for the given instance already exists
        for (let client of this._clients) {
            if (client.opt.server == ircInstance._server &&
                client.opt.port == ircInstance._port &&
                client.opt.channels[0].substr(1) == ircInstance._channel &&
                client.opt.nick == ircInstance._nick
            ) {
                console.log("An already existing client was found");
                return client;
            }
        }

        // Return a new client if none was found, and add it to the list
        var newClient = new irc.Client(ircInstance._server, ircInstance._nick, {
            channels: ['#' + ircInstance._channel]
        });
        this._clients.push(newClient);
        return newClient;
    }
}
