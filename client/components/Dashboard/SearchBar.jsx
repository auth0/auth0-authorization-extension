import React, { Component, PropTypes } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.searchOptions.find(opt => opt.selected) || this.props.searchOptions[0]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      selectedOption: this.props.searchOptions.find(opt => opt.value === event.target.value)
    });
  }
  render() {
    const { placeholder, iconCode, searchOptions, handleKeyPress, handleReset, showInstructions } = this.props;
    return (
      <div>
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
                <span>Search by </span><span className="truncate" data-select-value>{this.state.selectedOption.title}</span> <i className="icon-budicon-460" />
                <select
                  data-mode
                  value={this.state.selectedOption.value}
                  onChange={this.handleChange}
                >
                  { searchOptions.map((opt) => (<option key={opt.title} value={opt.value}>{opt.title}</option>)) }
                </select>
              </div>
            ) : null }
            { handleReset && <button type="reset" style={{ marginLeft: 0 }} onClick={handleReset}>Reset <i className="icon-budicon-471" /></button> }
          </span>
        </form>
        { showInstructions &&
          <div className="col-xs-12 help-block">
            To perform your search, press <span className="keyboard-button">enter</span>.
            You can also search for specific fields, eg: <strong>email:"john@doe.com"</strong>.
          </div>
        }
      </div>
    );
  }
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  iconCode: PropTypes.number,
  searchOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      selected: PropTypes.bool
    })
  ),
  handleKeyPress: PropTypes.func,
  handleReset: PropTypes.func,
  showInstructions: PropTypes.bool
};

export default SearchBar;
