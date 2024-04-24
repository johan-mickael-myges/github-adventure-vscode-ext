// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "githubadventure" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('githubadventure.go', () => {
		// Open a modal with buttons
		vscode.window.showInformationMessage('Welcome to the GitHub Adventure! 🚀', 'Start Adventure', 'Cancel').then((selection) => {
			if (selection === 'Start Adventure') {
				// Open the GitHub Adventure page
				vscode.env.openExternal(vscode.Uri.parse('https://play.workadventu.re/_/hpez01wdr5f/localhost:8877/map/aHR0cHM6Ly9naXRodWIuY29tL3dvcmthZHZlbnR1cmUvc2NyaXB0aW5nLWFwaS1leHRyYQ=='));
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
