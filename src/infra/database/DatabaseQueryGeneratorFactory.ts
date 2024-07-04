import DatabaseConnection, { Mysql2Adapter, PgPromiseAdapter } from '../database/DatabaseConnection';
import DatabaseQueryGenerator, { DatabaseQueryGeneratorMysqlAdapter, DatabaseQueryGeneratorPostgresAdapter } from './DatabaseQueryGenerator';

export default class DatabaseQueryGeneratorFactory {
  static create(databaseConnection: DatabaseConnection): DatabaseQueryGenerator {
    if (databaseConnection instanceof PgPromiseAdapter) {
      return new DatabaseQueryGeneratorPostgresAdapter();
    }
    if (databaseConnection instanceof Mysql2Adapter) {
      return new DatabaseQueryGeneratorMysqlAdapter();
    }
    throw new Error('Database not supported');
  }
}