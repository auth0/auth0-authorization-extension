import expect from 'expect';
import { GroupContainer } from '../../../../client/containers/Group';

const records = [
  { user_id: 'a1', name: 'Alice', email: 'alice@example.com', identities: [ { connection: 'Username-Password' } ] },
  { user_id: 'b2', name: 'bob@example.com', email: 'bob@example.com', identities: [ { connection: 'google-oauth2' } ] }
];

describe('#Client-Containers-Group', () => {
  describe('getUserPickerDialogUsers', () => {
    const container = new GroupContainer();

    it('maps records to react-select options with value/label/userId', () => {
      expect(container.getUserPickerDialogUsers(records)).toEqual([
        { value: 'alice@example.com - Username-Password', label: 'Alice', userId: 'a1' },
        { value: 'bob@example.com - google-oauth2', label: null, userId: 'b2' }
      ]);
    });

    it('returns an empty array for empty or missing records', () => {
      expect(container.getUserPickerDialogUsers([])).toEqual([]);
      expect(container.getUserPickerDialogUsers(null)).toEqual([]);
      expect(container.getUserPickerDialogUsers(undefined)).toEqual([]);
    });
  });

  describe('fetchPickerUsers', () => {
    it('maps payload.data.users before invoking the success callback', () => {
      const container = new GroupContainer();
      container.props = {
        fetchUsers: (q, field, reset, perPage, page, onSuccess) =>
          onSuccess({ data: { users: records } })
      };

      let mapped;
      container.fetchPickerUsers('name:a*', null, true, null, null, (options) => {
        mapped = options;
      });

      expect(mapped).toEqual([
        { value: 'alice@example.com - Username-Password', label: 'Alice', userId: 'a1' },
        { value: 'bob@example.com - google-oauth2', label: null, userId: 'b2' }
      ]);
    });

    it('forwards all fetch arguments unchanged to fetchUsers', () => {
      const container = new GroupContainer();
      let received;
      container.props = {
        fetchUsers: (...args) => {
          received = args.slice(0, 5);
          args[5]({ data: { users: [] } });
        }
      };

      container.fetchPickerUsers('name:a*', 'name', true, 20, 2, () => {});
      expect(received).toEqual([ 'name:a*', 'name', true, 20, 2 ]);
    });

    it('yields an empty option list when the payload has no data', () => {
      const container = new GroupContainer();
      container.props = { fetchUsers: (q, f, r, pp, pg, onSuccess) => onSuccess(null) };

      let mapped;
      container.fetchPickerUsers('name:a*', null, true, null, null, (options) => {
        mapped = options;
      });

      expect(mapped).toEqual([]);
    });
  });
});
