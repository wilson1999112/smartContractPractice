import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import miniDAO from '../../ethereum/miniDAO';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class MiniDAONew extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        debatingPeriod: '',
        deposit: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const { description, value, recipient, debatingPeriod, deposit } = this.state;
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await miniDAO.methods.createProposal(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient,
                debatingPeriod
            ).send({ 
                from: accounts[0],
                value: web3.utils.toWei(deposit, 'ether'),
            });
        
            Router.pushRoute(`/proposals`)
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    };

    render() {
        return (
        <Layout>
            <h3>Create a Proposal</h3>

            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        value={this.state.description}
                        onChange={event => 
                            this.setState({ description: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={this.state.value}
                        onChange={event => 
                        this.setState({ value: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Deposit Value in Ether</label>
                    <Input
                        value={this.state.deposit}
                        onChange={event => 
                        this.setState({ deposit: event.target.value })}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Recipient Address</label>
                    <Input
                        value={this.state.recipient}
                        onChange={event => 
                        this.setState({ recipient: event.target.value })}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Debating Period</label>
                    <Input
                        label='sec'
                        labelPosition='right'
                        value={this.state.debatingPeriod}
                        onChange={event => 
                        this.setState({ debatingPeriod: event.target.value })}
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Create!</Button>
            </Form>
        </Layout>
        );
    }
}

export default MiniDAONew;