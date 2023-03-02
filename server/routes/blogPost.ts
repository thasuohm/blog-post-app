import express from 'express'
import { requireAuth } from '../config/middleware'
import jwtDecode from 'jwt-decode'
import user from '../models/user'
import { AuthTokenType } from '../types/token'

const router = express.Router()
