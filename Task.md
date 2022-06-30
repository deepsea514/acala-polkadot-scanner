# Polkadot Scanner

## Frontend Task

Build a simple Polkadot Blockchain Scanner web app that is able to scan & display events for the Polkadot Network.

### Requirements

- Using React, TypeScript, polkadot.js and any other libraries of your choice
- Display a form with the following fields
  - Start block (required field)
  - End block (required field, default to the latest block number)
  - Endpoint (required field, default to wss://rpc.polkadot.io)
  - “Scan” button
- It should have basic error validation on all of the fields and display appropriate error messages
- After a user clicks the Scan button, start fetching events from the given endpoint, and display them in a result table
- Display a progress bar during the scanning process.
- The results table should have the following details of the events
  - block number
  - event name
  - event arguments
  - any additional information you think should be included
- Users should be able to sort events on various columns
- (Optional) Users should be able to filter events by name

### Helpful links
- polkadot.js documentation: 
  - https://polkadot.js.org/docs/api/
  - https://polkadot.js.org/docs/api/start/api.query.other#state-at-a-specific-block
  - https://polkadot.js.org/docs/api/examples/promise/system-events
- Polkadot web portal: 
  - https://polkadot.js.org/apps
  - Source code: https://github.com/polkadot-js/apps


## Backend Task

Build a simple node.js server that is able to serve static content and protect it behind a password.

### Requirements
- Use node.js, TypeScript, and any other libraries of your choice
- The server should serve a password prompt on unauthorized access, and after user enter a valid password, it can serve the static content
- Make sure the content are not accessiable without authentication
- The server should serve the content you have built for the frontend task


## Submission
- Please push your code into a Github/Gitlab repository and share the link
- Please make sure you have a README file including build & run instructions
- Deploy the React frontend and share the link
- (Optional) Deploy the node.js server and share the link & password