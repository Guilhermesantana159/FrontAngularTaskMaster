/**
 * Group User List
 */
 export interface GroupUser {
  name: string;
  unread?: string;
}
  /**
 * Contact List
 */
   export interface ContactModel {
    title: string;
    contacts: Array<{
      name?: any;
      profile?: string;
    }>;
  }
