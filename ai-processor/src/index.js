"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __importStar(require("amqplib"));
const dotenv_1 = require("dotenv");
const questionGenerator_1 = require("./questionGenerator");
(0, dotenv_1.config)();
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'document_processing';
function startConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqp.connect(RABBITMQ_URL);
            const channel = yield connection.createChannel();
            yield channel.assertQueue(QUEUE_NAME, { durable: true });
            console.log('Waiting for messages...');
            channel.consume(QUEUE_NAME, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (msg !== null) {
                    const content = msg.content.toString();
                    console.log('Received message:', content);
                    try {
                        const result = yield (0, questionGenerator_1.generateQuestions)(content);
                        console.log('Generated questions:', result);
                        // Here you can send the result back to another queue or store it
                        channel.ack(msg);
                    }
                    catch (error) {
                        console.error('Error processing message:', error);
                        channel.nack(msg);
                    }
                }
            }));
        }
        catch (error) {
            console.error('Error starting consumer:', error);
        }
    });
}
startConsumer();
