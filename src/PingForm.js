var React = require('react');
require('es6-promise').polyfill();
require('whatwg-fetch');
var Results = require('./Results');

var PingForm = React.createClass({

  getInitialState() {
    return {
      show_results: false,
      show_pinging: false,
      successes: [],
      failures: []
    };
  },

  pinging() {
    if (this.state.show_pinging) {
      return (
        <h2>PINGING&hellip;</h2>
      )
    } else {
      return null;
    }
  },

  ping(ev) {
    var setState = function(state) {
      this.setState({
        successes: state.successes,
        failures: state.failures,
        show_results: true,
        show_pinging: false
      });
    }.bind(this);

    ev.preventDefault();
    this.setState({
      show_pinging: true,
      show_results: false
    }, function() {
        var body = {
          url: this.refs.url.getDOMNode().value
        };
        fetch('./ping', {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
       }).then(function(response) {
        return response.json()
      }).then(function(json) {
        setState(json);
      });
    }.bind(this))
},

render() {
  return (
    <div>
      <p>Enter the path of the page that you want to test. Red October will attempt to fetch the page from each of the AEM publishers and dispay the results.</p>
      <p>Requests will time out after 20 seconds.</p>
      <form id="ping" action="/ping" method="POST">
        <label style={{display: 'inline'}} htmlFor="url">http:&#47;&#47;www.sfu.ca</label>
        <input type="text" id="url" ref="url" name="url" defaultValue="/itservices.html" placeholder="/path/to/page/to/test.html" />
        <input onClick={this.ping} type="submit" value="Give me a ping, Vasily. One ping only, please." />
      </form>
      {this.pinging()}
      <Results showResults={this.state.show_results} successes={this.state.successes} failures={this.state.failures} />
    </div>
    );
}

});

module.exports = PingForm;