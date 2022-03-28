import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import miniDAO from '../ethereum/miniDAO';
import web3 from '../ethereum/web3';
import { Link, Router } from '../routes';

class MiniDAOTransferOwnerPower extends Component {

    state = {
        receiver: '',
        portion: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const { receiver, portion } = this.state;
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await miniDAO.methods.transferOwnerPower(
                receiver,
                portion
            ).send({ from: accounts[0] });

            Router.pushRoute(`/`)
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    };

    render() {
        return (
        <Layout>
            <h3>Transfer Power to Other Address</h3>

            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={this.state.receiver}
                        onChange={event => 
                        this.setState({ receiver: event.target.value })}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Portion</label>
                    <Input
                        value={this.state.portion}
                        onChange={event => 
                        this.setState({ portion: event.target.value })}
                    />
                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Transfer!</Button>
            </Form>
        </Layout>
        );
    }
}

export default MiniDAOTransferOwnerPower;