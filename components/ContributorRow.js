import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import miniDAO from '../ethereum/miniDAO';

class ContributorRow extends Component {


    render() {
        const { Row, Cell } = Table;
        const { id, owner, power } = this.props;
        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{power}</Cell>
                <Cell>{owner}</Cell>
            </Row>
        );
    }
}

export default ContributorRow;