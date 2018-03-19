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

import * as tfc from '@tensorflow/tfjs-core';

import {NamedTensorsMap} from '../../data/index';
import {Node} from '../index';

import {OpExecutor} from './types';
import {getParamValue} from './utils';

export let executeOp: OpExecutor =
    (node: Node, tensorMap: NamedTensorsMap): tfc.Tensor[] => {
      switch (node.op) {
        case 'equal': {
          return [tfc.equal(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'greater': {
          return [tfc.greater(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'greaterEqual': {
          return [tfc.greaterEqual(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'less': {
          return [tfc.less(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'lessEqual': {
          return [tfc.lessEqual(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'logicalAnd': {
          return [tfc.logicalAnd(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'logicalNot': {
          return [tfc.logicalNot(
              getParamValue('a', node, tensorMap) as tfc.Tensor)];
        }
        case 'logicalOr': {
          return [tfc.logicalOr(
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        case 'where': {
          return [tfc.where(
              getParamValue('condition', node, tensorMap) as tfc.Tensor,
              getParamValue('a', node, tensorMap) as tfc.Tensor,
              getParamValue('b', node, tensorMap) as tfc.Tensor)];
        }
        default:
          throw TypeError(`Node type ${node.op} is not implemented`);
      }
    };

export const CATEGORY = 'logical';
