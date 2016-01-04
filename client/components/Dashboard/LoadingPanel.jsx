import { Component } from 'react';
import Loader from 'react-loader-advanced';
import Spinner from './svg/Spinner.svg';

import './LoadingPanel.css';

class LoadingPanel extends Component {
  constructor(props) {
    super(props);

    // Default styles.
    this.backgroundStyle = {
      padding: '5px', backgroundColor: 'rgba(255,255,255,0.4)', minHeight: '50px'
    };
    this.spinnerStyle = {
      display: 'inline-block',
      height: '64px',
      width: '64px',
      margin: '0px auto'
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
    if (!this.props.show) {
      return <div >{this.props.children}</div>;
    }

    const animation = <div className="loadingAnimation" style={this.animationStyle}>
        <img style={this.spinnerStyle} src={Spinner} />
      </div>;

    return <Loader show={this.props.show} message={animation} contentBlur={1} backgroundStyle={this.backgroundStyle}>{this.props.children}</Loader>;
  }
}


export default LoadingPanel;
