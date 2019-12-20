import * as vscode from 'vscode';
import * as models from './models';
import * as view from './views';

let res: models.SearchPage;
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.searchProblemOnStackoverflow', () => {
			// getting a list of problems
			let diagnostics: [vscode.Uri, vscode.Diagnostic[]][] = vscode.languages.getDiagnostics();

			// formation of the error selection list
			let errorMessages: string[] = [];
			diagnostics.forEach((value) => {
				value[1].forEach((value) => {
					let error: string = value.message;
					if (value.source !== undefined) {
						error = '[' + value.source + '] ' + error;
					}
					errorMessages.push(error);
				})
			});

			// show the selection window
			vscode.window.showQuickPick(errorMessages)
				// process the response
				.then((errorMessage) => {
					if (errorMessage)
					{
						errorMessage = errorMessage.replace(/["'\-\\\/\.\,\|\(\)\[\]\~\`\^\:\#\;\%]/gm, '');
						models.SearchPage.search(errorMessage).then(view.display);
					}
				});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.searchTextOnStackoverflow', async () => {
			const selectedText = getSelectedText();
			let searchTerm = await vscode.window.showInputBox({
				ignoreFocusOut: selectedText === '',
				placeHolder: 'Enter your Stackoverflow search query',
				value: selectedText,
				valueSelection: [0, selectedText.length + 1],
			});

			searchTerm = searchTerm!.replace(/["'\-\\\/\.\,\|\(\)\[\]\~\`\^\:\#\;\%]/gm, '');
			models.SearchPage.search(searchTerm).then(view.display);
		})
	)
}

export function deactivate() { }

function openBrowser(str: string) {
	let searchQuery = "https://www.google.com/search?q=" + encodeURI(str.replace(/["'\-\\\/\.\,\|\(\)\[\]\~\`\^\:\#\;\%]/gm, '') + ' site:stackoverflow.com');
	vscode.env.openExternal(vscode.Uri.parse(searchQuery));
}

function getSelectedText(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return '';
    }

    const document = editor.document;
    const eol = document.eol === 1 ? '\n' : '\r\n';
    let result: string = '';
    const selectedTextLines = editor.selections.map((selection) => {
        if (selection.start.line === selection.end.line && selection.start.character === selection.end.character) {
            const range = document.lineAt(selection.start).range;
            const text = editor.document.getText(range);
            return `${text}${eol}`;
        }

        return editor.document.getText(selection);
    });

    if (selectedTextLines.length > 0) {
        result = selectedTextLines[0];
    }

    result = result.trim();
    return result;
}