const supertokens = require("supertokens-node");
const { SuperTokensError } = require("supertokens-node/lib/build/error");
const Session = require("supertokens-node/recipe/session");

supertokens.init({
  framework: "express", // or whatever framework you're using
  supertokens: {
    connectionURI: "https://try.supertokens.com", // Use this for testing, replace with your instance for production
  },
  appInfo: {
    appName: "Your App Name",
    apiDomain: "http://localhost:3000", // Your API domain
    websiteDomain: "http://localhost:3001", // Your frontend domain
    apiBasePath: "/auth", // Where Supertokens routes will be exposed
    websiteBasePath: "/auth", // Frontend URL for authentication
  },
  recipeList: [
    require("supertokens-node/recipe/emailpassword").init(),
    Session.init(), // For session management
  ],
});
