import React, { Component } from 'react';

const SearchBar = ({ placeholder, iconCode, searchOptions, handleKeyPress, handleReset }) =>
  <form className="advanced-search-control">
    <span className="search-area">
      <i className={iconCode ? `icon-budicon-${iconCode}` : 'icon-budicon-489'} />
      <input
        className="user-input" type="text" placeholder={placeholder || 'Search'}
        spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={handleKeyPress}
      />
    </span>

    <span className="controls pull-right">
      { searchOptions ? (
        <div className="js-select custom-select">
          <span>Search by </span><span className="truncate" data-select-value="">Application</span> <i className="icon-budicon-460" />
          <select data-mode="" defaultValue={searchOptions.find((opt) => opt.selected).value}>
            { searchOptions.map((opt) => {
              return <option key={opt.title} value={opt.value}>{opt.title}</option>;
            })}
          </select>
        </div>
      ) : null }
      { handleReset && <button type="reset" onClick={handleReset}>Reset <i className="icon-budicon-471" /></button> }
    </span>
  </form>;

SearchBar.propTypes = {
  placeholder: React.PropTypes.string,
  iconCode: React.PropTypes.number,
  searchOptions: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      selected: React.PropTypes.bool
    })
  ),
  handleKeyPress: React.PropTypes.func,
  handleReset: React.PropTypes.func
};

export default SearchBar;
