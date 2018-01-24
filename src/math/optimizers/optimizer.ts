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

import {ENV} from '../../environment';
import {Node, VariableNode} from '../../graph/graph';
import {SessionRuntime} from '../../graph/session';
import * as session_util from '../../graph/session_util';
// tslint:disable-next-line:max-line-length
import {SummedTensorArrayMap, TensorArrayMap} from '../../graph/tensor_array_map';
import {NDArrayMath} from '../../math/math';
import {NDArray, Scalar, Variable} from '../../math/ndarray';
import {DataType} from '../../math/types';
import {NamedArrayMap} from '../../util';

export abstract class Optimizer {
  protected variableNodes: VariableNode[];
  protected specifiedVariableNodes: VariableNode[]|null;

  constructor(protected learningRate: number, specifiedVariableList?: Node[]) {
    if (specifiedVariableList != null) {
      this.specifiedVariableNodes = specifiedVariableList as VariableNode[];
    }
    this.one = ENV.math.keep(Scalar.new(1));
  }

  /**
   * Executes `f()` and minimizes the scalar output of `f()` by computing
   * gradients of y with respect to the list of trainable variables provided by
   * `varList`. If no list is provided, it defaults to all trainable variables.
   * @param f The function to execute and whose output to minimize.
   * @param returnCost Whether to return the scalar cost value produced by
   * executing `f()`.
   * @param varList An optional list of variables to update. If specified, only
   * the trainable variables in varList will be updated by minimize. Defaults to
   * all trainable variables.
   */
  minimize<D extends DataType>(
      f: () => Scalar<D>, returnCost = false,
      varList?: Variable[]): Scalar<D>|null {
    const {value, gradients} = this.computeGradients(f, varList);

    this.applyGradients(gradients);

    // Dispose gradients.
    const varNames = Object.keys(gradients);
    varNames.forEach(varName => gradients[varName].dispose());

    if (returnCost) {
      return value as Scalar<D>;
    } else {
      value.dispose();
      return null;
    }
  }

  /**
   * Executes f() and computes the gradient of the scalar output of f() with
   * respect to the list of trainable variables provided by `varList`. If no
   * list is provided, it defaults to all trainable variables.
   * @param f The function to execute and whose output to use for computing
   * gradients with respect to variables.
   * @param varList An optional list of variables to compute gradients with
   * respect to. If specified, only the trainable variables in varList will have
   * gradients computed with respect to. Defaults to all trainable variables.
   */
  computeGradients<D extends DataType>(
      f: () => Scalar<D>,
      varList?: Variable[]): {value: Scalar<D>, gradients: NamedArrayMap} {
    return ENV.math.variableGradients(f, varList);
  }

  /**
   * Updates variables by using the computed gradients.
   * @param variableGradients A mapping of variable name to its gradient value.
   */
  abstract applyGradients(variableGradients: NamedArrayMap): void;

  /**
   * Graph mode methods.
   */
  beforeBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    this.variableNodes = this.specifiedVariableNodes == null ?
        session_util.getVariableNodesFromEvaluationSet(runtime.nodes) :
        this.specifiedVariableNodes;
    if (batchSize !== this.prevBatchSize) {
      if (this.cGraph != null) {
        this.cGraph.dispose();
      }
      this.prevBatchSize = batchSize;
      this.cGraph = math.keep(Scalar.new(-this.learningRate / batchSize));
    }
    this.variableNodes.forEach(
        node => this.variableGradients.set(
            node.output, math.keep(NDArray.zeros(node.output.shape))));
  }

  afterExample(
      math: NDArrayMath, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap) {
    math.scope((keep) => {
      this.variableNodes.forEach(node => {
        const gradient = gradientArrayMap.get(node.output);
        const accumulatedGradient = this.variableGradients.get(node.output);
        this.variableGradients.set(
            node.output, keep(math.add(gradient, accumulatedGradient)));
        accumulatedGradient.dispose();
      });
    });
  }

  abstract afterBatch(
      math: NDArrayMath, batchSize: number, runtime: SessionRuntime,
      activationArrayMap: TensorArrayMap,
      gradientArrayMap: SummedTensorArrayMap): void;

  dispose() {
    if (this.cGraph != null) {
      this.cGraph.dispose();
    }
    this.one.dispose();
    if (this.variableNodes != null) {
      this.variableNodes.forEach(node => {
        node.data.dispose();
      });
    }
    if (this.specifiedVariableNodes != null) {
      this.specifiedVariableNodes.forEach(node => {
        node.data.dispose();
      });
    }
  }

  protected variableGradients = new TensorArrayMap();
  protected prevBatchSize: number;
  protected one: Scalar;
  protected cGraph: Scalar;
}
