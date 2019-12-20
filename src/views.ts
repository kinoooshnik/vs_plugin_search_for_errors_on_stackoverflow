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
    let body: string = '';

    if (page.totalResults === 0) {
        body = `<h1>No questions found for query '${page.query}'</h1>`;
    } else {
        // body = `<h1>Questions for query '${page.query}':</h1>`;
        page.results.forEach(element => {
            body += `
            <div class="content">
            <div class="container">
                <div class="question">
                    <div class="left-block-info">
                        <div class="votes">
                            ${element.score}
                            <div class="signature">
                                votes
                            </div>
                        </div>
                        <div class="answer">
                            ${element.answerCount}
                            <div class="signature">
                                answers
                            </div>
                        </div>
                        <div class="views">
                            ${element.viewedTimes} views
                        </div>
                    </div>
                    
                    <div class="title"><a href="${element.link}">${element.title}</a></div>
                    <!-- <div class="tags"></div> -->
                    <div class="body">
                        ${element.body}
                    </div>
                    <div class="time-and-author">
                        asked time by ${element.owner.displayName}
                    </div>`;
            if (element.answers.length != 0) {
                body += `
                <div class="answer-title">Best answer:</div>
                <div class="answer-block">
                    <div class="body">
                        ${element.answers[0].body}
                    </div>
                    <div class="time-and-author">
                        answered time by ${element.answers[0].owner.displayName}
                    </div>
                </div>`;
            }
            body += `</div>
            </div>
        </div>`;
            // body += `<h1>${element.title}</h1>`;
            // body += `<p><em>Link: <a href="${element.link}">${element.link}</a></em></p>`
            // body += element.body;
            // body += `<h1>Answer:</h1>`
            // // Обработать случай, если нет ответов
            // body += element.answers[0].body;
            // body += `<hr>`;
        });
    }

    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none';"> -->
        <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
        <!-- <link rel="stylesheet" type="text/css" href="./style.css"> -->
        <title>Stack Overflow</title>
        <style>
        header {
            background-color: #ededed;
            margin-bottom: 20px;
        }
        
        header .logo {
            float: left;
            width: 40px;
            height: 40px;
            margin: 5px;
        }
        
        header .container:after {
            content: '';
            display: table;
            clear: both;
        }
        
        header input[type=text] {
            box-sizing: border-box;
            margin: 10px 20px;
            width: 70%;
            height: 30px;
            border: none;
            border-bottom: 1px solid #a1a1a1;
        }
        .content {
            margin-bottom: 30px;
            border: 1px solid #d1d1d1;
        }
        .question {
            padding: 10px;
        }
        .content .question:after {
            content: '';
            display: table;
            clear: both;
        }
        .left-block-info {
            float: left;
            margin-right: 10px;
        }
        .votes, .answer {
            text-align: center;
            margin-bottom: 15px;
            border: 1px solid #a1a1a1;
        }
        .title {
            font-size: 25px;
            padding-left: 10px;
        }
        .time-and-author {
            text-align: right;
            color: gray;
        }
        .answer-title {
            font-size: 16px;
            padding-left: 10px;
        }
        .answer-block {
            margin-left: 20px;
        }
        .body {
            padding-left: 10px;
        }
        </style>
    </head>
    
    <body>
        <header>
            <div class="container">
                <img class="logo" src="../../img/logo.png">
                <form action="search" method="get">
                    <input type="text" name="query" id="query" value="${page.query}">
                    <input type="button" value="search">
                </form>
        </header>
        <em>Total: ${page.results.length}</em>
        ${body}
    </body>
    
    </html>`;
}