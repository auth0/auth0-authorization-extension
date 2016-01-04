import { Component } from 'react';

class Sidebar extends Component {
  render() {
    return <div id="sidebar" className="col-xs-2">
        <div className="sidebar-fixed">
          <ul>
            {this.props.children}
          </ul>
        </div>
      </div>;
  }
}

export default Sidebar;
