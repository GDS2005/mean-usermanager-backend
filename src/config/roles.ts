const allRoles = {
  user: ['getProducts', 'getStocks', 'manageStocks'],
  admin: ['getUsers', 'getProducts', 'getStocks', 'manageUsers', 'manageProducts', 'manageStocks'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
