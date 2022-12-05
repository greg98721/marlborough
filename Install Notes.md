# Basic Install Notes

## Introduction

A sample project to show using a monorepos to hold the client, server and common code.

Using Angular for the client, Nest.js for the server and npm workspaces to link it all togeather and serves to provide common editor and TypeScript settings.
Also demonstrates configuring VS Code to work with them all.

## Create Root Folder

Name of the project will be significant

## Create the GIT Repository

`git init`

Copy in a standard `.gitignore` from another angular project

## Create the Root package.json

```json
{
  "name": "<project name here>",
  "workspaces": []
}
```

## Install Client

`ng n marlboroughClient -g`

Select SCSS for styles

## Install Server

If required install Nest into Node: `npm i -g @nestjs/cli`

Then create the app: `nest n marlboroughServer -g --strict`

Copy `.gitignore` from the client before commiting.
