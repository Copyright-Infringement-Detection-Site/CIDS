import React from'react';
import {render} from '@testing-library/react';
import LoginForm from './LoginForm';

describe('<LoginForm/>', () => {
  it('matches snapshot', () => {
    const utils = render(<LoginForm show={true}/>);
    expect(utils.container).toMatchSnapshot();
  });
  it('shows the props correctly', ()=>{
    const utils = render(<LoginForm show={true}/>);
    utils.getByPlaceholderText('Enter ID');
    utils.getByPlaceholderText('Password');
  });
});