class RBAC {
  constructor(roles) {
    if (typeof roles !== 'object') {
      throw new TypeError('Expected object as an input');
    }
    this.roles = roles;
  }

  can(role, operator) {

    // check if role exists
    if (!this.roles[role]) {
      return false;
    }

    let $role = this.roles[role];

    // if role has that allowed operation
    if ($role.can.indexOf(operation) !== -1) {
      return true;
    }

    // check for parents
    if (!$role.inherits || $role.inherits.length < 1) {
      return false;
    }

    return $role.inherits.some(childRole => this.can(childRole, operation));
    
  }
}