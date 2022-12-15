import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

const weather = introspect.graphql({
	apiNamespace: 'weather',
	url: 'https://weather-api.wundergraph.com/',
});

const countries = introspect.graphql({
	apiNamespace: 'countries',
	url: 'https://countries.trevorblades.com/',
});

// const mindy = introspect.graphql({
// 	apiNamespace: 'mindy',
// 	url: 'http://167.172.142.105:3000/api/graphql',
// });


const leaves = introspect.openApi({
	apiNamespace: 'leaves',
	source: {
		kind: 'file',
		filePath: './json_placeholder.yaml',
	},
	introspection: {
	  pollingIntervalSeconds: 2,
	},
	requestTimeoutSeconds: 10, // optional
})

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	apis: [weather, countries, leaves],
	server,
	operations,
	codeGenerators: [
		{
			templates: [
				// use all the typescript react templates to generate a client
				...templates.typescript.all,
			],
			// create-react-app expects all code to be inside /src
			// path: "../frontend/src/generated",
		},
	],
	cors: {
		...cors.allowAll,
		allowedOrigins:
			process.env.NODE_ENV === 'production'
				? [
					// change this before deploying to production to the actual domain where you're deploying your app
					'http://localhost:3000',
				]
				: ['http://localhost:3000', new EnvironmentVariable('WG_ALLOWED_ORIGIN')],
	},
	dotGraphQLConfig: {
		hasDotWunderGraphDirectory: false,
	},
	security: {
		enableGraphQLEndpoint: process.env.NODE_ENV !== 'production' || process.env.GITPOD_WORKSPACE_ID !== undefined,
	},
});
