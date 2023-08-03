import * as vscode from 'vscode';
import axios from 'axios';

const endpoint = "https://api.openai.com/v1/chat/completions";
const headers = {
	"Content-Type": "application/json",
	Authorization: "Bearer ",
};
const model = "gpt-3.5-turbo";
const temperature = 0.6;

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.workspace.onDidSaveTextDocument((e) => {
		const text = e.getText();
	
		execute(text);
	});

	context.subscriptions.push(disposable);
}

async function execute(text: string) { 
	const prompt = "Atue como um desenvolvedor de software e gere sugestões de melhorias para o código abaixo:\n\n" + text;
	getSuggestion(prompt);
}

async function getSuggestion(prompt: string) {
	try {
		const response = await axios.post(
			endpoint,
			{
				model: model,
				messages: [{ role: "user", content: prompt }],
				temperature: temperature,
			},
			{ headers: headers }
		);

		vscode.window.showInformationMessage(
			"Resposta do ChatGPT: " +
			JSON.stringify(response.data.choices[0].message.content)
		);
	} catch (error) {
		vscode.window.showErrorMessage(
			"Erro ao enviar a mensagem para o ChatGPT."
		);
		console.error(error);
	}
}

export function deactivate() {}
