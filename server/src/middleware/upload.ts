import * as AWS from "aws-sdk"
import { Request, Response, NextFunction } from "express"

import { Services } from "../services"
import { ServerConfig } from "../config"

/**
 * A factory function which creates middleware that can handle image uploads
 *
 * @function
 * @name createUploadMiddleware
 * @param {ServerConfig} config The application configuration settings
 * @param {Services} services The application's cross-cutting services
 * @param {Object<string, function>} services.logger An instance of a threshold-based logger
 * @param {Object<string, any>} services.cache An instance of a cache client
 * @param {Object<string, any>} services.models An instance of the ORM models
 * @returns {BlogMiddleware} The middleware functions ready to be bound to the app
 */
function createUploadMiddleware(config: ServerConfig, _services: Services) {
  const { secretAccessKey, accessKeyId, bucket } = config

  const s3 = new AWS.S3({ accessKeyId, secretAccessKey })

  return {
    async handleImageUpload(req: Request, res: Response, next: NextFunction) {
      const key = `${req.user?.id}/${Date.now()}.jpeg`

      s3.getSignedUrl("putObject", {
        Bucket: bucket,
        ContentType: "image/jpeg",
        Key: key
      }, (err: Error, url: string) => {
        if (err) {
          next(err)
        } else {
          res.send({ key, url })
        }
      })
    }
  }
}

export type UploadMiddleware = ReturnType<typeof createUploadMiddleware>

export default createUploadMiddleware
