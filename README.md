# vscode-irc README

This extension allows to open an IRC channel as a new tab in Visual Studio Code.

## Features

Very barebones but functionnal.

Use the **Open IRC** command to be asked for a server address, port, channel
and nick.

Use the **Send message** command when a IRC channel is opened in the active text
editor to be asked for a message.

## Known Issues

## Release Notes

### 0.3.0

Add the following features:
* Ask the user for a message to send when using the **Send message** command.

Fix the following issues:
* It was not possible to open an IRC channel if there was no active text editor.

### 0.2.1

Fix the following issues:
* Icon background was not fully transparent
* The wrong message was displayed when an user parted the channel

### 0.2.0

Add the following features:
* Ask the user for server address, port, channel and nick (instead of reading
the configuration)
* Display a message when an user part the channel
* Display the server address as the tab title
* Add an icon

### 0.1.0

Alpha release of **vscode-irc**. 
