import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Supermarket extends Component {
  componentWillMount() {
  	route('/');
  }

  render() {
  	return null;
  }
}
