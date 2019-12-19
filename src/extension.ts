import * as vscode from 'vscode';
import * as models from './models';
import * as view from './view';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.searchForErrorOnStackoverflow', () => {
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
					// как использовать
					// функция асинхронная, поэтому обрабатывать ее ответ надо через callback (.then(функция, в которую передается результат))
					// возвращает объект SearchPage
					// в будущем немного порежу данные, которые есть изначально, потому что запрос на все данные выполняется долго
					// для получения более полных данных нужно будет вызвать соответствующий метод класса вопроса
					{
						errorMessage = errorMessage.replace(/[^\w ]/gm, '');
						console.log(errorMessage);
						models.SearchPage.search(errorMessage).then(view.display);
					}
				});
		})
	);
}

export function deactivate() { }

function openBrowser(str: string) {
	//                                                                                     что это за дикая регулярка?
	let searchQuery = "https://www.google.com/search?q=" + encodeURI(str.replace(/["'\-\\\/\.\,\|\(\)\[\]\~\`\^\:\#\;\%]/gm, '') + ' site:stackoverflow.com');
	vscode.env.openExternal(vscode.Uri.parse(searchQuery));
}
