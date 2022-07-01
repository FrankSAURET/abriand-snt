// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // compléter la liste des modules à installer ci-dessous
    const moduleAInstaller: string = "pillow folium";
    
    try {
        await findPipLocation();
        let dir = "";
        await installModule(dir, moduleAInstaller);
    } catch (error) {
        console.log(error);
    }

}
async function findPipLocation() {
    //Vérifie que pip est installé et retourne sa version et son chemin ou génère une erreur
    const { spawn } = require('child_process');
    const child = spawn('pip', ['-V']);

    try {
        let data = "";
        for await (const chunk of child.stdout) {
            console.log('stdout: ' + chunk);
            data += chunk;
        }
        let error = "";
        for await (const chunk of child.stderr) {
            console.error('stderr: ' + chunk);
            error += chunk;
        }
        const exitCode = await new Promise((resolve, reject) => {
            child.on('close', resolve);
            let path = "";
            path = data.substring(
                data.lastIndexOf(":") - 1,
                data.lastIndexOf("pip")
            );
            console.log("Python third-party dir: " + path);
            vscode.workspace.getConfiguration("python").update("thirdPartyModulesDirectory", path, vscode.ConfigurationTarget.Global);
        });
        if (exitCode) {
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}
async function installModule(target: string, module: string) {
    // Installe un module avec pip et retourne le message post installation
    const { spawn } = require('child_process');
    const args = "pip install " + target + " " + module;
    const child = spawn("powershell.exe", [args]);

    try {
        let data = "";
        for await (const chunk of child.stdout) {
            console.log('stdout: ' + chunk);
            data += chunk;
            console.log(`Module ${module} succesfully installed,${module}`);
        }
        let error = "";
        for await (const chunk of child.stderr) {
            console.error('stderr: ' + chunk);
            error += chunk;
            vscode.window.showErrorMessage(error);
        }
        const exitCode = await new Promise((resolve, reject) => {
            child.on('close', resolve);
        });
        if (exitCode) {
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}
// this method is called when your extension is deactivated
export function deactivate() { }
