# EVM-Pay-that-bill Plugin Key Features

## Plugin Components
The plugin consists of a non-visual element named `w3authblock`, which offers the following functionalities:

### Actions
1. **Login**
   - Calls a login form using social accounts.
   - Logs the user in, generating an on-chain address ("wallet") and a smart address for the user in accordance with EIP-4337.

2. **Logout**
   - Logs the user out.

3. **MakeRawBillUserOp**
   - Computes the request (e.g., bill) creation userOp calldata.
   - Signs it on behalf of the user's smart account.
   - Sends it to the Bundler.

4. **PayTheBillUserOp**
   - Computes the request payment userOp calldata.
   - Signs it on behalf of the user's smart account.
   - Sends it to the Bundler.

5. **CancelTheBillUserOp**
   - Computes the request rejecting userOp calldata.
   - Signs it on behalf of the user's smart account.
   - Sends it to the Bundler.

### Events
- **logged**
  - Occurs when the user is logged in.
- **unlogged**
  - Occurs when the user is logged out.
- **requesttx_sent**
  - Occurs when the request creation userOp is sent to the Bundler.
- **request_deployed**
  - Occurs when the request (which is a smart contract) is deployed on-chain.
- **requestpayment_sent**
  - Occurs when the request payment userOp is sent to the Bundler.
- **requestcancel_sent**
  - Occurs when the request reject userOp is sent to the Bundler.

### Exposed States
- **wallet_address**
  - The logged-in user's wallet address.
- **smart_wallet_address**
  - The logged-in user's smart wallet (EIP-4337) address.
- **smart_wallet_shortened**
  - The smart wallet in a shortened form (e.g., `0xAAAAA..AAAAA`).
- **requestaddrpredicted**
  - The predicted on-chain address for a request being created or already created (smart contract).
- **request_created_amount**
  - The value of the request created.
- **request_created_to**
  - The payee of the request created.
- **request_created_from**
  - The payer of the request created.
- **request_created_asset**
  - The asset address of the request created (`0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` denotes native chain token).
