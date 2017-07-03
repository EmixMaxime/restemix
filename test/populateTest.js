const chai   = require('chai')
const expect = chai.expect

const populateFactory = require('../http/populate/populate')
const { request: requestFactory } = require('fhttp')

const populate = populateFactory({ request: requestFactory() })

describe('populate', () => {

  it('It should returns populate Object with populate query into the given request', () => {
    const limitQuery = { populate: 'seasons.episodes' }
    const fakeRequest = { query: limitQuery }

    const p = populate(fakeRequest)()
    expect(p).to.be.eql(limitQuery)
  })

  it('It should returns an empty Object without populate query into the given request', () => {
    const fakeRequest = { query: {} }

    const p = populate(fakeRequest)()
    expect(p).to.be.eql({})
  })

  it('It should returns populate with select', () => {
    const fakeRequest = { query: { populate: 'seaons.episodes',includes: 'seaons.title' } }
  })

})
