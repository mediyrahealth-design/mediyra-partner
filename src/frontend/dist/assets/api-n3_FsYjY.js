var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { p as ProtocolError, T as TimeoutWaitingForResponseErrorCode, q as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, t as Certificate, w as lookupResultToBuffer, x as RequestStatusResponseStatus, U as UnknownError, y as RequestStatusDoneNoReplyErrorCode, z as RejectError, A as CertifiedRejectErrorCode, B as UNREACHABLE_ERROR, I as InputError, D as InvalidReadStateRequestErrorCode, F as ReadRequestType, H as Principal, J as IDL, K as MissingCanisterIdErrorCode, N as HttpAgent, O as encode, Q as QueryResponseStatus, V as UncertifiedRejectErrorCode, W as isV3ResponseBody, X as isV2ResponseBody, Y as UncertifiedRejectUpdateErrorCode, Z as UnexpectedErrorCode, _ as decode, g as Subscribable, $ as pendingThenable, a0 as resolveEnabled, s as shallowEqualObjects, a1 as resolveStaleTime, k as noop, a2 as environmentManager, a3 as isValidTimeout, a4 as timeUntilStale, a5 as timeoutManager, a6 as focusManager, a7 as fetchState, a8 as replaceData, n as notifyManager, r as reactExports, l as shouldThrowError, b as useQueryClient, a9 as useInternetIdentity, aa as createActorWithConfig, ab as Variant, ac as Record, ad as Vec, ae as Opt, af as Service, ag as Func, ah as Text, ai as Nat, aj as Null, ak as Int, al as Bool } from "./index-DC8ICoH5.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const Gender = Variant({
  "other": Null,
  "female": Null,
  "male": Null
});
const BookPatientRequest = Record({
  "age": Nat,
  "name": Text,
  "refDoctor": Text,
  "gender": Gender,
  "testIds": Vec(Nat),
  "mobile": Text
});
const SampleStatus = Variant({
  "sampleReceived": Null,
  "sampleCollected": Null,
  "reportReady": Null,
  "processing": Null
});
const PatientPublic = Record({
  "id": Text,
  "age": Nat,
  "status": SampleStatus,
  "name": Text,
  "refDoctor": Text,
  "centerId": Text,
  "bookingDate": Int,
  "gender": Gender,
  "testIds": Vec(Nat),
  "mobile": Text
});
const PaymentStatus = Variant({
  "pending": Null,
  "paid": Null
});
const PaymentPublic = Record({
  "id": Nat,
  "status": PaymentStatus,
  "date": Int,
  "invoiceNumber": Text,
  "centerId": Text,
  "notes": Text,
  "amount": Nat
});
const BillingStats = Record({
  "totalTests": Nat,
  "totalCommission": Nat,
  "lastPayment": Opt(PaymentPublic)
});
const CenterStatus = Variant({
  "active": Null,
  "inactive": Null
});
const CollectionCenterPublic = Record({
  "id": Text,
  "status": CenterStatus,
  "ownerName": Text,
  "name": Text,
  "createdAt": Int,
  "email": Text,
  "address": Text,
  "phone": Text
});
const DashboardStats = Record({
  "todaysSamples": Nat,
  "pendingReports": Nat,
  "totalBookings": Nat,
  "thisMonthRevenue": Nat
});
const Report = Record({
  "id": Nat,
  "reportUrl": Text,
  "patientId": Text,
  "filename": Text,
  "centerId": Text,
  "uploadedAt": Int
});
const LabTest = Record({
  "id": Nat,
  "mrpPrice": Nat,
  "fastingRequired": Bool,
  "name": Text,
  "sampleType": Text,
  "tubeType": Text,
  "reportTime": Text,
  "category": Text,
  "partnerPrice": Nat
});
const Role = Variant({
  "admin": Null,
  "collectionCenter": Null
});
const Session = Record({
  "token": Text,
  "userId": Text,
  "createdAt": Int,
  "role": Role
});
const LoginResult = Variant({ "ok": Session, "err": Text });
Service({
  "addCenter": Func(
    [
      Text,
      Text,
      Text,
      Text,
      Text,
      Text,
      Text,
      Text
    ],
    [Bool],
    []
  ),
  "addPayment": Func(
    [Text, Text, Nat, Text, Text],
    [Nat],
    []
  ),
  "addTest": Func(
    [
      Text,
      Text,
      Text,
      Text,
      Text,
      Bool,
      Text,
      Nat,
      Nat
    ],
    [Nat],
    []
  ),
  "bookPatient": Func([Text, BookPatientRequest], [Text], []),
  "deleteTest": Func([Text, Nat], [Bool], []),
  "getAllPatients": Func([Text], [Vec(PatientPublic)], ["query"]),
  "getBillingStats": Func([Text, Text], [BillingStats], ["query"]),
  "getCenterById": Func(
    [Text, Text],
    [Opt(CollectionCenterPublic)],
    ["query"]
  ),
  "getCenters": Func(
    [Text],
    [Vec(CollectionCenterPublic)],
    ["query"]
  ),
  "getDashboardStats": Func([Text], [DashboardStats], ["query"]),
  "getMyCenter": Func(
    [Text],
    [Opt(CollectionCenterPublic)],
    ["query"]
  ),
  "getPatientByIdOrMobile": Func(
    [Text, Text],
    [Opt(PatientPublic)],
    ["query"]
  ),
  "getPatientsByCenter": Func(
    [Text],
    [Vec(PatientPublic)],
    ["query"]
  ),
  "getPaymentsByCenter": Func(
    [Text, Text],
    [Vec(PaymentPublic)],
    ["query"]
  ),
  "getReportsByCenter": Func(
    [Text, Text, Opt(Int), Opt(Int)],
    [Vec(Report)],
    ["query"]
  ),
  "getReportsByPatient": Func(
    [Text, Text],
    [Vec(Report)],
    ["query"]
  ),
  "getTestById": Func([Nat], [Opt(LabTest)], ["query"]),
  "getTests": Func([], [Vec(LabTest)], ["query"]),
  "login": Func([Text, Text], [LoginResult], []),
  "logout": Func([Text], [Bool], []),
  "markPaymentPaid": Func([Text, Nat], [Bool], []),
  "setCenterStatus": Func([Text, Text, Bool], [Bool], []),
  "updateCenter": Func(
    [Text, Text, Text, Text, Text, Text, Text],
    [Bool],
    []
  ),
  "updateSampleStatus": Func(
    [Text, Text, SampleStatus],
    [Opt(PatientPublic)],
    []
  ),
  "updateTest": Func([Text, LabTest], [Bool], []),
  "uploadReport": Func(
    [Text, Text, Text, Text],
    [Nat],
    []
  ),
  "validateSession": Func([Text], [Opt(Session)], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const Gender2 = IDL2.Variant({
    "other": IDL2.Null,
    "female": IDL2.Null,
    "male": IDL2.Null
  });
  const BookPatientRequest2 = IDL2.Record({
    "age": IDL2.Nat,
    "name": IDL2.Text,
    "refDoctor": IDL2.Text,
    "gender": Gender2,
    "testIds": IDL2.Vec(IDL2.Nat),
    "mobile": IDL2.Text
  });
  const SampleStatus2 = IDL2.Variant({
    "sampleReceived": IDL2.Null,
    "sampleCollected": IDL2.Null,
    "reportReady": IDL2.Null,
    "processing": IDL2.Null
  });
  const PatientPublic2 = IDL2.Record({
    "id": IDL2.Text,
    "age": IDL2.Nat,
    "status": SampleStatus2,
    "name": IDL2.Text,
    "refDoctor": IDL2.Text,
    "centerId": IDL2.Text,
    "bookingDate": IDL2.Int,
    "gender": Gender2,
    "testIds": IDL2.Vec(IDL2.Nat),
    "mobile": IDL2.Text
  });
  const PaymentStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "paid": IDL2.Null
  });
  const PaymentPublic2 = IDL2.Record({
    "id": IDL2.Nat,
    "status": PaymentStatus2,
    "date": IDL2.Int,
    "invoiceNumber": IDL2.Text,
    "centerId": IDL2.Text,
    "notes": IDL2.Text,
    "amount": IDL2.Nat
  });
  const BillingStats2 = IDL2.Record({
    "totalTests": IDL2.Nat,
    "totalCommission": IDL2.Nat,
    "lastPayment": IDL2.Opt(PaymentPublic2)
  });
  const CenterStatus2 = IDL2.Variant({
    "active": IDL2.Null,
    "inactive": IDL2.Null
  });
  const CollectionCenterPublic2 = IDL2.Record({
    "id": IDL2.Text,
    "status": CenterStatus2,
    "ownerName": IDL2.Text,
    "name": IDL2.Text,
    "createdAt": IDL2.Int,
    "email": IDL2.Text,
    "address": IDL2.Text,
    "phone": IDL2.Text
  });
  const DashboardStats2 = IDL2.Record({
    "todaysSamples": IDL2.Nat,
    "pendingReports": IDL2.Nat,
    "totalBookings": IDL2.Nat,
    "thisMonthRevenue": IDL2.Nat
  });
  const Report2 = IDL2.Record({
    "id": IDL2.Nat,
    "reportUrl": IDL2.Text,
    "patientId": IDL2.Text,
    "filename": IDL2.Text,
    "centerId": IDL2.Text,
    "uploadedAt": IDL2.Int
  });
  const LabTest2 = IDL2.Record({
    "id": IDL2.Nat,
    "mrpPrice": IDL2.Nat,
    "fastingRequired": IDL2.Bool,
    "name": IDL2.Text,
    "sampleType": IDL2.Text,
    "tubeType": IDL2.Text,
    "reportTime": IDL2.Text,
    "category": IDL2.Text,
    "partnerPrice": IDL2.Nat
  });
  const Role2 = IDL2.Variant({
    "admin": IDL2.Null,
    "collectionCenter": IDL2.Null
  });
  const Session2 = IDL2.Record({
    "token": IDL2.Text,
    "userId": IDL2.Text,
    "createdAt": IDL2.Int,
    "role": Role2
  });
  const LoginResult2 = IDL2.Variant({ "ok": Session2, "err": IDL2.Text });
  return IDL2.Service({
    "addCenter": IDL2.Func(
      [
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text
      ],
      [IDL2.Bool],
      []
    ),
    "addPayment": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Nat, IDL2.Text, IDL2.Text],
      [IDL2.Nat],
      []
    ),
    "addTest": IDL2.Func(
      [
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Text,
        IDL2.Bool,
        IDL2.Text,
        IDL2.Nat,
        IDL2.Nat
      ],
      [IDL2.Nat],
      []
    ),
    "bookPatient": IDL2.Func([IDL2.Text, BookPatientRequest2], [IDL2.Text], []),
    "deleteTest": IDL2.Func([IDL2.Text, IDL2.Nat], [IDL2.Bool], []),
    "getAllPatients": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(PatientPublic2)],
      ["query"]
    ),
    "getBillingStats": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [BillingStats2],
      ["query"]
    ),
    "getCenterById": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Opt(CollectionCenterPublic2)],
      ["query"]
    ),
    "getCenters": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(CollectionCenterPublic2)],
      ["query"]
    ),
    "getDashboardStats": IDL2.Func([IDL2.Text], [DashboardStats2], ["query"]),
    "getMyCenter": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(CollectionCenterPublic2)],
      ["query"]
    ),
    "getPatientByIdOrMobile": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Opt(PatientPublic2)],
      ["query"]
    ),
    "getPatientsByCenter": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(PatientPublic2)],
      ["query"]
    ),
    "getPaymentsByCenter": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Vec(PaymentPublic2)],
      ["query"]
    ),
    "getReportsByCenter": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Opt(IDL2.Int), IDL2.Opt(IDL2.Int)],
      [IDL2.Vec(Report2)],
      ["query"]
    ),
    "getReportsByPatient": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Vec(Report2)],
      ["query"]
    ),
    "getTestById": IDL2.Func([IDL2.Nat], [IDL2.Opt(LabTest2)], ["query"]),
    "getTests": IDL2.Func([], [IDL2.Vec(LabTest2)], ["query"]),
    "login": IDL2.Func([IDL2.Text, IDL2.Text], [LoginResult2], []),
    "logout": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "markPaymentPaid": IDL2.Func([IDL2.Text, IDL2.Nat], [IDL2.Bool], []),
    "setCenterStatus": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Bool],
      [IDL2.Bool],
      []
    ),
    "updateCenter": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Bool],
      []
    ),
    "updateSampleStatus": IDL2.Func(
      [IDL2.Text, IDL2.Text, SampleStatus2],
      [IDL2.Opt(PatientPublic2)],
      []
    ),
    "updateTest": IDL2.Func([IDL2.Text, LabTest2], [IDL2.Bool], []),
    "uploadReport": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Text],
      [IDL2.Nat],
      []
    ),
    "validateSession": IDL2.Func([IDL2.Text], [IDL2.Opt(Session2)], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addCenter(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    if (this.processError) {
      try {
        const result = await this.actor.addCenter(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addCenter(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
      return result;
    }
  }
  async addPayment(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.addPayment(arg0, arg1, arg2, arg3, arg4);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addPayment(arg0, arg1, arg2, arg3, arg4);
      return result;
    }
  }
  async addTest(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    if (this.processError) {
      try {
        const result = await this.actor.addTest(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addTest(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
      return result;
    }
  }
  async bookPatient(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.bookPatient(arg0, to_candid_BookPatientRequest_n1(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.bookPatient(arg0, to_candid_BookPatientRequest_n1(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async deleteTest(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteTest(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteTest(arg0, arg1);
      return result;
    }
  }
  async getAllPatients(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAllPatients(arg0);
        return from_candid_vec_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllPatients(arg0);
      return from_candid_vec_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async getBillingStats(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getBillingStats(arg0, arg1);
        return from_candid_BillingStats_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getBillingStats(arg0, arg1);
      return from_candid_BillingStats_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCenterById(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getCenterById(arg0, arg1);
        return from_candid_opt_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCenterById(arg0, arg1);
      return from_candid_opt_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCenters(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCenters(arg0);
        return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCenters(arg0);
      return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getDashboardStats(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getDashboardStats(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDashboardStats(arg0);
      return result;
    }
  }
  async getMyCenter(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMyCenter(arg0);
        return from_candid_opt_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyCenter(arg0);
      return from_candid_opt_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPatientByIdOrMobile(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getPatientByIdOrMobile(arg0, arg1);
        return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPatientByIdOrMobile(arg0, arg1);
      return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPatientsByCenter(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPatientsByCenter(arg0);
        return from_candid_vec_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPatientsByCenter(arg0);
      return from_candid_vec_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPaymentsByCenter(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getPaymentsByCenter(arg0, arg1);
        return from_candid_vec_n26(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPaymentsByCenter(arg0, arg1);
      return from_candid_vec_n26(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReportsByCenter(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.getReportsByCenter(arg0, arg1, to_candid_opt_n27(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n27(this._uploadFile, this._downloadFile, arg3));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReportsByCenter(arg0, arg1, to_candid_opt_n27(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n27(this._uploadFile, this._downloadFile, arg3));
      return result;
    }
  }
  async getReportsByPatient(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getReportsByPatient(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReportsByPatient(arg0, arg1);
      return result;
    }
  }
  async getTestById(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getTestById(arg0);
        return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTestById(arg0);
      return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTests() {
    if (this.processError) {
      try {
        const result = await this.actor.getTests();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTests();
      return result;
    }
  }
  async login(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.login(arg0, arg1);
        return from_candid_LoginResult_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.login(arg0, arg1);
      return from_candid_LoginResult_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async logout(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.logout(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.logout(arg0);
      return result;
    }
  }
  async markPaymentPaid(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.markPaymentPaid(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markPaymentPaid(arg0, arg1);
      return result;
    }
  }
  async setCenterStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.setCenterStatus(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setCenterStatus(arg0, arg1, arg2);
      return result;
    }
  }
  async updateCenter(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    if (this.processError) {
      try {
        const result = await this.actor.updateCenter(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateCenter(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
      return result;
    }
  }
  async updateSampleStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.updateSampleStatus(arg0, arg1, to_candid_SampleStatus_n35(this._uploadFile, this._downloadFile, arg2));
        return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateSampleStatus(arg0, arg1, to_candid_SampleStatus_n35(this._uploadFile, this._downloadFile, arg2));
      return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateTest(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateTest(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateTest(arg0, arg1);
      return result;
    }
  }
  async uploadReport(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.uploadReport(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.uploadReport(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async validateSession(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.validateSession(arg0);
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.validateSession(arg0);
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_BillingStats_n12(_uploadFile, _downloadFile, value) {
  return from_candid_record_n13(_uploadFile, _downloadFile, value);
}
function from_candid_CenterStatus_n22(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function from_candid_CollectionCenterPublic_n20(_uploadFile, _downloadFile, value) {
  return from_candid_record_n21(_uploadFile, _downloadFile, value);
}
function from_candid_Gender_n10(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n11(_uploadFile, _downloadFile, value);
}
function from_candid_LoginResult_n29(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n30(_uploadFile, _downloadFile, value);
}
function from_candid_PatientPublic_n6(_uploadFile, _downloadFile, value) {
  return from_candid_record_n7(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentPublic_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentStatus_n17(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n18(_uploadFile, _downloadFile, value);
}
function from_candid_Role_n33(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n34(_uploadFile, _downloadFile, value);
}
function from_candid_SampleStatus_n8(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function from_candid_Session_n31(_uploadFile, _downloadFile, value) {
  return from_candid_record_n32(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n14(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PaymentPublic_n15(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n19(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_CollectionCenterPublic_n20(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n25(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PatientPublic_n6(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n28(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Session_n31(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n13(_uploadFile, _downloadFile, value) {
  return {
    totalTests: value.totalTests,
    totalCommission: value.totalCommission,
    lastPayment: record_opt_to_undefined(from_candid_opt_n14(_uploadFile, _downloadFile, value.lastPayment))
  };
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_PaymentStatus_n17(_uploadFile, _downloadFile, value.status),
    date: value.date,
    invoiceNumber: value.invoiceNumber,
    centerId: value.centerId,
    notes: value.notes,
    amount: value.amount
  };
}
function from_candid_record_n21(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_CenterStatus_n22(_uploadFile, _downloadFile, value.status),
    ownerName: value.ownerName,
    name: value.name,
    createdAt: value.createdAt,
    email: value.email,
    address: value.address,
    phone: value.phone
  };
}
function from_candid_record_n32(_uploadFile, _downloadFile, value) {
  return {
    token: value.token,
    userId: value.userId,
    createdAt: value.createdAt,
    role: from_candid_Role_n33(_uploadFile, _downloadFile, value.role)
  };
}
function from_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    age: value.age,
    status: from_candid_SampleStatus_n8(_uploadFile, _downloadFile, value.status),
    name: value.name,
    refDoctor: value.refDoctor,
    centerId: value.centerId,
    bookingDate: value.bookingDate,
    gender: from_candid_Gender_n10(_uploadFile, _downloadFile, value.gender),
    testIds: value.testIds,
    mobile: value.mobile
  };
}
function from_candid_variant_n11(_uploadFile, _downloadFile, value) {
  return "other" in value ? "other" : "female" in value ? "female" : "male" in value ? "male" : value;
}
function from_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "paid" in value ? "paid" : value;
}
function from_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return "active" in value ? "active" : "inactive" in value ? "inactive" : value;
}
function from_candid_variant_n30(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_Session_n31(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n34(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "collectionCenter" in value ? "collectionCenter" : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "sampleReceived" in value ? "sampleReceived" : "sampleCollected" in value ? "sampleCollected" : "reportReady" in value ? "reportReady" : "processing" in value ? "processing" : value;
}
function from_candid_vec_n24(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CollectionCenterPublic_n20(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n26(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PaymentPublic_n15(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n5(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PatientPublic_n6(_uploadFile, _downloadFile, x));
}
function to_candid_BookPatientRequest_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_Gender_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_SampleStatus_n35(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n36(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n27(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    age: value.age,
    name: value.name,
    refDoctor: value.refDoctor,
    gender: to_candid_Gender_n3(_uploadFile, _downloadFile, value.gender),
    testIds: value.testIds,
    mobile: value.mobile
  };
}
function to_candid_variant_n36(_uploadFile, _downloadFile, value) {
  return value == "sampleReceived" ? {
    sampleReceived: null
  } : value == "sampleCollected" ? {
    sampleCollected: null
  } : value == "reportReady" ? {
    reportReady: null
  } : value == "processing" ? {
    processing: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "other" ? {
    other: null
  } : value == "female" ? {
    female: null
  } : value == "male" ? {
    male: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useApiService() {
  const { actor } = useActor(createActor);
  const login = async (userId, password) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.login(userId, password);
  };
  const logout = async (token) => {
    if (!actor) return false;
    return actor.logout(token);
  };
  const validateSession = async (token) => {
    if (!actor) return null;
    return actor.validateSession(token);
  };
  const getTests = async () => {
    if (!actor) return [];
    return actor.getTests();
  };
  const getTestById = async (id) => {
    if (!actor) return null;
    return actor.getTestById(id);
  };
  const getCenters = async (token) => {
    if (!actor) return [];
    return actor.getCenters(token);
  };
  const getMyCenter = async (token) => {
    if (!actor) return null;
    return actor.getMyCenter(token);
  };
  const bookPatient = async (token, req) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.bookPatient(token, req);
  };
  const trackSample = async (token, searchQuery) => {
    if (!actor) return null;
    return actor.getPatientByIdOrMobile(token, searchQuery);
  };
  const getPatientsByCenter = async (token) => {
    if (!actor) return [];
    return actor.getPatientsByCenter(token);
  };
  const getAllPatients = async (token) => {
    if (!actor) return [];
    try {
      const centers = await actor.getCenters(token);
      const results = await Promise.all(
        centers.map(
          () => actor.getPatientsByCenter(token).catch(() => [])
        )
      );
      return results.flat();
    } catch {
      return [];
    }
  };
  const getReportsByCenter = async (token, centerId, dateFrom, dateTo) => {
    if (!actor) return [];
    return actor.getReportsByCenter(token, centerId, dateFrom, dateTo);
  };
  const getReportsByPatient = async (token, patientId) => {
    if (!actor) return [];
    return actor.getReportsByPatient(token, patientId);
  };
  const getBillingStats = async (token, centerId) => {
    if (!actor)
      return {
        totalTests: BigInt(0),
        totalCommission: BigInt(0),
        lastPayment: void 0
      };
    return actor.getBillingStats(token, centerId);
  };
  const getPaymentsByCenter = async (token, centerId) => {
    if (!actor) return [];
    return actor.getPaymentsByCenter(token, centerId);
  };
  const updateSampleStatus = async (token, patientId, status) => {
    if (!actor) return null;
    return actor.updateSampleStatus(token, patientId, status);
  };
  const addCenter = async (token, id, name, ownerName, phone, email, address, password) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.addCenter(
      token,
      id,
      name,
      ownerName,
      phone,
      email,
      address,
      password
    );
  };
  const updateCenter = async (token, id, name, ownerName, phone, email, address) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.updateCenter(
      token,
      id,
      name,
      ownerName,
      phone,
      email,
      address
    );
  };
  const setCenterStatus = async (token, id, active) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.setCenterStatus(token, id, active);
  };
  const addTest = async (token, name, category, sampleType, tubeType, fastingRequired, reportTime, mrpPrice, partnerPrice) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.addTest(
      token,
      name,
      category,
      sampleType,
      tubeType,
      fastingRequired,
      reportTime,
      mrpPrice,
      partnerPrice
    );
  };
  const updateTest = async (token, test) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.updateTest(token, test);
  };
  const deleteTest = async (token, id) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.deleteTest(token, id);
  };
  const addPayment = async (token, centerId, amount, invoiceNumber, notes) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.addPayment(token, centerId, amount, invoiceNumber, notes);
  };
  const markPaymentPaid = async (token, paymentId) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.markPaymentPaid(token, paymentId);
  };
  const uploadReport = async (token, patientId, filename, reportUrl) => {
    if (!actor) throw new Error("Actor not ready");
    return actor.uploadReport(token, patientId, filename, reportUrl);
  };
  const getDashboardStats = async (_token) => {
    return {
      totalBookings: 0,
      todaysSamples: 0,
      pendingReports: 0,
      thisMonthRevenue: 0
    };
  };
  return {
    login,
    logout,
    validateSession,
    getTests,
    getTestById,
    getCenters,
    getMyCenter,
    bookPatient,
    trackSample,
    getPatientsByCenter,
    getAllPatients,
    getReportsByCenter,
    getReportsByPatient,
    getBillingStats,
    getPaymentsByCenter,
    updateSampleStatus,
    addCenter,
    updateCenter,
    setCenterStatus,
    addTest,
    updateTest,
    deleteTest,
    addPayment,
    markPaymentPaid,
    uploadReport,
    getDashboardStats
  };
}
export {
  useQuery as a,
  createLucideIcon as c,
  useApiService as u
};
