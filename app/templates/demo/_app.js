'use strict';

import React from 'react/addons';
import <%= componentName %> from '../src/<%= projectName %>';

const App = React.createClass({

  render() {
    return (
      <div className="demo">
        < <%= componentName %> >
          component stuff goes here
        </ <%= componentName %> >
      </div>
    )
  }
});

const content = document.getElementById('content');

React.render(<App/>, content)

