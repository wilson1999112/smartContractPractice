import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import miniDAO from '../ethereum/miniDAO';

class RequestRow extends Component {

    vote = async () => {
        const accounts = await web3.eth.getAccounts();
        await miniDAO.methods.voteProposal(this.props.id).send({
            from: accounts[0]
        });
    };

    unvote = async () => {
        const accounts = await web3.eth.getAccounts();
        await miniDAO.methods.unvoteProposal(this.props.id).send({
            from: accounts[0]
        });
    };


    finalize = async () => {
        const accounts = await web3.eth.getAccounts();
        await miniDAO.methods.finalizeProposal(this.props.id).send({
            from: accounts[0]
        });
    };

    getDeposit = async () => {
        const accounts = await web3.eth.getAccounts();
        await miniDAO.methods.getProposalDeposit(this.props.id).send({
            from: accounts[0]
        });
    };

    render() {
        const { Row, Cell } = Table;
        const { id, proposal, approveRate } = this.props;
        return (
            <Row 
                // disabled={proposal.complete}
                // positive={approveRate > 50 && !proposal.complete}
            >
                <Cell>{id}</Cell>
                <Cell>{proposal.description}</Cell>
                <Cell>{web3.utils.fromWei(proposal.value, 'ether')}</Cell>
                <Cell>{proposal.recipient}</Cell>
                <Cell>{proposal.creator}</Cell>
                <Cell>{approveRate}</Cell>
                <Cell>
                    {proposal.complete ? null: (
                    <Button color="green" basic onClick={this.vote}>
                        Vote
                    </Button>
                    )}
                </Cell>
                <Cell>
                    {proposal.complete ? null: (
                    <Button color="red" basic onClick={this.unvote}>
                        Unvote
                    </Button>
                    )}
                </Cell>
                <Cell>
                    {(approveRate < 50 || proposal.complete) ? null: (
                    <Button color="teal" basic onClick={this.finalize}>
                        Finalize
                    </Button>
                    )}
                </Cell>
                <Cell>
                    {(!proposal.complete) ? null: (
                    <Button color="yellow" basic onClick={this.getDeposit}>
                        Get
                    </Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;