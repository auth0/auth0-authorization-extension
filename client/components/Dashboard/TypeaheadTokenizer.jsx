import './TypeaheadTokenizer.styl';
import React, { Component } from 'react';
import typeahead from 'react-typeahead';

const Tokenizer = typeahead.Tokenizer;

const TypeaheadTokenizer = props =>
  <Tokenizer {...props} />;

export default TypeaheadTokenizer;
