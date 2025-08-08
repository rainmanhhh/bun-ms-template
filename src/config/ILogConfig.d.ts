export interface ILogConfig {
  /**
   * log level. default: `debug` if env is `development` or `test`; `info` if env is `production`
   */
  level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
  /**
   * output to console. default set to `true` if env is `development` or `test`
   */
  console?: boolean
  /**
   * if not null, output to file. default set to `{}` if env is `production`
   */
  file?: {
    /**
     * log file name. default: ${appConfig.name}
     */
    name?: string
    /**
     * default: `log`
     */
    suffix?: string
    /**
     * max files to keep. can be count or days(with `d` suffix). default: `30d`
     */
    maxFiles?: string
    /**
     * max single file size. default: `128m`
     */
    maxSize?: string
  }
}
