## Getting started

Follow these steps to get started developing your own react component:

- `git clone https://github.com/yogaboll/react-npm-component-starter.git`
- `npm install`
- `npm run dev` to transpile both the lib and docs folder in watch mode and serve the docs page for you.
- Go to http://127.0.0.1:8000 to see the demo in action. Whenever you change the code in either src/lib or src/docs, the page will automatically update.

When you have completed development and want to publish to npm:

- Change the "name" field in the package.json file (the npm package will get this name), as well "description", "author" and any other fields that need to change.
- `npm publish`
- Go to npmjs.com/package/[YOUR COMPONENT NAME]/ to confirm that it has been published.

Host demo on GitHub Pages:

- `npm run docs:prod` - Make a production bundle of the demo app.
- Commit your changes to git and push to your GitHub repository.
- On your GitHub repo page, click the **settings** tab and scroll down to the **GitHub Pages** heading. Pick `master branch /docs folder` in the **source** dropdown, And BOOM, your demo page is already live on the internet for free.
