import pgp from 'pg-promise'
import mysql2 from 'mysql2/promise'
import { MongoClient } from 'mongodb';

export default interface DatabaseConnection {
  query(statement: string, params: any[]): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()('postgres://postgres:postgres@localhost:5432/postgres')
  }

  async query(statement: string, params: any[]): Promise<any> {
    return await this.connection.query(statement, params)
  }

  close(): Promise<void> {
    return this.connection.$pool.end()
  }
}

export class Mysql2Adapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = mysql2.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'branas'
    })
  }
  query(statement: string, params: any[]): Promise<any> {
    return this.connection.execute(statement, params)
  }
  close(): Promise<void> {
    return this.connection.end();
  }
}