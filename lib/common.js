'use strict';

// We support the full names and all the abbbreviated aliases:
//   http://kubernetes.io/docs/user-guide/kubectl-overview/
// and anything else we think is useful.

var resourceAliases = {
  clusterroles: [],
  clusterrolebindings: [],
  componentstatuses: ['cs'],
  configmaps: ['cm'],
  cronjobs: [],
  customresourcedefinitions: ['crd'],
  daemonsets: ['ds'],
  deployments: ['deploy'],
  events: ['ev'],
  endpoints: ['ep'],
  horizontalpodautoscalers: ['hpa'],
  ingresses: ['ing'],
  jobs: [],
  limitranges: ['limits'],
  namespaces: ['ns'],
  nodes: ['no'],
  persistentvolumes: ['pv'],
  persistentvolumeclaims: ['pvc'],
  // Deprecated name of statefulsets in kubernetes 1.4
  petsets: [],
  pods: ['po'],
  replicationcontrollers: ['rc'],
  replicasets: ['rs'],
  resourcequotas: ['quota'],
  roles: [],
  rolebindings: [],
  // Deprecated name of cronjobs in kubernetes 1.4
  scheduledjobs: [],
  secrets: [],
  serviceaccounts: [],
  services: ['svc'],
  statefulsets: [],
  // Deprecated name of customresourcedefinition in kubernetes 1.7
  thirdpartyresources: []
};

var esPlurals = {
  componentstatuses: true,
  ingresses: true
};

module.exports.aliasResources = function (resourceObject) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(resourceAliases)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var resourceType = _step.value;

      if (resourceObject[resourceType]) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = resourceAliases[resourceType][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var alias = _step2.value;

            resourceObject[alias] = resourceObject[resourceType];
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var trimLength = esPlurals[resourceType] ? 2 : 1;
        var single = resourceType.substr(0, resourceType.length - trimLength);
        resourceObject[single] = resourceObject[resourceType];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

module.exports.getAliases = function (resourceType) {
  var aliases = [resourceType];
  if (resourceAliases[resourceType]) {
    aliases = aliases.concat(resourceAliases[resourceType]);
  }

  var trimLength = esPlurals[resourceType] ? 2 : 1;
  var single = resourceType.substr(0, resourceType.length - trimLength);
  aliases.push(single);
  return aliases;
};