/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {Environment} from './environment';
import {Gradients} from './gradients';

export const tidy = Environment.tidy;
export const keep = Environment.keep;
export const dispose = Environment.dispose;
export const time = Environment.time;

export const grad = Gradients.grad;
export const valueAndGrad = Gradients.valueAndGrad;
export const grads = Gradients.grads;
export const valueAndGrads = Gradients.valueAndGrads;
export const variableGrads = Gradients.variableGrads;
export const customGrad = Gradients.customGrad;
