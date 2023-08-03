"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const endpoint = "https://api.openai.com/v1/chat/completions";
const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer ",
};
const model = "gpt-3.5-turbo";
const temperature = 0.6;
function activate(context) {
    let disposable = vscode.workspace.onDidSaveTextDocument((e) => {
        const text = e.getText();
        execute(text);
    });
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map