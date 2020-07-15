// import React from 'react';
// import { shallow } from 'enzyme';
// import { expect } from 'chai';
// import { describe, it } from 'mocha';
// import UserOverview from '../../../../../client/components/Users/UserOverview';

// describe('#Client-Components-UserOverview', () => {
//   const renderComponent = (options) => {
//     options = options || {};

//     const defaultFunction = () => '';
//     return shallow(
//       <UserOverview
//         onReset={options.onReset || defaultFunction}
//         onSearch={options.onSearch || defaultFunction}
//         error={options.error || null}
//         users={options.users || []}
//         total={options.total || 0}
//         loading={options.loading || false}
//         fetchQuery={options.fetchQuery || ''}
//         renderActions={options.renderActions || defaultFunction}
//         getUsersOnPage={options.getUsersOnPage || defaultFunction}
//       />
//     );
//   };

//   it('handleUsersPageChange should use correct query/filter params', (done) => {
//     const pageNum = 1;
//     const selectedFilter = 'email';
//     const options = {
//       fetchQuery: '*@example.com',
//       getUsersOnPage: (page, query, filter) => {
//         expect(page).to.equal(pageNum);
//         expect(query).to.equal(options.fetchQuery);
//         expect(filter).to.equal(selectedFilter);
//         return done();
//       }
//     };

//     const component = renderComponent(options);

//     component.setState({ selectedFilter: { filterBy: selectedFilter } });
//     component.instance().handleUsersPageChange(pageNum);
//   });
// });
