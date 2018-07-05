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
		console.log("test");  
		var ircClient = new irc.Client();  
		ircClient = parseUri(editor.document.uri);    
		ircClient.say(ircClient.channels[0], "I'm a bot!");  
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
