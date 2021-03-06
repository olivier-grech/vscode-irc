'use strict';

import * as irc from 'irc';
import { workspace, languages, window, commands, ExtensionContext, Disposable, InputBoxOptions } from 'vscode';  
import ContentProvider, { generateUri } from './provider';
import IrcInstance from './ircInstance';

export function activate(context: ExtensionContext) {

	const provider = new ContentProvider();
	const providerRegistrations = Disposable.from(
		workspace.registerTextDocumentContentProvider(ContentProvider.scheme, provider)
	);

	// Register command that crafts an uri
	// Open the dynamic document, and shows it in the next editor
	const openIrcCommandRegistration = commands.registerCommand('vscodeIrc.openIrc', () => {
		let ircConfiguration = workspace.getConfiguration('irc');

		askUserForIrcInstance().then(value => {
			openIrcDocument(value);
		});
	});

	const sendMessageCommandRegistration = commands.registerTextEditorCommand("vscodeIrc.sendMessage", editor => {  
		// Get the URI of the active tab
		// If we can get an IRC client from it, send a message!
		var ircClient = new irc.Client();
		ircClient = provider.getClientFromUri(editor.document.uri);

		// Find the name of the channel in the JavaScript object
		// TODO: this is quite ugly, maybe find a more elegant way
		var channelName = ircClient.chans[Object.keys(ircClient.chans)[0]].key;

		askUserForValue('Message', 'message').then(value => {
			ircClient.say(channelName, value);  
		})
	});

	context.subscriptions.push(
		provider,
		openIrcCommandRegistration,
		sendMessageCommandRegistration, 
		providerRegistrations
	);
}

async function askUserForIrcInstance() {
	var server = await askUserForValue('Server', 'server');
	var port = await askUserForValue('Port', 'port');
	var channel = await askUserForValue('Channel', 'channel (without the #)');
	var nick = await askUserForValue('Nick', 'nick');
	return new IrcInstance(server, port, channel, nick);
}

function askUserForValue(prompt: string, placeholder: string) {
	let options: InputBoxOptions = {
		prompt: prompt,
		placeHolder: placeholder
	}

	return window.showInputBox(options)
}

function openIrcDocument(ircInstance: IrcInstance) {
	const uri = generateUri(ircInstance);
	return workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc));
}
