import is from "is_js"
import { AuthorizationError } from "/errors"

console.log(AuthorizationError)


let Abilities = []


const arrify = value => {
  return is.not.existy(value)
    ? []
    : is.array(value)
      ? value
      : [value]
}


const isInstanceOf = (object, model) => {
  return is.string(object)
    ? object === model.name
    : is.existy(object) && object.__type === model.name
}


export const allow = (model, actions, targets, condition) => {
  if (is.not.function(condition)) condition = () => true

  arrify(actions).forEach(action => {
    arrify(targets).forEach(target => {
      Abilities = Abilities.concat({
        model,
        action,
        target,
        condition,
      })
    })
  })
}


export const can = (model, action, target) => {
  const abilities = Abilities
    .filter(ability => isInstanceOf(model, ability.model))
    .filter(ability =>
      target === ability.target ||
      isInstanceOf(target, ability.target) ||
      ability.target === "all"
    )
    .filter(ability =>
      action === ability.action ||
      ability.action === "manage"
    )
    .map(ability => ability.condition(model, target))

  return Promise
    .all(abilities)
    .then(checks => checks.filter(Boolean))
    .then(checks => is.not.empty(checks))
}


export const cannot = async (model, action, target) => {
  return ! await can(model, action, target)
}


export const authorize = async (model, action, target) => {
  if (await cannot(model, action, target))
    throw new AuthorizationError({ model, action, target})
}
