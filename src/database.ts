import {createConnection, getConnection, Connection} from 'typeorm';
import Logger from './util/logger';

export default class DataBase {
    /*
        returns typeorm Connection
    */
    public static async connect(): Promise<Connection | Error | any> {
        try {
            Logger.info('DB - establishing DB connection');
            return createConnection();
        } catch (error) {
            Logger.error(
                'DB - error occurred while establishing DB connection,Please check your .evn', error
            );
        }
    }

    /*
        closes connection
    */
    public static async closeConnection(): Promise<void> {
        try {
            Logger.info('DB - closing DB connection');
            getConnection().close();
        } catch (error) {
            Logger.error(
                'DB - error occurred while establishing closing DB connection', error
            );
        }
    }

    /*
        return connection
    */
   public static getConnection(): Connection {
        Logger.info('DB - getting DB connection');
        return getConnection();
   }    
}
