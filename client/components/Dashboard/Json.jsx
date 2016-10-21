import React, { Component, PropTypes } from 'react';

import './Json.styl';

class Json extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.jsonObject !== this.props.jsonObject;
  }

  // Source: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
  syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-value';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-value';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  render() {
    const orderedObject = {};
    Object.keys(this.props.jsonObject || {}).sort().forEach((key) => {
      orderedObject[key] = this.props.jsonObject[key];
    });

    return <pre className="json-object"
      dangerouslySetInnerHTML={{ __html: this.syntaxHighlight(orderedObject) }}></pre>;
  }
}

Json.propTypes = {
  jsonObject: PropTypes.object.isRequired
};

export default Json;
