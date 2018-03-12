'use strict';

import { workspace, languages, window, commands, ExtensionContext, Disposable } from 'vscode';
import ContentProvider, { generateUri } from './provider';
import IrcInstance from './ircInstance';

export function activate(context: ExtensionContext) {

	const provider = new ContentProvider();
	const providerRegistrations = Disposable.from(
		workspace.registerTextDocumentContentProvider(ContentProvider.scheme, provider)
	);
	
	// Register command that crafts an uri
	// Open the dynamic document, and shows it in the next editor
	const commandRegistration = commands.registerTextEditorCommand('extension.openIrc', editor => {
		let ircConfiguration = workspace.getConfiguration('irc');
		
		var server = ircConfiguration.get('server') as string;
		var port = ircConfiguration.get('port') as number;
		var channel = ircConfiguration.get('channel') as string;
		var nick = ircConfiguration.get('nick') as string;
		var ircInstance = new IrcInstance(server, port, channel, nick);
		
		const uri = generateUri(ircInstance);
		return workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc, editor.viewColumn + 1));
	});

	context.subscriptions.push(
		provider,
		commandRegistration,
		providerRegistrations
	);
}
