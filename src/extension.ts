// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import simpleGit from 'simple-git';

import dotenv from 'dotenv';
dotenv.config();

const YES = 'YES';
const NO = 'NO';

async function goToGithubAdventureHomeCTA(
	message: string = 'You are not in a Git repository. Would you like to open the GitHub Adventure homepage to access a remote git repository ?'
) {
	vscode.window.showWarningMessage(
		message,
		YES,
		NO
	).then((selection) => {
		if (selection === YES) {
			vscode.env.openExternal(
				vscode.Uri.parse(process.env.GIT_ADVENTURE_MAP_HOST || process.env.WA_HOST || 'http://localhost:5173')
			);
		}
	});
}

async function goToGithubAdventureMapCTA(URL: string) {
	vscode.window.showInformationMessage(
		'Welcome to the GitHub Adventure! 🚀', 
		'Start Adventure', 
		'Not Now'
	).then((selection) => {
		if (selection === 'Start Adventure') {
			vscode.env.openExternal(
				vscode.Uri.parse(URL)
			);
		}
	});

}

async function ensureWorkspaceFolders() {
	let currentWorkspace = vscode.workspace.workspaceFolders?.[0];

	if (!currentWorkspace) {
		await goToGithubAdventureHomeCTA();
		return false;
	}

	return true;
}

async function handleGitRepositoryCheckFailed(reason: string) {
	vscode.window.showInformationMessage('Please, restart Visual Studio Code and try again');
	vscode.window.showErrorMessage(reason);
	vscode.window.showErrorMessage('An error occurred while checking if the current folder is a Git repository');
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('githubadventure.go', async () => {
		if(!await ensureWorkspaceFolders()) {
			return;
		}

		let currentFolder = vscode.workspace.workspaceFolders?.[0];

		const git = simpleGit(currentFolder?.uri?.fsPath);
		await git.checkIsRepo(async (err, isRepo) => {
			if (err) {
				await handleGitRepositoryCheckFailed(err.message);
				return;
			}

			if (!isRepo) {
				await goToGithubAdventureHomeCTA();
				return;
			}

			let gitUrl = '';
			await git.getRemotes(true, async (err, remotes) => {
				if (err) {
					vscode.window.showErrorMessage(err.message);
					vscode.window.showErrorMessage('An error occurred while getting the remote repositories');
					return;
				}

				if (!remotes) {
					await goToGithubAdventureHomeCTA(
						'You do not have any remote repositories. ' + 
						'Would you like to open the GitHub Adventure homepage to access a remote git repository ?'
					);
					return;
				}

				gitUrl = remotes.find(remote => remote.name === 'origin')?.refs?.fetch
					|| remotes.find(remote => remote.name === 'origin')?.refs?.push || '';
			});

			if (!gitUrl) {
				await goToGithubAdventureHomeCTA(
					'You do not have any remote repositories. ' + 
					'Would you like to open the GitHub Adventure homepage to access a remote git repository ?'
				);
				return;
			}

			gitUrl = btoa(gitUrl);
			let mapUrl = `${process.env.WA_HOST || 'https://play.workadventu.re'}/_/${gitUrl}/${process.env.GIT_ADVENTURE_MAP_API_HOST || 'localhost:8877'}/map/${gitUrl}`;
			await goToGithubAdventureMapCTA(mapUrl);
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}