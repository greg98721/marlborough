# Basic Install Notes

## Introduction

A sample project to show using a monorepos to hold the client, server and common code.

Using Angular for the client, Nest.js for the server and npm workspaces to link it all togeather and serves to provide common editor and TypeScript settings.
Also demonstrates configuring VS Code to work with them all.

## Create Root Folder

Name of the project will be significant

## Create the GIT Repository

`git init`

Copy in a standard `.gitignore` from another angular project. Modify `/node_modules` to `**/node_modules`.
As angular project is no longer at the root of the repository

## Create the Root package.json

```json
{
  "name": "marlborough",
  "workspaces": []
}
```

Create the packages folder in the root

## Install Client

Change to the packages folder

`ng n marlborough-client --style scss --routing true --skip-git true --skip-install true`

In the root packages folder add `packages/marlborough-client` to the workspaces

## Install Server

If required install Nest into Node: `npm i -g @nestjs/cli`

Then create the app: `nest n marlborough-server --package-manager npm --language ts --strict --skip-git --skip-install`

In the root packages folder add `packages/marlborough-server` to the workspaces

## Configure VS Code to look nicer with a monorepos using VS Code Workspaces

Create a .vscode folder in the root

Create a file Marlborough.code.workspace. When you open this file as a workspace, it will show the 3 root folders cleanly

```json
{
    "folders": [
        {
            "name": "ROOT",
            "path": "../"
        },
        {
            "name": "packages/marlborough-client",
            "path": "../packages/marlborough-client"
        },
        {
            "name": "packages/marlborough-server",
            "path": "../packages/marlborough-server"
        }
    ],
    "settings": {
        "files.exclude": {
            "node_modules/": true,
            "packages/": true
        }
    }
}
```
