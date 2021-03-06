import * as Joi from '@hapi/joi'
import * as express from 'express'
import createLogger from '../logger'
import { Account } from '../types'
import { JoiTimestamp } from '../utils/joi.util'
import { getSession } from '../utils/session.util'
import Firestore from './firestore.service'

const logger = createLogger(__filename.replace(process.env.PWD || '', ''))

const JoiPermissions = Joi.object({
  effective: Joi.array().items(Joi.string()),
})

export const fs = new Firestore<Account>(
  'account',
  Joi.object().keys({
    provider: Joi.string(),
    providerId: Joi.string(),
    name: Joi.string(),
    permissions: JoiPermissions,
    providerCreated: JoiTimestamp,
    providerUpdated: JoiTimestamp,
    syncedAt: JoiTimestamp.required(),
    properties: Joi.array()
      .items(
        Joi.object({
          providerId: Joi.string().required(),
          name: Joi.string(),
          websiteUrl: Joi.string(),
          level: Joi.string(),
          profileCount: Joi.number(),
          industryVertical: Joi.string(),
          permissions: JoiPermissions,
          providerCreated: JoiTimestamp,
          providerUpdated: JoiTimestamp,
          profiles: Joi.array()
            .items(
              Joi.object({
                providerId: Joi.string().required(),
                name: Joi.string(),
                providerCreated: JoiTimestamp,
                providerUpdated: JoiTimestamp,
                currency: Joi.string(),
                timezone: Joi.string(),
                websiteUrl: Joi.string(),
                type: Joi.string(),
                permissions: JoiPermissions,
                eCommerceTracking: Joi.boolean(),
                enhancedECommerceTracking: Joi.boolean(),
                botFilteringEnabled: Joi.boolean(),
              })
            )
            .required(),
        })
      )
      .required(),
  })
)

export const db = fs.db

export async function getCurrent(req: express.Request) {
  const { user } = getSession(req)

  if (user) {
    const accounts = await Promise.all(
      user.accountIds.map(async accountId => {
        const result = await db.doc(accountId)
        return fs.dataFromDoc(result)
      })
    )

    logger.info(`Found ${accounts.length} accounts for user`)
    return accounts
  } else {
    throw new Error('No user in session')
  }
}
