Bánh Chưng Xanh - Tet 2015 Campaign
===================================

__Code Name "Chưng Nhi"__

We're doing donation among Nauers and friends to a charity organization for children this Tet holidays.
Instead to doing it straight and squarely, we want to engage outsiders and make this a fun online side project.

The core of this minisite is a Sokoban-like game where each map win will entitle small plegde of donation which is
on our team. Players will have the fun of solving the puzzle while knowing that their wins will inccur some amount 
of donations. That is win for all of us.


GETTING STARTED WITH DEVELOPMENT
--------------------------------

1. Software installation:
	- Code editor of your choice (Sublime Text is recommended and project files are included)
	- Google Chrome 36+
	- [MeteorJS][]
2. Setting up IDE/Editor
	- If using Sublime Text, just open the `*.sublime-project` and start coding
	- Else, create project with IDE of your choice, with project folder pointing to **this folder** (where this file is located)
3. Previewing app in web browser (any compilation will be done and updates will be refreshed automatically):
	- Execute `meteor`
4. Build the app for server deployment:
	- Follow [MeteorJS][] guide

VERSIONING
----------
[TBD]

TECHNICAL AND DEVELOPMENT SOLUTIONS
-----------------------------------
- [NodeJS][]: Backbone for Meteor
- [MeteorJS][]: Full stack application framework for writing JavaScript from backend to frontend
- Meteor packages:
	+ Meteor's built-in account management
	+ fourseven:scss
	+ iron:router
	+ anti:i18n
	+ themeteorchef:jquery-validation

FOLDER STRUCTURE
----------------
	/
	├── config                  : defaults and initial configuration
	├── shared                  : scripts should be run on both client & server
	├── lib                     : both side's library / helpers modules
	├── server                  : server-side modules only
	├── client                  : client-side modules only
		├── css                 : SASS/CSS files
		├── templates           : Blaze's template files & their helpers + events scripts
	├── public                  : static files
		├── fonts               : contains web font / icon font files
		├── img                 : images
		└── js                  : JavaScript files
			├── lib             : 3rd-party libraries (jQuery, requireJS, Backbone...)
			└── app             : app namespace

CONVENTIONS & BEST PRACTICES
----------------------------

- Adhere to Nau Studio's conventions and coding styles
	- Refer to `.jshintrc` for details of JS conventions
	- Refer to `.jscsrc` for details of JS coding styles
	- Refer to `.scss-lint.yml` for details of SCSS conventions
- Alignment by TABs (not SPACES, tab width is up to user's preference, but 4-space tab is recommended)
- Single quotes ('...') for String literal in js files
- Variables naming with camelCase
- Symbols and prototypes naming with PascalCase
- JS files as namespace (multiple modules inside) named with all-lowercase
- JS files as module named with PascalCase / camelCase

DOCUMENTATION
-------------
Refer to documentation site of these components:
- [MeteorJS Doc][]
- [iron:router][]
- [anti:i18n][]

KNOWLEDGE BASE:
---------------
[TBC]

---
Copyright 2015 Nau Studio. 
Licensed under MIT license

[anti:i18n]: https://github.com/anticoders/meteor-i18n
[iron:router]: https://github.com/EventedMind/iron-router/blob/devel/Guide.md
[MeteorJS]: http://meteor.com
[MeteorJS Doc]: http://docs.meteor.com/
[jQuery]: http://jQuery.com
[NodeJS]: http://nodejs.org/
[SASS]: http://sass-lang.com/
[JSDoc]: http://usejsdoc.org/
