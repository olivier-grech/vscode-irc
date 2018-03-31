'use strict';

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
	const openIrcCommandRegistration = commands.registerTextEditorCommand('vscodeIrc.openIrc', editor => {
		let ircConfiguration = workspace.getConfiguration('irc');

		var server = ircConfiguration.get('server') as string;
		var port = ircConfiguration.get('port') as number;
		var channel = ircConfiguration.get('channel') as string;
		var nick = ircConfiguration.get('nick') as string;
		var ircInstance = new IrcInstance(server, port, channel, nick);

		askForServer(ircInstance, editor);
	});

	context.subscriptions.push(
		provider,
		openIrcCommandRegistration,
		providerRegistrations
	);
}

function askForServer(ircInstance: IrcInstance, editor) {
	let options: InputBoxOptions = {
		prompt: "Server: ",
		placeHolder: "server"
	}

	window.showInputBox(options).then(value => {
		ircInstance._server = value;
		askForPort(ircInstance, editor);
	});
}

function askForPort(ircInstance: IrcInstance, editor) {
	let options: InputBoxOptions = {
		prompt: "Port: ",
		placeHolder: "port"
	}

	window.showInputBox(options).then(value => {
		ircInstance._port = +value; // Cast value as a number
		askForChannel(ircInstance, editor);
	});
}

function askForChannel(ircInstance: IrcInstance, editor) {
	let options: InputBoxOptions = {
		prompt: "Channel: ",
		placeHolder: "channel (without the #)"
	}

	window.showInputBox(options).then(value => {
		ircInstance._channel = value;
		askForNick(ircInstance, editor);
	});
}

function askForNick(ircInstance: IrcInstance, editor) {
	let options: InputBoxOptions = {
		prompt: "Nick: ",
		placeHolder: "nick"
	}

	window.showInputBox(options).then(value => {
		ircInstance._nick = value;
		openIrcDocument(ircInstance, editor);
	});
}

function openIrcDocument(ircInstance: IrcInstance, editor) {
	const uri = generateUri(ircInstance);
	return workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc, editor.viewColumn + 1));
}
