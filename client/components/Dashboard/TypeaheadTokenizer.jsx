import './TypeaheadTokenizer.styl';
import React, { Component } from 'react';
import typeahead from 'react-typeahead';

const Tokenizer = typeahead.Tokenizer;

class TypeaheadTokenizer extends Component {
  render() {
    return (
      <div
        className="tokenizer-container form-control"
        onClick={() => { this.tokenizer.focus(); }}
      >
        <Tokenizer
          ref={(tokenizer => { this.tokenizer = tokenizer; })}
          {...this.props}
        />
      </div>
    );
  }
}

export default TypeaheadTokenizer;
