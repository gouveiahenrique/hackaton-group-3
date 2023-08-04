"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const endpoint = "https://api.openai.com/v1/chat/completions";
const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer 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",
};
const model = "gpt-3.5-turbo";
const temperature = 0.6;
function activate(context) {
    let disposable = vscode.workspace.onDidSaveTextDocument((e) => {
        const text = e.getText();
        execute(text);
    });
    const revisionDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        border: '1px solid red' // Border for the highlight
    });
    let disposable2 = vscode.commands.registerTextEditorCommand('extension.highlightPhrases', (editor) => {
        highlightPhrases(editor, revisionDecorationType);
        executeForHighlight(editor);
    });
    context.subscriptions.push(revisionDecorationType, disposable2);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function execute(text) {
    const prompt = "Atue como um desenvolvedor de software e gere sugestões de melhorias para o código abaixo:\n\n" + text;
    getSuggestion(prompt);
}
async function getSuggestion(prompt) {
    try {
        const response = await axios_1.default.post(endpoint, {
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: temperature,
        }, { headers: headers });
        vscode.window.showInformationMessage("Resposta do ChatGPT: " +
            JSON.stringify(response.data.choices[0].message.content));
    }
    catch (error) {
        vscode.window.showErrorMessage("Erro ao enviar a mensagem para o ChatGPT.");
        console.error(error);
    }
}
function highlightPhrases(editor, revisionDecorationType) {
    const text = editor.document.getText();
    // Define regular expression patterns to match phrases
    const revisionPattern = /\"\<\<.*?\>\>/g;
    const decorations = [];
    let match;
    while ((match = revisionPattern.exec(text)) !== null) {
        const startPos = editor.document.positionAt(match.index);
        const endPos = editor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Needs revision' };
        decorations.push(decoration);
    }
    // Apply decorations to the editor
    editor.setDecorations(revisionDecorationType, decorations);
}
async function executeForHighlight(editor) {
    const prompt = "Atue como um desenvolvedor de software e gere sugestões de melhorias para o código abaixo.\n\n" + editor.document.getText();
    getSuggestionForHighlights(prompt);
}
async function getSuggestionForHighlights(prompt) {
    try {
        const response = await axios_1.default.post(endpoint, {
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: temperature,
        }, { headers: headers });
    }
    catch (error) {
        vscode.window.showErrorMessage("Erro ao enviar a mensagem para o ChatGPT.");
        console.error(error);
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map