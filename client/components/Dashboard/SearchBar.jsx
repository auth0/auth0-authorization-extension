import React, { Component } from 'react';

const SearchBar = ({ placeholder, iconCode, onKeyPress, searchOptions }) =>
  <form className="advanced-search-control">
    <span className="search-area">
      <i className={iconCode ? `icon-budicon-${iconCode}` : 'icon-budicon-489'} />
      <input
        className="user-input" type="text" placeholder={placeholder || 'Search'}
        spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={onKeyPress}
      />
    </span>

    <span className="controls pull-right">
      { searchOptions ? (
        <div className="js-select custom-select">
          <span>Search by </span><span className="truncate" data-select-value="">Application</span> <i className="icon-budicon-460" />
          <select data-mode="">
            { searchOptions.map((opt) => {
              return <option value={opt.value} selected={opt.selected}>{opt.title}</option>;
            })}
          </select>
        </div>
      ) : null }
      <button type="reset">Reset <i className="icon-budicon-471" /></button>
    </span>
  </form>;

SearchBar.propTypes = {
  placeholder: React.PropTypes.string,
  iconCode: React.PropTypes.number,
  onKeyPress: React.PropTypes.func,
  searchOptions: React.PropTypes.array
};

export default SearchBar;
