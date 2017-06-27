const chai   = require('chai')
const expect = chai.expect
const projection = require('../http/filters/projection')
const BadRequestError = require('../http/BadRequestError')


describe('#projection', () => {

  it('It should returns an empty Object without includes | excludes query', () => {
    const fakeRequest = { query: {}}
    expect(projection(fakeRequest)).to.be.eql({})
  })

  it('It should throws an error with excludes and includes query', () => {
    const fakeRequest = {
      query: {
        includes: 'something',
        excludes: 'something',
      }
    }

    expect(() =>
      projection(fakeRequest))
    .to.throw(BadRequestError);

  })

  it('It should returns includes Object', () => {
    const fakeRequest = {
      query: {
        includes: 'title,author',
      }
    }

    const result = projection(fakeRequest);
    expect(result).to.eql({title: true, author: true})
  })

  it('It should returns excludes Object', () => {
    const fakeRequest = {
      query: {
        excludes: 'title,author',
      }
    }

    const result = projection(fakeRequest);
    expect(result).to.eql({title: false, author: false})
  })
})