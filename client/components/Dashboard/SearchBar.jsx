import React, { Component } from 'react';

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: {
        title: 'Application',
        value: 'application'
      }
    };

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      selectedOption: this.props.searchOptions.find(opt => opt.value === event.target.value)
    });
  }
  render() {
    const { placeholder, iconCode, searchOptions, handleKeyPress, handleReset } = this.props;
    return (
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
              <span>Search by </span><span className="truncate">{this.state.selectedOption.title}</span> <i className="icon-budicon-460" />
              <select
                value={this.state.selectedOption.value}
                onChange={this.handleChange}
              >
                { searchOptions.map((opt) => {
                  return <option key={opt.title} value={opt.value}>{opt.title}</option>;
                })}
              </select>
            </div>
          ) : null }
          { handleReset && <button type="reset" onClick={handleReset}>Reset <i className="icon-budicon-471" /></button> }
        </span>
      </form>
    );
  }
}

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
