/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import {ENV, Environment, Features} from './environment';
import {MathBackendCPU} from './kernels/backend_cpu';
import {MathBackendWebGL} from './kernels/backend_webgl';

export function describeWithFlags(
    name: string, constraints: Features, tests: () => void) {
  const envFeatures = TEST_ENV_FEATURES.filter(f => {
    return Object.keys(constraints).every(key => {
      // tslint:disable-next-line:no-any
      return (constraints as any)[key] === (f as any)[key];
    });
  });
  envFeatures.forEach(features => {
    const testName = name + ' ' + JSON.stringify(features);
    executeTests(testName, tests, features);
  });
}

let BEFORE_ALL = (features: Features) => {
  ENV.registerBackend('test-webgl', () => new MathBackendWebGL());
  ENV.registerBackend('test-cpu', () => new MathBackendCPU());
};
let AFTER_ALL = (features: Features) => {
  ENV.removeBackend('test-webgl');
  ENV.removeBackend('test-cpu');
};
let BEFORE_EACH = (features: Features) => {};
let AFTER_EACH = (features: Features) => {};

let TEST_ENV_FEATURES: Features[] = [
  {
    'BACKEND': 'test-webgl',
    'WEBGL_FLOAT_TEXTURE_ENABLED': true,
    'WEBGL_VERSION': 1
  },
  {
    'BACKEND': 'test-webgl',
    'WEBGL_FLOAT_TEXTURE_ENABLED': true,
    'WEBGL_VERSION': 2
  },
  {'BACKEND': 'test-cpu'}
  // TODO(nsthorat,smilkov): Enable when byte-backed textures are fixed.
  // {
  // 'BACKEND': 'webgl',
  // 'WEBGL_FLOAT_TEXTURE_ENABLED': false,
  // 'WEBGL_VERSION': 1
  // }
];

export function setBeforeAll(f: (features: Features) => void) {
  BEFORE_ALL = f;
}
export function setAfterAll(f: (features: Features) => void) {
  AFTER_ALL = f;
}
export function setBeforeEach(f: (features: Features) => void) {
  BEFORE_EACH = f;
}
export function setAfterEach(f: (features: Features) => void) {
  AFTER_EACH = f;
}

export function setTestEnvFeatures(features: Features[]) {
  TEST_ENV_FEATURES = features;
}

function executeTests(testName: string, tests: () => void, features: Features) {
  describe(testName, () => {
    beforeAll(() => {
      ENV.setFeatures(features);
      BEFORE_ALL(features);
    });

    beforeEach(() => {
      BEFORE_EACH(features);
      if (features && features.BACKEND != null) {
        Environment.setBackend(features.BACKEND);
      }
      ENV.engine.startScope();
    });

    afterEach(() => {
      ENV.engine.endScope(null);
      AFTER_EACH(features);
    });

    afterAll(() => {
      AFTER_ALL(features);
      ENV.reset();
    });

    tests();
  });
}
