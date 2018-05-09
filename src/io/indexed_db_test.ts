/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

/**
 * Unit tests for indexed_db.ts.
 */

import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {CPU_ENVS} from '../test_util';

import {deleteDatabase} from './indexed_db';

describeWithFlags('IndexedDB', CPU_ENVS, () => {
  // Test data.
  const modelTopology1: {} = {
    'class_name': 'Sequential',
    'keras_version': '2.1.4',
    'config': [{
      'class_name': 'Dense',
      'config': {
        'kernel_initializer': {
          'class_name': 'VarianceScaling',
          'config': {
            'distribution': 'uniform',
            'scale': 1.0,
            'seed': null,
            'mode': 'fan_avg'
          }
        },
        'name': 'dense',
        'kernel_constraint': null,
        'bias_regularizer': null,
        'bias_constraint': null,
        'dtype': 'float32',
        'activation': 'linear',
        'trainable': true,
        'kernel_regularizer': null,
        'bias_initializer': {'class_name': 'Zeros', 'config': {}},
        'units': 1,
        'batch_input_shape': [null, 3],
        'use_bias': true,
        'activity_regularizer': null
      }
    }],
    'backend': 'tensorflow'
  };
  const weightSpecs1: tf.io.WeightsManifestEntry[] = [
    {
      name: 'dense/kernel',
      shape: [3, 1],
      dtype: 'float32',
    },
    {
      name: 'dense/bias',
      shape: [1],
      dtype: 'float32',
    }
  ];
  const weightData1 = new ArrayBuffer(16);
  const artifacts1: tf.io.ModelArtifacts = {
    modelTopology: modelTopology1,
    weightSpecs: weightSpecs1,
    weightData: weightData1,
  };

  const weightSpecs2: tf.io.WeightsManifestEntry[] = [
    {
      name: 'dense/new_kernel',
      shape: [5, 1],
      dtype: 'float32',
    },
    {
      name: 'dense/new_bias',
      shape: [1],
      dtype: 'float32',
    }
  ];

  beforeEach(done => {
    deleteDatabase().then(() => {
      done();
    });
  });

  afterEach(done => {
    deleteDatabase().then(() => {
      done();
    });
  });

  it('Save-load round trip', done => {
    const testStartDate = new Date();
    const handler = tf.io.browserIndexedDB('FooModel');
    handler.save(artifacts1)
        .then(saveResult => {
          expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
              .toBeGreaterThanOrEqual(testStartDate.getTime());
          // Note: The following two assertions work only because there is no
          //   non-ASCII characters in `modelTopology1` and `weightSpecs1`.
          expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
              .toEqual(JSON.stringify(modelTopology1).length);
          expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
              .toEqual(JSON.stringify(weightSpecs1).length);
          expect(saveResult.modelArtifactsInfo.weightDataBytes)
              .toEqual(weightData1.byteLength);

          handler.load()
              .then(loadedArtifacts => {
                expect(loadedArtifacts.modelTopology).toEqual(modelTopology1);
                expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
                expect(loadedArtifacts.weightData).toEqual(weightData1);
                done();
              })
              .catch(err => {
                console.error(err.stack);
              });
        })
        .catch(err => {
          console.error(err.stack);
        });
  });

  it('Save two models and load one', done => {
    const weightData2 = new ArrayBuffer(24);
    const artifacts2: tf.io.ModelArtifacts = {
      modelTopology: modelTopology1,
      weightSpecs: weightSpecs2,
      weightData: weightData2,
    };
    const handler1 = tf.io.browserIndexedDB('Model/1');
    handler1.save(artifacts1)
        .then(saveResult1 => {
          // Note: The following two assertions work only because there is no
          // non-ASCII characters in `modelTopology1` and `weightSpecs1`.
          expect(saveResult1.modelArtifactsInfo.modelTopologyBytes)
              .toEqual(JSON.stringify(modelTopology1).length);
          expect(saveResult1.modelArtifactsInfo.weightSpecsBytes)
              .toEqual(JSON.stringify(weightSpecs1).length);
          expect(saveResult1.modelArtifactsInfo.weightDataBytes)
              .toEqual(weightData1.byteLength);

          const handler2 = tf.io.browserIndexedDB('Model/2');
          handler2.save(artifacts2)
              .then(saveResult2 => {
                expect(saveResult2.modelArtifactsInfo.dateSaved.getTime())
                    .toBeGreaterThanOrEqual(
                        saveResult1.modelArtifactsInfo.dateSaved.getTime());
                // Note: The following two assertions work only because there is
                // no non-ASCII characters in `modelTopology1` and
                // `weightSpecs1`.
                expect(saveResult2.modelArtifactsInfo.modelTopologyBytes)
                    .toEqual(JSON.stringify(modelTopology1).length);
                expect(saveResult2.modelArtifactsInfo.weightSpecsBytes)
                    .toEqual(JSON.stringify(weightSpecs2).length);
                expect(saveResult2.modelArtifactsInfo.weightDataBytes)
                    .toEqual(weightData2.byteLength);

                handler1.load()
                    .then(loadedArtifacts => {
                      expect(loadedArtifacts.modelTopology)
                          .toEqual(modelTopology1);
                      expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
                      expect(loadedArtifacts.weightData).toEqual(weightData1);
                      done();
                    })
                    .catch(err => {
                      console.error(err.stack);
                    });
              })
              .catch(err => {
                console.error(err.stack);
              });
        })
        .catch(err => {
          console.error(err.stack);
        });
  });

  it('Loading nonexistent model fails', done => {
    const handler = tf.io.browserIndexedDB('NonexistentModel');
    handler.load()
        .then(modelArtifacts => {
          done.fail(
              'Loading nonexistent model from IndexedDB succeeded unexpectly');
        })
        .catch(err => {
          expect(err.message)
              .toEqual(
                  'Cannot find model with path \'NonexistentModel\' in ' +
                  'IndexedDB.');
          done();
        });
  });

  it('Null, undefined or empty modelPath throws Error', () => {
    expect(() => tf.io.browserIndexedDB(null))
        .toThrowError(
            /IndexedDB, modelPath must not be null, undefined or empty/);
    expect(() => tf.io.browserIndexedDB(undefined))
        .toThrowError(
            /IndexedDB, modelPath must not be null, undefined or empty/);
    expect(() => tf.io.browserIndexedDB(''))
        .toThrowError(
            /IndexedDB, modelPath must not be null, undefined or empty./);
  });
});
