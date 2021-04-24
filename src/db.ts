import "reflect-metadata";
import {createConnection} from "typeorm";
import { Tedis } from "tedis";
import logger from '../src/shared/Logger';
import { User } from './entities/User';

export async function intializeDB(): Promise<void> {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "12345tgb",
    database: "menu",
    entities: [User],
  })
  logger.info('Database successfully initialized');
}

export function initializeCache(port: number | undefined) : Tedis {
  const tedis = new Tedis({
    port: port,
    host: "127.0.0.1"
  });

  return tedis;
}