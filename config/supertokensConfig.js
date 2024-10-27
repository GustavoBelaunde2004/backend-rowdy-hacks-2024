const supertokens = require("supertokens-node");
const { SuperTokensError } = require("supertokens-node/lib/build/error");
const Session = require("supertokens-node/recipe/session");

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "https://try.supertokens.com",
  },
  appInfo: {
    appName: "Your App Name",
    apiDomain: "http://localhost:5000",  // Your backend domain
    websiteDomain: "http://localhost:3000",  // Your frontend domain
  },
  recipeList: [
    require("supertokens-node/recipe/emailpassword").init(),
    Session.init({
      cookieDomain: 'localhost',  // Ensure cookies are shared between frontend and backend
      cookieSameSite: 'Lax',      // Set to 'None' if you're using HTTPS, 'Lax' should work for localhost
      cookieSecure: false,        // Set to true only if using HTTPS (false for development on localhost)
    })
  ],
});

