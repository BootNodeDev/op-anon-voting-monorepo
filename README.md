

## Pre-requisites to Test Anon Voting

1. Have an EOA with OP ETH for gas.
2. Have a valid attestation. Addresses with valid attestations will be enabled to vote on polls where said attestation is required.

### How to issue an attestation to an address:

1. Enter [https://optimism.easscan.org/attestations](https://optimism.easscan.org/attestations)
2. Connect the wallet from which the Attestations are going to be granted (this address will have to be filled in the Anon Voting app as a valid attestation issuer)
3. Click on "Make Attestation"
4. Input `78` in the Schema input field and select `RETROPGF BADGEHOLDER`
5. Click on "Use this Schema"
6. Fill the fields with the following:
    - **Recipient:** The address that will receive the attestation
    - **RPGF ROUND :** `1`
    - **REFERRED BY :** Leave as is. (`0x0000000000000000000000000000000000000000`)
    - **REFERRED METHOD:** `referredMethod`
7. Select "On Chain"
8. Click on "Make attestation"
9. Confirm the transaction

**[Make Batch Attestations using AttestFest!](https://scribehow.com/shared/Make_Batch_attestations_using_Attest_Fest__LZn6__gDQa2fGgsahEU85A)**

## How to use Anon Voting

### Create

1. Provide a unique Poll ID
2. Set a coordinator to govern the lifecycle of the poll
3. Click on Create Poll
4. Click on Generate Identity
5. Set a desired Schema, and click on Set Schema
6. Set a valid Attester, and click on Set Attester
7. :bulb: Now the Poll is open to enrollment. Users have to enroll at this stage to be able to vote.

### Enroll to vote

1. Search for a Poll using its unique ID
2. Click on Generate Identity
3. If your address is attested under the correct Schema, you can enroll to vote.
4. Click on Enroll to vote

### Start the poll

1. Coordinator can click on Start Poll to enable voting for the enrolled users

### Vote

1. Search for a Poll using its unique ID
2. Enrolled users can only vote after the poll started
3. Generate identity
4. Select your vote and click on Cast Vote

### End the poll

1. Once the voting is completed, the coordinator can End the Poll
