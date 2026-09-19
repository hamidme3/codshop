import type { Access } from 'payload';

export const isSuperadmin = (user: any): boolean => {
  return user?.role === 'superadmin';
};

export const superadminOnly: Access = ({ req: { user } }) => {
  return isSuperadmin(user);
};

export const scopedAccess = (collectionStoreField = 'store'): Access => {
  return ({ req: { user } }) => {
    if (!user) return false;
    if (isSuperadmin(user)) return true; // Superadmin has unrestricted global access

    // Store owners can only access records belonging to their assigned store
    if (user.store) {
      const storeId = typeof user.store === 'object' ? user.store.id : user.store;
      return {
        [collectionStoreField]: {
          equals: storeId,
        },
      };
    }

    return false;
  };
};

export const storeScopedOrSuperadmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (isSuperadmin(user)) return true;

  if (user.store) {
    const storeId = typeof user.store === 'object' ? user.store.id : user.store;
    return {
      id: {
        equals: storeId,
      },
    };
  }

  return false;
};
