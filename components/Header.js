import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link route='/'>
                <a className="item">
                MiniDAO
                </a>
            </Link>
            <Menu.Menu position="right">
            <Link route='/proposals'>
                <a className="item">
                view proposals
                </a>
            </Link>
                
            </Menu.Menu>
        </Menu>
    );
};