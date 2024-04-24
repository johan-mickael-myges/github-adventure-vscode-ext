"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const simple_git_1 = __importDefault(require("simple-git"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const YES = 'YES';
const NO = 'NO';
async function goToGithubAdventureHomeCTA(message = 'You are not in a Git repository. Would you like to open the GitHub Adventure homepage to access a remote git repository ?') {
    vscode.window.showWarningMessage(message, YES, NO).then((selection) => {
        if (selection === YES) {
            vscode.env.openExternal(vscode.Uri.parse(process.env.GIT_ADVENTURE_MAP_HOST || process.env.WA_HOST || 'https://play.workadventu.re'));
        }
    });
}
async function goToGithubAdventureMapCTA(URL) {
    vscode.window.showInformationMessage('Welcome to the GitHub Adventure! 🚀', 'Start Adventure', 'Not Now').then((selection) => {
        if (selection === 'Start Adventure') {
            vscode.env.openExternal(vscode.Uri.parse(URL));
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
async function handleGitRepositoryCheckFailed(reason) {
    vscode.window.showInformationMessage('Please, restart Visual Studio Code and try again');
    vscode.window.showErrorMessage(reason);
    vscode.window.showErrorMessage('An error occurred while checking if the current folder is a Git repository');
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('githubadventure.go', async () => {
        if (!await ensureWorkspaceFolders()) {
            return;
        }
        let currentFolder = vscode.workspace.workspaceFolders?.[0];
        const git = (0, simple_git_1.default)(currentFolder?.uri?.fsPath);
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
                    await goToGithubAdventureHomeCTA('You do not have any remote repositories. ' +
                        'Would you like to open the GitHub Adventure homepage to access a remote git repository ?');
                    return;
                }
                gitUrl = remotes.find(remote => remote.name === 'origin')?.refs?.fetch
                    || remotes.find(remote => remote.name === 'origin')?.refs?.push || '';
            });
            if (!gitUrl) {
                await goToGithubAdventureHomeCTA('You do not have any remote repositories. ' +
                    'Would you like to open the GitHub Adventure homepage to access a remote git repository ?');
                return;
            }
            gitUrl = btoa(gitUrl);
            let mapUrl = `${process.env.WA_HOST}/_/${gitUrl}/${process.env.GIT_ADVENTURE_MAP_API_HOST || '-'}/map/${gitUrl}`;
            await goToGithubAdventureMapCTA(mapUrl);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map