const chai   = require('chai');
const expect = chai.expect;

const restCursor = require('../http/RestCursor').restCursor;

describe('RestCursor', () => {

  it('It should return limit object', () => {
    const limitQuery = { limit: 5, sort: -1 };
    const fakeRequest = {
      query: limitQuery
    };

    const cursor = restCursor(fakeRequest).limit().get();

    delete limitQuery.sort;
    expect(cursor).to.be.eql(limitQuery);
  });

  describe('#projection', () => {

    it('It should returns sort object (with desc and asc query)', () => {
      const sortQuery = {
        sort: 'title,author,date',
        desc: 'title',
        asc: 'author,date'
      };
      const expectedCursor = { title: -1, author: 1, date: 1 };

      const fakeRequest = {
        query: sortQuery
      };

      const cursor = restCursor(fakeRequest).sort().get();

      expect(cursor).to.be.eql(expectedCursor);
    });

    it('It should returns sort object (with desc query)', () => {
      const sortQuery = {
        sort: 'title,author,date',
        desc: 'title,author,date',
      };
      const expectedCursor = { title: -1, author: -1, date: -1 };

      const fakeRequest = {
        query: sortQuery
      };

      const cursor = restCursor(fakeRequest).sort().get();

      expect(cursor).to.be.eql(expectedCursor);
    });

    it('It should return an empty Object without sort query', () => {
      const sortQuery = {
      };
      const expectedCursor = {};
      const fakeRequest = {
        query: sortQuery
      };

      const cursor = restCursor(fakeRequest).sort().get();

      expect(cursor).to.be.eql(expectedCursor);
    });

    it('It should throw an Error with same query fields asc and desc', () => {
      const sortQuery = {
        sort: 'title,author',
        desc: 'title',
        asc: 'author,title'
      };    
      
      const fakeRequest = {
        query: sortQuery
      };

      expect(() => 
        restCursor(fakeRequest).sort().get())
      .to.throw();
    });

    it('It should throw and Error with query asc without into sort', () => {
      const sortQuery = {
        sort: 'title',
        desc: 'title',
        asc: 'author'
      };

      const fakeRequest = {
        query: sortQuery
      };

      expect(() => 
        restCursor(fakeRequest).sort().get())
      .to.throw();

    });

  });

});
