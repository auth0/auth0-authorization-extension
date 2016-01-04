export default () => (
  <div className="row">
    <div className="col-xs-12 wrapper">
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
        {this.props.children}
        </ul>
      </div>
    </div>
  </div>
);
