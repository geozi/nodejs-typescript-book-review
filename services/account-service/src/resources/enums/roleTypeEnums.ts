/**
 * RoleType enums.
 * @module src/resources/enums/roleTypeEnums
 */

/**
 * Enums corresponding to user roles.
 *
 * @readonly
 * @enum
 */
export const enum RoleType {
  /**
   * Admin role.
   * @readonly
   * @type {string}
   */
  Admin = "Admin",

  /**
   * User role.
   * @readonly
   * @type {string}
   */
  User = "User",
}

/**
 * Role type array.
 * @type {Array<RoleType>}
 */
export const roleTypeArray = [RoleType.Admin, RoleType.User];
