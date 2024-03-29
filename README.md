# Basic Install Notes

## Introduction

A sample project to show using a single repository to hold the client, server and common code (monorepos implies a single repos across a company - this ain't that).

Using Angular for the client, Nest.js for the server, npm workspaces to link it the build togeather and composite Typescript projects to link the compilation.
Also demonstrates configuring VS Code to work with them all.

## Create Root Folder

Name of the project will be significant

## Create the GIT Repository

```PS
git init
```

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

```PS
ng n marlborough-client --style scss --routing true --skip-git true --skip-install true
```

In the root packages folder add `packages/marlborough-client` to the workspaces

Add yarn to npm global with `npm i yarn -g`

## Install Server

[Nest Documentation](https://docs.nestjs.com/cli/usages#nest-new)

If required install Nest into Node:

```PS
npm i -g @nestjs/cli
```

Then create the app:

```PS
nest n marlborough-server --package-manager npm --language ts --strict --skip-git --skip-install
```

In the root packages folder add `packages/marlborough-server` to the workspaces

## Configure VS Code to look nicer with a monorepos using VS Code Workspaces

[VS Code Docs](https://code.visualstudio.com/docs/editor/multi-root-workspaces)

Create a file `Marlborough.code.workspace`. When you open this project as a workspace in VS Code `File/Open Workspace from File...`, it will show the 3 root folders cleanly. The names are uppercase to stick out.

```json
{
  "folders": [
    {
      "name": "ROOT",
      "path": "./"
    },
    {
      "name": "MARLBOROUGH CLIENT",
      "path": "packages/marlborough-client"
    },
    {
      "name": "MARLBOROUGH SERVER",
      "path": "packages/marlborough-server"
    }
  ],
  "settings": {
    "files.exclude": {
      "node_modules/": true,
      "packages/": true,
      "**/dist": true,
      "**/.angular": true
    }
  }
}
```

## Create the model library common to both projects

- In the projects folder create a new folder `marlborough-model`
- Extend `Marlborough.code.workspace` with the following folder

```json
{
  "name": "MARLBOROUGH MODEL",
  "path": "packages/marlborough-model"
}
```

- Create a tsconfig.json file for the library. Note the composite and declarationMap settings

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "Node",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "composite": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "incremental": true,
    "skipLibCheck": false,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": []
  },
  "include": ["src/**/*", "index.ts"]
}
```

- Note the module type is commonjs - which is required by Nest.js, but Angular moans about it as not possible to tree-shake a commonjs module. Add the following to `build/options` in the the angular.json file to stop the moaning.
```json
"allowedCommonJsDependencies": [ "@marlborough/model"]
```
- Create a package.json file. Note we are setting the main and type definitions to the index.ts in the root. Note the version number - this will be important for the dependencies in the apps.

```json
{
  "name": "@marlborough/model",
  "version": "0.0.1",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "~4.8.2",
    "rimraf": "^3.0.2"
  }
}
```

- Create a src folder. This will contain all the model code.
- Create a index.ts file. This will single point that in turn will export the contents of the src folder. For example if we had src/test.ts only, then index.ts would consist of...

```ts
export * from './src/test'
```

- Now we need to add the references to the model library to the two applications. There are two parts - the package reference for the building of the apps and a project reference for the type script compiler. First the package.json files of each app - add `"@marlborough/model": "0.0.1"` to the dependencies.
- The the project reference in tsconfig.json files of each app - add the following to each file after the compiler options

```json
"references": [
    {
      "path": "../marlborough-model/tsconfig.json"
    }
  ]
```

See [Typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html)

## Things To Note
The automatic insertion of imports uses an absolute path - starting at `src/`. This falls over in Jest testing - better to use relative paths.


## Angular Configs


Run `ng add @angular/material` to add the material library

# Angular Standalone Components

I am assuming this is the future direction of Angular so will avoid the use of ng modules in the app. Add the following standalone flag to angular.json to make all new components standalone by default.
```json
  "projects": {
    "marlborough-client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "standalone": true
        }
      },
```

## Bootstrapping the App without a Module

In main.ts replace the existing code with the following

``` typescript
bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
```

In AppComponent.ts add the standalone and imports fields to the component declaration

``` typescript
@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
```

## Routing without a routing module

* See the [Angular docs](https://angular.io/guide/standalone-components#routing-and-lazy-loading)

Add app.routes.ts file to contain the base routes. These will be used in the bootstrap code in main.ts

```typescript
import { AppComponent } from './app/app.component';
import { ROUTES } from './app/app.routes';
import { FlightService } from './app/services/flight.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROUTES),
    { provide: FlightService, useClass: FlightService}
  ]
})
  .catch(err => console.error(err));
  ```

## Naming Convention

Use the common practice to match what would be expected in Angular code
* '_' prefix for private variables and members
* '$' suffix for observable variables

## Don't Need OnInit For Observables and Viewmodels (or Constructors)

This is based on [this article](https://indepth.dev/posts/1508/structure-initialization-logic-without-ngoninit-utilize-observables-and-ngonchanges).
For observables, we don't need to wait for the OnInit hook, we can initialise the observable straight away. Also means the observable does not have to be nullable.

Use observable viewmodels to transfer data to the page - standard name `vm$`. Also define the type of the viewmodel. Will save a lot of time not having to trace back what it is. For example:

Also note we now explicitly inject the service without a constructor.

```typescript
export class DestinationsPageComponent {
  private _flightService = inject(FlightService);

  vm$: Observable<{ code: string; name: string; fluff: string }[]> =
    this._flightService.getOrigins$().pipe(
      map(o => {
        const sorted = o.sort((a, b) => cityName(a).localeCompare(cityName(b)));
        return sorted.map(o => ({ code: o, name: cityName(o), fluff: originFluff(o) }));
      })
    );
}
```

## NgRx

Having looked at this for a while - I think it is more trouble than it is worth. It is a good idea, for example too awkward to integrate with resolvers.

The underlying client data model is a simple class. The NgRx store is a simple class that holds the state of the application and accessed via the store service.

### Store

#### Timetable
List of destinations in the schedule. This is a simple array of airport codes.
And the list of scheduled flights for a single destination.
#### Flight Selection
A series of choices to select a  outbound flight for a booking and the return flight if required.
#### Booking
The details of a booking including the specific outbound and return flights.

### Actions
#### Timetable
- Get list of destinations
- Get list of flights for a destination
#### Flight Selection
- Select an origin airport
- Select a destination airport
- Select a date
- Select an outbound flight
- Select a return date
- Select a return flight
#### Booking
- Create a booking
- Select a return option for the booking
- Edit a booking
- Delete a booking
