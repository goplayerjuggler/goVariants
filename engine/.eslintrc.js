module.exports =
	{
		"extends": "eslint:recommended",
		"parserOptions": { "ecmaVersion": 6, "ecmaFeatures": { "experimentalObjectRestSpread": true } },
		"rules": {
			"eqeqeq": ["error", "always"]
			, "no-console":1//warning
			, "no-eval":2
			, "no-fallthrough":2
			, "no-implicit-globals":2
			//, "no-use-before-define":2
		}
		, "env": {
			"browser": true,
			"node": true,
			"commonjs": true,
			"es6": true

		}
	}