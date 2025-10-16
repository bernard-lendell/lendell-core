import { empty, isObj, isArr } from "./index.js";

export const validatorTypes = {
  ALLOW_ANY: "allowAny",
  ALLOW_NOTHING: "allowNothing",
  ALLOW_ANY_EXCEPT_ITEMS: "allowAnyExceptItems",
  ALLOW_ONLY_ITEMS: "allowOnlyItems",
  ALLOW_IF_MATCH_IN_LIST: "allowIfMatchInList",
  RESTRICT_IF_MATCH_IN_LIST: "restrictIfMatchInList",
};

const validators = {
  allowAny: () => true,
  allowNothing: () => false,
  allowAnyExceptItems: (val, items) => !items.includes(val),
  allowOnlyItems: (val, items) => items.includes(val),
  allowIfMatchInList: (val, conditions) => {
    // Returns true if at least one "condition" is "met" from an array of conditions.
    // A "condition" is an object with properties
    // For the "condition" to be "met", `val` should have all of the condition's properties

    for (const condition of conditions) {
      let match = true;

      for (const key in condition) {
        if (!val[key] || condition[key] !== val[key]) {
          match = false;
          break;
        }
      }

      if (match) return true;
    }

    return false;
  },
  restrictIfMatchInList: (val, conditions) => {
    for (const condition of conditions) {
      let match = true;

      for (const key in condition) {
        if (!val[key] || condition[key] !== val[key]) {
          match = false;
          break;
        }
      }

      if (match) return false;
    }

    return true;
  },
};

export const allowed = (accessMode, accessRules = null, value) => {
  if (accessRules === null) return true;
  if (empty(accessRules[accessMode])) return true;
  if (!isObj(accessRules)) throw "`accessRules` argument must be an object.";

  // If accessRule is a map or an array
  if (typeof accessRules[accessMode] === "object") {
    if (isArr(accessRules[accessMode])) {
      for (const item of accessRules[accessMode]) {
        const validator = item.validator;
        const args = item.args;

        if (validators[validator](value, args)) return true;
      }

      return false;
    } else {
      const validator = accessRules[accessMode].validator;
      const args = accessRules[accessMode].args;

      return validators[validator](value, args);
    }
  } else {
    throw "`accessRule` must be an object or an array.";
  }
};
