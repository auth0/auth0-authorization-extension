import expect from 'expect';
import GroupsOverview from '../../../../../client/components/Groups/GroupsOverview';

const records = [
  { user_id: 'a1', name: 'Alice', email: 'alice@example.com', identities: [ { connection: 'Username-Password' } ] },
  { user_id: 'b2', name: 'bob@example.com', email: 'bob@example.com', identities: [ { connection: 'google-oauth2' } ] },
  { user_id: 'c3', name: 'Carol', email: null, identities: [ { connection: 'Username-Password' } ] }
];

describe('#Client-Components-GroupsOverview', () => {
  describe('getUserPickerDialogUsers', () => {
    const overview = new GroupsOverview();

    it('maps records to react-select options with value/label/userId', () => {
      expect(overview.getUserPickerDialogUsers(records)).toEqual([
        { value: 'alice@example.com - Username-Password', label: 'Alice', userId: 'a1' },
        { value: 'bob@example.com - google-oauth2', label: null, userId: 'b2' },
        { value: 'Carol - Username-Password', label: 'Carol', userId: 'c3' }
      ]);
    });

    it('nulls the label when name equals email (avoids redundant display)', () => {
      const [ , sameNameEmail ] = overview.getUserPickerDialogUsers(records);
      expect(sameNameEmail.label).toBe(null);
    });

    it('returns an empty array for empty, null, or undefined records', () => {
      expect(overview.getUserPickerDialogUsers([])).toEqual([]);
      expect(overview.getUserPickerDialogUsers(null)).toEqual([]);
      expect(overview.getUserPickerDialogUsers(undefined)).toEqual([]);
    });
  });

  describe('fetchPickerUsers', () => {
    it('maps payload.data.users before invoking the success callback', () => {
      const overview = new GroupsOverview();
      overview.props = {
        fetchUsers: (q, field, reset, perPage, page, onSuccess) =>
          onSuccess({ data: { users: records } })
      };

      let mapped;
      overview.fetchPickerUsers('name:a*', null, true, null, null, (options) => {
        mapped = options;
      });

      expect(mapped).toEqual([
        { value: 'alice@example.com - Username-Password', label: 'Alice', userId: 'a1' },
        { value: 'bob@example.com - google-oauth2', label: null, userId: 'b2' },
        { value: 'Carol - Username-Password', label: 'Carol', userId: 'c3' }
      ]);
    });

    it('forwards all fetch arguments unchanged to fetchUsers', () => {
      const overview = new GroupsOverview();
      let received;
      overview.props = {
        fetchUsers: (...args) => {
          received = args.slice(0, 5);
          args[5]({ data: { users: [] } });
        }
      };

      overview.fetchPickerUsers('name:a*', 'name', true, 20, 2, () => {});
      expect(received).toEqual([ 'name:a*', 'name', true, 20, 2 ]);
    });

    it('yields an empty option list when the payload has no data', () => {
      const overview = new GroupsOverview();
      overview.props = { fetchUsers: (q, f, r, pp, pg, onSuccess) => onSuccess(null) };

      let mapped;
      overview.fetchPickerUsers('name:a*', null, true, null, null, (options) => {
        mapped = options;
      });

      expect(mapped).toEqual([]);
    });
  });
});
