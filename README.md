> randomize prizes https://jsfiddle.net/8duap04a/

```
    ,--. 
   ([ oo] 
    `- ^\
  _  I`-'
,o(`-V' 
|( `-H-'
|(`--A-'
|(`-/_\'\
O `'I ``\\ 
(\  I    |\,
 \\-T-"`, |H   Ojo 
```

# Scratchie Skeleton

Examples can be found at http://playible.com


## Requirements

* php 5+
* node 0.10+ & npm (for development)

## Dependencies

Dependencies are managed by **[Bower](http://bower.io/)** and **[npm](https://www.npmjs.org/)**.

Notable dependencies are:

* [Webpack](http://webpack.github.io/) - Module bundler and Script loader
* [Backbone](http://backbonejs.org/) - Javascript MVC framework
* [Gulp](http://gulpjs.com/) - Node.js task runner


## Languages

 All are compiled with *Webpack*.

* **coffeescript** -> javascript
* **jade** -> html 
* **less** -> css

## Folder Structure

These folders make up the majority of the project.

* **dist/** - Bundled, minified, uglifed assets ready for deployment
* **build/** - Compiled assets and assets the don't need compilation
    * **themes/** - Contains all the theme assets
* **src/** - All assets that are compiled by webpack, e.g. .less, .coffee
* web_modules/ - contains shims for non common.js libs
* responses/ contains static responses from the api

Important files

* **package.json** - Npm (node) dependencies
* **bower.json** - Bower (js) dependencies
* **webpack.config.coffee** - Webpack's config for bundling and script loading
* **/src/json/config.json** - See Below!!

## Configuration

The games' config is located at `/src/json/default-config.json`. Many of the game parameters can be set here. However each games has its own config which both overrides and extends some of the default-config values and also also extends. The specific game configs can be found at `/build/themes/[game_code]/config.js`

## Installation

#### Installing the project & dependencies

Clone this repo, then change to the cloned repos directory, and run npm install. This will install both bower and npm packages.

```shell
git clone http://github.com/brenwell/reponame
cd /project/dir
npm install
```

>
Don't forget substitute the real values above.

#### Setting up your web server

* **development** - direct traffic to the `/build` folder
* **distribution** - direct traffic to the `/dist` folder

>
To use the distribution folder as you server location, you will need to always `bundle` the project to see changes.

## Tasks

All tasks are run through **gulp**. Run the following help command to see all the options.

```shell
gulp help
```

Example `gulp help` printout

```shell
Usage
  gulp [task]

Available tasks
  build        Build the motherfucker
  bumpBuild    Bump buid number
  bumpTag      Bump tag number
  bundle       Bundle and deploy everything
  cdn          Rsync game of game to cdn
  cdn-dry      Dry run of Rsyncing game of game to cdn
  clean        Clean the dist folder
  commit       Commit any changes to Git
  copyFolders  Copy needed build assets to dist
  copyIndex    Copy any needed php files
  dev          Rsync development code game to server
  help         Display this help text.
  prd          Deploy dist/ to cdn and purge all existing
  purge        Purge all on cdn
  rev          Revision the assets
  stg          Rsync game to stage server
  watch        Compile assets

```

## Compilation

To watch and compile changes, you must start `web packs` watcher. It will compile everything needed to run. It looks for all the filetypes that need compilation in the `/src` folder and compiles them to the `/build` folder.

```shell
gulp watch
```

>
You need to keep this running in the terminal in order to keep it compiling changes you make.

## Bundling for deployment

In order to bundle the the project for distribution there are a few things to say. Run the following command, it will bundle everything and place it the uglified and minified files in the `/dist` folder.

```shell
gulp bundle
```


## Deploy to stage
If you only want to deploy to the stage run

```shell
gulp dev
```

in sequence with bundling

```shell
gulp bundle
gulp dev
```

## Deploy to the Real & Fun stages

You must first bundle and deploy to the stage (Development) testing area. Then you can deploy to the Real & Fun areas of the playible.com

```shell
gulp stg
```

in sequence with bundling and deploying

```shell
gulp bundle
gulp dev
gulp stg
```


## Deploy to production CDN

**DON'T DO THIS!!** But if you must, first bundle then deploy to the stage for testing. Then deploy it to the CDN. This will also automatically purge all existing files on the CDN 

```shell
gulp prd
```

in sequence with bundling and deploying

```shell
gulp bundle
gulp dev
gulp stg
gulp prd
```

>
If you only want to deploy to the stage without purging, then run `gulp cdn`


>
If you only want to purge all file on the cdn, then run `gulp purge`