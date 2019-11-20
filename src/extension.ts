import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.searchForErrorOnStackoverflow', () => {
		// getting a list of problems
		let diagnostics: [vscode.Uri, vscode.Diagnostic[]][] = vscode.languages.getDiagnostics();

		// formation of the error selection list
		let errorMessages: string[] = [];
		diagnostics.forEach((value) => {
			value[1].forEach((value) => {
				let error: string = value.message;
				if (value.source !== undefined) {
					error += ' ' + value.source;
				}
				errorMessages.push(error);
			})
		});

		// show the selection window
		vscode.window.showQuickPick(errorMessages)
			// process the response
			.then((value) => {
				if (value !== undefined)
					openBrowser(value);
			});
		})
	);
}

export function deactivate() { }

function openBrowser(str: string) {
	let searchQuery = "https://www.google.com/search?q=" + encodeURI(str.replace(/["'-\\\/\.\,\|]/gm, '') + ' site:stackoverflow.com');
	vscode.env.openExternal(vscode.Uri.parse(searchQuery));
}
