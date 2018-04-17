import chalk from "chalk"
import store from "/store"
import migrations from "../config/migrations"



const ensureIndex = async (connection, table, index, list) => {
  if (list.includes(index.name)) {
    console.log(`Index ${chalk.yellow(index.name)} for table ${chalk.cyan(table)} already exists.`)
    return
  }

  console.log(`Creating index ${chalk.yellow(index.name)} for table ${chalk.cyan(table)}.`)
  await store.table(table).indexCreate(index.name, index.fn(store), index.options).run(connection)
}


const ensureIndices = async (connection, table, indices) => {
  if (indices === void 0)
    return

  const list = await store.table(table).indexList().run(connection)

  for (const index of indices)
    await ensureIndex(connection, table, index, list)
}


const ensureTable = async (connection, table, list) => {
  if (list.includes(table.name)) {
    console.log(`Table ${chalk.cyan(table.name)} already exists.`)
    return
  }

  console.log(`Creating table ${chalk.cyan(table.name)}.`)
  await store.tableCreate(table.name).run(connection)
}


const ensureTables = async (connection, tables) => {
  const list = await store.tableList().run(connection)

  for (const table of tables) {
    await ensureTable(connection, table, list)
    await ensureIndices(connection, table.name, table.indices)
    await store.table(table.name).indexWait().run(connection)
  }
}


const main = async () => {
  const connection = await store.connect()

  try {
    await ensureTables(connection, migrations.tables)
  } catch (error) {
    console.error(chalk.red(error))
  }

  connection.close()

  process.exit(0)
}


main()
