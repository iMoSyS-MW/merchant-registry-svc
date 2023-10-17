/* eslint-disable max-len */

import request from 'supertest'
import { type Application } from 'express'
import { DefaultDFSPUsers } from '../../src/database/defaultUsers'
import { MerchantEntity } from '../../src/entity/MerchantEntity'
import { AppDataSource } from '../../src/database/dataSource'
import { NumberOfEmployees } from 'shared-lib'

export function testGetMerchantsSucceed (app: Application): void {
  // Arrange
  const dfspUserEmail = DefaultDFSPUsers[0].email
  const dfspUserPwd = DefaultDFSPUsers[0].password
  let token = ''
  const merchants: any = []

  beforeAll(async () => {
    let res = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: dfspUserEmail,
        password: dfspUserPwd
      })
    token = res.body.token

    res = await request(app)
      .post('/api/v1/merchants/draft')
      .set('Authorization', `Bearer ${token}`)
      .field('dba_trading_name', 'TestName')
      .field('registered_name', 'Some Registered Name')
      .field('employees_num', NumberOfEmployees.ONE_TO_FIVE)
      .field('monthly_turnover', 0.5)
      .field('currency_code', 'PHP')
      .field('category_code', '10410')
      .field('merchant_type', 'Individual')
      .field('payinto_alias', '000001')
      .field('license_number', '123456789')
    merchants.push(res.body.data)

    res = await request(app)
      .post('/api/v1/merchants/draft')
      .set('Authorization', `Bearer ${token}`)
      .field('dba_trading_name', 'TestName2')
      .field('registered_name', 'Some Registered Name 2')
      .field('employees_num', NumberOfEmployees.ONE_TO_FIVE)
      .field('monthly_turnover', 0.5)
      .field('currency_code', 'PHP')
      .field('category_code', '10410')
      .field('merchant_type', 'Individual')
      .field('payinto_alias', '000002')
      .field('license_number', '123456789')

    merchants.push(res.body.data)
    res = await request(app)
      .post('/api/v1/merchants/draft')
      .set('Authorization', `Bearer ${token}`)
      .field('dba_trading_name', 'Some Trading Name')
      .field('registered_name', 'Some Registered Name')
      .field('employees_num', NumberOfEmployees.SIX_TO_TEN)
      .field('monthly_turnover', 0.5)
      .field('currency_code', 'PHP')
      .field('category_code', '10410')
      .field('merchant_type', 'Individual')
      .field('payinto_alias', 'merchant1')
      .field('license_number', '123456789')

    merchants.push(res.body.data)
  })

  afterAll(async () => {
    // Clean Up
    await Promise.all(merchants.map(async (merchant: any) => {
      await AppDataSource.manager.delete(MerchantEntity, merchant.id)
    }))
  })

  it('should respond with 200 status with "OK" message with Valid "Authorization"', async () => {
    // Arrange
    // Act
    const res = await request(app)
      .get('/api/v1/merchants')
      .set('Authorization', `Bearer ${token}`)

    // Assert
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('OK')
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toBeInstanceOf(Array)
  })

  // Testing valid page and limit
  it('should fetch merchants with valid page and limit', async () => {
    const res = await request(app)
      .get('/api/v1/merchants?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toBeInstanceOf(Array)
    expect(res.body.data.length).toBeLessThan(3)
  })

  // Testing valid merchantId
  it('should fetch merchants by merchantId', async () => {
    const merchant1: any = merchants[0]
    const res = await request(app)
      .get(`/api/v1/merchants?merchantId=${merchant1.id as number}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].id).toEqual(merchant1.id)
  })

  // Testing valid dbaName
  it('should fetch merchants by dbaName', async () => {
    const res = await request(app)
      .get('/api/v1/merchants?dbaName=TestName')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
    expect(res.body.data[0].dba_trading_name).toContain('TestName')
  })

  // Testing valid registrationStatus
  it('should fetch merchants by registrationStatus', async () => {
    const res = await request(app)
      .get('/api/v1/merchants?registrationStatus=Draft')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toBeInstanceOf(Array)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
    expect(res.body.data[0].registration_status).toEqual('Draft')
  })

  // Add similar test cases for payintoId, addedBy, approvedBy, addedTime, updatedTime

  // Testing multiple valid queries
  it('should fetch merchants with multiple queries', async () => {
    const res = await request(app)
      .get('/api/v1/merchants?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toBeInstanceOf(Array)
    expect(res.body.data.length).toBeLessThanOrEqual(2)
  })

  // Testing invalid page and limit
  it('should return 400 for invalid page and limit', async () => {
    const res = await request(app)
      .get('/api/v1/merchants?page=-1&limit=0')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(400)
  })

  // Add more test cases for invalid queries and edge cases
}
