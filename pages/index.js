import React, { Component } from "react";
import { Card, Button, Table } from "semantic-ui-react";
import miniDAO from '../ethereum/miniDAO';
import Layout from "../components/Layout";
import { Link } from '../routes';
import ContributorRow from "../components/ContributorRow";
class MiniDAOIndex extends Component {

    static async getInitialProps(props) {
        const ownerCount = await miniDAO.methods.ownerCount().call();
        const owners = await Promise.all(
            Array(parseInt(ownerCount)).fill().map((element, index) =>{
                return miniDAO.methods.ownerList(index).call();
            })
        );
        const ownerPowers = await Promise.all(
            owners.map((element, index) =>{
                return miniDAO.methods.ownerPower(element).call();
            })
        );
        console.log(owners);
        console.log(ownerPowers);
        return { owners, ownerPowers, ownerCount };
    }

    renderRows() {
        return this.props.owners.map((owner, index) => {
            return <ContributorRow
            key={index}
            id={index}
            owner={owner}
            power={this.props.ownerPowers[index]}
            />
        });
    }

    render() {
        const {Header, Row, HeaderCell, Body} = Table;
        return (
        <Layout>
            <h3>Want To Transfer Owner Power?</h3>
                <Link route={`/transfer`}>
                <a>
                    <Button primary floated="left" style={{ marginBottom: 10 }}>Transfer Now!</Button>
                </a>
                </Link>
            <br /><br /><br />
            <h3>Want To Become an Owner?</h3>
                <Link route={`/contribute`}>
                <a>
                    <Button primary floated="left" style={{ marginBottom: 10 }}>Contribute Now!</Button>
                </a>
                </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Power</HeaderCell>
                        <HeaderCell>Owner Address</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {this.renderRows()}
                </Body>
            </Table>
                <div>Found {this.props.ownerCount} owners</div>
        </Layout>
        );
    }
}

export default MiniDAOIndex;