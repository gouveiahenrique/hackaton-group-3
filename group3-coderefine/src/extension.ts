// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('A extensão está ativa!');

	// Registrando um evento para observar alterações no texto
	let disposable = vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		e.document.save().then(() => {
			console.log('Documento salvo após a edição:', e.document.fileName);
		}, (error) => {
			console.error('Erro ao salvar o documento:', error);
		});
	});

	// Adicionando o disposable (descartável) ao contexto da extensão
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
