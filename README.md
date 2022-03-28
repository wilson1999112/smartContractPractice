# smartContractPractice
## How to use
before running the project, you need to:
* `npm install`
* `cd ethereum`
* `node compile`

run the server:
* `npm run dev`

## The project goal
Simulate a simple dao, and use it to decide what the owners do.

It contains:
1. contribute()
    * send ether to the dao 
    * and become a member of the owners
2. transferOwnerPower()
    * transfer your owner power to the other address
    * and make the address become a member of the owners
3. createProposal()
    * send some deposit to the dao
    * and then create a proposal that can transfer ether to some address
4. voteProposal()
    * vote yes to the proposal
5. unvoteProposal()
    * cancel the vote of the proposal
6. getApproveRate()
    * get the approve(yes) rate of the proposal
7. finalizeProposal()
    * if the approve rate is greater than a threshold, then excecute the proposal.
8. getProposalDeposit()
    * if the proposal is complete and msg.sender is the creator of the proposal
    * then send back its deposit ether of the proposal

## Problems
1. The dao cannot resist to 51% attack
2. didn't make use of event emit funciton
3. didn't make test case
4. didn't optimize gas
5. Some UIs don't look pretty