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

import {BrowserUtil} from './browser_util';
import * as environment from './environment';
import {Environment} from './environment';
import * as gpgpu_util from './kernels/webgl/gpgpu_util';
import * as webgl_util from './kernels/webgl/webgl_util';
import * as test_util from './test_util';
import * as util from './util';
import {version} from './version';

// Optimizers.
export {AdadeltaOptimizer} from './optimizers/adadelta_optimizer';
export {AdagradOptimizer} from './optimizers/adagrad_optimizer';
export {AdamOptimizer} from './optimizers/adam_optimizer';
export {AdamaxOptimizer} from './optimizers/adamax_optimizer';
export {MomentumOptimizer} from './optimizers/momentum_optimizer';
export {Optimizer} from './optimizers/optimizer';
export {RMSPropOptimizer} from './optimizers/rmsprop_optimizer';
export {SGDOptimizer} from './optimizers/sgd_optimizer';
// tslint:disable-next-line:max-line-length
export {Scalar, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D, TensorBuffer, variable, Variable} from './tensor';
export {DataType, Rank, ShapeMap} from './types';
// Serialization.
export {WeightsManifestConfig} from './weights_loader';
export {loadWeights} from './weights_loader';

export * from './ops/ops';
export {LSTMCellFunc} from './ops/lstm';
export {Reduction} from './ops/loss_ops';

export * from './train';
export * from './globals';

export {ENV, Environment, Features} from './environment';
export const setBackend = Environment.setBackend;
export const getBackend = Environment.getBackend;
export const memory = Environment.memory;
export {TimingInfo} from './engine';
export {version as version_core};
export {doc} from './doc';

export const nextFrame = BrowserUtil.nextFrame;

// Second level exports.
export {environment, test_util, util};

// WebGL specific utils.
export const webgl = {
  webgl_util,
  gpgpu_util
};
export {WebGLTimingInfo} from './kernels/backend_webgl';

// Backend specific.
export {KernelBackend, BackendTimingInfo} from './kernels/backend';
