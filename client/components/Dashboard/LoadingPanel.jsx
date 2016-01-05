import React, { Component } from 'react';
import Loader from 'react-loader-advanced';
import Spinner from './svg/Spinner.svg';

import './LoadingPanel.css';

class LoadingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    // Default styles.
    this.backgroundStyle = {
      padding: '5px',
      backgroundColor: 'rgba(255,255,255,0.4)',
      minHeight: '50px',
      ...this.props.spinnerStyle
    };
    this.spinnerStyle = {
      display: 'inline-block',
      height: '64px',
      width: '64px',
      margin: '0px auto',
      ...this.props.spinnerStyle
    };
    this.animationStyle = {
      backgroundColor: 'transparent',
      textAlign: 'center',
      paddingTop: '55px',
      paddingBottom: '55px',
      marginTop: '10px',
      marginBottom: '10px',
      ...this.props.animationStyle
    };
  }

  render() {
    if (!this.state.show) {
      return <div >{this.props.children}</div>;
    }

    const animation = <div className="loadingAnimation" style={this.animationStyle}>
        <img style={this.spinnerStyle} src={Spinner} />
      </div>;

    return <Loader show={this.state.show} message={animation} contentBlur={1} backgroundStyle={this.backgroundStyle}>
      {this.props.children}
    </Loader>;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.show) {
      clearTimeout(this.showTimer);
      return this.setState({
        show: false
      });
    }

    this.showTimer = setTimeout(() => { this.setState({ show: true }); }, this.props.delay || 100);
  }

  componentWillUnmount() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
    }
  }
}

LoadingPanel.propTypes = {
  backgroundStyle: React.PropTypes.object,
  spinnerStyle: React.PropTypes.object,
  animationStyle: React.PropTypes.object,
  show: React.PropTypes.bool,
  delay: React.PropTypes.numeric
};

export default LoadingPanel;
