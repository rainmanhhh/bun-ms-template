import express from 'express'
import { server } from '../server.ts'

export default function () {
  server.use(express.json({ strict: false }))
  server.use(express.urlencoded({ extended: true }))
}
export const order = -200
