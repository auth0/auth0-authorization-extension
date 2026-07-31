const React = require("react");
const { render, act } = require("@testing-library/react");
const { expect } = require("chai");
const UserOverview = require("../../../../../client/components/Users/UserOverview.jsx").default;

describe("#Client-Components-UserOverview", () => {
  const renderComponent = (options) => {
    options = options || {};

    const defaultFunction = () => "";
    const ref = React.createRef();
    render(
      React.createElement(UserOverview, {
        ref,
        onReset: options.onReset || defaultFunction,
        onSearch: options.onSearch || defaultFunction,
        error: options.error || null,
        users: options.users || [],
        total: options.total || 0,
        loading: options.loading || false,
        fetchQuery: options.fetchQuery || "",
        renderActions: options.renderActions || defaultFunction,
        getUsersOnPage: options.getUsersOnPage || defaultFunction,
      })
    );
    return ref;
  };

  it("handleUsersPageChange should use correct query/filter params", (done) => {
    const pageNum = 1;
    const selectedFilter = "email";
    const options = {
      fetchQuery: "*@example.com",
      getUsersOnPage: (page, query, filter) => {
        expect(page).to.equal(pageNum);
        expect(query).to.equal(options.fetchQuery);
        expect(filter).to.equal(selectedFilter);
        return done();
      },
    };

    const ref = renderComponent(options);

    act(() => {
      ref.current.setState({ selectedFilter: { filterBy: selectedFilter } });
    });
    ref.current.handleUsersPageChange(pageNum);
  });
});
