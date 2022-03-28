import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import { Button, Table } from 'semantic-ui-react';
import miniDAO from '../../ethereum/miniDAO'
import ProposalRow from '../../components/ProposalRow';
class ProposalIndex extends Component {
    static async getInitialProps(props) {
        const proposalCount = await miniDAO.methods.proposalsCount().call();
        const proposals = await Promise.all(
            Array(parseInt(proposalCount)).fill().map((element, index) =>{
                return miniDAO.methods.proposals(index).call();
            })
        );
        const approveRates = await Promise.all(
            Array(parseInt(proposalCount)).fill().map((element, index) =>{
                return miniDAO.methods.getApproveRate(index).call();
            })
        );
        return { proposals, proposalCount, approveRates };
    }

    renderRows() {
        return this.props.proposals.map((proposal, index) => {
            return <ProposalRow
            key={index}
            id={index}
            proposal={proposal}
            approveRate={this.props.approveRates[index]}
            />
        });
    }

    render () {
        const {Header, Row, HeaderCell, Body} = Table;
        return (
            <Layout>
                <h3>Proposals</h3>
                <Link route={`/proposals/new`}>
                <a>
                    <Button primary floated="right" style={{ marginBottom: 10 }}>Add Proposal</Button>
                </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Value</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Creator</HeaderCell>
                            <HeaderCell>ApproveRate</HeaderCell>
                            <HeaderCell>Vote</HeaderCell>
                            <HeaderCell>Unvote</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                            <HeaderCell>GetDeposit</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
            </Layout>
        );
    }
}

export default ProposalIndex;