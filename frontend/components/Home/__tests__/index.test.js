import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Home from '../';

describe('<Home />', () => {
  it('should render "Chat for DEVs is a specialised chat for programmers"', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.text()).contains('Chat for DEVs is a specialised chat for programmers');
  });
});