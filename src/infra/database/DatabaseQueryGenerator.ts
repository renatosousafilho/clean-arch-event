export default interface DatabaseQueryGenerator {
  insert(table: string, columns: string[], values: string[]): string;
  select(table: string, selectColumns: string[], whereColumns: string[]): string;
}

export class DatabaseQueryGeneratorPostgresAdapter implements DatabaseQueryGenerator {
  insert(table: string, columns: string[], values: string[]): string {
    const columnPlaceholders = columns.join(', ');
    const valuePlaceholders = values.map((v, index) => `$${index+1}`).join(', ');
    const query = `INSERT INTO ${table} (${columnPlaceholders}) VALUES (${valuePlaceholders})`;
    return query
  }

  select(table: string, selectColumns: string[], whereColumns: string[]): string {
    const columnPlaceholders = selectColumns.join(', ');
    const wherePlaceholders = whereColumns.map((v, index) => `${v} = $${index+1}`).join(' AND ');
    const query = `SELECT ${columnPlaceholders} FROM ${table} WHERE ${wherePlaceholders}`;
    return query;
  }
}

export class DatabaseQueryGeneratorMysqlAdapter implements DatabaseQueryGenerator {
  insert(table: string, columns: string[], values: string[]): string {
    const columnPlaceholders = columns.join(', ');
    const valuePlaceholders = values.map((v, index) => `?`).join(', ');
    const query = `INSERT INTO ${table} (${columnPlaceholders}) VALUES (${valuePlaceholders})`;
    return query
  }

  select(table: string, selectColumns: string[], whereColumns: string[]): string {
    const columnPlaceholders = selectColumns.join(', ');
    const wherePlaceholders = whereColumns.map((v, index) => `${v} = ?`).join(' AND ');
    const query = `SELECT ${columnPlaceholders} FROM ${table} WHERE ${wherePlaceholders}`;
    return query;
  }
}