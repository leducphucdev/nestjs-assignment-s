import { DataSource, DataSourceOptions } from "typeorm";
import { configNoSynchronize } from "./data-source.config";

const AppDataSource = new DataSource(configNoSynchronize as DataSourceOptions);

AppDataSource.initialize();

export default AppDataSource;
