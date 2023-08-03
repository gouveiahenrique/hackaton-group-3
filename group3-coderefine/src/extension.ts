// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// curl https://api.openai.com/v1/models \
//   -H "Authorization: Bearer $OPENAI_API_KEY" \
//   -H "OpenAI-Organization: org-KcWez7sJyjWKXELAwstc4Kh4"
const API_KEY = '';
const API_URL = 'https://api.openai.com/v1/chat/completions';

const config: AxiosRequestConfig = {
	headers: {
	  'Content-Type': 'application/json',
	  // Se você precisa de um token de autenticação, inclua aqui
	  'Authorization': 'Bearer '
	}
  };

// function getBearerToken(): string {
// 	axios.post('https://api.openai.com/v1/token',{
// 		grant_type: 'client_credentials',
// 		api_key: API_KEY
// 	},
// 	{
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	}
// 	).then(response => { 
// 		console.error('Success:', response.data.access_token);
// 		return response.data.access_token;
// 	}).catch(error => {
// 		console.error('Erro na obtenção do Bearer Token:', error);
// 	});

// 	return "";
// }

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Registrando um evento para observar alterações no texto
	let disposable = vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		const { document, contentChanges } = e;
		const text = document.getText();
	
		if (text.length > 15) {
			execute(text);
		}
	});

	// Adicionando o disposable (descartável) ao contexto da extensão
	context.subscriptions.push(disposable);
}

async function execute(text: string) { 
	// Simulação: obtendo sugestões de melhorias do ChatGPT
	const prompt = "Atue como um desenvolvedor de software e gere sugestões de melhorias para o código abaixo:\n\n" + text;
	const suggestion = getChatGPTSuggestion(prompt);

	// Exibir a sugestão na tela do usuário da extensão
	vscode.window.showInformationMessage(suggestion);
}

function getChatGPTSuggestion(prompt: string): string {
	const requestData = {
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 10,
		temperature: 0.5
	  };

	axios.post(API_URL, requestData, config)
		.then(response => {
			// Trate a resposta da API da OpenAI aqui
			console.log('Resposta da API:', response.data);
			return response.data
		})
		.catch(error => {
			// Trate os erros aqui
			console.error('Erro na requisição:', error);
			return ""
		});

	return "";
}

// This method is called when your extension is deactivated
export function deactivate() {}
