import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import miniDAO from '../ethereum/miniDAO';
import web3 from '../ethereum/web3';
import { Link, Router } from '../routes';

class MiniDAOContribute extends Component {

    state = {
        value: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const { value } = this.state;
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await miniDAO.methods.contribute()
                .send({ 
                    from: accounts[0],
                    value: web3.utils.toWei(value, 'ether')
                });
        
            Router.pushRoute(`/`)
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    };

    render() {
        return (
        <Layout>
            <h3>Contribute to the project</h3>

            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={this.state.value}
                        onChange={event => 
                        this.setState({ value: event.target.value })}
                    />
                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Contribute!</Button>
            </Form>
        </Layout>
        );
    }
}

export default MiniDAOContribute;