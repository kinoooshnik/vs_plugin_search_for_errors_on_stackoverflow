import * as vscode from 'vscode';

var errorUrl:string;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		(<any>vscode.window).onDidWriteTerminalData((e: any) => {
			if (!e.data.includes("\n")) {
				return;
			}

			let languages = new Set();
			vscode.workspace.textDocuments.forEach(function (doc) {
				languages.add(doc.languageId);
			});
			languages.delete("plaintext");

			let stringArray = e.data.split('\n');

			languages.forEach(function (lang) {
				switch(lang) {
					case 'python':
						checkString(stringArray, /(^.*(Error:|Exception:).+$)/gm);
					  	break;
					case 'javascript':
						checkString(stringArray, /(Uncaught? ?Error:.+)/gm);
						break;
					case 'php':
						checkString(stringArray, /((Caught.+Exception|Uncaught.+with message:).+)/gm);
						break;
				  }
			});
		}));
}

function checkString(strs:string[], regexPattern:RegExp) {
	strs.forEach(function (str) {
		var found = str.match(regexPattern);
		if (found != null) {
			errorUrl = found?.join(' ');
			vscode.window.showInformationMessage('Ooops! \'' + found?.join(' ') + '\' seems like a mistake. Do you want to find her on stackoverflow?', 'To find!')
			.then(selection => {
				openBrowser(errorUrl);
			});
			// someFunc.bind(null, found));
			// openBrowser(found?.join(' '));
			return;
		}
	});
}

function someFunc(selection:any, found:any){
	console.log(selection);
	openBrowser(found?.join(' '));
}

function openBrowser(str:string) {
	let searchQuery = "https://www.google.com/search?q=" + str.replace(' ', '+') + '+site:stackoverflow.com';
	vscode.env.openExternal(vscode.Uri.parse(searchQuery));
}