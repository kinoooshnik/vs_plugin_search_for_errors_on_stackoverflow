import { SearchPage } from './models';
import * as vscode from 'vscode';

export function display(page: SearchPage): void {
    const panel = vscode.window.createWebviewPanel(
        'stackoverlfowView',
        'Stack Overflow',
        vscode.ViewColumn.Beside
    );

    panel.webview.html = constructWebView(page);
}

function constructWebView(page: SearchPage): string {
    let body: string;

    if (page.totalResults === 0) {
        body = `<h1>No questions found for query '${page.query}'</h1>`;
    } else {
        body = `<h1>Questions for query '${page.query}':</h1>`;
        page.results.forEach(element => {
            body += `<h1>${element.title}</h1>`;
            body += `<p><em>Link: <a href="${element.link}">${element.link}</a></em></p>`
            body += element.body;
            body += `<h1>Answer:</h1>`
            body += element.answers[0].body;
            body += `<hr>`;
        });
    }

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
        <title>Stack Overflow</title>
    </head>
    <body>
        ${body}
    </body>
    </html>`;
}