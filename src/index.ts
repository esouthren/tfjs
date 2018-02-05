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

import * as xhr_dataset from './data/xhr-dataset';
import * as environment from './environment';
import * as gpgpu_util from './math/backends/webgl/gpgpu_util';
import * as webgl_util from './math/backends/webgl/webgl_util';
import * as conv_util from './math/conv_util';
import * as test_util from './test_util';
import * as util from './util';
import {version} from './version';

export {CheckpointLoader} from './data/checkpoint_loader';
export {DataStats, InMemoryDataset} from './data/dataset';
// tslint:disable-next-line:max-line-length
export {InCPUMemoryShuffledInputProviderBuilder, InGPUMemoryShuffledInputProviderBuilder, InputProvider} from './data/input_provider';
export {XhrDataset, XhrDatasetConfig, XhrModelConfig} from './data/xhr-dataset';
export {ENV, Environment, Features} from './environment';
export {Graph, SymbolicTensor} from './graph/graph';
// tslint:disable-next-line:max-line-length
export {GraphRunner, GraphRunnerEventObserver, MetricReduction} from './graph/graph_runner';
export {AdadeltaOptimizer} from './graph/optimizers/adadelta_optimizer';
export {AdagradOptimizer} from './graph/optimizers/adagrad_optimizer';
export {AdamOptimizer} from './graph/optimizers/adam_optimizer';
export {AdamaxOptimizer} from './graph/optimizers/adamax_optimizer';
export {MomentumOptimizer} from './graph/optimizers/momentum_optimizer';
export {RMSPropOptimizer} from './graph/optimizers/rmsprop_optimizer';
export {CostReduction, FeedEntry, Session} from './graph/session';
// tslint:disable-next-line:max-line-length
export {ConstantInitializer, Initializer, OnesInitializer, RandomNormalInitializer, RandomTruncatedNormalInitializer, RandomUniformInitializer, TensorInitializer, VarianceScalingInitializer, ZerosInitializer} from './initializers';
export {MathBackendCPU, NDArrayMathCPU} from './math/backends/backend_cpu';
export {MathBackendWebGL, NDArrayMathGPU} from './math/backends/backend_webgl';
export {MatrixOrientation} from './math/backends/types/matmul';
export {GPGPUContext} from './math/backends/webgl/gpgpu_context';
export {LSTMCell} from './math/lstm';
export {NDArrayMath} from './math/math';
export {Optimizer} from './math/optimizers/optimizer';
export {SGDOptimizer} from './math/optimizers/sgd_optimizer';
// tslint:disable-next-line:max-line-length
export {Array1D, Array2D, Array3D, Array4D, NDArray, Scalar, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D, variable, Variable} from './math/tensor';
export {Rank} from './math/types';
export {Model} from './model';
export {version};
// Second level exports.
export {
  conv_util,
  environment,
  gpgpu_util,
  test_util,
  util,
  webgl_util,
  xhr_dataset
};

export * from './math/ops';
export * from './math/backends/tracking';
// tslint:disable-next-line:max-line-length
export {customGradient, gradients, valueAndGradients, variableGradients, vjp} from './math/backends/gradients';
