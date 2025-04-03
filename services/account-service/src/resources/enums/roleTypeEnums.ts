/**
 * RoleType enums.
 * @module src/resources/enums/roleTypeEnums
 */

/**
 * Contains enums corresponding to user roles.
 *
 * @readonly
 * @enum
 */
export const enum RoleType {
  /**
   * Admin role.
   * @readonly
   * @type {EnumMember}
   */
  Admin = "Admin",

  /**
   * User role.
   * @readonly
   * @type {EnumMember}
   */
  User = "User",
}

/**
 * Role type array.
 * @type {RoleType[]}
 */
export const roleTypeArray = [RoleType.Admin, RoleType.User];
