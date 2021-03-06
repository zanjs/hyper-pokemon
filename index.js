const fs = require('fs');
const yaml = require('js-yaml');
const homeDir = require('home-dir');

const path = homeDir('/.hyper_plugins/node_modules/hyper-pokemon/backgrounds/');
const extension = '.png';

exports.decorateConfig = config => {
	let theme;
	let keys;
	let index;
	let pokemonTheme = config.pokemon.toLowerCase();
	const unibody = config.unibody;
	const unibodyFlag = unibody !== 'false';

	// Load color palettes from yaml files
	const pokemonYml = yaml.safeLoad(
		fs.readFileSync(
			homeDir('/.hyper_plugins/node_modules/hyper-pokemon/pokemon.yml'),
			'utf8'
		)
	);

	const typesYml = yaml.safeLoad(
		fs.readFileSync(
			homeDir('/.hyper_plugins/node_modules/hyper-pokemon/types.yml'),
			'utf8'
		)
	);

	// Determine theme color palette
	if (pokemonTheme === 'random') {
		keys = Object.keys(pokemonYml.pokemon);
		index = Math.floor(Math.random() * (keys.length));
		pokemonTheme = keys[index];
	} else if (pokemonTheme === 'fire') {
		keys = Object.keys(typesYml.fire);
		index = Math.floor(Math.random() * (keys.length));
		pokemonTheme = keys[index];
	} else if (pokemonTheme === 'water') {
		keys = Object.keys(typesYml.water);
		index = Math.floor(Math.random() * (keys.length));
		pokemonTheme = keys[index];
	} else if (pokemonTheme === 'grass') {
		keys = Object.keys(typesYml.grass);
		index = Math.floor(Math.random() * (keys.length));
		pokemonTheme = keys[index];
	} else if (pokemonTheme === 'poison') {
		keys = Object.keys(typesYml.poison);
		index = Math.floor(Math.random() * (keys.length));
		pokemonTheme = keys[index];
	}

	if (Object.prototype.hasOwnProperty.call(pokemonYml.pokemon, pokemonTheme)) {
		theme = pokemonYml.pokemon[pokemonTheme];
	} else {
		theme = pokemonYml.default[config.pokemonSyntax];
	}

	// Set theme colors
	const primary = (unibodyFlag === true) ? theme.unibody : theme.primary;
	const secondary = theme.secondary;
	const tertiary = theme.tertiary;

	const syntax = {
		dark: {
			borderColor: primary,
			cursorColor: secondary,
			foregroundColor: secondary,
			backgroundColor: '#383A42',
			colors: {
				black: tertiary,
				red: secondary,
				green: tertiary,
				yellow: secondary,
				blue: secondary,
				magenta: secondary,
				cyan: secondary,
				white: secondary,
				lightBlack: tertiary,
				lightRed: secondary,
				lightGreen: secondary,
				lightYellow: secondary,
				lightBlue: secondary,
				lightMagenta: secondary,
				lightCyan: secondary,
				lightWhite: secondary
			}
		},

		light: {
			borderColor: primary,
			cursorColor: secondary,
			foregroundColor: secondary,
			backgroundColor: '#FAFAFA',
			colors: {
				black: tertiary,
				red: secondary,
				green: tertiary,
				yellow: secondary,
				blue: secondary,
				magenta: secondary,
				cyan: secondary,
				white: secondary,
				lightBlack: tertiary,
				lightRed: secondary,
				lightGreen: secondary,
				lightYellow: secondary,
				lightBlue: secondary,
				lightMagenta: secondary,
				lightCyan: secondary,
				lightWhite: secondary
			}
		}
	};

	let pathToTheme;
	const assemblePath = path + pokemonTheme + extension;

	if (process.platform === 'win32') {
		pathToTheme = assemblePath.replace(/\\/g, '/');
	} else {
		pathToTheme = assemblePath;
	}

	return Object.assign({}, config,
		(config.pokemonSyntax === 'light') ?
		syntax.light :
		syntax.dark, {
			termCSS: `
          ${config.termCSS || ''}
          ::selection {
            background: ${primary} !important;
          }
          ::-webkit-scrollbar-thumb {
            background-color: ${secondary};
            -webkit-box-shadow: none;
					}
          x-screen {
            background: transparent !important;
          }
        `,
			css: `
        ${config.css || ''}
        .terms_terms {
          background: url(${pathToTheme}) center;
          background-size: cover;
        }
        .header_header, .header_windowHeader {
          background-color: ${primary} !important;
        }
        .tabs_nav .tabs_list {
          border-bottom: 0;
        }
        .tabs_nav .tabs_title,
        .tabs_nav .tabs_list .tab_tab {
          color: ${secondary};
          border: 0;
        }
        .tabs_nav .tabs_list .tab_tab:not(.tab_active) {
          background-color: rgba(0,0,0,0.1);
        }
        .tabs_nav .tabs_list .tab_tab:not(.tab_active):hover {
          color: ${primary};
        }
        .tabs_nav .tabs_list .tab_active .tab_text {
          border-bottom: 3px solid ${secondary};
        }
        .terms_terms .terms_termGroup .splitpane_panes .splitpane_divider {
          background-color: ${secondary} !important;
        }
      `
		}
	);
};
