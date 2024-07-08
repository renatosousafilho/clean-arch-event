### Como conectar no postgres

```bash
psql -h localhost -U postgres
```

### Como executar um script sql

```bash
psql -h localhost -U postgres -f script.sql # ou
psql -h localhost -U postgres < script.sql
```

### Como listar os bancos de dados

```sql
\l
```

### Como conectar em um banco de dados

```sql
\c nome_do_banco
```

### Como listar as tabelas

```sql
\dt
```

### Como listar as tabelas de um schema

```sql
\dt schema.*
```