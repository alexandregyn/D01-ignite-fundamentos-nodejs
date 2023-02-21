import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class DataBase {
  #dataBase = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#dataBase = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile('db.json', JSON.stringify(this.#dataBase));
  }

  select(table, search) {
    let data = this.#dataBase[table] ?? [];
    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#dataBase[table])) {
      this.#dataBase[table].push(data);
    } else {
      this.#dataBase[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#dataBase[table].findIndex(row => row.id === id);
    if (rowIndex > -1) {
      this.#dataBase[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#dataBase[table].findIndex(row => row.id === id);
    if (rowIndex > -1) {
      this.#dataBase[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}