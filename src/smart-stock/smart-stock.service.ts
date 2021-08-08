/* eslint-disable @typescript-eslint/ban-types */
import * as tf from '@tensorflow/tfjs-node'
import { Tensor } from '@tensorflow/tfjs-node';

export class SmartStockService {

    public getAll(): string {
        return "";
    }

    public async trainModel(inputs: any[], outputs: any[], file: string): Promise<{model: any, stats: any}> {

        const window_size = inputs[0].length;
        const n_epochs = 20;
        const learning_rate = 0.001;
        const n_layers = 2;

        const input_layer_shape = window_size;
        const input_layer_neurons = 20;

        const rnn_input_layer_features = 10;
        const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

        const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps];
        const rnn_output_neurons = 20;

        const rnn_batch_size = window_size;

        const output_layer_shape = rnn_output_neurons;
        const output_layer_neurons = 1;

        const model = tf.sequential();

        const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]).div(tf.scalar(10));
        const ys = tf.tensor2d(outputs, [outputs.length, 1]).reshape([outputs.length, 1]).div(tf.scalar(10));

        model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [input_layer_shape] }));
        model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));

        const lstm_cells = [];
        for (let index = 0; index < n_layers; index++) {
            lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
        }

        model.add(tf.layers.rnn({
            cell: lstm_cells,
            inputShape: rnn_input_shape, returnSequences: false
        }));

        model.add(tf.layers.dense({ units: output_layer_neurons, inputShape: [output_layer_shape] }));

        const opt_adam = tf.train.adam(learning_rate);
        model.compile({ optimizer: opt_adam, loss: 'meanSquaredError' });

        const hist = await model.fit(xs, ys,
            {
                batchSize: rnn_batch_size, epochs: n_epochs, callbacks: {
                    onEpochEnd: async (epoch, log) => { console.log(epoch, log); }
                }
            });

        await model.save('file:///docs/' + file );
        return { model: model, stats: hist };
    }

    public async predict(input: any, file: string): Promise<any> {
        const model = await tf.loadLayersModel('file:///docs/' + file + "/model.json");
        const outps = (model.predict(tf.tensor2d(input, [1, input.length]).div(tf.scalar(10))) as Tensor).mul(10);
        const result = outps.dataSync();

        return result[0];
    }
}