export default (props) => {
  if (props.currentCount === 0 || props.totalCount === 0) {
    return <div></div>;
  }

  return <div className="actions-group pull-left">
    Showing <strong>{props.currentCount}</strong> of <strong>{props.totalCount}</strong>
  </div>;
};
