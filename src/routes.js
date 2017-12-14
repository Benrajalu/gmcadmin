import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/App';
import Month from './components/Month';
import NewMonth from './components/NewMonth';
import NewCard from './components/NewCard';
import NotFound from './components/NotFound';
import EditCard from './components/EditCard';
import Home from './components/Home';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/month/:id" component={Month} />
      <Route path="/edit/:type/:id" component={EditCard} />
      <Route path="/new-month/" component={NewMonth} />
      <Route path="/new-card/:id" component={NewCard} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;